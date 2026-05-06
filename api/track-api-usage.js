export async function trackUsage(service) {
  console.log('TRACKER START:', service);
  try {
    const PROJECT_ID = 'taskbasehq';
    const API_KEY = 'AIzaSyCBEDDYCZsmHgyqkOpYQeOLqZ9v7eDMvf4';
    const now = new Date();
    const monthKey = `${service}_${now.getFullYear()}_${String(now.getMonth()+1).padStart(2,'0')}`;

    // Use Firestore transforms for atomic increment (no race condition)
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/admin/apiUsage?key=${API_KEY}`;

    const body = {
      fields: {
        [`${service}_last_updated`]: { stringValue: now.toISOString() },
      },
      // fieldTransforms for atomic increment
    };

    // Use commits endpoint for atomic transforms
    const commitUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:commit?key=${API_KEY}`;

    const commitBody = {
      writes: [{
        transform: {
          document: `projects/${PROJECT_ID}/databases/(default)/documents/admin/apiUsage`,
          fieldTransforms: [
            {
              fieldPath: monthKey,
              increment: { integerValue: "1" }
            },
            {
              fieldPath: `${service}_total`,
              increment: { integerValue: "1" }
            }
          ]
        }
      }, {
        update: {
          name: `projects/${PROJECT_ID}/databases/(default)/documents/admin/apiUsage`,
          fields: {
            [`${service}_last_updated`]: { stringValue: now.toISOString() }
          }
        },
        updateMask: { fieldPaths: [`${service}_last_updated`] }
      }]
    };

    const res = await fetch(commitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commitBody)
    });

    if (res.ok) {
      console.log(`TRACKER SUCCESS: ${service} ${monthKey} incremented`);
    } else {
      const err = await res.text();
      console.error('TRACKER COMMIT FAILED:', res.status, err.substring(0, 300));
    }

    // Check limits for alert
    const LIMITS = {
      stability: { max: 333, alert: 280 },
      elevenlabs: { max: 250, alert: 200 },
      gemini: { max: 1500, alert: 1300 },
    };

    // Get current count to check alert
    const limit = LIMITS[service];
    if (limit) {
      try {
        const getRes = await fetch(url);
        if (getRes.ok) {
          const data = await getRes.json();
          const count = parseInt(data.fields?.[monthKey]?.integerValue || 0);
          console.log(`TRACKER COUNT: ${monthKey} = ${count}`);
          if (count >= limit.alert) {
            await sendAlert(service, count, limit.max, monthKey);
          }
        }
      } catch(e) { /* alert check failed, non-critical */ }
    }

    return true;
  } catch(e) {
    console.error('TRACKER ERROR:', e.message);
    return null;
  }
}

async function sendAlert(service, current, max, monthKey) {
  const pct = Math.round((current/max)*100);
  const names = { stability:'Stability AI (Images)', elevenlabs:'ElevenLabs (Voice)', gemini:'Gemini AI (Text/Vision)' };
  const level = pct>=95?'🚨 URGENT':pct>=85?'⚠️ WARNING':'📊 INFO';
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
          reply_to: 'noreply@taskbasehq.com',
          subject: `${level}: ${names[service]} at ${pct}% — Action Required`,
          message: `API USAGE ALERT\n\nService: ${names[service]}\nPeriod: ${monthKey}\nUsed: ${current}/${max} (${pct}%)\nRemaining: ${max-current}\n\n${pct>=95?'CRITICAL: Upgrade NOW to avoid service disruption!':pct>=85?'WARNING: Upgrade API plan soon.':'INFO: Usage getting high — monitor closely.'}\n\nTaskBase HQ Admin System\ntaskbasehq.com`
        }
      })
    });
    console.log(`ALERT SENT: ${service} at ${pct}%`);
  } catch(e) {
    console.error('ALERT ERROR:', e.message);
  }
}
