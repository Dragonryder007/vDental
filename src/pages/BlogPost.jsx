import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import {
  API_BASE,
  formatBlogDate,
  getCategoryStyle,
  injectHeadingIds,
  mediaUrl,
} from '../utils/blogHelpers';

function TableOfContents({ headings }) {
  if (!headings.length) return null;
  return (
    <nav className="rounded-2xl border border-black/5 bg-[color:var(--soft)] p-5 md:p-6" aria-label="Table of contents">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">In this article</h2>
      <ol className="space-y-2 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 'h3' ? 'ml-4' : ''}>
            <a href={`#${h.id}`} className="font-medium text-[color:var(--dk)] no-underline transition hover:text-[color:var(--teal)]">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function RelatedCard({ post }) {
  const style = getCategoryStyle(post.category);
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className={`aspect-[16/9] bg-gradient-to-br ${style.gradient}`}>
        {post.featuredImage ? (
          <img src={mediaUrl(post.featuredImage)} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className={`mb-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${style.badge}`}>
          {post.category}
        </span>
        <h3 className="font-serif text-lg font-bold leading-snug text-[color:var(--dk)] group-hover:text-[color:var(--teal)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-[color:var(--muted)]">{post.excerpt}</p>
      </div>
    </Link>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await axios.get(`${API_BASE}/api/blog/${encodeURIComponent(slug)}`);
        if (!cancelled) {
          setPost(res.data?.post || null);
          setRelated(res.data?.related || []);
        }
      } catch (err) {
        if (!cancelled) {
          setPost(null);
          setRelated([]);
          if (err.response?.status === 404) setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const contentWithIds = useMemo(() => injectHeadingIds(post?.content || ''), [post?.content]);

  const headings = useMemo(() => {
    if (!contentWithIds) return [];
    const div = document.createElement('div');
    div.innerHTML = contentWithIds;
    const list = [];
    div.querySelectorAll('h2, h3').forEach((el) => {
      const text = el.textContent?.trim();
      const id = el.getAttribute('id');
      if (text && id) list.push({ id, text, level: el.tagName.toLowerCase() });
    });
    return list;
  }, [contentWithIds]);

  const style = getCategoryStyle(post?.category);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[color:var(--bg)] pt-28">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6 px-6 py-16">
          <div className="h-8 w-1/3 rounded bg-black/5" />
          <div className="h-12 rounded bg-black/5" />
          <div className="h-64 rounded-3xl bg-black/5" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 rounded bg-black/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <SEO title="Article Not Found" canonicalPath={`/blog/${slug}`} />
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[color:var(--soft)] px-6 pt-24 text-center">
          <h1 className="font-serif text-4xl font-bold text-[color:var(--dk)]">Article not found</h1>
          <p className="mt-4 text-[color:var(--muted)]">This post may have been removed or unpublished.</p>
          <Link to="/blog" className="mt-8 rounded-2xl bg-[color:var(--teal)] px-8 py-3 font-bold text-white no-underline">
            Back to Blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        keywords={post.metaKeywords}
        canonicalPath={`/blog/${post.slug}`}
        article={{
          title: post.title,
          author: post.author,
          publishedAt: post.publishedAt || post.createdAt,
          modifiedAt: post.publishedAt || post.createdAt,
          image: post.featuredImage ? mediaUrl(post.featuredImage) : undefined,
        }}
        ogType="article"
      />

      <article className="bg-[color:var(--bg)] pb-20 pt-24 md:pt-28">
        <header className="relative overflow-hidden border-b border-black/5 bg-[color:var(--soft)]">
          <div className={`absolute inset-0 opacity-[0.07] bg-gradient-to-br ${style.gradient}`} />
          <div className="relative mx-auto max-w-4xl px-6 py-12 md:py-16">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]" aria-label="Breadcrumb">
              <Link to="/" className="font-medium no-underline hover:text-[color:var(--teal)]">Home</Link>
              <span aria-hidden>/</span>
              <Link to="/blog" className="font-medium no-underline hover:text-[color:var(--teal)]">Blog</Link>
              <span aria-hidden>/</span>
              <span className="truncate font-medium text-[color:var(--dk)]">{post.category}</span>
            </nav>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">
              <span className={`rounded-full px-3 py-1 ${style.badge}`}>{post.category}</span>
              <time dateTime={post.publishedAt || post.createdAt}>{formatBlogDate(post.publishedAt || post.createdAt)}</time>
              <span aria-hidden>·</span>
              <span>{post.readTimeMinutes || 5} min read</span>
            </div>

            <h1 className="font-serif text-3xl font-bold leading-tight text-[color:var(--dk)] md:text-5xl md:leading-[1.1]">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[color:var(--muted)]">{post.excerpt}</p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--teal)] font-serif text-lg font-bold text-white">
                {(post.author || 'V')[0]}
              </div>
              <div>
                <p className="font-bold text-[color:var(--dk)]">{post.author}</p>
                <p className="text-sm text-[color:var(--muted)]">V Dental and Implant Center · Indiranagar, Bangalore</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto max-w-5xl px-6 pb-0">
            <div className="overflow-hidden rounded-t-[2rem] shadow-2xl shadow-black/10 md:rounded-[2rem]">
              {post.featuredImage ? (
                <img
                  src={mediaUrl(post.featuredImage)}
                  alt={post.title}
                  className="aspect-[21/9] w-full object-cover md:aspect-[2/1]"
                />
              ) : (
                <div className={`flex aspect-[21/9] w-full items-center justify-center bg-gradient-to-br ${style.gradient} md:aspect-[2/1]`}>
                  <span className="font-serif text-2xl font-bold text-white/90 md:text-4xl">{post.category}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-12 lg:grid-cols-[240px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents headings={headings} />
            </div>
          </aside>

          <div>
            {headings.length > 0 && (
              <div className="mb-8 lg:hidden">
                <TableOfContents headings={headings} />
              </div>
            )}

            <div
              className="blog-article prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            {post.serviceLink && (
              <div className="mt-12 overflow-hidden rounded-3xl border border-[color:var(--teal)]/20 bg-gradient-to-br from-[color:var(--soft)] to-white p-8 md:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)]">Next step</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-[color:var(--dk)] md:text-3xl">
                  Explore this treatment at our clinic
                </h2>
                <p className="mt-3 max-w-xl text-[color:var(--muted)]">
                  Book a consultation to receive a personalised assessment, transparent pricing, and a treatment timeline.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={post.serviceLink}
                    className="inline-flex items-center justify-center rounded-2xl bg-[color:var(--teal)] px-6 py-3.5 font-bold text-white no-underline transition hover:bg-[color:var(--dk)]"
                  >
                    View treatment page
                  </Link>
                  <Link
                    to={`/booking?service=${encodeURIComponent(post.category)}`}
                    className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3.5 font-bold text-[color:var(--dk)] no-underline transition hover:border-[color:var(--teal)]"
                  >
                    Book consultation
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-8">
              <Link to="/blog" className="inline-flex items-center gap-2 font-bold text-[color:var(--teal)] no-underline">
                ← All articles
              </Link>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} — https://www.vdentalandimplantcenter.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold text-[color:var(--dk)] no-underline transition hover:bg-[color:var(--soft)]"
              >
                Share on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-20 max-w-6xl border-t border-black/5 px-6 pt-16">
            <h2 className="font-serif text-3xl font-bold text-[color:var(--dk)]">Related articles</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <RelatedCard key={r.id} post={r} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

