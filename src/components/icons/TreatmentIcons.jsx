import React from 'react';

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const ImplantIcon = ({ className }) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M8 3.5h8l-1 4-2 1.5h-2L9 7.5 8 3.5Z" />
    <path d="M12 9v3" />
    <path d="M9 12h6l-1 6.5L12.5 20h-1L10 18.5 9 12Z" />
    <path d="M10.4 14.2h3.2M10.7 16.4h2.6" />
  </svg>
);

export const FullMouthIcon = ({ className }) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M3.5 8c1.5 6.5 6 10.5 8.5 10.5S18.5 14.5 20 8" />
    <path d="M7 8.5v3M10 9v3.5M14 9v3.5M17 8.5v3" />
  </svg>
);

export const CosmeticIcon = ({ className }) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M12 3c.6 3 1.8 4.4 4.8 5-3 .6-4.2 2-4.8 5-.6-3-1.8-4.4-4.8-5 3-.6 4.2-2 4.8-5Z" />
    <path d="M18 15c.3 1.6.9 2.3 2.5 2.6-1.6.3-2.2 1-2.5 2.6-.3-1.6-.9-2.3-2.5-2.6 1.6-.3 2.2-1 2.5-2.6Z" />
  </svg>
);

export const VeneerIcon = ({ className }) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M12 3.5c-3 0-5 1.8-5 4.5 0 1.8.4 3 1 5 .6 2 1.1 5.5 2.2 5.5.9 0 1.1-2.7 1.8-4 .4-.8 1.6-.8 2 0 .7 1.3.9 4 1.8 4 1.1 0 1.6-3.5 2.2-5.5.6-2 1-3.2 1-5 0-2.7-2-4.5-5-4.5Z" />
    <path d="M8.5 6.5c.8 1 2 1.5 3.5 1.5s2.7-.5 3.5-1.5" />
  </svg>
);
