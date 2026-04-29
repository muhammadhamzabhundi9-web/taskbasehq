export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text required' });
  }

  if (text.length > 500) {
    return res.status(400).json({ error: 'Text too long (max 500 chars per generation)' });
  }

  try {
    // ElevenLabs default voice: Rachel (21m00Tcm4TlvDq8ikWAM)
    const voiceId = req.body.voiceId || '21m00Tcm4TlvDq8ikWAM';
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: 'Voice generation failed: ' + errText.slice(0, 200) });
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return res.status(200).json({ audio: base64 });
  } catch (error) {
    console.error('Voice error:', error);
    return res.status(500).json({ error: error.message });
  }
}
