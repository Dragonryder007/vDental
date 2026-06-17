import React from 'react';
import { PLATFORM_REVIEWS, REVIEW_PLATFORM_LINKS } from '../data/platformReviews';
import { PLATFORM_META } from './icons/PlatformIcons';

const reviews = [...PLATFORM_REVIEWS, ...PLATFORM_REVIEWS];

const PlatformReviewsCarousel = () => (
  <div className="relative group overflow-hidden">
    <div className="marquee-container gap-5 sm:gap-6">
      {reviews.map((review, idx) => {
        const meta = PLATFORM_META[review.platform];
        const { Icon, label, starColor, brandColor } = meta;
        return (
          <a
            key={idx}
            href={REVIEW_PLATFORM_LINKS[review.platform]}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[300px] sm:w-[360px] flex-shrink-0 bg-[color:var(--cream)] rounded-sharp border border-black/5 shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon className="w-7 h-7 rounded-md shadow-sm flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: brandColor }}>{label}</span>
              </div>
              <div className="flex gap-0.5" style={{ color: starColor }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 1.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L10 14.7l-5.2 2.8 1-5.8L1.5 7.6l5.9-.8L10 1.5Z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-[rgb(var(--charcoal-rgb)/75%)] text-sm leading-relaxed mb-6 flex-grow font-light line-clamp-5">
              {review.text}
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-black/5">
              <div className="w-10 h-10 rounded-full bg-[color:var(--green)] text-white flex items-center justify-center font-bold font-display flex-shrink-0">
                {(review.name || 'A')[0].toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-[color:var(--charcoal)] text-sm">{review.name}</div>
                <div className="text-xs text-[color:var(--warm-gray)] uppercase tracking-wide">via {label}</div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  </div>
);

export default PlatformReviewsCarousel;
