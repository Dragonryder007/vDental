import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../utils/gsap';

/**
 * ScrollReveal — GSAP scroll-triggered entrance animation.
 * Safe: no repeat:-1, no infinite tweens, clearProps cleans up after.
 *
 * Props:
 *   direction  'up' | 'down' | 'left' | 'right' | 'fade'  (default: 'up')
 *   delay      seconds                                      (default: 0)
 *   duration   seconds                                      (default: 0.7)
 *   distance   pixels                                       (default: 36)
 *   stagger    bool — animate direct children separately    (default: false)
 *   staggerDelay seconds between children                   (default: 0.12)
 *   className  extra classes on wrapper div
 */
const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 36,
  stagger = false,
  staggerDelay = 0.12,
  className = '',
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? Array.from(el.children) : [el];
    if (!targets.length) return;

    const from = {
      opacity: 0,
      y: direction === 'up'    ?  distance
       : direction === 'down'  ? -distance : 0,
      x: direction === 'left'  ?  distance
       : direction === 'right' ? -distance : 0,
    };

    // Set initial state immediately so there's no flash
    gsap.set(targets, from);

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        ease: 'power3.out',
        stagger: stagger ? staggerDelay : 0,
        clearProps: 'all',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [direction, delay, duration, distance, stagger, staggerDelay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;

