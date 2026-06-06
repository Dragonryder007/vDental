import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { API_BASE, formatBlogDate, getCategoryStyle, mediaUrl } from '../utils/blogHelpers';

export default function BlogLatestSection() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE}/api/blog?limit=3`)
      .then((res) => {
        if (!cancelled) setPosts(res.data?.posts?.slice(0, 3) || []);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-black/5 bg-[color:var(--soft)] px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)]">
              {t('nav.blog')}
            </div>
            <h2 className="font-serif text-4xl font-bold text-[color:var(--dk)] md:text-5xl">
              Latest <span className="italic text-[color:var(--teal)]">Insights</span>
            </h2>
            <p className="mt-4 max-w-xl text-[color:var(--muted)]">
              Expert guides on treatments, costs, and planning your smile journey in Bangalore.
            </p>
          </div>
          <Link
            to="/blog"
            className="rounded-2xl border border-black/10 bg-[color:var(--soft)] px-6 py-3 font-bold text-[color:var(--dk)] no-underline transition hover:border-[color:var(--teal)] hover:text-[color:var(--teal)]"
          >
            View all articles â†’
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => {
            const style = getCategoryStyle(post.category);
            return (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-[color:var(--bg)] no-underline shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`aspect-[16/10] bg-gradient-to-br ${style.gradient}`}>
                  {post.featuredImage ? (
                    <img src={mediaUrl(post.featuredImage)} alt="" className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">
                    <span className={`rounded-full px-2.5 py-0.5 ${style.badge}`}>{post.category}</span>
                    <span>{post.readTimeMinutes || 5} min</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold leading-snug text-[color:var(--dk)] group-hover:text-[color:var(--teal)]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 flex-1 text-sm text-[color:var(--muted)]">{post.excerpt}</p>
                  <p className="mt-4 text-xs font-medium text-[color:var(--muted)]">{formatBlogDate(post.publishedAt || post.createdAt)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

