import React, { useEffect, useState } from 'react';

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[999] h-[3px] pointer-events-none">
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(to right, #C9A24A, #f0d080, #C9A24A)',
          boxShadow: '0 0 8px rgba(201,162,74,0.8)',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;
