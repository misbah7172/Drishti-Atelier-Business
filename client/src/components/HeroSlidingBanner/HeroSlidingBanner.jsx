import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineArrowDown } from 'react-icons/hi2';
import './HeroSlidingBanner.css';

const SLIDES = [
  {
    id: 1,
    tag: 'COLLECTION 2026 // SIGNATURE ARCHIVE',
    title: 'TITANIUM ARCHITECTURE',
    titleHighlight: 'SERIES 01',
    description:
      'Surgically engineered from cold-rolled Japanese beta titanium. Balanced 14.2g featherweight chassis with monobloc screwless hinges and crystal anti-reflective optics.',
    image: '/images/hero-glasses.png',
    alt: 'Drishti Titanium Architectural Glasses',
    specs: [
      { label: 'Japanese Grade-5 Titanium' },
      { label: '14.2g Featherweight' },
      { label: 'Monobloc Screwless Hinge' },
    ],
    primaryLink: '/shop',
    primaryText: 'Explore Collection',
    secondaryTarget: '#top-categories',
    secondaryText: 'Top Categories',
    badge: 'Archive 01',
  },
  {
    id: 2,
    tag: 'SUN ARCHIVE // UV400 POLARIZED',
    title: 'AMBER HORIZON',
    titleHighlight: 'NAVIGATOR',
    description:
      'Warm optical caustics paired with 24k gold wireframe geometry and hand-finished CR-39 amber gradient lenses. Engineered for elevated contrast in direct sunlight.',
    image: '/images/amber-aviator.png',
    alt: 'Drishti Amber Horizon Navigator Sunglasses',
    specs: [
      { label: 'CR-39 UV400 Polarized' },
      { label: 'Dual Brow Architecture' },
      { label: 'Gold Wireframe Finish' },
    ],
    primaryLink: '/shop?category=sunglasses',
    primaryText: 'Shop Sunglasses',
    secondaryTarget: '#shape-guide',
    secondaryText: 'Shape Guide',
    badge: 'Limited Run',
  },
  {
    id: 3,
    tag: 'ICONIC SILHOUETTE // OPTICAL CAUSTICS',
    title: 'VAPOUR TITANIUM',
    titleHighlight: 'AVIATOR',
    description:
      'Laser-cut from cold-rolled titanium alloy. The elevated brow bar provides dynamic torsional rigidity while capturing ambient light with dual optical caustics.',
    image: '/images/blue-aviator.png',
    alt: 'Drishti Vapour Titanium Aviator Glasses',
    specs: [
      { label: 'Dual Optical Caustics' },
      { label: '18.4g Balanced Center' },
      { label: 'Anti-Reflective Coating' },
    ],
    primaryLink: '/product/1',
    primaryText: 'Discover Vapour',
    secondaryTarget: '#top-categories',
    secondaryText: 'Browse Categories',
    badge: 'Iconic',
  },
  {
    id: 4,
    tag: 'WORKSPACE OPTICS // 42% FILTRATION',
    title: 'DIGITAL SHIELD PRO',
    titleHighlight: 'TITANIUM',
    description:
      'Engineered for long-duration screen work. Selective high-energy violet-blue filtration preserving true color fidelity without warm or yellow discoloration.',
    image: '/images/hero-glasses.png',
    alt: 'Drishti Digital Shield Pro Titanium Blue Light Glasses',
    specs: [
      { label: 'Selective Blue Shield' },
      { label: 'True-Color Transmission' },
      { label: 'Headset Ergonomics' },
    ],
    primaryLink: '/shop?category=blue-light-glasses',
    primaryText: 'Shop Blue Light',
    secondaryTarget: '#shape-guide',
    secondaryText: 'Find Your Shape',
    badge: 'Workspace',
  },
];

const AUTOPLAY_INTERVAL = 5500;

