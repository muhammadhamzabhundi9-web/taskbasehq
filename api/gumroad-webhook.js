import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminReady = false;
let db, auth;

function initAdmin() {
  if (adminReady) return true;
  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
      });
    }
    db = getFirestore();
    auth = getAuth();
    adminReady = true;
    return true;
  } catch(e) {
    console.error('Admin init error:', e.message);
    return false;
  }
}

// Credits per plan
const PLAN_CREDITS = {
  pro: 500,
  proplus: 1500,
  promax: 5000,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { product_permalink, email, variants_and_quantity, sale_id } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email required' });

    console.log('WEBHOOK:', { permalink: product_permalink, email, sale_id });

    if (!initAdmin()) return res.status(500).json({ error: 'DB init failed' });

    // Find Firebase user by email
    let uid;
    try {
      const userRecord = await auth.getUserByEmail(email);
      uid = userRecord.uid;
    } catch(e) {
      console.log('User not found:', email, '— sending signup invite');
      // User bought without signup — send invite email
      try {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            service_id: 'service_8zans7l',
            template_id: 'template_a95p4nn',
            user_id: 'c5f49E_C8hbfbmXUE',
            template_params: {
              to_email: email,
              to_name: 'Customer',
              from_name: 'TaskBase HQ',
              reply_to: 'support@taskbasehq.com',
              subject: '🎉 Activate Your TaskBase HQ Subscription',
              message: 'Hi there!\n\nThanks for purchasing TaskBase HQ! 🎉\n\nTo activate your subscription, please:\n\n1. Sign up at: https://taskbasehq.com/login.html\n2. Use the SAME EMAIL: ' + email + '\n3. Your plan will activate automatically\n\nIf you signed up with a different email, please email us at support@taskbasehq.com with your order ID so we can manually link your account.\n\nQuestions? WhatsApp: +92 323 2108023\n\nThank you!\nTaskBase HQ Team'
            }
          })
        });
      } catch(emailErr) { console.log('Invite email error:', emailErr.message); }

      // Save pending purchase to Firestore for later activation
      try {
        await db.collection('pendingPurchases').doc(email.toLowerCase()).set({
          email,
          permalink: product_permalink,
          variants: variants_and_quantity,
          purchaseDate: new Date().toISOString(),
          status: 'awaiting_signup'
        });
      } catch(saveErr) { console.log('Pending save error:', saveErr.message); }

      return res.status(200).json({ message: 'User not found — invite sent', email });
    }

    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.exists ? userSnap.data() : {};
    const permalink = product_permalink || '';

    // ── CREDIT TOP-UP PACKS ───────────────────────────────────────────────
    if (permalink.includes('credits-100')) {
      await userRef.update({ credits: FieldValue.increment(100) });
      console.log('✅ +100 credits →', email);
      return res.status(200).json({ success: true, action: 'credits_100' });
    }
    if (permalink.includes('credits-500')) {
      await userRef.update({ credits: FieldValue.increment(500) });
      console.log('✅ +500 credits →', email);
      return res.status(200).json({ success: true, action: 'credits_500' });
    }
    if (permalink.includes('credits-1500')) {
      await userRef.update({ credits: FieldValue.increment(1500) });
      console.log('✅ +1500 credits →', email);
      return res.status(200).json({ success: true, action: 'credits_1500' });
    }

    // ── PLAN ACTIVATION HELPER ────────────────────────────────────────────
    async function activatePlan(planName) {
      const monthlyCredits = PLAN_CREDITS[planName];
      const currentCredits = userData.credits || 0;
      const currentPlan = userData.plan || 'free';
      const isRenewal = currentPlan === planName;

      let newCredits;
      if (isRenewal) {
        // RENEWAL: add credits on top of existing
        newCredits = FieldValue.increment(monthlyCredits);
        console.log(`✅ RENEWAL ${planName}: +${monthlyCredits} on top of ${currentCredits} →`, email);
      } else {
        // NEW subscription: set fresh credits
        newCredits = monthlyCredits;
        console.log(`✅ NEW ${planName}: ${monthlyCredits} credits →`, email);
      }

      await userRef.set({
        plan: planName,
        credits: newCredits,
        planUpdatedAt: new Date().toISOString(),
        lastRenewal: new Date().toISOString(),
      }, { merge: true });

      return isRenewal ? 'renewal' : 'new';
    }

    // ── YEARLY PLANS ──────────────────────────────────────────────────────
    if (permalink.includes('promax-yearly')) {
      const type = await activatePlan('promax');
      return res.status(200).json({ success: true, action: `promax_yearly_${type}` });
    }
    if (permalink.includes('proplus-yearly')) {
      const type = await activatePlan('proplus');
      return res.status(200).json({ success: true, action: `proplus_yearly_${type}` });
    }
    if (permalink.includes('pro-yearly')) {
      const type = await activatePlan('pro');
      return res.status(200).json({ success: true, action: `pro_yearly_${type}` });
    }

    // ── MONTHLY PLANS (main product) ──────────────────────────────────────
    if (permalink === 'taskbasehq') {
      const variantStr = JSON.stringify(variants_and_quantity || '').toLowerCase();

      let planName = 'pro';
      if (variantStr.includes('pro max') || variantStr.includes('promax')) planName = 'promax';
      else if (variantStr.includes('pro plus') || variantStr.includes('proplus')) planName = 'proplus';

      const type = await activatePlan(planName);
      return res.status(200).json({ success: true, action: `${planName}_monthly_${type}` });
    }

    console.log('Webhook received but no action:', permalink);
    return res.status(200).json({ message: 'No action', permalink });

  } catch(error) {
    console.error('Webhook error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
