import 'dotenv/config';

const key = process.env.GEMINI_API_KEY || '';
console.log('GEMINI_API_KEY loaded:', key ? `yes (${key.slice(0, 8)}...)` : 'NO');

const models = [
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-image-preview',
  'gemini-3-pro-image-preview',
  'gemini-2.5-flash'
];

for (const m of models) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`;
  const isImage = m.includes('image') || m.includes('exp');
  const body = isImage
    ? {
        contents: [{ parts: [{ text: 'Draw a simple green circle on white background' }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
      }
    : { contents: [{ parts: [{ text: 'Say OK' }] }] };

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await r.text();
    const hasImage = text.includes('inlineData') || text.includes('inline_data');
    console.log(`${m}: HTTP ${r.status} image=${hasImage} ${text.slice(0, 150).replace(/\s+/g, ' ')}`);
  } catch (e) {
    console.log(`${m}: ERROR`, e.message);
  }
}
