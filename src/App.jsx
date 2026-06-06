import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { recordVisit } from './utils/visitorTracker';
import Preloader from './components/Preloader';
import LeadPopup from './components/LeadPopup';
import { gsap, ScrollTrigger } from './utils/gsap';

import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import SmileDesigning from './pages/SmileDesigning';
import AlignersBraces from './pages/AlignersBraces';
import DentalImplants from './pages/DentalImplants';
import {
  InvisalignBangalore,
  VeneersBangalore,
  SmileMakeoverBangalore,
  DentalImplantsBangalore,
  FullMouthRehabBangalore,
  AllOn4ImplantsBangalore,
  DentalTourismIndia,
  GeneralDentistry,
  LaserDentistry,
  InvisalignKids,
  FamilyDentistry,
  PediatricDentistry,
} from './pages/SeoServicePages';
import BookingPage from './pages/BookingPage';
import AssessmentPage from './pages/Assessment';
import ResultsPage from './pages/Results';
import FAQPage from './pages/FAQ';
import ImageUpload from './components/ImageUpload';
import { Login, Register } from './pages/Placeholders';
import Admin from './pages/Admin';
import Reviews from './pages/Reviews';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import SmilePlusMarathahalli from './pages/SmilePlusMarathahalli';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;
    recordVisit();
  }, [isAdmin]);

  // Global GSAP scroll reveal — premium easing, no wrapper divs needed
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = gsap.utils.toArray('[data-reveal]');
      elements.forEach((el) => {
        const rawDelay = el.dataset.delay ? parseFloat(el.dataset.delay) * 0.12 : 0;
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.75,
          delay: rawDelay,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      });
    }, 120);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [location.pathname]);

  return (
    <>
      {!isAdmin && <Preloader />}
      {!isAdmin && <LeadPopup />}
      {!isAdmin && <Navbar />}
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
        <Route path="/general-dentistry-bangalore" element={<GeneralDentistry />} />
        <Route path="/laser-dentistry-bangalore" element={<LaserDentistry />} />
        <Route path="/invisalign-for-kids-bangalore" element={<InvisalignKids />} />
        <Route path="/family-dentistry-bangalore" element={<FamilyDentistry />} />
        <Route path="/pediatric-dentistry-bangalore" element={<PediatricDentistry />} />
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
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!isAdmin && <FloatingWhatsApp />}
      {!isAdmin && <Chatbot />}
      {!isAdmin && <Footer />}
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

