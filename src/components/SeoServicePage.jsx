﻿import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { GOOGLE_MAPS_DIRECTIONS_URL } from '../constants/contact';
import DoctorMobileCarousel from './DoctorMobileCarousel';
import BeforeAfterSlider from './BeforeAfterSlider';
import GoldParticles from './GoldParticles';

const WHATSAPP = '919037151894';
const PHONE = '+919037151894';

/* â"€â"€ Shared palette tokens â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
const C = {
  dark:    '#0f1e12',   // deep forest â€" hero, journey, reviews, CTA
  dark2:   '#1a2e1e',   // slightly lighter dark green
  cream:   '#FAF6F0',   // warm cream â€" light sections
  cream2:  '#F3EDE4',   // slightly deeper cream â€" alternating light
  gold:    '#C9A24A',   // brand gold
  goldDim: 'rgba(201,162,74,0.15)',
  ink:     '#1C2B1E',   // dark text on cream
  muted:   '#5A6A5C',   // body text on cream
  mutedLt: 'rgba(250,246,240,0.65)', // body text on dark
};

/* â"€â"€ Reusable eyebrow label â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
const Eyebrow = ({ label, dark = false }) => (
  <div className="flex items-center justify-center gap-3 mb-4">
    <div className="h-px w-8" style={{ background: C.gold }} />
    <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
      {label}
    </p>
    <div className="h-px w-8" style={{ background: C.gold }} />
  </div>
);

const SeoServicePage = ({ content, bookingService }) => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);
  const heroImgRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!heroImgRef.current || window.innerWidth < 640) return;
      heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bookingUrl = bookingService
    ? `/booking?service=${encodeURIComponent(bookingService)}`
    : '/booking';

  const whatsappText = encodeURIComponent(
    `Hello! I would like to book a consultation for ${content.title} at V Dental and Implant Center.`
  );

  return (
    <div className="min-h-screen" style={{ background: C.cream }}>

      {/* â"€â"€ HERO â€" Dark cinematic â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="relative min-h-[600px] md:min-h-[680px] flex items-center overflow-hidden">
        <img
          src={content.heroImg}
          alt={content.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.72) contrast(1.06)', willChange: 'transform' }}
          ref={heroImgRef}
          fetchpriority="high"
          loading="eager"
        />
        {/* Uniform base â€" keeps whole image evenly visible */}
        <div className="absolute inset-0" style={{ background: 'rgba(15,30,18,0.42)' }} />
        {/* Top vignette â€" darkens behind nav */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,30,18,0.70) 0%, transparent 45%)' }} />
        {/* Bottom vignette â€" grounds the hero */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,30,18,0.65) 0%, transparent 45%)' }} />
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${C.gold} 30%, ${C.gold} 70%, transparent)` }} />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 py-16 sm:py-20 text-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: C.gold }} />
            <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
              {content.locationLine}
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-5 leading-tight" style={{ color: '#FAF6F0' }}>
            {content.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-10" style={{ color: 'rgba(250,246,240,0.78)' }}>
            {content.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={bookingUrl}
              className="btn-gold-shimmer inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ color: '#0d0d0d', fontSize: '0.9375rem' }}
            >
              {t('seoService.bookConsultation')}
            </Link>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
              style={{ background: 'rgba(201,162,74,0.12)', border: '1.5px solid rgba(201,162,74,0.55)', color: C.gold, boxShadow: '0 4px 18px rgba(201,162,74,0.12)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6.29 6.29l1.41-1.41a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {t('seoService.callNow')}
            </a>
          </div>
        </div>
      </section>

      {/* â"€â"€ PROBLEM â€" Cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8" style={{ background: C.gold }} />
                <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                  {t('seoService.problemLabel')}
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-5 leading-tight" style={{ color: C.ink }}>
                {content.problem.title}
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: C.muted }}>
                {content.problem.text}
              </p>
            </div>
            <ul className="space-y-3">
              {content.problem.points.map((point, i) => (
                <li key={i} className="flex gap-4 rounded-2xl p-4 sm:p-5 bg-white"
                  style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(201,162,74,0.15)', color: C.gold }}>
                    <span className="ms" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 20" }}>check</span>
                  </span>
                  <span className="leading-snug" style={{ color: C.ink }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* â"€â"€ TREATMENT STEPS â€" Soft warm cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream2 }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-reveal>
            <Eyebrow label={t('seoService.treatmentLabel')} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: C.ink }}>
              {content.treatment.title}
            </h2>
            <p className="max-w-3xl mx-auto leading-relaxed" style={{ color: C.muted }}>
              {content.treatment.text}
            </p>
          </div>
          {/* Mobile: swipe carousel */}
          <div className="sm:hidden -mx-5">
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory carousel-x gap-4 px-5 pb-4">
              {content.treatment.points.map((point, i) => (
                <div key={i} className="flex-shrink-0 w-[72vw] snap-start rounded-2xl p-6 text-center bg-white"
                  style={{ border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 text-lg font-bold font-serif"
                    style={{ background: `linear-gradient(135deg, ${C.gold}, #a07d2e)`, color: '#fff' }}>
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: C.ink }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: grid â€" auto-fits columns to avoid orphaned cards */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4" style={{ gridTemplateColumns: `repeat(${(() => { const n = content.treatment.points.length; return n <= 5 ? n : n % 3 === 0 ? 3 : n % 4 === 0 ? 4 : 5; })()}, 1fr)` }}>
            {content.treatment.points.map((point, i) => (
              <div key={i} className="rounded-2xl p-6 text-center bg-white group hover:-translate-y-1 transition-transform duration-300"
                style={{ border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 text-lg font-bold font-serif"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, #a07d2e)`, color: '#fff' }}>
                  {i + 1}
                </div>
                <p className="text-sm font-medium leading-relaxed" style={{ color: C.ink }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ BENEFITS â€" Dark green â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.dark }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-reveal>
            <Eyebrow label="Excellence & Care" dark />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3" style={{ color: '#FAF6F0' }}>
              {t('services.whyChoose')}
            </h2>
            <div className="w-14 h-px mx-auto" style={{ background: C.gold }} />
          </div>
          {/* Mobile: swipe carousel */}
          <div className="sm:hidden -mx-5">
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory carousel-x gap-4 px-5 pb-4">
              {content.benefits.map((benefit, i) => (
                <div key={i} className="flex-shrink-0 w-[80vw] snap-start rounded-2xl p-7"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,74,0.13)' }}>
                  <div className="text-4xl mb-5">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#FAF6F0' }}>{benefit.title}</h3>
                  <p className="leading-relaxed text-sm" style={{ color: C.mutedLt }}>{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {content.benefits.map((benefit, i) => (
              <div key={i} data-reveal data-delay={i}
                className="rounded-2xl p-7 group hover:-translate-y-1 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,74,0.13)' }}>
                <div className="text-4xl mb-5">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#FAF6F0' }}>{benefit.title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: C.mutedLt }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ JOURNEY STEPS â€" Dark gradient â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-20 md:py-24 px-6" style={{ background: 'linear-gradient(135deg, #0d1a10 0%, #0a1509 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Eyebrow label="Your Journey" dark />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3" style={{ color: '#FAF6F0' }}>
              {content.journeyTitle}
            </h2>
            <p style={{ color: C.mutedLt }}>{t('services.journeySub')}</p>
          </div>
          {/* Mobile: swipe carousel */}
          <div className="sm:hidden -mx-6">
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory carousel-x gap-4 px-6 pb-4">
              {content.steps.map((step, i) => (
                <div key={i} className="flex-shrink-0 w-[72vw] snap-start text-center rounded-2xl p-6"
                  style={{ background: 'rgba(201,162,74,0.08)', border: '1px solid rgba(201,162,74,0.2)' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold font-serif mx-auto mb-5"
                    style={{ background: 'rgba(201,162,74,0.15)', border: '2px solid rgba(201,162,74,0.5)', color: C.gold }}>
                    {i + 1}
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: '#FAF6F0' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.mutedLt }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: horizontal flow */}
          <div className="hidden sm:flex sm:flex-row justify-center gap-6 md:gap-4">
            {content.steps.map((step, i) => (
              <div key={i} className="relative text-center flex-1 group">
                {i < content.steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-[-50%] h-px"
                    style={{ background: `linear-gradient(to right, rgba(201,162,74,0.4), transparent)` }} />
                )}
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-serif mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'rgba(201,162,74,0.15)', border: `2px solid rgba(201,162,74,0.5)`, color: C.gold }}>
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#FAF6F0' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed max-w-[180px] mx-auto" style={{ color: C.mutedLt }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ PRICING TABLE â€" Cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {content.pricingTable && (
        <section className="py-20 md:py-24 px-6" style={{ background: C.cream }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Eyebrow label="Cost Comparison" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: C.ink }}>
                Affordable Dental Treatment Costs in India
              </h2>
              <p className="max-w-3xl mx-auto leading-relaxed" style={{ color: C.muted }}>
                Compare costs at V Dental & Implant Center, Bangalore vs USA, UK, Australia, Dubai/UAE & Saudi Arabia
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl shadow-sm" style={{ border: '1px solid rgba(201,162,74,0.18)' }}>
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr style={{ background: C.dark }}>
                    <th className="px-5 py-4 text-left font-semibold rounded-tl-2xl" style={{ color: 'rgba(250,246,240,0.7)' }}>Treatment</th>
                    <th className="px-5 py-4 text-center font-bold" style={{ color: C.gold }}>India (V Dental)</th>
                    {['USA','UK','Australia','Dubai / UAE','Saudi Arabia'].map(c => (
                      <th key={c} className="px-5 py-4 text-center font-semibold" style={{ color: 'rgba(250,246,240,0.55)' }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.pricingTable.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : C.cream2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td className="px-5 py-4 font-semibold" style={{ color: C.ink }}>{row.treatment}</td>
                      <td className="px-5 py-4 text-center font-bold" style={{ color: '#2d6a40' }}>{row.india}</td>
                      <td className="px-5 py-4 text-center" style={{ color: C.muted }}>{row.usa}</td>
                      <td className="px-5 py-4 text-center" style={{ color: C.muted }}>{row.uk}</td>
                      <td className="px-5 py-4 text-center" style={{ color: C.muted }}>{row.australia}</td>
                      <td className="px-5 py-4 text-center" style={{ color: C.muted }}>{row.dubai}</td>
                      <td className="px-5 py-4 text-center" style={{ color: C.muted }}>{row.saudi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-center mt-4 italic" style={{ color: '#9aaa9c' }}>
              Prices are approximate ranges and may vary depending on case complexity, materials used, and treatment requirements.
            </p>
          </div>
        </section>
      )}

      {/* â"€â"€ RECOVERY + PRICING â€" Dark green â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.dark }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Recovery */}
            <div className="rounded-3xl p-7 sm:p-10" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.18)' }}>
                  <span className="ms" style={{ color: C.gold, fontSize: 20, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>diamond</span>
                </div>
                <h2 className="text-2xl font-serif font-bold" style={{ color: '#FAF6F0' }}>{content.recovery.title}</h2>
              </div>
              <div className="space-y-0">
                {content.recovery.items.map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-2 py-4"
                    style={{ borderBottom: i < content.recovery.items.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                    <span className="font-semibold" style={{ color: 'rgba(250,246,240,0.88)' }}>{item.label}</span>
                    <span className="sm:text-right sm:max-w-[60%]" style={{ color: C.mutedLt }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-3xl p-7 sm:p-10 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1a2e1e 0%, #0d1a10 100%)', border: `1px solid rgba(201,162,74,0.22)` }}>
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                style={{ background: C.gold, filter: 'blur(60px)', transform: 'translate(30%,-30%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.2)' }}>
                    <span style={{ color: C.gold, fontSize: 18, fontWeight: 600 }}>₹</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold" style={{ color: '#FAF6F0' }}>{content.pricing.title}</h2>
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: C.gold }}>{content.pricing.range}</p>
                <p className="leading-relaxed mb-7 text-sm" style={{ color: C.mutedLt }}>{content.pricing.note}</p>
                <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' }} className="mb-4">
                  {t('seoService.pricingFactors')}
                </p>
                <ul className="space-y-2.5">
                  {content.pricing.factors.map((f, i) => (
                    <li key={i} className="flex gap-3 text-sm items-start" style={{ color: 'rgba(250,246,240,0.78)' }}>
                      <span className="ms" style={{ color: C.gold, marginTop: 2, fontSize: 13, fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>auto_awesome</span><span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â"€â"€ ALIGNER SECTION â€" Cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {content.alignerSection && (
        <section className="py-20 md:py-24 px-6" style={{ background: C.cream }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Eyebrow label="Clear Aligner Treatments" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: C.ink }}>
                {content.alignerSection.title}
              </h2>
              <p className="max-w-3xl mx-auto leading-relaxed" style={{ color: C.muted }}>
                {content.alignerSection.text}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { heading: 'Available Aligner Solutions', items: content.alignerSection.brands },
                { heading: 'Treatment Focus Areas', items: content.alignerSection.goals },
              ].map(({ heading, items }, gi) => (
                <div key={gi} className="rounded-2xl p-8 bg-white"
                  style={{ border: '1px solid rgba(201,162,74,0.16)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                  <h3 className="text-lg font-bold mb-6" style={{ color: C.ink }}>{heading}</h3>
                  <ul className="space-y-3">
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(201,162,74,0.15)', color: C.gold }}>
                          <span className="ms" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 20" }}>check</span>
                          </span>
                        <span className="font-medium" style={{ color: C.ink }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* â"€â"€ TREATMENTS LIST â€" Soft cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {content.treatmentsList && (
        <section className="py-20 md:py-24 px-6" style={{ background: C.cream2 }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Eyebrow label="What We Treat" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: C.ink }}>
                Specialized Dental Treatments
              </h2>
              <p className="max-w-2xl mx-auto" style={{ color: C.muted }}>
                Comprehensive dental care under one roof in Bangalore
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {content.treatmentsList.map((item, i) => (
                <div key={i} className="rounded-xl p-4 flex gap-3 items-start bg-white"
                  style={{ border: '1px solid rgba(201,162,74,0.12)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                  <span className="ms" style={{ color: C.gold, marginTop: 2, fontSize: 13, fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>auto_awesome</span>
                  <span className="text-sm font-medium leading-snug" style={{ color: C.ink }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* â"€â"€ IMPLANT SYSTEMS â€" Dark â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {content.implantSystems && (
        <section className="py-20 md:py-24 px-6" style={{ background: C.dark }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Eyebrow label="Clinical Technology" dark />
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: '#FAF6F0' }}>
                {content.implantSystems.title}
              </h2>
              <p className="max-w-3xl mx-auto leading-relaxed text-sm" style={{ color: C.mutedLt }}>
                {content.implantSystems.text}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { heading: 'Premium Global Implant Systems', items: content.implantSystems.systems },
                { heading: 'Advanced Digital Dentistry', items: content.implantSystems.technology },
              ].map(({ heading, items }, gi) => (
                <div key={gi} className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,74,0.12)' }}>
                  <h3 className="text-lg font-bold mb-6" style={{ color: C.gold }}>{heading}</h3>
                  <ul className="space-y-3">
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-3 items-center text-sm">
                        <span className="ms" style={{ color: C.gold, fontSize: 13, fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>auto_awesome</span>
                        <span style={{ color: 'rgba(250,246,240,0.82)' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* â"€â"€ BEFORE / AFTER â€" Cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {content.afterImg && (
        <section className="py-20 md:py-24 px-6" style={{ background: C.cream2 }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Eyebrow label="Results" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: C.ink }}>
                {t('services.theResult')}
              </h2>
              <p style={{ color: C.muted }}>{t('services.resultSub')}</p>
            </div>
            {content.beforeImg ? (
              <div data-reveal className="max-w-4xl mx-auto shadow-2xl">
                <BeforeAfterSlider
                  beforeImg={content.beforeImg}
                  afterImg={content.afterImg}
                  beforeLabel={t('services.beforeTreatment')}
                  afterLabel={t('services.afterReveal')}
                />
              </div>
            ) : (
              <div className="max-w-2xl md:max-w-3xl mx-auto rounded-[2rem] p-3 bg-white shadow-xl"
                style={{ border: '1px solid rgba(201,162,74,0.15)' }}>
                <img
                  src={content.afterImg}
                  alt="Before and after treatment result"
                  className="w-full max-h-[min(58vh,480px)] sm:max-h-[min(62vh,520px)] object-contain block mx-auto"
                />
              </div>
            )}
            <div className="text-center mt-8">
              <Link to="/results" className="font-bold hover:underline transition-colors" style={{ color: '#2d6a40' }}>
                {t('services.viewResultsBtn')} <span className="ms" style={{ fontSize: 15, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24", verticalAlign: 'middle' }}>arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* â"€â"€ DOCTORS â€" Warm cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream }}>
        <div className={`mx-auto ${content.doctors && content.doctors.length === 4 ? 'max-w-7xl' : content.doctors && content.doctors.length === 2 ? 'max-w-3xl' : content.doctors && content.doctors.length === 1 ? 'max-w-sm' : 'max-w-6xl'}`}>
          {content.doctors ? (
            <>
              <div className="text-center mb-10 sm:mb-14">
                <Eyebrow label={t('seoService.doctorLabel')} />
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3" style={{ color: C.ink }}>
                  Your Specialist
                </h2>
                <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: C.muted }}>
                  Your treatment is guided by some of Bangalore's most experienced dental specialists.
                </p>
              </div>
              {/* Mobile: stories carousel */}
              <div className="sm:hidden -mx-5">
                <DoctorMobileCarousel doctors={content.doctors} />
              </div>

              {/* Desktop: card grid */}
              <div className={`hidden sm:grid gap-6 ${content.doctors.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : content.doctors.length === 2 ? 'sm:grid-cols-2' : content.doctors.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 'sm:grid-cols-3'}`}>
                {content.doctors.map((doc, i) => (
                  <article key={i} className="bg-white rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                    style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
                    <div className="relative h-72 sm:h-80 overflow-hidden" style={{ background: C.cream2 }}>
                      {doc.image ? (
                        <div
                          className="w-full h-full bg-cover group-hover:scale-[1.04] transition-transform duration-500"
                          style={{
                            backgroundImage: `url(${doc.image})`,
                            backgroundSize: doc.photoSize || 'cover',
                            backgroundPosition: doc.photoPosition || '50% 0%',
                            backgroundRepeat: 'no-repeat',
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: C.muted }}>
                          {doc.name}
                        </div>
                      )}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,30,18,0.8) 0%, transparent 55%)' }} />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                          style={{ background: 'rgba(15,30,18,0.85)', color: C.gold, border: `1px solid rgba(201,162,74,0.35)` }}>
                          {doc.experience}
                        </span>
                        {i === 0 && (
                          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                            style={{ background: C.gold, color: '#fff' }}>
                            Lead Specialist
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5 sm:p-6">
                      <h3 className="text-lg font-serif font-bold leading-tight" style={{ color: C.ink }}>{doc.name}</h3>
                      <p className="font-semibold text-sm mt-1" style={{ color: '#2d6a40' }}>{doc.title}</p>
                      <p className="text-[10px] uppercase tracking-wider mt-0.5 mb-4" style={{ color: C.muted }}>{doc.specialization}</p>
                      <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: C.muted }}>{doc.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {(doc.specialties || []).slice(0, 3).map((s, j) => (
                          <span key={j} className="text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full"
                            style={{ background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.22)', color: '#5a4a1e' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-7 sm:p-10 md:p-14"
              style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: C.gold }} />
                <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                  {t('seoService.doctorLabel')}
                </p>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2" style={{ color: C.ink }}>{content.doctor.name}</h2>
              <p className="font-semibold mb-1" style={{ color: '#2d6a40' }}>{content.doctor.title}</p>
              <p className="text-sm mb-5" style={{ color: C.muted }}>{content.doctor.experience}</p>
              <p className="leading-relaxed" style={{ color: C.muted }}>{content.doctor.bio}</p>
            </div>
          )}
        </div>
      </section>

      {/* â"€â"€ FAQs â€" Soft cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Eyebrow label="Common Questions" />
          <h2 className="text-3xl font-serif font-bold mb-3" style={{ color: C.ink }}>
            {t('seoService.faqTitle')}
          </h2>
          <p style={{ color: C.muted }}>{t('seoService.faqSub')}</p>
        </div>
        <div className="space-y-3">
          {content.faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="rounded-2xl overflow-hidden transition-all duration-200 bg-white"
                style={{ border: `1px solid ${isOpen ? 'rgba(201,162,74,0.35)' : 'rgba(0,0,0,0.08)'}`, boxShadow: isOpen ? '0 4px 20px rgba(201,162,74,0.1)' : '0 1px 6px rgba(0,0,0,0.04)' }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 font-semibold transition-colors"
                  style={{ color: C.ink }}
                >
                  <span className="leading-snug">{faq.q}</span>
                  <span className="ms shrink-0" style={{ color: C.gold, fontSize: 22, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>{isOpen ? 'remove' : 'add'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 leading-relaxed text-sm" style={{ color: C.muted, borderTop: '1px solid rgba(201,162,74,0.15)', paddingTop: '1rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* â"€â"€ REVIEWS â€" Dark â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.dark }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow label="Patient Stories" dark />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3" style={{ color: '#FAF6F0' }}>
              {t('seoService.reviewsTitle')}
            </h2>
            <p style={{ color: C.mutedLt }}>{t('seoService.reviewsSub')}</p>
          </div>
          {/* Mobile: swipe carousel */}
          <div className="sm:hidden -mx-5">
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory carousel-x gap-4 px-5 pb-4">
              {content.reviews.map((review, i) => (
                <blockquote key={i} className="flex-shrink-0 w-[85vw] snap-start rounded-2xl p-6 relative"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,74,0.12)' }}>
                  <div className="text-5xl font-serif leading-none mb-3" style={{ color: 'rgba(201,162,74,0.22)' }}>&ldquo;</div>
                  <p className="italic leading-relaxed mb-5 text-sm" style={{ color: 'rgba(250,246,240,0.78)' }}>{review.text}</p>
                  <footer className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'rgba(201,162,74,0.2)', color: C.gold }}>
                      {review.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-sm" style={{ color: C.gold }}>{review.name}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid md:grid-cols-3 gap-5">
            {content.reviews.map((review, i) => (
              <blockquote key={i} className="rounded-2xl p-6 relative"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,74,0.12)' }}>
                <div className="text-5xl font-serif leading-none mb-3" style={{ color: 'rgba(201,162,74,0.22)' }}>&ldquo;</div>
                <p className="italic leading-relaxed mb-5 text-sm" style={{ color: 'rgba(250,246,240,0.78)' }}>{review.text}</p>
                <footer className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(201,162,74,0.2)', color: C.gold }}>
                    {review.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-sm" style={{ color: C.gold }}>{review.name}</span>
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/reviews" className="font-bold transition-colors hover:underline" style={{ color: C.gold }}>
              {t('seoService.viewAllReviews')} <span className="ms" style={{ fontSize: 15, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24", verticalAlign: 'middle' }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* â"€â"€ OUTSTATION â€" Cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {content.outstationText && (
        <section className="py-16 px-6" style={{ background: C.cream2 }}>
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 md:p-12 text-center"
            style={{ border: '1px solid rgba(201,162,74,0.16)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <Eyebrow label="Outstation Patients" />
            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: C.ink }}>
              {t('services.outstationTitle')}
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: C.muted }}>{content.outstationText}</p>
            <div className="grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto text-sm">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex gap-3">
                  <span className="ms" style={{ color: C.gold, fontSize: 13, fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>auto_awesome</span>
                  <span style={{ color: C.muted }}>{t(`services.outstationPoint${n}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* â"€â"€ LOCAL SEO â€" Light â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-10 px-6" style={{ background: C.cream, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="max-w-4xl mx-auto text-center text-sm">
          <p className="font-semibold mb-1" style={{ color: C.ink }}>V Dental and Implant Center</p>
          <p style={{ color: C.muted }}>531, 2nd Main Road, Indiranagar 2nd Stage, Bangalore, Karnataka</p>
          {content.servedAreas && (
            <p className="mt-2 text-xs" style={{ color: '#9aaa9c' }}>
              Serving patients across: {content.servedAreas.join(' • ')}
            </p>
          )}
          <a href={GOOGLE_MAPS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block mt-3 font-bold hover:underline" style={{ color: '#2d6a40' }}>
            {t('home.contact.getDirections')} <span className="ms" style={{ fontSize: 15, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24", verticalAlign: 'middle' }}>arrow_forward</span>
          </a>
        </div>
      </section>

      {/* â"€â"€ FINAL CTA â€" Dark with gold â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-24 px-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1e12 0%, #0a1509 100%)' }}>
        <GoldParticles />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Eyebrow label="Take the First Step" dark />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-5" style={{ color: '#FAF6F0' }}>
            {t('services.readyTitle')}
          </h2>
          <p className="mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: C.mutedLt }}>
            {t('services.readySub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={bookingUrl}
              className="btn-gold-shimmer btn-magnetic inline-flex items-center justify-center font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl"
              style={{ color: '#0d0d0d' }}>
              {t('services.bookNowBtn')}
            </Link>
            <a href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgba(250,246,240,0.08)', border: '1px solid rgba(250,246,240,0.22)', color: '#FAF6F0' }}>
              {t('seoService.whatsapp')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SeoServicePage;

