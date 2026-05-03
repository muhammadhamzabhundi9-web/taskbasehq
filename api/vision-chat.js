import { trackUsage } from './track-api-usage.js';
export const config = { api: { bodyParser: { sizeLimit: '30mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, files } = req.body || {};
    if (!messages || !messages.length) return res.status(400).json({ error: 'Messages required' });

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured' });

    // Build contents - attach files to first user message
    const contents = messages.map((msg, idx) => {
      const parts = [];

      if (idx === 0 && files && files.length > 0) {
        files.forEach(file => {
          if (!file.data) return;
          if (file.type.startsWith('image/')) {
            parts.push({ inlineData: { mimeType: file.type, data: file.data } });
          } else if (file.type === 'application/pdf') {
            parts.push({ inlineData: { mimeType: 'application/pdf', data: file.data } });
          } else {
            // Text-based files: decode and inject as text
            try {
              const decoded = Buffer.from(file.data, 'base64').toString('utf-8');
              parts.push({ text: `[File: ${file.name}]\n${decoded.slice(0, 15000)}\n---\n` });
            } catch(e) {
              parts.push({ text: `[File: ${file.name} — could not read]` });
            }
          }
        });
      }

      parts.push({ text: msg.content });
      return { role: msg.role === 'assistant' ? 'model' : 'user', parts };
    });

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: `You are TaskBase AI — a world-class AI assistant like ChatGPT but more powerful.

CORE ABILITIES:
- Analyze any image: photos, rooms, interiors, designs, charts, screenshots, documents
- Read PDFs, Word docs, Excel files, CSVs — understand and extract insights
- Create files: Excel tables, CSV data, HTML pages, code in any language, JSON, markdown
- Edit uploaded documents: improve, reformat, translate, summarize
- Answer in ANY language the user writes in — automatically detect and match

INTERIOR DESIGN & VISUALIZATION:
When user uploads a room/space photo:
- Describe exactly what you see (dimensions estimate, current colors, furniture, lighting)
- Provide specific, actionable design recommendations
- For media walls: exact TV size for room, wall color suggestions, shelf placement, lighting type, material recommendations
- For any redesign: describe the before and after vividly, give step-by-step implementation
- Suggest budget ranges (budget/mid-range/premium options)
- Name specific products or styles when helpful

FILE CREATION (CRITICAL — follow format exactly):
When user asks to create a file, spreadsheet, table, code, or any downloadable content:
1. Explain what you're creating (1-2 sentences)
2. Then add this block at the END:

[GENERATE_FILE:xlsx:descriptive-filename]
Column1,Column2,Column3
value1,value2,value3
value4,value5,value6
[/GENERATE_FILE]

Supported extensions: xlsx, csv, txt, html, js, py, json, md, css

LANGUAGE: ALWAYS respond in the EXACT same language the user writes in.
- Urdu/Roman Urdu → respond in Roman Urdu
- Arabic → Arabic
- French → French
- etc.

Be specific, helpful, and actionable. Never give vague answers.` }]
        },
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
      })
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error('Gemini Error:', response.status, responseText.substring(0, 300));
      if (response.status === 503) return res.status(503).json({ error: 'AI busy. Please try again in 30 seconds.' });
      if (response.status === 429) return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
      return res.status(500).json({ error: `AI error: ${response.status}` });
    }

    const data = JSON.parse(responseText);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    trackUsage('gemini').catch(e => console.error('Track:', e));
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Vision Chat Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
