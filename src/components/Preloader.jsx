import React, { useEffect, useRef, useState } from 'react';
import logo from '../images/logo.webp';

const CLINIC_NAME = 'V Dental & Implant Center';

const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const Preloader = () => {
  const [visible] = useState(() => !sessionStorage.getItem('preloaderShown'));
  const [mounted, setMounted] = useState(() => !sessionStorage.getItem('preloaderShown'));
  const wrapperRef   = useRef(null);
  const contentRef   = useRef(null);
  const innerRingRef = useRef(null);
  const irisRef      = useRef(null);

  useEffect(() => {
    if (!visible) { setMounted(false); return; }

    const r = 62;
    const circ = 2 * Math.PI * r;
    if (innerRingRef.current) {
      innerRingRef.current.style.strokeDasharray  = circ;
      innerRingRef.current.style.strokeDashoffset = circ;
    }

    document.body.style.overflow = 'hidden';

    let ctx;
    import('../utils/gsap').then(({ gsap }) => {
    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete() {
          if (wrapperRef.current) wrapperRef.current.style.pointerEvents = 'none';
          document.body.style.overflow = '';
          sessionStorage.setItem('preloaderShown', 'true');
          setMounted(false);
        },
      });

      /* ── Outer ring spins independently ── */
      gsap.to('.pl-outer-ring', {
        rotation: 360,
        transformOrigin: '88px 88px',
        duration: 4,
        ease: 'none',
        repeat: -1,
      });

      /* ── INTRO ── */
      tl.from('.pl-glow', { scale: 0, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.15)
        .from('.pl-logo-box', { scale: 0.55, opacity: 0, duration: 0.8, ease: 'back.out(1.8)' }, 0.22)
        .to(innerRingRef.current, { strokeDashoffset: 0, duration: 1.35, ease: 'power2.inOut' }, 0.32)
        .fromTo('.pl-prog-fill', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1.35, ease: 'power2.inOut' }, 0.32)
        .from('.pl-dot', { scale: 0, opacity: 0, duration: 0.3, ease: 'back.out(2.5)' }, 1.15)
        .from('.pl-shimmer', { x: '-180%', duration: 0.65, ease: 'power2.inOut' }, 1.05)
        .fromTo('.pl-line', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, 1.2)
        .from('.pl-letter', { opacity: 0, y: 18, duration: 0.45, stagger: 0.032, ease: 'power2.out' }, 1.38)
        .from('.pl-tagline', { opacity: 0, y: 8, duration: 0.4, ease: 'power2.out' }, 2.0)

        /* ── EXIT: content fades out ── */
        .to(contentRef.current, { opacity: 0, scale: 0.94, duration: 0.4, ease: 'power2.in' }, 2.72)

        /* ── EXIT: iris expands from center to fill screen ── */
        .set(irisRef.current, { opacity: 1 }, 2.80)
        .to(irisRef.current, { scale: 1, duration: 0.75, ease: 'power3.in' }, 2.85)

        /* ── EXIT: entire wrapper fades out revealing site ── */
        .to(wrapperRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 3.55);
    }); // end gsap.context
    }); // end import().then

    return () => {
      ctx?.revert();
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!mounted) return null;

  return (
    <div ref={wrapperRef} className="fixed inset-0 z-[9999]" aria-hidden="true">

      {/* Background */}
      <div className="absolute inset-0" style={{ background: '#0a1509' }}>
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: GRAIN_SVG }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(2,138,15,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 inset-x-0 h-[2px]" style={{ background: 'rgba(201,162,74,0.12)' }}>
          <div className="pl-prog-fill h-full" style={{ background: 'linear-gradient(90deg, #C9A24A, #e8c96a)' }} />
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">

        <div className="relative flex items-center justify-center mb-6 sm:mb-8">
          <div className="pl-glow absolute rounded-full pointer-events-none"
            style={{ width: 160, height: 160, background: 'radial-gradient(circle, rgba(2,138,15,0.4) 0%, transparent 65%)', filter: 'blur(20px)' }}
          />
          <svg width="176" height="176" viewBox="0 0 176 176" className="absolute" style={{ overflow: 'visible' }}>
            <circle className="pl-outer-ring" cx="88" cy="88" r="80" fill="none"
              stroke="rgba(201,162,74,0.22)" strokeWidth="1" strokeDasharray="5 9" strokeLinecap="round" />
            <circle cx="88" cy="88" r="62" fill="none" stroke="rgba(201,162,74,0.1)" strokeWidth="1.5" />
            <circle ref={innerRingRef} cx="88" cy="88" r="62" fill="none"
              stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-90 88 88)" />
            <circle className="pl-dot" cx="88" cy="26" r="3.5" fill="#C9A24A" />
          </svg>
          <div className="pl-logo-box relative z-10 overflow-hidden"
            style={{
              width: 100, height: 100, backgroundColor: '#fff', borderRadius: '1.6rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12,
              boxShadow: '0 30px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,162,74,0.25)',
            }}
          >
            <img src={logo} alt="V Dental" style={{ width: '100%', height: '100%', objectFit: 'contain' }} draggable={false} />
            <div className="pl-shimmer absolute inset-0"
              style={{ background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.6) 50%, transparent 75%)', borderRadius: '1.6rem' }}
            />
          </div>
        </div>

        <div className="pl-line mb-4 sm:mb-5"
          style={{ width: 64, height: 1, background: 'linear-gradient(90deg, transparent, #C9A24A 25%, #C9A24A 75%, transparent)' }}
        />

        <h1 className="flex flex-wrap justify-center mb-2 sm:mb-3 text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.05rem, 4.2vw, 1.6rem)', fontWeight: 600, color: '#ffffff', letterSpacing: '0.1em', lineHeight: 1.4 }}
        >
          {CLINIC_NAME.split('').map((char, i) => (
            <span key={i} className="pl-letter"
              style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal', minWidth: char === ' ' ? '0.35em' : undefined }}>
              {char}
            </span>
          ))}
        </h1>

        <p className="pl-tagline text-center"
          style={{ color: '#C9A24A', fontSize: 'clamp(0.56rem, 1.8vw, 0.7rem)', letterSpacing: '0.28em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
        >
          World-Class Dentistry &nbsp;·&nbsp; Bengaluru
        </p>
      </div>

      {/* Iris circle — large pre-sized circle, scales from 0→1 for smooth GPU render */}
      <div
        ref={irisRef}
        className="absolute z-20 rounded-full pointer-events-none"
        style={{
          width: '300vmax', height: '300vmax',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
          background: '#0a1509',
          opacity: 0,
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default Preloader;
