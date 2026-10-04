import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import ProductCard from '../ProductCard/ProductCard';
import './ProductCarouselSection.css';

/**
 * ProductCarouselSection — Reusable horizontal product carousel
 * Props:
 *   title       — Section heading (e.g. "Featured Products")
 *   fetchFn     — async function that returns array of normalized products
 *   viewAllLink — link for "View All" button (default: /shop)
 *   limit       — max products to show (default: 10)
 *   id          — unique section id for accessibility
 *   lightBg     — if true, uses light background styling
 */
export default function ProductCarouselSection({
  title = 'Featured Products',
  fetchFn,
  viewAllLink = '/shop',
  limit = 10,
  id = 'product-carousel',
  lightBg = false,
}) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

    return () => { cancelled = true; };
  }, [fetchFn, limit, title]);

  const updateScrollButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

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
  }, [products]);

  const scroll = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.editorial-product-card')?.offsetWidth || 280;
    const gap = 20;
    const scrollAmount = (cardWidth + gap) * 2;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  if (!isLoading && products.length === 0) return null;

  return (
    <section className={`product-carousel-section ${lightBg ? 'carousel-light' : ''}`} id={id}>
      <div className="container-editorial">
        {/* Section Header */}
        <div className="carousel-section-header">
          <h2 className="carousel-section-title">{title}</h2>

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

        {/* Product Track */}
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
          <div className="carousel-track" ref={trackRef}>
            {products.map((prod) => (
              <div key={prod.id} className="carousel-card-wrapper">
                <ProductCard {...prod} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
