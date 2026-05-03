import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

let dbReady = false;
let db;

function initDb() {
  if (dbReady) return true;
  try {
    // Check if env vars exist
    if (!process.env.FIREBASE_PROJECT_ID) {
      console.error('TRACKER FAIL: FIREBASE_PROJECT_ID missing');
      return false;
    }
    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      console.error('TRACKER FAIL: FIREBASE_CLIENT_EMAIL missing');
      return false;
    }
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      console.error('TRACKER FAIL: FIREBASE_PRIVATE_KEY missing');
      return false;
    }

    console.log('TRACKER: env vars OK, initializing Firebase Admin...');
    console.log('TRACKER: project_id =', process.env.FIREBASE_PROJECT_ID);
    console.log('TRACKER: client_email =', process.env.FIREBASE_CLIENT_EMAIL);
    console.log('TRACKER: private_key length =', process.env.FIREBASE_PRIVATE_KEY.length);
    console.log('TRACKER: private_key first 30 chars =', process.env.FIREBASE_PRIVATE_KEY.substring(0, 30));

    if (!getApps().length) {
      // Try multiple newline replacement strategies
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      // Replace literal \n with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
      // If still no newlines, the key might be raw
      if (!privateKey.includes('\n')) {
        console.log('TRACKER: WARNING - private key has no newlines after replacement');
      }

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('TRACKER: Firebase Admin initialized!');
    } else {
      console.log('TRACKER: Firebase Admin already initialized');
    }
    db = getFirestore();
    dbReady = true;
    console.log('TRACKER: Firestore ready');
    return true;
  } catch(e) {
    console.error('TRACKER INIT ERROR:', e.message);
    console.error('TRACKER INIT STACK:', e.stack);
    return false;
  }
}

const LIMITS = {
  stability: { max: 333, alert: 280, name: 'Stability AI (Images)' },
  elevenlabs: { max: 250, alert: 200, name: 'ElevenLabs (Voice)' },
  gemini:     { max: 1500, alert: 1300, name: 'Gemini AI (Text/Vision)' },
};

export async function trackUsage(service) {
  console.log('TRACKER START:', service);
  try {
    if (!initDb()) {
      console.error('TRACKER: initDb returned false, skipping update');
      return null;
    }

    const now = new Date();
    const monthKey = `${now.getFullYear()}_${String(now.getMonth()+1).padStart(2,'0')}`;
    const ref = db.collection('admin').doc('apiUsage');

    console.log('TRACKER: Reading current usage...');
    const snap = await ref.get();
    const data = snap.exists ? snap.data() : {};
    const countKey = `${service}_${monthKey}`;
    const currentCount = (data[countKey] || 0) + 1;

    console.log(`TRACKER: Updating ${countKey} from ${data[countKey] || 0} to ${currentCount}`);

    await ref.set({
      [countKey]: FieldValue.increment(1),
      [`${service}_last`]: FieldValue.serverTimestamp(),
      [`${service}_total`]: FieldValue.increment(1),
    }, { merge: true });

    console.log(`TRACKER SUCCESS: ${service} count = ${currentCount}`);

    const limit = LIMITS[service];
    if (limit && currentCount >= limit.alert) {
      const alertKey = `${service}_alert_${monthKey}`;
      const lastAlert = data[alertKey];
      const oneDayAgo = Date.now() - 24*60*60*1000;
      const shouldAlert = !lastAlert || (lastAlert.toMillis && lastAlert.toMillis() < oneDayAgo);

      if (shouldAlert) {
        await sendAlertEmail(service, currentCount, limit.max, limit.name, monthKey);
        await ref.set({ [alertKey]: FieldValue.serverTimestamp() }, { merge: true });
      }
    }
    return currentCount;
  } catch(e) {
    console.error('TRACKER WRITE ERROR:', e.message);
    console.error('TRACKER WRITE STACK:', e.stack);
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
          message: `API USAGE ALERT\n\nService: ${name}\nMonth: ${month}\nUsed: ${current}/${max} (${pct}%)\nRemaining: ${remaining} calls\n\n${pct >= 95 ? 'CRITICAL: Upgrade API plan NOW!' : pct >= 85 ? 'WARNING: Consider upgrading.' : 'INFO: Usage high.'}\n\nTaskBase HQ Admin`,
        },
      }),
    });
    console.log(`ALERT EMAIL SENT for ${service} at ${pct}%`);
  } catch(e) {
    console.error('ALERT EMAIL ERROR:', e.message);
  }
}
