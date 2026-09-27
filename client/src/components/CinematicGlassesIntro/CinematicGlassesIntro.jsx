import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CinematicGlassesIntro.css';

// In-memory guard: resets on actual browser page load/refresh,
// but prevents the intro from replaying during client-side SPA router navigation.
let clientNavHasPlayed = false;

/**
 * @typedef {Object} CinematicGlassesIntroProps
 * @property {() => void} [onComplete] - Callback fired when intro animation is fully finished and unmounted.
 * @property {boolean} [forcePlay=false] - If true, forces the intro to play.
 * @property {boolean} [playOncePerSession=false] - If true, remembers playback in sessionStorage for the browser session. Defaults to false so page refreshes show the intro, while client-side route changes never replay it.
 * @property {string} [sessionKey='drishti_cinematic_intro_seen'] - Session storage key if playOncePerSession is true.
 * @property {boolean} [skipEnabled=true] - Allows skipping via button or keyboard (Escape/Space/Enter).
 */

/**
 * CinematicGlassesIntro
 *
 * A luxury eyewear cinematic intro screen.
 * Displays thin metallic eyeglasses emerging from deep darkness with
 * precision-timed silver light sweeps that contour along the frame.
 *
 * Fully responsive, accessible (prefers-reduced-motion), Next.js SSR / React 19 safe,
 * and zero performance overhead after completion.
 *
 * @param {CinematicGlassesIntroProps} props
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

  const [animationPhase, setAnimationPhase] = useState('black'); // 'black' | 'sweep1' | 'reveal' | 'sweep2' | 'hold' | 'exit' | 'done'

  const containerRef = useRef(null);
  const timersRef = useRef([]);

  // Clear stale sessionStorage keys if playOncePerSession is disabled
  useEffect(() => {
    if (!playOncePerSession && typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(sessionKey);
      } catch {
        // Ignore
      }
    }
  }, [playOncePerSession, sessionKey]);

  // Clear pending timers helper
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  // Safe timeout helper
  const addTimer = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  // Exit transition handler
  const triggerExit = useCallback(() => {
    clientNavHasPlayed = true;
    clearAllTimers();
    setAnimationPhase('exit');

    // Mark as seen in session storage if enabled
    if (playOncePerSession && typeof window !== 'undefined' && sessionKey) {
      try {
        sessionStorage.setItem(sessionKey, 'true');
      } catch {
        // Ignore storage errors in private mode
      }
    }

    // Wait for the smooth CSS fade/scale out (850ms) before unmounting
    addTimer(() => {
      setAnimationPhase('done');
      setShouldRender(false);
      if (onComplete) {
        onComplete();
      }
    }, 850);
  }, [clearAllTimers, addTimer, playOncePerSession, sessionKey, onComplete]);

  // Run the sequence when shouldRender is active
  useEffect(() => {
    if (!shouldRender) {
      if (onComplete) onComplete();
      return;
    }

    if (reducedMotion) {
      // Reduced motion: gentle fade-in, brief hold, fade-out
      addTimer(() => setAnimationPhase('hold'), 200);
      addTimer(() => triggerExit(), 1600);
      return;
    }

    // Cinematic Timing Sequence:
    // 0.0s – 0.8s: Completely black / invisible glasses
    // 0.8s – 2.2s: First cinematic light sweep from left to right
    // 2.2s – 3.2s: Upper edges become subtly visible (main reveal)
    // 3.2s – 4.5s: Second slower metallic light sweep
    // 4.5s – 5.2s: Hold final minimal glasses silhouette
    // 5.2s+: Smooth homepage transition fade/scale

    addTimer(() => {
      setAnimationPhase('sweep1');
    }, 800);

    addTimer(() => {
      setAnimationPhase('reveal');
    }, 2200);

    addTimer(() => {
      setAnimationPhase('sweep2');
    }, 3200);

    addTimer(() => {
      setAnimationPhase('hold');
    }, 4500);

    addTimer(() => {
      triggerExit();
    }, 5200);

    return () => {
      clearAllTimers();
    };
  }, [shouldRender, reducedMotion, onComplete, triggerExit, addTimer, clearAllTimers]);

  // Keyboard navigation: Escape or Space to skip
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

  // Global event listener to allow manual replay from anywhere
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleReplayEvent = () => {
      clearAllTimers();
      setAnimationPhase('black');
      setShouldRender(true);

      addTimer(() => setAnimationPhase('sweep1'), 800);
      addTimer(() => setAnimationPhase('reveal'), 2200);
      addTimer(() => setAnimationPhase('sweep2'), 3200);
      addTimer(() => setAnimationPhase('hold'), 4500);
      addTimer(() => triggerExit(), 5200);
    };

    window.addEventListener('drishti:replay-intro', handleReplayEvent);
    // Expose convenient console helper
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

  const isSweep1 = animationPhase === 'sweep1';
  const isReveal = animationPhase === 'reveal';
  const isSweep2 = animationPhase === 'sweep2';
  const isHold = animationPhase === 'hold';
  const isExit = animationPhase === 'exit';

  // Has the base metallic silhouette emerged?
  const showBaseFrame = isReveal || isSweep2 || isHold || isExit || reducedMotion;

  return (
    <aside
      ref={containerRef}
      className={`cinematic-intro-root ${isExit ? 'intro-exiting' : ''}`}
      aria-label="Drishti Cinematic Intro"
      role="dialog"
      aria-modal="true"
    >
      {/* Background layer: Pure #000000 */}
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
            {/* Metallic core gradient */}
            <linearGradient id="drishtiMetalCore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#dedede" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#808080" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#222222" stopOpacity="0.05" />
            </linearGradient>

            {/* Specular edge highlight */}
            <linearGradient id="drishtiSpecHighlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="50%" stopColor="#f0f0f0" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#666666" stopOpacity="0.1" />
            </linearGradient>

            {/* Subtle soft silver gradient */}
            <linearGradient id="drishtiSilverSubtle" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#444444" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#dcdcdc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#444444" stopOpacity="0.3" />
            </linearGradient>

            {/* First Light Sweep: Narrow, high-intensity silver beam */}
            <linearGradient id="lightBeamGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="44%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="49%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="51%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="56%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Second Light Sweep: Slower, softer metallic sheen */}
            <linearGradient id="lightBeamGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="30%" stopColor="#d4d4d4" stopOpacity="0.15" />
              <stop offset="48%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="52%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#d4d4d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Vertical Darkness Falloff Mask:
                Keeps lenses completely dark and dissolves the lower frame
                into pure pitch blackness so only upper rims/bridge float */}
            <linearGradient id="darknessFalloffGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="56%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="68%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="78%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="88%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            <mask id="darknessFalloffMask">
              <rect x="0" y="0" width="1536" height="1024" fill="url(#darknessFalloffGrad)" />
            </mask>

            {/* Mask of the upper frame for the light sweep beam:
                Only the illuminated metallic geometry catches light */}
            <mask id="upperGlassesFrameMask">
              <g stroke="#ffffff" fill="none" strokeLinecap="round">
                {/* Brow bar */}
                <path
                  d="M 454,447 C 575,429 681,423 800,423 C 919,423 1025,429 1146,447"
                  strokeWidth="8"
                />
                <path
                  d="M 456,442 C 578,424 684,418 800,418 C 916,418 1022,424 1144,442"
                  strokeWidth="3.5"
                />

                {/* Left lens upper rim */}
                <path
                  d="M 91,610 C 120,535 205,472 315,456 C 423,440 516,459 590,520 C 641,562 673,615 694,682"
                  strokeWidth="6"
                />
                <path
                  d="M 94,607 C 126,532 207,479 313,462 C 423,445 514,463 585,522"
                  strokeWidth="3.5"
                />

                {/* Bridge */}
                <path
                  d="M 590,520 C 622,533 650,553 676,579 C 690,593 700,606 711,621 C 740,581 769,559 800,559 C 831,559 860,581 889,621 C 900,606 910,593 924,579 C 950,553 978,533 1010,520"
                  strokeWidth="7"
                  strokeLinejoin="round"
                />
                <path
                  d="M 711,621 C 738,585 768,566 800,566 C 832,566 862,585 889,621"
                  strokeWidth="3.5"
                />

                {/* Right lens upper rim */}
                <path
                  d="M 842,682 C 863,615 895,562 946,520 C 1020,459 1113,440 1221,456 C 1331,472 1416,535 1445,610"
                  strokeWidth="6"
                />
                <path
                  d="M 951,522 C 1022,463 1113,445 1223,462 C 1329,479 1410,532 1442,607"
                  strokeWidth="3.5"
                />

                {/* Left & Right hinges / end pieces */}
                <path d="M 91,610 L 35,606" strokeWidth="5" />
                <path d="M 35,606 L 18,602" strokeWidth="3.5" />
                <ellipse cx="35" cy="602" rx="9" ry="5" strokeWidth="2.5" />

                <path d="M 1445,610 L 1501,606" strokeWidth="5" />
                <path d="M 1501,606 L 1518,602" strokeWidth="3.5" />
                <ellipse cx="1501" cy="602" rx="9" ry="5" strokeWidth="2.5" />

                {/* Nose pads subtle top curve */}
                <path
                  d="M 705,655 C 692,674 688,702 695,724"
                  strokeWidth="3"
                />
                <path
                  d="M 895,655 C 908,674 912,702 905,724"
                  strokeWidth="3"
                />
              </g>
            </mask>

            {/* Subtle silver bloom filter for physical metallic glow */}
            <filter id="metallicSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ====================================================
              LAYER 1: Subtle Resting Base Frame (Floats in Darkness)
              Fades in during Phase 2 (Main Reveal) and remains locked
              until the transition to the homepage.
              ==================================================== */}
          <g
            className={`glasses-base-group ${showBaseFrame ? 'base-visible' : 'base-hidden'}`}
            mask="url(#darknessFalloffMask)"
          >
            {/* Top Brow Bar - Main metallic body */}
            <path
              d="M 454,447 C 575,429 681,423 800,423 C 919,423 1025,429 1146,447"
              fill="none"
              stroke="url(#drishtiMetalCore)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Brow Bar - Sharp upper reflection line */}
            <path
              d="M 456,442 C 578,424 684,418 800,418 C 916,418 1022,424 1144,442"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Left Lens Upper Rim */}
            <path
              d="M 91,610 C 120,535 205,472 315,456 C 423,440 516,459 590,520 C 641,562 673,615 694,682"
              fill="none"
              stroke="url(#drishtiMetalCore)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Left Lens Upper Contour Specular Line */}
            <path
              d="M 94,607 C 126,532 207,479 313,462 C 423,445 514,463 585,522"
              fill="none"
              stroke="#f5f5f5"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Bridge */}
            <path
              d="M 590,520 C 622,533 650,553 676,579 C 690,593 700,606 711,621 C 740,581 769,559 800,559 C 831,559 860,581 889,621 C 900,606 910,593 924,579 C 950,553 978,533 1010,520"
              fill="none"
              stroke="url(#drishtiMetalCore)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bridge Top Highlight */}
            <path
              d="M 711,621 C 738,585 768,566 800,566 C 832,566 862,585 889,621"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Right Lens Upper Rim */}
            <path
              d="M 842,682 C 863,615 895,562 946,520 C 1020,459 1113,440 1221,456 C 1331,472 1416,535 1445,610"
              fill="none"
              stroke="url(#drishtiMetalCore)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Right Lens Upper Contour Specular Line */}
            <path
              d="M 951,522 C 1022,463 1113,445 1223,462 C 1329,479 1410,532 1442,607"
              fill="none"
              stroke="#f5f5f5"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Left End Piece / Hinge */}
            <path
              d="M 91,610 L 35,606"
              fill="none"
              stroke="#d8d8d8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 35,606 L 18,602"
              fill="none"
              stroke="#808080"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <ellipse
              cx="35"
              cy="602"
              rx="9"
              ry="5"
              fill="none"
              stroke="#e4e4e4"
              strokeWidth="2"
            />

            {/* Right End Piece / Hinge */}
            <path
              d="M 1445,610 L 1501,606"
              fill="none"
              stroke="#d8d8d8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 1501,606 L 1518,602"
              fill="none"
              stroke="#808080"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <ellipse
              cx="1501"
              cy="602"
              rx="9"
              ry="5"
              fill="none"
              stroke="#e4e4e4"
              strokeWidth="2"
            />

            {/* Nose Pads - Minimal upper rim illumination */}
            <path
              d="M 705,655 C 692,674 688,702 695,724 C 701,743 712,751 721,741 C 730,730 731,704 724,682 C 719,665 713,654 705,655 Z"
              fill="none"
              stroke="#999999"
              strokeWidth="2.4"
              opacity="0.45"
            />
            <path
              d="M 895,655 C 908,674 912,702 905,724 C 899,743 888,751 879,741 C 870,730 869,704 876,682 C 881,665 887,654 895,655 Z"
              fill="none"
              stroke="#999999"
              strokeWidth="2.4"
              opacity="0.45"
            />

            {/* Lower Lens Rims - Fades softly into deep shadow via mask */}
            <path
              d="M 91,610 C 83,635 78,670 77,706 C 76,758 84,809 105,846 C 135,898 183,924 239,926 C 331,930 432,916 520,875 C 592,842 646,792 680,731"
              fill="none"
              stroke="#383838"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M 1445,610 C 1453,635 1458,670 1459,706 C 1460,758 1452,809 1431,846 C 1401,898 1353,924 1297,926 C 1205,930 1104,916 1016,875 C 944,842 890,792 856,731"
              fill="none"
              stroke="#383838"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.3"
            />
          </g>

          {/* ====================================================
              LAYER 2: Masked Physical Metallic Light Sweeps
              This layer is constrained strictly to the metallic
              upper frame geometry via #upperGlassesFrameMask.
              When the reflection beam passes over, only the frame
              illuminates, following its natural 3D curvature.
              ==================================================== */}
          <g mask="url(#upperGlassesFrameMask)" filter="url(#metallicSoftGlow)">
            {/* First Light Sweep Beam (0.8s – 2.2s): Left to Right */}
            {isSweep1 && (
              <rect
                className="sweep-beam-rect sweep-active-1"
                x="-500"
                y="360"
                width="480"
                height="380"
                fill="url(#lightBeamGradient1)"
              />
            )}

            {/* Second Light Sweep Beam (3.2s – 4.5s): Slower, softer metallic sheen */}
            {isSweep2 && (
              <rect
                className="sweep-beam-rect sweep-active-2"
                x="-600"
                y="360"
                width="650"
                height="380"
                fill="url(#lightBeamGradient2)"
              />
            )}
          </g>

          {/* ====================================================
              LAYER 3: Sequential Curvature Contour Glints
              Travels along the actual stroke paths of the frame
              during the first light sweep for realistic specularity.
              ==================================================== */}
          {isSweep1 && (
            <g className="contour-glints-group">
              {/* Left End Piece & Hinge Glint */}
              <path
                d="M 18,602 L 91,610"
                className="contour-glint glint-hinge-left"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Left Lens Upper Rim Contour Glint */}
              <path
                d="M 91,610 C 120,535 205,472 315,456 C 423,440 516,459 590,520 C 641,562 673,615 694,682"
                className="contour-glint glint-left-rim"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Brow Bar Contour Glint */}
              <path
                d="M 456,442 C 578,424 684,418 800,418 C 916,418 1022,424 1144,442"
                className="contour-glint glint-brow-bar"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Bridge Arch Contour Glint */}
              <path
                d="M 590,520 C 622,533 650,553 676,579 C 690,593 700,606 711,621 C 740,581 769,559 800,559 C 831,559 860,581 889,621 C 900,606 910,593 924,579 C 950,553 978,533 1010,520"
                className="contour-glint glint-bridge-arch"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Right Lens Upper Rim Contour Glint */}
              <path
                d="M 842,682 C 863,615 895,562 946,520 C 1020,459 1113,440 1221,456 C 1331,472 1416,535 1445,610"
                className="contour-glint glint-right-rim"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Right End Piece & Hinge Glint */}
              <path
                d="M 1445,610 L 1518,602"
                className="contour-glint glint-hinge-right"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          )}
        </svg>

        {/* "DRISHTI" Brand Name under the SVG */}
        <div
          className={`cinematic-brand-title ${
            showBaseFrame ? 'brand-title-visible' : 'brand-title-hidden'
          } ${isSweep2 ? 'sheen-active' : ''}`}
          aria-label="DRISHTI"
        >
          <span className="brand-title-text">DRISHTI</span>
        </div>
      </div>

      {/* Subtle Luxury Skip Control */}
      {skipEnabled && (
        <button
          type="button"
          onClick={triggerExit}
          className="cinematic-skip-btn"
          aria-label="Skip introductory animation"
        >
          <span className="skip-btn-label">Skip Intro</span>
          <span className="skip-btn-line" />
        </button>
      )}
    </aside>
  );
}
