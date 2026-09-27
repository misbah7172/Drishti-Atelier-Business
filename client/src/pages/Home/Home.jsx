import { Link } from 'react-router-dom';
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineArrowPath,
  HiOutlineStar,
  HiOutlineSparkles,
  HiOutlineEye,
  HiArrowRight,
} from 'react-icons/hi2';
import './Home.css';

const categories = [
  { name: 'Sunglasses', icon: '🕶️', slug: 'sunglasses' },
  { name: 'Prescription', icon: '👓', slug: 'prescription-glasses' },
  { name: 'Blue Light', icon: '💙', slug: 'blue-light-glasses' },
  { name: "Men's", icon: '🧔', slug: 'men' },
  { name: "Women's", icon: '👩', slug: 'women' },
  { name: 'Kids', icon: '🧒', slug: 'kids' },
];

const features = [
  {
    icon: <HiOutlineShieldCheck size={28} />,
    title: 'Premium Quality',
    desc: 'Every frame crafted with precision and built to last.',
  },
  {
    icon: <HiOutlineTruck size={28} />,
    title: 'Fast Delivery',
    desc: 'Quick nationwide shipping right to your doorstep.',
  },
  {
    icon: <HiOutlineArrowPath size={28} />,
    title: 'Easy Returns',
    desc: 'Hassle-free returns within 30 days of purchase.',
  },
  {
    icon: <HiOutlineStar size={28} />,
    title: 'Top Rated',
    desc: 'Loved by thousands of satisfied customers.',
  },
];

const testimonials = [
  {
    name: 'Arif Rahman',
    text: 'Best eyewear shopping experience ever. The quality exceeded my expectations!',
    rating: 5,
  },
  {
    name: 'Fatima Akter',
    text: 'Stylish frames at amazing prices. Will definitely order again.',
    rating: 5,
  },
  {
    name: 'Kazi Hasan',
    text: 'Fast delivery and excellent customer service. Highly recommended!',
    rating: 4,
  },
];

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-pattern" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-text animate-slide-up">
            <span className="hero-badge badge badge-neon">
              <HiOutlineSparkles size={14} />
              New Collection 2026
            </span>
            <h1 className="hero-title">
              See the World <br />
              Through <span className="neon-text">Perfect Lenses</span>
            </h1>
            <p className="hero-subtitle">
              Discover premium eyewear crafted for clarity, comfort, and style.
              From sunglasses to prescription frames — find your perfect pair.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg" id="hero-shop-now">
                Shop Now
                <HiArrowRight size={18} />
              </Link>
              <Link to="/shop" className="btn btn-outline btn-lg" id="hero-explore">
                Explore Collection
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">500+</span>
                <span className="hero-stat-label">Premium Frames</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number">10K+</span>
                <span className="hero-stat-label">Happy Customers</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number">4.9</span>
                <span className="hero-stat-label">Average Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual animate-fade-in">
            <div className="hero-visual-card">
              <HiOutlineEye size={80} className="hero-eye-icon" />
              <p className="hero-visual-tag">Drishti</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section" id="categories-section">
        <div className="container">
          <h2 className="section-title text-center">Shop by Category</h2>
          <p className="section-subtitle text-center">
            Find the perfect eyewear for every occasion
          </p>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                to={`/shop?category=${cat.slug}`}
                className="category-card"
                key={cat.slug}
                id={`category-${cat.slug}`}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="section section-dark" id="featured-section">
        <div className="container">
          <div className="featured-header">
            <div>
              <h2 className="section-title">Featured Eyewear</h2>
              <p className="section-subtitle">Handpicked styles for you</p>
            </div>
            <Link to="/shop" className="btn btn-outline btn-sm">
              View All <HiArrowRight size={14} />
            </Link>
          </div>
          <div className="products-placeholder">
            {[1, 2, 3, 4].map((i) => (
              <div className="product-skeleton" key={i}>
                <div className="skeleton-image" />
                <div className="skeleton-text skeleton-text-lg" />
                <div className="skeleton-text skeleton-text-sm" />
                <div className="skeleton-text skeleton-text-md" />
              </div>
            ))}
          </div>
          <p className="placeholder-note">
            Products will appear here once the product system is built in Phase 4
          </p>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner" id="promo-section">
        <div className="container promo-content">
          <h2 className="promo-title">
            Get <span className="neon-text">20% Off</span> Your First Order
          </h2>
          <p className="promo-subtitle">
            Use code <strong>DRISHTI20</strong> at checkout. Limited time offer.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg" id="promo-cta">
            Shop Now <HiArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" id="features-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose Drishti</h2>
          <p className="section-subtitle text-center">
            We are committed to providing the best eyewear experience
          </p>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div className="feature-card card" key={i}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-dark" id="testimonials-section">
        <div className="container">
          <h2 className="section-title text-center">What Our Customers Say</h2>
          <p className="section-subtitle text-center">
            Real reviews from real customers
          </p>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card card" key={i}>
                <div className="testimonial-stars">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <HiOutlineStar
                      key={si}
                      size={16}
                      className={si < t.rating ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <p className="testimonial-author">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section newsletter-section" id="newsletter-section">
        <div className="container newsletter-content">
          <h2 className="section-title text-center">Join Our Newsletter</h2>
          <p className="section-subtitle text-center">
            Subscribe for exclusive offers, new arrivals, and eyewear tips.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="input newsletter-input"
              id="home-newsletter-email"
            />
            <button type="submit" className="btn btn-primary" id="home-newsletter-submit">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
