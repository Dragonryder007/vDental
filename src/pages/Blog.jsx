import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import {
  API_BASE,
  BLOG_CATEGORIES,
  formatBlogDate,
  getCategoryStyle,
  mediaUrl,
} from '../utils/blogHelpers';

function BlogCard({ post, featured = false }) {
  const style = getCategoryStyle(post.category);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--teal)]/20 hover:shadow-xl ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      <Link
        to={`/blog/${post.slug}`}
        className={`relative block shrink-0 overflow-hidden bg-gradient-to-br ${style.gradient} ${
          featured ? 'md:w-[45%] min-h-[220px]' : 'aspect-[16/10]'
        }`}
      >
        {post.featuredImage ? (
          <img
            src={mediaUrl(post.featuredImage)}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full min-h-[180px] flex-col items-start justify-end p-6 text-white">
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              {post.category}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
      </Link>

      <div className={`flex flex-1 flex-col p-6 ${featured ? 'md:p-8' : ''}`}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">
          <span className={`rounded-full px-3 py-1 ${style.badge}`}>{post.category}</span>
          <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
          <span aria-hidden>·</span>
          <span>{post.readTimeMinutes || 5} min read</span>
        </div>

        <Link to={`/blog/${post.slug}`} className="no-underline">
          <h2
            className={`font-serif font-bold leading-snug text-[color:var(--dk)] transition-colors group-hover:text-[color:var(--teal)] ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
            }`}
          >
            {post.title}
          </h2>
        </Link>

        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[color:var(--muted)] line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-black/5 pt-5">
          <span className="text-sm font-medium text-[color:var(--muted)]">{post.author}</span>
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--teal)] no-underline transition hover:gap-3"
          >
            Read article
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Blog() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/blog`);
        if (!cancelled) setPosts(res.data?.posts || []);
      } catch {
        if (!cancelled) {
          setError('Unable to load articles right now.');
          setPosts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const fromPosts = [...new Set(posts.map((p) => p.category).filter(Boolean))];
    return ['All', ...BLOG_CATEGORIES.filter((c) => fromPosts.includes(c) || c === 'General'), ...fromPosts.filter((c) => !BLOG_CATEGORIES.includes(c))];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      const catOk = activeCategory === 'All' || p.category === activeCategory;
      const searchOk =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [posts, activeCategory, search]);

  const [featured, ...rest] = filtered;

  return (
    <>
      <SEO
        title="Dental Health Blog"
        description="Expert dental guides on Invisalign, implants, veneers, smile makeovers, All-on-4, and dental tourism — from V Dental and Implant Center, Bangalore."
        keywords="dental blog Bangalore, Invisalign guide, dental implants India, smile makeover tips, dental tourism NRI"
        canonicalPath="/blog"
      />

      <section className="relative overflow-hidden bg-[color:var(--soft)] pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[color:var(--teal)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-black/5 bg-white px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[color:var(--teal)] shadow-[0_0_8px_rgba(0,102,102,0.5)]" />
            {t('nav.blog') || 'Blog'}
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight text-[color:var(--dk)] md:text-6xl">
            Expert Dental <span className="italic text-[color:var(--teal)]">Insights</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)]">
            Practical guides on treatments, costs, recovery, and planning your smile — written by our clinical team in Bangalore.
          </p>
        </div>
      </section>

      <section className="border-b border-black/5 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeCategory === cat
                    ? 'bg-[color:var(--teal)] text-white shadow-md'
                    : 'bg-[color:var(--soft)] text-[color:var(--dk)] hover:bg-[color:var(--teal)]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-sm">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-2xl border border-black/10 bg-[color:var(--bg)] py-3 pl-4 pr-10 text-sm focus:border-[color:var(--teal)] focus:outline-none"
              aria-label="Search blog articles"
            />
            <svg className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--bg)] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-[2rem] bg-white shadow-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-700">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-black/5 bg-white p-12 text-center">
              <p className="text-lg font-medium text-[color:var(--muted)]">No articles match your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                }}
                className="mt-4 font-bold text-[color:var(--teal)]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featured && <BlogCard post={featured} featured />}
              {rest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-black/5 bg-[color:var(--deep)] py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">Ready for a personalised consultation?</h2>
          <p className="mt-4 text-white/70">
            Our team in Indiranagar can assess your case and recommend the right treatment plan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/booking"
              className="rounded-2xl bg-[color:var(--teal)] px-8 py-4 font-bold text-white no-underline shadow-lg transition hover:bg-white hover:text-[color:var(--dk)]"
            >
              Book Appointment
            </Link>
            <a
              href="https://wa.me/919037151894"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/20 px-8 py-4 font-bold text-white no-underline transition hover:bg-white/10"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

