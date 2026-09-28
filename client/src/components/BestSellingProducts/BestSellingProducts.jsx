import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import ProductCard from '../ProductCard/ProductCard';
import { PRODUCTS } from '../../services/productData';
import './BestSellingProducts.css';

export default function BestSellingProducts() {
  // Curated best-selling silhouettes (top 4 or 8 products)
  const bestSellers = PRODUCTS.slice(0, 8);

  return (
    <section className="best-sellers-section" id="best-sellers">
      <div className="container-editorial">
        {/* Section Header */}
        <div className="best-sellers-header">
          <div className="best-sellers-intro">
            <span className="editorial-eyebrow">ARCHITECTURAL ICONS</span>
            <h2 className="editorial-section-title best-sellers-title">
              BEST SELLING PRODUCTS
            </h2>
            <p className="editorial-body best-sellers-desc">
              Explore our most celebrated Japanese titanium and handcrafted acetate silhouettes,
              engineered for anatomical balance, optical purity, and enduring presence.
            </p>
          </div>

          <div className="best-sellers-action">
            <Link to="/shop" className="btn-editorial-outline" id="best-sellers-view-all">
              <span>View All Silhouettes</span>
              <HiArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Best Sellers Grid: Minimum 2 Columns on Mobile, 4 Columns on Desktop */}
        <div className="best-sellers-grid">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} {...prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
