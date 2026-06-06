/**
 * Run: node scripts/check-gemini-billing.mjs
 * Diagnoses whether your GEMINI_API_KEY can generate images (paid tier).
 */
import 'dotenv/config';

const key = process.env.GEMINI_API_KEY || '';
const imageModel = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';

console.log('GEMINI_API_KEY:', key ? `${key.slice(0, 10)}…` : 'MISSING');
console.log('Image model:', imageModel);
console.log('');

if (!key) {
  console.error('Set GEMINI_API_KEY in .env first.');
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/${imageModel}:generateContent?key=${key}`;
const r = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'small white circle' }] }],
    generationConfig: { responseModalities: ['IMAGE'] }
  })
});

const text = await r.text();
const hasImage = text.includes('inlineData') || text.includes('inline_data');

console.log('HTTP', r.status, hasImage ? '✓ image returned' : '✗ no image');

if (r.ok && hasImage) {
  console.log('\n✓ Billing looks OK — AI before/after should work on the site.');
  process.exit(0);
}

if (/free_tier/i.test(text) && /limit:\s*0/i.test(text)) {
  console.log('\n✗ Still on FREE tier (limit: 0) for image models.');
  console.log('\nFix (do all steps on the SAME Google account):');
  console.log('  1. Open https://aistudio.google.com/');
  console.log('  2. Settings (gear) → Plan & billing → Enable Pay-as-you-go');
  console.log('  3. Link a billing account to THIS project (not a different GCP project)');
  console.log('  4. API keys → Create API key → paste new key in .env');
  console.log('  5. Wait 10–30 min, run this script again');
  console.log('  6. npm run build && npm start');
  process.exit(1);
}

console.log('\nResponse snippet:', text.slice(0, 400));
process.exit(1);
