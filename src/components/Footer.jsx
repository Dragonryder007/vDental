import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../images/logo.png';
import { CLINIC_EMAIL, GOOGLE_MAPS_DIRECTIONS_URL } from '../constants/contact';

const Footer = () => {
  const { t } = useLanguage();

  const footerSections = [
    {
      title: 'Smile & Aesthetics',
      links: [
        { label: t('nav.smileDesigning'), href: '/smile-designing' },
        { label: t('nav.invisalignBangalore'), href: '/invisalign-bangalore' },
        { label: t('nav.veneersBangalore'), href: '/veneers-bangalore' },
        { label: t('nav.smileMakeoverBangalore'), href: '/smile-makeover-bangalore' },
        { label: t('nav.alignersBraces'), href: '/aligners-braces' },
        { label: 'Dental Implants', href: '/dental-implants-bangalore' },
        { label: t('nav.fullMouthRehab'), href: '/full-mouth-rehabilitation-bangalore' },
        { label: t('nav.allOn4Implants'), href: '/all-on-4-implants-bangalore' },
        { label: t('nav.dentalTourism'), href: '/dental-tourism-india' },
        { label: 'NRI Online Consultation', href: '/online-consultation-nri-patients' },
        { label: 'Travel Assistance', href: '/travel-assistance-international-patients' },
      ]
    },
    {
      title: 'General & Family',
      links: [
        { label: 'General Dentistry', href: '/general-dentistry-bangalore' },
        { label: 'Family Dentistry', href: '/family-dentistry-bangalore' },
        { label: 'Pediatric Dentistry', href: '/pediatric-dentistry-bangalore' },
        { label: 'Laser Dentistry', href: '/laser-dentistry-bangalore' },
        { label: 'Invisalign for Kids', href: '/invisalign-for-kids-bangalore' },
      ]
    },
    {
      title: 'Navigation',
      links: [
        { label: t('nav.home'), href: '/' },
        { label: t('nav.aboutUs'), href: '/#about' },
        { label: t('nav.ourWork'), href: '/#our-work' },
        { label: t('nav.aiPreview'), href: '/ai-preview' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: t('nav.assessment'), href: '/assessment' },
        { label: t('nav.faq'), href: '/faq' },
        { label: t('nav.blog'), href: '/blog' },
        { label: t('nav.reviews'), href: '/reviews' },
        { label: t('nav.contact'), href: '/#contact' }
      ]
    }
  ];

  const handleLinkClick = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      if (window.location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <footer className="bg-[color:var(--deep)] text-white pt-12 sm:pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 md:gap-12 pb-12 md:pb-16">
        {/* Branding & Contact */}
        <div className="col-span-2 lg:col-span-2">
          <Link to="/" className="flex items-center no-underline group mb-4">
            <img
              src={logo}
              alt="V Dental and Implant Center Logo"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform group-hover:scale-105 bg-white rounded-xl p-2 shadow-md"
            />
          </Link>
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 text-white/40">📍</span>
              <div>
                <p className="text-sm text-white/70 font-bold">531, 2nd Main Road, Indiranagar 2nd Stage, Bangalore</p>
                <p className="text-xs text-white/40 mt-1">Landmark: Near BDA Complex, Bangalore</p>
                <p>
                  <a
                    data-qa-id="get_directions"
                    className="u-t-link u-d-inlineblock u-spacer--top-thin underline u-bold"
                    href={GOOGLE_MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Get Directions</span>
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 text-white/40">📞</span>
              <p className="text-sm text-white/70">+91 90371 51894</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 text-white/40">📧</span>
              <p className="text-sm text-white/70">{CLINIC_EMAIL}</p>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            {[
              {
                label: 'Facebook',
                href: 'https://www.facebook.com/profile.php?id=61589612497809',
                path: 'M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/v-dental-implant-centre/',
                path: 'M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z',
              },
            ].map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                aria-label={soc.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[color:var(--teal)] hover:text-white hover:border-transparent transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
                  <path d={soc.path} />
                </svg>
              </a>
            ))}
            <a
              href="https://wa.me/919037151894"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 6.69C8.37 6.69 8.1 6.75 7.87 7C7.65 7.25 7 7.85 7 9.06C7 10.27 7.89 11.45 8 11.61C8.14 11.77 9.76 14.3 12.31 15.32C14.42 16.16 14.85 16 15.31 15.95C15.77 15.91 16.78 15.35 17 14.76C17.21 14.18 17.21 13.68 17.14 13.57C17.07 13.47 16.91 13.41 16.67 13.3C16.43 13.17 15.27 12.6 15.05 12.5C14.83 12.43 14.67 12.39 14.5 12.64C14.34 12.89 13.88 13.41 13.74 13.57C13.6 13.74 13.46 13.76 13.22 13.65C12.98 13.53 12.21 13.28 11.3 12.47C10.59 11.84 10.11 11.06 9.97 10.81C9.83 10.57 9.95 10.43 10.07 10.31C10.18 10.2 10.32 10.02 10.44 9.88C10.56 9.74 10.6 9.64 10.68 9.47C10.76 9.31 10.72 9.17 10.66 9.06C10.6 8.95 10.13 7.78 9.93 7.3C9.74 6.85 9.54 6.84 9.38 6.83H8.85C8.85 6.83 8.69 6.69 8.53 6.69Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Links Sections */}
        {footerSections.map((section) => (
          <div key={section.title}>
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-6">
              {section.title}
            </h5>
            <ul className="space-y-4">
              {section.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('/') ? (
                    <Link
                      to={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-[15px] text-white/60 hover:text-[color:var(--teal)] transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-[15px] text-white/60 hover:text-[color:var(--teal)] transition-colors no-underline"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-white/30 text-center sm:text-left">
          <span>{t('footer.allRights')}</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.accessibility')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

