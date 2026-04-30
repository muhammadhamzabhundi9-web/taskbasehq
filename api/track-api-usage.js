// Helper to track API usage and send alerts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

// Threshold limits (alert when reached)
const LIMITS = {
  stability: { max: 333, alert: 280 },  // 1000 credits / 3 per image = 333 images
  elevenlabs: { max: 250, alert: 200 }, // 30K chars / 120 chars avg = 250 voices
  gemini: { max: 1500, alert: 1300 },   // free tier estimate
};

export async function trackUsage(service) {
  try {
    const ref = db.collection('admin').doc('apiUsage');
    const doc = await ref.get();
    const data = doc.exists ? doc.data() : {};
    const currentCount = (data[service + '_count'] || 0) + 1;
    
    await ref.set({
      [service + '_count']: FieldValue.increment(1),
      [service + '_last']: FieldValue.serverTimestamp(),
    }, { merge: true });
    
    // Check if alert threshold hit
    const limit = LIMITS[service];
    if (limit && currentCount >= limit.alert) {
      const alertKey = service + '_alert_sent';
      const lastAlert = data[alertKey];
      const now = Date.now();
      // Send alert max once per 24 hours
      if (!lastAlert || (now - lastAlert.toMillis()) > 24*60*60*1000) {
        await sendAlertEmail(service, currentCount, limit.max);
        await ref.set({ [alertKey]: FieldValue.serverTimestamp() }, { merge: true });
      }
    }
    return currentCount;
  } catch(e) {
    console.error('Track usage error:', e);
    return null;
  }
}

async function sendAlertEmail(service, current, max) {
  const percentUsed = Math.round((current / max) * 100);
  const remaining = max - current;
  // Use EmailJS REST API
  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_8zans7l',
        template_id: process.env.EMAILJS_ADMIN_TEMPLATE || 'template_a95p4nn',
        user_id: 'c5f49E_C8hbfbmXUE',
        template_params: {
          to_email: 'muhammadhamzabhundi9@gmail.com',
          subject: `🚨 TaskBase HQ Alert: ${service} API at ${percentUsed}%`,
          message: `Your ${service.toUpperCase()} API usage is at ${percentUsed}%. Used: ${current}/${max}. Remaining: ${remaining}. Top up soon to avoid service interruption.`,
          to_name: 'Hamza',
          from_name: 'TaskBase HQ Admin',
        },
      }),
    });
  } catch(e) {
    console.error('Alert email error:', e);
  }
}
