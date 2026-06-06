import React, { useState } from 'react';
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
        <span className="text-4xl mb-2" aria-hidden>
          👨‍⚕️
        </span>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[color:var(--muted)]">
          Photo coming soon
        </p>
      </div>
    );
  }
  return (
    <img src={doctor.image} alt={doctor.name} className={`object-cover object-top ${className}`} loading="lazy" />
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
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-xl text-[color:var(--dk)]"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="md:w-2/5 bg-[color:var(--soft)] p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-black/5">
          <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg bg-white">
            <DoctorPhoto doctor={doctor} className="w-full h-full" />
          </div>
        </div>
        <div className="md:w-3/5 p-8 md:p-10 overflow-y-auto">
          <h3 id="doctor-modal-title" className="font-serif text-3xl font-bold text-[color:var(--dk)] mb-2">
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
            <span className="text-[color:var(--accent)]">★</span>
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

  const leadDoctor = V_DENTAL_DOCTORS.find((d) => d.id === MARATHAHALLI_LEAD_DOCTOR_ID);
  const panelDoctors = V_DENTAL_DOCTORS.filter((d) => d.id !== MARATHAHALLI_LEAD_DOCTOR_ID);

  return (
    <section className="py-24 px-4 sm:px-6 bg-[color:var(--deep)] overflow-hidden" id="specialist-team">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[color:var(--accent)] text-xs font-bold uppercase tracking-[0.2em] mb-5">
            <span className="w-2 h-2 rounded-full bg-[color:var(--accent)]" />
            V Dental specialist panel
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
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
            className="w-full text-left mb-8 group rounded-3xl overflow-hidden border border-white/15 bg-white shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
          >
            <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
              <div className="relative min-h-[280px] md:min-h-0 bg-[color:var(--soft)]">
                <DoctorPhoto doctor={leadDoctor} className="absolute inset-0 w-full h-full" />
                <span className="absolute top-4 left-4 bg-[color:var(--teal)] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                  {smilePlusTeamCopy.leadBadge}
                </span>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)] mb-2">
                  Lead clinician · Marathahalli
                </p>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[color:var(--dk)] group-hover:text-[color:var(--teal)] transition-colors">
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

        {/* Rest of panel — compact horizontal cards on cream panel */}
        <div className="rounded-3xl bg-[color:var(--bg)] p-6 sm:p-8 lg:p-10 border border-white/10">
          <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--muted)] mb-8">
            {smilePlusTeamCopy.panelLabel}
          </p>
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {panelDoctors.map((doctor) => (
              <button
                key={doctor.id}
                type="button"
                onClick={() => setSelectedDoctor(doctor)}
                className="group flex flex-col text-center rounded-2xl border border-black/5 bg-white overflow-hidden hover:border-[color:var(--teal)]/30 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--teal)]"
              >
                {/* Photo */}
                <div className="w-full aspect-square bg-[color:var(--soft)] border-b border-black/5 overflow-hidden">
                  <DoctorPhoto doctor={doctor} className="w-full h-full" />
                </div>
                {/* Info */}
                <div className="flex flex-col items-center px-3 py-4 flex-grow">
                  <h3 className="font-serif text-sm font-bold text-[color:var(--dk)] leading-tight group-hover:text-[color:var(--teal)] transition-colors mb-1.5">
                    {doctor.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-[color:var(--teal)] leading-snug mb-1">{doctor.title}</p>
                  <p className="text-[10px] text-[color:var(--muted)] font-medium">{doctor.experience}</p>
                  <span className="mt-3 text-[10px] font-bold text-[color:var(--dk)]/60 group-hover:text-[color:var(--teal)] transition-colors">
                    View Profile →
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-black/5 text-center">
            <p className="text-[color:var(--muted)] mb-5 max-w-xl mx-auto">{smilePlusTeamCopy.ctaDesc}</p>
            <Link
              to="/booking"
              className="inline-flex bg-[color:var(--teal)] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[color:var(--dk)] transition shadow-lg shadow-[color:var(--teal)]/20 no-underline"
            >
              {t('home.doctors.ctaButton')} →
            </Link>
          </div>
        </div>
      </div>

      <DoctorProfileModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
    </section>
  );
};

export default SmilePlusSpecialistTeam;

