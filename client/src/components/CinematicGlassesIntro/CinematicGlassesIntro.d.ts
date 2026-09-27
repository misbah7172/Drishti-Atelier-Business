import React from 'react';

export interface CinematicGlassesIntroProps {
  /**
   * Callback fired when the intro animation has completely finished and unmounted.
   */
  onComplete?: () => void;
  /**
   * If true, forces the intro animation to play.
   * Useful for testing or "Replay Intro" triggers.
   * @default false
   */
  forcePlay?: boolean;
  /**
   * If true, remembers playback in sessionStorage for the browser session.
   * Defaults to false so page refreshes show the intro, while client-side route changes never replay it.
   * @default false
   */
  playOncePerSession?: boolean;
  /**
   * Key used in sessionStorage if playOncePerSession is true.
   * @default 'drishti_cinematic_intro_seen'
   */
  sessionKey?: string;
  /**
   * Whether to display the subtle minimalist "Skip Intro" button and allow keyboard skip (Escape/Space/Enter).
   * @default true
   */
  skipEnabled?: boolean;
}

/**
 * CinematicGlassesIntro
 *
 * Premium luxury eyewear cinematic website loading/intro screen.
 * Displays thin metallic eyeglasses emerging from deep pitch-black darkness (#000000)
 * with precision silver light sweeps contouring across the upper frame.
 */
declare const CinematicGlassesIntro: React.FC<CinematicGlassesIntroProps>;

export default CinematicGlassesIntro;
