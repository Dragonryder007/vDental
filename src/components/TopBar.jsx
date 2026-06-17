import React from 'react';
import { Link } from 'react-router-dom';

const WA_PATH = "M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 6.69C8.37 6.69 8.1 6.75 7.87 7C7.65 7.25 7 7.85 7 9.06C7 10.27 7.89 11.45 8 11.61C8.14 11.77 9.76 14.3 12.31 15.32C14.42 16.16 14.85 16 15.31 15.95C15.77 15.91 16.78 15.35 17 14.76C17.21 14.18 17.21 13.68 17.14 13.57C17.07 13.47 16.91 13.41 16.67 13.3C16.43 13.17 15.27 12.6 15.05 12.5C14.83 12.43 14.67 12.39 14.5 12.64C14.34 12.89 13.88 13.41 13.74 13.57C13.6 13.74 13.46 13.76 13.22 13.65C12.98 13.53 12.21 13.28 11.3 12.47C10.59 11.84 10.11 11.06 9.97 10.81C9.83 10.57 9.95 10.43 10.07 10.31C10.18 10.2 10.32 10.02 10.44 9.88C10.56 9.74 10.6 9.64 10.68 9.47C10.76 9.31 10.72 9.17 10.66 9.06C10.6 8.95 10.13 7.78 9.93 7.3C9.74 6.85 9.54 6.84 9.38 6.83H8.85C8.85 6.83 8.69 6.69 8.53 6.69Z";

const TopBar = () => (
  <div
    className="fixed left-0 right-0 z-[70] flex items-center justify-center"
    style={{
      top: 0,
      height: 'var(--top-bar-height)',
      background: 'linear-gradient(90deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)',
      borderBottom: '1px solid rgba(201, 150, 58, 0.18)',
    }}
  >
    {/* Subtle gold shimmer line at very top */}
    <div
      className="absolute top-0 left-0 right-0 h-[1.5px]"
      style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,150,58,0.5) 30%, rgba(201,150,58,0.8) 50%, rgba(201,150,58,0.5) 70%, transparent 100%)' }}
    />

    <div className="flex items-center h-full divide-x divide-white/[0.07]">

      {/* AI Preview */}
      <Link
        to="/ai-preview"
        className="group h-full flex items-center gap-2 px-4 sm:px-6 lg:px-8 transition-all duration-200 hover:bg-white/[0.03]"
      >
        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--gold)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-white/60 group-hover:text-white/90 transition-colors">
          AI Preview
        </span>
        <span
          className="hidden sm:inline-flex items-center text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full"
          style={{ color: 'var(--gold)', background: 'rgba(201,150,58,0.12)', border: '1px solid rgba(201,150,58,0.25)' }}
        >
          NEW
        </span>
      </Link>

      {/* WhatsApp */}
      <a
        href="https://wa.me/919037151894"
        target="_blank"
        rel="noopener noreferrer"
        className="group h-full flex items-center gap-2 px-4 sm:px-6 lg:px-8 transition-all duration-200 hover:bg-white/[0.03]"
      >
        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25D366' }}>
          <path d={WA_PATH} />
        </svg>
        <span className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-white/60 group-hover:text-white/90 transition-colors">
          WhatsApp
        </span>
      </a>

      {/* Call */}
      <a
        href="tel:+919037151894"
        className="group h-full flex items-center gap-2 px-4 sm:px-6 lg:px-8 transition-all duration-200 hover:bg-white/[0.03]"
      >
        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--gold)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-white/60 group-hover:text-white/90 transition-colors sm:hidden">
          Call Us
        </span>
        <span className="text-[10.5px] font-semibold tracking-[0.06em] text-white/60 group-hover:text-white/90 transition-colors hidden sm:inline">
          +91 90371 51894
        </span>
      </a>

    </div>
  </div>
);

export default TopBar;
