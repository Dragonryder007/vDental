import React, { useRef, useState, useCallback } from 'react';

const BeforeAfterSlider = ({ beforeImg, afterImg, beforeLabel = 'Before', afterLabel = 'After' }) => {
  const [pos, setPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e) => { dragging.current = true; updatePos(e.clientX); };
  const onMouseMove = (e) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp   = () => { dragging.current = false; };

  const onTouchStart = (e) => { dragging.current = true; updatePos(e.touches[0].clientX); };
  const onTouchMove  = (e) => { if (dragging.current) updatePos(e.touches[0].clientX); };
  const onTouchEnd   = () => { dragging.current = false; };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-[2rem] overflow-hidden select-none"
      style={{ aspectRatio: '16/9', cursor: 'ew-resize', touchAction: 'none' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* After image — full width base */}
      <img src={afterImg} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} loading="lazy" />

      {/* Before image — clipped to left side */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={beforeImg} alt={beforeLabel} className="absolute inset-0 h-full object-cover" style={{ width: containerRef.current?.offsetWidth || '100%' }} draggable={false} loading="lazy" />
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-[2px] z-10" style={{ left: `${pos}%`, background: '#fff', boxShadow: '0 0 12px rgba(0,0,0,0.5)' }} />

      {/* Drag handle */}
      <div
        className="absolute top-1/2 z-20 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center"
        style={{ left: `${pos}%`, background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.35)' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 4L2 10L7 16" stroke="#1C2B1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 4L18 10L13 16" stroke="#1C2B1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md"
        style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
        style={{ background: '#C9A24A', color: '#0d0d0d' }}>
        {afterLabel}
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
