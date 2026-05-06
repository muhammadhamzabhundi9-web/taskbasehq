// track-api-usage.js - Uses Firestore REST API (no Admin SDK needed)
// Works with FIREBASE_API_KEY instead of service account

export async function trackUsage(service) {
  console.log('TRACKER START:', service);
  try {
    const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'taskbasehq';
    const API_KEY = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyCBEDDYCZsmHgyqkOpYQeOLqZ9v7eDMvf4';

    const now = new Date();
    const monthKey = `${now.getFullYear()}_${String(now.getMonth()+1).padStart(2,'0')}`;
    const countKey = `${service}_${monthKey}`;
    const totalKey = `${service}_total`;

    // Firestore REST API URL
    const docUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/admin/apiUsage?key=${API_KEY}`;

    // First GET current values
    let currentCount = 0;
    try {
      const getRes = await fetch(docUrl);
      if (getRes.ok) {
        const data = await getRes.json();
        const fields = data.fields || {};
        currentCount = parseInt(fields[countKey]?.integerValue || 0);
      }
    } catch(e) {
      console.log('TRACKER: GET failed (first time):', e.message);
    }

    currentCount += 1;

    // PATCH to update — use merge to avoid overwriting
    const patchUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/admin/apiUsage?key=${API_KEY}&updateMask.fieldPaths=${countKey}&updateMask.fieldPaths=${totalKey}&updateMask.fieldPaths=${service}_last_updated`;

    const patchRes = await fetch(patchUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          [countKey]: { integerValue: String(currentCount) },
          [totalKey]: { integerValue: String(currentCount) },
          [`${service}_last_updated`]: { stringValue: now.toISOString() },
        }
      })
    });

    if (patchRes.ok) {
      console.log(`TRACKER SUCCESS: ${service} ${countKey} = ${currentCount}`);
    } else {
      const err = await patchRes.text();
      console.error('TRACKER PATCH FAILED:', patchRes.status, err.substring(0, 200));

      // If permission denied, try with service account approach
      if (patchRes.status === 403) {
        console.log('TRACKER: Firestore rules blocking write - check rules');
      }
    }

    // Check alert threshold
    const LIMITS = {
      stability: { max: 333, alert: 280 },
      elevenlabs: { max: 250, alert: 200 },
      gemini: { max: 1500, alert: 1300 },
    };

    const limit = LIMITS[service];
    if (limit && currentCount >= limit.alert) {
      console.log(`TRACKER ALERT: ${service} at ${currentCount}/${limit.max}`);
      await sendAlert(service, currentCount, limit.max, monthKey);
    }

    return currentCount;
  } catch(e) {
    console.error('TRACKER ERROR:', e.message);
    return null;
  }
}

async function sendAlert(service, current, max, month) {
  const pct = Math.round((current/max)*100);
  const names = { stability: 'Stability AI', elevenlabs: 'ElevenLabs', gemini: 'Gemini AI' };
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
          subject: `⚠️ ${names[service]} at ${pct}% — Upgrade API Plan`,
          message: `API Usage Alert!\n\nService: ${names[service]}\nMonth: ${month}\nUsed: ${current}/${max} (${pct}%)\nRemaining: ${max-current}\n\nPlease upgrade your API plan soon.\n\nTaskBase HQ Admin System`
        }
      })
    });
    console.log(`ALERT SENT: ${service} at ${pct}%`);
  } catch(e) {
    console.error('ALERT EMAIL ERROR:', e.message);
  }
}
