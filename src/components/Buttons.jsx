import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ── Shared constants ────────────────────────────────────────────────────────────
const G  = '#C9A24A';               // brand gold
const GD = '#b8943d';               // gold pressed/hover
const DK = '#0f1e12';               // forest dark
const CR = '#FAF6F0';               // warm cream
const FONT_SANS  = "'Inter', system-ui, sans-serif";
const FONT_SERIF = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const TRACKING   = { letterSpacing: '0.18em' };
const RADIUS_BTN = { borderRadius: '3px' };

// ── Tiny hover hook ─────────────────────────────────────────────────────────────
function useHover() {
  const [on, set] = useState(false);
  return [on, { onMouseEnter: () => set(true), onMouseLeave: () => set(false) }];
}

// ── Polymorphic shell ───────────────────────────────────────────────────────────
function Poly({ to, href, className, style, children, onClick, ...rest }) {
  if (to)   return <Link to={to}   className={className} style={style} onClick={onClick} {...rest}>{children}</Link>;
  if (href) return <a    href={href} className={className} style={style} onClick={onClick} {...rest}>{children}</a>;
  return        <button             className={className} style={style} onClick={onClick} {...rest}>{children}</button>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. PRIMARY — solid gold, sharp, uppercase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function BtnPrimary({ children, to, href, onClick, className = '' }) {
  const [hov, hp] = useHover();
  return (
    <Poly
      to={to} href={href} onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[11px] font-medium uppercase cursor-pointer select-none active:scale-[0.97] transition-all duration-200 ${className}`}
      style={{ background: hov ? GD : G, color: '#0a0a0a', fontFamily: FONT_SANS, ...RADIUS_BTN, ...TRACKING, border: 'none' }}
      {...hp}
    >
      {children}
    </Poly>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. GHOST — transparent, 1px gold border
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function BtnGhost({ children, to, href, onClick, className = '' }) {
  const [hov, hp] = useHover();
  return (
    <Poly
      to={to} href={href} onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[11px] font-medium uppercase cursor-pointer select-none active:scale-[0.97] transition-all duration-200 ${className}`}
      style={{
        background: hov ? 'rgba(201,162,74,0.09)' : 'transparent',
        color: G,
        border: `1px solid ${hov ? G : 'rgba(201,162,74,0.65)'}`,
        fontFamily: FONT_SANS,
        ...RADIUS_BTN,
        ...TRACKING,
      }}
      {...hp}
    >
      {children}
    </Poly>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. PILL TAG — full-round, gold on dark/cream semi-transparent
//    variant="dark"  → use on dark sections (default)
//    variant="cream" → use on light/cream sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function PillTag({ children, variant = 'dark', className = '' }) {
  const s = variant === 'cream'
    ? { background: 'rgba(201,162,74,0.1)',    border: '1px solid rgba(201,162,74,0.28)', color: G }
    : { background: 'rgba(15,30,18,0.68)',     border: '1px solid rgba(201,162,74,0.32)', color: G };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-medium uppercase ${className}`}
      style={{ ...s, borderRadius: '100px', fontFamily: FONT_SANS, letterSpacing: '0.12em' }}
    >
      {children}
    </span>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. TEXT LINK — minimal, animated → arrow on hover
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function TextLink({ children, to, href, onClick, className = '' }) {
  return (
    <Poly
      to={to} href={href} onClick={onClick}
      className={`inline-flex items-center gap-2 text-[11px] font-medium uppercase group cursor-pointer select-none ${className}`}
      style={{ color: G, fontFamily: FONT_SANS, letterSpacing: '0.16em', background: 'none', border: 'none', padding: 0 }}
    >
      {children}
      <span
        className="transition-transform duration-250 ease-out group-hover:translate-x-[5px]"
        aria-hidden="true"
        style={{ display: 'inline-block', fontSize: '13px' }}
      >
        →
      </span>
    </Poly>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. ICON BUTTON — dark surface, thin white border, Material Symbol
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function BtnIcon({ children, icon = 'call', to, href, onClick, className = '' }) {
  const [hov, hp] = useHover();
  return (
    <Poly
      to={to} href={href} onClick={onClick}
      className={`inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-[11px] font-medium uppercase cursor-pointer select-none active:scale-[0.97] transition-all duration-200 ${className}`}
      style={{
        background: hov ? '#1a2f1d' : DK,
        color: hov ? CR : 'rgba(250,246,240,0.82)',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.14)'}`,
        fontFamily: FONT_SANS,
        ...RADIUS_BTN,
        ...TRACKING,
      }}
      {...hp}
    >
      <span className="ms" style={{ fontSize: '15px', lineHeight: 1, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
        {icon}
      </span>
      {children}
    </Poly>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHOWCASE — hero card demonstrating all 5 in real context
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function ButtonShowcase() {
  return (
    <div className="min-h-screen" style={{ background: DK }}>

      {/* ── Hero card ─────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center px-8 py-24">
        <div className="w-full max-w-3xl mx-auto">

          {/* Pill tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            <PillTag>★ Dental Implants</PillTag>
            <PillTag>✦ Premium Care</PillTag>
            <PillTag>◆ Indiranagar</PillTag>
          </div>

          {/* Heading — Cormorant Garamond */}
          <h1
            className="font-normal leading-[1.05] mb-6"
            style={{ fontFamily: FONT_SERIF, color: CR, fontSize: 'clamp(2.75rem, 6vw, 4.25rem)', letterSpacing: '-0.01em' }}
          >
            Restore your smile<br />
            <em style={{ color: G, fontStyle: 'italic' }}>with permanent precision.</em>
          </h1>

          {/* Subtitle — Inter */}
          <p className="text-[15px] leading-relaxed mb-14 max-w-lg" style={{ fontFamily: FONT_SANS, color: 'rgba(250,246,240,0.52)', fontWeight: 400 }}>
            Specialist-placed titanium implants with digital planning.
            Zero downtime protocols — V Dental & Implant Center.
          </p>

          {/* Row 1: Primary + Ghost */}
          <div className="flex flex-wrap gap-3 mb-6">
            <BtnPrimary to="/booking">Book Appointment</BtnPrimary>
            <BtnGhost to="/booking">Free Consultation</BtnGhost>
          </div>

          {/* Row 2: Icon + Text link */}
          <div className="flex flex-wrap items-center gap-7">
            <BtnIcon href="tel:+919037151894" icon="call">Call Now</BtnIcon>
            <TextLink to="/results">Learn More</TextLink>
          </div>

          {/* Divider */}
          <div className="mt-20 mb-12 h-px" style={{ background: 'rgba(201,162,74,0.14)' }} />

          {/* ── Design system grid ──────────────────────────────────────────── */}
          <p
            className="mb-10 text-[9px] uppercase"
            style={{ fontFamily: FONT_SANS, letterSpacing: '0.28em', color: 'rgba(250,246,240,0.22)' }}
          >
            Button System · V Dental & Implant Center
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">

            {/* 01 */}
            <div>
              <Label>01 — Primary CTA</Label>
              <Sub>Solid gold · 3px radius · uppercase · 0.18em tracking</Sub>
              <BtnPrimary>Book Appointment</BtnPrimary>
            </div>

            {/* 02 */}
            <div>
              <Label>02 — Ghost / Secondary</Label>
              <Sub>Transparent · 1px gold border · fills on hover</Sub>
              <BtnGhost>Free Consultation</BtnGhost>
            </div>

            {/* 03 */}
            <div>
              <Label>03 — Pill Tag</Label>
              <Sub>Full-round · dark variant · cream variant</Sub>
              <div className="flex flex-wrap gap-2 mt-3">
                <PillTag>★ Dental Implants</PillTag>
                <PillTag>✦ Smile Design</PillTag>
                <PillTag>◆ Aligners</PillTag>
              </div>
            </div>

            {/* 04 */}
            <div>
              <Label>04 — Text Link</Label>
              <Sub>No border · gold · arrow animates +5px on hover</Sub>
              <div className="mt-3">
                <TextLink to="/results">Learn More</TextLink>
              </div>
            </div>

            {/* 05 */}
            <div className="sm:col-span-2">
              <Label>05 — Icon Button</Label>
              <Sub>Dark surface · Material Symbol · thin white border</Sub>
              <div className="flex flex-wrap gap-3 mt-3">
                <BtnIcon icon="call">Call Now</BtnIcon>
                <BtnIcon icon="calendar_month" to="/booking">Book Slot</BtnIcon>
                <BtnIcon icon="location_on">Get Directions</BtnIcon>
              </div>
            </div>

          </div>

          {/* Pill tag cream variant note */}
          <div className="mt-12 p-6 rounded" style={{ background: CR }}>
            <p className="text-[9px] uppercase mb-4" style={{ fontFamily: FONT_SANS, letterSpacing: '0.2em', color: 'rgba(28,43,30,0.4)' }}>
              Pill tag · cream variant (for light backgrounds)
            </p>
            <div className="flex flex-wrap gap-2">
              <PillTag variant="cream">★ Dental Implants</PillTag>
              <PillTag variant="cream">✦ Smile Design</PillTag>
              <PillTag variant="cream">◆ Aligners</PillTag>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

// ── Internal label helpers (showcase only) ─────────────────────────────────────
function Label({ children }) {
  return (
    <p className="text-[9px] uppercase mb-1" style={{ fontFamily: FONT_SANS, letterSpacing: '0.22em', color: 'rgba(250,246,240,0.28)' }}>
      {children}
    </p>
  );
}
function Sub({ children }) {
  return (
    <p className="text-[10px] mb-3" style={{ fontFamily: FONT_SANS, color: 'rgba(250,246,240,0.35)', lineHeight: 1.5 }}>
      {children}
    </p>
  );
}
