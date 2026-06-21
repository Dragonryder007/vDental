import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../images/logo.webp';
import { CLINIC_EMAIL, GOOGLE_MAPS_DIRECTIONS_URL, VDENTAL_MAPS_URL } from '../constants/contact';

const ChevronIcon = ({ open }) => (
  <span className={`ms text-[18px] text-white/40 transition-transform duration-300 ${open ? 'rotate-180 ms-fill' : ''}`} aria-hidden="true">keyboard_arrow_down</span>
);

const WA_PATH = "M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 6.69C8.37 6.69 8.1 6.75 7.87 7C7.65 7.25 7 7.85 7 9.06C7 10.27 7.89 11.45 8 11.61C8.14 11.77 9.76 14.3 12.31 15.32C14.42 16.16 14.85 16 15.31 15.95C15.77 15.91 16.78 15.35 17 14.76C17.21 14.18 17.21 13.68 17.14 13.57C17.07 13.47 16.91 13.41 16.67 13.3C16.43 13.17 15.27 12.6 15.05 12.5C14.83 12.43 14.67 12.39 14.5 12.64C14.34 12.89 13.88 13.41 13.74 13.57C13.6 13.74 13.46 13.76 13.22 13.65C12.98 13.53 12.21 13.28 11.3 12.47C10.59 11.84 10.11 11.06 9.97 10.81C9.83 10.57 9.95 10.43 10.07 10.31C10.18 10.2 10.32 10.02 10.44 9.88C10.56 9.74 10.6 9.64 10.68 9.47C10.76 9.31 10.72 9.17 10.66 9.06C10.6 8.95 10.13 7.78 9.93 7.3C9.74 6.85 9.54 6.84 9.38 6.83H8.85C8.85 6.83 8.69 6.69 8.53 6.69Z";

