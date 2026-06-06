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
    outfile: 'dist/bundle.js',
    // Root-relative asset URLs so images work on nested routes (e.g. /admin)
    publicPath: '/',
    minify: !isDev,
    sourcemap: isDev,
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.png': 'file',
      '.svg': 'file',
      '.jpg': 'file',
      '.css': 'css'
    },
    define: {
      'process.env.NODE_ENV': isDev ? '"development"' : '"production"'
    }
  });

  // Copy favicon to dist so it persists across builds
  const faviconSrc = path.resolve('src/images/logo.png');
  const faviconDst = path.resolve('dist/favicon.png');
  if (fs.existsSync(faviconSrc)) fs.copyFileSync(faviconSrc, faviconDst);

  if (isDev) {
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log('Build complete.');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
