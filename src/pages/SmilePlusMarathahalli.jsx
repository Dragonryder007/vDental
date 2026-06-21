﻿import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { gsap } from '../utils/gsap';
import SmilePlusSpecialistTeam from '../components/SmilePlusSpecialistTeam';
import PlatformReviewsCarousel from '../components/PlatformReviewsCarousel';
import doctorJishnu from '../images/doctor-jishnu.webp';
import smilePlusHeroImg from '../images/smile-plus-hero.webp';
import smilePlusLogo from '../images/smile-plus-logo.webp';
import invisalignBa from '../images/invisalign-before-after.webp';
import implantsBa from '../images/dental-implants-before-after.webp';
import smileMakeoverBa from '../images/smile-makeover-before-after.webp';
import {
  SMILE_PLUS_NAME,
  SMILE_PLUS_SLUG,
  SMILE_PLUS_ADDRESS_LINE,
  SMILE_PLUS_MAPS_URL,
  SMILE_PLUS_MAPS_EMBED,
  SMILE_PLUS_DIRECTIONS_URL,
  CLINIC_EMAIL,
  PHONE_DISPLAY,
  PHONE_TEL,
  smilePlusWhatsAppUrl,
} from '../constants/contact';
import {
  smilePlusSeo,
  smilePlusHero,
  smilePlusIntro,
  smilePlusFaqs,
  smilePlusTreatments,
  smilePlusTrustPoints,
  smilePlusLocalAreas,
} from '../data/smilePlusMarathahalli';

const WHATSAPP_MSG =
  'Hello! I would like to book a consultation at Smile Plus Dental Care — Marathahalli (V Dental branch).';

const C = {
  dark:    '#0f1e12',
  cream:   '#FAF6F0',
  cream2:  '#F3EDE4',
  gold:    '#C9A24A',
  ink:     '#1C2B1E',
  muted:   '#5A6A5C',
  mutedLt: 'rgba(250,246,240,0.65)',
};

const Eyebrow = ({ label }) => (
  <div className="flex items-center justify-center gap-3 mb-4">
    <div className="h-px w-8" style={{ background: C.gold }} />
    <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
      {label}
    </p>
    <div className="h-px w-8" style={{ background: C.gold }} />
  </div>
);

const GALLERY = [
  { label: 'Invisalign', img: invisalignBa, alt: 'Invisalign before and after result' },
  { label: 'Dental Implants', img: implantsBa, alt: 'Dental implants before and after result' },
  { label: 'Smile Makeover', img: smileMakeoverBa, alt: 'Smile makeover before and after result' },
];

const TREATMENTS = smilePlusTreatments.filter((t) => t.title !== 'Crowns & Bridges');

const KEY_STATS = [
  { n: '2004', l: 'Trusted since' },
  { n: '60+', l: 'Years combined expertise' },
  { n: '16+', l: 'Areas served' },
  { n: '5★', l: 'Patient rating' },
];

