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
    <section className="bg-[color:var(--cream)] py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-black/5 bg-[color:var(--green-light)] px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--green)]">
              {t('nav.blog')}
            </div>
            <h2 className="font-display text-4xl font-light tracking-tight leading-[1.08] text-[color:var(--charcoal)] md:text-5xl">
              Latest <span className="italic text-[color:var(--green)]">Insights</span>
            </h2>
            <p className="mt-4 max-w-xl text-[color:var(--warm-gray)] font-light">
              Expert guides on treatments, costs, and planning your smile journey in Bangalore.
            </p>
          </div>
          <Link
            to="/blog"
            className="rounded-sharp border border-black/10 bg-[color:var(--cream-dark)] px-6 py-3 font-bold text-[color:var(--charcoal)] no-underline transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
          >
            View all articles →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => {
            const style = getCategoryStyle(post.category);
            return (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-sharp border border-black/5 bg-[color:var(--cream-dark)] no-underline shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`aspect-[16/10] bg-gradient-to-br ${style.gradient}`}>
                  {post.featuredImage ? (
                    <img src={mediaUrl(post.featuredImage)} alt="" className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-[color:var(--warm-gray)]">
                    <span className={`rounded-full px-2.5 py-0.5 ${style.badge}`}>{post.category}</span>
                    <span>{post.readTimeMinutes || 5} min</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold leading-snug text-[color:var(--charcoal)] group-hover:text-[color:var(--green)]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 flex-1 text-sm text-[color:var(--warm-gray)]">{post.excerpt}</p>
                  <p className="mt-4 text-xs font-medium text-[color:var(--warm-gray)]">{formatBlogDate(post.publishedAt || post.createdAt)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

