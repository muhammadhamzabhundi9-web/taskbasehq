export const config = { api: { bodyParser: { sizeLimit: '20mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, fileData, fileType, fileName } = req.body || {};
    if (!messages || !messages.length) return res.status(400).json({ error: 'Messages required' });

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured' });

    // Build Gemini contents from conversation history
    const contents = messages.map((msg, idx) => {
      const parts = [];

      // Attach file only to first user message
      if (idx === 0 && fileData && fileType) {
        if (fileType.startsWith('image/')) {
          parts.push({ inlineData: { mimeType: fileType, data: fileData } });
        } else if (fileType === 'application/pdf') {
          parts.push({ inlineData: { mimeType: 'application/pdf', data: fileData } });
        } else {
          // text/plain, csv, etc — send as text prefix
          parts.push({ text: `[Uploaded file: ${fileName}]\n\n${atob(fileData)}\n\n---\n` });
        }
      }

      parts.push({ text: msg.content });

      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts
      };
    });

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{
            text: `You are TaskBase AI — a powerful all-in-one AI assistant. You can:
- Analyze uploaded images, PDFs, Excel files, and documents
- Create Excel/CSV data, formatted documents, code, HTML, and more
- Answer questions in any language the user writes in
- Generate structured data that can be downloaded

When a user asks you to CREATE a file (Excel, CSV, table, document, code, etc):
1. Generate the complete content
2. At the END of your response, add a special marker in this EXACT format:
   [GENERATE_FILE:xlsx:filename]
   content line 1
   content line 2
   [/GENERATE_FILE]
   
   For CSV/Excel data, use comma-separated values.
   For code files, use the actual code.
   For documents, use markdown.

File type markers: xlsx, csv, txt, html, js, py, json, md

Be helpful, intelligent, and respond in the SAME LANGUAGE the user writes in.`
          }]
        },
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
      })
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error('Gemini Vision Error:', response.status, responseText.substring(0, 300));
      if (response.status === 503) return res.status(503).json({ error: 'AI server is busy. Please try again in 30 seconds.' });
      return res.status(500).json({ error: `AI error: ${response.status}` });
    }

    const data = JSON.parse(responseText);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Vision Chat Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
