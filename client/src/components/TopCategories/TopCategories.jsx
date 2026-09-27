import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import './TopCategories.css';

const CATEGORIES = [
  {
    id: 'sunglasses',
    title: 'Sunglasses',
    subtitle: 'UV400 Polarized & Gradient Caustics',
    count: '12 Silhouettes',
    badge: 'Iconic',
    image: '/images/amber-aviator.png',
    link: '/shop?category=sunglasses',
  },
  {
    id: 'prescription-glasses',
    title: 'Optical / Eyeglasses',
    subtitle: 'Single Vision, Progressive & Titanium Wireframes',
    count: '16 Silhouettes',
    badge: 'Essential',
    image: '/images/hero-glasses.png',
    link: '/shop?category=prescription-glasses',
  },
  {
    id: 'blue-light-glasses',
    title: 'Blue Light Glasses',
    subtitle: 'Screen-Safe Precision & Zero Discoloration',
    count: '8 Silhouettes',
    badge: 'Workspace',
    image: '/images/blue-aviator.png',
    link: '/shop?category=blue-light-glasses',
  },
  {
    id: 'statement',
    title: 'Statement & Avant-Garde',
    subtitle: 'Sculptural Metal Contours & Sapphire Tints',
    count: '6 Silhouettes',
    badge: 'Editorial',
    image: '/images/heart-sunglasses.png',
    link: '/shop?shape=Statement',
  },
  {
    id: 'men',
    title: 'Men’s Architecture',
    subtitle: 'Structured Navigators & Monobloc Pure Titanium',
    count: '14 Silhouettes',
    badge: 'Structured',
    image: '/images/amber-aviator.png',
    link: '/shop?category=sunglasses',
  },
  {
    id: 'women',
    title: 'Women’s Atelier',
    subtitle: 'Sculptural Curves, Cat-Eye & Graceful Temples',
    count: '14 Silhouettes',
    badge: 'Curated',
    image: '/images/lifestyle-model.png',
    link: '/shop?category=sunglasses',
  },
];

export default function TopCategories() {
  return (
    <section className="top-categories-section" id="top-categories">
      <div className="container-editorial">
        {/* Section Header */}
        <div className="top-categories-header">
          <div className="top-categories-intro">
            <span className="editorial-eyebrow">CURATED TAXONOMY</span>
            <h2 className="editorial-section-title top-categories-title">
              TOP CATEGORIES
            </h2>
            <p className="editorial-body top-categories-desc">
              Discover handcrafted silhouettes engineered for optical clarity,
              ergonomic balance, and distinct personal character.
            </p>
          </div>

          <div className="top-categories-view-all">
            <Link to="/shop" className="btn-editorial-outline" id="categories-view-catalog">
              <span>View All Frames</span>
              <HiArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="top-categories-grid">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="top-category-card"
              id={`top-cat-${cat.id}`}
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
                <span className="top-category-badge">{cat.badge}</span>
              </div>

              {/* Card Meta */}
              <div className="top-category-body">
                <div className="top-category-top-row">
                  <span className="top-category-index">{`0${index + 1}`}</span>
                  <span className="top-category-count">{cat.count}</span>
                </div>

                <h3 className="top-category-card-title">{cat.title}</h3>
                <p className="top-category-card-sub">{cat.subtitle}</p>

                <div className="top-category-action-link">
                  <span className="action-link-text">Explore Silhouettes</span>
                  <span className="action-link-icon">
                    <HiArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
