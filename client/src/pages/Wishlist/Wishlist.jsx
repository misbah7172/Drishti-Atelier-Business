import { Link } from 'react-router-dom';
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiArrowRight,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Wishlist.css';

export default function Wishlist() {
  const { items, isLoading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Guest users need to login to see full wishlist
  if (!isAuthenticated) {
    return (
      <div className="wishlist-page" id="wishlist-view">
        <div className="container-editorial wishlist-empty-state">
          <HiOutlineHeart size={56} className="empty-icon" />
          <span className="editorial-eyebrow">Your Atelier Archive</span>
          <h1 className="editorial-section-title empty-title">SIGN IN TO VIEW WISHLIST</h1>
          <p className="editorial-body empty-desc">
            Sign in to save and revisit your favourite architectural silhouettes.
          </p>
          <Link to="/login" className="btn-editorial">
            <span>Sign In</span>
            <HiArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wishlist-page" id="wishlist-view">
        <div className="container-editorial wishlist-loading">
          <div className="skeleton-line skeleton-title shimmer" />
          <div className="wishlist-skeleton-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="wishlist-skeleton-card">
                <div className="skeleton-image shimmer" style={{ aspectRatio: '3/4' }} />
                <div className="skeleton-line shimmer" style={{ marginTop: '0.75rem' }} />
                <div className="skeleton-line skeleton-short shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="wishlist-page" id="wishlist-view">
        <div className="container-editorial wishlist-empty-state">
          <HiOutlineHeart size={56} className="empty-icon" />
          <span className="editorial-eyebrow">Your Atelier Archive</span>
          <h1 className="editorial-section-title empty-title">YOUR WISHLIST IS EMPTY</h1>
          <p className="editorial-body empty-desc">
            Save your favourite architectural silhouettes to revisit later.
            Tap the heart icon on any product to begin curating your archive.
          </p>
          <Link to="/shop" className="btn-editorial">
            <span>Explore the Archive</span>
            <HiArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const handleRemove = async (productId, name) => {
    await toggleWishlist(productId);
    toast.success(`Removed ${name} from wishlist`, {
      style: { background: '#070707', color: '#fff', border: '1px solid #222' },
    });
  };

  const handleMoveToCart = async (item) => {
    const result = await addToCart({
      id: item.product_id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      stock: item.stock,
      image: item.image_url,
      brand: item.brand,
      frame_color: item.frame_color,
    });

    if (result.success) {
      await toggleWishlist(item.product_id);
      toast.success(`Moved ${item.name} to your bag`, {
        style: { background: '#070707', color: '#fff', border: '1px solid #222' },
        iconTheme: { primary: '#F97D01', secondary: '#050505' },
      });
    } else {
      toast.error(result.message || 'Could not add to cart', {
        style: { background: '#070707', color: '#fff', border: '1px solid #222' },
      });
    }
  };

  return (
    <div className="wishlist-page" id="wishlist-view">
      <header className="wishlist-header container-editorial">
        <span className="editorial-eyebrow">Your Atelier Archive</span>
        <h1 className="editorial-section-title wishlist-title">
          SAVED SILHOUETTES{' '}
          <span className="text-muted-editorial">({items.length})</span>
        </h1>
        <p className="editorial-body wishlist-desc">
          Your curated collection of architectural eyewear. Move pieces to your bag when you're ready.
        </p>
      </header>

      <div className="container-editorial">
        <div className="wishlist-grid">
          {items.map((item) => {
            const imgSrc = item.image_url || '/images/blue-aviator.png';
            const price = parseFloat(item.price) || 0;
            const comparePrice = item.compare_price ? parseFloat(item.compare_price) : null;
            const outOfStock = item.stock <= 0 || item.status !== 'active';

            return (
              <div key={item.wishlist_id} className={`wishlist-card ${outOfStock ? 'card-oos' : ''}`}>
                <Link to={`/product/${item.slug || item.product_id}`} className="wishlist-card-image-link">
                  <img src={imgSrc} alt={item.name} className="wishlist-card-image" loading="lazy" />
                  {outOfStock && <span className="wishlist-oos-badge">Out of Stock</span>}
                </Link>

                <div className="wishlist-card-info">
                  <Link to={`/product/${item.slug || item.product_id}`} className="wishlist-card-name">
                    {item.name}
                  </Link>
                  {item.brand && <span className="wishlist-card-brand">{item.brand}</span>}
                  <div className="wishlist-card-price-row">
                    <span className="wishlist-card-price">${price.toFixed(2)}</span>
                    {comparePrice && comparePrice > price && (
                      <span className="wishlist-card-compare">${comparePrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="wishlist-card-actions">
                    {!outOfStock && (
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(item)}
                        className="btn-editorial btn-sm wishlist-move-btn"
                      >
                        <HiOutlineShoppingBag size={15} />
                        <span>Move to Bag</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.product_id, item.name)}
                      className="wishlist-remove-btn"
                      aria-label={`Remove ${item.name}`}
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="wishlist-footer">
          <Link to="/shop" className="btn-editorial-outline">
            <span>Continue Exploring</span>
            <HiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
