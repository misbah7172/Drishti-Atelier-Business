import { useState } from 'react';
import { Link } from 'react-router-dom';
import './TopCategories.css';

const CATEGORIES = [
  {
    id: 'eyeglasses',
    title: 'Eyeglasses',
    shortTitle: 'Eyeglasses',
    subtitle: 'Single Vision & Progressive Optics',
    count: '18 Silhouettes',
    badge: 'Prescription',
    image: '/images/banner-titanium.jpg',
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
    image: '/images/banner-sunglasses.jpg',
    link: '/shop?category=sunglasses',
    featured: true,
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
    image: '/images/banner-screen.jpg',
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
    image: '/images/banner-bespoke.jpg',
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
    image: '/images/banner-acetate.jpg',
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

const FILTERS = [
  { key: 'all', label: 'ALL' },
  { key: 'eyeglasses', label: 'EYEGLASSES' },
  { key: 'sunglasses', label: 'SUNGLASSES' },
  { key: 'blue-light-glasses', label: 'BLUE LIGHT' },
  { key: 'reading-glasses', label: 'READING' },
  { key: 'power-sunglasses', label: 'POWER SUN' },
];

export default function TopCategories() {
  const [activeFilter, setActiveFilter] = useState('all');

  const visibleCategories =
    activeFilter === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((cat) => cat.id === activeFilter);

  const isSingle = visibleCategories.length === 1;

  return (
    <section className="ed-categories-section" id="top-categories">
      <div className="ed-categories-container">
        {/* Section Header */}
        <header className="ed-categories-header">
          <span className="ed-categories-eyebrow">SHOP BY CATEGORY</span>
          <h2 className="ed-categories-heading">EXPLORE OUR COLLECTION</h2>
          <p className="ed-categories-subtitle">
            Discover eyewear designed for every perspective.
          </p>
        </header>

        {/* Filter Navigation */}
        <nav className="ed-categories-filters" aria-label="Category filters">
          {FILTERS.map((f, i) => (
            <span key={f.key} className="ed-filter-item-wrap">
              {i > 0 && <span className="ed-filter-dot" aria-hidden="true">·</span>}
              <button
                type="button"
                className={`ed-filter-btn ${activeFilter === f.key ? 'ed-filter-active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
                aria-pressed={activeFilter === f.key}
              >
                {f.label}
              </button>
            </span>
          ))}
        </nav>

        {/* Category Grid */}
        <div
          className={`ed-categories-grid ${isSingle ? 'ed-grid-single' : ''}`}
          role="list"
        >
          {visibleCategories.map((cat) => {
            const isFeatured = cat.featured && !isSingle;
            const tileIndex = CATEGORIES.indexOf(cat);
            const bgClass = tileIndex % 2 === 0 ? 'ed-tile-bg-primary' : 'ed-tile-bg-alt';

            return (
              <div
                key={cat.id}
                className={`ed-category-tile ${bgClass} ${isFeatured ? 'ed-tile-featured' : ''} ${isSingle ? 'ed-tile-single' : ''}`}
                role="listitem"
              >
                <Link to={cat.link} className="ed-tile-link">
                  <span className="ed-tile-name">{cat.shortTitle}</span>
                  <div className="ed-tile-image-wrap">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="ed-tile-image"
                      loading="lazy"
                    />
                  </div>
                  {isFeatured && (
                    <span className="ed-tile-explore">EXPLORE MORE</span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
