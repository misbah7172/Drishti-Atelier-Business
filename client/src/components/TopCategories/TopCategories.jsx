import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiChevronDown, HiChevronRight, HiXMark } from 'react-icons/hi2';
import './TopCategories.css';

const CATEGORIES = [
  {
    id: 'eyeglasses',
    title: 'Eyeglasses',
    shortTitle: 'Eyeglasses',
    subtitle: 'Single Vision & Progressive Optics',
    count: '18 Silhouettes',
    badge: 'Prescription',
    image: '/images/hero-glasses.png',
    link: '/shop?category=prescription-glasses',
    subcategories: [
      { label: 'Single Vision', link: '/shop?category=prescription-glasses&type=single-vision', desc: 'Distance or reading clarity' },
      { label: 'Progressive & Bifocal', link: '/shop?category=prescription-glasses&type=progressive', desc: 'Seamless multifocal transitions' },
      { label: 'Anti-Reflective Optics', link: '/shop?category=prescription-glasses&type=anti-reflective', desc: 'Glare & smudge-resistant coat' },
      { label: 'Zero Power / Clear', link: '/shop?category=prescription-glasses&type=zero-power', desc: 'Everyday aesthetic frames' },
      { label: 'Rimless & Wireframe', link: '/shop?category=prescription-glasses&material=Titanium', desc: 'Ultralight pure titanium' },
    ],
  },
  {
    id: 'sunglasses',
    title: 'Sunglasses',
    shortTitle: 'Sunglasses',
    subtitle: 'UV400 Polarized & Gradient Tints',
    count: '24 Silhouettes',
    badge: 'Sunwear',
    image: '/images/amber-aviator.png',
    link: '/shop?category=sunglasses',
    subcategories: [
      { label: 'Polarized Collection', link: '/shop?category=sunglasses&type=polarized', desc: '100% glare neutralization' },
      { label: 'UV400 Classic Aviators', link: '/shop?category=sunglasses&shape=Aviator', desc: 'Iconic tear-drop geometry' },
      { label: 'Gradient & Tinted', link: '/shop?category=sunglasses&type=gradient', desc: 'Editorial warm ombré optics' },
      { label: 'Mirrored Sport Lenses', link: '/shop?category=sunglasses&type=mirrored', desc: 'Reflective high protection' },
      { label: 'Handcrafted Acetate', link: '/shop?category=sunglasses&material=Acetate', desc: 'Bold sculptural volumes' },
    ],
  },
  {
    id: 'blue-light-glasses',
    title: 'Blue Light Glasses',
    shortTitle: 'Blue Light',
    subtitle: 'Digital Screen Anti-Fatigue Filters',
    count: '12 Silhouettes',
    badge: 'Workspace',
    image: '/images/blue-aviator.png',
    link: '/shop?category=blue-light-glasses',
    subcategories: [
      { label: 'Computer & Office Glasses', link: '/shop?category=blue-light-glasses&type=computer', desc: 'High-contrast desk comfort' },
      { label: 'Gaming Blue-Blockers', link: '/shop?category=blue-light-glasses&type=gaming', desc: 'Zero color distortion lenses' },
      { label: 'Sleep & Melatonin Shield', link: '/shop?category=blue-light-glasses&type=night', desc: 'Evening spectrum protection' },
      { label: 'Zero Power Eyewear', link: '/shop?category=blue-light-glasses&type=zero-power', desc: 'Non-prescription screen wear' },
      { label: 'Titanium Featherweight', link: '/shop?category=blue-light-glasses&material=Titanium', desc: 'All-day comfort without pressure' },
    ],
  },
  {
    id: 'reading-glasses',
    title: 'Reading Glasses',
    shortTitle: 'Reading',
    subtitle: 'Precision Magnification Powers',
    count: '10 Silhouettes',
    badge: 'Readers',
    image: '/images/dark-silhouette.png',
    link: '/shop?category=prescription-glasses&type=reading',
    subcategories: [
      { label: 'Low Power (+1.00 to +1.75)', link: '/shop?category=prescription-glasses&type=reading&power=low', desc: 'Subtle daily focal boost' },
      { label: 'Standard (+2.00 to +2.75)', link: '/shop?category=prescription-glasses&type=reading&power=mid', desc: 'Crystal close-up book focus' },
      { label: 'Compact Foldable Readers', link: '/shop?category=prescription-glasses&type=reading&format=foldable', desc: 'Pocket-ready portable frames' },
      { label: 'Blue-Shield Readers', link: '/shop?category=blue-light-glasses&type=reading', desc: 'Magnified e-reader protection' },
      { label: 'Wide-Field Rectangles', link: '/shop?category=prescription-glasses&shape=Rectangle', desc: 'Expansive horizontal field' },
    ],
  },
  {
    id: 'power-sunglasses',
    title: 'Power Sunglasses',
    shortTitle: 'Power Sun',
    subtitle: 'Prescription Sun & Photochromic',
    count: '15 Silhouettes',
    badge: 'Rx Sunwear',
    image: '/images/heart-sunglasses.png',
    link: '/shop?category=sunglasses&type=power',
    subcategories: [
      { label: 'Prescription Polarized', link: '/shop?category=sunglasses&type=rx-polarized', desc: 'Custom vision with sun cut' },
      { label: 'Photochromic Transitions', link: '/shop?category=prescription-glasses&type=photochromic', desc: 'Clear indoors, dark outside' },
      { label: 'Driving Contrast Tints', link: '/shop?category=sunglasses&type=driving', desc: 'Road caustics & clarity' },
      { label: 'High-Index Sun Optics', link: '/shop?category=sunglasses&type=high-index', desc: 'Slim profiles for high power' },
      { label: 'Gradient Prescription Tint', link: '/shop?category=sunglasses&type=rx-gradient', desc: 'Bespoke shading & sharp focus' },
    ],
  },
];

