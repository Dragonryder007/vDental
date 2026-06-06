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
    <div className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-[color:var(--dk)] mb-4">{t('faq.dentalFaqTitle')}</h2>
          <p className="text-xl text-[color:var(--muted)]">{t('faq.dentalFaqSubtitle')}</p>
          {bodyNote ? <p className="text-sm text-[color:var(--muted)] mt-4 max-w-2xl mx-auto">{bodyNote}</p> : null}
        </div>

        <div className="space-y-8">
          {faqCategories.map((category, catIdx) => (
            <div key={catIdx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <h3 className="bg-[color:var(--teal)] text-white text-xl font-bold px-6 py-4">{category.title}</h3>
              <div className="divide-y divide-gray-100">
                {category.items.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isExpanded = expanded === id;
                  return (
                    <div key={id} className="p-2">
                      <button
                        type="button"
                        className="w-full text-left px-4 py-4 flex justify-between items-center focus:outline-none gap-4"
                        onClick={() => setExpanded(isExpanded ? null : id)}
                      >
                        <h4 className="text-lg font-bold text-gray-800 flex-1 min-w-0 break-words">{item.q}</h4>
                        <span
                          className={`text-2xl text-[color:var(--teal)] shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        >
                          âŒ„
                        </span>
                      </button>
                      <div
                        className={`px-4 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <p className="text-gray-600 leading-relaxed text-lg break-words">{item.a}</p>
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

