import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiCheck,
  HiArrowRight,
  HiArrowLeft,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { fetchProductByIdOrSlug, fetchProducts } from '../../services/productService';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Product state
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('details');

  // Touch / Drag slider state
  const [dragStartX, setDragStartX] = useState(null);
  const [dragCurrentX, setDragCurrentX] = useState(null);

  const handleNextImage = () => {
    if (!product?.gallery?.length) return;
    setActiveAngleIndex((prev) => (prev + 1) % product.gallery.length);
  };

  const handlePrevImage = () => {
    if (!product?.gallery?.length) return;
    setActiveAngleIndex((prev) => (prev - 1 + product.gallery.length) % product.gallery.length);
  };

  const onTouchStart = (e) => {
    setDragStartX(e.touches[0].clientX);
    setDragCurrentX(null);
  };

  const onTouchMove = (e) => {
    setDragCurrentX(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (dragStartX !== null && dragCurrentX !== null) {
      const diff = dragStartX - dragCurrentX;
      if (diff > 45) {
        handleNextImage();
      } else if (diff < -45) {
        handlePrevImage();
      }
    }
    setDragStartX(null);
    setDragCurrentX(null);
  };

  const onMouseDown = (e) => {
    if (e.button === 0 && !e.target.closest('.detail-slide-arrow')) {
      setDragStartX(e.clientX);
      setDragCurrentX(null);
    }
  };

  const onMouseMove = (e) => {
    if (dragStartX !== null) {
      setDragCurrentX(e.clientX);
    }
  };

  const onMouseUp = () => {
    if (dragStartX !== null && dragCurrentX !== null) {
      const diff = dragStartX - dragCurrentX;
      if (diff > 45) {
        handleNextImage();
      } else if (diff < -45) {
        handlePrevImage();
      }
    }
    setDragStartX(null);
    setDragCurrentX(null);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevImage();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextImage();
    }
  };

  // Fetch product when ID changes
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setActiveAngleIndex(0);

    async function loadProduct() {
      try {
        const data = await fetchProductByIdOrSlug(id);
        if (cancelled) return;
        setProduct(data);
        setSelectedColor(data.colors[0]?.name || 'Default');

        // Fetch related products from same category
        try {
          const relatedResult = await fetchProducts({
            category: data.category,
            limit: 4,
          });
          if (!cancelled) {
            setRelated(relatedResult.products.filter((p) => p.id !== data.id).slice(0, 3));
          }
        } catch {
          // Related products are non-critical
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to load this product. It may have been removed.');
          console.error('Product fetch error:', err);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Handlers
  const handleAddToBag = () => {
    if (!product) return;
    setIsAdded(true);
    toast.success(`Added ${product.name} (${selectedColor}) to your bag`, {
      style: {
        background: '#070707',
        color: '#ffffff',
        border: '1px solid #222222',
        fontFamily: 'var(--font-heading)',
        letterSpacing: '0.08em',
      },
      iconTheme: { primary: '#F97D01', secondary: '#050505' },
    });
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleToggleWishlist = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast('Saved to your Atelier archive', {
        icon: '🖤',
        style: {
          background: '#070707',
          color: '#ffffff',
          border: '1px solid #222222',
        },
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="product-detail-page" id="product-detail-view">
        <div className="detail-loading container-editorial">
          <div className="detail-loading-layout">
            <div className="detail-loading-gallery">
              <div className="skeleton-image-large shimmer" />
              <div className="skeleton-tabs">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton-tab shimmer" />
                ))}
              </div>
            </div>
            <div className="detail-loading-rail">
              <div className="skeleton-line skeleton-short shimmer" />
              <div className="skeleton-line skeleton-title shimmer" />
              <div className="skeleton-line skeleton-medium shimmer" />
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line skeleton-medium shimmer" />
              <div className="skeleton-btn shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="product-detail-page" id="product-detail-view">
        <div className="detail-error container-editorial">
          <span className="editorial-eyebrow">Product Not Found</span>
          <h2 className="empty-title">THIS EDITION IS UNAVAILABLE</h2>
          <p className="editorial-body empty-desc">
            {error || 'The product you are looking for could not be found.'}
          </p>
          <Link to="/shop" className="btn-editorial">
            <span>Return to Archive</span>
            <HiArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Discount percentage
  const discountPercent =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null;

  return (
    <div className="product-detail-page" id="product-detail-view">
      {/* Breadcrumb Navigation with Return Action */}
      <nav className="detail-breadcrumb container-editorial" aria-label="Breadcrumb">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="detail-back-button"
          title="Return to previous location in list"
        >
          <HiArrowLeft size={14} />
          <span>Back</span>
        </button>
        <span className="breadcrumb-separator" style={{ opacity: 0.3 }}>|</span>
        <Link to="/" className="breadcrumb-link">Atelier</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/shop" className="breadcrumb-link">Archive</Link>
        <span className="breadcrumb-separator">/</span>
        {product.categoryLabel && (
          <>
            <Link to={`/shop?category=${product.category}`} className="breadcrumb-link">
              {product.categoryLabel}
            </Link>
            <span className="breadcrumb-separator">/</span>
          </>
        )}
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      {/* Main Showcase Stage (Hero Gallery + Sticky Purchasing Rail) */}
      <main className="detail-main-layout container-editorial">
        {/* Left: Expansive Editorial Visual Gallery */}
        <div className="detail-gallery-stage">
          {/* Main Visual Display (Sliding Edge-to-Edge Canvas without padding) */}
          <div
            className="detail-hero-canvas"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            aria-label="Product Image Carousel. Use left/right arrows or swipe to change images."
          >
            {product.badge && <span className="detail-badge">{product.badge}</span>}
            {discountPercent && (
              <span className="detail-discount-badge">-{discountPercent}%</span>
            )}

            {/* Sliding Carousel Track */}
            <div
              className="detail-slider-track"
              style={{ transform: `translateX(-${activeAngleIndex * 100}%)` }}
            >
              {product.gallery.map((item, idx) => (
                <div key={item.id || idx} className="detail-slider-slide">
                  <img
                    src={item.src}
                    alt={`${product.name} - ${item.label}`}
                    className="detail-hero-image"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {/* Slide Navigation Arrows (visible when more than 1 image) */}
            {product.gallery.length > 1 && (
              <>
                <button
                  type="button"
                  className="detail-slide-arrow detail-slide-prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  aria-label="Previous image"
                >
                  <HiChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="detail-slide-arrow detail-slide-next"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  aria-label="Next image"
                >
                  <HiChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {/* Small Image Thumbnail Cards under the primary image */}
          {product.gallery.length > 1 && (
            <div className="detail-gallery-thumbs" role="tablist" aria-label="Product image gallery thumbnails">
              {product.gallery.map((item, idx) => (
                <button
                  key={item.id || idx}
                  type="button"
                  role="tab"
                  aria-selected={activeAngleIndex === idx}
                  className={`detail-thumb-card ${activeAngleIndex === idx ? 'thumb-active' : ''}`}
                  onClick={() => setActiveAngleIndex(idx)}
                  title={`${item.label} — click to view`}
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="detail-thumb-img"
                    loading="lazy"
                  />
                  <div className="detail-thumb-badge">{idx + 1}</div>
                </button>
              ))}
            </div>
          )}

          {/* Editorial Macro Story Callout */}
          <div className="detail-macro-callout">
            <span className="editorial-eyebrow">Optical Clarity & Surface Finish</span>
            <h3 className="macro-callout-title">
              CRAFTED WITH JAPANESE <br />
              AEROSPACE TOLERANCES.
            </h3>
            <p className="editorial-body macro-callout-desc">
              Every Drishti Atelier titanium frame undergoes 72 hours of microscopic ceramic
              tumbling, followed by master hand-buffing of its satin bevels. The resulting
              reflection provides deep optical caustics under changing environmental light.
            </p>
          </div>
        </div>

        {/* Right: Sticky Purchasing & Spec Rail */}
        <aside className="detail-info-rail">
          <div className="rail-sticky-wrapper">
            <div className="rail-header">
              <span className="rail-code">{product.code}</span>
              <h1 className="rail-title">{product.name}</h1>
              <div className="rail-price-row">
                <span className="rail-price">৳{product.price}</span>
                {product.comparePrice && (
                  <span className="rail-compare-price">৳{product.comparePrice}</span>
                )}
                <span className="rail-shipping-badge">Complimentary Global Courier</span>
              </div>
            </div>

            <p className="rail-description">
              {product.description || product.shortDescription || 'Precision-crafted eyewear from our atelier archive.'}
            </p>

            {/* Colorway Selection */}
            <div className="rail-color-section">
              <div className="rail-section-header">
                <span className="section-label">FINISH / COLORWAY</span>
                <span className="selected-color-name">{selectedColor}</span>
              </div>
              <div className="rail-color-swatches" role="radiogroup" aria-label="Frame colors">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    role="radio"
                    aria-checked={selectedColor === c.name}
                    className={`rail-swatch-btn ${selectedColor === c.name ? 'swatch-active' : ''}`}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                  >
                    <span className="swatch-color-circle" style={{ backgroundColor: c.hex }} />
                    <span className="swatch-tooltip">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Architectural Metrics Bar */}
            <div className="rail-metrics-grid">
              <div className="metric-box">
                <span className="metric-lbl">MATERIAL</span>
                <span className="metric-val">{product.material}</span>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">SHAPE</span>
                <span className="metric-val">{product.shape}</span>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">SIZE</span>
                <span className="metric-val">{product.size}</span>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">BRAND</span>
                <span className="metric-val">{product.brand}</span>
              </div>
            </div>

            {/* Stock indicator */}
            {product.stock > 0 && product.stock <= 10 && (
              <div className="rail-stock-alert">
                Only {product.stock} left in stock
              </div>
            )}

            {/* Actions Cluster */}
            <div className="rail-actions-cluster">
              <button
                type="button"
                onClick={handleAddToBag}
                className="btn-editorial btn-lg rail-add-btn"
                id="product-add-to-bag"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? (
                  <span>Out of Stock</span>
                ) : isAdded ? (
                  <>
                    <HiCheck size={18} />
                    <span>Added to Atelier Bag</span>
                  </>
                ) : (
                  <>
                    <HiOutlineShoppingBag size={18} />
                    <span>Add to Bag — ৳{product.price}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`rail-wishlist-toggle ${isSaved ? 'saved' : ''}`}
                aria-label="Save frame to archive"
              >
                <HiOutlineHeart size={20} />
              </button>
            </div>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="rail-rating">
                <span className="rating-stars">{'★'.repeat(Math.round(product.averageRating))}</span>
                <span className="rating-text">
                  {product.averageRating} ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="rail-tags">
                {product.tags.map((tag) => (
                  <Link key={tag.id} to={`/shop?tag=${tag.slug}`} className="product-tag">
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Guarantees */}
            <div className="rail-guarantees">
              <div className="guarantee-row">
                <HiOutlineShieldCheck size={18} className="guarantee-icon" />
                <span>30-Day Complimentary Home Fit Trial</span>
              </div>
              <div className="guarantee-row">
                <HiOutlineSparkles size={18} className="guarantee-icon" />
                <span>Lifetime Structural Atelier Warranty on Monobloc Hinges</span>
              </div>
            </div>

            {/* Expandable Accordions */}
            <div className="rail-accordions">
              {/* Product Details Accordion */}
              <div className="accordion-item">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
                  aria-expanded={openAccordion === 'details'}
                >
                  <span>Product Details</span>
                  <HiChevronDown
                    size={18}
                    className={`accordion-chevron ${openAccordion === 'details' ? 'chevron-open' : ''}`}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div className="accordion-content">
                    <ul className="specs-feature-list">
                      <li className="specs-feature-item">
                        <span className="feature-dot" />
                        <span>Frame Material: {product.material}</span>
                      </li>
                      <li className="specs-feature-item">
                        <span className="feature-dot" />
                        <span>Frame Shape: {product.shape}</span>
                      </li>
                      <li className="specs-feature-item">
                        <span className="feature-dot" />
                        <span>Color: {product.colors.map((c) => c.name).join(', ')}</span>
                      </li>
                      <li className="specs-feature-item">
                        <span className="feature-dot" />
                        <span>Gender: {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}</span>
                      </li>
                      <li className="specs-feature-item">
                        <span className="feature-dot" />
                        <span>Size: {product.size}</span>
                      </li>
                      <li className="specs-feature-item">
                        <span className="feature-dot" />
                        <span>Brand: {product.brand}</span>
                      </li>
                      {product.sku && (
                        <li className="specs-feature-item">
                          <span className="feature-dot" />
                          <span>SKU: {product.sku}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Delivery & Care Accordion */}
              <div className="accordion-item">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => setOpenAccordion(openAccordion === 'delivery' ? '' : 'delivery')}
                  aria-expanded={openAccordion === 'delivery'}
                >
                  <span>Delivery & Fitting Consultation</span>
                  <HiChevronDown
                    size={18}
                    className={`accordion-chevron ${openAccordion === 'delivery' ? 'chevron-open' : ''}`}
                  />
                </button>
                {openAccordion === 'delivery' && (
                  <div className="accordion-content">
                    <p className="editorial-body text-sm">
                      Each piece is hand-calibrated in our atelier prior to dispatch.
                      Arrives in our bespoke matte black hardcase with microfiber cleaning
                      cloth and numbered certificate of craftsmanship.
                    </p>
                  </div>
                )}
              </div>

              {/* Reviews Accordion */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="accordion-item">
                  <button
                    type="button"
                    className="accordion-trigger"
                    onClick={() => setOpenAccordion(openAccordion === 'reviews' ? '' : 'reviews')}
                    aria-expanded={openAccordion === 'reviews'}
                  >
                    <span>Customer Reviews ({product.reviewCount})</span>
                    <HiChevronDown
                      size={18}
                      className={`accordion-chevron ${openAccordion === 'reviews' ? 'chevron-open' : ''}`}
                    />
                  </button>
                  {openAccordion === 'reviews' && (
                    <div className="accordion-content">
                      <div className="reviews-list">
                        {product.reviews.map((review) => (
                          <div key={review.id} className="review-item">
                            <div className="review-header">
                              <span className="review-author">{review.user_name}</span>
                              <span className="review-stars">{'★'.repeat(review.rating)}</span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <span className="review-date">
                              {new Date(review.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* Curated Related Archive Editions */}
      {related.length > 0 && (
        <section className="detail-related-section container-editorial">
          <div className="related-header">
            <div>
              <span className="editorial-eyebrow">Alternative Silhouettes</span>
              <h2 className="editorial-section-title">
                CURATED <span className="text-muted-editorial">EDITIONS.</span>
              </h2>
            </div>
            <Link to="/shop" className="btn-editorial-outline">
              <span>Explore All Frames</span>
              <HiArrowRight size={16} />
            </Link>
          </div>

          <div className="related-products-grid">
            {related.map((prod) => (
              <ProductCard key={prod.id} {...prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
