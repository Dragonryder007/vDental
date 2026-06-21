import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../src');

function walk(dir) {
  const results = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) results.push(...walk(full));
    else if (/\.(jsx|js)$/.test(f)) results.push(full);
  }
  return results;
}

const files = walk(srcDir);
let changed = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  // Replace .png and .jpg in image import paths only
  const updated = original
    .replace(/(from\s+['"][^'"]*images[^'"]*)\.(png|jpg|jpeg)(['"])/g, '$1.webp$3');

  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    changed++;
    console.log('  updated:', path.relative(process.cwd(), file));
  }
}
console.log(`\nDone — ${changed} files updated`);
