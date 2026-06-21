import React from 'react';
import ServicePage from '../components/ServicePage';
import smileDesignBefore from '../images/smile design before.webp';
import smileDesignAfter from '../images/smile design after.webp';
import heroSmileDesigning from '../images/hero-smile-designing.webp';
import SEO from '../components/SEO';
import { V_DENTAL_DOCTORS } from '../data/doctors';
import DoctorMobileCarousel from '../components/DoctorMobileCarousel';

const C = {
  dark:  '#0f1e12',
  cream: '#FAF6F0',
  cream2:'#F3EDE4',
  gold:  '#C9A24A',
  ink:   '#1C2B1E',
  muted: '#5A6A5C',
};

const Eyebrow = ({ label, light = false }) => (
  <div className="flex items-center justify-center gap-3 mb-4">
    <div className="h-px w-8" style={{ background: C.gold }} />
    <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
      {label}
    </p>
    <div className="h-px w-8" style={{ background: C.gold }} />
  </div>
);

const jishnu = V_DENTAL_DOCTORS.find(d => d.id === 3);

const SmileDesigning = () => {
  const benefits = [
    {
      icon: <span className="material-symbols-rounded" style={{ fontSize: '2rem', color: C.gold }}>preview</span>,
      title: 'Preview Before Committing',
      desc: 'See your transformed smile digitally before any procedure begins — complete confidence in your decision.',
    },
    {
      icon: <span className="material-symbols-rounded" style={{ fontSize: '2rem', color: C.gold }}>face_retouching_natural</span>,
      title: 'Facial Harmony Analysis',
      desc: 'Proportions mapped to your lip line, facial midline, and golden ratio for a smile designed for your face.',
    },
    {
      icon: <span className="material-symbols-rounded" style={{ fontSize: '2rem', color: C.gold }}>view_in_ar</span>,
      title: 'Advanced 3D Design',
      desc: 'DSD software with precise facial mapping — every millimetre planned before a single tooth is touched.',
    },
    {
      icon: <span className="material-symbols-rounded" style={{ fontSize: '2rem', color: C.gold }}>diamond</span>,
      title: 'E-max & Zirconia',
      desc: 'Restorations that mimic natural enamel translucency and last 15+ years with proper care.',
    },
    {
      icon: <span className="material-symbols-rounded" style={{ fontSize: '2rem', color: C.gold }}>spa</span>,
      title: 'Minimally Invasive',
      desc: 'Conservative preparation preserves maximum natural tooth structure wherever possible.',
    },
    {
      icon: <span className="material-symbols-rounded" style={{ fontSize: '2rem', color: C.gold }}>bolt</span>,
      title: 'Same-Week Results',
      desc: 'Most smile transformations completed in just 1–3 clinic visits with minimal disruption.',
    },
  ];

  const steps = [
    { title: 'Digital Consultation',  desc: 'Share your smile photos and discuss your goals — in-person or online.' },
    { title: 'Facial Mapping',         desc: '3D analysis of your features, lip line, midline, and golden ratio proportions.' },
    { title: 'Live Preview',           desc: 'See your new smile on screen. Refine until every detail is exactly right.' },
    { title: 'Precision Crafting',     desc: 'Custom E-max or zirconia restorations fabricated to exact DSD specifications.' },
    { title: 'Transformation',         desc: 'Final placement and reveal — your new smile in as few as 1–3 visits.' },
  ];

  return (
    <>
      <SEO
        title="Digital Smile Designing in Bangalore | V Dental & Implant Center"
        description="Transform your smile with Digital Smile Design (DSD). See your perfect smile before treatment begins. Porcelain veneers, composite bonding & smile makeovers in Indiranagar, Bangalore."
        keywords="digital smile designing Bangalore, smile makeover Indiranagar, DSD veneers Bangalore, cosmetic dentist Bangalore, porcelain veneers Indiranagar"
      />
      <ServicePage
        title="Digital Smile Designing"
        subtitle="See your perfect smile before treatment begins — precision-engineered to your unique facial features."
        heroImg={heroSmileDesigning}
        benefits={benefits}
        steps={steps}
        beforeImg={smileDesignBefore}
        afterImg={smileDesignAfter}
        journeyTitle="Your Smile Journey"
        outstationText="We welcome patients from across India and abroad for smile design treatments. Most transformations are completed in 1–3 visits."
        specialistsSlot={
          <>
            {/* ── What is DSD ───────────────────────────────── */}
            <section className="py-20 md:py-24 px-5 sm:px-6" style={{ background: C.dark }}>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                  <Eyebrow label="Digital Smile Design" />
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-white leading-tight mb-5">
                    Design Your Smile<br />
                    <span className="italic" style={{ color: C.gold }}>Before We Touch a Tooth</span>
                  </h2>
                  <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(250,246,240,0.65)' }}>
                    Digital Smile Designing (DSD) is a precision protocol that maps your face, analyses your proportions,
                    and creates a fully visualised smile — before any treatment begins. You approve every detail. Then we build it.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-5">
                  {[
                    {
                      icon: 'preview',
                      title: 'You See It First',
                      desc: 'A digital preview of your final smile — mapped to your actual face — before any clinical work begins.',
                    },
                    {
                      icon: 'straighten',
                      title: 'Mathematically Proportioned',
                      desc: 'Lip line, facial midline, golden ratio, and gingival symmetry all analysed and balanced in your design.',
                    },
                    {
                      icon: 'hourglass_bottom',
                      title: '1–3 Visits',
                      desc: 'From design sign-off to final placement — most complete smile transformations take just one to three clinic visits.',
                    },
                  ].map((p, i) => (
                    <div key={i} className="rounded-2xl p-8 text-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,162,74,0.18)' }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                        style={{ background: 'rgba(201,162,74,0.10)', border: '1px solid rgba(201,162,74,0.25)' }}>
                        <span className="material-symbols-rounded text-2xl" style={{ color: C.gold }}>{p.icon}</span>
                      </div>
                      <h3 className="text-lg font-serif font-normal text-white mb-3">{p.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(250,246,240,0.58)' }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Treatments Included ───────────────────────── */}
            <section className="py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream2 }}>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <Eyebrow label="What's Included" />
                  <h2 className="text-3xl md:text-4xl font-serif font-normal mb-3" style={{ color: C.ink }}>
                    Smile Design Treatments
                  </h2>
                  <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: C.muted }}>
                    A complete smile transformation often combines multiple procedures — all planned digitally before any work begins.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { icon: 'lens_blur',             title: 'Porcelain Veneers',    desc: 'Ultra-thin E-max shells bonded to the front surface — perfect shape, shade, and symmetry.' },
                    { icon: 'draw',                  title: 'Composite Bonding',    desc: 'Tooth-coloured resin sculpted directly on the tooth — minimal prep, immediate result.' },
                    { icon: 'light_mode',             title: 'Teeth Whitening',      desc: 'Professional-grade bleaching as part of your smile plan — up to 8 shades brighter.' },
                    { icon: 'eco',                   title: 'Gum Contouring',       desc: 'Laser reshaping of the gum line to correct a gummy smile or uneven gingival levels.' },
                    { icon: 'diamond',               title: 'Dental Crowns',        desc: 'Full-coverage zirconia restorations for damaged or heavily restored teeth in the smile zone.' },
                    { icon: 'auto_awesome',          title: 'Full Smile Makeover',  desc: 'Multiple procedures — designed together, delivered together, for a complete transformation.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-200"
                      style={{ border: '1px solid rgba(201,162,74,0.13)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: 'rgba(201,162,74,0.10)' }}>
                        <span className="material-symbols-rounded text-xl" style={{ color: C.gold }}>{item.icon}</span>
                      </div>
                      <h3 className="text-sm font-bold mb-2" style={{ color: C.ink }}>{item.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Specialist ───────────────────────────────── */}
            <section className="py-20 md:py-24 px-5 sm:px-6" style={{ background: C.cream }}>
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <Eyebrow label="Expert Care" />
                  <h2 className="text-3xl md:text-4xl font-serif font-normal mb-3" style={{ color: C.ink }}>
                    Your Specialist
                  </h2>
                  <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: C.muted }}>
                    Your smile design journey is led by one of Bangalore's most experienced aesthetic specialists.
                  </p>
                </div>

                <div className="sm:hidden -mx-5">
                  <DoctorMobileCarousel doctors={[jishnu]} />
                </div>

                <article
                  className="hidden sm:block bg-white rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 max-w-sm mx-auto"
                  style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
                >
                  <div className="relative h-80 sm:h-[22rem] overflow-hidden" style={{ background: C.cream2 }}>
                    <div
                      className="w-full h-full group-hover:scale-[1.04] transition-transform duration-500"
                      style={{
                        backgroundImage: `url(${jishnu.image})`,
                        backgroundSize: jishnu.photoSize || 'cover',
                        backgroundPosition: jishnu.photoPosition || '50% 45%',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(15,30,18,0.8) 0%, transparent 55%)' }} />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                        style={{ background: 'rgba(15,30,18,0.85)', color: C.gold, border: '1px solid rgba(201,162,74,0.35)' }}>
                        {jishnu.experience}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-normal leading-tight" style={{ color: C.ink }}>{jishnu.name}</h3>
                    <p className="font-semibold text-sm mt-1" style={{ color: '#2d6a40' }}>{jishnu.title}</p>
                    <p className="text-[10px] uppercase tracking-wider mt-0.5 mb-4" style={{ color: C.muted }}>{jishnu.specialization}</p>
                    <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: C.muted }}>{jishnu.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {jishnu.specialties.slice(0, 3).map((s, j) => (
                        <span key={j} className="text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full"
                          style={{ background: 'rgba(201,162,74,0.10)', border: '1px solid rgba(201,162,74,0.22)', color: '#5a4a1e' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </>
        }
      />
    </>
  );
};

export default SmileDesigning;
