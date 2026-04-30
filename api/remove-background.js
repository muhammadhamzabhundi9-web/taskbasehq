export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { image, replacePrompt } = req.body;
  if (!image) return res.status(400).json({ error: 'Image required' });

  try {
    const buffer = Buffer.from(image, 'base64');

    // If replacePrompt provided, use replace-background endpoint
    if (replacePrompt) {
      const fd = new FormData();
      fd.append('subject_image', new Blob([buffer], { type: 'image/png' }));
      fd.append('background_prompt', replacePrompt);
      fd.append('output_format', 'png');

      const response = await fetch('https://api.stability.ai/v2beta/stable-image/edit/replace-background-and-relight', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`, 'Accept': 'image/*' },
        body: fd,
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(500).json({ error: 'Background replace failed: ' + errText.slice(0, 200) });
      }

      // This endpoint returns a generation ID, need to poll for result
      const result = await response.json();
      
      // For async, poll the result endpoint
      if (result.id) {
        let finalImage = null;
        for (let i = 0; i < 30; i++) {
          await new Promise(r => setTimeout(r, 2000));
          const pollRes = await fetch(`https://api.stability.ai/v2beta/results/${result.id}`, {
            headers: { 'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`, 'Accept': '*/*' },
          });
          if (pollRes.status === 200) {
            const pollBuffer = await pollRes.arrayBuffer();
            finalImage = Buffer.from(pollBuffer).toString('base64');
            break;
          }
          if (pollRes.status !== 202) {
            const errTxt = await pollRes.text();
            return res.status(500).json({ error: 'Poll failed: ' + errTxt.slice(0, 200) });
          }
        }
        if (finalImage) return res.status(200).json({ image: finalImage });
        return res.status(500).json({ error: 'Generation timeout — try again' });
      }

      return res.status(500).json({ error: 'Unexpected response' });
    }

    // Just remove background (no replacement)
    const fd = new FormData();
    fd.append('image', new Blob([buffer], { type: 'image/png' }));
    fd.append('output_format', 'png');

    const response = await fetch('https://api.stability.ai/v2beta/stable-image/edit/remove-background', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`, 'Accept': 'image/*' },
      body: fd,
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: 'Background removal failed: ' + errText.slice(0, 200) });
    }

    const resultBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(resultBuffer).toString('base64');
    return res.status(200).json({ image: base64 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
