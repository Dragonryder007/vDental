import axios from 'axios';

const VISITOR_ID_KEY = 'vdental_visitor_id';
const SESSION_PINGED_KEY = 'vdental_visit_pinged';

function generateVisitorId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

export function getOrCreateVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = generateVisitorId();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return generateVisitorId();
  }
}

export async function recordVisit() {
  let alreadyPinged = false;
  try {
    alreadyPinged = sessionStorage.getItem(SESSION_PINGED_KEY) === '1';
  } catch {
    /* ignore */
  }
  if (alreadyPinged) {
    console.log('[VisitorTracker] Already pinged this tab; server-side dedup handles repeats.');
    return;
  }

  const sessionId = getOrCreateVisitorId();
  const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:6000' : '';

  const payload = {
    path: window.location.pathname,
    referrer: document.referrer || '(direct)',
    language: navigator.language || 'unknown',
    screen: `${window.screen?.width || '?'}x${window.screen?.height || '?'}`,
    sessionId
  };

  console.log('[VisitorTracker] Pinging /api/track-visit', { sessionId, apiBase });

  try {
    const res = await axios.post(`${apiBase}/api/track-visit`, payload);
    console.log('[VisitorTracker] Visit recorded:', res.data);
    try {
      sessionStorage.setItem(SESSION_PINGED_KEY, '1');
    } catch {
      /* ignore */
    }
  } catch (err) {
    console.error('[VisitorTracker] Visit tracking failed:', err?.response?.data || err?.message || err);
  }
}

