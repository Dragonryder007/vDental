import * as esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';

const isDev = process.argv.includes('--watch');

async function build() {
  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const ctx = await esbuild.context({
    entryPoints: ['src/main.jsx'],
    bundle: true,
    outdir: 'dist',
    // Root-relative asset URLs so images work on nested routes (e.g. /admin)
    publicPath: '/',
    splitting: true,
    format: 'esm',
    chunkNames: 'chunks/[name]-[hash]',
    minify: !isDev,
    sourcemap: isDev,
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.png': 'file',
      '.svg': 'file',
      '.jpg': 'file',
      '.webp': 'file',
      '.mp4': 'file',
      '.css': 'css'
    },
    define: {
      'process.env.NODE_ENV': isDev ? '"development"' : '"production"'
    }
  });

  // Generate favicon.png — crop the actual tooth mark from logo, white background
  // This gives the exact logo icon at proper favicon size
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const sharp = require('sharp');
    // Tight-crop just the tooth mark (bounding box pre-computed from logo.png)
    await sharp(path.resolve('src/images/logo.png'))
      .extract({ left: 278, top: 58, width: 109, height: 123 })
      .flatten({ background: '#ffffff' })
      .resize(192, 192, { fit: 'contain', background: '#ffffff' })
      .png()
      .toFile(path.resolve('dist/favicon.png'));
  } catch {
    // Fallback: copy raw logo if sharp unavailable
    const faviconSrc = path.resolve('src/images/logo.png');
    const faviconDst = path.resolve('dist/favicon.png');
    if (fs.existsSync(faviconSrc)) fs.copyFileSync(faviconSrc, faviconDst);
  }

  if (isDev) {
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await ctx.rebuild();
    // Copy hero poster to a fixed path AFTER build so index.html can preload it
    const posterFile = fs.readdirSync(distDir).find(f => f.startsWith('hero-poster') && f.endsWith('.webp'));
    if (posterFile) fs.copyFileSync(path.join(distDir, posterFile), path.join(distDir, 'poster.webp'));
    await ctx.dispose();
    console.log('Build complete.');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
