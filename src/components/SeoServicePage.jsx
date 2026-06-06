import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { GOOGLE_MAPS_DIRECTIONS_URL } from '../constants/contact';
import ScrollReveal from './ScrollReveal';

const WHATSAPP = '919037151894';
const PHONE = '+919037151894';

const SeoServicePage = ({ content, bookingService }) => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const bookingUrl = bookingService
    ? `/booking?service=${encodeURIComponent(bookingService)}`
    : '/booking';

  const whatsappText = encodeURIComponent(
    `Hello! I would like to book a consultation for ${content.title} at V Dental and Implant Center.`
  );

  return (
    <div className="bg-[color:var(--bg)] min-h-screen pt-28 md:pt-36 lg:pt-40">
      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden">
        <img
          src={content.heroImg}
          alt={content.title}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--deep)]/80 via-[color:var(--deep)]/55 to-black/20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-16 text-white">
          <p className="text-[#C9A24A] text-xs font-bold uppercase tracking-[0.25em] mb-3 sm:mb-4">
            {content.locationLine}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 sm:mb-5 leading-tight">
            {content.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed mb-8 sm:mb-10">
            {content.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={bookingUrl}
              className="btn-glow bg-[color:var(--teal)] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[color:var(--dk)] shadow-lg"
            >
              {t('seoService.bookConsultation')}
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-colors"
            >
              {t('seoService.whatsapp')}
            </a>
            <a
              href={`tel:${PHONE}`}
              className="bg-white/15 backdrop-blur border border-white/25 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/25 transition-colors"
            >
              {t('seoService.callNow')}
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      
      <section className="py-12 sm:py-16 md:py-20 px-5 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)] mb-3">
              {t('seoService.problemLabel')}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[color:var(--dk)] mb-4 sm:mb-5">
              {content.problem.title}
            </h2>
            <p className="text-[color:var(--muted)] leading-relaxed text-lg">{content.problem.text}</p>
          </div>
          <ul className="space-y-4">
            {content.problem.points.map((point, i) => (
              <li
                key={i}
                className="flex gap-3 bg-white rounded-xl p-4 border border-black/5 shadow-sm"
              >
                <span className="w-6 h-6 rounded-full bg-[color:var(--teal)]/10 text-[color:var(--teal)] flex items-center justify-center shrink-0 text-sm font-bold">
                  ✓
                </span>
                <span className="text-[color:var(--dk)]">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      

      {/* Treatment */}
      
      <section data-reveal className="py-12 sm:py-16 md:py-20 px-5 sm:px-6 bg-[color:var(--soft)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)] mb-3">
              {t('seoService.treatmentLabel')}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[color:var(--dk)] mb-4">
              {content.treatment.title}
            </h2>
            <p className="text-[color:var(--muted)] max-w-3xl mx-auto leading-relaxed">
              {content.treatment.text}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {content.treatment.points.map((point, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-black/5 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[color:var(--teal)] text-white font-bold flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <p className="text-sm text-[color:var(--dk)] font-medium leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      {/* Benefits */}
      
      <section className="py-12 sm:py-16 md:py-20 px-5 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl font-serif font-bold text-[color:var(--dk)] mb-4">
            {t('services.whyChoose')}
          </h2>
          <div className="w-20 h-1 bg-[color:var(--teal)] mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.benefits.map((benefit, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-[color:var(--dk)] mb-2">{benefit.title}</h3>
              <p className="text-[color:var(--muted)] leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>
      

      {/* Journey */}
      
      <section data-reveal className="py-20 bg-[color:var(--deep)] text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-serif font-bold mb-3 uppercase tracking-wide">
              {content.journeyTitle}
            </h2>
            <p className="opacity-70">{t('services.journeySub')}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {content.steps.map((step, i) => (
              <div key={i} className="relative text-center flex-1">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl font-bold text-[#C9A24A] mx-auto mb-6 border-2 border-white/15">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/65 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      {/* Pricing Comparison Table */}
      {content.pricingTable && (
        <section className="py-20 px-6 bg-[color:var(--soft)]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)] mb-3">
                Treatment Cost Comparison
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[color:var(--dk)] mb-4">
                Affordable Dental Treatment Costs in India
              </h2>
              <p className="text-[color:var(--muted)] max-w-3xl mx-auto leading-relaxed">
                Compare treatment costs at V Dental & Implant Center, Bangalore vs USA, UK, Australia, Dubai/UAE & Saudi Arabia
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl shadow-sm border border-black/5">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-[color:var(--deep)] text-white">
                    <th className="px-4 py-4 text-left font-semibold rounded-tl-2xl">Treatment</th>
                    <th className="px-4 py-4 text-center font-semibold text-[#C9A24A]">India (V Dental)</th>
                    <th className="px-4 py-4 text-center font-semibold">USA</th>
                    <th className="px-4 py-4 text-center font-semibold">UK</th>
                    <th className="px-4 py-4 text-center font-semibold">Australia</th>
                    <th className="px-4 py-4 text-center font-semibold">Dubai / UAE</th>
                    <th className="px-4 py-4 text-center font-semibold rounded-tr-2xl">Saudi Arabia</th>
                  </tr>
                </thead>
                <tbody>
                  {content.pricingTable.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[color:var(--soft)]'}>
                      <td className="px-4 py-4 font-semibold text-[color:var(--dk)]">{row.treatment}</td>
                      <td className="px-4 py-4 text-center font-bold text-[color:var(--teal)]">{row.india}</td>
                      <td className="px-4 py-4 text-center text-[color:var(--muted)]">{row.usa}</td>
                      <td className="px-4 py-4 text-center text-[color:var(--muted)]">{row.uk}</td>
                      <td className="px-4 py-4 text-center text-[color:var(--muted)]">{row.australia}</td>
                      <td className="px-4 py-4 text-center text-[color:var(--muted)]">{row.dubai}</td>
                      <td className="px-4 py-4 text-center text-[color:var(--muted)]">{row.saudi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[color:var(--muted)] text-center mt-4 italic">
              Prices are approximate ranges and may vary depending on case complexity, implant system, materials used, and treatment requirements.
            </p>
          </div>
        </section>
      )}

      {/* Recovery + Pricing */}
      
      <section className="py-12 sm:py-16 md:py-20 px-5 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-10 border border-black/5 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[color:var(--dk)] mb-6">
              {content.recovery.title}
            </h2>
            <div className="space-y-4">
              {content.recovery.items.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-black/5 pb-4 last:border-0"
                >
                  <span className="font-semibold text-[color:var(--dk)]">{item.label}</span>
                  <span className="text-[color:var(--muted)] sm:text-right sm:max-w-[60%]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[color:var(--teal)] to-[color:var(--dk)] rounded-3xl p-5 sm:p-7 md:p-10 text-white">
            <h2 className="text-2xl font-serif font-bold mb-3">{content.pricing.title}</h2>
            <p className="text-3xl font-bold text-[#C9A24A] mb-4">{content.pricing.range}</p>
            <p className="text-white/85 leading-relaxed mb-6">{content.pricing.note}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">
              {t('seoService.pricingFactors')}
            </p>
            <ul className="space-y-2">
              {content.pricing.factors.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-white/90">
                  <span>•</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      

      {/* Aligner Section */}
      {content.alignerSection && (
        <section className="py-20 px-6 bg-[color:var(--soft)]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)] mb-3">
                Clear Aligner Treatments
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[color:var(--dk)] mb-4">
                {content.alignerSection.title}
              </h2>
              <p className="text-[color:var(--muted)] max-w-3xl mx-auto leading-relaxed">
                {content.alignerSection.text}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
                <h3 className="text-lg font-bold text-[color:var(--dk)] mb-5">Available Aligner Solutions</h3>
                <ul className="space-y-3">
                  {content.alignerSection.brands.map((brand, i) => (
                    <li key={i} className="flex gap-3 items-center">
                      <span className="w-6 h-6 rounded-full bg-[color:var(--teal)]/10 text-[color:var(--teal)] flex items-center justify-center shrink-0 text-sm font-bold">✓</span>
                      <span className="text-[color:var(--dk)] font-medium">{brand}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
                <h3 className="text-lg font-bold text-[color:var(--dk)] mb-5">Treatment Focus Areas</h3>
                <ul className="space-y-3">
                  {content.alignerSection.goals.map((goal, i) => (
                    <li key={i} className="flex gap-3 items-center">
                      <span className="w-6 h-6 rounded-full bg-[color:var(--teal)]/10 text-[color:var(--teal)] flex items-center justify-center shrink-0 text-sm font-bold">✓</span>
                      <span className="text-[color:var(--dk)]">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Treatments List */}
      {content.treatmentsList && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)] mb-3">
              What We Treat
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[color:var(--dk)] mb-4">
              Specialized Dental Treatments
            </h2>
            <p className="text-[color:var(--muted)] max-w-2xl mx-auto">
              Comprehensive dental care for international and NRI patients under one roof in Bangalore
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {content.treatmentsList.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-black/5 shadow-sm flex gap-3 items-start">
                <span className="text-[color:var(--teal)] mt-0.5 shrink-0">✦</span>
                <span className="text-[color:var(--dk)] text-sm font-medium leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Implant Systems & Technology */}
      {content.implantSystems && (
        <section className="py-20 px-6 bg-[color:var(--deep)] text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A24A] mb-3">
                Clinical Technology
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {content.implantSystems.title}
              </h2>
              <p className="text-white/70 max-w-3xl mx-auto leading-relaxed">
                {content.implantSystems.text}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-[#C9A24A] mb-5">Premium Global Implant Systems</h3>
                <ul className="space-y-3">
                  {content.implantSystems.systems.map((sys, i) => (
                    <li key={i} className="flex gap-3 items-center text-white/85">
                      <span className="text-[#C9A24A] shrink-0">✦</span>
                      <span className="font-medium">{sys}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-[#C9A24A] mb-5">Advanced Digital Dentistry</h3>
                <ul className="space-y-3">
                  {content.implantSystems.technology.map((tech, i) => (
                    <li key={i} className="flex gap-3 items-center text-white/85">
                      <span className="text-[#C9A24A] shrink-0">✦</span>
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Before / After */}
      {content.afterImg && (
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-[color:var(--dk)] mb-4">
              {t('services.theResult')}
            </h2>
            <p className="text-[color:var(--muted)]">{t('services.resultSub')}</p>
          </div>
          {content.beforeImg ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="relative h-[400px] md:h-[500px]">
                <img src={content.beforeImg} alt="Before treatment" className="w-full h-full object-cover" />
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                  {t('services.beforeTreatment')}
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px]">
                <img src={content.afterImg} alt="After treatment" className="w-full h-full object-cover" />
                <div className="absolute top-6 right-6 bg-[color:var(--teal)] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
                  {t('services.afterReveal')}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl md:max-w-3xl mx-auto rounded-[2rem] shadow-2xl bg-[color:var(--soft)]/40 border border-black/5 p-3 sm:p-4 flex items-center justify-center">
              <img
                src={content.afterImg}
                alt="Before and after treatment result"
                className="w-full max-h-[min(58vh,480px)] sm:max-h-[min(62vh,520px)] object-contain block mx-auto"
              />
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/results" className="text-[color:var(--teal)] font-bold hover:underline">
              {t('services.viewResultsBtn')} →
            </Link>
          </div>
        </section>
      )}

      {/* Doctor(s) */}
      <section className="py-12 sm:py-16 md:py-20 px-5 sm:px-6 bg-[color:var(--soft)]">
        <div className="max-w-5xl mx-auto">
          {content.doctors ? (
            /* Multi-doctor panel */
            <>
              <div className="text-center mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)] mb-2">
                  {t('seoService.doctorLabel')}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[color:var(--dk)]">
                  Our Specialist Team
                </h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-5">
                {content.doctors.map((doc, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col gap-2 ${i === 0 ? 'border-[color:var(--teal)]/30 shadow-[color:var(--teal)]/10' : 'border-black/5'}`}
                  >
                    {i === 0 && (
                      <span className="inline-block self-start bg-[color:var(--teal)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1">
                        Lead Provider
                      </span>
                    )}
                    {i > 0 && (
                      <span className="inline-block self-start bg-[color:var(--soft)] text-[color:var(--teal)] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1">
                        {doc.tag}
                      </span>
                    )}
                    <h3 className="text-lg font-serif font-bold text-[color:var(--dk)]">{doc.name}</h3>
                    <p className="text-[color:var(--teal)] font-semibold text-sm leading-snug">{doc.title}</p>
                    <p className="text-xs text-[color:var(--muted)] mt-1">{doc.experience}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Single doctor */
            <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-12 border border-black/5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--teal)] mb-3">
                {t('seoService.doctorLabel')}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[color:var(--dk)] mb-2">
                {content.doctor.name}
              </h2>
              <p className="text-[color:var(--teal)] font-semibold mb-1">{content.doctor.title}</p>
              <p className="text-sm text-[color:var(--muted)] mb-5">{content.doctor.experience}</p>
              <p className="text-[color:var(--muted)] leading-relaxed">{content.doctor.bio}</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 md:py-20 px-5 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-[color:var(--dk)] mb-3">
            {t('seoService.faqTitle')}
          </h2>
          <p className="text-[color:var(--muted)]">{t('seoService.faqSub')}</p>
        </div>
        <div className="space-y-3">
          {content.faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="bg-white rounded-xl border border-black/5 overflow-hidden">
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

      {/* Reviews */}
      <section className="py-12 sm:py-16 md:py-20 px-5 sm:px-6 bg-[color:var(--deep)] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">{t('seoService.reviewsTitle')}</h2>
            <p className="text-white/65">{t('seoService.reviewsSub')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {content.reviews.map((review, i) => (
              <blockquote
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
              >
                <p className="text-white/90 italic leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <footer className="text-[#C9A24A] font-semibold text-sm">{review.name}</footer>
              </blockquote>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/reviews"
              className="text-[color:var(--teal)] font-bold hover:text-white transition-colors"
            >
              {t('seoService.viewAllReviews')} →
            </Link>
          </div>
        </div>
      </section>

      {/* Outstation */}
      {content.outstationText && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-black/5 shadow-sm text-center">
            <h2 className="text-2xl font-serif font-bold text-[color:var(--deep)] mb-4">
              {t('services.outstationTitle')}
            </h2>
            <p className="text-[color:var(--muted)] mb-8 leading-relaxed">{content.outstationText}</p>
            <div className="grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto text-sm text-[color:var(--muted)]">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex gap-2">
                  <span className="text-[color:var(--teal)]">✓</span>
                  {t(`services.outstationPoint${n}`)}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Local SEO block */}
      <section className="py-12 px-6 border-t border-black/5">
        <div className="max-w-4xl mx-auto text-center text-sm text-[color:var(--muted)]">
          <p className="font-semibold text-[color:var(--dk)] mb-2">V Dental and Implant Center</p>
          <p>531, 2nd Main Road, Indiranagar 2nd Stage, Bangalore, Karnataka</p>
          {content.servedAreas && (
            <p className="mt-3 text-xs text-[color:var(--muted)]">
              Serving patients across: {content.servedAreas.join(' • ')}
            </p>
          )}
          <a
            href={GOOGLE_MAPS_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-[color:var(--teal)] font-bold hover:underline"
          >
            {t('home.contact.getDirections')} →
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-[color:var(--teal)] rounded-t-[3rem] text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
          {t('services.readyTitle')}
        </h2>
        <p className="text-white/85 mb-10 max-w-2xl mx-auto">{t('services.readySub')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={bookingUrl}
            className="bg-white text-[color:var(--dk)] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[color:var(--soft)] transition-colors shadow-lg"
          >
            {t('services.bookNowBtn')}
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[color:var(--dk)] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[color:var(--deep)] transition-colors border border-white/20"
          >
            {t('seoService.whatsapp')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default SeoServicePage;

