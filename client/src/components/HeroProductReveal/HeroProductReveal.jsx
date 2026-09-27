import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineArrowDown } from 'react-icons/hi2';
import './HeroProductReveal.css';

export default function HeroProductReveal() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    const handleMouseMove = (e) => {
      // Subtle desktop parallax (reduced to 12px max for understated luxury feel)
      if (window.innerWidth < 1024) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      setMouseOffset({ x, y });
    };

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToNext = () => {
    const section = document.getElementById('fullscreen-moment') || document.getElementById('explorer-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroRef} className={`hero-editorial ${mounted ? 'hero-mounted' : ''}`} id="hero-section">
      {/* Background Architectural Canvas */}
      <div className="hero-editorial-backdrop" aria-hidden="true" />

      <div className="container-editorial hero-editorial-grid">
        {/* Top Eyebrow Tag */}
        <div className="hero-eyebrow-wrapper">
          <span className="editorial-eyebrow">
            Collection 2026 — Titanium Architecture
          </span>
          <span className="hero-archive-badge">Archive 01</span>
        </div>

        {/* Massive Editorial Headline */}
        <div className="hero-headline-block">
          <h1 className="editorial-hero-title">
            <span className="hero-title-line line-1">FRAMES</span>
            <span className="hero-title-line line-2">DESIGNED</span>
            <span className="hero-title-line line-3">FOR YOU.</span>
          </h1>
        </div>

        {/* Central Hero Product Visual Stage */}
        <div
          className="hero-product-stage"
          style={{
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          }}
        >
          <div className="hero-image-frame">
            <img
              src="/images/hero-glasses.png"
              alt="Drishti Atelier Studio Glasses with Optical Caustics"
              className="hero-product-image"
              loading="eager"
            />
          </div>

          {/* Micro Specification Badges */}
          <div className="hero-spec-pill spec-left">
            <span className="spec-dot" />
            <span className="spec-text">Grade-5 Titanium</span>
          </div>

          <div className="hero-spec-pill spec-right">
            <span className="spec-dot" />
            <span className="spec-text">Anti-Reflective Caustics</span>
          </div>
        </div>

        {/* Narrative Statement & Action Bar */}
        <div className="hero-bottom-bar">
          <div className="hero-subtext-block">
            <p className="editorial-body hero-subtext">
              Sculpted with surgical restraint. Every curve engineered to balance weight,
              crystalline optical clarity, and individual human character.
            </p>
          </div>

          <div className="hero-actions-cluster">
            <Link to="/shop" className="btn-editorial" id="hero-shop-collection">
              <span>Explore Collection</span>
              <HiArrowRight size={16} className="btn-arrow" />
            </Link>

            <button
              type="button"
              onClick={scrollToNext}
              className="btn-editorial-outline"
              id="hero-discover-craft"
            >
              <span>The Craft</span>
              <HiOutlineArrowDown size={15} />
            </button>
          </div>
        </div>

        {/* Minimalist Scroll Cue */}
        <div className="hero-scroll-cue" onClick={scrollToNext} role="button" tabIndex={0}>
          <span className="scroll-cue-label">Scroll to Explore</span>
          <div className="scroll-cue-line">
            <div className="scroll-cue-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
