import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from './SEO';

const SERVICE_ROUTES = {
  'smile-designing': '/smile-designing',
  'aligners-braces': '/aligners-braces',
  'dental-implants': '/dental-implants',
  general: '/booking'
};

const SERVICE_LABELS = {
  'smile-designing': 'Smile Designing',
  'aligners-braces': 'Aligners & Braces',
  'dental-implants': 'Dental Implants',
  general: 'Consultation'
};

const MAX_BYTES = 8 * 1024 * 1024;

function imageApiErrorMessage(imageReason, t) {
  if (imageReason === 'missing_api_key') return t('aiPreview.imageErrorMissingKey');
  const reason = String(imageReason || '');
  if (reason === 'billing_required') return t('aiPreview.imageErrorBilling');
  if (
    reason === 'quota_input_tokens' ||
    reason === 'quota_free_tier' ||
    reason === 'quota_exceeded' ||
    reason === 'image_not_on_free_tier' ||
    reason === 'quota_not_available' ||
    reason.includes('429')
  ) {
    return t('aiPreview.imageErrorQuota');
  }
  if (reason.includes('404')) return t('aiPreview.imageErrorModel');
  if (reason === 'no_image_in_response' || reason === 'request_failed') return t('aiPreview.imageErrorApi');
  return t('aiPreview.imageErrorApi');
}

const compressImageForApi = (file, maxEdge = 640, quality = 0.78) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const match = dataUrl.match(/^data:([^;,]+);base64,(.+)$/);
        if (!match) return reject(new Error('Could not compress image'));
        resolve({ mimeType: match[1], base64: match[2] });
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });

