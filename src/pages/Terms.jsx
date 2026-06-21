import React from 'react';
import { Link } from 'react-router-dom';
import { VDENTAL_MAPS_URL } from '../constants/contact';
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
    icon: 'handshake',
    title: 'Acceptance of Terms',
    content: 'By accessing our websites, submitting enquiries, booking appointments, or receiving treatment at V Dental & Implant Center or Smile Plus Dental Care, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree to any part of these terms, please refrain from using our services.',
    list: null,
  },
  {
    icon: 'calendar_month',
    title: 'Appointment Booking & Scheduling',
    content: 'Appointments may be booked online, by phone, or in person at either clinic. The following conditions apply:',
    list: [
      'Booking confirmation — whether online or by phone — does not constitute a guarantee of a specific treatment outcome',
      'Patients are requested to arrive at least 10 minutes before their scheduled appointment time',
      'Late arrivals may result in a shortened appointment or rescheduling at the clinic\'s discretion, with no additional charge',
      'We reserve the right to reschedule appointments in the event of clinical emergencies, staff unavailability, or other unforeseen circumstances — with advance notice wherever possible',
      'First consultations are offered free of charge and are subject to availability',
    ],
  },
  {
    icon: 'event_busy',
    title: 'Cancellation & Rescheduling Policy',
    content: 'We understand that circumstances change. Our cancellation policy is as follows:',
    list: [
      'We request at least 24 hours\' notice for cancellations or rescheduling',
      'Cancellations made with less than 24 hours\' notice may result in the forfeiture of any deposit paid',
      'Repeated no-shows or persistent last-minute cancellations may result in a booking deposit being required for future appointments',
      'Emergency cancellations are assessed on a case-by-case basis with compassion and flexibility',
      'To cancel or reschedule, contact us by phone or WhatsApp during clinic hours: Monday to Saturday, 9 AM – 7:30 PM',
    ],
  },
  {
    icon: 'edit_note',
    title: 'Informed Consent',
    content: 'All clinical procedures at V Dental & Implant Center and Smile Plus Dental Care are performed only after obtaining informed consent. The following applies:',
    list: [
      'A detailed treatment plan and cost estimate is provided before any procedure begins',
      'Patients must sign a consent form prior to any clinical procedure',
      'For patients under 18 years of age, consent must be provided by a parent or legal guardian',
      'You have the right to withdraw consent at any stage, subject to clinical considerations and any treatment already performed',
      'Verbal consent may be obtained in urgent or emergency situations and will be documented in clinical records',
      'Digital Smile Design previews and treatment simulations are indicative — final results may vary based on individual anatomy and biology',
    ],
  },
  {
    icon: 'payments',
    title: 'Payment Terms & Fees',
    content: 'Our payment policy is designed to be transparent and straightforward:',
    list: [
      'All treatment fees are communicated in writing at the time of consultation — no hidden costs',
      'Payment is due at the time of treatment unless a prior written arrangement has been made',
      'We accept cash, UPI, debit cards, credit cards, and bank transfers',
      'EMI and financing options may be available for qualifying treatments, subject to the terms of the respective financing partner',
      'Fees quoted are valid for 30 days from the date of consultation, after which they may be subject to revision',
      'Deposits paid for specific treatments are non-refundable once clinical preparation has commenced',
    ],
  },
  {
    icon: 'science',
    title: 'Treatment Outcomes',
    content: 'While we maintain the highest clinical and professional standards, the following must be understood:',
    list: [
      'No guarantee of a specific clinical outcome can be made — results are influenced by individual biology, oral health status, and patient compliance',
      'Treatment timelines provided are estimates and may be subject to adjustment based on clinical progress',
      'Post-treatment complications, where they arise, will be assessed and managed professionally and ethically',
      'Patients are responsible for following all post-treatment care instructions provided by their clinician',
      'Long-term outcomes of prosthetic and cosmetic treatments — including veneers, crowns, implants, and aligners — depend on proper maintenance and routine dental check-ups',
    ],
  },
  {
    icon: 'fact_check',
    title: 'Accuracy of Medical Information',
    content: 'The quality and safety of your treatment depends on the information you provide. By proceeding with treatment, you confirm that:',
    list: [
      'All medical history, current medications, allergies, and relevant health conditions disclosed to our clinicians are accurate and complete',
      'You will inform the clinic of any changes to your health status between appointments',
      'V Dental and Smile Plus Dental Care accept no liability for complications arising from inaccurate, incomplete, or withheld medical information provided by the patient',
    ],
  },
  {
    icon: 'language',
    title: 'Website Use & Online Services',
    content: 'Our websites and online platforms are governed by the following terms:',
    list: [
      'All content on our websites — including text, images, videos, treatment descriptions, and clinical information — is provided for informational purposes only and does not constitute medical advice',
      'Online assessment tools, chatbots, and AI smile previews are screening aids only and are not a substitute for a clinical examination',
      'Submission of enquiry forms, booking requests, and online assessments is subject to our Privacy Policy',
      'We are not responsible for the accuracy, content, or privacy practices of any third-party websites linked from our platforms',
      'We reserve the right to modify, suspend, or discontinue any part of our online services at any time without notice',
    ],
  },
  {
    icon: 'copyright',
    title: 'Intellectual Property',
    content: 'All intellectual property associated with V Dental & Implant Center and Smile Plus Dental Care is protected:',
    list: [
      'All trademarks, logos, brand names, clinical photography, videos, written content, and design elements on our platforms are the exclusive property of the respective clinic',
      'Unauthorised reproduction, distribution, modification, or commercial use of any content is strictly prohibited without prior written permission',
      'Patient testimonials, before-and-after imagery, and case studies published with patient consent remain the property of the clinic',
      'Requests for content licensing or reproduction should be directed to the clinic in writing',
    ],
  },
  {
    icon: 'balance',
    title: 'Limitation of Liability',
    content: 'To the fullest extent permitted by applicable law:',
    list: [
      'V Dental & Implant Center and Smile Plus Dental Care shall not be liable for any indirect, incidental, consequential, or punitive damages arising from the use of our services or websites',
      'Our liability in connection with any treatment shall not exceed the direct cost of the specific procedure in question',
      'We are not liable for loss, theft, or damage to personal property on clinic premises unless caused directly by our negligence',
      'Clinical opinions provided during online or telephone consultations are preliminary only — full liability rests on in-person, clinically examined treatment plans',
    ],
  },
  {
    icon: 'gavel',
    title: 'Governing Law & Dispute Resolution',
    content: 'These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of India. Specifically:',
    list: [
      'Any disputes arising out of or in connection with these terms or our services shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka',
      'We strongly encourage patients to resolve any concerns or complaints directly with the clinic in the first instance — most issues are resolved promptly and amicably',
      'Formal complaints may be addressed to the clinic in writing, and we commit to responding within 7 business days',
      'These terms are subject to amendment at any time — the most current version will always be published on our website with the effective date noted',
    ],
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen font-afacad" style={{ background: C.cream }}>
      <SEO
        title="Terms & Conditions | V Dental & Implant Center"
        description="Terms and Conditions for V Dental & Implant Center, Indiranagar and Smile Plus Dental Care, Marathahalli. Appointment policy, treatment consent, payment terms, and governing law."
        keywords="V Dental terms and conditions, dental clinic terms, appointment policy, treatment consent, Bengaluru dental clinic"
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
            Terms &{' '}
            <span className="italic" style={{ color: C.gold }}>Conditions</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: 'rgba(250,246,240,0.68)' }}>
            Please read these terms carefully before using our services. They govern your relationship with V Dental & Implant Center and Smile Plus Dental Care.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {[
              { label: 'V Dental & Implant Center', sub: 'Indiranagar, Bengaluru', url: VDENTAL_MAPS_URL },
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
            These Terms & Conditions apply to all patients, website visitors, and individuals who interact with V Dental & Implant Center or Smile Plus Dental Care — whether in person, online, or by telephone. By engaging with our services in any capacity, you accept these terms in full.
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

              <div className="px-6 py-5">
                {sec.content && (
                  <p className="text-[15px] leading-relaxed mb-4" style={{ color: C.muted }}>{sec.content}</p>
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
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Related links ────────────────────────────────────────────── */}
      <section className="py-12 px-5" style={{ background: C.cream2 }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-4 text-center" style={{ color: C.muted }}>Related Policies</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/privacy-policy"
              className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl transition hover:-translate-y-0.5"
              style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span className="material-symbols-rounded text-[20px]" style={{ color: C.gold }}>shield</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: C.ink }}>Privacy Policy</p>
                <p className="text-xs" style={{ color: C.muted }}>How we protect your information</p>
              </div>
              <span className="material-symbols-rounded ml-auto text-[18px]" style={{ color: 'rgba(201,162,74,0.5)' }}>arrow_forward</span>
            </Link>
            <Link to="/faq"
              className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl transition hover:-translate-y-0.5"
              style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span className="material-symbols-rounded text-[20px]" style={{ color: C.gold }}>menu_book</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: C.ink }}>FAQ</p>
                <p className="text-xs" style={{ color: C.muted }}>Expert answers to common questions</p>
              </div>
              <span className="material-symbols-rounded ml-auto text-[18px]" style={{ color: 'rgba(201,162,74,0.5)' }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-5 relative overflow-hidden text-center" style={{ background: C.dark }}>
        <GoldParticles />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: C.gold }} />
            <p style={{ color: C.gold, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Get In Touch</p>
            <div className="h-px w-8" style={{ background: C.gold }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-normal mb-4" style={{ color: C.cream }}>
            Questions about these terms?
          </h2>
          <p className="mb-10 leading-relaxed" style={{ color: 'rgba(250,246,240,0.68)' }}>
            Our team is happy to clarify any aspect of these terms before you proceed.<br />
            Reach us Monday to Saturday, 9 AM – 7:30 PM IST.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="btn-gold-shimmer btn-magnetic font-bold px-8 py-4 rounded-xl" style={{ color: '#0d0d0d' }}>
              Book Free Consultation
            </Link>
            <a href="tel:+919037251894"
              className="font-bold px-8 py-4 rounded-xl transition hover:-translate-y-0.5"
              style={{ background: 'rgba(250,246,240,0.08)', border: '1px solid rgba(250,246,240,0.2)', color: C.cream }}>
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
