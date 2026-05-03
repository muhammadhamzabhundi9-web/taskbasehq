import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

let dbReady = false;
let db;

function initDb() {
  if (dbReady) return true;
  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    db = getFirestore();
    dbReady = true;
    return true;
  } catch(e) {
    console.error('TRACKER INIT:', e.message);
    return false;
  }
}

// Limits per month
const LIMITS = {
  stability: { max: 333, alert: 280, name: 'Stability AI (Images)' },
  elevenlabs: { max: 250, alert: 200, name: 'ElevenLabs (Voice)' },
  gemini:     { max: 1500, alert: 1300, name: 'Gemini AI (Text/Vision)' },
};

export async function trackUsage(service) {
  console.log('TRACKER:', service);
  try {
    if (!initDb()) return null;

    const now = new Date();
    const monthKey = `${now.getFullYear()}_${String(now.getMonth()+1).padStart(2,'0')}`;
    const ref = db.collection('admin').doc('apiUsage');
    const snap = await ref.get();
    const data = snap.exists ? snap.data() : {};

    // Monthly counter key
    const countKey = `${service}_${monthKey}`;
    const currentCount = (data[countKey] || 0) + 1;

    // Update Firestore
    await ref.set({
      [countKey]: FieldValue.increment(1),
      [`${service}_last`]: FieldValue.serverTimestamp(),
      [`${service}_total`]: FieldValue.increment(1),
    }, { merge: true });

    console.log(`TRACKER: ${service} count this month: ${currentCount}`);

    // Check if alert needed
    const limit = LIMITS[service];
    if (limit && currentCount >= limit.alert) {
      const alertKey = `${service}_alert_${monthKey}`;
      const lastAlert = data[alertKey];
      const oneDayAgo = Date.now() - 24*60*60*1000;
      const shouldAlert = !lastAlert || lastAlert.toMillis() < oneDayAgo;

      if (shouldAlert) {
        await sendAlertEmail(service, currentCount, limit.max, limit.name, monthKey);
        await ref.set({ [alertKey]: FieldValue.serverTimestamp() }, { merge: true });
      }
    }
    return currentCount;
  } catch(e) {
    console.error('TRACKER ERROR:', e.message);
    return null;
  }
}

async function sendAlertEmail(service, current, max, name, month) {
  const pct = Math.round((current/max)*100);
  const remaining = max - current;
  const urgent = pct >= 95 ? '🚨 URGENT' : pct >= 85 ? '⚠️ WARNING' : '📊 INFO';

  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_8zans7l',
        template_id: 'template_a95p4nn',
        user_id: 'c5f49E_C8hbfbmXUE',
        template_params: {
          to_email: 'muhammadhamzabhundi9@gmail.com',
          to_name: 'Hamza',
          from_name: 'TaskBase HQ System',
          subject: `${urgent}: ${name} at ${pct}% — Month: ${month}`,
          message: `API USAGE ALERT\n\nService: ${name}\nMonth: ${month}\nUsed: ${current}/${max} (${pct}%)\nRemaining: ${remaining} calls\n\n${pct >= 95 ? 'CRITICAL: Upgrade API plan NOW to avoid downtime!' : pct >= 85 ? 'WARNING: Consider upgrading API plan soon.' : 'INFO: API usage is high.'}\n\nTaskBase HQ Admin System`,
        },
      }),
    });
    console.log(`ALERT EMAIL SENT for ${service} at ${pct}%`);
  } catch(e) {
    console.error('ALERT EMAIL ERROR:', e.message);
  }
}
