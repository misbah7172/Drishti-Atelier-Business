import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiCheck } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({
  id = 1,
  slug,
  name = 'Drishti Atelier Frame',
  code = '',
  price = 0,
  comparePrice,
  image = '/images/blue-aviator.png',
  hoverImage = '/images/amber-aviator.png',
  colors = [],
  badge = null,
  stock,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const isLiked = isWishlisted(id);

  // Build link — prefer slug, fallback to ID
  const productLink = `/product/${slug || id}`;

  // Normalize colors to array of hex strings for swatches
  const colorHexes = colors
    .map((c) => (typeof c === 'string' ? c : c?.hex))
    .filter(Boolean)
    .slice(0, 4);

  // Out of stock check
  const outOfStock = stock !== undefined && stock <= 0;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    const result = await addToCart({ id, name, slug, price, stock, image, brand: '', frame_color: '' });
    if (result.success) {
      setIsAdded(true);
      toast.success(`Added ${name} to your cart`, {
        style: {
          background: '#070707',
          color: '#ffffff',
          border: '1px solid #222222',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.08em',
        },
      });
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      toast.error(result.message || 'Could not add to cart', {
        style: { background: '#070707', color: '#fff', border: '1px solid #222' },
      });
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await toggleWishlist(id);
    if (result.success && result.added) {
      toast('Saved to wishlist', {
        icon: '🖤',
        style: {
          background: '#070707',
          color: '#ffffff',
          border: '1px solid #222222',
        },
      });
    }
  };

  return (
    <div
      className={`editorial-product-card ${outOfStock ? 'card-out-of-stock' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={productLink} className="card-image-wrapper">
        {badge && <span className="card-badge">{badge}</span>}
        {outOfStock && <span className="card-badge card-badge-oos">Sold Out</span>}

        <button
          type="button"
          onClick={handleWishlist}
          className={`card-wishlist-btn ${isLiked ? 'liked' : ''}`}
          aria-label="Save to wishlist"
        >
          <HiOutlineHeart size={18} />
        </button>

        <div className="card-image-container">
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={name}
            className="card-main-image"
            loading="lazy"
          />
        </div>

        {/* Slide-Up Quick Add Action */}
        {!outOfStock && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="card-quick-add-btn"
            aria-label={`Quick add ${name} to cart`}
          >
            {isAdded ? (
              <>
                <HiCheck size={16} />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <HiOutlineShoppingBag size={16} />
                <span>Quick Add — ${price}</span>
              </>
            )}
          </button>
        )}
      </Link>

      {/* Editorial Meta */}
      <div className="card-meta">
        {code && (
          <div className="card-code-row">
            <span className="card-code">{code}</span>
            {colorHexes.length > 0 && (
              <div className="card-color-swatches" aria-label="Available colors">
                {colorHexes.map((c, i) => (
                  <span
                    key={i}
                    className="color-dot"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <Link to={productLink} className="card-title-link">
          <h4 className="card-title">{name}</h4>
        </Link>

        <div className="card-price-row">
          <span className="card-price">${price} USD</span>
          {comparePrice && comparePrice > price && (
            <span className="card-compare-price">${comparePrice}</span>
          )}
          <span className="card-shipping-tag">Complimentary Shipping</span>
        </div>
      </div>
    </div>
  );
}
