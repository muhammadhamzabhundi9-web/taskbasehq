export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { prompt } = req.body || {};
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    // Increased to 30K chars to support file upload + AI edit feature
    if (prompt.length > 30000) {
      return res.status(400).json({ error: 'Input too long. Max 30,000 characters. Try uploading a smaller document.' });
    }
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    let GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
    let response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 8192
        }
      })
    });
    
    if (response.status === 404) {
      GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_KEY}`;
      response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8192
          }
        })
      });
    }
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Gemini API Error:', response.status, responseText);
      return res.status(500).json({ error: `AI error: ${response.status} - ${responseText.substring(0, 200)}` });
    }
    
    const data = JSON.parse(responseText);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Server Error:', error.message);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
