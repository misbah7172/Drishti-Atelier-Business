import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import ProductCard from '../ProductCard/ProductCard';
import './ProductCarouselSection.css';

/**
 * ProductCarouselSection — Reusable horizontal product carousel with Auto-Sliding,
 * Hover-Pause, and Smooth Desktop/Mobile Drag & Scroll.
 */
export default function ProductCarouselSection({
  title = 'Featured Products',
  fetchFn,
  viewAllLink = '/shop',
  limit = 10,
  id = 'product-carousel',
  lightBg = false,
  autoSlideInterval = 3800,
}) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse Drag-to-Scroll state for desktop
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasMoved = useRef(false);

  useEffect(() => {
    let cancelled = false;

    if (fetchFn) {
      fetchFn()
        .then((data) => {
          if (!cancelled) setProducts(Array.isArray(data) ? data.slice(0, limit) : []);
        })
        .catch((err) => console.error(`${title} fetch error:`, err))
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [fetchFn, limit, title]);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 15);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [products, updateScrollButtons]);

  // Scroll by step (1 or 2 cards)
  const scroll = useCallback((direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.carousel-card-wrapper');
    const cardWidth = card?.offsetWidth || 240;
    const gap = 16;
    const scrollAmount = cardWidth + gap;

    if (direction === 'right') {
      const isEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 20;
      if (isEnd) {
        // Loop back to the beginning
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      const isStart = el.scrollLeft <= 10;
      if (isStart) {
        el.scrollTo({ left: el.scrollWidth - el.clientWidth, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  }, []);

  // Auto sliding timer with hover pause
  useEffect(() => {
    if (isPaused || isLoading || products.length <= 1) return;

    const interval = setInterval(() => {
      scroll('right');
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [isPaused, isLoading, products.length, autoSlideInterval, scroll]);

  // Desktop Mouse Drag Handlers
  const handleMouseDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
    setIsPaused(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const el = trackRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Drag sensitivity
    if (Math.abs(walk) > 5) {
      hasMoved.current = true;
    }
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setTimeout(() => {
      hasMoved.current = false;
    }, 50);
  };

  // Convert mouse wheel vertically over track to horizontal scroll
  const handleWheel = (e) => {
    const el = trackRef.current;
    if (!el) return;
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      // User is scrolling vertical wheel
      el.scrollLeft += e.deltaY;
    }
  };

  if (!isLoading && products.length === 0) return null;

  return (
    <section
      className={`product-carousel-section ${lightBg ? 'carousel-light' : ''}`}
      id={id}
    >
      <div className="container-editorial">
        {/* Section Header */}
        <div className="carousel-section-header">
          <div className="carousel-title-group">
            <h2 className="carousel-section-title">{title}</h2>
            <span className="carousel-item-count">
              {products.length > 0 ? `${products.length} Designs` : ''}
            </span>
          </div>

          <div className="carousel-section-controls">
            <Link to={viewAllLink} className="carousel-view-all" id={`${id}-view-all`}>
              <span>View All</span>
              <HiArrowRight size={14} />
            </Link>

            <div className="carousel-nav-arrows">
              <button
                type="button"
                className={`carousel-arrow carousel-arrow-left ${!canScrollLeft ? 'arrow-disabled' : ''}`}
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
              >
                <HiChevronLeft size={18} />
              </button>
              <button
                type="button"
                className={`carousel-arrow carousel-arrow-right ${!canScrollRight ? 'arrow-disabled' : ''}`}
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
              >
                <HiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Track with Auto-Slide, Hover-Pause & Desktop/Mobile Scroll */}
        {isLoading ? (
          <div className="carousel-track" ref={trackRef}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="carousel-skeleton-card">
                <div className="skeleton-img shimmer" />
                <div className="skeleton-meta">
                  <div className="skeleton-line skeleton-line-sm" />
                  <div className="skeleton-line skeleton-line-md" />
                  <div className="skeleton-line skeleton-line-sm" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="carousel-track"
            ref={trackRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              handleMouseUp();
            }}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
          >
            {products.map((prod) => (
              <div
                key={prod.id}
                className="carousel-card-wrapper"
                onClickCapture={(e) => {
                  if (hasMoved.current) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <ProductCard {...prod} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
