import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiArrowRight,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineTag,
  HiCheck,
  HiXMark,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, summary, clearCart } = useCart();
  const { user } = useAuth();

  // Form state
  const [form, setForm] = useState({
    shipping_name: user?.name || user?.full_name || '',
    shipping_phone: user?.phone || '',
    shipping_address: '',
    shipping_city: '',
    shipping_area: '',
    shipping_postal_code: '',
    notes: '',
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Prefill user info
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        shipping_name: prev.shipping_name || user.name || user.full_name || '',
        shipping_phone: prev.shipping_phone || user.phone || '',
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="checkout-page" id="checkout-view">
        <div className="container-editorial checkout-empty">
          <span className="editorial-eyebrow">Checkout</span>
          <h1 className="editorial-section-title empty-title">YOUR BAG IS EMPTY</h1>
          <p className="editorial-body empty-desc">Add items to your bag before checking out.</p>
          <Link to="/shop" className="btn-editorial">
            <span>Explore the Archive</span>
            <HiArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponData(null);
    try {
      const res = await api.post('/orders/validate-coupon', {
        code: couponCode.trim(),
        subtotal: summary.subtotal,
      });
      setCouponData(res.data.data);
      toast.success(`Coupon applied: ${res.data.data.description}`, {
        style: { background: '#070707', color: '#fff', border: '1px solid #222' },
      });
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponData(null);
    setCouponCode('');
    setCouponError('');
  };

  // Calculate final totals
  const discount = couponData?.discount || 0;
  const finalTotal = parseFloat((summary.subtotal - discount + summary.shipping).toFixed(2));

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!form.shipping_name.trim()) newErrors.shipping_name = 'Full name is required';
    if (!form.shipping_phone.trim()) newErrors.shipping_phone = 'Phone number is required';
    if (!form.shipping_address.trim()) newErrors.shipping_address = 'Address is required';
    if (!form.shipping_city.trim()) newErrors.shipping_city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/orders', {
        ...form,
        coupon_code: couponData ? couponCode : undefined,
      });

      // Clear cart context (server already cleared DB cart)
      clearCart();

      toast.success('Order placed successfully!', {
        style: { background: '#070707', color: '#fff', border: '1px solid #222' },
        iconTheme: { primary: '#F97D01', secondary: '#050505' },
      });

      navigate(`/order-success/${res.data.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order';
      const stockErrors = err.response?.data?.errors;
      if (stockErrors) {
        toast.error(stockErrors.join('\n'), {
          style: { background: '#070707', color: '#fff', border: '1px solid #222' },
          duration: 6000,
        });
      } else {
        toast.error(msg, {
          style: { background: '#070707', color: '#fff', border: '1px solid #222' },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page" id="checkout-view">
      <header className="checkout-header container-editorial">
        <span className="editorial-eyebrow">Secure Checkout</span>
        <h1 className="editorial-section-title checkout-title">COMPLETE YOUR ORDER</h1>
      </header>

      <form onSubmit={handleSubmit} className="checkout-layout container-editorial" noValidate>
        {/* Left: Shipping Form */}
        <div className="checkout-form-column">
          <section className="checkout-section">
            <h2 className="checkout-section-title">SHIPPING INFORMATION</h2>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="shipping_name">Full Name *</label>
                <input
                  type="text"
                  id="shipping_name"
                  name="shipping_name"
                  value={form.shipping_name}
                  onChange={handleChange}
                  className={`form-input ${errors.shipping_name ? 'input-error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.shipping_name && <span className="form-error">{errors.shipping_name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="shipping_phone">Phone Number *</label>
                <input
                  type="tel"
                  id="shipping_phone"
                  name="shipping_phone"
                  value={form.shipping_phone}
                  onChange={handleChange}
                  className={`form-input ${errors.shipping_phone ? 'input-error' : ''}`}
                  placeholder="01XXXXXXXXX"
                />
                {errors.shipping_phone && <span className="form-error">{errors.shipping_phone}</span>}
              </div>

              <div className="form-group form-full">
                <label className="form-label" htmlFor="shipping_address">Street Address *</label>
                <input
                  type="text"
                  id="shipping_address"
                  name="shipping_address"
                  value={form.shipping_address}
                  onChange={handleChange}
                  className={`form-input ${errors.shipping_address ? 'input-error' : ''}`}
                  placeholder="House/Flat, Road, Area"
                />
                {errors.shipping_address && <span className="form-error">{errors.shipping_address}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="shipping_city">City *</label>
                <input
                  type="text"
                  id="shipping_city"
                  name="shipping_city"
                  value={form.shipping_city}
                  onChange={handleChange}
                  className={`form-input ${errors.shipping_city ? 'input-error' : ''}`}
                  placeholder="e.g. Dhaka"
                />
                {errors.shipping_city && <span className="form-error">{errors.shipping_city}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="shipping_area">Area</label>
                <input
                  type="text"
                  id="shipping_area"
                  name="shipping_area"
                  value={form.shipping_area}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Dhanmondi"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="shipping_postal_code">Postal Code</label>
                <input
                  type="text"
                  id="shipping_postal_code"
                  name="shipping_postal_code"
                  value={form.shipping_postal_code}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. 1205"
                />
              </div>

              <div className="form-group form-full">
                <label className="form-label" htmlFor="notes">Order Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  rows={3}
                  placeholder="Special delivery instructions..."
                />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">PAYMENT METHOD</h2>
            <div className="payment-option payment-selected">
              <div className="payment-radio-circle"><div className="radio-dot" /></div>
              <div>
                <span className="payment-name">Cash on Delivery (COD)</span>
                <span className="payment-desc">Pay when your order arrives</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Order Summary */}
        <aside className="checkout-summary-column">
          <div className="checkout-summary-sticky">
            <h2 className="summary-title">ORDER SUMMARY</h2>

            {/* Items */}
            <div className="checkout-items-list">
              {items.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img
                    src={item.image_url || item.image || '/images/blue-aviator.png'}
                    alt={item.name}
                    className="checkout-item-img"
                  />
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.name}</span>
                    <span className="checkout-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-item-price">
                    ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="coupon-section">
              {couponData ? (
                <div className="coupon-applied">
                  <div className="coupon-applied-info">
                    <HiOutlineTag size={16} className="coupon-icon" />
                    <div>
                      <span className="coupon-code-label">{couponData.code}</span>
                      <span className="coupon-desc">{couponData.description}</span>
                    </div>
                  </div>
                  <button type="button" onClick={handleRemoveCoupon} className="coupon-remove-btn">
                    <HiXMark size={16} />
                  </button>
                </div>
              ) : (
                <div className="coupon-input-row">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                    className="form-input coupon-input"
                    placeholder="Enter coupon code"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="btn-editorial btn-sm coupon-apply-btn"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponError && <span className="form-error">{couponError}</span>}
            </div>

            {/* Totals */}
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({summary.items_count} items)</span>
                <span>৳{summary.subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row summary-discount">
                  <span>Discount</span>
                  <span>−৳{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>{summary.shipping === 0 ? 'Free' : `৳${summary.shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>৳{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-editorial btn-lg checkout-submit-btn"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <HiCheck size={18} />
                  <span>Place Order — ৳{finalTotal.toFixed(2)}</span>
                </>
              )}
            </button>

            <div className="checkout-guarantees">
              <div className="guarantee-row">
                <HiOutlineShieldCheck size={16} className="guarantee-icon" />
                <span>Secure & encrypted checkout</span>
              </div>
              <div className="guarantee-row">
                <HiOutlineTruck size={16} className="guarantee-icon" />
                <span>Free shipping on orders above ৳2,000</span>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
