import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiCheck,
  HiArrowRight,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiChevronDown,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProductById, PRODUCTS } from '../../services/productData';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id);

  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Default');
  const [isAdded, setIsAdded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('engineering');
  const [prevId, setPrevId] = useState(id);

  if (prevId !== id) {
    setPrevId(id);
    setActiveAngleIndex(0);
    setSelectedColor(product.colors[0]?.name || 'Default');
  }

  // Scroll to top whenever ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const activeAngle = product.gallery[activeAngleIndex] || product.gallery[0];

  const handleAddToBag = () => {
    setIsAdded(true);
    toast.success(`Added ${product.name} (${selectedColor}) to your bag`, {
      style: {
        background: '#070707',
        color: '#ffffff',
        border: '1px solid #222222',
        fontFamily: 'var(--font-heading)',
        letterSpacing: '0.08em',
      },
      iconTheme: {
        primary: '#F97D01',
        secondary: '#050505',
      },
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

  // Related products (exclude current)
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="product-detail-page" id="product-detail-view">
      {/* Breadcrumb Navigation */}
      <nav className="detail-breadcrumb container-editorial" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Atelier</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/shop" className="breadcrumb-link">Archive</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to={`/shop?category=${product.category}`} className="breadcrumb-link">
          {product.categoryLabel}
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      {/* Main Showcase Stage (Hero Gallery + Sticky Purchasing Rail) */}
      <main className="detail-main-layout container-editorial">
        {/* Left: Expansive Editorial Visual Gallery */}
        <div className="detail-gallery-stage">
          {/* Main Visual Display */}
          <div className="detail-hero-canvas">
            {product.badge && <span className="detail-badge">{product.badge}</span>}
            <img
              src={activeAngle.src}
              alt={`${product.name} - ${activeAngle.label}`}
              className="detail-hero-image"
              key={activeAngle.src}
            />
            <div className="detail-canvas-caption">
              <span className="caption-label">{activeAngle.label}</span>
              <span className="caption-text">{activeAngle.caption}</span>
            </div>
          </div>

          {/* Perspective Angle Switcher Pills */}
          <div className="detail-angle-tabs" role="tablist">
            {product.gallery.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeAngleIndex === idx}
                className={`angle-tab-btn ${activeAngleIndex === idx ? 'tab-active' : ''}`}
                onClick={() => setActiveAngleIndex(idx)}
              >
                <span className="tab-idx">0{idx + 1}</span>
                <span className="tab-label">{item.label}</span>
              </button>
            ))}
          </div>

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
                <span className="rail-price">${product.price} USD</span>
                {product.comparePrice && (
                  <span className="rail-compare-price">${product.comparePrice} USD</span>
                )}
                <span className="rail-shipping-badge">Complimentary Global Courier</span>
              </div>
            </div>

            <p className="rail-description">{product.description}</p>

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
                <span className="metric-lbl">TOTAL WEIGHT</span>
                <span className="metric-val">{product.weight}</span>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">LENS WIDTH</span>
                <span className="metric-val">{product.lensWidth}</span>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">BRIDGE</span>
                <span className="metric-val">{product.bridgeWidth}</span>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">TEMPLE</span>
                <span className="metric-val">{product.templeLength}</span>
              </div>
            </div>

            {/* Actions Cluster */}
            <div className="rail-actions-cluster">
              <button
                type="button"
                onClick={handleAddToBag}
                className="btn-editorial btn-lg rail-add-btn"
                id="product-add-to-bag"
              >
                {isAdded ? (
                  <>
                    <HiCheck size={18} />
                    <span>Added to Atelier Bag</span>
                  </>
                ) : (
                  <>
                    <HiOutlineShoppingBag size={18} />
                    <span>Add to Bag — ${product.price}</span>
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
              {/* Engineering Specs Accordion */}
              <div className="accordion-item">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => setOpenAccordion(openAccordion === 'engineering' ? '' : 'engineering')}
                  aria-expanded={openAccordion === 'engineering'}
                >
                  <span>Architectural Engineering</span>
                  <HiChevronDown
                    size={18}
                    className={`accordion-chevron ${openAccordion === 'engineering' ? 'chevron-open' : ''}`}
                  />
                </button>
                {openAccordion === 'engineering' && (
                  <div className="accordion-content">
                    <ul className="specs-feature-list">
                      {product.features.map((feat, i) => (
                        <li key={i} className="specs-feature-item">
                          <span className="feature-dot" />
                          <span>{feat}</span>
                        </li>
                      ))}
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
            </div>
          </div>
        </aside>
      </main>

      {/* Curated Related Archive Editions */}
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
    </div>
  );
}
