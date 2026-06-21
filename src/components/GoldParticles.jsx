import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 18;

const rand = (min, max) => Math.random() * (max - min) + min;

const GoldParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      r: rand(1, 2.5),
      speedY: rand(0.15, 0.45),
      speedX: rand(-0.15, 0.15),
      alpha: rand(0.15, 0.5),
      alphaDir: rand(0.002, 0.005),
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,162,74,${p.alpha})`;
        ctx.fill();

        p.y -= p.speedY;
        p.x += p.speedX;
        p.alpha += p.alphaDir;
        if (p.alpha > 0.55 || p.alpha < 0.1) p.alphaDir *= -1;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = rand(0, canvas.width); }
        if (p.x < -5 || p.x > canvas.width + 5) p.x = rand(0, canvas.width);
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export default GoldParticles;
