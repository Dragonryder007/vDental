import React, { useState, useRef } from 'react';

/**
 * Mobile-only stories-style carousel for doctor photos.
 * Wrap with "sm:hidden" at the call site.
 * Desktop cards stay in each page unchanged.
 */
export default function DoctorMobileCarousel({ doctors }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const carouselRef = useRef(null);
  const cardRefs = useRef([]);

  if (!doctors?.length) return null;

  const multi = doctors.length > 1;

  function scrollTo(idx) {
    const clamped = Math.max(0, Math.min(doctors.length - 1, idx));
    setActiveIdx(clamped);
    const container = carouselRef.current;
    const card = cardRefs.current[clamped];
    if (container && card) container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  }

  return (
    <div>
      {/* Progress bars — multi-doctor only */}
      {multi && (
        <div className="flex gap-1.5 mb-3">
          {doctors.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(201,162,74,0.22)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ background: '#C9A24A', width: i <= activeIdx ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Scroll container */}
      <div
        ref={carouselRef}
        className={`rounded-2xl overflow-hidden${multi ? ' flex overflow-x-auto no-scrollbar snap-x snap-mandatory carousel-x' : ''}`}
        onScroll={multi ? (e) => {
          const el = e.currentTarget;
          let closestIdx = 0, closestDist = Infinity;
          cardRefs.current.forEach((card, idx) => {
            if (!card) return;
            const dist = Math.abs(card.offsetLeft - el.scrollLeft);
            if (dist < closestDist) { closestDist = dist; closestIdx = idx; }
          });
          setActiveIdx(closestIdx);
        } : undefined}
      >
        {doctors.map((doc, i) => (
          <div
            key={doc.id ?? i}
            ref={(el) => (cardRefs.current[i] = el)}
            className={`relative flex flex-col overflow-hidden${multi ? ' flex-shrink-0 w-full snap-start' : ''}`}
            style={{ minHeight: '72vh', background: '#0f1e12' }}
          >
            {/* Full-bleed photo */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${doc.image})`,
                backgroundSize: doc.photoSize || 'cover',
                backgroundPosition: doc.photoPosition || '50% 10%',
                backgroundRepeat: 'no-repeat',
              }}
            />
            {/* Dark gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.28) 52%, rgba(0,0,0,0.04) 100%)' }}
            />

            <div className="flex-1" />

            {/* Bottom content */}
            <div className="relative z-30 px-6 pb-10 pt-12">
              <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-1">{doc.name}</h3>
              <p className="text-sm font-semibold mb-1" style={{ color: '#C9A24A' }}>{doc.title}</p>
              <p className="text-xs mb-5" style={{ color: 'rgba(250,246,240,0.55)' }}>{doc.experience}</p>
              {doc.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {doc.specialties.slice(0, 2).map((s, j) => (
                    <span
                      key={j}
                      className="text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full"
                      style={{ background: 'rgba(201,162,74,0.14)', border: '1px solid rgba(201,162,74,0.35)', color: '#C9A24A' }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tap zones — prev/next */}
            {multi && (
              <>
                <button
                  type="button" aria-label="Previous doctor"
                  className="absolute left-0 top-0 w-1/3 z-20"
                  style={{ bottom: '7rem', background: 'none', border: 'none' }}
                  onClick={() => scrollTo(i - 1)}
                />
                <button
                  type="button" aria-label="Next doctor"
                  className="absolute right-0 top-0 w-1/3 z-20"
                  style={{ bottom: '7rem', background: 'none', border: 'none' }}
                  onClick={() => scrollTo(i + 1)}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
