// Helper to track API usage
let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  try {
    const { initializeApp, cert, getApps } = await import('firebase-admin/app');
    const { getFirestore, FieldValue } = await import('firebase-admin/firestore');
    
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    
    dbInstance = { db: getFirestore(), FieldValue };
    return dbInstance;
  } catch (e) {
    console.error('TRACKER INIT ERROR:', e.message);
    return null;
  }
}

const LIMITS = {
  stability: { max: 333, alert: 280 },
  elevenlabs: { max: 250, alert: 200 },
  gemini: { max: 1500, alert: 1300 },
};

export async function trackUsage(service) {
  console.log('TRACKER CALLED for:', service);
  try {
    const conn = await getDb();
    if (!conn) {
      console.error('TRACKER: DB connection failed');
      return null;
    }
    const { db, FieldValue } = conn;
    
    const ref = db.collection('admin').doc('apiUsage');
    const doc = await ref.get();
    const data = doc.exists ? doc.data() : {};
    const currentCount = (data[service + '_count'] || 0) + 1;
    
    await ref.set({
      [service + '_count']: FieldValue.increment(1),
      [service + '_last']: FieldValue.serverTimestamp(),
    }, { merge: true });
    
    console.log('TRACKER: Updated', service, 'to count', currentCount);
    
    const limit = LIMITS[service];
    if (limit && currentCount >= limit.alert) {
      const alertKey = service + '_alert_sent';
      const lastAlert = data[alertKey];
      const now = Date.now();
      if (!lastAlert || (now - lastAlert.toMillis()) > 24*60*60*1000) {
        await sendAlertEmail(service, currentCount, limit.max);
        await ref.set({ [alertKey]: FieldValue.serverTimestamp() }, { merge: true });
      }
    }
    return currentCount;
  } catch (e) {
    console.error('TRACKER ERROR:', e.message, e.stack);
    return null;
  }
}

async function sendAlertEmail(service, current, max) {
  const percentUsed = Math.round((current / max) * 100);
  const remaining = max - current;
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
          subject: `🚨 TaskBase HQ Alert: ${service} API at ${percentUsed}%`,
          message: `${service.toUpperCase()} API at ${percentUsed}%. Used: ${current}/${max}. Remaining: ${remaining}.`,
          to_name: 'Hamza',
          from_name: 'TaskBase HQ Admin',
        },
      }),
    });
  } catch (e) {
    console.error('ALERT EMAIL ERROR:', e.message);
  }
}
