import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import smilePlusHeroImg from '../images/smile-plus-hero.png';
import {
  SMILE_PLUS_SLUG,
  smilePlusWhatsAppUrl,
} from '../constants/contact';

const WHATSAPP_MSG =
  'Hello! I would like to enquire about Smile Plus Dental Care – Marathahalli (V Dental branch).';

const SmilePlusHomePromo = () => {
  const navigate = useNavigate();

  return (
    <section
      id="smile-plus-marathahalli"
      aria-labelledby="smile-plus-promo-heading"
      className="w-full border-y border-black/8 cursor-pointer"
      onClick={() => navigate(SMILE_PLUS_SLUG)}
      title="Visit Smile Plus Dental Care – Marathahalli"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[300px]">

        {/* Image — shows on top on mobile */}
        <div className="relative block md:hidden h-48 overflow-hidden">
          <img
            src={smilePlusHeroImg}
            alt="Smile Plus Dental Care – Marathahalli"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[color:var(--deep)]/60" />
        </div>

        {/* Left — content */}
        <div className="flex flex-col justify-center px-6 sm:px-10 md:px-12 py-8 sm:py-10 md:py-12 bg-[color:var(--deep)] text-white">

          {/* Branch label with shimmer */}
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#C9A24A] mb-4 relative overflow-hidden">
            <span className="relative inline-block">
              Our Marathahalli Branch
              <span className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </span>
          </p>

          {/* Clinic name */}
          <h2
            id="smile-plus-promo-heading"
            className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight mb-1"
          >
            Smile Plus Dental Care
          </h2>
          <p className="text-white/50 text-sm mb-5">
            Marathahalli, Bangalore &nbsp;·&nbsp; Since 2004
          </p>

          {/* Service pills */}
          <div className="flex flex-wrap gap-2 mb-7">
            {['Dental Implants', 'Invisalign', 'Smile Makeovers', 'Cosmetic Dentistry'].map((s) => (
              <span
                key={s}
                className="text-xs text-white/75 border border-white/15 px-3 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>

          {/* CTAs — stopPropagation so they work independently */}
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to={SMILE_PLUS_SLUG}
              onClick={(e) => e.stopPropagation()}
              className="btn-glow group inline-flex items-center gap-2 justify-center bg-[color:var(--teal)] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[color:var(--dk)]"
            >
              Explore Branch
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href={smilePlusWhatsAppUrl(WHATSAPP_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center bg-green-600 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Right — clinic image on desktop with hover zoom + floating badge */}
        <div className="relative hidden md:block overflow-hidden group min-h-[300px]">
          <img
            src={smilePlusHeroImg}
            alt="Smile Plus Dental Care – Marathahalli"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--deep)] via-transparent to-transparent" />

          {/* Floating badge */}
          <div className="absolute top-5 left-6 bg-white/95 backdrop-blur rounded-2xl px-5 py-3 shadow-xl border border-black/5 animate-float">
            <div className="font-serif text-xl font-bold text-[color:var(--teal)] leading-none">Since 2004</div>
            <div className="text-xs text-[color:var(--muted)] mt-0.5">Marathahalli · East Bangalore</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SmilePlusHomePromo;

