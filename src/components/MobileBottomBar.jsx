import React from 'react';
import { Link } from 'react-router-dom';
import { PHONE_TEL, WHATSAPP_NUMBER } from '../constants/contact';

const WA_MESSAGE = encodeURIComponent('Hello V Dental and Implant Center! 👋 I would like to book an appointment or inquire about your dental services.');
const WA_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MESSAGE}`;

const MobileBottomBar = () => (
  <div
    className="fixed bottom-0 inset-x-0 z-[60] md:hidden"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
  >
    <div
      className="grid grid-cols-3"
      style={{
        height: 64,
        background: 'linear-gradient(to bottom, #112518, #0b1c10)',
        boxShadow: '0 -1px 0 rgba(255,255,255,0.06), 0 -8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* CALL */}
      <a
        href={`tel:${PHONE_TEL}`}
        className="flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform"
        style={{ WebkitTapHighlightColor: 'transparent', transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)', transitionDuration: '160ms' }}
      >
        <span
          className="ms"
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.75)',
            fontVariationSettings: "'FILL' 0, 'wght' 300",
            lineHeight: 1,
          }}
        >
          call
        </span>
        <span style={{ fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase' }}>
          Call
        </span>
      </a>

      {/* BOOK NOW — highlighted centre */}
      <Link
        to="/booking"
        className="flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform"
        style={{
          WebkitTapHighlightColor: 'transparent',
          background: 'linear-gradient(to bottom, #3e6e4e, #2c5038)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
          transitionDuration: '160ms',
        }}
      >
        <span
          className="ms"
          style={{
            fontSize: 24,
            color: '#fff',
            fontVariationSettings: "'FILL' 0, 'wght' 300",
            lineHeight: 1,
          }}
        >
          calendar_month
        </span>
        <span style={{ fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.9)', fontWeight: 700, textTransform: 'uppercase' }}>
          Book Now
        </span>
      </Link>

      {/* WHATSAPP */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform"
        style={{ WebkitTapHighlightColor: 'transparent', transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)', transitionDuration: '160ms' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
          <path
            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.52 14.18c-.23.64-1.34 1.22-1.84 1.3-.47.07-1.07.1-1.72-.11a15.8 15.8 0 0 1-1.56-.58c-2.74-1.18-4.53-3.93-4.67-4.11-.14-.18-1.12-1.49-1.12-2.84 0-1.35.71-2.01 1.01-2.3.28-.27.62-.34.83-.34h.59c.19 0 .44-.07.69.53.26.62.88 2.14.96 2.3.08.16.13.35.03.56-.1.21-.15.34-.3.52-.14.18-.3.4-.43.54-.14.15-.29.31-.12.6.17.29.74 1.22 1.59 1.97 1.09.97 2.01 1.27 2.29 1.41.28.14.44.12.6-.07.17-.19.71-.83.9-1.12.19-.29.38-.24.64-.14.26.1 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.69-.16 1.33z"
            fill="#25D366"
          />
        </svg>
        <span style={{ fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase' }}>
          WhatsApp
        </span>
      </a>
    </div>
  </div>
);

export default MobileBottomBar;
