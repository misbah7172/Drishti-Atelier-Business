import { Link } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineHome } from 'react-icons/hi2';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container not-found-content">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-tagline">The frame you seek is not in our collection</p>
        <p className="not-found-desc">
          The page you're looking for doesn't exist or has been moved. Let us guide you back to our curated collection.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary" id="not-found-home">
            <HiOutlineHome size={18} />
            Back Home
          </Link>
          <Link to="/shop" className="btn btn-outline" id="not-found-shop">
            <HiOutlineShoppingBag size={18} />
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
