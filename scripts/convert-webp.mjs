import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.resolve(__dirname, '../src/images');

const files = fs.readdirSync(imgDir).filter(f =>
  /\.(png|jpg|jpeg)$/i.test(f)
);

let saved = 0;
for (const file of files) {
  const input = path.join(imgDir, file);
  const base = file.replace(/\.(png|jpg|jpeg)$/i, '');
  const output = path.join(imgDir, base + '.webp');

  if (fs.existsSync(output)) {
    console.log(`  skip  ${file} (webp exists)`);
    continue;
  }

  const inSize = fs.statSync(input).size;
  await sharp(input).webp({ quality: 82 }).toFile(output);
  const outSize = fs.statSync(output).size;
  saved += inSize - outSize;
  console.log(`  ✓  ${file}  ${(inSize/1024/1024).toFixed(1)}MB → ${(outSize/1024).toFixed(0)}KB`);
}
console.log(`\nTotal saved: ${(saved/1024/1024).toFixed(1)} MB`);