export default function HeroSlidingBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Autoplay management
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide, currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();

    setTouchStart(0);
    setTouchEnd(0);
  };

  const scrollToTarget = (targetId) => {
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="hero-slider-section"
      id="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured Eyewear Carousel"
    >
      {/* Background Architectural Canvas */}
      <div className="hero-slider-backdrop" aria-hidden="true" />

      {/* Main Slider Track */}
      <div className="hero-slider-viewport">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          const isPrev = index === (currentSlide - 1 + SLIDES.length) % SLIDES.length;
          const isNext = index === (currentSlide + 1) % SLIDES.length;

          let slideClass = 'hero-slide';
          if (isActive) slideClass += ' active-slide';
          else if (isPrev) slideClass += ' prev-slide';
          else if (isNext) slideClass += ' next-slide';
          else slideClass += ' hidden-slide';

          return (
            <article
              key={slide.id}
              className={slideClass}
              aria-hidden={!isActive}
            >
              <div className="container-editorial hero-slide-grid">
                {/* Left/Top Content Column */}
                <div className="hero-slide-content">
                  <div className="hero-slide-eyebrow">
                    <span className="editorial-eyebrow">{slide.tag}</span>
                    <span className="hero-slide-badge">{slide.badge}</span>
                  </div>

                  <h1 className="editorial-hero-title hero-slide-title">
                    <span className="slide-title-main">{slide.title}</span>
                    <span className="slide-title-accent">{slide.titleHighlight}</span>
                  </h1>

                  <p className="editorial-body hero-slide-desc">
                    {slide.description}
                  </p>

                  {/* Micro Specs List */}
                  <div className="hero-slide-specs">
                    {slide.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="hero-slide-spec-pill">
                        <span className="spec-dot" />
                        <span className="spec-label">{spec.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="hero-slide-actions">
                    <Link
                      to={slide.primaryLink}
                      className="btn-editorial"
                      id={`hero-slide-${slide.id}-primary`}
                    >
                      <span>{slide.primaryText}</span>
                      <HiArrowRight size={16} className="btn-arrow" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => scrollToTarget(slide.secondaryTarget)}
                      className="btn-editorial-outline"
                      id={`hero-slide-${slide.id}-secondary`}
                    >
                      <span>{slide.secondaryText}</span>
                      <HiOutlineArrowDown size={15} />
                    </button>
                  </div>
                </div>

                {/* Right/Center Visual Column */}
                <div className="hero-slide-visual">
                  <div className="hero-slide-image-card">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="hero-slide-image"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="hero-slide-light-sheen" />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Slider Controls Bar */}
      <div className="container-editorial hero-slider-controls-wrapper">
        {/* Navigation Arrows */}
        <div className="hero-slider-arrows">
          <button
            type="button"
            onClick={prevSlide}
            className="hero-slider-arrow-btn prev"
            aria-label="Previous slide"
            id="hero-slider-prev"
          >
            <HiOutlineChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="hero-slider-arrow-btn next"
            aria-label="Next slide"
            id="hero-slider-next"
          >
            <HiOutlineChevronRight size={18} />
          </button>
        </div>

        {/* Dynamic Pagination Bars */}
        <div className="hero-slider-pagination" role="tablist">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={idx === currentSlide}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              onClick={() => goToSlide(idx)}
              className={`hero-slider-dot ${idx === currentSlide ? 'active' : ''}`}
            >
              <span className="dot-index">{`0${idx + 1}`}</span>
              <span className="dot-track">
                <span
                  className="dot-fill"
                  style={{
                    animationDuration: `${AUTOPLAY_INTERVAL}ms`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                  }}
                />
              </span>
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="hero-slider-counter">
          <span className="counter-current">{`0${currentSlide + 1}`}</span>
          <span className="counter-sep">/</span>
          <span className="counter-total">{`0${SLIDES.length}`}</span>
        </div>
      </div>

      {/* Minimalist Bottom Scroll Cue */}
      <div
        className="hero-slider-scroll-cue"
        onClick={() => scrollToTarget('#top-categories')}
        role="button"
        tabIndex={0}
        aria-label="Scroll to top categories"
      >
        <span className="scroll-cue-label">Explore Taxonomy</span>
        <div className="scroll-cue-line">
          <div className="scroll-cue-pulse" />
        </div>
      </div>
    </section>
  );
}
