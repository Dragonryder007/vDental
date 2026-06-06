import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import { gsap } from '../utils/gsap';
import SmilePlusSpecialistTeam from '../components/SmilePlusSpecialistTeam';
import doctorJishnu from '../images/doctor-jishnu.png';
import smilePlusHeroImg from '../images/smile-plus-hero.png';
import smilePlusLogo from '../images/smile-plus-logo.png';
import invisalignBa from '../images/invisalign-before-after.png';
import implantsBa from '../images/dental-implants-before-after.png';
import smileMakeoverBa from '../images/smile-makeover-before-after.png';
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
  'Hello! I would like to book a consultation at Smile Plus Dental Care – Marathahalli (V Dental branch).';

const galleryImages = [
  { src: invisalignBa, alt: 'Invisalign before and after result' },
  { src: implantsBa, alt: 'Dental implants before and after result' },
  { src: smileMakeoverBa, alt: 'Smile makeover before and after result' },
];

const SmilePlusMarathahalli = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.sp-hero-logo',     { opacity: 0, y: 20, duration: 0.5 }, 0.3)
        .from('.sp-hero-title',    { opacity: 0, y: 30, duration: 0.7 }, 0.55)
        .from('.sp-hero-tagline',  { opacity: 0, y: 20, duration: 0.6 }, 0.8)
        .from('.sp-hero-stats > *',{ opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, 1.0)
        .from('.sp-hero-cta > *',  { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, 1.15);

      // Parallax on hero background
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
    <div className="smile-plus-page bg-[color:var(--bg)] min-h-screen text-[color:var(--txt)]">
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

      {/* Hero — same V Dental palette as home (deep overlay, teal CTAs, gold accents) */}
      <header ref={heroRef} className="relative min-h-[min(85vh,860px)] sm:min-h-[min(90vh,860px)] flex items-end overflow-hidden bg-[color:var(--deep)] pt-24 sm:pt-28 md:pt-32 lg:pt-36">
        <img
          src={smilePlusHeroImg}
          alt="Smile Plus Dental Care reception at Marathahalli"
          className="sp-hero-bg absolute inset-0 w-full h-full object-cover object-[72%_center] sm:object-[68%_center] lg:object-[center_42%] opacity-45 brightness-75"
          loading="eager"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[color:var(--deep)]/95 via-[color:var(--deep)]/82 to-[color:var(--deep)]/15 lg:to-[color:var(--deep)]/5"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[color:var(--deep)]/90 via-transparent to-[color:var(--deep)]/25"
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 pb-10 sm:pb-14 md:pb-16 lg:pb-20">
          <div className="max-w-2xl lg:max-w-3xl">
            <div className="sp-hero-logo flex flex-wrap items-center gap-3 mb-8">
              <div className="bg-white rounded-2xl px-3 py-2.5 shadow-xl shadow-black/20 border border-black/5 shrink-0 max-w-[140px] sm:max-w-none">
                <img
                  src={smilePlusLogo}
                  alt="Smile Plus Dental Care"
                  className="h-9 sm:h-12 w-auto max-w-full object-contain"
                />
              </div>
              <div className="inline-flex flex-col gap-1 rounded-2xl border border-white/40 bg-black/25 px-4 py-3 backdrop-blur-sm">
                <span className="text-xs font-medium tracking-wide text-[color:var(--accent)]">
                  V Dental &amp; Implant Center
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  Powered branch · Marathahalli Bridge
                </span>
              </div>
            </div>

            <h1 className="sp-hero-title text-3xl sm:text-4xl lg:text-[3.25rem] font-serif font-bold text-white leading-[1.12]">
              Smile Plus Dental Care –{' '}
              <span className="italic text-[color:var(--accent)]">Marathahalli</span>
            </h1>

            <p className="sp-hero-tagline mt-5 text-lg sm:text-xl text-white/90 font-medium leading-relaxed max-w-2xl">
              {smilePlusHero.tagline}
            </p>

            <p className="mt-4 text-base text-[color:var(--accent)] font-semibold leading-relaxed max-w-2xl">
              {smilePlusHero.specializations}
            </p>

            <p className="mt-3 text-sm sm:text-base text-white/92 leading-relaxed hidden sm:block">
              {smilePlusHero.expertise}
            </p>

            <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed hidden md:block">
              {smilePlusHero.serviceAreas}
            </p>

            <div className="sp-hero-stats mt-8 grid grid-cols-3 gap-2 sm:gap-3 max-w-md">
              {[
                { n: '2004', l: 'Trusted since' },
                { n: '60+', l: 'Years expertise' },
                { n: '16+', l: 'Areas served' },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl bg-black/45 backdrop-blur-md border border-white/20 px-2 sm:px-3 py-3 text-center"
                >
                  <div className="font-serif text-lg sm:text-2xl font-bold text-[color:var(--accent)]">{s.n}</div>
                  <div className="text-[8px] sm:text-[10px] uppercase tracking-wide text-white/85 mt-1 leading-tight">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <div className="sp-hero-cta mt-7 sm:mt-9 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md sm:max-w-none sm:flex sm:flex-wrap">
              <Link
                to="/booking"
                className="btn-glow inline-flex items-center justify-center gap-2 bg-[color:var(--teal)] text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:bg-[color:var(--dk)] shadow-xl shadow-black/30 w-full sm:w-auto"
              >
                <span>📅</span> Book Free Consultation
              </Link>
              <a
                href={smilePlusWhatsAppUrl(WHATSAPP_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-7 sm:px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition active:scale-[0.98] w-full sm:w-auto"
              >
                <span>💬</span> WhatsApp Now
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur border border-white/35 text-white px-7 sm:px-8 py-3.5 rounded-xl font-bold hover:bg-white/25 transition active:scale-[0.98] w-full sm:w-auto"
              >
                <span>📞</span> Call Now
              </a>
              <a
                href={SMILE_PLUS_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-[color:var(--dk)] px-7 sm:px-8 py-3.5 rounded-xl font-bold hover:bg-[color:var(--soft)] transition active:scale-[0.98] w-full sm:w-auto"
              >
                <span>📍</span> Get Directions
              </a>
            </div>
          </div>

          <div className="hidden lg:flex absolute bottom-8 right-6 xl:right-10 items-center gap-4 rounded-2xl bg-[color:var(--deep)]/75 backdrop-blur-md border border-white/15 px-5 py-4 shadow-2xl max-w-xs">
            <img
              src={doctorJishnu}
              alt="Dr. Jishnu Premnath"
              className="w-16 h-16 rounded-xl object-cover object-top border-2 border-white/25 shrink-0"
            />
            <div>
              <p className="text-white font-bold text-sm">Dr. Jishnu Premnath</p>
              <p className="text-white/65 text-xs mt-0.5 leading-snug">
                Senior Smile Correction &amp; Implant Specialist
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* About / intro */}
      <section className="py-20 px-6 bg-[color:var(--bg)] border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--teal)] mb-4 text-center">
            About Smile Plus Dental Care
          </p>
          <div className="space-y-6 text-[color:var(--muted)] text-lg leading-relaxed">
            {smilePlusIntro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-8 text-center text-sm font-semibold text-[color:var(--dk)]">
            Smile Plus Dental Care – Marathahalli
            <span className="block text-[color:var(--muted)] font-normal mt-1">
              Powered by V Dental &amp; Implant Center
            </span>
          </p>
        </div>
      </section>

      <SmilePlusSpecialistTeam />

      {/* Treatments */}
      <section className="py-24 px-6 bg-white relative overflow-hidden bg-dot-pattern">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--teal)] mb-3">
              Treatments in Marathahalli
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[color:var(--dk)]">
              Comprehensive dental care
            </h2>
            <p className="mt-4 text-[color:var(--muted)] max-w-2xl mx-auto leading-relaxed">
              {smilePlusHero.specializations} — with personalized planning and digital dentistry protocols.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {smilePlusTreatments.map((t) => (
              <Link
                key={t.title}
                to={t.path}
                className="group bg-[color:var(--soft)]/60 hover:bg-white rounded-2xl p-6 border border-black/5 hover:border-[color:var(--teal)]/25 hover:shadow-lg transition-all no-underline"
              >
                <span className="text-2xl" aria-hidden>
                  {t.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-[color:var(--dk)] group-hover:text-[color:var(--teal)] transition-colors">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm text-[color:var(--muted)] leading-relaxed">{t.desc}</p>
                <span className="mt-4 inline-block text-sm font-bold text-[color:var(--teal)]">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 px-6 bg-[color:var(--soft)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-[color:var(--dk)] mb-4">
            Why Patients Choose Smile Plus Dental Care
          </h2>
          <p className="text-center text-[color:var(--muted)] mb-12 max-w-2xl mx-auto">
            Trusted care near Marathahalli Bridge with advanced technology and specialist-backed treatment planning.
          </p>
          <ul className="grid sm:grid-cols-2 gap-4">
            {smilePlusTrustPoints.map((point) => (
              <li
                key={point}
                className="flex gap-3 items-start bg-white rounded-2xl p-5 border border-black/5 shadow-sm"
              >
                <span className="w-7 h-7 rounded-full bg-[color:var(--teal)]/10 text-[color:var(--teal)] flex items-center justify-center shrink-0 text-sm font-bold">
                  ✓
                </span>
                <span className="text-[color:var(--dk)] font-medium leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Local SEO — matches home dark green band */}
      <section className="py-16 px-6 bg-[color:var(--deep)] text-white border-y border-[color:var(--dk)]/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
            Easily accessible from across Bangalore East
          </h2>
          <p className="text-white/80 leading-relaxed text-lg max-w-3xl mx-auto">
            Our clinic is conveniently located near Marathahalli Bridge and welcomes patients from across East
            Bangalore seeking advanced dental care and smile rehabilitation.
          </p>
          <p className="mt-6 text-sm text-white/50 uppercase tracking-widest font-bold">
            Our clinic is easily accessible from
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

      {/* Gallery */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[color:var(--dk)]">
              Real patient transformations
            </h2>
            <p className="mt-3 text-[color:var(--muted)]">
              Results from specialist-led care at V Dental &amp; Implant Center.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {galleryImages.map((img) => (
              <div
                key={img.alt}
                className="rounded-2xl overflow-hidden border border-black/5 bg-[color:var(--soft)]/40 p-2 shadow-sm"
              >
                <div className="h-[280px] w-full flex items-center justify-center rounded-xl overflow-hidden bg-white">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-contain" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/results" className="text-[color:var(--teal)] font-bold hover:underline">
              View more results →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 max-w-3xl mx-auto bg-[color:var(--bg)]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-[color:var(--dk)]">Frequently asked questions</h2>
          <p className="mt-3 text-[color:var(--muted)]">Dental care in Marathahalli — answered.</p>
        </div>
        <div className="space-y-3">
          {smilePlusFaqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={faq.q} className="bg-white rounded-xl border border-black/5 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center gap-4 font-semibold text-[color:var(--dk)] hover:bg-[color:var(--soft)]/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-[color:var(--teal)] text-xl shrink-0">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-[color:var(--muted)] leading-relaxed border-t border-black/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Map & contact */}
      <section className="py-20 px-6 bg-[color:var(--soft)]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-black/5 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[color:var(--dk)] mb-6">Visit us in Marathahalli</h2>
            <p className="font-bold text-[color:var(--dk)]">{SMILE_PLUS_NAME}</p>
            <p className="mt-3 text-[color:var(--muted)] leading-relaxed">{SMILE_PLUS_ADDRESS_LINE}</p>
            <ul className="mt-8 space-y-4 text-[color:var(--muted)]">
              <li>
                <span className="font-semibold text-[color:var(--dk)]">Phone: </span>
                <a href={`tel:${PHONE_TEL}`} className="text-[color:var(--teal)] font-bold hover:underline">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <span className="font-semibold text-[color:var(--dk)]">Email: </span>
                <a href={`mailto:${CLINIC_EMAIL}`} className="text-[color:var(--teal)] hover:underline">
                  {CLINIC_EMAIL}
                </a>
              </li>
              <li>
                <span className="font-semibold text-[color:var(--dk)]">Main centre: </span>
                V Dental &amp; Implant Center, Indiranagar
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={SMILE_PLUS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[color:var(--teal)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[color:var(--dk)] transition"
              >
                Get Directions
              </a>
              <Link
                to="/"
                className="border border-black/10 px-6 py-3 rounded-xl font-bold text-[color:var(--dk)] hover:bg-[color:var(--soft)] transition"
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

      {/* Final CTA — home-style teal band */}
      <section className="py-20 px-6 bg-gradient-to-br from-[color:var(--teal)] to-[color:var(--dk)] text-center rounded-t-[3rem]">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
          Book Your Consultation Today
        </h2>
        <p className="text-xl text-white/95 font-semibold">{SMILE_PLUS_NAME}</p>
        <p className="mt-2 text-[color:var(--accent)] font-medium tracking-wide">
          Powered by V Dental &amp; Implant Center
        </p>
        <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <Link
            to="/booking"
            className="bg-white text-[color:var(--dk)] px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[color:var(--soft)] transition shadow-lg shadow-black/20"
          >
            Book Free Consultation
          </Link>
          <a
            href={smilePlusWhatsAppUrl(WHATSAPP_MSG)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition shadow-lg"
          >
            WhatsApp Now
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="bg-[color:var(--deep)] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-black/40 transition border border-white/20"
          >
            Call Now
          </a>
          <a
            href={SMILE_PLUS_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/15 backdrop-blur border border-white/35 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/25 transition"
          >
            Get Directions
          </a>
        </div>
      </section>
    </div>
  );
};

export default SmilePlusMarathahalli;

