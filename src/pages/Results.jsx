import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

import SEO from '../components/SEO';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

function resolveMediaUrl(url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

const ResultsPage = () => {
  const { t } = useLanguage();
  const [gallery, setGallery] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/gallery`);
      setGallery(response.data.gallery);
      setLoading(false);
    } catch (error) {
      console.log('Using default gallery');
      setGallery([
        {
          id: 1,
          category: 'smile-designing',
          title: 'Smile Design Transformation',
          image: 'https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=500&q=80'
        },
        {
          id: 2,
          category: 'aligners',
          title: 'Aligner Treatment Success',
          image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&q=80'
        },
        {
          id: 3,
          category: 'implants',
          title: 'Implant Crown Placement',
          image: 'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=500&q=80'
        }
      ]);
      setLoading(false);
    }
  };

  const filteredGallery = filter === 'all'
    ? gallery
    : gallery.filter(item => item.category === filter);

  const categories = [
    { value: 'all', label: t('results.filterAll'), emoji: '⭐' },
    { value: 'smile-designing', label: t('results.filterSmile'), emoji: '✨' },
    { value: 'aligners', label: t('results.filterAligners'), emoji: '🔮' },
    { value: 'implants', label: t('results.filterImplants'), emoji: '🦷' }
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FAF6F0' }}>
      <SEO
        title="Patient Transformations & Gallery"
        description="See the real-life transformations of our patients at V Dental and Implant Center. Before and after results for smile designing, aligners, and dental implants."
        keywords="dental before and after, smile transformation gallery, aligners results, implants success stories"
      />

      {/* Hero — dark cinematic */}
      <section className="relative py-28 md:py-36 px-5 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1e12 0%, #0a1509 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
            <p style={{ color: '#C9A24A', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Before & After Gallery</p>
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-5 leading-tight" style={{ color: '#FAF6F0' }}>{t('results.title')}</h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(250,246,240,0.72)' }}>{t('results.subtitle')}</p>
        </div>
      </section>

      {/* Filter Buttons — cream2 */}
      <section className="py-8 px-5" style={{ background: '#F3EDE4', borderBottom: '1px solid rgba(201,162,74,0.12)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className="px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
              style={filter === cat.value
                ? { background: '#C9A24A', color: '#0d0d0d', boxShadow: '0 4px 12px rgba(201,162,74,0.3)' }
                : { background: 'white', color: '#1C2B1E', border: '1px solid rgba(201,162,74,0.25)' }
              }
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid — cream */}
      <section className="py-16 md:py-20 px-5" style={{ background: '#FAF6F0' }}>
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-lg" style={{ color: '#5A6A5C' }}>Loading gallery...</p>
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-lg" style={{ color: '#5A6A5C' }}>No results found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map(item => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
                  style={{ border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                >
                  <div className="relative overflow-hidden h-72">
                    <img
                      src={resolveMediaUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'rgba(15,30,18,0.45)' }}
                    >
                      <span className="text-white font-bold text-lg">View</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold mb-1" style={{ color: '#1C2B1E' }}>{item.title}</h3>
                    <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#C9A24A' }}>
                      {categories.find(c => c.value === item.category)?.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA — dark */}
      <section className="py-24 px-5 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1e12 0%, #0a1509 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,74,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
            <p style={{ color: '#C9A24A', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Take the First Step</p>
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-5" style={{ color: '#FAF6F0' }}>{t('services.readyTitle')}</h2>
          <p className="mb-10 leading-relaxed" style={{ color: 'rgba(250,246,240,0.7)' }}>{t('services.readySub')}</p>
          <Link
            to="/booking"
            className="btn-gold-shimmer btn-magnetic inline-block font-bold text-lg px-10 py-4 rounded-xl"
            style={{ color: '#0d0d0d' }}
          >
            {t('services.bookNowBtn')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ResultsPage;
