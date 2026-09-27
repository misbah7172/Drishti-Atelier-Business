import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import ProductCard from '../ProductCard/ProductCard';
import './EditorialCollections.css';

const sampleProducts = [
  {
    id: 1,
    name: 'Vapour Titanium Aviator',
    code: 'ATELIER 01 — SUN',
    price: 240,
    image: '/images/blue-aviator.png',
    hoverImage: '/images/amber-aviator.png',
    colors: ['#C0C0C0', '#D4AF37', '#1A1A1A'],
    badge: 'Iconic',
  },
  {
    id: 2,
    name: 'Amber Horizon Navigator',
    code: 'ATELIER 02 — SUN',
    price: 260,
    image: '/images/amber-aviator.png',
    hoverImage: '/images/blue-aviator.png',
    colors: ['#D4AF37', '#8B4513', '#1A1A1A'],
    badge: 'Limited Run',
  },
  {
    id: 3,
    name: 'Monolith Optical Wire',
    code: 'ATELIER 03 — OPTICAL',
    price: 210,
    image: '/images/hero-glasses.png',
    hoverImage: '/images/blue-aviator.png',
    colors: ['#050505', '#555555', '#C0C0C0'],
    badge: 'Best Seller',
  },
  {
    id: 4,
    name: 'Heart Contour Statement',
    code: 'ATELIER 04 — STATEMENT',
    price: 280,
    image: '/images/heart-sunglasses.png',
    hoverImage: '/images/amber-aviator.png',
    colors: ['#D4AF37', '#C0C0C0', '#FF69B4'],
    badge: 'Editorial Pick',
  },
];

export default function EditorialCollections() {
  return (
    <section className="collections-section" id="collections-section">
      <div className="container-editorial">
        {/* Editorial Section Header */}
        <div className="collections-header">
          <div>
            <span className="editorial-eyebrow">Curated Editions</span>
            <h2 className="editorial-section-title">
              ARCHITECTURAL <br />
              <span className="text-muted-editorial">COLLECTIONS.</span>
            </h2>
          </div>
          <Link to="/shop" className="btn-editorial-outline collections-view-all">
            <span>View All Editions</span>
            <HiArrowRight size={16} />
          </Link>
        </div>

        {/* Feature Hero Product Banner (Asymmetric Layout) */}
        <div className="collections-hero-feature">
          <div className="feature-content-side">
            <span className="feature-tag">Series 01 Highlight</span>
            <h3 className="feature-title">THE TITANIUM VAPOUR SERIES</h3>
            <p className="editorial-body feature-desc">
              Engineered with Japanese aerospace titanium wireframes. The iconic brow
              bridge balances visual weight and structural resistance for all-day comfort.
            </p>
            <div className="feature-actions">
              <Link to="/product/1" className="btn-editorial">
                <span>Discover Vapour</span>
                <HiArrowRight size={16} />
              </Link>
              <span className="feature-price">Starting at $240 USD</span>
            </div>
          </div>

          <div className="feature-visual-side">
            <img
              src="/images/blue-aviator.png"
              alt="Titanium Vapour Aviator"
              className="feature-image"
            />
          </div>
        </div>

        {/* Staggered Curated Grid */}
        <div className="collections-editorial-grid">
          {sampleProducts.map((prod) => (
            <ProductCard key={prod.id} {...prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
