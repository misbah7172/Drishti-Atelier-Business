import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import ProductCard from '../ProductCard/ProductCard';
import { fetchFeaturedProducts } from '../../services/productService';
import './BestSellingProducts.css';

export default function BestSellingProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchFeaturedProducts()
      .then((data) => {
        if (!cancelled) setProducts(data.slice(0, 8));
      })
      .catch((err) => console.error('Featured products error:', err))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Don't render section if no products loaded and not loading
  if (!isLoading && products.length === 0) return null;

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

        {/* Best Sellers Grid */}
        {isLoading ? (
          <div className="best-sellers-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="product-skeleton">
                <div className="skeleton-image shimmer" style={{ aspectRatio: '3/4', background: 'linear-gradient(90deg,#1a1a1a 25%,#2a2a2a 50%,#1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.8s ease-in-out infinite', borderRadius: '4px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.75rem' }}>
                  <div style={{ height: '10px', width: '40%', background: '#1a1a1a', borderRadius: '3px' }} />
                  <div style={{ height: '14px', width: '70%', background: '#1a1a1a', borderRadius: '3px' }} />
                  <div style={{ height: '10px', width: '50%', background: '#1a1a1a', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="best-sellers-grid">
            {products.map((prod) => (
              <ProductCard key={prod.id} {...prod} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
