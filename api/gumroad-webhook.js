export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { seller_id, product_permalink, email, variants_and_quantity } = req.body || {};

    if (!email) return res.status(400).json({ error: 'Email required' });

    const { initializeApp, cert } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');
    const { getAuth } = await import('firebase-admin/auth');

    // Initialize Firebase Admin
    let app;
    try {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
      }, 'gumroad-webhook-' + Date.now());
    } catch(e) {
      const { getApps } = await import('firebase-admin/app');
      app = getApps()[0];
    }

    const db = getFirestore(app);
    const auth = getAuth(app);

    // Find user by email
    let uid;
    try {
      const userRecord = await auth.getUserByEmail(email);
      uid = userRecord.uid;
    } catch(e) {
      console.log('User not found for email:', email);
      return res.status(200).json({ message: 'User not found — purchase recorded' });
    }

    const userRef = db.collection('users').doc(uid);
    const permalink = product_permalink || '';

    // ── CREDIT PACKS ────────────────────────────────────────────────────────
    if (permalink.includes('credits-100')) {
      await userRef.update({ credits: require('firebase-admin/firestore').FieldValue.increment(100) });
      console.log('Added 100 credits to:', email);
      return res.status(200).json({ success: true, action: 'credits_100' });
    }

    if (permalink.includes('credits-500')) {
      await userRef.update({ credits: require('firebase-admin/firestore').FieldValue.increment(500) });
      console.log('Added 500 credits to:', email);
      return res.status(200).json({ success: true, action: 'credits_500' });
    }

    if (permalink.includes('credits-1500')) {
      await userRef.update({ credits: require('firebase-admin/firestore').FieldValue.increment(1500) });
      console.log('Added 1500 credits to:', email);
      return res.status(200).json({ success: true, action: 'credits_1500' });
    }

    // ── PRO MAX YEARLY ───────────────────────────────────────────────────────
    if (permalink.includes('promax-yearly')) {
      await userRef.set({ plan: 'promax', credits: 5000, planUpdatedAt: new Date().toISOString() }, { merge: true });
      console.log('Pro Max Yearly activated for:', email);
      return res.status(200).json({ success: true, action: 'promax_yearly' });
    }

    // ── PRO PLUS YEARLY ──────────────────────────────────────────────────────
    if (permalink.includes('proplus-yearly')) {
      await userRef.set({ plan: 'proplus', credits: 1500, planUpdatedAt: new Date().toISOString() }, { merge: true });
      console.log('Pro Plus Yearly activated for:', email);
      return res.status(200).json({ success: true, action: 'proplus_yearly' });
    }

    // ── PRO YEARLY ───────────────────────────────────────────────────────────
    if (permalink.includes('pro-yearly')) {
      await userRef.set({ plan: 'pro', credits: 500, planUpdatedAt: new Date().toISOString() }, { merge: true });
      console.log('Pro Yearly activated for:', email);
      return res.status(200).json({ success: true, action: 'pro_yearly' });
    }

    // ── MAIN PRODUCT (Monthly tiers — check variant) ─────────────────────────
    if (permalink === 'taskbasehq') {
      const variantStr = JSON.stringify(variants_and_quantity || '').toLowerCase();

      if (variantStr.includes('pro max') || variantStr.includes('promax')) {
        await userRef.set({ plan: 'promax', credits: 5000, planUpdatedAt: new Date().toISOString() }, { merge: true });
        console.log('Pro Max Monthly activated for:', email);
        return res.status(200).json({ success: true, action: 'promax_monthly' });
      }

      if (variantStr.includes('pro plus') || variantStr.includes('proplus')) {
        await userRef.set({ plan: 'proplus', credits: 1500, planUpdatedAt: new Date().toISOString() }, { merge: true });
        console.log('Pro Plus Monthly activated for:', email);
        return res.status(200).json({ success: true, action: 'proplus_monthly' });
      }

      // Default Pro Monthly
      await userRef.set({ plan: 'pro', credits: 500, planUpdatedAt: new Date().toISOString() }, { merge: true });
      console.log('Pro Monthly activated for:', email);
      return res.status(200).json({ success: true, action: 'pro_monthly' });
    }

    return res.status(200).json({ message: 'Webhook received — no action taken', permalink });

  } catch (error) {
    console.error('Webhook error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
