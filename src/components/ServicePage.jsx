﻿import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import BeforeAfterSlider from './BeforeAfterSlider';
import GoldParticles from './GoldParticles';

const C = {
  dark:   '#0f1e12',
  cream:  '#FAF6F0',
  cream2: '#F3EDE4',
  gold:   '#C9A24A',
  ink:    '#1C2B1E',
  muted:  '#5A6A5C',
  mutedLt:'rgba(250,246,240,0.65)',
};

const Eyebrow = ({ label, dark = false }) => (
  <div className="flex items-center justify-center gap-3 mb-4">
    <div className="h-px w-8" style={{ background: C.gold }} />
    <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
      {label}
    </p>
    <div className="h-px w-8" style={{ background: C.gold }} />
  </div>
);

const ServicePage = ({ title, subtitle, heroImg, benefits, steps, beforeImg, afterImg, journeyTitle, outstationText, doctors, specialistsSlot }) => {
  const { t } = useLanguage();
  const heroImgRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!heroImgRef.current || window.innerWidth < 640) return;
      heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: C.cream }}>

      {/* â"€â"€ HERO â€" Dark cinematic â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="relative min-h-[580px] md:min-h-[660px] flex items-center justify-center overflow-hidden">
        <img ref={heroImgRef} src={heroImg} alt={title} className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.72) contrast(1.06)', willChange: 'transform' }}
          fetchpriority="high" loading="eager" />
        {/* Uniform base â€" keeps whole image evenly visible */}
        <div className="absolute inset-0" style={{ background: 'rgba(15,30,18,0.42)' }} />
        {/* Top vignette â€" darkens behind nav */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,30,18,0.70) 0%, transparent 45%)' }} />
        {/* Bottom vignette â€" grounds the hero */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,30,18,0.65) 0%, transparent 45%)' }} />
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(to right, transparent, ${C.gold} 30%, ${C.gold} 70%, transparent)` }} />

        <div className="relative text-center px-5 sm:px-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: C.gold }} />
            <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
              V Dental & Implant Center
            </p>
            <div className="h-px w-8" style={{ background: C.gold }} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-5 leading-tight" style={{ color: '#FAF6F0' }}>
            {title}
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(250,246,240,0.75)' }}>
            {subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <Link to="/booking"
              className="btn-gold-shimmer inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: '#0d0d0d', fontSize: '0.9375rem' }}>
              {t('services.bookNowBtn')}
            </Link>
            <Link to="/results"
              className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgba(250,246,240,0.1)', border: '1px solid rgba(250,246,240,0.22)', color: '#FAF6F0' }}>
              {t('services.viewResultsBtn')}
            </Link>
          </div>
        </div>
      </section>

      {/* â"€â"€ BENEFITS â€" Cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-reveal>
            <Eyebrow label="Excellence & Care" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: C.ink }}>
              {t('services.whyChoose')}
            </h2>
            <div className="w-14 h-px mx-auto" style={{ background: C.gold }} />
          </div>
          {/* Mobile: swipe carousel */}
          <div className="sm:hidden -mx-5">
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory carousel-x gap-4 px-5 pb-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex-shrink-0 w-[80vw] snap-start bg-white rounded-2xl p-7"
                  style={{ border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                  <div className="text-4xl mb-5">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: C.ink }}>{benefit.title}</h3>
                  <p className="leading-relaxed text-sm" style={{ color: C.muted }}>{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {benefits.map((benefit, i) => (
              <div key={i} data-reveal data-delay={i}
                className="bg-white rounded-2xl p-7 group hover:-translate-y-1 transition-all duration-300"
                style={{ border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                <div className="text-4xl mb-5">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: C.ink }}>{benefit.title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: C.muted }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ SPECIALISTS SLOT â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {specialistsSlot}

      {/* â"€â"€ JOURNEY â€" Dark gradient â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-20 md:py-24 px-6" style={{ background: 'linear-gradient(135deg, #0d1a10 0%, #0a1509 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14" data-reveal>
            <Eyebrow label="Your Journey" dark />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3" style={{ color: '#FAF6F0' }}>
              {journeyTitle || t('services.journeyTitle')}
            </h2>
            <p style={{ color: C.mutedLt }}>{t('services.journeySub')}</p>
          </div>
          {/* Mobile: swipe carousel */}
          <div className="sm:hidden -mx-6">
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory carousel-x gap-4 px-6 pb-4">
              {steps.map((step, i) => (
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
            {steps.map((step, i) => (
              <div key={i} className="relative text-center flex-1 group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-[-50%] h-px"
                    style={{ background: 'linear-gradient(to right, rgba(201,162,74,0.4), transparent)' }} />
                )}
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-serif mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'rgba(201,162,74,0.15)', border: '2px solid rgba(201,162,74,0.5)', color: C.gold }}>
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#FAF6F0' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed max-w-[180px] mx-auto" style={{ color: C.mutedLt }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ OUTSTATION â€" Soft cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {outstationText && (
        <section className="py-16 px-6" style={{ background: C.cream2 }}>
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 md:p-12 text-center relative overflow-hidden"
            style={{ border: '1px solid rgba(201,162,74,0.16)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-30 pointer-events-none"
              style={{ background: C.gold, filter: 'blur(80px)', transform: 'translate(30%,-30%)' }} />
            <div className="relative z-10">
              <Eyebrow label="Outstation Patients" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4" style={{ color: C.ink }}>
                {t('services.outstationTitle')}
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: C.muted }}>{outstationText}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left max-w-3xl mx-auto">
                {[1, 2, 3, 4, 5].map((n, idx) => (
                  <div key={n} className={`flex items-center gap-3 ${idx === 4 ? 'md:col-span-2 md:justify-center' : ''}`}>
                    <span className="ms" style={{ color: C.gold, fontSize: 13, fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>auto_awesome</span>
                    <span style={{ color: C.muted }}>{t(`services.outstationPoint${n}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* â"€â"€ DOCTORS (legacy card) â€" Cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {doctors && doctors.length > 0 && (
        <section className="py-16 px-5 sm:px-6" style={{ background: C.cream }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Eyebrow label="Our Specialists" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: C.ink }}>Specialist Team</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {doctors.map((doc, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 flex flex-col gap-2"
                  style={{ border: `1px solid ${i === 0 ? 'rgba(201,162,74,0.3)' : 'rgba(0,0,0,0.07)'}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <span className="inline-block self-start text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1"
                    style={i === 0 ? { background: C.gold, color: '#fff' } : { background: 'rgba(201,162,74,0.12)', color: '#5a4a1e' }}>
                    {doc.tag}
                  </span>
                  <h3 className="text-lg font-serif font-bold" style={{ color: C.ink }}>{doc.name}</h3>
                  <p className="font-semibold text-sm leading-snug" style={{ color: '#2d6a40' }}>{doc.title}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{doc.experience}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* â"€â"€ RESULTS â€" Soft cream â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {afterImg && (
        <section className="py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream2 }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Eyebrow label="Results" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: C.ink }}>
                {t('services.theResult')}
              </h2>
              <p className="text-lg" style={{ color: C.muted }}>{t('services.resultSub')}</p>
            </div>
            {beforeImg ? (
              <div data-reveal className="max-w-4xl mx-auto shadow-2xl">
                <BeforeAfterSlider
                  beforeImg={beforeImg}
                  afterImg={afterImg}
                  beforeLabel={t('services.beforeTreatment')}
                  afterLabel={t('services.afterReveal')}
                />
              </div>
            ) : (
              <div className="max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden relative shadow-2xl"
                style={{ border: '1px solid rgba(201,162,74,0.18)' }}>
                <div className="relative h-[500px] md:h-[580px]">
                  <img src={afterImg} alt="Result" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 flex items-end p-10"
                    style={{ background: 'linear-gradient(to top, rgba(15,30,18,0.75) 0%, transparent 60%)' }}>
                    <div>
                      <div className="inline-block px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                        style={{ background: C.gold, color: '#0d0d0d' }}>
                        {t('services.transformation')}
                      </div>
                      <p className="text-2xl font-serif italic" style={{ color: 'rgba(250,246,240,0.92)' }}>
                        {t('services.quote')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* â"€â"€ FINAL CTA â€" Dark with gold â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-24 px-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1e12 0%, #0a1509 100%)' }}>
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
            <Link to="/booking"
              className="btn-gold-shimmer inline-flex items-center justify-center font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: '#0d0d0d' }}>
              {t('services.bookNowBtn')}
            </Link>
            <Link to="/results"
              className="inline-flex items-center justify-center font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgba(250,246,240,0.07)', border: '1px solid rgba(250,246,240,0.2)', color: '#FAF6F0' }}>
              {t('services.viewResultsBtn')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;

