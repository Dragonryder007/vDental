import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const AssessmentPage = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    smile: '',
    teeth: '',
    missingTeeth: 0,
    brushing: 'twice',
    issue: ''
  });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const submitAssessment = async () => {
    setLoading(true);
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
    try {
      const response = await axios.post(`${API_BASE}/api/recommend-treatment`, { answers });
      setRecommendation(response.data);

      await axios.post('https://api.web3forms.com/submit', {
        access_key: '8f11e73a-2e5f-4578-bb73-52c99d93155f',
        subject: `New Smile Assessment Completed`,
        from_name: 'V Dental and Implant Center Website',
        confirm_email: 'true',
        replyto: 'cursorhalesh@gmail.com',
        name: 'Patient Assessment User',
        recommendation: response.data.recommendedTreatment,
        ...answers
      }, {
        headers: { 'Accept': 'application/json' }
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAF6F0' }}>
      <SEO
        title="Free Smile Assessment"
        description="Take our 1-minute smile assessment quiz to get a personalized dental treatment recommendation and cost estimate. Free for all patients."
        keywords="smile quiz, dental assessment, free dental advice, smile makeover quiz, V Dental and Implant Center"
      />

      {/* Hero — dark */}
      <section className="relative py-24 md:py-32 px-5 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1e12 0%, #0a1509 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.06) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
            <p style={{ color: '#C9A24A', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Free Assessment</p>
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight" style={{ color: '#FAF6F0' }}>
            {recommendation ? t('assessment.resultTitle') : t('assessment.quizTitle')}
          </h1>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: 'rgba(250,246,240,0.7)' }}>
            {recommendation ? t('assessment.resultSub') : t('assessment.subtitle')}
          </p>
        </div>
      </section>

      {/* Quiz / Result Card — cream */}
      <section className="py-16 px-4" style={{ background: '#FAF6F0' }}>
        <div className="max-w-2xl mx-auto">
          {recommendation ? (
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10" style={{ border: '1px solid rgba(201,162,74,0.18)' }}>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-3xl font-serif font-bold mb-4" style={{ color: '#1C2B1E' }}>
                  {t('assessment.recTitle')}
                </h2>
                <p className="text-xl font-bold" style={{ color: '#C9A24A', marginBottom: '2rem' }}>
                  {recommendation.recommendedTreatment}
                </p>
              </div>

              <div className="rounded-2xl p-6 mb-8 grid md:grid-cols-3 gap-6" style={{ background: '#F3EDE4', border: '1px solid rgba(201,162,74,0.15)' }}>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#1C2B1E' }}>
                    ${recommendation.estimatedCost?.toLocaleString()}
                  </div>
                  <p style={{ color: '#5A6A5C' }}>{t('assessment.estCost')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#1C2B1E' }}>
                    {recommendation.timeframe}
                  </div>
                  <p style={{ color: '#5A6A5C' }}>{t('assessment.duration')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#1C2B1E' }}>
                    95%+
                  </div>
                  <p style={{ color: '#5A6A5C' }}>{t('assessment.successRate')}</p>
                </div>
              </div>

              <div className="rounded-2xl p-6 text-white mb-8" style={{ background: 'linear-gradient(135deg, #0f1e12 0%, #0a1509 100%)' }}>
                <h3 className="font-bold text-lg mb-4" style={{ color: '#C9A24A' }}>{t('assessment.nextSteps')}</h3>
                <ul className="space-y-3" style={{ color: 'rgba(250,246,240,0.85)' }}>
                  <li>✦ {t('assessment.step1')}</li>
                  <li>✦ {t('assessment.step2')}</li>
                  <li>✦ {t('assessment.step3')}</li>
                  <li>✦ {t('assessment.step4')}</li>
                </ul>
              </div>

              <div className="flex gap-4 flex-col md:flex-row">
                <button
                  onClick={() => {
                    setRecommendation(null);
                    setStep(1);
                    setAnswers({ smile: '', teeth: '', missingTeeth: 0, brushing: 'twice', issue: '' });
                  }}
                  className="flex-1 py-3 rounded-xl font-bold transition"
                  style={{ background: '#F3EDE4', color: '#1C2B1E', border: '1px solid rgba(201,162,74,0.2)' }}
                >
                  {t('assessment.retakeBtn')}
                </button>
                <Link
                  to="/booking"
                  className="btn-gold-shimmer btn-magnetic flex-1 py-3 rounded-xl font-bold text-center"
                  style={{ color: '#0d0d0d' }}
                >
                  {t('assessment.bookConsultBtn')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10" style={{ border: '1px solid rgba(201,162,74,0.18)' }}>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-bold" style={{ color: '#C9A24A' }}>{t('assessment.questionCount').replace('{step}', step)}</span>
                  <span className="text-sm font-bold" style={{ color: '#5A6A5C' }}>{Math.round((step / 5) * 100)}%</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: '#F3EDE4' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 5) * 100}%`, background: '#C9A24A' }}
                  />
                </div>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: '#1C2B1E' }}>{t('assessment.q1Title')}</h2>
                  <div className="space-y-4">
                    {[
                      { value: 'very-happy', label: t('assessment.q1Option1'), classes: 'bg-green-50 border-green-500 text-green-900' },
                      { value: 'somewhat-happy', label: t('assessment.q1Option2'), classes: 'bg-yellow-50 border-yellow-500 text-yellow-900' },
                      { value: 'not-happy', label: t('assessment.q1Option3'), classes: 'bg-red-50 border-red-400 text-red-900' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer('smile', option.value)}
                        className={`w-full p-4 rounded-xl font-bold border-2 transition text-left ${
                          answers.smile === option.value
                            ? option.classes
                            : 'bg-white text-[#1C2B1E] hover:-translate-y-0.5'
                        }`}
                        style={answers.smile !== option.value ? { border: '1px solid rgba(201,162,74,0.25)' } : {}}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: '#1C2B1E' }}>{t('assessment.q2Title')}</h2>
                  <div className="space-y-4">
                    {[
                      { value: 'perfect', label: t('assessment.q2Option1'), emoji: '😁' },
                      { value: 'crooked', label: t('assessment.q2Option2'), emoji: '↔️' },
                      { value: 'discolored', label: t('assessment.q2Option3'), emoji: '🟡' },
                      { value: 'chipped', label: t('assessment.q2Option4'), emoji: '⚠️' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer('teeth', option.value)}
                        className="w-full p-4 rounded-xl font-bold border-2 transition text-left text-lg hover:-translate-y-0.5"
                        style={answers.teeth === option.value
                          ? { background: 'rgba(201,162,74,0.1)', border: '2px solid #C9A24A', color: '#1C2B1E' }
                          : { background: 'white', border: '1px solid rgba(201,162,74,0.25)', color: '#1C2B1E' }
                        }
                      >
                        {option.emoji} {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: '#1C2B1E' }}>Do you have any missing teeth?</h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <input
                          type="range"
                          min="0"
                          max="32"
                          value={answers.missingTeeth}
                          onChange={(e) => handleAnswer('missingTeeth', parseInt(e.target.value))}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                          style={{ accentColor: '#C9A24A', background: '#F3EDE4' }}
                        />
                        <span className="text-3xl font-bold w-12 text-center" style={{ color: '#C9A24A' }}>{answers.missingTeeth}</span>
                      </div>
                      <p className="text-sm" style={{ color: '#5A6A5C' }}>Slide to indicate number of missing teeth</p>
                    </div>
                    <div className="p-6 rounded-xl" style={{ background: '#F3EDE4', border: '1px solid rgba(201,162,74,0.15)' }}>
                      <p className="text-lg font-bold" style={{ color: '#1C2B1E' }}>
                        {answers.missingTeeth === 0
                          ? t('assessment.q3None')
                          : answers.missingTeeth < 5
                          ? t('assessment.q3Few').replace('{count}', answers.missingTeeth)
                          : t('assessment.q3Many').replace('{count}', answers.missingTeeth)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: '#1C2B1E' }}>How often do you brush your teeth?</h2>
                  <div className="space-y-4">
                    {[
                      { value: 'twice', label: t('assessment.q4Option1') },
                      { value: 'once', label: t('assessment.q4Option2') },
                      { value: 'rarely', label: t('assessment.q4Option3') }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer('brushing', option.value)}
                        className="w-full p-4 rounded-xl font-bold transition text-left hover:-translate-y-0.5"
                        style={answers.brushing === option.value
                          ? { background: 'rgba(201,162,74,0.1)', border: '2px solid #C9A24A', color: '#1C2B1E' }
                          : { background: 'white', border: '1px solid rgba(201,162,74,0.25)', color: '#1C2B1E' }
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5 */}
              {step === 5 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: '#1C2B1E' }}>{t('assessment.q5Title')}</h2>
                  <textarea
                    value={answers.issue}
                    onChange={(e) => handleAnswer('issue', e.target.value)}
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl focus:outline-none resize-none"
                    style={{ border: '1px solid rgba(201,162,74,0.25)', background: '#FAF6F0', color: '#1C2B1E' }}
                    placeholder={t('assessment.q5Placeholder')}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4 mt-10">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className="flex-1 py-3 rounded-xl font-bold transition disabled:opacity-40"
                  style={{ background: '#F3EDE4', color: '#1C2B1E', border: '1px solid rgba(201,162,74,0.2)' }}
                >
                  ← {t('assessment.backBtn')}
                </button>
                {step < 5 ? (
                  <button
                    onClick={nextStep}
                    disabled={
                      (step === 1 && !answers.smile) ||
                      (step === 2 && !answers.teeth) ||
                      (step === 3 && answers.missingTeeth === undefined) ||
                      (step === 4 && !answers.brushing)
                    }
                    className="btn-gold-shimmer btn-magnetic flex-1 py-3 rounded-xl font-bold disabled:opacity-40"
                    style={{ color: '#0d0d0d' }}
                  >
                    {t('assessment.nextBtn')} →
                  </button>
                ) : (
                  <button
                    onClick={submitAssessment}
                    disabled={loading}
                    className="btn-gold-shimmer btn-magnetic flex-1 py-3 rounded-xl font-bold disabled:opacity-40"
                    style={{ color: '#0d0d0d' }}
                  >
                    {loading ? t('assessment.processBtn') : t('assessment.getRecBtn')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AssessmentPage;
