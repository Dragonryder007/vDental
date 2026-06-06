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
      <div className="max-w-7xl mx-auto px-5 sm:px-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 pb-12 md:pb-16">
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
              { ico: 'f', label: 'Facebook' },
              { ico: 'in', label: 'LinkedIn' },
              { ico: '▶', label: 'YouTube' }
            ].map((soc) => (
              <a
                key={soc.label}
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm hover:bg-[color:var(--teal)] hover:border-transparent transition-all"
              >
                {soc.ico}
              </a>
            ))}
            <a
              href="https://wa.me/919037151894"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-sm text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
            >
              W
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

