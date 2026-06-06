/**
 * Fix mojibake: files had UTF-8 bytes read as Windows-1252, then re-saved as UTF-8.
 * This script reverses that: chars → Win-1252 bytes → UTF-8 decode.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Windows-1252 chars in 0x80–0x9F range that differ from Latin-1
const win1252 = new Map([
  ['€', 0x80], ['‚', 0x82], ['ƒ', 0x83], ['„', 0x84],
  ['…', 0x85], ['†', 0x86], ['‡', 0x87], ['ˆ', 0x88],
  ['‰', 0x89], ['Š', 0x8A], ['‹', 0x8B], ['Œ', 0x8C],
  ['Ž', 0x8E], ['‘', 0x91], ['’', 0x92], ['“', 0x93],
  ['”', 0x94], ['•', 0x95], ['–', 0x96], ['—', 0x97],
  ['˜', 0x98], ['™', 0x99], ['š', 0x9A], ['›', 0x9B],
  ['œ', 0x9C], ['ž', 0x9E], ['Ÿ', 0x9F],
]);

function hasMojibake(content) {
  // Quick check: does it contain Windows-1252 special chars that shouldn't be in source code?
  for (const ch of win1252.keys()) {
    if (content.includes(ch)) return true;
  }
  // Also check for Latin extended chars common in mojibake (ð Å Ã etc.)
  return /[\xC0-\xFF]/.test(content);
}

function fixMojibake(content) {
  const result = [];
  const chars = [...content]; // iterate by Unicode code point

  for (const ch of chars) {
    const code = ch.codePointAt(0);
    if (win1252.has(ch)) {
      // Win-1252 special char → original byte
      result.push(win1252.get(ch));
    } else if (code <= 0xFF) {
      // Latin-1 / direct byte
      result.push(code);
    } else {
      // Genuine Unicode char (shouldn't appear in mojibaked content, keep as-is)
      const buf = Buffer.from(ch, 'utf8');
      for (const b of buf) result.push(b);
    }
  }

  return Buffer.from(result).toString('utf8');
}

const files = [
  'src/App.jsx',
  'src/components/AdminBlogPanel.jsx',
  'src/components/Chatbot.jsx',
  'src/components/CountUp.jsx',
  'src/components/Doctors.jsx',
  'src/components/FloatingWhatsApp.jsx',
  'src/components/Footer.jsx',
  'src/components/ImageUpload.jsx',
  'src/components/ImplantsFAQ.jsx',
  'src/components/LeadPopup.jsx',
  'src/components/Preloader.jsx',
  'src/components/ScrollReveal.jsx',
  'src/components/SEO.jsx',
  'src/components/SeoServicePage.jsx',
  'src/components/ServicePage.jsx',
  'src/components/SmilePlusHomePromo.jsx',
  'src/components/SmilePlusSpecialistTeam.jsx',
  'src/constants/contact.js',
  'src/constants/smilePlusAssets.js',
  'src/contexts/LanguageContext.jsx',
  'src/contexts/locales/ar.js',
  'src/contexts/locales/hi.js',
  'src/contexts/locales/kn.js',
  'src/data/dentalImplantsFaqCategories.js',
  'src/data/doctors.js',
  'src/data/seoServiceContent.js',
  'src/data/smilePlusMarathahalli.js',
  'src/pages/Admin.jsx',
  'src/pages/AlignersBraces.jsx',
  'src/pages/Assessment.jsx',
  'src/pages/Blog.jsx',
  'src/pages/BlogPost.jsx',
  'src/pages/BookingPage.jsx',
  'src/pages/DentalImplants.jsx',
  'src/pages/FAQ.jsx',
  'src/pages/Home.jsx',
  'src/pages/Results.jsx',
  'src/pages/SmileDesigning.jsx',
  'src/pages/SmilePlusMarathahalli.jsx',
];

let fixed = 0;
let skipped = 0;
let errors = 0;

for (const rel of files) {
  const file = path.join(root, rel);
  try {
    const original = fs.readFileSync(file, 'utf8');
    if (!hasMojibake(original)) {
      skipped++;
      continue;
    }
    const repaired = fixMojibake(original);
    if (repaired === original) {
      skipped++;
      continue;
    }
    fs.writeFileSync(file, repaired, 'utf8');
    console.log(`✅ Fixed: ${rel}`);
    fixed++;
  } catch (e) {
    console.error(`❌ Error in ${rel}:`, e.message);
    errors++;
  }
}

console.log(`\nDone: ${fixed} fixed, ${skipped} already clean, ${errors} errors.`);
