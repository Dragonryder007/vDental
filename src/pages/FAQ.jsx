import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import DentalImplantsFAQ from '../components/DentalImplantsFAQ';
import GoldParticles from '../components/GoldParticles';

const C = {
  dark:  '#0f1e12',
  cream: '#FAF6F0',
  cream2:'#F3EDE4',
  gold:  '#C9A24A',
  ink:   '#1C2B1E',
  muted: '#5A6A5C',
};

const CATEGORIES = [
  { id: 'all',      label: 'All Questions',      icon: 'menu_book' },
  { id: 'smile',    label: 'Smile & Aesthetics', icon: 'auto_awesome' },
  { id: 'aligners', label: 'Aligners & Braces',  icon: 'straighten' },
  { id: 'implants', label: 'Implants & Rehab',   icon: 'healing' },
  { id: 'general',  label: 'General & Family',   icon: 'medical_services' },
  { id: 'intl',     label: 'International',      icon: 'language' },
];

const FAQS = [
  // ── Smile & Aesthetics ──────────────────────────────────────────────
  {
    id: 1, category: 'smile', icon: 'preview',
    q: 'What is Digital Smile Design (DSD) and how does it work?',
    a: 'Digital Smile Design is a precision aesthetic protocol where your facial features, lip line, dental midline, and golden ratio proportions are digitally mapped and analysed. A full simulation of your final smile is created on screen — you see and approve every detail before any clinical work begins. This eliminates guesswork and ensures the result matches your expectations exactly.',
  },
  {
    id: 2, category: 'smile', icon: 'schedule',
    q: 'How long does a full smile makeover take?',
    a: 'Most smile transformations using porcelain veneers or composite bonding are completed in 1–3 clinic visits over 3–7 days. Standalone professional teeth whitening takes a single 60–90 minute appointment. Your clinician will confirm the exact timeline based on the specific procedures in your personalised plan.',
  },
  {
    id: 3, category: 'smile', icon: 'compare',
    q: 'What is the difference between porcelain veneers and composite bonding?',
    a: 'Porcelain veneers are ultra-thin ceramic shells (E-max or zirconia) fabricated in a lab and permanently bonded to the tooth surface. They offer superior durability (15+ years), stain resistance, and a highly natural translucency. Composite bonding uses tooth-coloured resin sculpted directly onto the tooth in a single visit with minimal or no tooth preparation — ideal for minor chips, gaps, or shape corrections. Your specialist will recommend the right option based on your goals and tooth condition.',
  },
  {
    id: 4, category: 'smile', icon: 'lens_blur',
    q: 'Are porcelain veneers permanent? Do they damage the teeth underneath?',
    a: 'Veneers require removal of a very thin enamel layer (0.3–0.7 mm), making them an irreversible procedure. However, this is a conservative preparation and the remaining tooth structure is fully protected under the veneer. With good oral hygiene and routine check-ups, E-max porcelain veneers last 15+ years and require no special maintenance beyond regular brushing and flossing.',
  },
  {
    id: 5, category: 'smile', icon: 'light_mode',
    q: 'How many shades whiter can professional teeth whitening achieve?',
    a: 'Professional in-chair whitening at V Dental uses clinical-grade bleaching agents significantly more effective than over-the-counter products. Most patients achieve 6–10 shades of improvement in a single session. Results vary depending on the natural shade of your teeth and the cause of discolouration. Whitening is also commonly incorporated as the first step in a comprehensive smile design plan.',
  },

  // ── Aligners & Braces ───────────────────────────────────────────────
  {
    id: 6, category: 'aligners', icon: 'timer',
    q: 'How long does Invisalign or clear aligner treatment take?',
    a: 'Duration depends on case complexity. Mild spacing or crowding corrections typically take 6–10 months. Moderate cases: 10–18 months. Complex full-arch cases or significant bite corrections: 18–24 months. After a digital 3D scan at your consultation, your clinician will provide a precise week-by-week treatment timeline before you commit to anything.',
  },
  {
    id: 7, category: 'aligners', icon: 'no_food',
    q: 'Can I eat and drink normally with clear aligners?',
    a: 'You remove your aligners before eating or drinking anything other than plain water, then replace them immediately after rinsing. There are no dietary restrictions whatsoever. Aligners must be worn 20–22 hours per day for treatment to progress on schedule — consistent wear is the single biggest factor in keeping treatment on time.',
  },
  {
    id: 8, category: 'aligners', icon: 'bolt',
    q: 'What are self-ligating braces and why does V Dental use them?',
    a: 'Self-ligating braces (Pitts 21 Pro and Damon Smile systems) replace traditional elastic ties with a built-in sliding clip mechanism. This reduces friction on the wire, applies lighter and more biological forces on the teeth, and allows the arch to develop more naturally. Treatment is typically 20–30% shorter than conventional braces, clinic visits are needed only every 6–10 weeks, and most patients report significantly less discomfort throughout.',
  },
  {
    id: 9, category: 'aligners', icon: 'child_care',
    q: 'What is the right age to start orthodontic treatment?',
    a: 'An initial orthodontic assessment is recommended from age 7–8, when enough permanent teeth have erupted for the specialist to identify developing issues — crowding, bite problems, or jaw discrepancies — and intervene at the most effective window. Teenagers typically begin active treatment between 11–14 years. Adults can benefit from orthodontic treatment at any age — there is no upper age limit.',
  },

  // ── Implants & Rehab ────────────────────────────────────────────────
  {
    id: 10, category: 'implants', icon: 'verified',
    q: 'What is the success rate of dental implants?',
    a: 'When placed by a specialist in a properly diagnosed and planned case, dental implants have a long-term documented success rate of 95–98%. Titanium implants are biocompatible — they undergo osseointegration, fusing directly with the jawbone at a biological level and are not rejected by the body. V Dental uses only internationally certified implant systems with long-term clinical evidence.',
  },
  {
    id: 11, category: 'implants', icon: 'calendar_month',
    q: 'How long does the full implant treatment process take?',
    a: 'A single implant post is placed in 45–60 minutes under local anaesthesia. The final crown is fitted after 6–8 weeks of osseointegration (bone integration). For immediate results, All-on-4 and All-on-6 procedures place a full-arch functional prosthesis on the same day as surgery — you leave the clinic with functional teeth.',
  },
  {
    id: 12, category: 'implants', icon: 'hub',
    q: 'What is All-on-4 and who is it suited for?',
    a: 'All-on-4 is a full-arch implant solution where an entire upper or lower jaw of teeth is supported by just four strategically placed implants. It is designed for patients who have lost most or all of their teeth, have failing dentition, or currently wear a full denture. In most cases, no bone grafting is required. A fixed provisional set of functional teeth is placed on the same day as surgery, and the final permanent prosthesis is fitted after 3–6 months of healing.',
  },
  {
    id: 13, category: 'implants', icon: 'settings_suggest',
    q: 'What is Full Mouth Rehabilitation?',
    a: 'Full Mouth Rehabilitation (FMR) is a comprehensive treatment plan that restores the function, aesthetics, and health of all teeth — upper and lower — simultaneously. It is indicated for patients with severe tooth wear, multiple missing teeth, bite collapse, or extensive damage from decay, trauma, or bruxism. FMR combines multiple disciplines — implants, crowns, veneers, gum treatment, and orthodontics — all designed and sequenced as a single unified plan.',
  },
  {
    id: 14, category: 'implants', icon: 'health_and_safety',
    q: 'What is the recovery like after implant surgery?',
    a: 'Most patients experience mild swelling and tenderness for 2–4 days after placement, well managed with prescribed anti-inflammatory medication. The majority return to work and normal daily activities the following day. We provide comprehensive written aftercare instructions and monitor healing with scheduled follow-up appointments — all included in your treatment plan at no additional charge.',
  },

  // ── General & Family ────────────────────────────────────────────────
  {
    id: 15, category: 'general', icon: 'workspace_premium',
    q: 'Are your dentists specialists or general practitioners?',
    a: 'Every clinician at V Dental holds an MDS (Master of Dental Surgery) postgraduate qualification in their specific speciality — cosmetic dentistry, implantology, orthodontics, or endodontics. We do not use general dentists for specialist procedures. Your treatment is planned and delivered by the appropriate specialist from the first consultation through to completion.',
  },
  {
    id: 16, category: 'general', icon: 'event_available',
    q: 'Is the first consultation free? What does it include?',
    a: 'Yes. Your initial consultation is completely complimentary. It includes a full clinical examination, digital X-ray or CBCT scan assessment where clinically indicated, and a detailed personalised treatment plan with written cost estimates — with no obligation to proceed.',
  },
  {
    id: 17, category: 'general', icon: 'sentiment_satisfied',
    q: 'Is root canal treatment painful?',
    a: 'Modern root canal treatment performed under proper local anaesthesia is no more uncomfortable than a routine filling. The procedure removes the infected nerve tissue that was causing the pain — most patients report significant relief immediately after treatment. With our advanced rotary endodontic equipment, most root canals are completed in a single appointment of 60–90 minutes.',
  },
  {
    id: 18, category: 'general', icon: 'diamond',
    q: 'How long do dental crowns last?',
    a: 'Well-placed zirconia or E-max ceramic crowns typically last 15–20 years or longer with good oral hygiene and routine maintenance. Longevity depends on material quality, fit precision, and how well the patient maintains it. V Dental uses only lab-fabricated, high-strength all-ceramic crowns — no metal-fused-to-ceramic (PFM) unless specifically indicated.',
  },
  {
    id: 19, category: 'general', icon: 'flash_on',
    q: 'What is laser dentistry used for at V Dental?',
    a: 'Dental laser technology enables precise, minimally invasive treatment across a wide range of procedures — gum reshaping and contouring, treatment of gum disease, removal of soft tissue lesions, whitening activation, cavity preparation, and pain relief therapy. Advantages over conventional instruments: less bleeding, faster healing, reduced need for anaesthesia in soft tissue procedures, and greater precision.',
  },
  {
    id: 20, category: 'general', icon: 'face',
    q: 'At what age should my child first visit a dentist?',
    a: "The first dental visit is recommended when the first tooth erupts — or no later than the child's first birthday. Early visits establish a positive relationship with dental care, allow the specialist to monitor jaw and tooth development, and enable early intervention when issues are identified. Six-monthly check-ups from this point forward are the standard recommendation.",
  },

  // ── International ───────────────────────────────────────────────────
  {
    id: 21, category: 'intl', icon: 'flight_takeoff',
    q: 'Do you treat patients from outside Bangalore or internationally?',
    a: 'Yes. We have structured dental tourism packages that consolidate treatment into the fewest possible visits — typically 3–7 days for a complete transformation. We provide a full treatment timeline before your travel, assist with accommodation guidance, and offer pre-visit teleconsultation. Patients visit regularly from the UK, UAE, USA, Singapore, Australia, and from across India.',
  },
  {
    id: 22, category: 'intl', icon: 'travel_explore',
    q: 'What is included in a dental tourism package?',
    a: 'Our international patient packages include: pre-visit online consultation and digital treatment planning, CBCT scan and clinical records on arrival, the full agreed treatment, all follow-up appointments within your stay, written aftercare instructions, and a direct contact for post-treatment questions after you return home. Accommodation is guided but not included in the clinical fee.',
  },
  {
    id: 23, category: 'intl', icon: 'assignment',
    q: 'Can I get a full treatment plan and cost estimate before travelling?',
    a: 'Yes. Send us your existing dental records, X-rays, or clear photographs (we guide you on exactly what to send), and our specialist will prepare a detailed treatment plan with itemised cost estimates. You can also book a video consultation at a time convenient for your time zone. We provide everything you need to make a fully informed decision before booking your travel.',
  },
];

const FAQPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return FAQS.filter(faq => {
      const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch = !q || faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory]);

  const activeCatLabel = CATEGORIES.find(c => c.id === activeCategory)?.label ?? 'All Questions';

  return (
    <div className="min-h-screen font-afacad" style={{ background: C.cream }}>
      <SEO
        title="Frequently Asked Questions | V Dental & Implant Center Bangalore"
        description="Expert answers on dental implants, smile designing, Invisalign, veneers, root canal, crowns, laser dentistry and more — from the specialists at V Dental & Implant Center, Indiranagar, Bangalore."
        keywords="dental FAQ Bangalore, implant questions, Invisalign FAQ, smile makeover questions, root canal FAQ, V Dental FAQ"
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative py-28 md:py-36 px-5 text-center overflow-hidden" style={{ background: C.dark }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: C.gold }} />
            <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Knowledge Centre</p>
            <div className="h-px w-8" style={{ background: C.gold }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-normal leading-tight mb-5" style={{ color: C.cream }}>
            Your Questions,{' '}
            <span className="italic" style={{ color: C.gold }}>Expertly Answered</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: 'rgba(250,246,240,0.68)' }}>
            Straightforward answers from our specialist team — covering every treatment, procedure, and what to expect at V Dental.
          </p>
          <div className="relative max-w-xl mx-auto">
            <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-xl" style={{ color: C.gold }}>search</span>
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory('all'); }}
              className="w-full pl-12 pr-6 py-4 rounded-2xl text-base focus:outline-none"
              style={{ background: 'rgba(250,246,240,0.08)', border: '1px solid rgba(201,162,74,0.30)', color: C.cream }}
            />
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <div className="py-5 px-4" style={{ background: C.ink }}>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-2">
          {[
            { n: '23', label: 'Questions answered' },
            { n: '5',  label: 'Treatment categories' },
            { n: '18', label: 'Services covered' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: C.gold }}>{s.n}</span>
              <span className="text-sm" style={{ color: 'rgba(250,246,240,0.55)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ Accordion ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap justify-center mb-10">
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setExpanded(null); setSearch(''); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shrink-0 transition-all duration-200"
                  style={active
                    ? { background: C.gold, color: '#0d0d0d', boxShadow: '0 4px 14px rgba(201,162,74,0.35)' }
                    : { background: 'white', color: C.muted, border: '1px solid rgba(201,162,74,0.22)' }
                  }
                >
                  <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Section heading */}
          {!search && (
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: C.muted }}>
                {activeCatLabel}
              </h2>
              <div className="flex-1 h-px" style={{ background: 'rgba(201,162,74,0.18)' }} />
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: C.gold }}>
                {filtered.length} {filtered.length === 1 ? 'question' : 'questions'}
              </span>
            </div>
          )}

          {/* No results */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl" style={{ border: '1px solid rgba(201,162,74,0.15)' }}>
              <span className="material-symbols-rounded block text-5xl mb-4" style={{ color: C.gold }}>search_off</span>
              <h3 className="text-xl font-semibold mb-2" style={{ color: C.ink }}>No results found</h3>
              <p style={{ color: C.muted }}>Try different keywords or browse by category above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(faq => {
                const cat = CATEGORIES.find(c => c.id === faq.category);
                const isOpen = expanded === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{
                      border: isOpen ? '1px solid rgba(201,162,74,0.40)' : '1px solid rgba(201,162,74,0.15)',
                      boxShadow: isOpen ? '0 6px 24px rgba(201,162,74,0.10)' : '0 2px 10px rgba(0,0,0,0.04)',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : faq.id)}
                      className="w-full flex items-start gap-4 p-5 sm:p-6 text-left"
                      style={{ background: isOpen ? 'rgba(201,162,74,0.035)' : 'transparent' }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: isOpen ? 'rgba(201,162,74,0.18)' : 'rgba(201,162,74,0.10)', transition: 'background 0.2s' }}
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: '18px', color: C.gold }}>{faq.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-semibold leading-snug mb-1" style={{ color: C.ink }}>{faq.q}</h3>
                        {cat && activeCategory === 'all' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: C.gold }}>
                            <span className="material-symbols-rounded" style={{ fontSize: '11px' }}>{cat.icon}</span>
                            {cat.label}
                          </span>
                        )}
                      </div>
                      <span
                        className="material-symbols-rounded shrink-0 mt-1"
                        style={{
                          fontSize: '22px',
                          color: C.gold,
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        expand_more
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6" style={{ borderTop: '1px solid rgba(201,162,74,0.12)' }}>
                        <p className="pt-5 leading-relaxed text-[15px]" style={{ color: C.muted }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Dental Implants deep-dive ────────────────────────────────── */}
      <DentalImplantsFAQ />

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden text-center" style={{ background: C.dark }}>
        <GoldParticles />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: C.gold }} />
            <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Speak to a Specialist</p>
            <div className="h-px w-8" style={{ background: C.gold }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-normal mb-4" style={{ color: C.cream }}>
            Still have a question?
          </h2>
          <p className="mb-10 leading-relaxed" style={{ color: 'rgba(250,246,240,0.68)' }}>
            Our specialist team is available Monday to Saturday, 9 AM – 7:30 PM IST.<br />
            First consultations are always free — in-clinic or online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="btn-gold-shimmer btn-magnetic font-bold px-8 py-4 rounded-xl" style={{ color: '#0d0d0d' }}>
              Book Free Consultation
            </Link>
            <Link to="/?chat=1"
              className="font-bold px-8 py-4 rounded-xl transition hover:-translate-y-0.5"
              style={{ background: 'rgba(250,246,240,0.08)', border: '1px solid rgba(250,246,240,0.2)', color: C.cream }}>
              Chat with Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
