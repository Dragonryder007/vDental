import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, BLOG_CATEGORIES, formatBlogDate, mediaUrl } from '../utils/blogHelpers';

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'General',
  author: 'V Dental and Implant Center',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  serviceLink: '',
  readTimeMinutes: '',
  status: 'draft',
};

const SERVICE_LINKS = [
  { label: 'None', value: '' },
  { label: 'Invisalign Bangalore', value: '/invisalign-bangalore' },
  { label: 'Dental Implants Bangalore', value: '/dental-implants-bangalore' },
  { label: 'Veneers Bangalore', value: '/veneers-bangalore' },
  { label: 'Smile Makeover Bangalore', value: '/smile-makeover-bangalore' },
  { label: 'Full Mouth Rehabilitation', value: '/full-mouth-rehabilitation-bangalore' },
  { label: 'All-on-4 Implants', value: '/all-on-4-implants-bangalore' },
  { label: 'Dental Tourism India', value: '/dental-tourism-india' },
  { label: 'Booking', value: '/booking' },
];

export default function AdminBlogPanel({ headers }) {
  const editorRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // AI Blog Generator state
  const [aiTopic, setAiTopic]   = useState('');
  const [aiTone, setAiTone]     = useState('professional');
  const [aiLength, setAiLength] = useState('medium');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError]   = useState('');
  const [aiGenerated, setAiGenerated] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/blog`, { headers });
      setPosts(res.data?.posts || []);
    } catch {
      setPosts([]);
      setError('Could not load blog posts. Please refresh or sign in again.');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setRemoveImage(false);
    setPreviewImage('');
    setError('');
    setSuccess('');
  };

  const scrollToEditor = () => {
    requestAnimationFrame(() => {
      editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const generateBlog = async () => {
    if (!aiTopic.trim()) { setAiError('Please enter a topic.'); return; }
    setAiLoading(true);
    setAiError('');
    setAiGenerated(false);
    try {
      const { data } = await axios.post(`${API_BASE}/api/generate-blog`, {
        topic: aiTopic.trim(),
        tone: aiTone,
        length: aiLength,
      }, { headers });
      // Auto-fill the form with AI content
      setForm(prev => ({
        ...prev,
        title:           data.title           || prev.title,
        excerpt:         data.excerpt          || prev.excerpt,
        content:         data.content          || prev.content,
        metaTitle:       data.metaTitle        || prev.metaTitle,
        metaDescription: data.metaDescription  || prev.metaDescription,
        metaKeywords:    data.metaKeywords     || prev.metaKeywords,
        slug: data.title
          ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : prev.slug,
      }));
      setAiGenerated(true);
      scrollToEditor();
    } catch (err) {
      const msg = err?.response?.data?.error || 'Blog generation failed. Please try again.';
      setAiError(msg);
    } finally {
      setAiLoading(false);
    }
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'General',
      author: post.author || 'V Dental and Implant Center',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      metaKeywords: post.metaKeywords || '',
      serviceLink: post.serviceLink || '',
      readTimeMinutes: post.readTimeMinutes ? String(post.readTimeMinutes) : '',
      status: post.status || 'draft',
    });
    setImageFile(null);
    setRemoveImage(false);
    setPreviewImage(post.featuredImage ? mediaUrl(post.featuredImage) : '');
    setError('');
    setSuccess('');
    scrollToEditor();
  };

  const startCreate = () => {
    resetForm();
    scrollToEditor();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      scrollToEditor();
      return;
    }

    setSaving(true);
    try {
      const needsMultipart = Boolean(imageFile) || removeImage;

      if (editingId) {
        if (needsMultipart) {
          const fd = new FormData();
          Object.entries(form).forEach(([k, v]) => fd.append(k, v));
          if (imageFile) fd.append('featuredImage', imageFile);
          if (removeImage) fd.append('removeFeaturedImage', 'true');
          await axios.put(`${API_BASE}/api/admin/blog/${editingId}`, fd, { headers });
        } else {
          await axios.put(`${API_BASE}/api/admin/blog/${editingId}`, form, { headers });
        }
      } else if (needsMultipart) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (imageFile) fd.append('featuredImage', imageFile);
        await axios.post(`${API_BASE}/api/admin/blog`, fd, { headers });
      } else {
        await axios.post(`${API_BASE}/api/admin/blog`, form, { headers });
      }

      setSuccess(editingId ? 'Blog post updated successfully.' : 'Blog post saved successfully.');
      resetForm();
      await fetchPosts();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed. Please try again.');
      scrollToEditor();
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this blog post permanently?')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/blog/${id}`, { headers });
      if (editingId === id) resetForm();
      setSuccess('Blog post deleted.');
      await fetchPosts();
    } catch {
      setError('Delete failed.');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-black/10 bg-[color:var(--bg)] px-4 py-3 text-sm focus:border-[color:var(--teal)] focus:outline-none';

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.06] p-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[color:var(--dk)]">All blog posts</h2>
            <p className="text-sm text-[color:var(--muted)]">
              {posts.length} total — click Edit to load a post into the editor below.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startCreate}
              className="rounded-xl bg-[color:var(--teal)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[color:var(--dk)]"
            >
              + New post
            </button>
            <button
              type="button"
              onClick={fetchPosts}
              className="rounded-xl border border-black/10 bg-[color:var(--soft)] px-4 py-2 text-sm font-bold text-[color:var(--dk)] transition hover:bg-white"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="divide-y divide-black/[0.06]">
          {loading ? (
            <div className="p-6 text-[color:var(--muted)]">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="p-6 text-[color:var(--muted)]">No blog posts yet. Create one below.</div>
          ) : (
            posts.map((p) => (
              <div
                key={p.id}
                className={`flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:p-6 ${
                  editingId === p.id ? 'bg-[color:var(--teal)]/5 ring-1 ring-inset ring-[color:var(--teal)]/20' : ''
                }`}
              >
                <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-[color:var(--soft)] lg:h-16 lg:w-24">
                  {p.featuredImage ? (
                    <img src={mediaUrl(p.featuredImage)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-bold text-[color:var(--muted)]">No img</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>
                      {p.status}
                    </span>
                    <span className="text-xs text-[color:var(--muted)]">{p.category}</span>
                    {editingId === p.id && (
                      <span className="rounded-full bg-[color:var(--teal)] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        Editing
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 truncate font-bold text-[color:var(--dk)]">{p.title}</h3>
                  <p className="text-xs text-[color:var(--muted)]">
                    /blog/{p.slug} · {formatBlogDate(p.publishedAt || p.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.status === 'published' && (
                    <Link
                      to={`/blog/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold text-[color:var(--teal)] no-underline hover:bg-[color:var(--soft)]"
                    >
                      View
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold text-[color:var(--dk)] hover:bg-[color:var(--soft)]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(p.id)}
                    className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── AI Blog Writer ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[color:var(--teal)]/20 bg-gradient-to-r from-[color:var(--deep)] to-[color:var(--dk)] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">🤖</div>
          <div>
            <div className="text-sm font-bold text-white">AI Blog Writer</div>
            <div className="text-xs text-white/55 mt-0.5">Generate a full SEO-optimised blog post with Gemini AI</div>
          </div>
          {aiGenerated && (
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-[11px] font-bold px-3 py-1">
              ✓ Content generated
            </span>
          )}
        </div>

        {/* Topic input */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 mb-1.5">Blog Topic</label>
          <input
            type="text"
            value={aiTopic}
            onChange={e => setAiTopic(e.target.value)}
            placeholder="e.g. Benefits of Invisalign for adults in Bangalore"
            className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            onFocus={e => e.target.style.border = '1px solid rgba(201,162,74,0.6)'}
            onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.15)'}
            onKeyDown={e => e.key === 'Enter' && generateBlog()}
          />
        </div>

        {/* Tone + Length selectors */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 mb-1.5">Tone</label>
            <div className="flex gap-2">
              {[['professional','🎯 Professional'],['friendly','😊 Friendly'],['educational','📚 Educational']].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAiTone(val)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    aiTone === val
                      ? 'bg-[#C9A24A] text-[#0a1a0a]'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ border: aiTone === val ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 mb-1.5">Length</label>
            <div className="flex gap-2">
              {[['short','Short\n~300w'],['medium','Medium\n~600w'],['long','Long\n~1000w']].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAiLength(val)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold whitespace-pre-line leading-tight transition-all ${
                    aiLength === val
                      ? 'bg-[#C9A24A] text-[#0a1a0a]'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ border: aiLength === val ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {aiError && (
          <div className="mb-4 rounded-xl bg-red-500/15 border border-red-400/25 px-4 py-2.5 text-xs font-semibold text-red-300">
            ✕ {aiError}
          </div>
        )}

        {/* Generate / Regenerate buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={generateBlog}
            disabled={aiLoading || !aiTopic.trim()}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg, #C9A24A, #dbb95e)', color: '#0a1a0a', boxShadow: '0 6px 20px rgba(201,162,74,0.35)' }}
          >
            {aiLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-[#0a1a0a]/20 border-t-[#0a1a0a] animate-spin" />
                Generating…
              </>
            ) : aiGenerated ? '↻ Regenerate' : '✨ Generate Blog Post'}
          </button>
          {aiGenerated && (
            <button
              type="button"
              onClick={() => { setAiGenerated(false); setAiTopic(''); scrollToEditor(); }}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/60 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            >
              Clear & Write Manually
            </button>
          )}
        </div>

        {aiGenerated && (
          <p className="mt-3 text-[11px] text-white/40">
            ✓ Content filled below — review, edit if needed, then publish. Click Regenerate for a fresh version.
          </p>
        )}
      </div>

      <div
        ref={editorRef}
        id="blog-admin-editor"
        className="scroll-mt-24 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm md:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[color:var(--dk)]">
              {editingId ? 'Edit blog post' : 'Create blog post'}
            </h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              {editingId
                ? `Editing post #${editingId} — change fields and click Update post.`
                : 'Write HTML in the content field (h2, h3, p, ul, ol, strong). Publish when ready.'}
            </p>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold text-[color:var(--dk)] hover:bg-[color:var(--soft)]"
            >
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Article title" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">URL slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="auto-from-title if empty" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Excerpt</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className={inputClass} placeholder="Short summary for listing cards" />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Content (HTML) *</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={14}
              className={`${inputClass} font-mono text-xs leading-relaxed`}
              placeholder="<p>Your article...</p>"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Author</label>
            <input name="author" value={form.author} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Service page link (CTA)</label>
            <select name="serviceLink" value={form.serviceLink} onChange={handleChange} className={inputClass}>
              {SERVICE_LINKS.map((l) => (
                <option key={l.value || 'none'} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Read time (minutes)</label>
            <input name="readTimeMinutes" value={form.readTimeMinutes} onChange={handleChange} type="number" min="1" className={inputClass} placeholder="Auto if empty" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">SEO title</label>
            <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">SEO keywords</label>
            <input name="metaKeywords" value={form.metaKeywords} onChange={handleChange} className={inputClass} />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">SEO description</label>
            <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={2} className={inputClass} />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">Featured image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                setRemoveImage(false);
                if (file) setPreviewImage(URL.createObjectURL(file));
              }}
              className="w-full text-sm"
            />
            {previewImage && (
              <div className="mt-3 flex items-start gap-4">
                <img src={previewImage} alt="" className="h-24 w-40 rounded-xl border border-black/10 object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setPreviewImage('');
                    setRemoveImage(true);
                  }}
                  className="text-sm font-bold text-red-600"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          {error && <p className="lg:col-span-2 text-sm font-bold text-red-600" role="alert">{error}</p>}
          {success && <p className="lg:col-span-2 text-sm font-bold text-green-700" role="status">{success}</p>}

          <div className="lg:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[color:var(--teal)] px-8 py-3 font-bold text-white transition hover:bg-[color:var(--dk)] disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Update post' : 'Publish / save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

