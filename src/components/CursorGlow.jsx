import React, { useEffect, useRef } from 'react';

const CursorGlow = () => {
  const glowRef = useRef(null);
  const pos = useRef({ x: -200, y: -200 });
  const raf = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch devices

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (glowRef.current) {
        glowRef.current.style.left = `${pos.current.x}px`;
        glowRef.current.style.top = `${pos.current.y}px`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed z-[998]"
      style={{
        width: 420,
        height: 420,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,162,74,0.07) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.3s ease',
      }}
    />
  );
};

export default CursorGlow;
