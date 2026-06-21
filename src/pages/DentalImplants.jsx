import React from 'react';
import ServicePage from '../components/ServicePage';
import { useLanguage } from '../contexts/LanguageContext';
import implantsBefore from '../images/dental implant before.webp';
import implantsAfter from '../images/dental implant after.webp';
import heroDentalImplants from '../images/hero-dental-implants.webp';
import DentalImplantsFAQ from '../components/DentalImplantsFAQ';
import SEO from '../components/SEO';
import { V_DENTAL_DOCTORS } from '../data/doctors';
import DoctorMobileCarousel from '../components/DoctorMobileCarousel';

const implantDoctors = V_DENTAL_DOCTORS.filter(d => d.id === 1 || d.id === 2 || d.id === 3);

const DentalImplants = () => {
  const { t } = useLanguage();
  const data = {
    title: t('dentalImplants.title'),
    subtitle: t('dentalImplants.subtitle'),
    heroImg: heroDentalImplants,
    benefits: [
      { icon: "🏆", title: t('dentalImplants.benefit1Title'), desc: t('dentalImplants.benefit1Desc') },
      { icon: "👨‍⚕️", title: t('dentalImplants.benefit2Title'), desc: t('dentalImplants.benefit2Desc') },
      { icon: "💻", title: t('dentalImplants.benefit3Title'), desc: t('dentalImplants.benefit3Desc') },
      { icon: "💎", title: t('dentalImplants.benefit4Title'), desc: t('dentalImplants.benefit4Desc') },
      { icon: "🧼", title: t('dentalImplants.benefit5Title'), desc: t('dentalImplants.benefit5Desc') },
      { icon: "🤝", title: t('dentalImplants.benefit6Title'), desc: t('dentalImplants.benefit6Desc') }
    ],
    steps: [
      { title: t('dentalImplants.step1Title'), desc: t('dentalImplants.step1Desc') },
      { title: t('dentalImplants.step2Title'), desc: t('dentalImplants.step2Desc') },
      { title: t('dentalImplants.step3Title'), desc: t('dentalImplants.step3Desc') },
      { title: t('dentalImplants.step4Title'), desc: t('dentalImplants.step4Desc') },
      { title: t('dentalImplants.step5Title'), desc: t('dentalImplants.step5Desc') }
    ],
    journeyTitle: t('dentalImplants.customJourneyTitle'),
    outstationText: t('dentalImplants.outstationText'),
    afterImg: "https://www.sanmarcosdental.com/blog/wp-content/uploads/implant-diagram.jpeg"
  };

  return (
    <>
      <SEO 
        title="Dental Implants" 
        description="Replace missing teeth with permanent, bio-compatible dental implants. High-precision placement for a natural look and lifelong function."
        keywords="dental implants Bengaluru, titanium implants, tooth replacement, implantology, V Dental and Implant Center"
      />
      <ServicePage
        {...data}
        specialistsSlot={
          <section className="py-20 md:py-24 px-5 sm:px-6" style={{ background: '#F3EDE4' }}>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-8" style={{ background: '#C9A24A' }} />
                  <p style={{ color: '#C9A24A', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Expert Care</p>
                  <div className="h-px w-8" style={{ background: '#C9A24A' }} />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3" style={{ color: '#1C2B1E' }}>Your Specialist</h2>
                <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#5A6A5C' }}>
                  Your implant journey is guided by some of Bangalore's most experienced dental specialists.
                </p>
              </div>

              {/* Mobile: stories carousel */}
              <div className="sm:hidden -mx-5">
                <DoctorMobileCarousel doctors={implantDoctors} />
              </div>

              {/* Desktop: card grid */}
              <div className="hidden sm:grid sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {implantDoctors.map((doc, i) => (
                  <article
                    key={doc.id}
                    className="bg-white rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                    style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
                  >
                    <div className="relative h-80 sm:h-[22rem] overflow-hidden" style={{ background: '#F3EDE4' }}>
                      <div
                        className="w-full h-full group-hover:scale-[1.04] transition-transform duration-500"
                        style={{
                          backgroundImage: `url(${doc.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: doc.photoPosition || '50% 0%',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,30,18,0.8) 0%, transparent 55%)' }} />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                          style={{ background: 'rgba(15,30,18,0.85)', color: '#C9A24A', border: '1px solid rgba(201,162,74,0.35)' }}>
                          {doc.experience}
                        </span>
                        {i === 0 && (
                          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                            style={{ background: '#C9A24A', color: '#fff' }}>
                            Lead Specialist
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold leading-tight" style={{ color: '#1C2B1E' }}>{doc.name}</h3>
                      <p className="font-semibold text-sm mt-1" style={{ color: '#2d6a40' }}>{doc.title}</p>
                      <p className="text-[10px] uppercase tracking-wider mt-0.5 mb-4" style={{ color: '#5A6A5C' }}>{doc.specialization}</p>
                      <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: '#5A6A5C' }}>{doc.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {doc.specialties.slice(0, 3).map((s, j) => (
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
            </div>
          </section>
        }
      />

      <DentalImplantsFAQ />
    </>
  );
};

export default DentalImplants;

