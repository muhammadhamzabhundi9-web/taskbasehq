import { trackUsage } from './track-api-usage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  if (text.length > 500) return res.status(400).json({ error: 'Text too long (max 500 chars)' });

  // Check API key - try both possible env var names
  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABS_KEY;
  console.log('ElevenLabs key exists:', !!apiKey, 'length:', apiKey?.length || 0);

  if (!apiKey) {
    console.error('ElevenLabs API key missing - check env vars');
    return res.status(500).json({ error: 'Voice service not configured' });
  }

  try {
    const voiceId = req.body.voiceId || '21m00Tcm4TlvDq8ikWAM';

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('ElevenLabs error:', response.status, errText.substring(0, 200));
      return res.status(500).json({ error: 'Voice generation failed: ' + errText.slice(0, 200) });
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Track usage - await to ensure it completes
    trackUsage('elevenlabs').catch(e => console.error('Track error:', e));
    console.log('Voice generated successfully, tracking elevenlabs');

    return res.status(200).json({ audio: base64 });
  } catch (error) {
    console.error('Voice error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
