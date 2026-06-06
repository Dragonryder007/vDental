import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/logo.png';
import AdminBlogPanel from '../components/AdminBlogPanel';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:6000' : '';
const TOKEN_KEY = 'adminToken';

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function formatDateHeader() {
  try {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Parse booking date (YYYY-MM-DD from site) + time (e.g. "10:00 AM") for sorting and filters. */
function parseAppointmentDateTime(dateStr, timeStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const m = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  let h = 12;
  let min = 0;
  if (timeStr && typeof timeStr === 'string') {
    const t = timeStr.trim();
    const m12 = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (m12) {
      h = parseInt(m12[1], 10);
      min = parseInt(m12[2], 10);
      const ap = m12[3].toUpperCase();
      if (ap === 'PM' && h < 12) h += 12;
      if (ap === 'AM' && h === 12) h = 0;
    } else {
      const m24 = t.match(/^(\d{1,2}):(\d{2})/);
      if (m24) {
        h = parseInt(m24[1], 10);
        min = parseInt(m24[2], 10);
      }
    }
  }
  const dt = new Date(y, mo, day, h, min, 0, 0);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function hoursSince(iso) {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 0;
  return (Date.now() - t) / (1000 * 60 * 60);
}

function parseVisitorMeta(message) {
  if (!message || typeof message !== 'string') return {};
  const lines = message.split('\n');
  const get = (prefix) => {
    const line = lines.find((l) => l.startsWith(prefix));
    return line ? line.slice(prefix.length).trim() : '';
  };
  return {
    ip: get('IP:'),
    ua: get('User-Agent:'),
    landing: get('Landing page:'),
    referrer: get('Referrer:'),
    language: get('Language:'),
    screen: get('Screen:')
  };
}

function summarizeUserAgent(ua) {
  if (!ua || ua === 'unknown') return 'Unknown device';
  let browser = 'Browser';
  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera';
  else if (ua.includes('Chrome/') && !ua.includes('Chromium')) browser = 'Chrome';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';
  let os = '';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux') && !ua.includes('Android')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  return os ? `${browser} · ${os}` : browser;
}

function initials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function dedupeRecentContacts(leads, limit = 8) {
  const contacts = leads
    .filter((l) => l.source !== 'Website Visit')
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const seen = new Set();
  const out = [];
  for (const l of contacts) {
    const phoneKey = (l.phone || '').replace(/\D/g, '');
    const emailName = `${(l.email || '').toLowerCase()}|${(l.name || '').toLowerCase()}`;
    const key = phoneKey || (emailName !== '|' ? emailName : '') || `id:${l.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
    if (out.length >= limit) break;
  }
  return out;
}

function buildActivityFeed(leads, bookings, reviews, max = 14) {
  const items = [];

  for (const l of leads) {
    const t = l.createdAt ? new Date(l.createdAt).getTime() : 0;
    if (l.source === 'Website Visit') {
      const meta = parseVisitorMeta(l.message);
      const device = summarizeUserAgent(meta.ua);
      items.push({
        id: `lead-v-${l.id}`,
        t,
        kind: 'visit',
        title: 'Site visit recorded',
        detail: [
          meta.landing ? `Page: ${meta.landing}` : null,
          device,
          meta.referrer && meta.referrer !== '(direct)' ? `From: ${meta.referrer}` : null,
          meta.ip ? `IP: ${meta.ip}` : null
        ]
          .filter(Boolean)
          .join(' · ')
      });
    } else {
      items.push({
        id: `lead-c-${l.id}`,
        t,
        kind: 'enquiry',
        title: 'Contact enquiry',
        detail: [l.name, l.phone, l.email, l.source ? `Source: ${l.source}` : null, l.service ? `Service: ${l.service}` : null]
          .filter(Boolean)
          .join(' · ')
      });
    }
  }

  for (const b of bookings) {
    const raw = b.created_at || b.createdAt;
    const t = raw ? new Date(raw).getTime() : 0;
    items.push({
      id: `book-${b.id || b._id}`,
      t,
      kind: 'booking',
      title: 'Appointment request',
      detail: [b.name, b.service, b.date && b.time ? `${b.date} ${b.time}` : b.date || null, b.phone]
        .filter(Boolean)
        .join(' · ')
    });
  }

  for (const r of reviews) {
    const t = r.createdAt ? new Date(r.createdAt).getTime() : 0;
    items.push({
      id: `rev-${r.id}`,
      t,
      kind: 'review',
      title: 'Patient review',
      detail: `${r.name || 'Anonymous'} · ${r.rating}/5 stars${r.status ? ` · ${r.status}` : ''}`
    });
  }

  return items
    .filter((x) => x.t > 0)
    .sort((a, b) => b.t - a.t)
    .slice(0, max)
    .map((x) => ({ ...x, timeLabel: formatDate(new Date(x.t).toISOString()) }));
}

function StatCard({ title, value, hint, borderClass, icon, trend }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${borderClass}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[color:var(--soft)] flex items-center justify-center text-[color:var(--dk)] opacity-60 shrink-0">{icon}</div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.startsWith('↑') ? 'bg-green-50 text-green-700' : trend.startsWith('↓') ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">{title}</div>
      <div className="mt-1 font-serif text-3xl font-bold text-[color:var(--dk)] tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs font-medium text-[color:var(--muted)] leading-snug">{hint}</div>}
    </div>
  );
}

function ActivityIcon({ kind }) {
  const cls = 'h-5 w-5';
  if (kind === 'visit')
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--teal)]/10 text-[color:var(--teal)]">
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </span>
    );
  if (kind === 'booking')
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent)]/15 text-[color:var(--dk)]">
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </span>
    );
  if (kind === 'review')
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </span>
    );
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[color:var(--teal)]">
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </span>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');

  const [tab, setTab] = useState(() => localStorage.getItem('adminActiveTab') || 'dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leadFilter, setLeadFilter] = useState('all');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('week'); // 'today' | 'week' | 'month' | 'all'
  const [tabAnimKey, setTabAnimKey] = useState(0);

  useEffect(() => {
    localStorage.setItem('adminActiveTab', tab);
    setTabAnimKey(k => k + 1);
    setSearchQuery('');
  }, [tab]);

  useEffect(() => {
    if (token) return undefined;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [token]);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('smile-designing');
  const [imageFile, setImageFile] = useState(null);
  const [galleryError, setGalleryError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [aiPreviews, setAiPreviews] = useState([]);
  const [aiPreviewsLoading, setAiPreviewsLoading] = useState(false);

  const [bookingsError, setBookingsError] = useState('');

  const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookingsError('');
    try {
      const res = await axios.get(`${API_BASE}/api/appointments`, { headers });
      setBookings(res.data?.appointments || []);
    } catch (err) {
      setBookings([]);
      const msg = err.response?.data?.error || err.message || 'Could not load appointments';
      setBookingsError(msg);
      console.error('fetchBookings failed:', err.response?.status, msg);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/reviews`, { headers });
      setReviews(res.data?.reviews || []);
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const updateReviewStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/api/admin/reviews/${id}`, { status }, { headers });
      await fetchReviews();
    } catch {
      // ignore
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/reviews/${id}`, { headers });
      await fetchReviews();
    } catch {
      // ignore
    }
  };

  const fetchAiPreviews = async () => {
    setAiPreviewsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/ai-previews`, { headers });
      setAiPreviews(res.data?.previews || []);
    } catch {
      setAiPreviews([]);
    } finally {
      setAiPreviewsLoading(false);
    }
  };

  const updateAiPreviewStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/api/admin/ai-previews/${id}`, { status }, { headers });
      await fetchAiPreviews();
    } catch {
      // ignore
    }
  };

  const deleteAiPreview = async (id) => {
    if (!window.confirm('Delete this AI preview submission and its images?')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/ai-previews/${id}`, { headers });
      await fetchAiPreviews();
    } catch {
      // ignore
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setAuthError('');
  };

  const login = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/admin/login`, { username, password });
      const t = res.data?.token;
      if (!t) throw new Error('No token returned');
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      setPassword('');
    } catch {
      setAuthError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/leads`, { headers });
      setLeads(res.data?.leads || []);
    } catch {
      setLeads([]);
    } finally {
      setLeadsLoading(false);
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/api/leads/${id}`, { status }, { headers });
      await fetchLeads();
    } catch {
      // ignore
    }
  };

  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/gallery`);
      setGallery(res.data?.gallery || []);
    } catch {
      setGallery([]);
    } finally {
      setGalleryLoading(false);
    }
  };

  const uploadGallery = async (e) => {
    e.preventDefault();
    setGalleryError('');
    if (!galleryTitle.trim() || !imageFile) {
      setGalleryError('Please provide title + an image.');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('title', galleryTitle.trim());
      fd.append('category', galleryCategory);
      fd.append('image', imageFile);

      await axios.post(`${API_BASE}/api/admin/gallery`, fd, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setGalleryTitle('');
      setImageFile(null);
      await fetchGallery();
    } catch {
      setGalleryError('Upload failed. Please try again.');
    }
  };

  const deleteGallery = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/admin/gallery/${id}`, { headers });
      await fetchGallery();
    } catch {
      // ignore
    }
  };

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchLeads(), fetchGallery(), fetchBookings(), fetchReviews(), fetchAiPreviews()]);
  }, [headers]);

  useEffect(() => {
    if (!token) return;
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const visitorLeads = useMemo(() => leads.filter((l) => l.source === 'Website Visit'), [leads]);
  const contactLeads = useMemo(() => leads.filter((l) => l.source !== 'Website Visit'), [leads]);
  const newFollowUps = useMemo(
    () => contactLeads.filter((l) => (l.status || 'new') === 'new').length,
    [contactLeads]
  );
  const pendingReviews = useMemo(() => reviews.filter((r) => (r.status || 'pending') === 'pending').length, [reviews]);
  const publishedReviews = useMemo(() => reviews.filter((r) => r.status === 'published').length, [reviews]);

  const activityFeed = useMemo(() => buildActivityFeed(leads, bookings, reviews), [leads, bookings, reviews]);

  // ── Date range filter helpers ────────────────────────────────────────
  const getDateRangeStart = useMemo(() => {
    const d = new Date();
    if (dateRange === 'today')  { d.setHours(0, 0, 0, 0); return d; }
    if (dateRange === 'week')   { d.setDate(d.getDate() - 7);  d.setHours(0,0,0,0); return d; }
    if (dateRange === 'month')  { d.setDate(d.getDate() - 30); d.setHours(0,0,0,0); return d; }
    return null; // 'all' — no filter
  }, [dateRange]);

  const inRange = useCallback((isoDate) => {
    if (!getDateRangeStart || !isoDate) return true;
    return new Date(isoDate) >= getDateRangeStart;
  }, [getDateRangeStart]);

  // Date-range filtered versions for dashboard stats
  const drLeads = useMemo(() =>
    leads.filter(l => inRange(l.createdAt)),
    [leads, inRange]
  );
  const drBookings = useMemo(() =>
    bookings.filter(b => inRange(b.createdAt || b.created_at || b.date)),
    [bookings, inRange]
  );
  const drReviews = useMemo(() =>
    reviews.filter(r => inRange(r.createdAt)),
    [reviews, inRange]
  );
  const drActivityFeed = useMemo(() =>
    activityFeed.filter(item => inRange(item.t ? new Date(item.t).toISOString() : null)),
    [activityFeed, inRange]
  );

  const drVisitors = useMemo(() => drLeads.filter(l => l.source === 'Website Visit').length, [drLeads]);
  const drContacts = useMemo(() => drLeads.filter(l => l.source !== 'Website Visit').length, [drLeads]);
  const drPending  = useMemo(() => drReviews.filter(r => (r.status || 'pending') === 'pending').length, [drReviews]);
  const recentContacts = useMemo(() => dedupeRecentContacts(leads, 8), [leads]);

  const bookingsEnriched = useMemo(
    () =>
      bookings.map((b) => ({
        b,
        dt: parseAppointmentDateTime(b.date, b.time)
      })),
    [bookings]
  );

  const upcomingAppointmentsWeek = useMemo(() => {
    const now = new Date();
    const end = startOfToday();
    end.setDate(end.getDate() + 7);
    end.setHours(23, 59, 59, 999);
    return bookingsEnriched
      .filter(({ dt }) => dt && dt >= now && dt <= end)
      .sort((a, b) => a.dt - b.dt);
  }, [bookingsEnriched]);

  const staleNewContacts = useMemo(
    () =>
      contactLeads.filter((l) => (l.status || 'new') === 'new' && hoursSince(l.createdAt) > 24),
    [contactLeads]
  );

  const displayedBookings = useMemo(() => {
    const now = new Date();
    if (bookingFilter === 'upcoming') {
      return [...bookingsEnriched]
        .filter(({ dt }) => dt && dt >= now)
        .sort((a, b) => a.dt - b.dt);
    }
    if (bookingFilter === 'past') {
      return [...bookingsEnriched]
        .filter(({ dt }) => !dt || dt < now)
        .sort((a, b) => {
          const tb = b.dt ? b.dt.getTime() : 0;
          const ta = a.dt ? a.dt.getTime() : 0;
          return tb - ta;
        });
    }
    return [...bookingsEnriched].sort((a, b) => {
      if (!a.dt && !b.dt) return 0;
      if (!a.dt) return 1;
      if (!b.dt) return -1;
      return a.dt - b.dt;
    });
  }, [bookingsEnriched, bookingFilter]);

  const hasAttention =
    newFollowUps > 0 ||
    pendingReviews > 0 ||
    upcomingAppointmentsWeek.length > 0 ||
    staleNewContacts.length > 0;

  const filteredLeads = useMemo(() => {
    let list = leads;
    if (leadFilter === 'visitors') list = list.filter((l) => l.source === 'Website Visit');
    if (leadFilter === 'contacts') list = list.filter((l) => l.source !== 'Website Visit');
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(l => [l.name, l.phone, l.email, l.service, l.source].some(v => v?.toLowerCase().includes(q)));
    }
    return list;
  }, [leads, leadFilter, searchQuery]);

  const filteredBookings = useMemo(() => {
    if (!searchQuery) return bookings;
    const q = searchQuery.toLowerCase();
    return bookings.filter(b => [b.name, b.phone, b.email, b.service].some(v => v?.toLowerCase().includes(q)));
  }, [bookings, searchQuery]);

  const filteredReviews = useMemo(() => {
    if (!searchQuery) return reviews;
    const q = searchQuery.toLowerCase();
    return reviews.filter(r => [r.name, r.email, r.comment].some(v => v?.toLowerCase().includes(q)));
  }, [reviews, searchQuery]);

  const tabTitle = useMemo(() => {
    const map = {
      dashboard: 'Dashboard',
      leads: 'Leads',
      gallery: 'Gallery',
      blog: 'Blog',
      booking: 'Bookings',
      reviews: 'Reviews',
      'ai-preview': 'AI Preview'
    };
    return map[tab] || 'Admin';
  }, [tab]);

  if (!token) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{ background: 'var(--deep)' }}
      >
        {/* Subtle radial glow — not too green */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)' }}
        />
        {/* Grain */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        />

        {/* Back link — top left */}
        <Link
          to="/"
          className="absolute top-5 left-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors z-10"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Website
        </Link>

        {/* Centered card + logo as one unit */}
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-4">

          {/* Logo box */}
          <div
            className="mb-6 rounded-2xl bg-white p-3"
            style={{ boxShadow: '0 0 0 1px rgba(201,162,74,0.2), 0 20px 40px rgba(0,0,0,0.5)' }}
          >
            <img src={logo} alt="V Dental" className="h-12 w-auto object-contain" />
          </div>

          {/* Card */}
          <div
            className="w-full rounded-3xl px-8 py-9"
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="font-serif text-[2rem] font-light text-white leading-tight mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Welcome Back
              </h1>
              <div className="w-10 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #C9A24A, transparent)' }} />
            </div>

            <form onSubmit={login} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.border = '1px solid rgba(201,162,74,0.55)'}
                  onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.border = '1px solid rgba(201,162,74,0.55)'}
                  onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                />
              </div>

              {authError && (
                <p className="text-center text-xs font-semibold text-red-400" role="alert">✕ {authError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl py-3.5 text-[13px] font-bold tracking-widest uppercase disabled:opacity-50 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #C9A24A, #dbb95e)',
                  color: '#0c1510',
                  boxShadow: '0 8px 24px rgba(201,162,74,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(201,162,74,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,162,74,0.3)'; }}
              >
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>
          </div>

          <p className="mt-6 text-[10px] text-white/25 tracking-[0.2em] uppercase">
            Secured Admin Access
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'leads',     label: 'Leads',     icon: '👥' },
    { id: 'booking',   label: 'Bookings',  icon: '📅' },
    { id: 'reviews',   label: 'Reviews',   icon: '⭐' },
    { id: 'gallery',   label: 'Gallery',   icon: '🖼' },
    { id: 'blog',      label: 'Blog',      icon: '✍️' },
    { id: 'ai-preview',label: 'AI Preview',icon: '🤖'
    }
  ];

  const mediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${API_BASE}${url}`;
  };

  const iconUsers = (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
  const iconInbox = (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0l-4 4H8l-4-4" />
    </svg>
  );
  const iconCalendar = (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
  const iconStar = (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927l1.519 4.674a1 1 0 00.95.69h4.915l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888 1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
  const iconDatabase = (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  );
  const iconImage = (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
    </svg>
  );

  const sidebarNav = (mobile = false) => {
    const isDark = !mobile;
    return (
      <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
        <div className={`px-2 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.22em] ${isDark ? 'text-white/30' : 'text-[color:var(--muted)]'}`}>
          Main Menu
        </div>
        {navItems.map((item) => {
          const badge = item.id === 'leads' ? newFollowUps : item.id === 'reviews' ? pendingReviews : 0;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); if (mobile) setIsSidebarOpen(false); }}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 group ${
                isActive
                  ? isDark
                    ? 'bg-black/25 text-white font-semibold'
                    : 'bg-[color:var(--teal)] text-white font-semibold shadow-md'
                  : isDark
                    ? 'text-white/60 hover:bg-black/15 hover:text-white font-normal'
                    : 'text-[color:var(--muted)] hover:bg-[color:var(--soft)] hover:text-[color:var(--dk)] font-normal'
              }`}
            >
              {/* Emoji icon — plain, no tile, matches mockup */}
              <span className="shrink-0 text-lg leading-none transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {badge > 0 && (
                <span className={`shrink-0 min-w-[20px] text-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.id === 'leads' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Settings section */}
        <div className={`px-2 pb-2 pt-4 text-[9px] font-bold uppercase tracking-[0.22em] ${isDark ? 'text-white/30' : 'text-[color:var(--muted)]'}`}>
          Settings
        </div>
        <Link to="/" onClick={() => { if (mobile) setIsSidebarOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 group no-underline ${isDark ? 'text-white/60 hover:bg-black/15 hover:text-white' : 'text-[color:var(--muted)] hover:bg-[color:var(--soft)]'}`}>
          <span className="shrink-0 text-lg leading-none transition-transform duration-200 group-hover:scale-110">🔗</span>
          <span className="flex-1">Back to Website</span>
        </Link>
      </nav>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[color:var(--bg)] text-[color:var(--txt)]">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-[60px] items-center justify-between px-4 md:hidden" style={{ background: 'var(--deep)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shrink-0">
            <img src={logo} alt="V Dental" className="h-5 w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-serif text-sm font-semibold text-white leading-tight">V Dental</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/35">Admin Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {newFollowUps > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{newFollowUps}</span>
          )}
          <button type="button" onClick={() => setIsSidebarOpen(true)} className="rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <aside
            className="absolute left-0 top-0 flex h-full w-[min(100%,260px)] flex-col shadow-2xl"
            style={{ background: 'var(--deep)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center shrink-0">
                  <img src={logo} alt="V Dental" className="h-6 w-auto object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-serif text-base font-semibold text-white">V Dental</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/30">Admin Portal</div>
                </div>
              </div>
              <button type="button" onClick={() => setIsSidebarOpen(false)} className="rounded-lg p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebarNav(true)}
            <div className="border-t border-white/8 p-3 shrink-0">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm font-bold text-red-400/80 transition hover:bg-red-500/15 hover:text-red-400"
              >
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden w-60 shrink-0 flex-col bg-[color:var(--deep)] md:flex" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Subtle top-right glow */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,162,74,0.07) 0%, transparent 70%)' }} />

        {/* Logo area */}
        <div className="border-b border-white/8 px-4 py-5">
          <Link to="/" className="flex items-center gap-2.5 no-underline group outline-none">
            <div className="w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center shadow-lg shrink-0 group-hover:bg-white transition-colors">
              <img src={logo} alt="V Dental" className="h-6 w-auto object-contain" />
            </div>
            <div className="min-w-0">
              <div className="font-serif text-base font-semibold text-white leading-tight">V Dental</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30 mt-0.5">Admin Portal</div>
            </div>
          </Link>
        </div>

        {sidebarNav(false)}

        {/* Footer */}
        <div className="border-t border-white/8 p-3 shrink-0">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/6 border border-white/8 px-3 py-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0a1a0a] shrink-0" style={{ background: 'linear-gradient(135deg, #C9A24A, #dbb95e)' }}>
              AD
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">Administrator</div>
              <div className="text-[10px] text-white/30 truncate">Full access</div>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-2.5 text-xs font-bold text-red-400/80 transition hover:bg-red-500/15 hover:text-red-400"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col pt-[60px] md:pt-0">
        <div className="sticky top-0 z-30 hidden border-b border-black/[0.06] bg-white/95 px-6 py-3 backdrop-blur md:block lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            {/* Greeting */}
            <div className="min-w-0 shrink-0">
              <h1 className="font-serif text-lg font-semibold text-[color:var(--deep)] leading-tight">
                {(() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; })()}, Admin ✨
              </h1>
              <p className="text-[11px] text-[color:var(--muted)] mt-0.5">{tabTitle} · {formatDateHeader()}</p>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)] text-sm">🔍</span>
                <input
                  type="text"
                  placeholder={`Search ${tabTitle.toLowerCase()}…`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[color:var(--bg)] pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[color:var(--teal)] transition-colors"
                />
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800 ring-1 ring-emerald-200/80">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>

              {/* Notification bell */}
              <button
                type="button"
                onClick={() => setTab('leads')}
                className="relative rounded-xl border border-black/10 bg-white p-2 text-[color:var(--muted)] shadow-sm transition hover:border-[color:var(--teal)] hover:text-[color:var(--teal)]"
              >
                🔔
                {(newFollowUps + pendingReviews) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {newFollowUps + pendingReviews}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => refreshAll()}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-[color:var(--dk)] shadow-sm transition hover:border-[color:var(--teal)] hover:text-[color:var(--teal)]"
              >
                ↻ Refresh
              </button>
              <button
                type="button"
                onClick={() => { setBookingFilter('upcoming'); setTab('booking'); }}
                className="rounded-xl bg-[color:var(--deep)] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[color:var(--teal)]"
              >
                📅 Bookings
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-6">
          <div key={tabAnimKey} className="admin-tab-enter mx-auto max-w-7xl space-y-5">
            {tab === 'dashboard' && (
              <>
                {/* Attention Banner */}
                {hasAttention && (
                  <div className="rounded-2xl p-5 flex flex-wrap items-center gap-4 mb-2" style={{ background: 'linear-gradient(135deg, var(--deep), var(--dk))' }}>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">⚡</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm">Items need your attention</div>
                      <div className="text-white/55 text-xs mt-0.5">Review pending leads and approvals before they go stale</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newFollowUps > 0 && <span className="text-[11px] font-bold bg-red-500/20 border border-red-400/25 text-red-300 px-3 py-1 rounded-full">{newFollowUps} New Leads</span>}
                      {pendingReviews > 0 && <span className="text-[11px] font-bold bg-amber-500/20 border border-amber-400/25 text-amber-300 px-3 py-1 rounded-full">{pendingReviews} Reviews Pending</span>}
                      {upcomingAppointmentsWeek.length > 0 && <span className="text-[11px] font-bold bg-blue-500/20 border border-blue-400/25 text-blue-300 px-3 py-1 rounded-full">{upcomingAppointmentsWeek.length} Upcoming</span>}
                    </div>
                    <button onClick={() => setTab('leads')} className="rounded-xl px-4 py-2 text-xs font-bold shrink-0 transition hover:opacity-90" style={{ background: '#C9A24A', color: '#0a1a0a' }}>
                      Review Now →
                    </button>
                  </div>
                )}

                {/* Date Range Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[color:var(--muted)] uppercase tracking-wider">Filter:</span>
                  {[['today','Today'],['week','This Week'],['month','This Month'],['all','All Time']].map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDateRange(val)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        dateRange === val
                          ? 'bg-[color:var(--deep)] text-white shadow-sm'
                          : 'bg-white border border-black/10 text-[color:var(--muted)] hover:border-[color:var(--teal)] hover:text-[color:var(--teal)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setTab('leads')} className="inline-flex items-center gap-1.5 rounded-xl border border-black/8 bg-white px-3.5 py-2 text-xs font-semibold text-[color:var(--txt)] shadow-sm hover:border-[color:var(--teal)] hover:text-[color:var(--teal)] transition-all hover:-translate-y-px">
                    👥 All Leads
                  </button>
                  <button onClick={() => { setBookingFilter('upcoming'); setTab('booking'); }} className="inline-flex items-center gap-1.5 rounded-xl border border-black/8 bg-white px-3.5 py-2 text-xs font-semibold text-[color:var(--txt)] shadow-sm hover:border-[color:var(--teal)] hover:text-[color:var(--teal)] transition-all hover:-translate-y-px">
                    📅 Upcoming Bookings
                  </button>
                  <button onClick={() => setTab('reviews')} className="inline-flex items-center gap-1.5 rounded-xl border border-black/8 bg-white px-3.5 py-2 text-xs font-semibold text-[color:var(--txt)] shadow-sm hover:border-[color:var(--teal)] hover:text-[color:var(--teal)] transition-all hover:-translate-y-px">
                    ⭐ Moderate Reviews
                  </button>
                  <button onClick={() => setTab('gallery')} className="inline-flex items-center gap-1.5 rounded-xl border border-black/8 bg-white px-3.5 py-2 text-xs font-semibold text-[color:var(--txt)] shadow-sm hover:border-[color:var(--teal)] hover:text-[color:var(--teal)] transition-all hover:-translate-y-px">
                    🖼 Upload Gallery
                  </button>
                  <button onClick={() => setTab('blog')} className="inline-flex items-center gap-1.5 rounded-xl border border-black/8 bg-white px-3.5 py-2 text-xs font-semibold text-[color:var(--txt)] shadow-sm hover:border-[color:var(--teal)] hover:text-[color:var(--teal)] transition-all hover:-translate-y-px">
                    ✍️ New Blog Post
                  </button>
                </div>

                <section className="rounded-2xl border border-[color:var(--teal)]/20 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)]">Needs your attention</h2>
                      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[color:var(--muted)]">
                        Front-desk view: new enquiries still open, reviews waiting for approval, and confirmed slots in the{' '}
                        <span className="font-bold text-[color:var(--dk)]">next 7 days</span>.
                      </p>
                    </div>
                    {!leadsLoading && !bookingsLoading && !reviewsLoading && (
                      <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-bold ${hasAttention ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80' : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80'}`}>
                        {hasAttention ? '⚡ Action items pending' : '✓ All clear · nothing urgent'}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <button
                      type="button"
                      onClick={() => setTab('leads')}
                      className="rounded-2xl border border-black/[0.06] bg-white p-4 text-left shadow-sm transition hover:border-[color:var(--teal)]/40 hover:shadow-md"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted)]">New enquiries</div>
                      <div className="mt-1 font-serif text-3xl font-bold tabular-nums text-[color:var(--dk)]">{newFollowUps}</div>
                      <div className="mt-1 text-xs text-[color:var(--muted)]">Contact leads still marked “new”.</div>
                      {staleNewContacts.length > 0 && (
                        <div className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] font-bold text-red-800">
                          {staleNewContacts.length} waiting over 24h — follow up
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('reviews')}
                      className="rounded-2xl border border-black/[0.06] bg-white p-4 text-left shadow-sm transition hover:border-[color:var(--teal)]/40 hover:shadow-md"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted)]">Reviews to moderate</div>
                      <div className="mt-1 font-serif text-3xl font-bold tabular-nums text-[color:var(--dk)]">
                        {reviewsLoading ? '…' : pendingReviews}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--muted)]">Pending before they can show on the site.</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingFilter('upcoming');
                        setTab('booking');
                      }}
                      className="rounded-2xl border border-black/[0.06] bg-white p-4 text-left shadow-sm transition hover:border-[color:var(--teal)]/40 hover:shadow-md"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted)]">Upcoming (7 days)</div>
                      <div className="mt-1 font-serif text-3xl font-bold tabular-nums text-[color:var(--dk)]">
                        {bookingsLoading ? '…' : upcomingAppointmentsWeek.length}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--muted)]">From today through the next week.</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('leads')}
                      className="rounded-2xl border border-black/[0.06] bg-white p-4 text-left shadow-sm transition hover:border-[color:var(--teal)]/40 hover:shadow-md"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted)]">Total contact leads</div>
                      <div className="mt-1 font-serif text-3xl font-bold tabular-nums text-[color:var(--dk)]">{contactLeads.length}</div>
                      <div className="mt-1 text-xs text-[color:var(--muted)]">Named patients & forms (excludes auto visits).</div>
                    </button>
                  </div>

                  <div className="mt-8 border-t border-black/[0.06] pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[color:var(--dk)]">Upcoming schedule</h3>
                        <p className="mt-0.5 text-sm text-[color:var(--muted)]">Soonest appointments in the next 7 days.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingFilter('upcoming');
                          setTab('booking');
                        }}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold text-[color:var(--dk)] transition hover:border-[color:var(--teal)] hover:text-[color:var(--teal)]"
                      >
                        Open Bookings →
                      </button>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {bookingsLoading ? (
                        <li className="rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-6 text-center text-sm text-[color:var(--muted)]">
                          Loading appointments…
                        </li>
                      ) : upcomingAppointmentsWeek.length === 0 ? (
                        <li className="rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-6 text-center text-sm text-[color:var(--muted)]">
                          No appointments in the next 7 days. New requests appear here once patients pick a slot on the site.
                        </li>
                      ) : (
                        upcomingAppointmentsWeek.slice(0, 6).map(({ b, dt }) => (
                          <li
                            key={b.id || b._id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3 text-sm shadow-sm"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-[color:var(--dk)]">{b.name}</div>
                              <div className="mt-0.5 text-[color:var(--muted)]">
                                {[b.service, b.phone].filter(Boolean).join(' · ')}
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="font-bold text-[color:var(--teal)]">
                                {dt
                                  ? dt.toLocaleString(undefined, {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: 'numeric',
                                      minute: '2-digit'
                                    })
                                  : [b.date, b.time].filter(Boolean).join(' · ') || '—'}
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Clinic overview</h2>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">Full funnel: traffic, enquiries, bookings, gallery, and reviews.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                      title="Unique Visitors"
                      value={leadsLoading ? '…' : drVisitors}
                      hint={dateRange === 'all' ? 'All time' : `${dateRange === 'today' ? 'Today' : dateRange === 'week' ? 'Last 7 days' : 'Last 30 days'}`}
                      borderClass="border-t-4 border-t-[color:var(--teal)]"
                      icon={iconUsers}
                      trend="↑ Live"
                    />
                    <StatCard
                      title="Contact Enquiries"
                      value={leadsLoading ? '…' : drContacts}
                      hint={`${newFollowUps} need follow-up`}
                      borderClass="border-t-4 border-t-[color:var(--dk)]"
                      icon={iconInbox}
                      trend={newFollowUps > 0 ? `${newFollowUps} new` : '✓ Clear'}
                    />
                    <StatCard
                      title="Appointments"
                      value={bookingsLoading ? '…' : drBookings.length}
                      hint={`${upcomingAppointmentsWeek.length} upcoming this week`}
                      borderClass="border-t-4 border-t-blue-400"
                      icon={iconCalendar}
                      trend={`${upcomingAppointmentsWeek.length} upcoming`}
                    />
                    <StatCard
                      title="Reviews Pending"
                      value={reviewsLoading ? '…' : drPending}
                      hint={`${publishedReviews} published on site`}
                      borderClass="border-t-4 border-t-amber-400"
                      icon={iconStar}
                      trend={drPending > 0 ? `↑ ${drPending} pending` : '✓ All done'}
                    />
                  </div>
                </section>

                {/* ── 3-COLUMN BOTTOM GRID ─────────────────────── */}
                <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                  {/* Col 1 — Recent Activity */}
                  <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
                      <div>
                        <div className="text-sm font-bold text-[color:var(--dk)]">Recent Activity</div>
                        <div className="text-xs text-[color:var(--muted)] mt-0.5">Latest leads, bookings & reviews</div>
                      </div>
                      <button onClick={() => setTab('leads')} className="text-xs font-bold text-[color:var(--teal)] hover:opacity-70 transition-opacity">View all →</button>
                    </div>
                    <ul className="divide-y divide-black/[0.05] max-h-[380px] overflow-y-auto">
                      {leadsLoading && bookingsLoading && reviewsLoading ? (
                        <li className="flex flex-col items-center justify-center py-10 gap-2">
                          <div className="w-8 h-8 rounded-full border-2 border-[color:var(--teal)]/20 border-t-[color:var(--teal)] animate-spin" />
                          <span className="text-xs text-[color:var(--muted)]">Loading activity…</span>
                        </li>
                      ) : drActivityFeed.length === 0 ? (
                        <li className="flex flex-col items-center justify-center py-10 gap-2 text-center px-4">
                          <span className="text-3xl">📭</span>
                          <div className="text-sm font-semibold text-[color:var(--dk)]">No activity {dateRange !== 'all' ? `for ${dateRange === 'today' ? 'today' : dateRange === 'week' ? 'this week' : 'this month'}` : 'yet'}</div>
                          <div className="text-xs text-[color:var(--muted)]">Try switching to a wider date range</div>
                        </li>
                      ) : (
                        drActivityFeed.slice(0, 8).map((item) => (
                          <li key={item.id} className="flex gap-3 px-5 py-3.5">
                            <ActivityIcon kind={item.kind} />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-[color:var(--dk)] truncate">{item.title}</div>
                              <div className="text-xs text-[color:var(--muted)] mt-0.5 line-clamp-1">{item.detail}</div>
                              <div className="text-[10px] font-bold text-[color:var(--teal)] mt-1">{item.timeLabel}</div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Col 2 — Today's / Upcoming Appointments */}
                  <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
                      <div>
                        <div className="text-sm font-bold text-[color:var(--dk)]">Upcoming Appointments</div>
                        <div className="text-xs text-[color:var(--muted)] mt-0.5">{upcomingAppointmentsWeek.length} in next 7 days</div>
                      </div>
                      <button onClick={() => { setBookingFilter('upcoming'); setTab('booking'); }} className="text-xs font-bold text-[color:var(--teal)] hover:opacity-70 transition-opacity">View all →</button>
                    </div>
                    <ul className="divide-y divide-black/[0.05] max-h-[380px] overflow-y-auto">
                      {bookingsLoading ? (
                        <li className="flex flex-col items-center justify-center py-10 gap-2">
                          <div className="w-8 h-8 rounded-full border-2 border-[color:var(--teal)]/20 border-t-[color:var(--teal)] animate-spin" />
                          <span className="text-xs text-[color:var(--muted)]">Loading…</span>
                        </li>
                      ) : upcomingAppointmentsWeek.length === 0 ? (
                        <li className="flex flex-col items-center justify-center py-10 gap-2 text-center px-4">
                          <span className="text-3xl">📅</span>
                          <div className="text-sm font-semibold text-[color:var(--dk)]">No upcoming appointments</div>
                          <div className="text-xs text-[color:var(--muted)]">Bookings from patients will appear here</div>
                        </li>
                      ) : (
                        upcomingAppointmentsWeek.slice(0, 6).map(({ b, dt }) => (
                          <li key={b.id} className="flex items-center gap-3 px-5 py-3.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--deep), var(--teal))' }}>
                              {initials(b.name || '?')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-[color:var(--dk)] truncate">{b.name}</div>
                              <div className="text-xs text-[color:var(--muted)] truncate">{b.service || 'Consultation'}</div>
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${b.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                {b.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs font-bold text-[color:var(--teal)]">
                                {dt ? dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : b.date}
                              </div>
                              <div className="text-[11px] text-[color:var(--muted)]">{b.time || '—'}</div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Col 3 — Weekly Chart + Top Services */}
                  <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
                      <div>
                        <div className="text-sm font-bold text-[color:var(--dk)]">Weekly Bookings</div>
                        <div className="text-xs text-[color:var(--muted)] mt-0.5">This week · {bookings.length} total</div>
                      </div>
                      <button onClick={() => setTab('booking')} className="text-xs font-bold text-[color:var(--teal)] hover:opacity-70 transition-opacity">Details →</button>
                    </div>
                    <div className="px-5 py-4">
                      {/* Bar chart */}
                      {(() => {
                        const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
                        const counts = days.map((_, i) => {
                          const dayIdx = i === 6 ? 0 : i + 1;
                          return bookings.filter(b => new Date(b.date || b.created_at || b.createdAt).getDay() === dayIdx).length;
                        });
                        const maxCount = Math.max(...counts, 1);
                        return (
                          <div className="flex items-end gap-1.5 h-24 mb-3">
                            {counts.map((count, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                                <div className="relative w-full flex items-end justify-center" style={{ height: '80px' }}>
                                  {count > 0 && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[color:var(--deep)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                                      {count}
                                    </div>
                                  )}
                                  <div
                                    className="w-full rounded-t-lg transition-all duration-700"
                                    style={{
                                      height: `${Math.max((count / maxCount) * 76, count > 0 ? 12 : 4)}px`,
                                      background: count > 0 ? 'linear-gradient(180deg, var(--teal) 0%, var(--dk) 100%)' : '#e2e8f0',
                                      boxShadow: count > 0 ? '0 4px 12px rgba(2,138,15,0.25)' : 'none',
                                    }}
                                  />
                                </div>
                                <div className="text-[9px] text-[color:var(--muted)] font-medium">{days[i]}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Top services */}
                      <div className="border-t border-black/[0.05] pt-4">
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[color:var(--muted)] mb-3">Top Services</div>
                        {(() => {
                          const svcCount = {};
                          bookings.forEach(b => {
                            const svc = b.service || 'Other';
                            svcCount[svc] = (svcCount[svc] || 0) + 1;
                          });
                          const sorted = Object.entries(svcCount).sort((a,b) => b[1]-a[1]).slice(0,4);
                          const maxSvc = sorted[0]?.[1] || 1;
                          const colors = ['var(--teal)', 'var(--gold, #C9A24A)', '#3b82f6', '#8b5cf6'];
                          if (sorted.length === 0) return <div className="text-xs text-[color:var(--muted)] py-2">No bookings yet</div>;
                          return sorted.map(([name, count], i) => (
                            <div key={name} className="flex items-center gap-2 mb-2.5">
                              <div className="text-xs text-[color:var(--txt)] font-medium w-24 truncate">{name}</div>
                              <div className="flex-1 h-1.5 bg-[color:var(--soft)] rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(count/maxSvc)*100}%`, background: colors[i] }} />
                              </div>
                              <div className="text-[11px] font-bold w-5 text-right" style={{ color: colors[i] }}>{count}</div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                </section>
              </>
            )}

            {tab === 'leads' && (
              <div className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-black/[0.06] p-6 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[color:var(--dk)]">Leads</h2>
                    <p className="mt-1 max-w-2xl text-sm text-[color:var(--muted)]">
                      <span className="font-bold text-[color:var(--dk)]">Contacts</span> are real enquiries (forms, popup callbacks, and similar).{' '}
                      <span className="font-bold text-[color:var(--dk)]">Visitors</span> are automatic page hits — useful for traffic, not treatment
                      planning.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={leadFilter}
                      onChange={(e) => setLeadFilter(e.target.value)}
                      className="rounded-xl border border-black/10 bg-[color:var(--bg)] px-3 py-2 text-sm font-bold text-[color:var(--dk)]"
                    >
                      <option value="all">All rows ({leads.length})</option>
                      <option value="contacts">Contacts only ({contactLeads.length})</option>
                      <option value="visitors">Visitors only ({visitorLeads.length})</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => fetchLeads()}
                      className="rounded-xl border border-black/10 bg-[color:var(--soft)] px-4 py-2 text-sm font-bold text-[color:var(--dk)] transition hover:bg-white"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead style={{ background: 'var(--deep)' }}>
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">ID</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Name</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Phone / IP</th>
                        <th className="hidden px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 md:table-cell">Email</th>
                        <th className="hidden px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:table-cell">Service</th>
                        <th className="hidden px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:table-cell">Source</th>
                        <th className="hidden px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 xl:table-cell">Created</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leadsLoading ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 rounded-full border-2 border-[color:var(--teal)]/20 border-t-[color:var(--teal)] animate-spin" />
                              <span className="text-xs text-[color:var(--muted)]">Loading leads…</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-3xl">👥</span>
                              <div className="text-sm font-semibold text-[color:var(--dk)]">{searchQuery ? 'No results found' : 'No leads yet'}</div>
                              <div className="text-xs text-[color:var(--muted)]">{searchQuery ? `No leads match "${searchQuery}"` : 'Lead enquiries will appear here'}</div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((l) => {
                          const isVisitor = l.source === 'Website Visit';
                          return (
                            <tr key={l.id} className="admin-table-row border-t border-black/[0.04]">
                              <td className="whitespace-nowrap px-4 py-4 font-mono font-bold text-[color:var(--teal)] lg:px-6">#{l.id}</td>
                              <td className="px-4 py-4 font-bold text-[color:var(--dk)] lg:px-6">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span>{isVisitor ? `Visitor #${l.id}` : l.name}</span>
                                  {isVisitor && (
                                    <span className="inline-flex items-center rounded-full bg-[color:var(--teal)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--teal)]">
                                      Auto
                                    </span>
                                  )}
                                  {!isVisitor && (l.status || 'new') === 'new' && hoursSince(l.createdAt) > 24 && (
                                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 ring-1 ring-red-100">
                                      24h+
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="max-w-[200px] truncate px-4 py-4 lg:max-w-none lg:px-6" title={l.phone}>
                                {l.phone}
                              </td>
                              <td className="hidden px-6 py-4 md:table-cell">{l.email || '—'}</td>
                              <td className="hidden px-6 py-4 lg:table-cell">{l.service || '—'}</td>
                              <td className="hidden px-6 py-4 lg:table-cell">{l.source || '—'}</td>
                              <td className="hidden px-6 py-4 xl:table-cell">{formatDate(l.createdAt)}</td>
                              <td className="px-4 py-4 lg:px-6">
                                <select
                                  value={l.status || 'new'}
                                  onChange={(e) => updateLeadStatus(l.id, e.target.value)}
                                  className="w-full min-w-[8rem] rounded-xl border border-black/10 bg-white px-2 py-2 text-xs font-bold text-[color:var(--dk)] lg:text-sm"
                                >
                                  <option value="new">new</option>
                                  <option value="contacted">contacted</option>
                                  <option value="won">won</option>
                                  <option value="lost">lost</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'gallery' && (
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border border-black/[0.06] bg-white p-8 shadow-sm">
                  <h2 className="font-serif text-xl font-bold text-[color:var(--dk)]">Upload gallery item</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">Assign a category and title before publishing.</p>

                  <form onSubmit={uploadGallery} className="mt-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Category</label>
                      <select
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-[color:var(--bg)] px-4 py-3 font-bold text-[color:var(--dk)] focus:border-[color:var(--teal)] focus:outline-none"
                      >
                        <option value="smile-designing">Smile Designing</option>
                        <option value="aligners">Braces & Aligners</option>
                        <option value="implants">Dental Implants</option>
                        <option value="our-work">Our Works</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Title</label>
                      <input
                        value={galleryTitle}
                        onChange={(e) => setGalleryTitle(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-[color:var(--bg)] px-4 py-3 focus:border-[color:var(--teal)] focus:outline-none"
                        placeholder="e.g. Smile design transformation"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Image</label>
                      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm" />
                    </div>
                    {galleryError && <div className="text-sm font-bold text-red-600">{galleryError}</div>}
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[color:var(--teal)] py-3 font-bold text-white transition hover:bg-[color:var(--dk)]"
                    >
                      Upload
                    </button>
                  </form>
                </div>

                <div className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] p-6">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-[color:var(--dk)]">Gallery items</h2>
                      <p className="text-sm text-[color:var(--muted)]">Shown on public results and gallery views.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchGallery()}
                      className="rounded-xl border border-black/10 bg-[color:var(--soft)] px-4 py-2 text-sm font-bold text-[color:var(--dk)] transition hover:bg-white"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="divide-y divide-black/[0.06]">
                    {galleryLoading ? (
                      <div className="p-6 text-[color:var(--muted)]">Loading…</div>
                    ) : gallery.length === 0 ? (
                      <div className="p-6 text-[color:var(--muted)]">No gallery items yet.</div>
                    ) : (
                      gallery.map((g) => (
                        <div key={g.id} className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center lg:p-6">
                          <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl border border-black/[0.06] bg-[color:var(--soft)] sm:h-16 sm:w-16">
                            <img src={`${API_BASE}${g.image}`} alt={g.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-bold text-[color:var(--dk)]">{g.title}</div>
                            <div className="text-sm text-[color:var(--muted)]">{g.category}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteGallery(g.id)}
                            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 sm:w-auto"
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === 'blog' && <AdminBlogPanel headers={headers} />}

            {tab === 'booking' && (
              <div className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-black/[0.06] p-6 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[color:var(--dk)]">Appointments</h2>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">
                      Default: upcoming visits first. Use filters for history or the full list.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-xl border border-black/10 bg-[color:var(--bg)] p-1">
                      {[
                        { id: 'upcoming', label: 'Upcoming' },
                        { id: 'past', label: 'Past' },
                        { id: 'all', label: 'All' }
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setBookingFilter(f.id)}
                          className={`rounded-lg px-3 py-2 text-xs font-bold transition sm:text-sm ${
                            bookingFilter === f.id
                              ? 'bg-[color:var(--teal)] text-white shadow-sm'
                              : 'text-[color:var(--muted)] hover:text-[color:var(--dk)]'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchBookings()}
                      className="rounded-xl border border-black/10 bg-[color:var(--soft)] px-4 py-2 text-sm font-bold text-[color:var(--dk)] transition hover:bg-white"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                {bookingsError ? (
                  <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                    Could not load appointments: {bookingsError}. Check Runtime logs in Hostinger or open{' '}
                    <a href="/api/db-status" target="_blank" rel="noreferrer" className="underline">
                      /api/db-status
                    </a>
                    .
                  </div>
                ) : null}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead style={{ background: 'var(--deep)' }}>
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">When</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Patient</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Phone</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Email</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Service</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Booked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsLoading ? (
                        <tr><td colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-[color:var(--teal)]/20 border-t-[color:var(--teal)] animate-spin" />
                            <span className="text-xs text-[color:var(--muted)]">Loading bookings…</span>
                          </div>
                        </td></tr>
                      ) : displayedBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-3xl">📅</span>
                              <div className="text-sm font-semibold text-[color:var(--dk)]">No appointments found</div>
                              <div className="text-xs text-[color:var(--muted)]">
                                {bookingFilter === 'upcoming' ? 'No upcoming appointments yet' : bookingFilter === 'past' ? 'No past appointments' : 'No bookings yet'}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        displayedBookings.map(({ b, dt }) => (
                          <tr key={b.id || b._id} className="admin-table-row border-t border-black/[0.04]">
                            <td className="whitespace-nowrap px-4 py-3 font-bold text-[color:var(--teal)] lg:px-6">
                              <div>{b.date || '—'}</div>
                              <div className="text-xs font-semibold text-[color:var(--muted)]">{b.time || ''}</div>
                            </td>
                            <td className="px-4 py-3 font-medium lg:px-6">{b.name}</td>
                            <td className="px-4 py-3 lg:px-6">{b.phone}</td>
                            <td className="max-w-[200px] truncate px-4 py-3 lg:px-6" title={b.email}>
                              {b.email}
                            </td>
                            <td className="px-4 py-3 lg:px-6">{b.service}</td>
                            <td className="px-4 py-3 text-[color:var(--muted)] lg:px-6">{formatDate(b.created_at || b.createdAt)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'ai-preview' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[color:var(--dk)]">AI Preview submissions</h2>
                    <p className="text-sm text-[color:var(--muted)]">
                      Patient before/after photos and contact details from the AI smile preview tool.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchAiPreviews()}
                    className="rounded-xl border border-black/10 bg-[color:var(--soft)] px-4 py-2 text-sm font-bold text-[color:var(--dk)] transition hover:bg-white"
                  >
                    Refresh
                  </button>
                </div>

                {aiPreviewsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[color:var(--teal)]/20 border-t-[color:var(--teal)] animate-spin" />
                    <span className="text-xs text-[color:var(--muted)]">Loading AI previews…</span>
                  </div>
                ) : aiPreviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-black/10 bg-white">
                    <span className="text-4xl">🤖</span>
                    <div className="text-sm font-semibold text-[color:var(--dk)]">No AI preview submissions yet</div>
                    <div className="text-xs text-[color:var(--muted)]">Patients who use the AI Preview tool will appear here</div>
                  </div>
                ) : (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {aiPreviews.map((row) => (
                      <article
                        key={row.id}
                        className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-sm"
                      >
                        <div className="grid grid-cols-2 gap-0 border-b border-black/[0.06]">
                          <div className="relative aspect-[4/5] bg-neutral-100">
                            <img
                              src={mediaUrl(row.beforeImageUrl)}
                              alt="Before"
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                              Before
                            </span>
                          </div>
                          <div className="relative aspect-[4/5] bg-neutral-100">
                            {row.afterImageUrl ? (
                              <img
                                src={mediaUrl(row.afterImageUrl)}
                                alt="After"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center p-4 text-center text-xs text-[color:var(--muted)]">
                                No AI after image generated
                              </div>
                            )}
                            <span className="absolute left-2 top-2 rounded bg-[color:var(--teal)] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                              After
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-[color:var(--dk)]">{row.name}</h3>
                              <p className="text-sm text-[color:var(--muted)]">{row.email}</p>
                              <p className="text-sm text-[color:var(--muted)]">{row.phone}</p>
                            </div>
                            <span className="text-xs text-[color:var(--muted)]">{formatDate(row.createdAt)}</span>
                          </div>
                          {row.analysis?.narrative && (
                            <p className="line-clamp-2 text-sm text-[color:var(--muted)]">{row.analysis.narrative}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <select
                              value={row.status || 'new'}
                              onChange={(e) => updateAiPreviewStatus(row.id, e.target.value)}
                              className="rounded-xl border border-black/10 bg-[color:var(--soft)] px-3 py-2 text-xs font-bold"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="archived">Archived</option>
                            </select>
                            <a
                              href={`https://wa.me/${String(row.phone || '').replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-700 no-underline hover:bg-green-100"
                            >
                              WhatsApp
                            </a>
                            <button
                              type="button"
                              onClick={() => deleteAiPreview(row.id)}
                              className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'reviews' && (
              <div className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.06] p-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[color:var(--dk)]">Reviews</h2>
                    <p className="text-sm text-[color:var(--muted)]">Approve, reject, or remove patient testimonials.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchReviews()}
                    className="rounded-xl border border-black/10 bg-[color:var(--soft)] px-4 py-2 text-sm font-bold text-[color:var(--dk)] transition hover:bg-white"
                  >
                    Refresh
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead style={{ background: 'var(--deep)' }}>
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Name</th>
                        <th className="hidden px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 md:table-cell">Contact</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Rating</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Comment</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Created</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/60 lg:px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewsLoading ? (
                        <tr><td colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-[color:var(--teal)]/20 border-t-[color:var(--teal)] animate-spin" />
                            <span className="text-xs text-[color:var(--muted)]">Loading reviews…</span>
                          </div>
                        </td></tr>
                      ) : filteredReviews.length === 0 ? (
                        <tr><td colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">⭐</span>
                            <div className="text-sm font-semibold text-[color:var(--dk)]">{searchQuery ? 'No results found' : 'No reviews yet'}</div>
                            <div className="text-xs text-[color:var(--muted)]">Patient reviews will appear here after they book</div>
                          </div>
                        </td></tr>
                      ) : (
                        filteredReviews.map((r) => (
                          <tr key={r.id} className="admin-table-row border-t border-black/[0.04]">
                            <td className="px-4 py-3 font-bold text-[color:var(--dk)] lg:px-6">{r.name || 'Anonymous'}</td>
                            <td className="hidden px-6 py-3 text-[color:var(--muted)] md:table-cell">
                              {r.email}
                              <br />
                              {r.phone}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-amber-500 lg:px-6">
                              {'★'.repeat(r.rating)}
                              {'☆'.repeat(5 - r.rating)}
                            </td>
                            <td className="max-w-xs truncate px-4 py-3 lg:max-w-md lg:px-6" title={r.comment}>
                              {r.comment}
                            </td>
                            <td className="px-4 py-3 text-[color:var(--muted)] lg:px-6">{formatDate(r.createdAt)}</td>
                            <td className="px-4 py-3 lg:px-6">
                              <div className="flex flex-wrap items-center gap-2">
                                <select
                                  value={r.status || 'pending'}
                                  onChange={(e) => updateReviewStatus(r.id, e.target.value)}
                                  className={`rounded-xl border bg-white px-2 py-2 text-xs font-bold lg:text-sm ${
                                    r.status === 'published'
                                      ? 'border-green-500 text-green-700'
                                      : r.status === 'rejected'
                                        ? 'border-red-500 text-red-700'
                                        : 'border-amber-400 text-amber-800'
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="published">Published</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => deleteReview(r.id)}
                                  className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 lg:text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

