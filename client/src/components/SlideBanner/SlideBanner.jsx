import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import './SlideBanner.css';

const BANNER_PRESETS = {
  categories: [
    {
      id: 'cat-slide-1',
      image: '/images/banner-titanium.jpg',
      alt: 'Drishti Atelier — Minimalist Japanese Beta Titanium Eyewear',
      link: '/shop?material=Titanium',
      title: 'Japanese Beta Titanium Eyewear',
    },
    {
      id: 'cat-slide-2',
      image: '/images/banner-sunglasses.jpg',
      alt: 'Drishti Atelier — Polarized Sunwear Collection',
      link: '/shop?category=sunglasses',
      title: 'Polarized Sunwear Collection',
    },
    {
      id: 'cat-slide-3',
      image: '/images/banner-screen.jpg',
      alt: 'Drishti Atelier — Blue Light Eyewear Digital Comfort',
      link: '/shop?category=blue-light-glasses',
      title: 'Blue Light Digital Eye-Shield',
    },
  ],
  anatomy: [
    {
      id: 'anatomy-slide-1',
      image: '/images/banner-bespoke.jpg',
      alt: 'Drishti Atelier — Bespoke Frame Anatomy & Tailored Architectural Fit',
      link: '/shop',
      title: 'Bespoke Frame Anatomy',
    },
    {
      id: 'anatomy-slide-2',
      image: '/images/banner-acetate.jpg',
      alt: 'Drishti Atelier — Sculpted Mazzucchelli Acetate Italian Artisanal Luxury',
      link: '/shop?material=Acetate',
      title: 'Sculpted Mazzucchelli Acetate',
    },
    {
      id: 'anatomy-slide-3',
      image: '/images/banner-titanium.jpg',
      alt: 'Drishti Atelier — Japanese Beta Titanium Minimalist Eyewear',
      link: '/shop?material=Titanium',
      title: 'Ultralight Titanium Architecture',
    },
  ],
  finale: [
    {
      id: 'finale-slide-1',
      image: '/images/banner-finale.jpg',
      alt: 'Drishti Atelier — The Signature Privilege & Complimentary Express Global Delivery',
      link: '/shop',
      title: 'The Signature Atelier Privilege',
    },
    {
      id: 'finale-slide-2',
      image: '/images/banner-sunglasses.jpg',
      alt: 'Drishti Atelier — Polarized Sunwear Collection',
      link: '/shop?badge=Limited+Run',
      title: 'Limited Edition Sunwear Archive',
    },
    {
      id: 'finale-slide-3',
      image: '/images/banner-acetate.jpg',
      alt: 'Drishti Atelier — Sculpted Mazzucchelli Acetate Luxury',
      link: '/shop?category=sunglasses',
      title: 'Handcrafted Atelier Series',
    },
  ],
  shop: [
    {
      id: 'shop-slide-1',
      image: '/images/banner-acetate.jpg',
      alt: 'Drishti Atelier — Sculpted Acetate Collection',
      link: '/shop?material=Acetate',
      title: 'Sculpted Acetate Eyewear Archive',
    },
    {
      id: 'shop-slide-2',
      image: '/images/banner-titanium.jpg',
      alt: 'Drishti Atelier — Minimalist Japanese Beta Titanium Eyewear',
      link: '/shop?material=Titanium',
      title: 'Japanese Beta Titanium Architecture',
    },
    {
      id: 'shop-slide-3',
      image: '/images/banner-sunglasses.jpg',
      alt: 'Drishti Atelier — Polarized Sunwear Collection',
      link: '/shop?category=sunglasses',
      title: 'Polarized Sunwear Collection',
    },
    {
      id: 'shop-slide-4',
      image: '/images/banner-screen.jpg',
      alt: 'Drishti Atelier — Blue Light Eye-Shield',
      link: '/shop?category=blue-light-glasses',
      title: 'Digital Eye-Shield Collection',
    },
  ],
};

export default function SlideBanner({
  id,
  ariaLabel = 'Editorial Slide Banner',
  preset = 'categories',
  slides: customSlides,
  autoPlayInterval = 5000,
  className = '',
}) {
  const slides = customSlides || BANNER_PRESETS[preset] || BANNER_PRESETS.categories;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Autoplay timer
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, slides.length, autoPlayInterval, nextSlide]);

  // Touch Swipe Handlers
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

  if (!slides || slides.length === 0) return null;

  return (
    <section
      className={`editorial-slide-banner-section ${className}`}
      id={id}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="editorial-slide-banner-container">
        <div
          className="editorial-slide-banner-frame"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sliding Track */}
          <div
            className="editorial-slide-banner-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => {
              const isCurrent = index === currentSlide;
              return (
                <Link
                  key={slide.id || index}
                  to={slide.link || '/shop'}
                  className="editorial-slide-banner-item"
                  aria-label={slide.title || slide.alt}
                  tabIndex={isCurrent ? 0 : -1}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt || slide.title || 'Drishti Eyewear Banner'}
                    className="editorial-slide-banner-img"
                    width="1500"
                    height="500"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                  />
                  <div className="editorial-slide-sheen" />
                </Link>
              );
            })}
          </div>

          {/* Navigation Arrows (rendered if more than 1 slide) */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                className="editorial-slide-arrow-btn prev"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous Slide"
              >
                <HiOutlineChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="editorial-slide-arrow-btn next"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next Slide"
              >
                <HiOutlineChevronRight size={20} />
              </button>
            </>
          )}

          {/* Bottom Pagination Dots */}
          {slides.length > 1 && (
            <div className="editorial-slide-pagination" role="tablist" aria-label="Slides">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === currentSlide}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title || 'Slide'}`}
                  className={`editorial-slide-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
