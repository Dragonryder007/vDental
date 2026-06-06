import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../utils/gsap';

/**
 * CountUp — animates a number from 0 to `end` when scrolled into view.
 * Props:
 *   end:      target number
 *   suffix:   string appended after number (e.g. 'K+', '+', '★')
 *   prefix:   string prepended before number
 *   decimals: decimal places (default 0)
 *   duration: animation duration in seconds (default 2)
 */
const CountUp = ({ end, suffix = '', prefix = '', decimals = 0, duration = 2, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        value: end,
        duration,
        ease: 'power2.out',
        snap: decimals === 0 ? { value: 1 } : {},
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
        onUpdate() {
          const val = decimals > 0 ? obj.value.toFixed(decimals) : Math.round(obj.value);
          el.textContent = prefix + val + suffix;
        },
      });
    });

    return () => ctx.revert();
  }, [end, suffix, prefix, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
};

export default CountUp;

