import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import PlatformReviewsCarousel from '../components/PlatformReviewsCarousel';
import SmilePlusHomePromo from '../components/SmilePlusHomePromo';
import CountUp from '../components/CountUp';
import { gsap } from '../utils/gsap';
import axios from 'axios';
import smileImg from '../images/smile design after.png';
import alignersImg from '../images/braces and aligners after.png';
import implantsImg from '../images/dental implant after.png';
import ourwork1 from '../images/ourwork1.png';
import ourwork2 from '../images/ourwork2.png';
import ourwork3 from '../images/ourwork3.png';
import ourwork4 from '../images/ourwork4.jpg';
import ourwork5 from '../images/ourwork5.png';
import ourwork6 from '../images/ourwork6.jpg';
import ourwork7 from '../images/ourwork7.jpg';
import legacyTeamPhoto from '../images/legacy-team.jpg';
import implantsMobile from '../images/implants-mobile.jpg';
import implantsDesktop from '../images/implants-desktop.jpg';
import fullmouthMobile from '../images/fullmouth-mobile.jpg';
import fullmouthDesktop from '../images/fullmouth-desktop.jpg';
import smileMobile from '../images/smile-mobile.jpg';
import smileDesktop from '../images/smile-desktop.jpg';
import veneersMobile from '../images/veneers-mobile.jpg';
import veneersDesktop from '../images/veneers-desktop.jpg';
import heroVideo from '../videos/hero-intro.mp4';
import heroVideoMobile from '../videos/hero-intro-mobile.mp4';
import heroPoster from '../images/hero-poster.jpg';
import { useLanguage } from '../contexts/LanguageContext';
import { GOOGLE_MAPS_DIRECTIONS_URL } from '../constants/contact';
import { ImplantIcon, FullMouthIcon, CosmeticIcon, VeneerIcon } from '../components/icons/TreatmentIcons';
import { GoogleIcon } from '../components/icons/PlatformIcons';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

