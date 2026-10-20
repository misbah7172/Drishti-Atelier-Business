import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const SCROLL_STORAGE_KEY_PREFIX = 'atelier_scroll_';

/**
 * ScrollRestorationManager
 * - When navigating to a new page (PUSH / REPLACE), resets scroll to top (0, 0).
 * - When going back/forward (POP), restores previous scroll position so the user
 *   keeps their exact place in the list when returning from product details.
 */
export default function ScrollRestorationManager() {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'POP' | 'PUSH' | 'REPLACE'
  const prevKeyRef = useRef(location.key);

  // Set manual scroll restoration on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Save current scroll position continuously on scroll
  useEffect(() => {
    const saveScroll = () => {
      try {
        const y = window.scrollY || document.documentElement.scrollTop;
        sessionStorage.setItem(`${SCROLL_STORAGE_KEY_PREFIX}${location.key}`, y.toString());
        sessionStorage.setItem(
          `${SCROLL_STORAGE_KEY_PREFIX}${location.pathname}${location.search}`,
          y.toString()
        );
      } catch {
        // Ignore storage errors
      }
    };

    window.addEventListener('scroll', saveScroll, { passive: true });
    return () => {
      // Save on unmount of current route
      saveScroll();
      window.removeEventListener('scroll', saveScroll);
    };
  }, [location.key, location.pathname, location.search]);

  // Adjust scroll when location changes
  useLayoutEffect(() => {
    if (navigationType === 'POP') {
      // User navigated back or forward — restore position
      const savedKey = sessionStorage.getItem(`${SCROLL_STORAGE_KEY_PREFIX}${location.key}`);
      const savedPath = sessionStorage.getItem(
        `${SCROLL_STORAGE_KEY_PREFIX}${location.pathname}${location.search}`
      );
      const targetY = savedKey ? parseInt(savedKey, 10) : savedPath ? parseInt(savedPath, 10) : 0;

      // Scroll immediately
      window.scrollTo(0, targetY);

      // Also trigger after micro-renders for dynamic async data
      const t1 = setTimeout(() => {
        window.scrollTo(0, targetY);
      }, 60);

      const t2 = setTimeout(() => {
        window.scrollTo(0, targetY);
      }, 250);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      // PUSH / REPLACE navigation to a new page — start cleanly from the top
      window.scrollTo(0, 0);
    }

    prevKeyRef.current = location.key;
  }, [location.key, location.pathname, location.search, navigationType]);

  return null;
}
