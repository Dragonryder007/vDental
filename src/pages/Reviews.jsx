import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:6000' : '';

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

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 5,
    comment: ''
  });
  const [formStatus, setFormStatus] = useState(null); // 'submitting', 'success', 'error'

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

      // Even after admin publishes a review, only display it on the public page
      // when rating is 4 stars or higher.
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

      // Always keep the 4 hardcoded INITIAL_REVIEWS visible alongside admin-approved ones.
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

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 text-[color:var(--teal)]">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-5 h-5 ${i < rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] font-sans pt-24 lg:pt-32 pb-20">
      
      {/* Header Section */}
      <section className="px-4 mb-16 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[color:var(--dk)] mb-6 leading-tight">
          Stories and Reviews <br className="hidden md:block" />
          <span className="text-[color:var(--teal)] italic">from satisfied clients</span>
        </h1>
        <p className="text-lg md:text-xl text-[color:var(--muted)] max-w-2xl mx-auto mb-10">
          Real experiences from our patients. Discover how we've helped transform smiles and improve oral health with our dedicated care.
        </p>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-[color:var(--dk)] text-white px-8 py-4 rounded-xl font-bold hover:bg-[color:var(--teal)] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          {t('reviews.giveReview') || 'Write a Review'}
        </button>
      </section>

      {/* Write a Review Modal/Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <h3 className="text-2xl font-serif font-bold text-[color:var(--dk)] mb-2">Share Your Experience</h3>
            <p className="text-[color:var(--muted)] mb-6">Your feedback helps us improve and helps others make informed decisions.</p>

            {formStatus === 'success' ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center font-bold">
                Thank you! Your review has been submitted successfully.
              </div>
            ) : (
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <svg className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'} hover:text-yellow-300 transition-colors`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">Name (Optional)</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)]" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">Phone *</label>
                    <input
                      name="phone"
                      required
                      type="tel"
                      inputMode="numeric"
                      pattern="\d{10}"
                      maxLength={10}
                      minLength={10}
                      title="Enter a 10-digit phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
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
                      className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)]"
                      placeholder="10-digit phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">Email *</label>
                  <input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)]" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">Review *</label>
                  <textarea name="comment" required value={formData.comment} onChange={handleInputChange} rows="4" className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)] resize-none" placeholder="Tell us about your experience..." />
                </div>
                
                {formStatus === 'error' && (
                  <div className="text-red-500 text-sm font-bold">
                    {!/^\d{10}$/.test(formData.phone)
                      ? 'Please enter a valid 10-digit phone number.'
                      : 'Something went wrong. Please try again.'}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-[color:var(--teal)] text-white py-4 rounded-xl font-bold hover:bg-[color:var(--dk)] transition-all disabled:opacity-70 mt-4"
                >
                  {formStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reviews Grid */}
      <section className="px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm animate-pulse h-64"></div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-[color:var(--muted)] bg-white rounded-3xl border border-black/5 shadow-sm">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            <p className="text-xl font-bold">No reviews yet.</p>
            <p className="mt-2">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-black/5 shadow-xl hover:shadow-2xl transition-shadow flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[color:var(--teal)] to-blue-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                
                <div className="flex justify-between items-start mb-6">
                  {renderStars(review.rating || 5)}
                  <span className="text-sm font-bold text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <p className="text-[color:var(--txt)] leading-relaxed italic mb-8 flex-grow">
                  "{review.comment}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-gradient-to-br from-[color:var(--teal)] to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {(review.name || "A")[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-[color:var(--dk)]">{review.name || "Anonymous Patient"}</h4>
                    <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--muted)]">Verified Patient</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-16 text-center">
          <p className="text-[color:var(--muted)] text-lg">
            Note: All these reviews can be found at <a href="https://www.practo.com/bangalore/clinic/v-dental-center-indiranagar/reviews?referrer=clinic_listing" target="_blank" rel="noopener noreferrer" className="text-[color:var(--teal)] hover:text-blue-500 font-bold underline decoration-2 underline-offset-4">Practo</a> as well.
          </p>
        </div>
      </section>
    </div>
  );
}