const Home = () => {
  const { t } = useLanguage();
  const [ourWorkGallery, setOurWorkGallery] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTreatment, setActiveTreatment] = useState(0);
  const treatmentCarouselRef = useRef(null);
  const treatmentCardRefs = useRef([]);
  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ name: '', phone: '' });
  const [popupSubmitted, setPopupSubmitted] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);

  const location = useLocation();
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-title',    { opacity: 0, y: 36, duration: 0.8 }, 0.2)
        .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6 }, 0.75)
        .from('.hero-cta',      { opacity: 0, y: 20, duration: 0.6 }, 0.95)
        .from('.hero-stats > *',{ opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, 1.1);

      // Parallax — hero bg image drifts at half scroll speed
      gsap.to('.hero-bg-img', {
        y: '25%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const fetchOurWorkGallery = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/gallery`);
      if (res.data?.success) {
        const filtered = res.data.gallery.filter(item => item.category === 'our-work');
        setOurWorkGallery(filtered);
      }
    } catch (err) {
      console.error('Error fetching our work gallery:', err);
    }
  };

  useEffect(() => {
    fetchOurWorkGallery();

    // Show popup after 5 seconds if not already shown this session
    const hasShownPopup = sessionStorage.getItem('hasShownLeadPopup');
    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem('hasShownLeadPopup', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    if (!popupData.name || !popupData.phone) return;
    setPopupLoading(true);
    try {
      await axios.post(`${API_BASE}/api/leads`, {
        name: popupData.name,
        phone: popupData.phone,
        source: 'Visitor Popup'
      });
      setPopupSubmitted(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error('Failed to submit visitor lead', err);
    } finally {
      setPopupLoading(false);
    }
  };

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);


  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://api.web3forms.com/submit', {
        access_key: '8f11e73a-2e5f-4578-bb73-52c99d93155f',
        subject: `Contact Inquiry: ${contactData.firstName} ${contactData.lastName}`,
        from_name: 'V Dental and Implant Center Website',
        confirm_email: 'true',
        replyto: 'cursorhalesh@gmail.com',
        name: `${contactData.firstName} ${contactData.lastName}`, 
        email: contactData.email,
        message: contactData.message,
        ...contactData
      }, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Also save to our own leads database
      try {
        await axios.post(`${API_BASE}/api/leads`, {
          name: `${contactData.firstName} ${contactData.lastName}`.trim(),
          phone: contactData.phone || 'Not Provided',
          email: contactData.email,
          message: contactData.message,
          source: 'Contact Form'
        });
      } catch (err) {
        console.error('Failed to save lead to local database', err);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Contact error:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const defaultOurWork = [
    { image: ourwork1, title: 'Perfect Transformation 1' },
    { image: ourwork2, title: 'Perfect Transformation 2' },
    { image: ourwork3, title: 'Perfect Transformation 3' },
    { image: ourwork4, title: 'Perfect Transformation 4' },
    { image: ourwork5, title: 'Perfect Transformation 5' },
    { image: ourwork6, title: 'Perfect Transformation 6' },
    { image: ourwork7, title: 'Perfect Transformation 7' },
  ];

  const allOurWork = [
    ...defaultOurWork,
    ...ourWorkGallery.map(item => ({
      image: item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`,
      title: item.title
    }))
  ];

  // Double the items for seamless marquee
  const marqueeItems = [...allOurWork, ...allOurWork];

  return (
    <div className="font-afacad">
      <SEO 
        title="World-Class Dentistry in Bengaluru"
        description="V Dental and Implant Center offers advanced digital smile designing, clear aligners, and dental implants with international standards. Book your free consultation today."
        keywords="best dentist Bengaluru, digital smile design, clear aligners India, dental implants Bengaluru, V Dental and Implant Center"
      />
      {/* Hero Section */}
      <header ref={heroRef} className="relative w-full overflow-hidden bg-[color:var(--charcoal-deep)] min-h-[640px] sm:min-h-[720px] md:min-h-[820px] flex items-center px-5 pb-16 pt-28 sm:px-8 sm:pb-20 md:px-12 md:pb-24 md:pt-36 lg:px-20 lg:pt-40">
        {/* Background video */}
        <video
          className="hero-bg-img absolute inset-0 w-full h-full object-cover"
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={heroVideoMobile} media="(max-width: 767px)" type="video/mp4" />
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--charcoal-deep)] via-[color:var(--charcoal-deep)]/75 to-[color:var(--charcoal-deep)]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--charcoal-deep)] via-transparent to-[color:var(--charcoal-deep)]/40" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl text-[color:var(--cream)]">
            <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl font-momo-trust font-extrabold leading-[1.05] mb-6 text-[color:var(--cream)]">
              {t('home.wherePerfect')}
            </h1>
            <p className="hero-subtitle text-base sm:text-lg text-[rgb(var(--cream-rgb)/65%)] mb-10 max-w-xl leading-relaxed">
              <span className="text-[color:var(--cream)]">{t('home.heroSubtitlePart1a')}</span>
              <span className="text-[color:var(--gold)] font-medium">{t('home.heroSubtitlePart1b')}</span>
              {t('home.heroSubtitlePart2')}
              <br />
              <span className="font-bold text-[color:var(--cream)] whitespace-nowrap text-sm sm:text-lg">{t('home.heroSubtitlePart3')}</span>
              <br />
              {t('home.heroSubtitlePart4')}
            </p>

            <div className="hero-cta flex flex-col gap-6 sm:gap-8 mt-10">
              <Link
                to="/booking"
                className="btn-glow self-start inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[color:var(--gold)] text-[color:var(--charcoal-deep)] px-8 py-3.5 rounded-sharp font-bold text-base hover:bg-[color:var(--gold-light)] transition-colors shadow-xl shadow-black/30"
              >
                {t('home.bookConsultation')}
              </Link>
              <div className="flex items-stretch divide-x divide-[rgb(var(--cream-rgb)/15%)]">
                <div className="flex items-center gap-2 sm:gap-4 pr-3 sm:pr-6">
                  <div className="hidden sm:flex -space-x-3">
                    {[
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&q=80',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&q=80',
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-11 h-11 rounded-full object-cover border-2 border-[color:var(--charcoal-deep)]"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="font-sans text-base sm:text-xl font-extrabold leading-none">
                      <CountUp end={25} suffix="K+" decimals={0} duration={2.2} />
                    </div>
                    <div className="text-[11px] sm:text-sm text-[rgb(var(--cream-rgb)/60%)] mt-1 whitespace-nowrap">
                      {t('home.happyPatients')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6">
                  <GoogleIcon className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-sans text-base sm:text-xl font-extrabold leading-none">4.8</span>
                      <div className="flex gap-0.5 text-[color:var(--gold)]">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5">
                            <path d="M10 1.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L10 14.7l-5.2 2.8 1-5.8L1.5 7.6l5.9-.8L10 1.5Z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="text-[11px] sm:text-sm text-[rgb(var(--cream-rgb)/60%)] mt-1 whitespace-nowrap">
                      {t('home.rating')}
                    </div>
                  </div>
                </div>

                <div className="pl-3 sm:pl-6">
                  <div className="font-sans text-base sm:text-xl font-extrabold leading-none">1994</div>
                  <div className="text-[11px] sm:text-sm text-[rgb(var(--cream-rgb)/60%)] mt-1 whitespace-nowrap">
                    {t('home.sinceLabel')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating stat badge */}
        <div className="hero-stats hidden sm:block absolute bottom-10 right-8 md:right-12 z-10 bg-[color:var(--gold)] text-[color:var(--charcoal-deep)] rounded-sharp px-9 py-7 shadow-2xl">
          <div className="font-sans text-5xl font-extrabold leading-none">43+</div>
          <div className="text-sm uppercase tracking-[0.15em] mt-2 font-semibold max-w-[8rem]">
            {t('home.excellenceYrs')}
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <section data-reveal className="bg-[color:var(--ink)] px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-x-6 sm:gap-x-0 text-xs sm:text-sm text-[rgb(var(--cream-rgb)/55%)]">
          {[
            { t: t('home.trust.jci'), d: t('home.trust.jciD') },
            { t: t('home.trust.iso'), d: t('home.trust.isoD') },
            { t: t('home.trust.docs'), d: t('home.trust.docsD') },
            { t: t('home.trust.patients'), d: t('home.trust.patientsD') },
            { t: t('home.trust.emergency'), d: t('home.trust.emergencyD') }
          ].map((x) => (
            <div key={x.t} className="flex items-center gap-2.5 flex-shrink-0 whitespace-nowrap sm:px-8 sm:border-r sm:border-white/[0.08] last:border-r-0">
              <span className="inline-flex w-[3px] h-[3px] rounded-full bg-[color:var(--gold)] flex-shrink-0" />
              <span>
                <span className="font-bold text-[color:var(--cream)]">{x.t}</span> {x.d}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Legacy */}
      <section id="legacy" data-reveal className="py-16 sm:py-20 md:py-28 px-5 sm:px-6 md:px-12 lg:px-20 bg-[color:var(--charcoal-deep)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <div>
            <div className="rounded-sharp overflow-hidden aspect-[4/3] border border-[rgb(var(--gold-rgb)/25%)]">
              <img
                src={legacyTeamPhoto}
                alt="The doctors of V Dental and Implant Center"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Stat strip — sits below the photo, never overlapping it */}
            <div className="mt-5 inline-flex items-center gap-4 bg-[rgb(var(--cream-rgb)/6%)] border border-[rgb(var(--gold-rgb)/25%)] rounded-sharp px-6 py-4">
              <div className="font-display text-3xl sm:text-4xl font-light text-[color:var(--gold)] leading-none">43+</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--cream-rgb)/60%)] leading-tight max-w-[8rem]">
                {t('home.legacyBadgeLabel')}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="eyebrow-gold mb-5">{t('home.legacyEyebrow')}</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-light tracking-tight leading-[1.08] text-[color:var(--cream)]">
              {t('home.legacyHeadingBefore')}
              <span className="italic text-[color:var(--gold)]">{t('home.legacyHeadingAccent')}</span>
              {t('home.legacyHeadingAfter')}
            </h2>
            <p className="mt-6 text-[rgb(var(--cream-rgb)/70%)] leading-relaxed font-light">
              {t('home.legacyP')}
            </p>

            <div className="mt-10 hairline-grid grid-cols-1 sm:grid-cols-2 bg-[rgb(var(--cream-rgb)/8%)] border border-[rgb(var(--cream-rgb)/8%)] rounded-sharp overflow-hidden">
              {[
                t('home.legacySpec1'),
                t('home.legacySpec2'),
                t('home.legacySpec3'),
                t('home.legacySpec4'),
                t('home.legacySpec5'),
                t('home.legacySpec6'),
              ].map((label) => (
                <div key={label} className="bg-[color:var(--charcoal-deep)] p-4 sm:p-[18px] flex items-center gap-3">
                  <span className="flex-shrink-0 w-[5px] h-[5px] rounded-full bg-[color:var(--gold)]" />
                  <span className="text-[color:var(--cream)] font-medium text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SmilePlusHomePromo />

      {/* Signature Treatments */}
      <section className="py-14 sm:py-20 md:py-28 lg:py-32 px-5 sm:px-6 bg-[color:var(--charcoal)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20 relative z-10">
          <div className="eyebrow-gold eyebrow-gold--center mb-5 sm:mb-6">
            {t('home.signatureTreatments')}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight text-[color:var(--cream)] mb-4 sm:mb-6 leading-[1.08]">
            {t('home.treatmentsHeadingBefore')}
            <span className="italic text-[color:var(--gold)]">{t('home.treatmentsHeadingAccent')}</span>
            {t('home.treatmentsHeadingAfter')}
          </h2>
          <p className="text-[rgb(var(--cream-rgb)/70%)] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-light">
            {t('home.heroSubtitle')}
          </p>
        </div>

        {/* Mobile carousel */}
        {(() => {
          const treatments = [
            { title: t('home.treatment1Title'), path: "/dental-implants-bangalore", Icon: ImplantIcon, desc: t('home.treatment1Desc'), mobileImg: implantsMobile, desktopImg: implantsDesktop },
            { title: t('home.treatment2Title'), path: "/full-mouth-rehabilitation-bangalore", Icon: FullMouthIcon, desc: t('home.treatment2Desc'), mobileImg: fullmouthMobile, desktopImg: fullmouthDesktop },
            { title: t('home.treatment3Title'), path: "/smile-makeover-bangalore", Icon: CosmeticIcon, desc: t('home.treatment3Desc'), mobileImg: smileMobile, desktopImg: smileDesktop },
            { title: t('home.treatment4Title'), path: "/veneers-bangalore", Icon: VeneerIcon, desc: t('home.treatment4Desc'), mobileImg: veneersMobile, desktopImg: veneersDesktop },
          ];
          const TreatmentCard = ({ service, i }) => (
            <Link
              to={service.path}
              className="group relative p-8 sm:p-10 bg-[color:var(--charcoal)] hover:bg-[rgb(var(--gold-rgb)/4%)] transition-colors duration-500 no-underline flex flex-col overflow-hidden"
            >
              {/* Desktop AI image background */}
              {service.desktopImg && (
                <>
                  <img src={service.desktopImg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-65 transition-opacity duration-500 pointer-events-none select-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--charcoal)] via-[color:var(--charcoal)]/60 to-[color:var(--charcoal)]/20 pointer-events-none" />
                </>
              )}
              <h3 className="text-xl sm:text-2xl font-display font-light text-[color:var(--cream)] mb-3 relative z-10 pr-10">{service.title}</h3>
              <p className="text-[rgb(var(--cream-rgb)/70%)] mb-8 leading-relaxed text-sm sm:text-base relative z-10 font-light pr-4">{service.desc}</p>
              <div className="mt-auto pt-2 relative z-10">
                <span className="text-[color:var(--gold)] font-bold flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                  {t('home.discoverMore')}
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
              </div>
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[color:var(--gold)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </Link>
          );
          return (
            <>
              {/* Mobile: Instagram Stories style */}
              <div className="sm:hidden -mx-5">
                {/* Story progress bars */}
                <div className="flex gap-1.5 px-5 mb-3">
                  {treatments.map((_, i) => (
                    <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/[0.15]">
                      <div
                        className="h-full bg-[color:var(--gold)] rounded-full"
                        style={{ width: i <= activeTreatment ? '100%' : '0%', transition: 'width 0.3s ease' }}
                      />
                    </div>
                  ))}
                </div>

                {/* Swipeable story cards */}
                <div
                  ref={treatmentCarouselRef}
                  className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    let closestIdx = 0;
                    let closestDist = Infinity;
                    treatmentCardRefs.current.forEach((card, idx) => {
                      if (!card) return;
                      const dist = Math.abs(card.offsetLeft - el.scrollLeft);
                      if (dist < closestDist) { closestDist = dist; closestIdx = idx; }
                    });
                    setActiveTreatment(closestIdx);
                  }}
                >
                  {treatments.map((service, i) => (
                    <div
                      key={i}
                      ref={(el) => (treatmentCardRefs.current[i] = el)}
                      className="flex-shrink-0 w-full snap-start relative flex flex-col overflow-hidden"
                      style={{ minHeight: '72vh', background: '#0d0d0d' }}
                    >
                      {/* Mobile AI image background */}
                      {service.mobileImg && (
                        <img
                          src={service.mobileImg}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                          style={{ opacity: 0.75 }}
                        />
                      )}
                      {/* Dark overlay for readability */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: service.mobileImg ? 'linear-gradient(to top, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.05) 100%)' : 'linear-gradient(150deg, #0f1e12 0%, #1a2e1e 55%, #0d0d0d 100%)' }}
                      />
                      {/* Spacer to push content to bottom */}
                      <div className="flex-1" />

                      {/* Bottom content */}
                      <div className="relative z-10 px-6 pb-10 pt-12 mt-auto">
                        <h3 className="text-2xl font-display font-light text-white mb-2 leading-tight">{service.title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-5">{service.desc}</p>
                        <Link
                          to={service.path}
                          className="relative z-30 inline-flex items-center gap-2 text-[color:var(--gold)] font-bold text-xs uppercase tracking-[0.2em]"
                        >
                          {t('home.discoverMore')} <span>→</span>
                        </Link>
                      </div>

                      {/* Left tap zone — previous */}
                      <button
                        type="button"
                        aria-label="Previous treatment"
                        className="absolute left-0 top-0 w-1/3 z-20"
                        style={{ bottom: '5.5rem' }}
                        onClick={() => {
                          const prev = Math.max(0, i - 1);
                          setActiveTreatment(prev);
                          const container = treatmentCarouselRef.current;
                          const card = treatmentCardRefs.current[prev];
                          if (container && card) container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
                        }}
                      />
                      {/* Right tap zone — next */}
                      <button
                        type="button"
                        aria-label="Next treatment"
                        className="absolute right-0 top-0 w-1/3 z-20"
                        style={{ bottom: '5.5rem' }}
                        onClick={() => {
                          const next = Math.min(treatments.length - 1, i + 1);
                          setActiveTreatment(next);
                          const container = treatmentCarouselRef.current;
                          const card = treatmentCardRefs.current[next];
                          if (container && card) container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: original grid */}
              <div className="hidden sm:block relative z-10">
                <div className="hairline-grid grid-cols-2 lg:grid-cols-4 bg-[rgb(var(--gold-rgb)/12%)] border border-[rgb(var(--gold-rgb)/12%)] max-w-7xl mx-auto rounded-sharp overflow-hidden">
                  {treatments.map((service, i) => (
                    <TreatmentCard key={i} service={service} i={i} />
                  ))}
                </div>
              </div>
            </>
          );
        })()}
      </section>

      {/* Home FAQ Section */}
      <section data-reveal className="py-14 sm:py-20 md:py-24 px-5 sm:px-6 bg-[color:var(--charcoal-deep)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="eyebrow-gold eyebrow-gold--center mb-4">{t('home.faq.eyebrow')}</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-light tracking-tight text-[color:var(--cream)] leading-tight">
              {t('home.faq.heading')}
            </h2>
          </div>
          <div className="divide-y divide-white/[0.07]">
            {[
              { q: t('home.faq.q1'), a: t('home.faq.a1') },
              { q: t('home.faq.q2'), a: t('home.faq.a2') },
              { q: t('home.faq.q3'), a: t('home.faq.a3') },
              { q: t('home.faq.q4'), a: t('home.faq.a4') },
            ].map((item, i) => (
              <div key={i}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left group">
                  <div className="flex items-start gap-4">
                    <span className="text-[color:var(--gold)] font-bold text-sm mt-0.5 flex-shrink-0 w-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base sm:text-lg font-semibold text-[color:var(--cream)] group-hover:text-[color:var(--gold)] transition-colors leading-snug">
                      {item.q}
                    </span>
                  </div>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center transition-all duration-300 ${openFaq === i ? 'bg-[color:var(--gold)] border-[color:var(--gold)] rotate-45' : 'bg-white/5 group-hover:border-[color:var(--gold)]/50'}`}>
                    <svg className="w-3.5 h-3.5 text-[color:var(--cream)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="pb-6 pl-9">
                    <p className="text-[rgb(var(--cream-rgb)/65%)] text-sm sm:text-base leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--gold)] hover:text-[color:var(--cream)] transition-colors">
              {t('home.faq.viewAll')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Work Section */}
      <section id="our-work" data-reveal className="py-14 sm:py-20 md:py-28 lg:py-32 px-5 sm:px-6 bg-[color:var(--cream)] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="eyebrow-gold eyebrow-gold--center mb-5 sm:mb-6">
              {t('nav.ourWork')}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight leading-[1.08] text-[color:var(--charcoal)] mb-4 sm:mb-6">
              {t('home.witnessThe')}<span className="italic text-[color:var(--green)]">{t('home.magic')}</span>{t('home.ofOurWorks')}
            </h2>
            <p className="text-[color:var(--warm-gray)] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-light">
              {t('home.realResults')}
            </p>
          </div>

          <div className="relative group overflow-hidden">
            {/* Marquee Container */}
            <div className="marquee-container">
              {marqueeItems.map((item, index) => (
                <div
                  key={index}
                  className="w-[300px] md:w-[450px] px-4 flex-shrink-0"
                >
                  <div className="relative h-[250px] md:h-[350px] w-full rounded-sharp overflow-hidden shadow-sm border border-black/5 bg-white group/card">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover/card:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-[rgb(var(--cream-rgb)/95%)] backdrop-blur-md p-4 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 border-t border-black/5">
                      <h4 className="text-sm font-bold text-[color:var(--charcoal)] truncate">{item.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-reveal className="py-14 sm:py-20 md:py-28 px-5 sm:px-6 bg-[color:var(--cream-dark)] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="eyebrow-gold eyebrow-gold--center mb-5 sm:mb-6">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight leading-[1.08] text-[color:var(--charcoal)] mb-4 sm:mb-6">
              Our Happy <span className="italic text-[color:var(--green)]">Patients</span>
            </h2>
            <p className="text-[color:var(--warm-gray)] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-light">
              Real stories from patients who trusted us with their smiles.
            </p>
          </div>

          <PlatformReviewsCarousel />

        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" data-reveal className="py-12 sm:py-16 md:py-24 px-5 sm:px-6 bg-[color:var(--cream-dark)] text-[color:var(--charcoal)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14">
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-light tracking-tight leading-[1.1]">
              {t('home.contact.subtitle')}
            </h2>
            <p className="mt-6 text-[color:var(--warm-gray)] leading-relaxed max-w-xl font-light">
              {t('home.contact.desc')}
            </p>
            <div className="mt-8 sm:mt-10 flex-1 flex flex-col justify-center bg-white rounded-sharp border border-black/5 shadow-sm divide-y divide-black/5">
              {/* NAP: Address first */}
              <div className="flex gap-4 items-start p-6 sm:p-8">
                <div className="w-11 h-11 rounded-full bg-[color:var(--green-light)] border border-[rgb(var(--green-rgb)/20%)] flex items-center justify-center text-base flex-shrink-0">📍</div>
                <div>
                  <div className="font-bold text-[color:var(--charcoal)]">{t('home.contact.locName')}</div>
                  <div className="text-sm text-[color:var(--warm-gray)]">{t('home.contact.location')}</div>
                  <a
                    href={GOOGLE_MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-bold text-[color:var(--green)] underline hover:text-[color:var(--charcoal)]"
                  >
                    {t('home.contact.getDirections')}
                  </a>
                </div>
              </div>
              {/* NAP: Phone second */}
              <div className="flex gap-4 items-start p-6 sm:p-8">
                <div className="w-11 h-11 rounded-full bg-[color:var(--green-light)] border border-[rgb(var(--green-rgb)/20%)] flex items-center justify-center text-base flex-shrink-0">📞</div>
                <div>
                  <a href="tel:+919037151894" className="font-bold text-[color:var(--charcoal)] hover:text-[color:var(--green)] no-underline">+91 90371 51894</a>
                  <div className="text-sm text-[color:var(--warm-gray)]">{t('home.contact.phone')}</div>
                </div>
              </div>
              {/* Email last */}
              <div className="flex gap-4 items-start p-6 sm:p-8">
                <div className="w-11 h-11 rounded-full bg-[color:var(--green-light)] border border-[rgb(var(--green-rgb)/20%)] flex items-center justify-center text-base flex-shrink-0">📧</div>
                <div>
                  <a
                    href={`mailto:${t('home.contact.emailAddress')}`}
                    className="font-bold text-[color:var(--charcoal)] hover:text-[color:var(--green)] no-underline"
                  >
                    {t('home.contact.emailAddress')}
                  </a>
                  <div className="text-sm text-[color:var(--warm-gray)]">{t('home.contact.email')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--charcoal)] rounded-sharp p-5 sm:p-8 md:p-10 text-[color:var(--cream)] shadow-2xl shadow-black/30">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-display font-light text-[color:var(--cream)] mb-4">{t('home.contact.sentTitle')}</h3>
                <p className="text-[rgb(var(--cream-rgb)/70%)] mb-8 font-light">{t('home.contact.sentSub')}</p>
                <div className="flex flex-col gap-4">
                  <a
                    href={`https://wa.me/919037151894?text=${encodeURIComponent(
                      `Hello! I just submitted a contact form on your website. \nName: ${contactData.firstName} ${contactData.lastName} \nEmail: ${contactData.email} \nMessage: ${contactData.message}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[color:var(--teal)] text-white px-8 py-3 rounded-sharp font-bold hover:bg-[color:var(--dk)] transition flex items-center justify-center gap-2"
                  >
                    <span>{t('home.contact.btnWhatsapp')}</span>
                    <span className="text-xl">💬</span>
                  </a>
                  <button onClick={() => setSubmitted(false)} className="text-[color:var(--gold)] font-bold">
                    {t('home.contact.btnAnother')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-display text-3xl font-light text-[color:var(--cream)]">{t('home.contact.formTitle')}</h3>
                <p className="text-[rgb(var(--cream-rgb)/70%)] mt-2 font-light">{t('home.contact.formSub')}</p>

                <form onSubmit={handleContactSubmit} className="mt-8 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[rgb(var(--cream-rgb)/50%)] mb-2">{t('home.contact.firstName')}</label>
                    <input
                      name="firstName"
                      value={contactData.firstName}
                      onChange={handleContactChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-sharp px-4 py-3 text-[color:var(--cream)] placeholder-white/25 focus:outline-none focus:border-[color:var(--gold)]"
                      placeholder="Sarah"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[rgb(var(--cream-rgb)/50%)] mb-2">{t('home.contact.lastName')}</label>
                    <input
                      name="lastName"
                      value={contactData.lastName}
                      onChange={handleContactChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-sharp px-4 py-3 text-[color:var(--cream)] placeholder-white/25 focus:outline-none focus:border-[color:var(--gold)]"
                      placeholder="Johnson"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wide text-[rgb(var(--cream-rgb)/50%)] mb-2">{t('home.contact.emailLabel')}</label>
                    <input
                      name="email"
                      type="email"
                      value={contactData.email}
                      onChange={handleContactChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-sharp px-4 py-3 text-[color:var(--cream)] placeholder-white/25 focus:outline-none focus:border-[color:var(--gold)]"
                      placeholder="sarah@example.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wide text-[rgb(var(--cream-rgb)/50%)] mb-2">{t('home.contact.messageLabel')}</label>
                    <textarea
                      name="message"
                      value={contactData.message}
                      onChange={handleContactChange}
                      className="w-full bg-white/5 border border-white/10 rounded-sharp px-4 py-3 h-28 resize-none text-[color:var(--cream)] placeholder-white/25 focus:outline-none focus:border-[color:var(--gold)]"
                      placeholder={t('home.contact.messagePlaceholder')}
                    />
                  </div>
                  <div className="sm:col-span-2 mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-glow w-full bg-[color:var(--gold)] text-[color:var(--charcoal-deep)] py-4 rounded-sharp font-bold text-sm uppercase tracking-[0.2em] hover:bg-[color:var(--gold-light)] disabled:opacity-50"
                    >
                      {loading ? t('home.contact.btnSending') : t('home.contact.btnSend') + ' →'}
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap gap-4">
                  <Link to="/booking" className="text-[color:var(--gold)] font-bold hover:underline">
                    {t('home.contact.btnBooking')} →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;

