import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiArrowRight } from 'react-icons/hi2';
import './HeroSlidingBanner.css';

const HERO_SLIDES = [
  {
    id: 'hero-slide-1',
    image: '/images/hero-banner-1.jpg',
    badge: 'NEW COLLECTION 2026',
    title: 'Architectural Atelier Eyewear',
    subtitle: 'Precision minimalist silhouettes sculpted with timeless Japanese engineering.',
    ctaText: 'Explore Collection',
    link: '/shop?featured=true',
    alt: 'Drishti Atelier 2026 Minimalist Luxury Eyewear Collection',
  },
  {
    id: 'hero-slide-2',
    image: '/images/hero-banner-2.jpg',
    badge: 'FEATHERWEIGHT ENGINEERING',
    title: 'Japanese Beta-Titanium Architecture',
    subtitle: 'Under 12 grams of pure balance, flexible temples, and zero pressure points.',
    ctaText: 'Discover Titanium',
    link: '/shop?material=Titanium',
    alt: 'Japanese Beta Titanium Eyewear Craftsmanship',
  },
  {
    id: 'hero-slide-3',
    image: '/images/hero-banner-3.jpg',
    badge: 'MEDITERRANEAN ARCHIVE',
    title: 'Polarized Sunwear Collection',
    subtitle: 'UV400 high-clarity polarized optics crafted for golden sun and coastal escapes.',
    ctaText: 'Shop Sunwear',
    link: '/shop?category=sunglasses',
    alt: 'Polarized Luxury Sunglasses Mediterranean Resort',
  },
  {
    id: 'hero-slide-4',
    image: '/images/hero-banner-4.jpg',
    badge: 'HERITAGE ARTISANRY',
    title: 'Sculpted Mazzucchelli Bio-Acetate',
    subtitle: 'Warm tortoiseshell tones and hand-buffed plant-based Italian acetate frames.',
    ctaText: 'Shop Handcrafted Acetate',
    link: '/shop?material=Acetate',
    alt: 'Handcrafted Italian Tortoiseshell Acetate Eyewear',
  },
  {
    id: 'hero-slide-5',
    image: '/images/hero-banner-5.jpg',
    badge: 'DIGITAL EYE-SHIELD',
    title: 'Anti-Blue Light Vision Protection',
    subtitle: 'Sapphire multi-coated optics engineered to eliminate eye fatigue and screen glare.',
    ctaText: 'Explore Screen Glasses',
    link: '/shop?category=blue-light-glasses',
    alt: 'Digital Blue Light Blocking Screen Glasses',
  },
];

export default function HeroSlidingBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Autoplay every 5.5s, pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  return (
    <section
      className="hero-banner-section"
      id="hero-banner"
      aria-label="Hero Banner Carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="hero-banner-container">
        <div
          className="hero-banner-frame"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sliding Track */}
          <div
            className="hero-banner-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {HERO_SLIDES.map((slide, index) => {
              const isCurrent = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`hero-banner-slide ${isCurrent ? 'active' : ''}`}
                >
                  <Link
                    to={slide.link}
                    className="hero-banner-link"
                    tabIndex={isCurrent ? 0 : -1}
                    aria-label={`${slide.title} - ${slide.ctaText}`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="hero-banner-img"
                      width="1376"
                      height="768"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                    />

                    {/* Gradient overlay for readability */}
                    <div className="hero-banner-scrim" />

                    {/* Floating Glassmorphism Editorial Card */}
                    <div className="hero-banner-content-card">
                      <div className="hero-banner-badge-wrapper">
                        <span className="hero-banner-badge">{slide.badge}</span>
                      </div>
                      <h2 className="hero-banner-title">{slide.title}</h2>
                      <p className="hero-banner-sub">{slide.subtitle}</p>
                      <div className="hero-banner-cta-btn">
                        <span>{slide.ctaText}</span>
                        <HiArrowRight className="hero-banner-cta-icon" />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            className="hero-banner-arrow prev"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous Slide"
          >
            <HiOutlineChevronLeft size={22} />
          </button>
          <button
            type="button"
            className="hero-banner-arrow next"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next Slide"
          >
            <HiOutlineChevronRight size={22} />
          </button>

          {/* Editorial Counter & Progress */}
          <div className="hero-banner-meta">
            <span className="hero-banner-counter">
              <strong>0{currentSlide + 1}</strong>
              <span className="hero-banner-counter-sep">/</span>
              <span>0{HERO_SLIDES.length}</span>
            </span>
          </div>

          {/* Bottom Pagination Dots / Bars */}
          <div className="hero-banner-pagination" role="tablist" aria-label="Hero Slides">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={idx === currentSlide}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                className={`hero-banner-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToSlide(idx);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