export default function TopCategories() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);
  const sectionRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setMobileActiveCategory(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleCategoryMobileClick = (catId, e) => {
    // On mobile screens, tap toggles the subcategory dropdown view
    if (window.innerWidth < 768) {
      if (mobileActiveCategory === catId) {
        setMobileActiveCategory(null);
      } else {
        e.preventDefault();
        setMobileActiveCategory(catId);
      }
    }
  };

  const getDropdownAlignmentClass = (index, total) => {
    if (index === 0) return 'dropdown-align-left';
    if (index === 1) return 'dropdown-align-left';
    if (index === total - 1) return 'dropdown-align-right';
    if (index === total - 2) return 'dropdown-align-right';
    return 'dropdown-align-center';
  };

  const activeMobileCat = CATEGORIES.find((c) => c.id === mobileActiveCategory);

  return (
    <section className="top-categories-section" id="top-categories" ref={sectionRef}>
      <div className="container-editorial">
        {/* Section Header */}
        <div className="top-categories-header">
          <div className="top-categories-intro">
            <span className="editorial-eyebrow">OPTICAL TAXONOMY</span>
            <h2 className="editorial-section-title top-categories-title">
              TOP CATEGORIES
            </h2>
          </div>

          <div className="top-categories-view-all">
            <Link to="/shop" className="btn-editorial-outline" id="categories-view-catalog">
              <span>View All Frames</span>
              <HiArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Categories Grid: 1 Row Desktop (5 columns), 5 In Row Mobile */}
        <div className="top-categories-grid">
          {CATEGORIES.map((cat, index) => {
            const isHovered = hoveredCategory === cat.id;
            const isMobileActive = mobileActiveCategory === cat.id;
            const alignClass = getDropdownAlignmentClass(index, CATEGORIES.length);

            return (
              <div
                key={cat.id}
                className={`top-category-wrapper ${alignClass} ${isHovered ? 'is-hovered' : ''} ${isMobileActive ? 'is-active' : ''}`}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Category Card */}
                <Link
                  to={cat.link}
                  className="top-category-card"
                  id={`top-cat-${cat.id}`}
                  onClick={(e) => handleCategoryMobileClick(cat.id, e)}
                  aria-expanded={isHovered || isMobileActive}
                  aria-haspopup="true"
                >
                  {/* Image Frame */}
                  <div className="top-category-image-wrap">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="top-category-image"
                      loading="lazy"
                    />
                    <div className="top-category-image-sheen" />
                  </div>

                  {/* Card Meta (Desktop & Tablet) */}
                  <div className="top-category-body">
                    <h3 className="top-category-card-title">{cat.title}</h3>

                    <div className="top-category-action-link">
                      <span className="action-link-text">Explore</span>
                      <span className="action-link-icon">
                        <HiChevronDown size={13} className="action-dropdown-icon" />
                      </span>
                    </div>
                  </div>

                  {/* Mobile Compact Label (5 in a row on mobile) */}
                  <div className="top-category-mobile-label">
                    <span className="mobile-cat-name">{cat.shortTitle}</span>
                    <span className="mobile-cat-indicator">▾</span>
                  </div>
                </Link>

                {/* Desktop Subcategory Dropdown (appears on mouse hover) */}
                <div
                  className={`top-category-dropdown ${alignClass} ${isHovered ? 'dropdown-visible' : ''}`}
                  role="menu"
                  aria-label={`${cat.title} Subcategories`}
                >
                  <div className="dropdown-header">
                    <div className="dropdown-header-top">
                      <span className="dropdown-eyebrow">COLLECTION</span>
                      <span className="dropdown-count-badge">{cat.count}</span>
                    </div>
                    <h4 className="dropdown-cat-title">{cat.title}</h4>
                  </div>

                  <ul className="dropdown-sub-list">
                    {cat.subcategories.map((sub, sIdx) => (
                      <li key={sIdx} className="dropdown-sub-item">
                        <Link
                          to={sub.link}
                          className="dropdown-sub-link"
                          onClick={() => {
                            setHoveredCategory(null);
                            setMobileActiveCategory(null);
                          }}
                        >
                          <div className="dropdown-sub-text">
                            <span className="dropdown-sub-label">{sub.label}</span>
                            <span className="dropdown-sub-desc">{sub.desc}</span>
                          </div>
                          <HiChevronRight size={13} className="dropdown-sub-arrow" />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="dropdown-footer">
                    <Link
                      to={cat.link}
                      className="dropdown-view-all"
                      onClick={() => {
                        setHoveredCategory(null);
                        setMobileActiveCategory(null);
                      }}
                    >
                      <span>Explore All {cat.title}</span>
                      <HiArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Subcategories Dropdown Panel (Below Row when tapped on mobile) */}
        {activeMobileCat && (
          <div className="top-categories-mobile-panel" id="mobile-subcategories-panel">
            <div className="mobile-panel-header">
              <div className="mobile-panel-info">
                <span className="mobile-panel-eyebrow">SUBCATEGORIES</span>
                <h4 className="mobile-panel-title">{activeMobileCat.title}</h4>
              </div>
              <button
                type="button"
                className="mobile-panel-close"
                onClick={() => setMobileActiveCategory(null)}
                aria-label="Close subcategories"
              >
                <HiXMark size={18} />
              </button>
            </div>

            <div className="mobile-panel-sub-list">
              {activeMobileCat.subcategories.map((sub, sIdx) => (
                <Link
                  key={sIdx}
                  to={sub.link}
                  className="mobile-panel-sub-link"
                  onClick={() => setMobileActiveCategory(null)}
                >
                  <div className="mobile-panel-sub-text">
                    <span className="mobile-panel-sub-label">{sub.label}</span>
                    <span className="mobile-panel-sub-desc">{sub.desc}</span>
                  </div>
                  <HiChevronRight size={14} className="mobile-panel-arrow" />
                </Link>
              ))}
            </div>

            <div className="mobile-panel-footer">
              <Link
                to={activeMobileCat.link}
                className="mobile-panel-view-all"
                onClick={() => setMobileActiveCategory(null)}
              >
                <span>View Full {activeMobileCat.title} Collection</span>
                <HiArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
