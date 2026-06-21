import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

const INITIAL_REVIEWS = [
  {
    name: "Anonymous Patient",
    rating: 5,
    comment: "I visited Dr. Vathsala for multiple issues like Front teeth crown implant, laser gum surgery, tooth filling and tooth extraction. After visiting many doctors, I couldn't find confidence as I had to undergo crown implant for my front tooth. Now after going through the process, I am glad I chose her and would like to strongly recommend her for any dental procedures. She is well experienced, gentle and you will feel positive vibes in her presence.",
    createdAt: new Date().toISOString()
  },
  {
    name: "Anonymous Patient",
    rating: 5,
    comment: "Dr. Vathsala is an amazing doctor who will go the root of the problem and would suggest only the best treatment. She thinks in favour of the patient and devotes her time patiently explaining the procedure and the diagnosis. She is thorough in her subject and you can completely rely on her for correct guidance and support.",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    name: "Anonymous Patient",
    rating: 5,
    comment: "Dr Vatsala is very kind and soothing person. I visited her for my mom's jaw pain leading to right side facial pain. My mom had already undergone a root canal for 8 teeth on right side, she was well aware of painful treatment it can be. Dr Vatsala understood her state and trauma she has gone through. Dr Vatsala was very prompt in diagnosis... Thanks doctor for helping my mom, get rid of the pain while she enjoys her new set of caps.",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    name: "Anonymous Patient",
    rating: 5,
    comment: "My wife had tooth ache due to cavity during the lock down period. On calling Dr. Vathsala on a weekend, she immediately picked my call and we had a telephonic consultation. Next day Dr. Vathsala opened the clinic only for us. RCT was completed in single sitting and without any pain. Thank you doctor for going beyond your call of duty.",
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

export default function Reviews() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 5,
    comment: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/reviews`);
      const apiReviews = (res.data?.success && Array.isArray(res.data.reviews))
        ? res.data.reviews
        : [];

      const topPublished = apiReviews
        .filter((r) => Number(r.rating) >= 4)
        .sort((a, b) => {
          const r = (b.rating || 0) - (a.rating || 0);
          if (r !== 0) return r;
          const tA = new Date(a.createdAt || 0).getTime();
          const tB = new Date(b.createdAt || 0).getTime();
          return tB - tA;
        })
        .slice(0, 11);

      setReviews([...INITIAL_REVIEWS, ...topPublished]);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setReviews(INITIAL_REVIEWS);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: digitsOnly }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) {
      setFormStatus('error');
      return;
    }
    setFormStatus('submitting');
    try {
      await axios.post(`${API_BASE}/api/reviews`, formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', rating: 5, comment: '' });
      fetchReviews();
      setTimeout(() => {
        setIsFormOpen(false);
        setFormStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setFormStatus('error');
    }
  };

  const renderStars = (rating) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" style={{ color: i < rating ? '#C9A24A' : '#e5e7eb' }} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen font-sans" style={{ background: '#FAF6F0' }}>

      {/* Hero — dark cinematic */}
      <section className="relative py-28 md:py-36 px-5 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1e12 0%, #0a1509 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
            <p style={{ color: '#C9A24A', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Patient Stories</p>
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-5 leading-tight" style={{ color: '#FAF6F0' }}>
            Stories and Reviews <br className="hidden md:block" />
            <span className="italic" style={{ color: '#C9A24A' }}>from satisfied clients</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(250,246,240,0.72)' }}>
            Real experiences from our patients. Discover how we've helped transform smiles and improve oral health with our dedicated care.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-gold-shimmer btn-magnetic font-bold px-8 py-4 rounded-xl"
            style={{ color: '#0d0d0d' }}
          >
            {t('reviews.giveReview') || 'Write a Review'}
          </button>
        </div>
      </section>

      {/* Write a Review Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#1C2B1E' }}>Share Your Experience</h3>
            <p className="mb-6 text-sm" style={{ color: '#5A6A5C' }}>Your feedback helps us improve and helps others make informed decisions.</p>

            {formStatus === 'success' ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center font-bold">
                Thank you! Your review has been submitted successfully.
              </div>
            ) : (
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#5A6A5C' }}>Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setFormData(prev => ({ ...prev, rating: star }))} className="focus:outline-none">
                        <svg className="w-8 h-8 fill-current transition-colors" style={{ color: star <= formData.rating ? '#C9A24A' : '#e5e7eb' }} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#5A6A5C' }}>Name (Optional)</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-xl px-4 py-3 focus:outline-none" style={{ background: '#FAF6F0', border: '1px solid rgba(201,162,74,0.2)', color: '#1C2B1E' }} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#5A6A5C' }}>Phone *</label>
                    <input
                      name="phone" required type="tel" inputMode="numeric" pattern="\d{10}" maxLength={10} minLength={10}
                      title="Enter a 10-digit phone number" value={formData.phone} onChange={handleInputChange}
                      onKeyDown={(e) => {
                        const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
                        if (allowed.includes(e.key)) return;
                        if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;
                        if (!/^\d$/.test(e.key)) e.preventDefault();
                      }}
                      onPaste={(e) => {
                        const text = (e.clipboardData || window.clipboardData).getData('text');
                        if (!/^\d+$/.test(text)) e.preventDefault();
                      }}
                      className="w-full rounded-xl px-4 py-3 focus:outline-none" style={{ background: '#FAF6F0', border: '1px solid rgba(201,162,74,0.2)', color: '#1C2B1E' }}
                      placeholder="10-digit phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#5A6A5C' }}>Email *</label>
                  <input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-xl px-4 py-3 focus:outline-none" style={{ background: '#FAF6F0', border: '1px solid rgba(201,162,74,0.2)', color: '#1C2B1E' }} placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#5A6A5C' }}>Review *</label>
                  <textarea name="comment" required value={formData.comment} onChange={handleInputChange} rows="4" className="w-full rounded-xl px-4 py-3 focus:outline-none resize-none" style={{ background: '#FAF6F0', border: '1px solid rgba(201,162,74,0.2)', color: '#1C2B1E' }} placeholder="Tell us about your experience..." />
                </div>

                {formStatus === 'error' && (
                  <div className="text-red-500 text-sm font-bold">
                    {!/^\d{10}$/.test(formData.phone) ? 'Please enter a valid 10-digit phone number.' : 'Something went wrong. Please try again.'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="btn-gold-shimmer btn-magnetic w-full py-4 rounded-xl font-bold disabled:opacity-70 mt-4"
                  style={{ color: '#0d0d0d' }}
                >
                  {formStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reviews Grid — cream */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-3xl p-8 animate-pulse h-64" style={{ border: '1px solid rgba(201,162,74,0.1)' }} />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl" style={{ border: '1px solid rgba(201,162,74,0.15)' }}>
              <p className="text-xl font-bold" style={{ color: '#1C2B1E' }}>No reviews yet.</p>
              <p className="mt-2" style={{ color: '#5A6A5C' }}>Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                  style={{ border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl" style={{ background: 'linear-gradient(to right, #C9A24A, #e8c87e)' }} />

                  <div className="flex justify-between items-start mb-5">
                    {renderStars(review.rating || 5)}
                    <span className="text-xs font-medium" style={{ color: '#9aaa9c' }}>
                      {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <p className="leading-relaxed italic mb-6 flex-grow text-sm" style={{ color: '#5A6A5C' }}>
                    "{review.comment}"
                  </p>

                  <div className="flex items-center gap-3 mt-auto">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                      style={{ background: '#0f1e12', color: '#C9A24A', fontSize: '0.875rem' }}
                    >
                      {(review.name || "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: '#1C2B1E' }}>{review.name || "Anonymous Patient"}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#C9A24A' }}>Verified Patient</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <p className="text-sm" style={{ color: '#5A6A5C' }}>
              All these reviews can also be found on{' '}
              <a href="https://www.practo.com/bangalore/clinic/v-dental-center-indiranagar/reviews?referrer=clinic_listing" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: '#C9A24A' }}>Practo</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