const Footer = () => {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState(null);
  const toggle = (i) => setOpenSection(openSection === i ? null : i);

  const handleLinkClick = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      if (window.location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
    }
  };

  const smileAesthetics = [
    { label: 'Smile Designing', href: '/smile-designing' },
    { label: 'Invisalign', href: '/invisalign-bangalore' },
    { label: 'Veneers', href: '/veneers-bangalore' },
    { label: 'Smile Makeover', href: '/smile-makeover-bangalore' },
    { label: 'Aligners & Braces', href: '/aligners-braces' },
  ];

  const implantsRehab = [
    { label: 'Dental Implants', href: '/dental-implants-bangalore' },
    { label: 'Full Mouth Rehab', href: '/full-mouth-rehabilitation-bangalore' },
    { label: 'All-on-4 / All-on-6 Implants', href: '/all-on-4-implants-bangalore' },
  ];

  const generalFamily = [
    { label: 'General Dentistry', href: '/general-dentistry-bangalore' },
    { label: 'Family Dentistry', href: '/family-dentistry-bangalore' },
    { label: 'Pediatric Dentistry', href: '/pediatric-dentistry-bangalore' },
    { label: 'Laser Dentistry', href: '/laser-dentistry-bangalore' },
    { label: 'Invisalign for Kids', href: '/invisalign-for-kids-bangalore' },
    { label: 'Root Canal Treatment', href: '/root-canal-treatment-bangalore' },
    { label: 'Crowns & Bridge', href: '/crowns-and-bridge-bangalore' },
  ];

  const international = [
    { label: 'Dental Tourism India', href: '/dental-tourism-india' },
    { label: 'NRI Online Consultation', href: '/online-consultation-nri-patients' },
    { label: 'Travel Assistance', href: '/travel-assistance-international-patients' },
  ];

  const company = [
    { label: 'Home', href: '/' },
    { label: 'Our Legacy', href: '/#legacy' },
    { label: 'Our Works', href: '/#our-work' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Blog', href: '/blog' },
    { label: 'AI Preview', href: '/ai-preview' },
  ];

  const support = [
    { label: 'FAQ', href: '/faq' },
    { label: 'Assessment', href: '/assessment' },
    { label: 'Contact', href: '/#contact' },
    { label: 'Results', href: '/results' },
  ];

  const socials = [
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61589612497809', path: 'M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/v-dental-implant-centre/', path: 'M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z' },
  ];

  const LinkList = ({ links }) => (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link to={link.href} onClick={(e) => handleLinkClick(e, link.href)}
            className="text-[13px] text-white/50 hover:text-[color:var(--gold)] transition-colors no-underline leading-snug block">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const ColHeader = ({ title }) => (
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55 mb-3">{title}</p>
  );

  return (
    <footer className="bg-[color:var(--charcoal-deep)] text-white">

      {/* ── Desktop layout (lg+) ── */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 xl:px-8 pt-10 xl:pt-12 pb-6">
        <div className="grid grid-cols-[140px_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 xl:gap-7 items-start">

          {/* Logo col */}
          <div className="flex flex-col gap-4">
            <Link to="/" aria-label="V Dental Home" className="inline-flex items-center hover:opacity-80 transition-opacity">
              <img src={logo} alt="V Dental" className="h-28 w-auto object-contain" style={{ filter: 'invert(1) hue-rotate(180deg)' }} loading="lazy" />
            </Link>
            <p className="text-[10px] text-white/55 leading-relaxed">World-class dentistry in Indiranagar — since 1994.</p>
            <div className="flex gap-1.5 mt-1">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/45 hover:bg-[color:var(--gold)] hover:text-[color:var(--charcoal-deep)] hover:border-transparent transition-all">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden><path d={s.path} /></svg>
                </a>
              ))}
              <a href="https://wa.me/919037151894" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-7 h-7 rounded-md bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden><path d={WA_PATH} /></svg>
              </a>
            </div>
          </div>

          {/* Smile & Aesthetics */}
          <div>
            <ColHeader title="Smile & Aesthetics" />
            <LinkList links={smileAesthetics} />
          </div>

          {/* Implants & Rehab */}
          <div>
            <ColHeader title="Implants & Rehab" />
            <LinkList links={implantsRehab} />
          </div>

          {/* General & Family */}
          <div>
            <ColHeader title="General & Family" />
            <LinkList links={generalFamily} />
          </div>

          {/* International */}
          <div>
            <ColHeader title="International" />
            <LinkList links={international} />
          </div>

          {/* Company */}
          <div>
            <ColHeader title="Company" />
            <LinkList links={company} />
          </div>

          {/* Support */}
          <div>
            <ColHeader title="Support" />
            <LinkList links={support} />
          </div>
        </div>

        {/* Contact strip — full width below the grid */}
        <div className="mt-8 border-t border-white/[0.06] pt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a href={VDENTAL_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="ms text-[16px] text-white/30 flex-shrink-0" aria-hidden="true">location_on</span>
            <span className="text-[12px] text-white/45">531, 2nd Main Road, Indiranagar 2nd Stage, Bangalore — 560038</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="ms text-[16px] text-white/30 flex-shrink-0" aria-hidden="true">call</span>
            <span className="text-[12px] text-white/45">+91 90371 51894</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="ms text-[16px] text-white/30 flex-shrink-0" aria-hidden="true">mail</span>
            <span className="text-[12px] text-white/45">{CLINIC_EMAIL}</span>
          </div>
          <a href={GOOGLE_MAPS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer"
            className="ml-auto text-[11px] font-semibold text-[color:var(--gold)] hover:text-white transition-colors flex items-center gap-1.5">
            Get Directions
            <span className="ms text-[15px]" aria-hidden="true">arrow_forward</span>
          </a>
        </div>
      </div>

      {/* ── Mobile / tablet layout (below lg) ── */}
      <div className="lg:hidden max-w-2xl mx-auto px-5 sm:px-6 py-8">

        {/* Logo + socials row */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" aria-label="V Dental Home" className="inline-flex items-center hover:opacity-80 transition-opacity">
            <img src={logo} alt="V Dental" className="h-28 w-auto object-contain" style={{ filter: 'invert(1) hue-rotate(180deg)' }} />
          </Link>
          <div className="flex gap-2">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/45 hover:bg-[color:var(--gold)] hover:text-[color:var(--charcoal-deep)] transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden><path d={s.path} /></svg>
              </a>
            ))}
            <a href="https://wa.me/919037151894" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              className="w-8 h-8 rounded-md bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden><path d={WA_PATH} /></svg>
            </a>
          </div>
        </div>

        {/* Accordion sections */}
        {[
          { title: 'Smile & Aesthetics', links: smileAesthetics },
          { title: 'Implants & Rehab', links: implantsRehab },
          { title: 'General & Family', links: generalFamily },
          { title: 'International', links: international },
          { title: 'Company', links: company },
          { title: 'Support', links: support },
        ].map((sec, i) => (
          <div key={sec.title} className="border-t border-white/[0.06]">
            <button type="button" onClick={() => toggle(i)}
              className="w-full flex items-center justify-between py-3.5 text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">{sec.title}</span>
              <ChevronIcon open={openSection === i} />
            </button>
            {openSection === i && (
              <div className="pb-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
                {sec.links.map((link) => (
                  <Link key={link.label} to={link.href} onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[13px] text-white/50 hover:text-[color:var(--gold)] transition-colors no-underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Contact accordion */}
        <div className="border-t border-white/[0.06]">
          <button type="button" onClick={() => toggle(6)}
            className="w-full flex items-center justify-between py-3.5 text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Contact</span>
            <ChevronIcon open={openSection === 6} />
          </button>
          {openSection === 6 && (
            <div className="pb-4 space-y-2">
              <a href={VDENTAL_MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/50 leading-snug hover:text-white/70 transition-colors">531, 2nd Main Road, Indiranagar 2nd Stage, Bangalore</a>
              <p className="text-[13px] text-white/50">+91 90371 51894</p>
              <p className="text-[12px] text-white/50 break-all">{CLINIC_EMAIL}</p>
              <a href={VDENTAL_MAPS_URL} target="_blank" rel="noopener noreferrer"
                className="text-[11px] text-[color:var(--gold)] hover:text-white transition-colors inline-block">Get Directions →</a>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-white/22">
          <span>{t('footer.allRights')}</span>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-white/55 transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-white/55 transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
