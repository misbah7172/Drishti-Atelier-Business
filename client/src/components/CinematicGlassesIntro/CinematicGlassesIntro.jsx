import { useState, useEffect, useRef, useCallback } from 'react';
import './CinematicGlassesIntro.css';

// Guard: resets on browser page load/refresh,
// prevents replaying on SPA client-side route changes.
let clientNavHasPlayed = false;

/**
 * Drishti Logo Transition Intro Screen
 * Faithfully matches d:\Drishti\asstes\LoadingScreen\logo-transition.html
 * Total transition time strictly under 2 seconds (~1.7s total).
 */
export default function CinematicGlassesIntro({
  onComplete,
  forcePlay = false,
  playOncePerSession = false,
  sessionKey = 'drishti_intro_transition_seen',
  skipEnabled = true,
}) {
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (forcePlay) return true;
    if (clientNavHasPlayed) return false;
    if (playOncePerSession) {
      try {
        return sessionStorage.getItem(sessionKey) !== 'true';
      } catch {
        return true;
      }
    }
    return true;
  });

  const [isExiting, setIsExiting] = useState(false);
  const timersRef = useRef([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const triggerExit = useCallback(() => {
    clientNavHasPlayed = true;
    clearAllTimers();
    setIsExiting(true);

    if (playOncePerSession && typeof window !== 'undefined' && sessionKey) {
      try {
        sessionStorage.setItem(sessionKey, 'true');
      } catch {
        // Ignore private storage errors
      }
    }

    // 300ms smooth dissolve fade-out before unmounting (Total: ~1.7s < 2s)
    addTimer(() => {
      setShouldRender(false);
      if (onComplete) onComplete();
    }, 300);
  }, [clearAllTimers, addTimer, playOncePerSession, sessionKey, onComplete]);

  // Main Choreographed Sequence: Complete within 1.7s (< 2s)
  useEffect(() => {
    if (!shouldRender) {
      if (onComplete) onComplete();
      return;
    }

    // Logo animation duration is 1350ms (1.35s).
    // At 1400ms (1.4s), smoothly fade out the screen (300ms) to reveal the site at 1700ms (< 2s).
    addTimer(() => {
      triggerExit();
    }, 1400);

    return () => {
      clearAllTimers();
    };
  }, [shouldRender, onComplete, triggerExit, addTimer, clearAllTimers]);

  // Click or Keyboard navigation to skip immediately
  useEffect(() => {
    if (!shouldRender || !skipEnabled) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        triggerExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, skipEnabled, triggerExit]);

  // Manual replay event listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleReplayEvent = () => {
      clearAllTimers();
      setIsExiting(false);
      setShouldRender(true);
      addTimer(() => triggerExit(), 1400);
    };

    window.addEventListener('drishti:replay-intro', handleReplayEvent);
    window.replayCinematicIntro = () => {
      window.dispatchEvent(new CustomEvent('drishti:replay-intro'));
    };

    return () => {
      window.removeEventListener('drishti:replay-intro', handleReplayEvent);
    };
  }, [clearAllTimers, triggerExit, addTimer]);

  if (!shouldRender) {
    return null;
  }

  return (
    <aside
      className={`logo-intro-root ${isExiting ? 'intro-exiting' : ''}`}
      aria-label="Drishti Logo Transition"
      role="dialog"
      aria-modal="true"
      onClick={triggerExit}
    >
      <div className="logo-transition-stage">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 700 350"
          role="img"
          aria-label="Drishti Logo"
        >
          <defs>
            <linearGradient
              id="champagneGold"
              gradientUnits="userSpaceOnUse"
              x1="60"
              y1="44"
              x2="640"
              y2="282"
            >
              <stop offset="0%" stopColor="#FFF0B3" />
              <stop offset="35%" stopColor="#E7B84A" />
              <stop offset="65%" stopColor="#C88A1A" />
              <stop offset="100%" stopColor="#F6D77A" />
            </linearGradient>
          </defs>
          <g transform="translate(10 10)">
            {/* 3. Main stroke draws from the right until full logo is formed */}
            <path
              className="logo-transition-stroke"
              pathLength="1"
              fill="none"
              stroke="url(#champagneGold)"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M418 102 C442 74 476 60 512 60 C572 60 620 106 620 166 C620 226 572 270 512 270 C452 270 422 234 397 194 C384 172 370 152 352 152 C330 152 306 174 283 189 C246 213 206 264 150 264 C92 264 60 224 60 180 C60 130 100 94 150 94 C200 94 232 130 258 160 C270 174 290 180 308 170"
            />
            {/* 2. Arrow head follows from the circle */}
            <path
              className="logo-transition-arrow"
              fill="url(#champagneGold)"
              stroke="url(#champagneGold)"
              strokeWidth="3"
              strokeLinejoin="round"
              d="M497 177.5 L566 130 L507 188.5 Z"
            />
            {/* 1. Starting point: circle on right side appears first */}
            <circle
              className="logo-transition-dot"
              cx="502"
              cy="183"
              r="13"
              fill="url(#champagneGold)"
            />
          </g>
        </svg>
      </div>
    </aside>
  );
}
