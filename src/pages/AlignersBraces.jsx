import React from 'react';
import ServicePage from '../components/ServicePage';
import { useLanguage } from '../contexts/LanguageContext';
import alignersBefore from '../images/braces and aligners before.webp';
import alignersAfter from '../images/braces and aligners after.webp';
import heroAlignersBraces from '../images/hero-aligners-braces.webp';
import heroPitts21 from '../images/hero-pitts21.webp';
import heroDamon from '../images/hero-damon.webp';
import SEO from '../components/SEO';
import { V_DENTAL_DOCTORS } from '../data/doctors';
import DoctorMobileCarousel from '../components/DoctorMobileCarousel';

const sonika = V_DENTAL_DOCTORS.find(d => d.id === 6);
const sarah = V_DENTAL_DOCTORS.find(d => d.id === 4);

const specialists = [sonika, sarah];

const AlignersBraces = () => {
  const { t } = useLanguage();
  const data = {
    title: t('alignersBraces.title'),
    subtitle: t('alignersBraces.subtitle'),
    heroImg: heroAlignersBraces,
    benefits: [
      { icon: "🏆", title: t('alignersBraces.benefit1Title'), desc: t('alignersBraces.benefit1Desc') },
      { icon: "👨‍⚕️", title: t('alignersBraces.benefit2Title'), desc: t('alignersBraces.benefit2Desc') },
      { icon: "💻", title: t('alignersBraces.benefit3Title'), desc: t('alignersBraces.benefit3Desc') },
      { icon: "💎", title: t('alignersBraces.benefit4Title'), desc: t('alignersBraces.benefit4Desc') },
      { icon: "🧼", title: t('alignersBraces.benefit5Title'), desc: t('alignersBraces.benefit5Desc') },
      { icon: "🤝", title: t('alignersBraces.benefit6Title'), desc: t('alignersBraces.benefit6Desc') }
    ],
    steps: [
      { title: t('alignersBraces.step1Title'), desc: t('alignersBraces.step1Desc') },
      { title: t('alignersBraces.step2Title'), desc: t('alignersBraces.step2Desc') },
      { title: t('alignersBraces.step3Title'), desc: t('alignersBraces.step3Desc') },
      { title: t('alignersBraces.step4Title'), desc: t('alignersBraces.step4Desc') },
      { title: t('alignersBraces.step5Title'), desc: t('alignersBraces.step5Desc') }
    ],
    journeyTitle: t('alignersBraces.customJourneyTitle'),
    outstationText: t('alignersBraces.outstationText'),
    afterImg: "https://dentistry.uic.edu/wp-content/uploads/sites/741/2020/10/iStock-501427146-1090x595.jpg",
  };

  return (
    <>
      <SEO
        title="Clear Aligners & Braces"
        description="Get a straighter smile with invisible aligners and advanced braces. Discreet orthodontic solutions for adults and children in Bengaluru."
        keywords="clear aligners, Invisalign alternative, metal braces, orthodontist Bengaluru, straight teeth"
      />
      <ServicePage
        {...data}
        specialistsSlot={
          <>
          {/* ── BRACES TECHNOLOGY ─────────────────────────────────────── */}
          <section className="py-20 md:py-24 px-5 sm:px-6" style={{ background: '#0f1e12' }}>
            <div className="max-w-7xl mx-auto">

              {/* Header */}
              <div className="text-center mb-14">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-8" style={{ background: '#C9A24A' }} />
                  <p style={{ color: '#C9A24A', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Premium Orthodontic Systems</p>
                  <div className="h-px w-8" style={{ background: '#C9A24A' }} />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-normal text-white mb-5 leading-tight">
                  World-Class Braces <span className="italic" style={{ color: '#C9A24A' }}>Technology</span>
                </h2>
                <p className="max-w-2xl mx-auto text-base leading-relaxed font-light" style={{ color: 'rgba(250,246,240,0.60)' }}>
                  Most braces use elastic rubber bands to hold the wire — creating friction that slows tooth movement and demands frequent tightening visits. We use a fundamentally better approach.
                </p>
                {/* SLB explanation pill */}
                <div className="mt-7 inline-flex items-start gap-4 rounded-2xl px-6 py-4 text-left max-w-2xl"
                  style={{ background: 'rgba(201,162,74,0.08)', border: '1px solid rgba(201,162,74,0.20)' }}>
                  <span className="material-symbols-rounded text-[24px] shrink-0 mt-0.5" style={{ color: '#C9A24A' }}>lightbulb</span>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(250,246,240,0.75)' }}>
                    <span className="font-bold text-white">What is Self-Ligating Braces (SLB)?</span>
                    {' '}Instead of elastic ties, SLB brackets have a precision-engineered sliding clip built directly into the bracket. Teeth move more freely, more comfortably, and more predictably — with significantly fewer clinic visits and shorter overall treatment time.
                  </p>
                </div>
              </div>

              {/* Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-10 items-start">

                {/* ── Pitts 21 Pro — Featured ── */}
                <div className="rounded-3xl overflow-hidden flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,162,74,0.30)' }}>
                  <div className="h-[3px]" style={{ background: 'linear-gradient(to right, #C9A24A, #F5D78E, #C9A24A)' }} />

                  <div className="h-56 sm:h-64 relative overflow-hidden">
                    <img
                      src={heroPitts21}
                      alt="Pitts 21 Pro self-ligating bracket system"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(15,30,18,0.55) 0%, transparent 55%)' }} />
                  </div>

                  <div className="p-7 sm:p-9 flex flex-col">
                    <span className="self-start inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-5"
                      style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.40)', color: '#C9A24A' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A24A' }} />
                      Our Primary System
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white mb-1">Pitts 21 Pro</h3>
                    <p className="text-sm font-semibold mb-5" style={{ color: '#C9A24A' }}>Next-Generation Self-Ligating Braces</p>
                    <p className="text-sm leading-relaxed mb-2 font-light" style={{ color: 'rgba(250,246,240,0.65)' }}>
                      The Pitts 21 Pro is engineered around one core principle — your teeth should end up exactly where they naturally belong for the best-looking, best-functioning smile possible. Most bracket systems are designed for the "average" patient. Pitts 21 Pro is designed for <em>your</em> facial structure.
                    </p>
                    <p className="text-sm leading-relaxed mb-7 font-light" style={{ color: 'rgba(250,246,240,0.65)' }}>
                      The "21°" refers to the precise torque angle built into every bracket — engineered to position each tooth in its optimal location relative to your jaw, face, and bite. The active self-ligating clip then delivers consistent, controlled force throughout treatment, reducing friction and accelerating results.
                    </p>

                    <ul className="space-y-3.5 mb-8">
                      {[
                        { title: 'Engineered for your facial structure', desc: '21° torque prescription positions teeth for ideal harmony with your jaw and bite — not just straightness' },
                        { title: 'Active clip for precise force control', desc: 'The built-in clip actively engages the wire, delivering consistent pressure for predictable, accurate results' },
                        { title: 'Faster treatment timelines', desc: 'Lower friction and superior biomechanics mean teeth move more efficiently — often completing treatment months sooner' },
                        { title: 'Fewer appointments', desc: 'Adjustments needed every 6–10 weeks instead of 3–4 weeks with traditional braces' },
                        { title: 'Comfort-first design', desc: 'No elastic ties means less irritation to cheeks and gums throughout your entire treatment' },
                      ].map((pt) => (
                        <li key={pt.title} className="flex items-start gap-3 text-sm">
                          <span className="material-symbols-rounded text-[18px] mt-0.5 shrink-0" style={{ color: '#C9A24A' }}>check_circle</span>
                          <span>
                            <span className="font-semibold text-white">{pt.title} — </span>
                            <span className="font-light" style={{ color: 'rgba(250,246,240,0.65)' }}>{pt.desc}</span>
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Clear21 callout */}
                    <div className="rounded-2xl p-5 mb-5" style={{ background: 'rgba(201,162,74,0.07)', border: '1px solid rgba(201,162,74,0.20)' }}>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#C9A24A' }}>Also available — Clear21</p>
                      <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(250,246,240,0.70)' }}>
                        Clear21 is the tooth-coloured ceramic version of the Pitts 21 Pro system. Identical clinical performance and precision — virtually invisible on your teeth. The ideal choice for adults and teens who want the gold-standard results of Pitts 21 Pro without the metallic appearance.
                      </p>
                    </div>

                    {/* Ideal for */}
                    <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(255,255,255,0.40)' }}>Ideal for</p>
                      <ul className="space-y-2">
                        {[
                          'Complex alignment, rotation & bite correction cases',
                          'Patients who want the fastest possible treatment outcome',
                          'Teens & adults requiring high-precision arch development',
                          'Anyone choosing the gold standard in SLB technology',
                        ].map((pt) => (
                          <li key={pt} className="flex items-start gap-2 text-xs font-light leading-relaxed" style={{ color: 'rgba(250,246,240,0.60)' }}>
                            <span className="material-symbols-rounded text-[13px] mt-0.5 shrink-0" style={{ color: '#C9A24A' }}>arrow_forward</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Available as</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: '#FAF6F0' }}>
                          Metal — Pitts 21 Pro
                        </span>
                        <span className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: 'rgba(201,162,74,0.10)', border: '1px solid rgba(201,162,74,0.40)', color: '#C9A24A' }}>
                          Ceramic — Clear21
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Damon Smile — Secondary ── */}
                <div className="rounded-3xl overflow-hidden flex flex-col" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.10)' }}>

                  <div className="h-56 sm:h-64 relative overflow-hidden">
                    <img
                      src={heroDamon}
                      alt="Damon Smile self-ligating bracket system"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(15,30,18,0.55) 0%, transparent 55%)' }} />
                  </div>

                  <div className="p-7 sm:p-9 flex flex-col">
                    <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white mb-1">Damon Smile</h3>
                    <p className="text-sm font-semibold mb-5" style={{ color: '#C9A24A' }}>Passive Self-Ligating · Broader Smiles</p>

                    <p className="text-sm leading-relaxed mb-3 font-light" style={{ color: 'rgba(250,246,240,0.65)' }}>
                      The Damon System is built on a powerful insight — when you reduce friction in orthodontic treatment, everything improves. By replacing elastic ties with a passive sliding door mechanism, the Damon bracket allows the wire to move freely within it. Lighter forces guide your teeth into position, your bone and tissue respond more naturally, and your smile develops in a way that looks genuinely broad and harmonious — not just straight.
                    </p>
                    <p className="text-sm leading-relaxed mb-7 font-light" style={{ color: 'rgba(250,246,240,0.65)' }}>
                      One of Damon's most significant clinical advantages is arch development without extractions. Traditional braces frequently remove healthy teeth to create space. Damon's light-force approach allows the arch to expand naturally in many cases — preserving your natural dentition while creating a fuller, wider, more confident smile.
                    </p>

                    <ul className="space-y-3.5 mb-8">
                      {[
                        { title: 'Passive sliding mechanism', desc: 'Zero elastic ties means ultra-low friction — teeth move freely with minimal resistance and reduced soreness' },
                        { title: 'Natural arch development', desc: 'Encourages the jaw arch to widen organically, creating a broader, more aesthetic smile that complements your face' },
                        { title: 'Extraction-free in many cases', desc: 'Light biologically gentle forces frequently eliminate the need to remove healthy teeth — even in crowded cases' },
                        { title: 'Fewer, shorter appointments', desc: 'The passive mechanism requires minimal adjustments — ideal for busy adults and teens with demanding schedules' },
                        { title: 'Proven clinical outcomes', desc: 'Thousands of cases globally demonstrate faster treatment, improved facial aesthetics, and superior long-term stability' },
                      ].map((pt) => (
                        <li key={pt.title} className="flex items-start gap-3 text-sm">
                          <span className="material-symbols-rounded text-[18px] mt-0.5 shrink-0" style={{ color: '#C9A24A' }}>check_circle</span>
                          <span>
                            <span className="font-semibold text-white">{pt.title} — </span>
                            <span className="font-light" style={{ color: 'rgba(250,246,240,0.65)' }}>{pt.desc}</span>
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Damon Clear callout */}
                    <div className="rounded-2xl p-5 mb-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(250,246,240,0.55)' }}>Also available — Damon Clear</p>
                      <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(250,246,240,0.65)' }}>
                        Damon Clear is the ceramic, virtually invisible version of the Damon System. The same passive self-ligating technology and proven clinical outcomes — with a discreet, translucent bracket that blends seamlessly with your teeth for those who prefer a less visible treatment option.
                      </p>
                    </div>

                    {/* Ideal for */}
                    <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(255,255,255,0.40)' }}>Ideal for</p>
                      <ul className="space-y-2">
                        {[
                          'Patients seeking a broader, more natural-looking smile arc',
                          'Cases where traditional methods would require extractions',
                          'Adults & teens prioritising comfort and fewer appointments',
                          'Those wanting metal or discreet clear bracket options',
                        ].map((pt) => (
                          <li key={pt} className="flex items-start gap-2 text-xs font-light leading-relaxed" style={{ color: 'rgba(250,246,240,0.60)' }}>
                            <span className="material-symbols-rounded text-[13px] mt-0.5 shrink-0" style={{ color: '#C9A24A' }}>arrow_forward</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Available as</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: '#FAF6F0' }}>
                          Metal — Damon Smile
                        </span>
                        <span className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(250,246,240,0.80)' }}>
                          Ceramic — Damon Clear
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SLB vs Traditional comparison ── */}
              <div className="rounded-3xl overflow-hidden mb-8" style={{ border: '1px solid rgba(201,162,74,0.15)' }}>
                <div className="px-7 py-6 text-center" style={{ background: 'rgba(201,162,74,0.06)', borderBottom: '1px solid rgba(201,162,74,0.12)' }}>
                  <h3 className="font-serif font-normal text-white text-xl sm:text-2xl">SLB vs Traditional Braces</h3>
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Why the technology matters for your treatment experience</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                  {[
                    { label: 'Treatment Time',  trad: '24–36 months average',           slb: 'Often 20–30% shorter' },
                    { label: 'Clinic Visits',   trad: 'Every 3–4 weeks',                slb: 'Every 6–10 weeks only' },
                    { label: 'Comfort Level',   trad: 'Higher pressure & soreness',     slb: 'Gentler, lighter forces' },
                    { label: 'Oral Hygiene',    trad: 'Elastics trap food & bacteria',  slb: 'Easier — no elastic ties' },
                    { label: 'Extraction Risk', trad: 'Often required for crowding',    slb: 'Frequently avoidable' },
                  ].map((row, i) => (
                    <div key={row.label} className="p-5 sm:p-6"
                      style={{ background: 'rgba(255,255,255,0.02)', borderRight: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold pb-3 mb-4" style={{ color: 'rgba(255,255,255,0.38)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {row.label}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-rounded text-[14px] shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.22)' }}>close</span>
                          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{row.trad}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-rounded text-[14px] shrink-0 mt-0.5" style={{ color: '#C9A24A' }}>check</span>
                          <p className="text-xs font-semibold leading-relaxed" style={{ color: 'rgba(250,246,240,0.85)' }}>{row.slb}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Which system is right for you? ── */}
              <div className="rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-7 py-6 text-center" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 className="font-serif font-normal text-white text-xl sm:text-2xl">Which System is Right for You?</h3>
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Every case is unique — here's a simple guide</p>
                </div>
                <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
                  {[
                    {
                      icon: 'military_tech',
                      system: 'Pitts 21 Pro',
                      tag: 'Metal SLB',
                      tagColor: 'rgba(255,255,255,0.15)',
                      tagText: '#FAF6F0',
                      ideal: 'Complex alignment cases, rotations, bite correction, or anyone who wants the most clinically precise and fastest treatment outcome.',
                    },
                    {
                      icon: 'diamond',
                      system: 'Clear21',
                      tag: 'Ceramic SLB',
                      tagColor: 'rgba(201,162,74,0.15)',
                      tagText: '#C9A24A',
                      ideal: 'Adults and teens who want the full clinical precision of Pitts 21 Pro with a discreet, tooth-coloured appearance throughout treatment.',
                    },
                    {
                      icon: 'sentiment_very_satisfied',
                      system: 'Damon Smile',
                      tag: 'Metal or Clear',
                      tagColor: 'rgba(74,144,217,0.15)',
                      tagText: '#7BB8E8',
                      ideal: 'Patients seeking a broader, more natural smile arc — particularly effective for cases where traditional methods would require tooth extractions.',
                    },
                  ].map((item) => (
                    <div key={item.system} className="p-7 sm:p-8" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <span className="material-symbols-rounded text-[28px] mb-4 block" style={{ color: '#C9A24A' }}>{item.icon}</span>
                      <p className="font-serif text-lg font-normal text-white mb-2">{item.system}</p>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-4"
                        style={{ background: item.tagColor, color: item.tagText }}>
                        {item.tag}
                      </span>
                      <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(250,246,240,0.62)' }}>
                        <span className="font-semibold text-white">Best for: </span>{item.ideal}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-7 py-5 text-center" style={{ background: 'rgba(201,162,74,0.05)', borderTop: '1px solid rgba(201,162,74,0.12)' }}>
                  <p className="text-sm" style={{ color: 'rgba(250,246,240,0.55)' }}>
                    Not sure which is right for you?{' '}
                    <a href="/booking" className="font-bold hover:underline" style={{ color: '#C9A24A' }}>
                      Book a free consultation →
                    </a>
                    {' '}and we'll recommend the best system for your case.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ── SPECIALISTS ─────────────────────────────────────────────── */}
          <section className="py-20 md:py-24 px-5 sm:px-6" style={{ background: '#F3EDE4' }}>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-14">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-8" style={{ background: '#C9A24A' }} />
                  <p style={{ color: '#C9A24A', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Expert Care</p>
                  <div className="h-px w-8" style={{ background: '#C9A24A' }} />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3" style={{ color: '#1C2B1E' }}>Your Specialists</h2>
                <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#5A6A5C' }}>
                  Your aligner and braces treatment is guided by two of Bangalore's most experienced orthodontists.
                </p>
              </div>
              {/* Mobile: stories carousel */}
              <div className="sm:hidden -mx-5">
                <DoctorMobileCarousel doctors={specialists} />
              </div>

              {/* Desktop: card grid */}
              <div className="hidden sm:grid sm:grid-cols-2 gap-6">
                {specialists.map((doc, i) => (
                  <article
                    key={i}
                    className="bg-white rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                    style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
                  >
                    <div className="relative h-80 sm:h-[22rem] overflow-hidden" style={{ background: '#F3EDE4' }}>
                      <div
                        className="w-full h-full group-hover:scale-[1.04] transition-transform duration-500"
                        style={{
                          backgroundImage: `url(${doc.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: '50% 0%',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,30,18,0.8) 0%, transparent 55%)' }} />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                          style={{ background: 'rgba(15,30,18,0.85)', color: '#C9A24A', border: '1px solid rgba(201,162,74,0.35)' }}>
                          {doc.experience}
                        </span>
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

          </>
        }
      />
    </>
  );
};

export default AlignersBraces;

