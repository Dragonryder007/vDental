import React, { useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { dentalImplantsFaqCategoriesByLang } from '../data/dentalImplantsFaqCategories';

const DI_TITLE_KEYS = [
  'faq.diTitle0',
  'faq.diTitle1',
  'faq.diTitle2',
  'faq.diTitle3',
  'faq.diTitle4',
  'faq.diTitle5',
  'faq.diTitle6',
  'faq.diTitle7'
];

const DentalImplantsFAQ = () => {
  const { t, language } = useLanguage();
  const [expanded, setExpanded] = useState(null);

  const bodyNote = useMemo(() => {
    const value = t('faq.dentalFaqBodyNote');
    // If translation is missing or intentionally blank, avoid rendering the key.
    if (!value || value.startsWith('faq.')) return null;
    return value;
  }, [t, language]);

  const faqCategories = useMemo(
    () => {
      const base = dentalImplantsFaqCategoriesByLang[language] ?? dentalImplantsFaqCategoriesByLang.en;
      return base.map((cat, i) => ({
        ...cat,
        // keep titles controlled by translations so headings stay consistent across UI
        title: t(DI_TITLE_KEYS[i])
      }));
    },
    [language, t]
  );

  return (
    <div className="py-20 md:py-24 px-5 sm:px-6" style={{ background: '#FAF6F0' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
            <p style={{ color: '#C9A24A', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>In-Depth Answers</p>
            <div className="h-px w-8" style={{ background: '#C9A24A' }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-normal mb-4" style={{ color: '#1C2B1E' }}>{t('faq.dentalFaqTitle')}</h2>
          <p className="text-lg" style={{ color: '#5A6A5C' }}>{t('faq.dentalFaqSubtitle')}</p>
          {bodyNote ? <p className="text-sm mt-4 max-w-2xl mx-auto" style={{ color: '#9aaa9c' }}>{bodyNote}</p> : null}
        </div>

        <div className="space-y-4">
          {faqCategories.map((category, catIdx) => (
            <div key={catIdx} className="rounded-2xl overflow-hidden bg-white"
              style={{ border: '1px solid rgba(201,162,74,0.18)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <h3 className="text-sm font-semibold px-6 py-3.5 uppercase tracking-widest"
                style={{ background: 'linear-gradient(to right, rgba(201,162,74,0.12), rgba(201,162,74,0.04))', color: '#C9A24A', borderBottom: '1px solid rgba(201,162,74,0.15)' }}>
                {category.title}
              </h3>
              <div>
                {category.items.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isExpanded = expanded === id;
                  return (
                    <div key={id} style={{ borderBottom: itemIdx < category.items.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                      <button
                        type="button"
                        className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none gap-4 transition-colors"
                        onClick={() => setExpanded(isExpanded ? null : id)}
                        style={{ color: '#1C2B1E' }}
                      >
                        <h4 className="text-base font-semibold flex-1 min-w-0 break-words leading-snug">{item.q}</h4>
                        <span
                          className="material-symbols-rounded shrink-0"
                          style={{
                            fontSize: '22px',
                            color: '#C9A24A',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          expand_more
                        </span>
                      </button>
                      <div className={`px-6 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="leading-relaxed break-words text-sm" style={{ color: '#5A6A5C' }}>{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DentalImplantsFAQ;

