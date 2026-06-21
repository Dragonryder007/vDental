import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';

/** Match server normalizeAppointmentSlot for time comparisons */
function normTimeLabel(t) {
  return String(t || '')
    .trim()
    .replace(/\s+/g, ' ');
}

const BookingPage = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || 'smile-designing';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: initialService,
    issue: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [bookedTimesForDate, setBookedTimesForDate] = useState([]);
  const [bookedSlotsLoading, setBookedSlotsLoading] = useState(false);

  // Review State
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const apiBase = useMemo(
    () => (window.location.hostname === 'localhost' ? 'http://localhost:3000' : ''),
    []
  );

  useEffect(() => {
    let cancelled = false;
    const date = formData.date;

    if (!date) {
      setBookedTimesForDate([]);
      setBookedSlotsLoading(false);
      return undefined;
    }

    setBookedSlotsLoading(true);
    setBookedTimesForDate([]);

    axios
      .get(`${apiBase}/api/booked-times`, { params: { date } })
      .then((response) => {
        if (cancelled) return;
        const booked = response.data.bookedTimes || [];
        const taken = new Set(booked.map(normTimeLabel));
        setBookedTimesForDate(booked);
        setFormData((prev) => {
          if (prev.time && taken.has(normTimeLabel(prev.time))) {
            return { ...prev, time: '' };
          }
          return prev;
        });
      })
      .catch(() => {
        if (!cancelled) setBookedTimesForDate([]);
      })
      .finally(() => {
        if (!cancelled) setBookedSlotsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [formData.date, apiBase]);

  const bookedTimeSet = useMemo(() => new Set(bookedTimesForDate.map(normTimeLabel)), [bookedTimesForDate]);

  const fetchAvailableSlots = async () => {
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
    try {
      const response = await axios.get(`${API_BASE}/api/available-slots`);
      setAvailableSlots(response.data.slots);
    } catch (error) {
      console.log('Using default slots');
      setAvailableSlots(['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM']);
    }
  };

  const isSlotDisabled = (slot, selectedDate = formData.date) => {
    if (!selectedDate) return false;

    const now = new Date();
    // Get current local date in YYYY-MM-DD format
    const todayStr = now.toLocaleDateString('en-CA');

    // If selected date is in the future, only past-time logic does not apply
    if (selectedDate > todayStr) return false;
    // If selected date is in the past, disable all (safety check)
    if (selectedDate < todayStr) return true;

    // It is today, check if the slot time has already passed
    const [time, modifier] = slot.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const slotDateTime = new Date(now);
    slotDateTime.setHours(hours, minutes, 0, 0);

    return slotDateTime < now;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      // If date changes to today, clear time if it's already passed
      if (name === 'date' && next.time && isSlotDisabled(next.time, value)) {
        next.time = '';
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBookingError(null);

    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
    try {
      const localResponse = await axios.post(`${API_BASE}/api/appointments`, formData);
      setEmailStatus(localResponse?.data?.emailStatus || null);

      if (localResponse.data.success) {
        setSubmitted(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setBookingError(error.response.data.error || 'This slot was just taken by another user. Please select a different time.');
        if (formData.date) {
          try {
            const r = await axios.get(`${API_BASE}/api/booked-times`, { params: { date: formData.date } });
            const booked = r.data.bookedTimes || [];
            setBookedTimesForDate(booked);
            setFormData((prev) =>
              prev.time && new Set(booked.map(normTimeLabel)).has(normTimeLabel(prev.time))
                ? { ...prev, time: '' }
                : prev
            );
          } catch {
            /* ignore */
          }
        }
      } else {
        console.error('Booking error:', error);
        setBookingError('Something went wrong while booking. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewData.rating === 0) return;
    setReviewLoading(true);
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
    try {
      await axios.post(`${API_BASE}/api/reviews`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      setReviewSubmitted(true);
    } catch (error) {
      console.error('Review error:', error);
      alert(t('reviews.error') || 'Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAF6F0' }}>
      <SEO
        title="Book Appointment"
        description="Schedule your free dental consultation at V Dental and Implant Center. Book online for smile designing, aligners, or implants in Bengaluru."
        keywords="book dentist online, dental appointment Bengaluru, free consultation, V Dental and Implant Center booking"
      />

      {/* Hero */}
      <section className="relative py-24 md:py-32 px-5 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1e12 0%, #0a1509 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.06) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
            <p style={{ color: '#C9A24A', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Free Consultation</p>
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4" style={{ color: '#FAF6F0' }}>{t('booking.title')}</h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(250,246,240,0.72)' }}>{t('booking.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        {submitted ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-3xl p-6 md:p-12 text-center">
            <div className="text-5xl md:text-6xl mb-4">✅</div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-green-900 mb-4">{t('booking.confirmed')}</h2>
            <p className="text-green-700 mb-6 text-sm md:text-base">{t('booking.confirmedSub')}</p>
            {emailStatus ? (
              <p className="text-sm mb-6">
                <strong>{t('booking.emailLabel')}</strong>{' '}
                {emailStatus.sent ? (
                  <>
                    {t('booking.emailSent')}
                    {emailStatus.mode === 'ethereal' && emailStatus.previewUrl ? (
                      <>
                        {' '}
                        <a
                          href={emailStatus.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold hover:underline" style={{ color: '#C9A24A' }}
                        >
                          {t('booking.viewPreview')}
                        </a>
                      </>
                    ) : null}
                  </>
                ) : (
                  t('booking.emailNotSent').replace('{reason}', emailStatus.reason || 'unknown')
                )}
              </p>
            ) : null}
            <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 text-left text-sm md:text-base">
              <p className="text-gray-700 mb-2"><strong>{t('booking.nameLabel')}</strong> {formData.name || 'Pending'}</p>
              <p className="text-gray-700 mb-2"><strong>{t('booking.dateLabel')}</strong> {formData.date}</p>
              <p className="text-gray-700 mb-2"><strong>{t('booking.timeLabel')}</strong> {formData.time}</p>
              <p className="text-gray-700"><strong>{t('booking.serviceLabel')}</strong> {t(`booking.services.${formData.service.replace('-', '')}`) || formData.service}</p>
            </div>
            <div className="flex flex-col gap-4">
              <a 
                href={`https://wa.me/919037151894?text=${encodeURIComponent(
                  `Hello V Dental and Implant Center! 👋 \n\nI just booked an appointment:\n👤 Name: ${formData.name}\n📆 Date: ${formData.date}\n⏰ Time: ${formData.time}\n🦷 Service: ${formData.service}\n\nPlease confirm!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-shimmer btn-magnetic px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              style={{ color: '#0d0d0d' }}
              >
                <span>{t('booking.whatsappBtn')}</span>
                <span className="text-xl">💬</span>
              </a>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setEmailStatus(null);
                  setBookingError(null);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    date: '',
                    time: '',
                    service: 'smile-designing',
                    issue: ''
                  });
                }} 
                className="font-bold hover:underline"
                style={{ color: '#C9A24A' }}
              >
                {t('booking.bookAnother')}
              </button>
            </div>

            {/* Give Review Section */}
            <div className="mt-8 pt-8 border-t border-green-200 text-left">
              {reviewSubmitted ? (
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-3xl mb-2">✨</div>
                  <p className="text-green-800 font-bold">{t('reviews.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
                  <h3 className="font-serif text-xl font-bold text-[color:var(--dk)] mb-2">{t('reviews.giveReview')}</h3>
                  <p className="text-sm text-[color:var(--muted)] mb-6">{t('reviews.reviewDesc')}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">Email</label>
                      <input type="email" value={formData.email} readOnly className="w-full bg-gray-50 border border-black/5 rounded-xl px-4 py-2 text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">Phone</label>
                      <input type="tel" value={formData.phone} readOnly className="w-full bg-gray-50 border border-black/5 rounded-xl px-4 py-2 text-gray-500" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">{t('reviews.rating')}</label>
                    <div className="flex gap-2 text-3xl">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                          className={`transition-colors ${reviewData.rating >= star ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">{t('reviews.comments')}</label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 h-24 resize-none focus:outline-none"
                      style={{ background: '#FAF6F0', border: '1px solid rgba(201,162,74,0.25)', color: '#1C2B1E' }}
                      placeholder={t('reviews.writeCommentPlaceholder')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading || reviewData.rating === 0}
                    className="btn-gold-shimmer btn-magnetic px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                    style={{ color: '#0d0d0d' }}
                  >
                    {reviewLoading ? t('reviews.submitting') : t('reviews.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-10" style={{ border: '1px solid rgba(201,162,74,0.18)' }}>
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div>
                <label className="block font-bold mb-2" style={{ color: '#1C2B1E' }}>{t('booking.fullName')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition"
                  style={{ border: '1px solid rgba(201,162,74,0.25)', background: '#FAF6F0', color: '#1C2B1E' }}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block font-bold mb-2" style={{ color: '#1C2B1E' }}>{t('booking.phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition"
                  style={{ border: '1px solid rgba(201,162,74,0.25)', background: '#FAF6F0', color: '#1C2B1E' }}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <label className="block font-bold mb-2" style={{ color: '#1C2B1E' }}>{t('booking.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl focus:outline-none transition"
                style={{ border: '1px solid rgba(201,162,74,0.25)', background: '#FAF6F0', color: '#1C2B1E' }}
                placeholder="your@email.com"
              />
            </div>

            {/* Appointment Details */}
            <div className="p-4 md:p-6 rounded-2xl mb-6 md:mb-8" style={{ background: '#F3EDE4', border: '1px solid rgba(201,162,74,0.15)' }}>
              <h3 className="text-lg font-bold mb-4 md:mb-6" style={{ color: '#1C2B1E' }}>{t('booking.selectAppointment')}</h3>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div>
                  <label className="block font-bold mb-2" style={{ color: '#1C2B1E' }}>{t('booking.servicePlaceholder')}</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl focus:outline-none transition"
                    style={{ border: '1px solid rgba(201,162,74,0.25)', background: 'white', color: '#1C2B1E' }}
                  >
                    <option value="invisalign">{t('booking.services.invisalign')}</option>
                    <option value="veneers">{t('booking.services.veneers')}</option>
                    <option value="smile-makeover">{t('booking.services.smileMakeover')}</option>
                    <option value="full-mouth-rehab">{t('booking.services.fullMouthRehab')}</option>
                    <option value="all-on-4">{t('booking.services.allOn4')}</option>
                    <option value="dental-tourism">{t('booking.services.dentalTourism')}</option>
                    <option value="implants">{t('booking.services.implants')}</option>
                    <option value="smile-designing">{t('booking.services.smileDesigning')}</option>
                    <option value="aligners">{t('booking.services.aligners')}</option>
                    <option value="consultation">{t('booking.services.consultation')}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-2" style={{ color: '#1C2B1E' }}>{t('booking.datePlaceholder')}</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toLocaleDateString('en-CA')}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none transition"
                    style={{ border: '1px solid rgba(201,162,74,0.25)', background: 'white', color: '#1C2B1E' }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-3" style={{ color: '#1C2B1E' }}>{t('booking.timeSlot')}</label>
                {formData.date && bookedSlotsLoading ? (
                  <p className="text-sm mb-3" style={{ color: '#5A6A5C' }}>{t('booking.loadingAvailability')}</p>
                ) : null}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                  {availableSlots.map((slot) => {
                    const isBooked =
                      Boolean(formData.date) && bookedTimeSet.has(normTimeLabel(slot));
                    const disablePastOrPassed = isSlotDisabled(slot);
                    const disabled =
                      Boolean(formData.date && bookedSlotsLoading) || disablePastOrPassed || isBooked;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={disabled}
                        title={
                          isBooked
                            ? t('booking.slotUnavailable')
                            : disablePastOrPassed && formData.date
                              ? t('booking.slotPast')
                              : undefined
                        }
                        onClick={() =>
                          disabled ? undefined : setFormData((prev) => ({ ...prev, time: slot }))
                        }
                        className={`py-2 px-3 rounded-lg font-semibold text-sm transition${isBooked ? ' line-through' : ''}`}
                        style={formData.time === slot
                          ? { background: '#C9A24A', color: '#0d0d0d' }
                          : disabled
                            ? { background: '#f5f5f5', color: '#bbb', border: '1px solid #e5e5e5', cursor: 'not-allowed', opacity: 0.6 }
                            : { background: 'white', border: '1px solid rgba(201,162,74,0.3)', color: '#1C2B1E' }
                        }
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Issue Description */}
            <div className="mb-6 md:mb-8">
              <label className="block font-bold mb-2" style={{ color: '#1C2B1E' }}>{t('booking.goalsLabel')}</label>
              <textarea
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl focus:outline-none"
                style={{ border: '1px solid rgba(201,162,74,0.25)', background: '#FAF6F0', color: '#1C2B1E' }}
                placeholder={t('booking.goalsPlaceholder')}
              />
            </div>

            {bookingError && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
                <span className="block sm:inline">{bookingError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold-shimmer btn-magnetic w-full py-4 rounded-xl font-bold text-lg disabled:opacity-50"
              style={{ color: '#0d0d0d' }}
            >
              {loading ? t('booking.processing') : t('booking.confirmBtn')}
            </button>

            <p className="text-sm text-center mt-4" style={{ color: '#5A6A5C' }}>
              {t('booking.benefits')}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingPage;

