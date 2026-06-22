import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { recordVisit } from './utils/visitorTracker';
import Preloader from './components/Preloader';
import Home from './pages/Home';

// Non-critical UI — lazy-loaded after main content
const Footer          = lazy(() => import('./components/Footer'));
const FloatingWhatsApp = lazy(() => import('./components/FloatingWhatsApp'));
const LeadPopup       = lazy(() => import('./components/LeadPopup'));
const Chatbot         = lazy(() => import('./components/Chatbot'));
const MobileBottomBar = lazy(() => import('./components/MobileBottomBar'));
const ScrollProgressBar = lazy(() => import('./components/ScrollProgressBar'));
const CursorGlow      = lazy(() => import('./components/CursorGlow'));

// All other pages — code-split, loaded on demand
const BookingPage = lazy(() => import('./pages/BookingPage'));

// All other pages — code-split, loaded on demand
const SmileDesigning = lazy(() => import('./pages/SmileDesigning'));
const AlignersBraces = lazy(() => import('./pages/AlignersBraces'));
const DentalImplants = lazy(() => import('./pages/DentalImplants'));
const lazySeo = (name) => lazy(() => import('./pages/SeoServicePages').then(m => ({ default: m[name] })));
const InvisalignBangalore        = lazySeo('InvisalignBangalore');
const VeneersBangalore           = lazySeo('VeneersBangalore');
const SmileMakeoverBangalore     = lazySeo('SmileMakeoverBangalore');
const DentalImplantsBangalore    = lazySeo('DentalImplantsBangalore');
const FullMouthRehabBangalore    = lazySeo('FullMouthRehabBangalore');
const AllOn4ImplantsBangalore    = lazySeo('AllOn4ImplantsBangalore');
const DentalTourismIndia         = lazySeo('DentalTourismIndia');
const NriOnlineConsultation      = lazySeo('NriOnlineConsultation');
const TravelAssistance           = lazySeo('TravelAssistance');
const GeneralDentistry           = lazySeo('GeneralDentistry');
const LaserDentistry             = lazySeo('LaserDentistry');
const InvisalignKids             = lazySeo('InvisalignKids');
const FamilyDentistry            = lazySeo('FamilyDentistry');
const PediatricDentistry         = lazySeo('PediatricDentistry');
const RootCanalTreatmentBangalore = lazySeo('RootCanalTreatmentBangalore');
const CrownsAndBridgeBangalore   = lazySeo('CrownsAndBridgeBangalore');
const AssessmentPage  = lazy(() => import('./pages/Assessment'));
const ResultsPage     = lazy(() => import('./pages/Results'));
const FAQPage         = lazy(() => import('./pages/FAQ'));
const Reviews         = lazy(() => import('./pages/Reviews'));
const Blog            = lazy(() => import('./pages/Blog'));
const BlogPost        = lazy(() => import('./pages/BlogPost'));
const SmilePlusMarathahalli = lazy(() => import('./pages/SmilePlusMarathahalli'));
const PrivacyPolicy   = lazy(() => import('./pages/PrivacyPolicy'));
const Terms           = lazy(() => import('./pages/Terms'));
const Admin           = lazy(() => import('./pages/Admin'));
const ImageUpload     = lazy(() => import('./components/ImageUpload'));
const ButtonShowcase  = lazy(() => import('./components/Buttons'));
const Login           = lazy(() => import('./pages/Placeholders').then(m => ({ default: m.Login })));
const Register        = lazy(() => import('./pages/Placeholders').then(m => ({ default: m.Register })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/vd-admin');

  useEffect(() => {
    if (isAdmin) return;
    recordVisit();
  }, [isAdmin]);

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_path: location.pathname + location.search });
    }
  }, [location.pathname, location.search]);

  // Global GSAP scroll reveal — loaded lazily after first paint
  useEffect(() => {
    let cleanup = null;
    const timer = setTimeout(async () => {
      const { gsap, ScrollTrigger } = await import('./utils/gsap');
      const isMobile = window.innerWidth < 640;
      const elements = gsap.utils.toArray('[data-reveal]');
      elements.forEach((el) => {
        const rawDelay = el.dataset.delay ? parseFloat(el.dataset.delay) * 0.12 : 0;
        gsap.from(el, {
          opacity: 0,
          y: isMobile ? 16 : 30,
          duration: isMobile ? 0.55 : 0.75,
          delay: rawDelay,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      });
      cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, 300);

    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [location.pathname]);

  return (
    <>
      {!isAdmin && <Preloader />}
      {!isAdmin && <Navbar />}
      <main
        key={location.pathname}
        style={isAdmin ? undefined : { animation: 'pageFadeIn 0.35s ease forwards' }}
      >
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/smile-designing" element={<SmileDesigning />} />
            <Route path="/invisalign-bangalore" element={<InvisalignBangalore />} />
            <Route path="/veneers-bangalore" element={<VeneersBangalore />} />
            <Route path="/smile-makeover-bangalore" element={<SmileMakeoverBangalore />} />
            <Route path="/dental-implants-bangalore" element={<DentalImplantsBangalore />} />
            <Route path="/full-mouth-rehabilitation-bangalore" element={<FullMouthRehabBangalore />} />
            <Route path="/all-on-4-implants-bangalore" element={<AllOn4ImplantsBangalore />} />
            <Route path="/dental-tourism-india" element={<DentalTourismIndia />} />
            <Route path="/online-consultation-nri-patients" element={<NriOnlineConsultation />} />
            <Route path="/travel-assistance-international-patients" element={<TravelAssistance />} />
            <Route path="/general-dentistry-bangalore" element={<GeneralDentistry />} />
            <Route path="/laser-dentistry-bangalore" element={<LaserDentistry />} />
            <Route path="/invisalign-for-kids-bangalore" element={<InvisalignKids />} />
            <Route path="/family-dentistry-bangalore" element={<FamilyDentistry />} />
            <Route path="/pediatric-dentistry-bangalore" element={<PediatricDentistry />} />
            <Route path="/root-canal-treatment-bangalore" element={<RootCanalTreatmentBangalore />} />
            <Route path="/crowns-and-bridge-bangalore" element={<CrownsAndBridgeBangalore />} />
            <Route path="/aligners-braces" element={<AlignersBraces />} />
            <Route path="/dental-implants" element={<DentalImplants />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/smile-plus-dental-care-marathahalli" element={<SmilePlusMarathahalli />} />
            <Route path="/ai-preview" element={<ImageUpload />} />
            <Route path="/vd-admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/design" element={<ButtonShowcase />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && (
        <Suspense fallback={null}>
          <ScrollProgressBar />
          <CursorGlow />
          <LeadPopup />
          <FloatingWhatsApp />
          <Chatbot />
          <Footer />
          <div className="h-16 md:hidden" aria-hidden="true" />
          <MobileBottomBar />
        </Suspense>
      )}
    </>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AppLayout />
    </Router>
  );
}

export default App;

