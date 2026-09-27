import { useState, useEffect, useRef, useCallback } from 'react';
import './CinematicGlassesIntro.css';

// Guard: resets on browser page load/refresh,
// prevents replaying on SPA client-side route changes.
let clientNavHasPlayed = false;

/**
 * @typedef {Object} CinematicGlassesIntroProps
 * @property {() => void} [onComplete] - Callback fired when intro animation finishes and unmounts.
 * @property {boolean} [forcePlay=false] - If true, forces the intro to play.
 * @property {boolean} [playOncePerSession=false] - If true, remembers in sessionStorage.
 * @property {string} [sessionKey='drishti_cinematic_intro_seen']
 * @property {boolean} [skipEnabled=true]
 */

export default function CinematicGlassesIntro({
  onComplete,
  forcePlay = false,
  playOncePerSession = false,
  sessionKey = 'drishti_cinematic_intro_seen',
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

  const [reducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    } catch {
      return false;
    }
  });

  // Phases: 'black' (0–0.5s) | 'sweep' (0.5–2.5s) | 'darkness' (2.5–3.0s) | 'exit' (3.0s+) | 'done'
  const [animationPhase, setAnimationPhase] = useState('black');

  const containerRef = useRef(null);
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
    setAnimationPhase('exit');

    if (playOncePerSession && typeof window !== 'undefined' && sessionKey) {
      try {
        sessionStorage.setItem(sessionKey, 'true');
      } catch {
        // Ignore storage errors in private mode
      }
    }

    // 600ms smooth dissolve fade-out before unmounting
    addTimer(() => {
      setAnimationPhase('done');
      setShouldRender(false);
      if (onComplete) onComplete();
    }, 600);
  }, [clearAllTimers, addTimer, playOncePerSession, sessionKey, onComplete]);

  // Main Choreographed Sequence
  useEffect(() => {
    if (!shouldRender) {
      if (onComplete) onComplete();
      return;
    }

    if (reducedMotion) {
      // Reduced motion: simple short fade
      addTimer(() => triggerExit(), 1000);
      return;
    }

    // TIMING:
    // 0.0s – 0.5s: Glasses almost completely invisible in darkness
    // 0.5s – 2.5s: Exactly ONE smooth LEFT → RIGHT studio-light sweep across the upper frame
    // 2.5s – 3.0s: Reflection disappears, glasses return to black
    // 3.0s+: Smooth transition to actual homepage
    addTimer(() => {
      setAnimationPhase('sweep');
    }, 500);

    addTimer(() => {
      setAnimationPhase('darkness');
    }, 2500);

    addTimer(() => {
      triggerExit();
    }, 3000);

    return () => {
      clearAllTimers();
    };
  }, [shouldRender, reducedMotion, onComplete, triggerExit, addTimer, clearAllTimers]);

  // Keyboard navigation: Escape or Space to skip immediately
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
      setAnimationPhase('black');
      setShouldRender(true);

      addTimer(() => setAnimationPhase('sweep'), 500);
      addTimer(() => setAnimationPhase('darkness'), 2500);
      addTimer(() => triggerExit(), 3000);
    };

    window.addEventListener('drishti:replay-intro', handleReplayEvent);
    window.replayCinematicIntro = () => {
      window.dispatchEvent(new CustomEvent('drishti:replay-intro'));
    };

    return () => {
      window.removeEventListener('drishti:replay-intro', handleReplayEvent);
    };
  }, [clearAllTimers, triggerExit, addTimer]);

  if (!shouldRender || animationPhase === 'done') {
    return null;
  }

  const isSweeping = animationPhase === 'sweep';
  const isExit = animationPhase === 'exit';

  return (
    <aside
      ref={containerRef}
      className={`cinematic-intro-root ${isExit ? 'intro-exiting' : ''}`}
      aria-label="Drishti Cinematic Intro"
      role="dialog"
      aria-modal="true"
    >
      {/* Background layer: Pure Absolute Black (#000000) */}
      <div className="cinematic-intro-bg" />

      {/* Main Eyeglasses Stage */}
      <div className={`cinematic-glasses-stage ${isExit ? 'stage-exit' : ''}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1536 1024"
          className="cinematic-glasses-svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Studio Softbox Reflection Beam Gradient:
                Simulates a narrow photographic softbox reflection.
                A thin, realistic silver-white specular core with soft falloff */}
            <linearGradient id="studioSoftboxBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="28%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="42%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="49%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="51%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="58%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="72%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Mask of the Upper Metallic Frame Geometry:
                Only the upper lens rims, brow bar, bridge, and hinges catch light.
                The lenses and lower frame are completely excluded, remaining pure black */}
            <mask id="upperGlassesFrameMask">
              <g stroke="#ffffff" fill="none" strokeLinecap="round">
                {/* Brow Bar */}
                <path
                  d="M 454,447 C 575,429 681,423 800,423 C 919,423 1025,429 1146,447"
                  strokeWidth="8"
                />
                <path
                  d="M 456,442 C 578,424 684,418 800,418 C 916,418 1022,424 1144,442"
                  strokeWidth="3.5"
                />

                {/* Left Lens Upper Rim */}
                <path
                  d="M 91,610 C 120,535 205,472 315,456 C 423,440 516,459 590,520 C 641,562 673,615 694,682"
                  strokeWidth="6"
                />
                <path
                  d="M 94,607 C 126,532 207,479 313,462 C 423,445 514,463 585,522"
                  strokeWidth="3.5"
                />

                {/* Bridge & Arch */}
                <path
                  d="M 590,520 C 622,533 650,553 676,579 C 690,593 700,606 711,621 C 740,581 769,559 800,559 C 831,559 860,581 889,621 C 900,606 910,593 924,579 C 950,553 978,533 1010,520"
                  strokeWidth="7"
                  strokeLinejoin="round"
                />
                <path
                  d="M 711,621 C 738,585 768,566 800,566 C 832,566 862,585 889,621"
                  strokeWidth="3.5"
                />

                {/* Right Lens Upper Rim */}
                <path
                  d="M 842,682 C 863,615 895,562 946,520 C 1020,459 1113,440 1221,456 C 1331,472 1416,535 1445,610"
                  strokeWidth="6"
                />
                <path
                  d="M 951,522 C 1022,463 1113,445 1223,462 C 1329,479 1410,532 1442,607"
                  strokeWidth="3.5"
                />

                {/* Left & Right End Pieces & Hinges */}
                <path d="M 91,610 L 35,606" strokeWidth="5" />
                <path d="M 35,606 L 18,602" strokeWidth="3.5" />
                <ellipse cx="35" cy="602" rx="9" ry="5" strokeWidth="2.5" />

                <path d="M 1445,610 L 1501,606" strokeWidth="5" />
                <path d="M 1501,606 L 1518,602" strokeWidth="3.5" />
                <ellipse cx="1501" cy="602" rx="9" ry="5" strokeWidth="2.5" />
              </g>
            </mask>
          </defs>

          {/* LAYER 1: Ultra-Faint Baseline Frame (Almost completely black/invisible against pure black) */}
          <g className="glasses-faint-baseline" fill="none" stroke="#1c1c1c" strokeLinecap="round">
            {/* Subtle silhouette so metal presence is authentic */}
            <path
              d="M 456,442 C 578,424 684,418 800,418 C 916,418 1022,424 1144,442"
              strokeWidth="2.5"
            />
            <path
              d="M 91,610 C 120,535 205,472 315,456 C 423,440 516,459 590,520 C 641,562 673,615 694,682"
              strokeWidth="2.5"
            />
            <path
              d="M 842,682 C 863,615 895,562 946,520 C 1020,459 1113,440 1221,456 C 1331,472 1416,535 1445,610"
              strokeWidth="2.5"
            />
            <path
              d="M 711,621 C 738,585 768,566 800,566 C 832,566 862,585 889,621"
              strokeWidth="2"
            />
          </g>

          {/* LAYER 2: Exactly ONE Single Studio-Light Sweep (0.5s – 2.5s)
              A narrow, physical studio softbox light beam that sweeps across from LEFT to RIGHT.
              Masked strictly to the upper frame geometry.
              Behind the beam, the metal returns immediately to near-black. */}
          <g mask="url(#upperGlassesFrameMask)">
            {isSweeping && (
              <rect
                className="studio-light-sweep-beam"
                x="-400"
                y="350"
                width="380"
                height="400"
                fill="url(#studioSoftboxBeam)"
              />
            )}
          </g>
        </svg>
      </div>

      {/* Subtle Minimal Skip Control */}
      {skipEnabled && (
        <button
          type="button"
          onClick={triggerExit}
          className="cinematic-skip-btn"
          aria-label="Skip introductory animation"
        >
          <span className="skip-btn-label">Skip</span>
          <span className="skip-btn-line" />
        </button>
      )}
    </aside>
  );
}
