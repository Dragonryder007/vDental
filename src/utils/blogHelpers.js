export const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:6000' : '';

export const BLOG_CATEGORIES = [
  'Invisalign',
  'Dental Implants',
  'Cosmetic Dentistry',
  'All-on-4 Implants',
  'Dental Tourism',
  'General',
];

const CATEGORY_STYLES = {
  Invisalign: { gradient: 'from-sky-500 to-blue-600', badge: 'bg-sky-100 text-sky-800' },
  'Dental Implants': { gradient: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-800' },
  'Cosmetic Dentistry': { gradient: 'from-amber-500 to-orange-600', badge: 'bg-amber-100 text-amber-900' },
  'All-on-4 Implants': { gradient: 'from-violet-500 to-purple-600', badge: 'bg-violet-100 text-violet-800' },
  'Dental Tourism': { gradient: 'from-cyan-500 to-teal-600', badge: 'bg-cyan-100 text-cyan-900' },
  General: { gradient: 'from-slate-500 to-slate-700', badge: 'bg-slate-100 text-slate-800' },
};

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.General;
}

export function formatBlogDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function mediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE}${url}`;
}

export function extractHeadings(html) {
  if (!html || typeof document === 'undefined') return [];
  const div = document.createElement('div');
  div.innerHTML = html;
  const headings = [];
  div.querySelectorAll('h2, h3').forEach((el, i) => {
    const text = el.textContent?.trim();
    if (!text) return;
    const id = `section-${i}-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
    headings.push({ id, text, level: el.tagName.toLowerCase() });
  });
  return headings;
}

export function injectHeadingIds(html) {
  if (!html) return '';
  let index = 0;
  return html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    if (/id\s*=/.test(attrs)) return match;
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const id = `section-${index}-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
    index += 1;
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });
}

