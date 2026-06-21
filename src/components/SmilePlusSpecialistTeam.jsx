import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  V_DENTAL_DOCTORS,
  MARATHAHALLI_LEAD_DOCTOR_ID,
  isPlaceholderDoctorImage,
} from '../data/doctors';
import { smilePlusTeamCopy } from '../data/smilePlusMarathahalli';

const DoctorPhoto = ({ doctor, className = '' }) => {
  if (isPlaceholderDoctorImage(doctor.image)) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[color:var(--teal)]/15 to-[color:var(--soft)] text-center p-4 ${className}`}
      >
        <span className="text-4xl mb-2" aria-hidden>👨‍⚕️</span>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[color:var(--muted)]">Photo coming soon</p>
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={doctor.name}
      className={className}
      style={{
        backgroundImage: `url(${doctor.image})`,
        backgroundSize: doctor.photoSize || 'cover',
        backgroundPosition: doctor.photoPosition || '50% 0%',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

const DoctorProfileModal = ({ doctor, onClose }) => {
  if (!doctor) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-modal-title"
    >
      <div
        className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-[color:var(--dk)]"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="material-symbols-rounded text-[22px]">close</span>
        </button>
        <div className="md:w-2/5 bg-[color:var(--soft)] p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-black/5">
          <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg bg-white">
            <DoctorPhoto doctor={doctor} className="w-full h-full" />
          </div>
        </div>
        <div className="md:w-3/5 p-8 md:p-10 overflow-y-auto">
          <h3 id="doctor-modal-title" className="font-serif text-3xl font-normal text-[color:var(--dk)] mb-2">
            {doctor.name}
          </h3>
          <p className="text-lg font-bold text-[color:var(--teal)] mb-6">{doctor.title}</p>
          <p className="text-[color:var(--muted)] mb-4">{doctor.specialization}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {doctor.specialties.map((s) => (
              <span
                key={s}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[color:var(--soft)] border border-[color:var(--teal)]/15 text-[color:var(--dk)]"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="text-[color:var(--muted)] leading-relaxed border-l-4 border-[color:var(--teal)]/40 pl-4 italic">
            {doctor.description}
          </p>
          <p className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[color:var(--dk)]">
            <span style={{ color: '#C9A24A' }}>★</span>
            {doctor.experience} experience
          </p>
        </div>
      </div>
    </div>
  );
};

const SmilePlusSpecialistTeam = () => {
  const { t } = useLanguage();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeDocIdx, setActiveDocIdx] = useState(0);
  const carouselRef = useRef(null);
  const cardRefs = useRef([]);

  const leadDoctor = V_DENTAL_DOCTORS.find((d) => d.id === MARATHAHALLI_LEAD_DOCTOR_ID);
  const panelDoctors = V_DENTAL_DOCTORS.filter((d) => d.id !== MARATHAHALLI_LEAD_DOCTOR_ID);

  function scrollTo(idx) {
    const clamped = Math.max(0, Math.min(panelDoctors.length - 1, idx));
    setActiveDocIdx(clamped);
    const container = carouselRef.current;
    const card = cardRefs.current[clamped];
    if (container && card) container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  }

  return (
    <section className="py-24 px-4 sm:px-6 bg-[color:var(--deep)] overflow-hidden" id="specialist-team">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[color:var(--accent)] text-xs font-bold uppercase tracking-[0.2em] mb-5">
            <span className="w-2 h-2 rounded-full bg-[color:var(--accent)]" />
            V Dental specialist panel
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-white leading-tight">
            {t('home.doctors.teamH2Before')}
            <span className="italic text-[color:var(--accent)]">{t('home.doctors.teamH2Accent')}</span>
            {t('home.doctors.teamH2After')}
          </h2>
          <p className="mt-5 text-white/75 text-lg leading-relaxed">{smilePlusTeamCopy.intro}</p>
        </div>

        {/* Lead doctor — featured horizontal card */}
        {leadDoctor && (
          <button
            type="button"
            onClick={() => setSelectedDoctor(leadDoctor)}
            className="w-full text-left mb-8 group rounded-3xl overflow-hidden border border-white/15 bg-white shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24A]"
          >
            <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
              <div className="relative min-h-[280px] md:min-h-0 bg-[color:var(--soft)]">
                <DoctorPhoto doctor={leadDoctor} className="absolute inset-0 w-full h-full" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)] mb-2">
                  Lead clinician · Marathahalli
                </p>
                <h3 className="text-2xl md:text-3xl font-serif font-normal text-[color:var(--dk)] group-hover:text-[color:var(--teal)] transition-colors">
                  {leadDoctor.name}
                </h3>
                <p className="text-[color:var(--teal)] font-semibold mt-2">{leadDoctor.title}</p>
                <p className="text-[color:var(--muted)] mt-4 leading-relaxed line-clamp-3 md:line-clamp-none">
                  {leadDoctor.description}
                </p>
                <span className="mt-6 text-sm font-bold text-[color:var(--dk)] group-hover:text-[color:var(--teal)] inline-flex items-center gap-1">
                  {t('home.doctors.viewProfile')} <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </button>
        )}

        {/* ── MOBILE: Stories-style swipe carousel (hidden sm+) ──────────────── */}
        <div className="sm:hidden -mx-4">

          {/* Progress bars */}
          <div className="flex gap-1.5 px-4 mb-3">
            {panelDoctors.map((_, i) => (
              <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/[0.15]">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: '#C9A24A',
                    width: i <= activeDocIdx ? '100%' : '0%',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Swipeable cards */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory carousel-x"
            onScroll={(e) => {
              const el = e.currentTarget;
              let closestIdx = 0;
              let closestDist = Infinity;
              cardRefs.current.forEach((card, idx) => {
                if (!card) return;
                const dist = Math.abs(card.offsetLeft - el.scrollLeft);
                if (dist < closestDist) { closestDist = dist; closestIdx = idx; }
              });
              setActiveDocIdx(closestIdx);
            }}
          >
            {panelDoctors.map((doctor, i) => (
              <div
                key={doctor.id}
                ref={(el) => (cardRefs.current[i] = el)}
                className="flex-shrink-0 w-full snap-start relative flex flex-col overflow-hidden"
                style={{ minHeight: '75vh', background: '#0f1e12' }}
              >
                {/* Full-bleed photo */}
                {!isPlaceholderDoctorImage(doctor.image) && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${doctor.image})`,
                      backgroundSize: doctor.photoSize || 'cover',
                      backgroundPosition: doctor.photoPosition || '50% 10%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}
                {/* Dark gradient */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.28) 50%, rgba(0,0,0,0.05) 100%)' }}
                />

                {/* Spacer */}
                <div className="flex-1" />

                {/* Bottom content */}
                <div className="relative z-30 px-6 pb-10 pt-12">
                  <h3 className="font-serif text-2xl font-normal text-white leading-tight mb-1">{doctor.name}</h3>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#C9A24A' }}>{doctor.title}</p>
                  <p className="text-white/55 text-xs mb-5">{doctor.experience}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(doctor)}
                    className="relative z-30 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
                    style={{ color: '#C9A24A', background: 'none', border: 'none', padding: 0 }}
                  >
                    {t('home.doctors.viewProfile')} <span>→</span>
                  </button>
                </div>

                {/* Left tap zone — previous */}
                <button
                  type="button"
                  aria-label="Previous doctor"
                  className="absolute left-0 top-0 w-1/3 z-20"
                  style={{ bottom: '6rem', background: 'none', border: 'none' }}
                  onClick={() => scrollTo(i - 1)}
                />
                {/* Right tap zone — next */}
                <button
                  type="button"
                  aria-label="Next doctor"
                  className="absolute right-0 top-0 w-1/3 z-20"
                  style={{ bottom: '6rem', background: 'none', border: 'none' }}
                  onClick={() => scrollTo(i + 1)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── DESKTOP: Portrait grid (hidden below sm) ───────────────────────── */}
        <div className="hidden sm:grid grid-cols-3 lg:grid-cols-5 gap-3">
          {panelDoctors.map((doctor) => (
            <button
              key={doctor.id}
              type="button"
              onClick={() => setSelectedDoctor(doctor)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24A] text-left"
              style={{ aspectRatio: '2/3', minHeight: '360px', background: '#0f1e12', border: 'none', padding: 0 }}
            >
              {!isPlaceholderDoctorImage(doctor.image) && (
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${doctor.image})`,
                    backgroundSize: doctor.photoSize || 'cover',
                    backgroundPosition: doctor.photoPosition || '50% 10%',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.0) 75%)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h3 className="font-serif text-base font-normal text-white leading-tight">{doctor.name}</h3>
                <p className="text-xs font-semibold mt-1" style={{ color: '#C9A24A' }}>{doctor.title}</p>
                <span className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-[#C9A24A] transition-colors duration-200 inline-flex items-center gap-1">
                  View Profile
                  <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                </span>
              </div>
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                style={{ background: '#C9A24A' }}
              />
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-white/50 mb-6 max-w-xl mx-auto text-sm leading-relaxed">{smilePlusTeamCopy.ctaDesc}</p>
          <Link
            to="/booking"
            className="btn-gold-shimmer btn-magnetic inline-flex px-10 py-4 rounded-2xl font-bold no-underline"
            style={{ color: '#0d0d0d' }}
          >
            {t('home.doctors.ctaButton')} →
          </Link>
        </div>

      </div>

      <DoctorProfileModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
    </section>
  );
};

export default SmilePlusSpecialistTeam;
