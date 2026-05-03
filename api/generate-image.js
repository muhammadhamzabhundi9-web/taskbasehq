import { trackUsage } from './track-api-usage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, plan } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }

  // Different quality tiers based on plan
  // Pro: core (standard) | Pro Plus: sd3.5 (HD) | Pro Max: ultra (4K)
  let endpoint, qualityLabel;
  if (plan === 'promax') {
    endpoint = 'https://api.stability.ai/v2beta/stable-image/generate/ultra';
    qualityLabel = '4K Ultra';
  } else if (plan === 'proplus') {
    endpoint = 'https://api.stability.ai/v2beta/stable-image/generate/sd3';
    qualityLabel = 'HD';
  } else {
    endpoint = 'https://api.stability.ai/v2beta/stable-image/generate/core';
    qualityLabel = 'Standard';
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Accept': 'image/*',
      },
      body: (() => {
        const fd = new FormData();
        fd.append('prompt', prompt);
        fd.append('output_format', 'png');
        fd.append('aspect_ratio', '1:1');
        if (plan === 'proplus') fd.append('model', 'sd3.5-large');
        return fd;
      })(),
    });

    if (!response.ok) {
      const errText = await response.text();
      // Fallback to core if higher tier fails
      if (plan === 'promax' || plan === 'proplus') {
        const fallback = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
            'Accept': 'image/*',
          },
          body: (() => {
            const fd = new FormData();
            fd.append('prompt', prompt);
            fd.append('output_format', 'png');
            fd.append('aspect_ratio', '1:1');
            return fd;
          })(),
        });
        if (fallback.ok) {
          const buffer = await fallback.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          trackUsage('stability').catch(e => console.error('Track:', e));
          return res.status(200).json({ image: base64, quality: 'Standard (fallback)' });
        }
      }
      return res.status(500).json({ error: 'Image generation failed: ' + errText.slice(0, 200) });
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    trackUsage('stability').catch(e => console.error('Track:', e));
    return res.status(200).json({ image: base64, quality: qualityLabel });
  } catch (error) {
    console.error('Image error:', error);
    return res.status(500).json({ error: error.message });
  }
}
