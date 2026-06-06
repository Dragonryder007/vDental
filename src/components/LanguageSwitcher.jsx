import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const GlobeIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const LanguageSwitcher = ({ menuPlacement = 'down', compact = false } = {}) => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const openUp = menuPlacement === 'up';

  const languages = useMemo(
    () => [
      { code: 'en', name: t('nav.langEnglish') },
      { code: 'hi', name: t('nav.langHindi') },
      { code: 'kn', name: t('nav.langKannada') },
      { code: 'ar', name: t('nav.langArabic') },
    ],
    [language, t]
  );

  const current = useMemo(
    () => languages.find((l) => l.code === language) ?? languages[0],
    [languages, language]
  );

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={['relative flex items-center min-w-0', open ? 'z-30' : 'z-auto'].join(' ')}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-black/5 bg-[color:var(--soft)] font-bold text-[color:var(--dk)] transition hover:bg-white',
          compact ? 'px-2 py-1.5 text-[11px]' : 'px-2.5 py-1.5 text-xs',
        ].join(' ')}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <GlobeIcon />
        <span>{current.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className={[
            'absolute w-44 bg-white border border-black/5 rounded-2xl shadow-xl overflow-hidden',
            openUp ? 'left-0 bottom-full mb-2' : 'right-0 top-full mt-2',
          ].join(' ')}
        >
          {languages.map((lang) => {
            const active = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={[
                  'w-full text-start px-4 py-3 text-sm font-semibold transition flex items-center justify-between gap-2',
                  active
                    ? 'bg-[color:var(--teal)] text-white'
                    : 'hover:bg-[color:var(--soft)] text-[color:var(--dk)]',
                ].join(' ')}
              >
                <span className="flex-1">{lang.name}</span>
                <span className={`text-[10px] font-bold ${active ? 'opacity-80' : 'opacity-40'}`}>
                  {lang.code.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
