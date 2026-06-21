import React from 'react';
import { Link } from 'react-router-dom';
import { VDENTAL_MAPS_URL, SMILE_PLUS_MAPS_URL } from '../constants/contact';
import SEO from '../components/SEO';
import GoldParticles from '../components/GoldParticles';

const C = {
  dark:  '#0f1e12',
  cream: '#FAF6F0',
  cream2:'#F3EDE4',
  gold:  '#C9A24A',
  ink:   '#1C2B1E',
  muted: '#5A6A5C',
};

const SECTIONS = [
  {
    icon: 'person',
    title: 'Information We Collect',
    content: null,
    list: [
      'Personal information — name, age, gender, address, phone number, email',
      'Medical and dental history',
      'Diagnostic records including X-rays, CBCT scans, intraoral scans, photographs, and laboratory reports',
      'Appointment and treatment records',
      'Insurance and payment information (where applicable)',
      'Website enquiries, consultation requests, and communication records',
    ],
  },
  {
    icon: 'task_alt',
    title: 'Purpose of Information Collection',
    content: 'Your information is collected and used to:',
    list: [
      'Provide accurate diagnosis and treatment',
      'Develop personalised treatment plans',
      'Schedule and manage appointments',
      'Maintain clinical records and treatment history',
      'Communicate treatment updates, reminders, and follow-ups',
      'Improve patient care and service quality',
      'Meet legal, regulatory, and professional obligations',
    ],
  },
  {
    icon: 'lock',
    title: 'Patient Confidentiality',
    content: 'All patient information and clinical records are maintained with strict confidentiality. We do not sell, rent, trade, or disclose patient information to third parties for commercial or marketing purposes.',
    sublabel: 'Information may only be shared:',
    list: [
      'With healthcare professionals directly involved in your treatment',
      'When required by law or regulatory authorities',
      'With your explicit written consent',
    ],
  },
  {
    icon: 'clinical_notes',
    title: 'Digital Records & Clinical Documentation',
    content: 'As part of modern dental care, we create and store digital records to support treatment planning, continuity of care, and future dental evaluations:',
    list: [
      'Digital radiographs (X-rays)',
      'CBCT scans',
      'Intraoral scans',
      'Smile design records',
      'Treatment photographs and videos',
      'Clinical notes and laboratory communications',
    ],
  },
  {
    icon: 'photo_camera',
    title: 'Photographs, Videos & Testimonials',
    content: 'Before-and-after photographs, treatment videos, patient testimonials, and success stories may be used for educational, scientific, training, website, social media, and marketing purposes only after obtaining appropriate patient consent. Patients may withdraw consent at any time by contacting the clinic.',
    list: null,
  },
  {
    icon: 'language',
    title: 'Website Privacy & Cookies',
    content: 'Our websites may collect anonymous visitor information through cookies and analytics tools to improve website performance and user experience. We may use services such as Google Analytics, Google Ads, Meta Ads, and WhatsApp Business for communication and marketing purposes.',
    sublabel: 'This may include:',
    list: [
      'Device information and browser type',
      'Website usage statistics',
      'Location-based analytics',
    ],
  },
  {
    icon: 'security',
    title: 'Data Security',
    content: 'We implement industry-standard administrative, technical, and physical safeguards to protect patient information against unauthorised access, misuse, loss, or disclosure. Access to patient records is restricted to authorised personnel only.',
    list: null,
  },
  {
    icon: 'history',
    title: 'Data Retention',
    content: 'Patient records are retained in accordance with applicable healthcare regulations and professional standards to ensure continuity of care and legal compliance.',
    list: null,
  },
  {
    icon: 'gavel',
    title: 'Your Rights',
    content: 'You may request:',
    list: [
      'Access to your personal records',
      'Correction of inaccurate information',
      'Withdrawal of consent for non-clinical communications',
      'Clarification regarding how your information is used',
    ],
    footer: 'Certain records may be retained where required by law or professional regulations.',
  },
  {
    icon: 'flight_takeoff',
    title: 'International Patients',
    content: 'For patients visiting from overseas — including the UK, USA, Canada, Australia, New Zealand, Europe, and the Middle East — we maintain the same standards of confidentiality, privacy, and professional record management throughout the entire treatment process.',
    list: null,
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen font-afacad" style={{ background: C.cream }}>
      <SEO
        title="Privacy Policy | V Dental & Implant Center"
        description="Privacy Policy for V Dental & Implant Center, Indiranagar and Smile Plus Dental Care, Marathahalli. Learn how we protect and manage your personal and health information."
        keywords="V Dental privacy policy, patient confidentiality, dental clinic data protection, Bengaluru dental clinic"
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative py-28 md:py-36 px-5 text-center overflow-hidden" style={{ background: C.dark }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: C.gold }} />
            <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Legal</p>
            <div className="h-px w-8" style={{ background: C.gold }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-normal leading-tight mb-5" style={{ color: C.cream }}>
            Your Privacy,{' '}
            <span className="italic" style={{ color: C.gold }}>Our Responsibility</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: 'rgba(250,246,240,0.68)' }}>
            At V Dental & Implant Center and Smile Plus Dental Care, patient privacy, confidentiality, and trust are fundamental to everything we do.
          </p>

          {/* Clinic badges */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {[
              { label: 'V Dental & Implant Center', sub: 'Indiranagar, Bengaluru' },
              { label: 'Smile Plus Dental Care', sub: 'Marathahalli, Bengaluru' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-2xl"
                style={{ background: 'rgba(250,246,240,0.06)', border: '1px solid rgba(201,162,74,0.22)' }}>
                <span className="material-symbols-rounded text-[18px]" style={{ color: C.gold }}>business</span>
                <div className="text-left">
                  <p className="text-sm font-semibold" style={{ color: C.cream }}>{c.label}</p>
                  <p className="text-xs" style={{ color: 'rgba(250,246,240,0.45)' }}>{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs uppercase tracking-widest" style={{ color: 'rgba(250,246,240,0.28)' }}>
            Effective Date: June 2026
          </p>
        </div>
      </section>

      {/* ── Intro strip ──────────────────────────────────────────────── */}
      <div className="px-5 py-6" style={{ background: C.cream2, borderBottom: '1px solid rgba(201,162,74,0.15)' }}>
        <div className="max-w-3xl mx-auto flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'rgba(201,162,74,0.12)' }}>
            <span className="material-symbols-rounded text-[18px]" style={{ color: C.gold }}>info</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
            We are committed to protecting the personal and health information entrusted to us while delivering exceptional dental care. By using our services, booking appointments, submitting forms, or accessing our websites, you acknowledge and agree to the terms outlined in this Privacy Policy.
          </p>
        </div>
      </div>

      {/* ── Sections ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-5" style={{ background: C.cream }}>
        <div className="max-w-3xl mx-auto space-y-4">
          {SECTIONS.map((sec, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              {/* Section header */}
              <div className="flex items-center gap-4 px-6 py-5"
                style={{ background: 'linear-gradient(to right, rgba(201,162,74,0.07), transparent)', borderBottom: '1px solid rgba(201,162,74,0.12)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(201,162,74,0.12)' }}>
                  <span className="material-symbols-rounded text-[20px]" style={{ color: C.gold }}>{sec.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: C.gold }}>
                    Section {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="text-lg font-serif font-normal leading-snug" style={{ color: C.ink }}>
                    {sec.title}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                {sec.content && (
                  <p className="text-[15px] leading-relaxed mb-4" style={{ color: C.muted }}>{sec.content}</p>
                )}
                {sec.sublabel && (
                  <p className="text-sm font-semibold mb-3" style={{ color: C.ink }}>{sec.sublabel}</p>
                )}
                {sec.list && (
                  <ul className="space-y-2.5">
                    {sec.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-[14px] leading-relaxed" style={{ color: C.muted }}>
                        <span className="material-symbols-rounded shrink-0 mt-0.5" style={{ fontSize: '16px', color: C.gold }}>check_circle</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {sec.footer && (
                  <p className="mt-4 text-xs italic pt-4" style={{ color: 'rgba(90,106,92,0.65)', borderTop: '1px solid rgba(201,162,74,0.12)' }}>
                    {sec.footer}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section className="py-16 px-5" style={{ background: C.cream2 }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: C.gold }} />
              <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Contact Us</p>
              <div className="h-px w-8" style={{ background: C.gold }} />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-normal mb-2" style={{ color: C.ink }}>
              Questions About This Policy?
            </h2>
            <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: C.muted }}>
              Reach out to either of our clinics and we will respond within one business day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Clinic 01', name: 'V Dental & Implant Center', address: 'Indiranagar, Bengaluru, Karnataka', phone: '+91 90372 51894', mapsUrl: VDENTAL_MAPS_URL },
              { label: 'Clinic 02', name: 'Smile Plus Dental Care', address: 'Marathahalli, Bengaluru, Karnataka', phone: '+91 90372 51894', mapsUrl: SMILE_PLUS_MAPS_URL },
            ].map((clinic, i) => (
              <div key={i} className="bg-white rounded-2xl p-6"
                style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: C.dark }}>
                    <span className="material-symbols-rounded text-[18px]" style={{ color: C.gold }}>business</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.gold }}>{clinic.label}</p>
                    <h3 className="text-base font-serif font-normal leading-snug" style={{ color: C.ink }}>{clinic.name}</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href={clinic.mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-2.5 text-sm hover:opacity-70 transition-opacity" style={{ color: C.muted }}>
                    <span className="material-symbols-rounded shrink-0" style={{ fontSize: '16px', color: C.gold }}>location_on</span>
                    {clinic.address}
                  </a>
                  <a href={`tel:${clinic.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2.5 text-sm transition-colors hover:opacity-80" style={{ color: C.muted }}>
                    <span className="material-symbols-rounded shrink-0" style={{ fontSize: '16px', color: C.gold }}>call</span>
                    {clinic.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing ──────────────────────────────────────────────────── */}
      <section className="py-24 px-5 relative overflow-hidden text-center" style={{ background: C.dark }}>
        <GoldParticles />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="material-symbols-rounded block mx-auto mb-6 text-5xl" style={{ color: 'rgba(201,162,74,0.45)' }}>shield</span>
          <blockquote className="text-2xl md:text-3xl font-serif font-normal leading-relaxed mb-4" style={{ color: C.cream }}>
            "Your smile is our priority.{' '}
            <span className="italic" style={{ color: C.gold }}>Your privacy is our responsibility."</span>
          </blockquote>
          <p className="text-sm mb-10" style={{ color: 'rgba(250,246,240,0.35)' }}>
            — V Dental & Implant Center &nbsp;|&nbsp; Smile Plus Dental Care
          </p>
          <Link to="/booking" className="btn-gold-shimmer btn-magnetic font-bold px-8 py-4 rounded-xl" style={{ color: '#0d0d0d' }}>
            Book Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
