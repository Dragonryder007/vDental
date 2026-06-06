import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { V_DENTAL_DOCTORS, isPlaceholderDoctorImage } from '../data/doctors';

const Doctors = () => {
  const { t } = useLanguage();
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <section data-reveal className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[color:var(--bg)] min-w-0 overflow-x-hidden">
      <div className="max-w-7xl mx-auto min-w-0">
        <div className="text-center mb-10 sm:mb-16 min-w-0">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 sm:px-6 py-2 rounded-full bg-white border border-[color:var(--teal)]/10 shadow-sm text-[color:var(--teal)] text-xs font-bold uppercase tracking-[0.2em] mb-5 sm:mb-6 max-w-full">
            <span className="w-3 h-3 rounded-full bg-[color:var(--teal)] shadow-[0_0_8px_rgba(0,102,102,0.4)] shrink-0" />
            <span className="break-words text-left sm:text-center">{t('home.doctors.title')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[color:var(--dk)] mb-4 sm:mb-6 leading-tight break-words px-1">
            {t('home.doctors.teamH2Before')}
            <span className="italic text-[color:var(--teal)]">{t('home.doctors.teamH2Accent')}</span>
            {t('home.doctors.teamH2After')}
          </h2>
          <p className="text-[color:var(--muted)] max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            {t('home.doctors.teamIntro')}
          </p>
        </div>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 min-w-0">
          {V_DENTAL_DOCTORS.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full group cursor-pointer"
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="relative bg-gradient-to-br from-[color:var(--soft)] to-[color:var(--bg)] p-6 flex items-center justify-center min-h-[280px] overflow-hidden">
                <div className="w-full aspect-square rounded-2xl shadow-lg shadow-black/10 border border-black/5 flex items-center justify-center overflow-hidden bg-white group-hover:scale-105 transition-transform duration-500">
                  {isPlaceholderDoctorImage(doctor.image) ? (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-[color:var(--teal)]/10 to-[color:var(--soft)] text-center p-4">
                      <div className="text-5xl mb-2">📷</div>
                      <p className="text-xs font-bold text-[color:var(--muted)] tracking-wide uppercase">
                        {t('home.doctors.photoSoon')}
                      </p>
                      <p className="text-[0.65rem] text-[color:var(--muted)] mt-2">{doctor.name}</p>
                    </div>
                  ) : (
                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[color:var(--dk)] leading-tight">{doctor.name}</h3>
                  <p className="text-sm font-bold text-[color:var(--teal)] mt-2">{doctor.title}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-black/5">
                  <span className="text-xs font-bold text-[color:var(--dk)] group-hover:text-[color:var(--teal)] transition-colors flex items-center gap-1">
                    {t('home.doctors.viewProfile')} <span className="text-lg">→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center p-10 rounded-3xl bg-gradient-to-r from-[color:var(--teal)]/10 to-[color:var(--soft)] border border-[color:var(--teal)]/20">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-[color:var(--dk)] mb-4">
            {t('home.doctors.ctaTitle')}
          </h3>
          <p className="text-[color:var(--muted)] mb-6 max-w-2xl mx-auto">{t('home.doctors.ctaDesc')}</p>
          <Link
            to="/booking"
            className="inline-block bg-[color:var(--teal)] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[color:var(--dk)] transition-all shadow-lg shadow-[color:var(--teal)]/20 active:scale-95 no-underline"
          >
            {t('home.doctors.ctaButton')} →
          </Link>
        </div>
              </div>

      {selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-xl text-[color:var(--dk)] transition-colors"
              onClick={() => setSelectedDoctor(null)}
            >
              ✕
            </button>
            <div className="md:w-2/5 bg-gradient-to-br from-[color:var(--soft)] to-[color:var(--bg)] p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-black/5">
              <div className="w-full aspect-square rounded-2xl shadow-lg shadow-black/10 overflow-hidden bg-white">
                {isPlaceholderDoctorImage(selectedDoctor.image) ? (
                  <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-[color:var(--teal)]/10 to-[color:var(--soft)] text-center p-4">
                    <div className="text-6xl mb-2">📷</div>
                  </div>
                ) : (
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                )}
              </div>
            </div>
            <div className="md:w-3/5 p-8 md:p-10 overflow-y-auto custom-scrollbar">
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-[color:var(--dk)] leading-tight mb-2">
                {selectedDoctor.name}
              </h3>
              <p className="text-xl font-bold text-[color:var(--teal)] mb-6">{selectedDoctor.title}</p>
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Credentials</h4>
                  <p className="text-gray-800 font-medium mb-2">{selectedDoctor.specialization}</p>
                  {selectedDoctor.credentials.map((cred, idx) => (
                    <p key={idx} className="text-gray-600 text-sm flex items-start gap-2 mb-1">
                      <span className="text-[color:var(--teal)] mt-0.5">•</span>
                      {cred}
                    </p>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Core Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-[color:var(--soft)] border border-[color:var(--teal)]/10 text-[color:var(--dk)] px-4 py-2 rounded-full text-sm font-bold"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">About</h4>
                  <p className="text-gray-700 leading-relaxed italic border-l-4 border-[color:var(--teal)]/30 pl-4">
                    {selectedDoctor.description}
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[color:var(--teal)]/10 border border-[color:var(--teal)]/20 shadow-sm">
                  <span className="text-2xl">⭐</span>
                  <span className="text-sm font-bold text-[color:var(--dk)]">
                    <span className="text-[color:var(--teal)]">{selectedDoctor.experience}</span> Experience
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Doctors;

