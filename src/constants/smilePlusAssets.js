/**
 * Smile Plus hero banner image spec (for client/designer uploads).
 * Active hero: src/images/smile-plus-hero.png (clinic reception).
 * Logo: src/images/smile-plus-logo.png
 *
 * Section name: Hero banner / Hero section (top of landing page).
 *
 * Recommended dimensions:
 *   - Desktop: 1920 × 900 px (or 1920 × 1080 for 16:9)
 *   - Minimum width: 1600 px (retina / large screens)
 *   - Aspect ratio: ~16:9 or ~21:9 wide landscape
 *   - File: JPG or WebP, under 400 KB after compression
 *   - Subject: clinic interior, reception, or team — keep left third slightly darker
 *     or uncluttered for text overlay (text sits on the left on desktop).
 */
export const SMILE_PLUS_HERO_IMAGE_SPEC = {
  width: 1920,
  height: 900,
  aspectRatio: '16:9',
  maxFileSizeKb: 400,
  formats: ['webp', 'jpg'],
};

