import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../images/logo.png';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const closeServicesMenu = useCallback(() => setServicesOpen(false), []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    closeMobileMenu();
    closeServicesMenu();
  }, [location.pathname, location.hash, closeMobileMenu, closeServicesMenu]);

  useEffect(() => {
    if (!servicesOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeServicesMenu();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [servicesOpen, closeServicesMenu]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!servicesRef.current?.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    closeMobileMenu();
    navigate('/');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.aboutUs'), path: '/#about' },
    { name: t('nav.ourWork'), path: '/#our-work' },
    { name: t('nav.results'), path: '/results' },
    { name: t('nav.aiPreview'), path: '/ai-preview' },
    { name: t('nav.reviews'), path: '/reviews' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.assessment'), path: '/assessment' },
    { name: t('nav.faq'), path: '/faq' },
  ];

  const serviceLinks = [
    { name: t('nav.smileDesigning'), path: '/smile-designing' },
    { name: t('nav.invisalignBangalore'), path: '/invisalign-bangalore' },
    { name: t('nav.veneersBangalore'), path: '/veneers-bangalore' },
    { name: t('nav.smileMakeoverBangalore'), path: '/smile-makeover-bangalore' },
    { name: t('nav.alignersBraces'), path: '/aligners-braces' },
    { name: t('nav.dentalImplantsBangalore'), path: '/dental-implants-bangalore' },
    { name: t('nav.fullMouthRehab'), path: '/full-mouth-rehabilitation-bangalore' },
    { name: t('nav.allOn4Implants'), path: '/all-on-4-implants-bangalore' },
    { name: t('nav.dentalTourism'), path: '/dental-tourism-india' },
    { name: 'General Dentistry', path: '/general-dentistry-bangalore' },
    { name: 'Laser Dentistry', path: '/laser-dentistry-bangalore' },
    { name: 'Invisalign for Kids', path: '/invisalign-for-kids-bangalore' },
    { name: 'Family Dentistry', path: '/family-dentistry-bangalore' },
    { name: 'Pediatric Dentistry', path: '/pediatric-dentistry-bangalore' },
  ];

  const serviceGroups = [
    {
      label: 'Smile & Aesthetics',
      icon: '✨',
      accent: 'var(--teal)',
      links: [
        { name: 'Smile Designing', path: '/smile-designing' },
        { name: 'Invisalign', path: '/invisalign-bangalore' },
        { name: 'Veneers', path: '/veneers-bangalore' },
        { name: 'Smile Makeover', path: '/smile-makeover-bangalore' },
        { name: 'Aligners & Braces', path: '/aligners-braces' },
      ],
    },
    {
      label: 'Implants & Rehab',
      icon: '🦷',
      accent: 'var(--deep)',
      links: [
        { name: 'Dental Implants', path: '/dental-implants-bangalore' },
        { name: 'Full Mouth Rehab', path: '/full-mouth-rehabilitation-bangalore' },
        { name: 'All-on-4 / All-on-6 Implants', path: '/all-on-4-implants-bangalore' },
      ],
    },
    {
      label: 'General & Family',
      icon: '👨‍👩‍👧',
      accent: 'var(--gold)',
      links: [
        { name: 'General Dentistry', path: '/general-dentistry-bangalore' },
        { name: 'Family Dentistry', path: '/family-dentistry-bangalore' },
        { name: 'Pediatric Dentistry', path: '/pediatric-dentistry-bangalore' },
        { name: 'Laser Dentistry', path: '/laser-dentistry-bangalore' },
        { name: 'Invisalign for Kids', path: '/invisalign-for-kids-bangalore' },
      ],
    },
    {
      label: 'International',
      icon: '✈️',
      accent: '#7c6f5b',
      links: [
        { name: 'Dental Tourism India', path: '/dental-tourism-india' },
      ],
    },
  ];

  return (
    <nav
      className="site-nav fixed top-0 left-0 right-0 z-50 w-full max-w-[100svw] border-b border-black/5 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90"
      aria-label="Main navigation"
    >
      <div className="site-nav-bar mx-auto flex h-[var(--site-nav-height)] max-w-[96rem] items-center justify-between gap-2 overflow-visible px-3 sm:gap-3 sm:px-4 lg:gap-6 lg:px-4 xl:gap-4 xl:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center py-1 no-underline"
          aria-label={t('nav.logoAlt')}
          onClick={closeMobileMenu}
        >
          <img
            src={logo}
            alt={t('nav.logoAlt')}
            className="h-14 w-auto object-contain sm:h-16 lg:h-16 xl:h-[4.5rem]"
            width={160}
            height={48}
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden min-w-0 flex-1 items-center justify-center overflow-visible lg:flex">
          <div className="flex flex-nowrap items-center justify-center gap-x-1.5 overflow-visible px-1 text-[0.78rem] font-medium text-[color:var(--txt)]/70 lg:gap-x-2 xl:gap-x-4 xl:px-3 xl:text-sm">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="shrink-0 whitespace-nowrap rounded-md px-1 py-1 leading-snug transition-colors hover:text-[color:var(--teal)] xl:px-2"
            >
              {t('nav.home')}
            </Link>

            {/* Services — click to open, mouseleave to close */}
            <div
              ref={servicesRef}
              className="relative shrink-0"
              onMouseLeave={closeServicesMenu}
            >
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md border-0 bg-transparent px-1 py-1 text-[0.78rem] font-medium leading-snug text-[color:var(--txt)]/70 transition-colors hover:text-[color:var(--teal)] xl:px-2 xl:text-sm"
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((open) => !open)}
              >
                {t('nav.services')}
                <svg
                  className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega-menu panel — full width, fixed below navbar */}
              {servicesOpen && (
                <div
                  id="mega-menu-panel"
                  className="fixed left-0 right-0 z-[100] border-t border-black/5 bg-white shadow-2xl"
                  style={{ top: 'var(--site-nav-height)' }}
                >
                  <div className="mx-auto max-w-7xl px-6 py-0">
                    {/* Top label bar */}
                    <div className="flex items-center gap-3 border-b border-black/5 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--deep)]">Our Services</span>
                      <div className="h-px flex-1 bg-black/5" />
                      <span className="text-[10px] text-[color:var(--muted)]">
                        {serviceGroups.reduce((a, g) => a + g.links.length, 0)} treatments available
                      </span>
                    </div>

                    {/* 4 columns */}
                    <div className="grid grid-cols-4 gap-0 py-5">
                      {serviceGroups.map((group, gi) => (
                        <div
                          key={group.label}
                          className={`px-5 ${gi > 0 ? 'border-l border-black/5' : ''}`}
                        >
                          {/* Category header */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-base leading-none">{group.icon}</span>
                            <span
                              className="text-[10px] font-bold uppercase tracking-[0.18em]"
                              style={{ color: group.accent }}
                            >
                              {group.label}
                            </span>
                          </div>
                          {/* Links */}
                          <div className="space-y-0.5">
                            {group.links.map((link) => (
                              <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeServicesMenu}
                                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[color:var(--txt)]/70 transition-all hover:bg-[color:var(--soft)] hover:text-[color:var(--teal)] group/item"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--teal)]/25 group-hover/item:bg-[color:var(--teal)] transition-colors shrink-0" />
                                {link.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTA bar */}
                    <div className="border-t border-black/5 py-3 flex items-center justify-between">
                      <span className="text-xs text-[color:var(--muted)]">Not sure which treatment? Our specialists will guide you.</span>
                      <Link
                        to="/booking"
                        onClick={closeServicesMenu}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--teal)] px-4 py-2 text-xs font-bold text-white hover:bg-[color:var(--dk)] transition-colors"
                      >
                        Book Free Consultation &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`shrink-0 whitespace-nowrap rounded-md px-1 py-1 leading-snug transition-colors hover:text-[color:var(--teal)] xl:px-2 ${
                  link.path === '/ai-preview' || link.path === '/assessment'
                    ? 'hidden xl:inline'
                    : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5 lg:gap-3 xl:gap-4">
          <div className="hidden items-center gap-2.5 lg:flex xl:gap-3.5">
            {!user ? (
              <>
                <LanguageSwitcher compact />
                <Link
                  to="/booking"
                  className="whitespace-nowrap rounded-lg bg-[color:var(--teal)] px-3 py-1.5 text-center text-xs font-bold leading-tight text-white shadow-md shadow-black/10 transition-all hover:bg-[color:var(--dk)] active:scale-95 xl:px-4 xl:py-2 xl:text-sm"
                >
                  {t('nav.bookAppointment')}
                </Link>
              </>
            ) : (
              <>
                <LanguageSwitcher />
                <span className="max-w-[8rem] truncate text-sm font-medium text-[color:var(--dk)]">
                  {t('nav.welcome')}, {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-[color:var(--teal)] transition-colors hover:text-[color:var(--dk)]"
                >
                  {t('nav.logout')}
                </button>
              </>
            )}
          </div>

          {/* Tablet / mobile: language + compact CTA */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:hidden">
            <LanguageSwitcher compact />
            {!user && (
              <Link
                to="/booking"
                className="inline-flex max-w-[5.5rem] items-center justify-center rounded-lg bg-[color:var(--teal)] px-2 py-1.5 text-[10px] font-bold leading-tight text-white shadow-sm transition-all hover:bg-[color:var(--dk)] active:scale-95 sm:max-w-none sm:px-3 sm:py-2 sm:text-xs"
              >
                <span className="hidden sm:inline">{t('nav.bookAppointment')}</span>
                <span className="sm:hidden">{t('nav.bookNow')}</span>
              </Link>
            )}
          </div>

          {/* Hamburger — viewports below lg */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="site-nav-menu-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-[color:var(--soft)] text-[color:var(--dk)] transition-colors hover:border-[color:var(--teal)]/30 hover:bg-white lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu */}
      {isMobileMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label={t('nav.closeMenu')}
            onClick={closeMobileMenu}
          />
          <div
            id="mobile-nav-panel"
            className="site-nav-mobile-panel fixed left-0 right-0 z-50 overflow-y-auto overscroll-contain border-b border-black/5 bg-white shadow-2xl lg:hidden"
            style={{ top: 'var(--site-nav-height)' }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    closeMobileMenu();
                    if (link.path === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-xl px-3 py-3 text-base font-semibold text-[color:var(--txt)]/80 transition-colors hover:bg-[color:var(--soft)] hover:text-[color:var(--teal)]"
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-2 rounded-xl bg-[color:var(--soft)]/80 px-3 py-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted)]">
                  {t('nav.services')}
                </p>
                <div className="flex flex-col gap-0.5">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={closeMobileMenu}
                      className="rounded-lg px-2 py-2.5 text-sm font-medium text-[color:var(--txt)]/80 transition-colors hover:bg-white hover:text-[color:var(--teal)]"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-3 border-t border-black/5 pt-4">
                {user ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-[color:var(--dk)]">
                      {t('nav.welcome')}, {user.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="shrink-0 text-sm font-bold text-[color:var(--teal)]"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/booking"
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-[color:var(--teal)] px-6 py-3.5 text-center text-base font-bold text-white shadow-lg transition-colors hover:bg-[color:var(--dk)]"
                  >
                    {t('nav.bookAppointment')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
