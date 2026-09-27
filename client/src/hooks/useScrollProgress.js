import { useState, useEffect } from 'react';

/**
 * useScrollProgress
 *
 * Lightweight, GPU-performant scroll progress tracker.
 * Calculates scroll position, percentage, and direction using requestAnimationFrame.
 * Zero external dependencies.
 */
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');

  useEffect(() => {
    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(currentScrollY / docHeight, 0), 1) : 0;

      setScrollY(currentScrollY);
      setScrollProgress(progress);
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollProgress, scrollY, scrollDirection };
}

export default useScrollProgress;
