export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

import { trackUsage } from './track-api-usage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { image, prompt } = req.body;
  if (!image) return res.status(400).json({ error: 'Image required' });

  try {
    const buffer = Buffer.from(image, 'base64');
    const fd = new FormData();
    fd.append('image', new Blob([buffer], { type: 'image/png' }));
    fd.append('prompt', prompt || 'high quality, detailed, sharp');
    fd.append('output_format', 'png');

    const response = await fetch('https://api.stability.ai/v2beta/stable-image/upscale/conservative', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`, 'Accept': 'image/*' },
      body: fd,
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: 'Upscale failed: ' + errText.slice(0, 200) });
    }

    const resultBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(resultBuffer).toString('base64');
    trackUsage('stability').catch(e => console.error('Track:', e));
    return res.status(200).json({ image: base64 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