const ImageUpload = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [afterSource, setAfterSource] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analysisSource, setAnalysisSource] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const apiBase = useMemo(
    () => (window.location.hostname === 'localhost' ? 'http://localhost:6000' : ''),
    []
  );

  const contactValid = useMemo(() => {
    const name = contact.name.trim();
    const email = contact.email.trim();
    const phone = contact.phone.trim();
    return name.length >= 2 && phone.length >= 8 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [contact]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setErrorMsg(t('aiPreview.errorFileSize'));
      return;
    }
    setErrorMsg(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setAfterSource(null);
    setAnalysis(null);
    setAnalysisSource(null);
    setShowThankYou(false);
    setStep(2);
  };

  const runPreview = async () => {
    if (!image || !preview || !contactValid) return;
    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    setAfterSource(null);
    setShowThankYou(false);
    setStep(3);

    try {
      const { base64, mimeType } = await compressImageForApi(image);
      const { data } = await axios.post(
        `${apiBase}/api/smile-preview`,
        {
          imageBase64: base64,
          mimeType,
          name: contact.name.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim()
        },
        { timeout: 120_000 }
      );

      if (data?.afterImage) {
        setResult(data.afterImage);
        setAfterSource(data.imageSource === 'gemini' ? 'gemini' : 'other');
      } else {
        setResult(null);
        setErrorMsg(imageApiErrorMessage(data?.imageReason, t));
      }

      if (data?.analysis) {
        setAnalysis(data.analysis);
        setAnalysisSource(data.source || 'fallback');
      }

      setShowThankYou(true);

      requestAnimationFrame(() => {
        document.getElementById('ai-smile-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (e) {
      console.error('Smile preview failed:', e);
      setResult(null);
      setErrorMsg(e?.response?.data?.error || t('aiPreview.imageErrorApi'));
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setContact({ name: '', email: '', phone: '' });
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
    setAfterSource(null);
    setAnalysis(null);
    setAnalysisSource(null);
    setErrorMsg(null);
    setShowThankYou(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    { n: 1, label: t('aiPreview.stepDetails') },
    { n: 2, label: t('aiPreview.stepPhoto') },
    { n: 3, label: t('aiPreview.stepResults') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[color:var(--soft)] to-[color:var(--bg)] pt-24 pb-16 md:pt-28">
      <SEO
        title="AI Smile Preview"
        description="Upload your smile photo and see an AI-powered preview. V Dental and Implant Center, Bengaluru."
        keywords="AI smile preview, digital smile design, dental AI Bengaluru"
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8 text-center md:mb-10">
          <h1 className="font-serif text-3xl font-bold text-[color:var(--dk)] md:text-4xl">{t('aiPreview.title')}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[color:var(--muted)]">{t('aiPreview.subtitle')}</p>
        </div>

        <ol className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
          {steps.map((s) => (
            <li key={s.n} className="flex items-center gap-2 sm:gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-9 sm:w-9 sm:text-sm ${
                  step >= s.n
                    ? 'bg-[color:var(--teal)] text-white'
                    : 'border border-black/10 bg-white text-[color:var(--muted)]'
                }`}
              >
                {s.n}
              </span>
              <span
                className={`hidden text-xs font-bold sm:inline sm:text-sm ${
                  step >= s.n ? 'text-[color:var(--dk)]' : 'text-[color:var(--muted)]'
                }`}
              >
                {s.label}
              </span>
              {s.n < 3 && <span className="mx-1 hidden h-px w-6 bg-black/10 sm:block md:w-10" aria-hidden />}
            </li>
          ))}
        </ol>

        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-2xl">
          <div className="md:flex">
            <div className="border-b border-black/5 bg-[color:var(--deep)] p-8 text-white md:w-[42%] md:border-b-0 md:border-r md:p-10">
              <h2 className="font-serif text-2xl font-bold">{t('aiPreview.formTitle')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{t('aiPreview.formSub')}</p>

              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (contactValid) setStep(Math.max(step, 2));
                }}
              >
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-white/60">
                    {t('aiPreview.fullName')} *
                  </label>
                  <input
                    name="name"
                    value={contact.name}
                    onChange={handleContactChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-[color:var(--teal)] focus:outline-none"
                    placeholder={t('aiPreview.fullNamePlaceholder')}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-white/60">
                    {t('aiPreview.email')} *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={contact.email}
                    onChange={handleContactChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-[color:var(--teal)] focus:outline-none"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-white/60">
                    {t('aiPreview.phone')} *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={contact.phone}
                    onChange={handleContactChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-[color:var(--teal)] focus:outline-none"
                    placeholder="+91 …"
                  />
                </div>
                {step === 1 && contactValid && (
                  <p className="text-xs font-bold text-emerald-300">{t('aiPreview.detailsReady')}</p>
                )}
              </form>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">{t('aiPreview.uploadTitle')}</p>
                <p className="mt-1 text-sm text-white/60">{t('aiPreview.uploadSub')}</p>
                <label
                  className={`mt-4 flex w-full cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                    contactValid
                      ? 'border-white/25 hover:border-[color:var(--teal)] hover:bg-white/5'
                      : 'cursor-not-allowed border-white/10 opacity-50'
                  }`}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={!contactValid}
                    onChange={handleImageChange}
                  />
                  <span className="text-3xl" aria-hidden>
                    📸
                  </span>
                  <span className="mt-2 font-bold">{t('aiPreview.btnUpload')}</span>
                  <span className="mt-1 text-xs text-white/50">JPG, PNG · max 8MB</span>
                </label>
                {!contactValid && (
                  <p className="mt-2 text-xs text-amber-200/90">{t('aiPreview.completeDetailsFirst')}</p>
                )}
              </div>

              {preview && contactValid && (
                <button
                  type="button"
                  onClick={runPreview}
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-[color:var(--teal)] py-4 text-lg font-bold text-white shadow-xl transition hover:bg-[color:var(--dk)] disabled:opacity-50"
                >
                  {loading ? t('aiPreview.processing') : t('aiPreview.btnProcess')}
                </button>
              )}

              {errorMsg && (
                <div className="mt-4 rounded-xl border border-rose-300/30 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
                  {errorMsg}
                </div>
              )}
            </div>

            <div
              id="ai-smile-results"
              className="flex flex-1 items-center justify-center bg-[color:var(--bg)] p-8 md:p-10"
            >
              {!preview ? (
                <div className="text-center text-[color:var(--muted)]">
                  <div className="text-5xl mb-4" aria-hidden>
                    ✨
                  </div>
                  <p className="font-medium">{t('aiPreview.awaitingPhoto')}</p>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center">
                  {result && !loading ? (
                    <div className="grid w-full grid-cols-2 gap-3 sm:gap-4">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 bg-neutral-100 shadow-md">
                        <img
                          src={preview}
                          className="h-full w-full object-cover object-[center_20%]"
                          alt={t('aiPreview.before')}
                        />
                        <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          {t('aiPreview.before')}
                        </span>
                      </div>
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[color:var(--teal)]/30 bg-neutral-100 shadow-md">
                        <img
                          src={result}
                          className="h-full w-full object-cover object-[center_20%]"
                          alt={t('aiPreview.after')}
                        />
                        <span className="absolute left-3 top-3 rounded-md bg-[color:var(--teal)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          {t('aiPreview.after')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-black/10 bg-neutral-100 shadow-md">
                      <img
                        src={preview}
                        className={`h-full w-full object-cover transition-all duration-700 ${
                          loading ? 'blur-md opacity-50' : 'opacity-100'
                        }`}
                        alt={t('aiPreview.before')}
                      />
                      {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 px-6 text-center">
                          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[color:var(--teal)] border-t-transparent" />
                          <p className="text-sm font-medium text-white">{t('aiPreview.processing')}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {showThankYou && !loading && (
                    <div className="mt-4 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-800">
                      {t('aiPreview.savedSuccess')}
                    </div>
                  )}

                  {result && !loading && afterSource === 'gemini' && (
                    <p className="mt-3 text-center text-xs text-[color:var(--muted)]">{t('aiPreview.imageAi')}</p>
                  )}
                  <p className="mt-4 text-center text-xs text-[color:var(--muted)]">{t('aiPreview.disclaimer')}</p>

                  {result && !loading && (
                    <button
                      type="button"
                      onClick={resetFlow}
                      className="mt-4 text-sm font-bold text-[color:var(--teal)] hover:underline"
                    >
                      {t('aiPreview.tryAnother')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {analysis && (
            <div
              id="ai-smile-assessment"
              className="border-t border-black/5 bg-gradient-to-br from-white to-[color:var(--soft)] p-8 md:p-12"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-2xl font-bold text-[color:var(--dk)]">AI smile assessment</h3>
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                    analysisSource === 'gemini'
                      ? 'border-[color:var(--teal)]/40 bg-[color:var(--teal)]/10 text-[color:var(--teal)]'
                      : 'border-black/10 bg-white text-gray-500'
                  }`}
                >
                  {analysisSource === 'gemini' ? 'Powered by Gemini' : 'General suggestions'}
                </span>
              </div>

              {analysis.narrative && (
                <p className="mb-6 leading-relaxed text-[color:var(--muted)]">{analysis.narrative}</p>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {analysis.concerns?.length > 0 && (
                  <div className="rounded-2xl border border-black/5 bg-white p-6">
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[color:var(--dk)]">
                      Areas to address
                    </h4>
                    <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                      {analysis.concerns.map((c, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-[color:var(--teal)]">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.strengths?.length > 0 && (
                  <div className="rounded-2xl border border-black/5 bg-white p-6">
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[color:var(--dk)]">
                      What looks great
                    </h4>
                    <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                      {analysis.strengths.map((s, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-emerald-500">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {analysis.recommendations?.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[color:var(--dk)]">
                    Recommended treatments
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {analysis.recommendations.map((rec, i) => (
                      <div key={i} className="flex flex-col rounded-2xl border border-black/5 bg-white p-5">
                        <div className="text-xs font-bold uppercase tracking-wide text-[color:var(--teal)]">
                          {SERVICE_LABELS[rec.service] || 'Consultation'}
                        </div>
                        <div className="mt-1 text-lg font-bold text-[color:var(--dk)]">{rec.treatment}</div>
                        {rec.reason && (
                          <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{rec.reason}</p>
                        )}
                        <Link
                          to={SERVICE_ROUTES[rec.service] || '/booking'}
                          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[color:var(--teal)] no-underline hover:text-[color:var(--dk)]"
                        >
                          Learn more →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center rounded-xl bg-[color:var(--teal)] px-6 py-3 font-bold text-white no-underline transition hover:bg-[color:var(--dk)]"
                >
                  Book a free consultation
                </Link>
                <Link
                  to="/faq"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 font-bold text-[color:var(--dk)] no-underline transition hover:bg-[color:var(--soft)]"
                >
                  Read our FAQs
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;