const SmilePlusMarathahalli = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeGallery, setActiveGallery] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.sp-hero-logo',      { opacity: 0, y: 20, duration: 0.5 }, 0.3)
        .from('.sp-hero-title',     { opacity: 0, y: 30, duration: 0.7 }, 0.55)
        .from('.sp-hero-tagline',   { opacity: 0, y: 20, duration: 0.6 }, 0.8)
        .from('.sp-hero-stats > *', { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, 1.0)
        .from('.sp-hero-cta > *',   { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, 1.15);

      gsap.to('.sp-hero-bg', {
        y: '22%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen font-afacad" style={{ background: C.cream, color: C.ink }}>
      <SEO
        fullTitle
        title={smilePlusSeo.title}
        description={smilePlusSeo.description}
        keywords={smilePlusSeo.keywords}
        canonicalPath={SMILE_PLUS_SLUG}
        faqs={smilePlusFaqs}
        branch={{
          name: SMILE_PLUS_NAME,
          url: `https://www.vdentalandimplantcenter.com${SMILE_PLUS_SLUG}`,
          description: smilePlusSeo.description,
        }}
      />

      {/* â"€â"€ HERO â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <header
        ref={heroRef}
        className="relative min-h-[min(85vh,860px)] sm:min-h-[min(90vh,860px)] flex items-end overflow-hidden pt-24 sm:pt-28 md:pt-32 lg:pt-36"
        style={{ background: C.dark }}
      >
        {/* Gold accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-20"
          style={{ background: `linear-gradient(to right, transparent, ${C.gold} 30%, ${C.gold} 70%, transparent)` }}
        />
        <img
          src={smilePlusHeroImg}
          alt="Smile Plus Dental Care reception at Marathahalli"
          className="sp-hero-bg absolute inset-0 w-full h-full object-cover object-[72%_center] sm:object-[68%_center] lg:object-center opacity-80 brightness-90"
          loading="eager"
          fetchPriority="high"
        />
        {/* Left-heavy gradient â€" content readable, image visible on right */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(15,30,18,0.97) 0%, rgba(15,30,18,0.90) 35%, rgba(15,30,18,0.55) 62%, rgba(15,30,18,0.10) 100%)' }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15,30,18,0.88) 0%, transparent 38%)' }}
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 pb-10 sm:pb-14 md:pb-16 lg:pb-20">
          <div className="max-w-2xl lg:max-w-3xl">

            {/* Logo + badge */}
            <div className="sp-hero-logo flex flex-wrap items-center gap-3 mb-8">
              <div className="bg-white rounded-2xl px-3 py-2.5 shadow-xl shadow-black/20 border border-black/5 shrink-0 max-w-[140px] sm:max-w-none">
                <img
                  src={smilePlusLogo}
                  alt="Smile Plus Dental Care"
                  className="h-9 sm:h-12 w-auto max-w-full object-contain"
                />
              </div>
              <div className="inline-flex flex-col gap-1 rounded-2xl border border-white/40 bg-black/25 px-4 py-3 backdrop-blur-sm">
                <span className="text-xs font-medium tracking-wide" style={{ color: C.gold }}>
                  V Dental &amp; Implant Center
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  Powered branch Â· Marathahalli Bridge
                </span>
              </div>
            </div>

            <h1 className="sp-hero-title mt-2 leading-[1.05]">
              <span className="block text-4xl sm:text-5xl lg:text-[3.5rem] font-sans font-bold text-white tracking-tight">
                Advanced Dental Care
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-[3.5rem] font-sans font-bold text-white tracking-tight">
                &amp; Smile Rehabilitation
              </span>
              <span className="block mt-1 text-3xl sm:text-4xl lg:text-[2.75rem] font-serif italic leading-none" style={{ color: C.gold }}>
                in Marathahalli
              </span>
            </h1>

            <p className="sp-hero-tagline mt-6 text-base sm:text-lg text-white/65 font-light leading-relaxed max-w-lg">
              Specialist-led implants, aligners, smile makeovers &amp; full-mouth rehabilitation — powered by V Dental &amp; Implant Center.
            </p>

            {/* Stats â€" thin horizontal divider row */}
            <div className="sp-hero-stats mt-9 flex items-stretch divide-x divide-white/[0.12] overflow-x-auto no-scrollbar">
              {[
                { n: '2004', l: 'Established' },
                { n: '60+',  l: 'Yrs combined expertise' },
                { n: '16+',  l: 'Areas served' },
                { n: '5★',   l: 'Patient rating' },
              ].map((s, i) => (
                <div key={s.l} className={`flex flex-col gap-1.5 flex-shrink-0 ${i === 0 ? 'pr-6 sm:pr-8' : 'px-6 sm:px-8'}`}>
                  <div className="font-sans text-xl sm:text-2xl font-extrabold leading-none text-white">{s.n}</div>
                  <div className="text-[10px] sm:text-xs text-white/50 whitespace-nowrap">{s.l}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="sp-hero-cta mt-8 sm:mt-10 flex flex-wrap gap-3">
              <Link
                to="/booking"
                className="btn-gold-shimmer btn-magnetic inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base"
                style={{ color: '#0d0d0d' }}
              >
                <span className="material-symbols-rounded text-[20px]">calendar_month</span>
                Book Free Consultation
              </Link>
              <a
                href={smilePlusWhatsAppUrl(WHATSAPP_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition hover:-translate-y-0.5"
                style={{ background: 'rgba(201,162,74,0.12)', border: '1.5px solid rgba(201,162,74,0.45)', color: C.gold }}
              >
                <span className="material-symbols-rounded text-[20px]">chat</span>
                WhatsApp
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#FAF6F0' }}
              >
                <span className="material-symbols-rounded text-[20px]">call</span>
                Call Now
              </a>
            </div>
          </div>

          {/* Doctor card â€" desktop only */}
          <div
            className="hidden lg:flex absolute bottom-8 right-6 xl:right-10 items-center gap-4 rounded-2xl backdrop-blur-md border px-5 py-4 shadow-2xl max-w-[280px] overflow-hidden"
            style={{ background: 'rgba(10,20,12,0.82)', borderColor: 'rgba(201,162,74,0.30)' }}
          >
            {/* Gold top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: C.gold }} />
            <img
              src={doctorJishnu}
              alt="Dr. Jishnu Premnath"
              className="w-14 h-14 rounded-xl object-cover object-top border border-white/20 shrink-0"
            />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: C.gold }}>Lead Clinician</p>
              <p className="text-white font-semibold text-sm leading-tight">Dr. Jishnu Premnath</p>
              <p className="text-white/55 text-xs mt-0.5 leading-snug">
                Smile Correction &amp; Implant Specialist
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* â"€â"€ ABOUT â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8" style={{ background: C.gold }} />
                <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                  About Smile Plus
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal mb-5 leading-tight" style={{ color: C.ink }}>
                Advanced dental care near Marathahalli Bridge
              </h2>
              <div className="space-y-4 text-lg leading-relaxed" style={{ color: C.muted }}>
                {smilePlusIntro.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
              <p className="mt-6 text-sm font-semibold" style={{ color: C.ink }}>
                {SMILE_PLUS_NAME}
                <span className="block font-normal mt-1" style={{ color: C.muted }}>
                  Powered by V Dental &amp; Implant Center, Indiranagar
                </span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:pt-14">
              {KEY_STATS.map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl p-6 bg-white text-center"
                  style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  <div className="font-sans text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: C.gold }}>{s.n}</div>
                  <div className="text-sm font-medium leading-snug" style={{ color: C.muted }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â"€â"€ SPECIALIST TEAM â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <SmilePlusSpecialistTeam />

      {/* â"€â"€ TREATMENTS â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream2 }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-reveal>
            <Eyebrow label="Treatments in Marathahalli" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal mb-4" style={{ color: C.ink }}>
              Comprehensive dental care
            </h2>
            <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: C.muted }}>
              {smilePlusHero.specializations} — with personalized planning and digital dentistry protocols.
            </p>
          </div>
          {/* Mobile: swipe carousel */}
          <div className="sm:hidden -mx-5">
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory carousel-x gap-4 px-5 pb-4">
              {TREATMENTS.map((t) => (
                <Link
                  key={t.title}
                  to={t.path}
                  className="flex-shrink-0 w-[78vw] snap-start group bg-white rounded-2xl p-6 hover:shadow-lg transition-all no-underline"
                  style={{ border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  <span className="material-symbols-rounded text-[32px] mb-3 block" style={{ color: C.gold }}>{t.icon}</span>
                  <h3 className="text-lg font-bold group-hover:text-[#C9A24A] transition-colors" style={{ color: C.ink }}>{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>{t.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold" style={{ color: C.gold }}>
                    Learn more
                    <span className="material-symbols-rounded text-[16px]">arrow_forward</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TREATMENTS.map((t, i) => (
              <Link
                key={t.title}
                to={t.path}
                data-reveal
                data-delay={i}
                className="group bg-white rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all no-underline"
                style={{ border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <span className="material-symbols-rounded text-[32px] mb-3 block" style={{ color: C.gold }}>{t.icon}</span>
                <h3 className="text-lg font-bold transition-colors group-hover:text-[#C9A24A]" style={{ color: C.ink }}>{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>{t.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold" style={{ color: C.gold }}>
                  Learn more
                  <span className="material-symbols-rounded text-[16px]">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ WHY CHOOSE â€" Dark â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.dark }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-reveal>
            <Eyebrow label="Excellence & Care" />
            <h2 className="text-3xl md:text-4xl font-serif font-normal mb-3" style={{ color: '#FAF6F0' }}>
              Why patients choose Smile Plus Dental Care
            </h2>
            <div className="w-14 h-px mx-auto mt-4" style={{ background: C.gold }} />
          </div>
          {/* Mobile: swipe carousel */}
          <div className="sm:hidden -mx-5">
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory carousel-x gap-4 px-5 pb-4">
              {smilePlusTrustPoints.map((point) => (
                <div
                  key={point}
                  className="flex-shrink-0 w-[80vw] snap-start rounded-2xl p-7"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,74,0.13)' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(201,162,74,0.15)' }}>
                  <span className="material-symbols-rounded text-[22px]" style={{ color: C.gold }}>verified</span>
                </div>
                  <p className="font-medium leading-snug" style={{ color: '#FAF6F0' }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {smilePlusTrustPoints.map((point, i) => (
              <div
                key={point}
                data-reveal
                data-delay={i}
                className="rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,74,0.13)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(201,162,74,0.15)' }}>
                  <span className="material-symbols-rounded text-[22px]" style={{ color: C.gold }}>verified</span>
                </div>
                <p className="font-medium leading-snug" style={{ color: '#FAF6F0' }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ LOCAL AREAS â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section
        className="py-16 px-6 text-white"
        style={{ background: 'linear-gradient(135deg, #0d1a10 0%, #0a1509 100%)', borderTop: '1px solid rgba(201,162,74,0.12)', borderBottom: '1px solid rgba(201,162,74,0.12)' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-normal mb-4">
            Easily accessible from across Bangalore East
          </h2>
          <p className="text-white/80 leading-relaxed text-lg max-w-3xl mx-auto">
            Our clinic is conveniently located near Marathahalli Bridge and welcomes patients seeking advanced dental care across East Bangalore.
          </p>
          <p className="mt-6 text-sm text-white/50 uppercase tracking-widest font-bold">
            Serving patients from
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {smilePlusLocalAreas.map((area) => (
              <span
                key={area}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ GALLERY / RESULTS â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10" data-reveal>
            <Eyebrow label="Transformations" />
            <h2 className="text-3xl md:text-4xl font-serif font-normal" style={{ color: C.ink }}>
              Real patient transformations
            </h2>
            <p className="mt-3" style={{ color: C.muted }}>
              Results from specialist-led care at V Dental &amp; Implant Center.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {GALLERY.map((g, i) => (
              <button
                key={g.label}
                type="button"
                onClick={() => setActiveGallery(i)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={
                  activeGallery === i
                    ? { background: C.gold, color: '#0d0d0d' }
                    : { background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.3)', color: C.ink }
                }
              >
                {g.label}
              </button>
            ))}
          </div>

          <div
            className="rounded-2xl overflow-hidden bg-white p-3 shadow-sm"
            style={{ border: '1px solid rgba(201,162,74,0.15)' }}
          >
            <div className="rounded-xl overflow-hidden flex items-center justify-center min-h-[260px] sm:min-h-[360px]" style={{ background: C.cream2 }}>
              <img
                src={GALLERY[activeGallery].img}
                alt={GALLERY[activeGallery].alt}
                className="w-full object-contain max-h-[400px]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/results"
              className="inline-flex items-center gap-1 font-bold hover:underline"
              style={{ color: C.gold }}
            >
              View all results
              <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* â"€â"€ PATIENT REVIEWS â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6 overflow-hidden" style={{ background: C.cream2 }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14" data-reveal>
            <Eyebrow label="Patient Reviews" />
            <h2 className="text-3xl md:text-4xl font-serif font-normal mb-3" style={{ color: C.ink }}>
              Our Happy{' '}
              <span className="italic" style={{ color: C.gold }}>Patients</span>
            </h2>
            <p className="max-w-xl mx-auto leading-relaxed" style={{ color: C.muted }}>
              Real stories from patients who trusted us with their smiles.
            </p>
          </div>
          <PlatformReviewsCarousel />
        </div>
      </section>

      {/* â"€â"€ FAQ â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream2 }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12" data-reveal>
            <Eyebrow label="FAQs" />
            <h2 className="text-3xl font-serif font-normal" style={{ color: C.ink }}>
              Frequently asked questions
            </h2>
            <p className="mt-3" style={{ color: C.muted }}>Dental care in Marathahalli — answered.</p>
          </div>
          <div className="space-y-3">
            {smilePlusFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center gap-4 font-semibold transition-colors"
                    style={{ color: C.ink }}
                  >
                    <span>{faq.q}</span>
                    <span
                      className="material-symbols-rounded shrink-0 transition-transform duration-300"
                      style={{ color: C.gold, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      keyboard_arrow_down
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      className="px-6 pb-5 leading-relaxed border-t pt-4"
                      style={{ color: C.muted, borderColor: 'rgba(201,162,74,0.12)' }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* â"€â"€ MAP & CONTACT â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div
            className="bg-white rounded-3xl p-8 md:p-10 shadow-sm"
            style={{ border: '1px solid rgba(201,162,74,0.18)' }}
          >
            <h2 className="text-2xl font-serif font-normal mb-6" style={{ color: C.ink }}>
              Visit us in Marathahalli
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.25)' }}>
                  <span className="material-symbols-rounded text-[20px]" style={{ color: C.gold }}>location_on</span>
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: C.ink }}>{SMILE_PLUS_NAME}</p>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: C.muted }}>{SMILE_PLUS_ADDRESS_LINE}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.25)' }}>
                  <span className="material-symbols-rounded text-[20px]" style={{ color: C.gold }}>call</span>
                </div>
                <a href={`tel:${PHONE_TEL}`} className="font-bold hover:underline" style={{ color: C.gold }}>
                  {PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.25)' }}>
                  <span className="material-symbols-rounded text-[20px]" style={{ color: C.gold }}>mail</span>
                </div>
                <a href={`mailto:${CLINIC_EMAIL}`} className="hover:underline text-sm" style={{ color: C.gold }}>
                  {CLINIC_EMAIL}
                </a>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.25)' }}>
                  <span className="material-symbols-rounded text-[20px]" style={{ color: C.gold }}>hub</span>
                </div>
                <span className="text-sm" style={{ color: C.muted }}>V Dental &amp; Implant Center, Indiranagar</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={SMILE_PLUS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-shimmer btn-magnetic px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
                style={{ color: '#0d0d0d' }}
              >
                <span className="material-symbols-rounded text-[18px]">near_me</span>
                Get Directions
              </a>
              <Link
                to="/"
                className="px-6 py-3 rounded-xl font-bold transition hover:-translate-y-0.5"
                style={{ background: C.cream2, color: C.ink, border: '1px solid rgba(201,162,74,0.2)' }}
              >
                V Dental Home
              </Link>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-black/5 shadow-lg h-[320px] lg:h-full min-h-[320px] bg-white">
            <iframe
              title="Smile Plus Dental Care Marathahalli on Google Maps"
              src={SMILE_PLUS_MAPS_EMBED}
              className="w-full h-full min-h-[320px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* â"€â"€ FINAL CTA â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section
        className="py-20 px-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1e12 0%, #0a1509 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.07) 0%, transparent 70%)' }}
        />
        <div className="relative z-10">
          <Eyebrow label="Book Today" />
          <h2 className="text-3xl md:text-4xl font-serif font-normal mb-3" style={{ color: '#FAF6F0' }}>
            Book Your Consultation Today
          </h2>
          <p className="text-xl font-semibold" style={{ color: C.gold }}>{SMILE_PLUS_NAME}</p>
          <p className="mt-2 font-medium tracking-wide" style={{ color: C.mutedLt }}>
            Powered by V Dental &amp; Implant Center
          </p>
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Link
              to="/booking"
              className="btn-gold-shimmer btn-magnetic px-10 py-4 rounded-2xl font-bold text-lg inline-flex items-center justify-center gap-2"
              style={{ color: '#0d0d0d' }}
            >
              <span className="material-symbols-rounded">calendar_month</span>
              Book Free Consultation
            </Link>
            <a
              href={smilePlusWhatsAppUrl(WHATSAPP_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 rounded-2xl font-bold text-lg transition hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              style={{ background: 'rgba(201,162,74,0.12)', border: '1.5px solid rgba(201,162,74,0.55)', color: C.gold }}
            >
              <span className="material-symbols-rounded">chat</span>
              WhatsApp Now
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="px-10 py-4 rounded-2xl font-bold text-lg transition hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#FAF6F0' }}
            >
              <span className="material-symbols-rounded">call</span>
              Call Now
            </a>
            <a
              href={SMILE_PLUS_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 rounded-2xl font-bold text-lg transition hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#FAF6F0' }}
            >
              <span className="material-symbols-rounded">near_me</span>
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SmilePlusMarathahalli;

