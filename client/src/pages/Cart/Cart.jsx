import { Link } from 'react-router-dom';
import {
  HiOutlineTrash,
  HiMinus,
  HiPlus,
  HiArrowRight,
  HiOutlineShoppingBag,
  HiOutlineShieldCheck,
  HiOutlineTruck,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { items, summary, isLoading, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;
    const result = await updateQuantity(item.id, newQty);
    if (!result.success) {
      toast.error(result.message || 'Could not update quantity', {
        style: { background: '#070707', color: '#fff', border: '1px solid #222' },
      });
    }
  };

  const handleRemove = async (item) => {
    const result = await removeItem(item.id);
    if (result.success) {
      toast.success(`Removed ${item.name}`, {
        style: { background: '#070707', color: '#fff', border: '1px solid #222' },
      });
    }
  };

  const handleClearCart = async () => {
    await clearCart();
    toast.success('Cart cleared', {
      style: { background: '#070707', color: '#fff', border: '1px solid #222' },
    });
  };

  // Loading
  if (isLoading) {
    return (
      <div className="cart-page" id="cart-view">
        <div className="container-editorial cart-loading">
          <div className="skeleton-line skeleton-title shimmer" />
          {[1, 2].map((i) => (
            <div key={i} className="cart-skeleton-row">
              <div className="skeleton-image shimmer" />
              <div className="skeleton-meta-col">
                <div className="skeleton-line shimmer" />
                <div className="skeleton-line skeleton-short shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="cart-page" id="cart-view">
        <div className="container-editorial cart-empty-state">
          <HiOutlineShoppingBag size={56} className="empty-icon" />
          <span className="editorial-eyebrow">Your Atelier Bag</span>
          <h1 className="editorial-section-title empty-title">YOUR BAG IS EMPTY</h1>
          <p className="editorial-body empty-desc">
            You haven't added any architectural eyewear to your bag yet.
            Explore our archive to find your perfect silhouette.
          </p>
          <Link to="/shop" className="btn-editorial">
            <span>Explore the Archive</span>
            <HiArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page" id="cart-view">
      {/* Header */}
      <header className="cart-header container-editorial">
        <div>
          <span className="editorial-eyebrow">Your Atelier Bag</span>
          <h1 className="editorial-section-title cart-title">
            SHOPPING BAG <span className="text-muted-editorial">({summary.items_count})</span>
          </h1>
        </div>
        <button type="button" onClick={handleClearCart} className="cart-clear-btn">
          Clear All
        </button>
      </header>

      <div className="cart-layout container-editorial">
        {/* Cart Items */}
        <div className="cart-items-column">
          {items.map((item) => {
            const imgSrc = item.image_url || item.image || '/images/blue-aviator.png';
            const name = item.name || 'Product';
            const price = parseFloat(item.price) || 0;
            const lineTotal = item.line_total || price * item.quantity;

            return (
              <div key={item.id} className="cart-item">
                <Link to={`/product/${item.slug || item.product_id}`} className="cart-item-image-link">
                  <img src={imgSrc} alt={name} className="cart-item-image" loading="lazy" />
                </Link>

                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <div>
                      <Link to={`/product/${item.slug || item.product_id}`} className="cart-item-name">
                        {name}
                      </Link>
                      {item.brand && <span className="cart-item-brand">{item.brand}</span>}
                      {item.frame_color && (
                        <span className="cart-item-detail">Color: {item.frame_color}</span>
                      )}
                      {item.sku && <span className="cart-item-detail">SKU: {item.sku}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="cart-item-remove"
                      aria-label={`Remove ${name}`}
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <div className="cart-qty-control">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={item.quantity <= 1}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <HiMinus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, 1)}
                        disabled={item.quantity >= (item.stock || 999)}
                        className="qty-btn"
                        aria-label="Increase quantity"
                      >
                        <HiPlus size={14} />
                      </button>
                    </div>

                    <div className="cart-item-price-col">
                      <span className="cart-item-price">${price.toFixed(2)}</span>
                      {item.quantity > 1 && (
                        <span className="cart-item-line-total">
                          Total: ${typeof lineTotal === 'number' ? lineTotal.toFixed(2) : lineTotal}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.stock !== undefined && item.stock <= 5 && item.stock > 0 && (
                    <span className="cart-item-stock-warn">Only {item.stock} left in stock</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="cart-summary-sidebar">
          <div className="summary-sticky">
            <h2 className="summary-title">ORDER SUMMARY</h2>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({summary.items_count} item{summary.items_count !== 1 ? 's' : ''})</span>
                <span>${summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{summary.shipping === 0 ? 'Complimentary' : `$${summary.shipping.toFixed(2)}`}</span>
              </div>
              {summary.discount > 0 && (
                <div className="summary-row summary-discount">
                  <span>Discount</span>
                  <span>−${summary.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${summary.total.toFixed(2)} BDT</span>
              </div>
            </div>

            {summary.shipping === 0 && summary.subtotal > 0 && (
              <div className="summary-free-shipping">
                <HiOutlineTruck size={16} />
                <span>Complimentary shipping on orders over ৳2,000</span>
              </div>
            )}

            {isAuthenticated ? (
              <Link to="/checkout" className="btn-editorial btn-lg summary-checkout-btn">
                <span>Proceed to Checkout</span>
                <HiArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/login" className="btn-editorial btn-lg summary-checkout-btn">
                <span>Login to Checkout</span>
                <HiArrowRight size={16} />
              </Link>
            )}

            <Link to="/shop" className="summary-continue-link">
              Continue Shopping
            </Link>

            {/* Trust badges */}
            <div className="summary-guarantees">
              <div className="guarantee-row">
                <HiOutlineShieldCheck size={16} className="guarantee-icon" />
                <span>30-Day Complimentary Home Fit Trial</span>
              </div>
              <div className="guarantee-row">
                <HiOutlineTruck size={16} className="guarantee-icon" />
                <span>Secure Packaging & Express Dispatch</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
