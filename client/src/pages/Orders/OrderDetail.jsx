import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import api from '../../services/api';
import './Orders.css';

const STATUS_MAP = {
  pending: { label: 'Pending', color: '#F97D01' },
  confirmed: { label: 'Confirmed', color: '#22c55e' },
  processing: { label: 'Processing', color: '#3b82f6' },
  shipped: { label: 'Shipped', color: '#8b5cf6' },
  delivered: { label: 'Delivered', color: '#10b981' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch(() => setError('Order not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="orders-page" id="order-detail-view">
        <div className="container-editorial orders-loading">
          <div className="skeleton-line skeleton-title shimmer" />
          <div className="order-skeleton-card shimmer" />
          <div className="order-skeleton-card shimmer" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="orders-page" id="order-detail-view">
        <div className="container-editorial orders-empty">
          <h1 className="editorial-section-title empty-title">ORDER NOT FOUND</h1>
          <Link to="/account/orders" className="btn-editorial">
            <HiArrowLeft size={16} />
            <span>Back to Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_MAP[order.order_status] || STATUS_MAP.pending;

  return (
    <div className="orders-page" id="order-detail-view">
      <header className="orders-header container-editorial">
        <Link to="/account/orders" className="back-link">
          <HiArrowLeft size={16} />
          <span>Back to Orders</span>
        </Link>
        <div className="order-detail-header-row">
          <div>
            <span className="editorial-eyebrow">Order Details</span>
            <h1 className="editorial-section-title orders-title">{order.order_number}</h1>
            <span className="order-date">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
          <span
            className="order-status-badge order-status-lg"
            style={{ color: status.color, borderColor: status.color }}
          >
            {status.label}
          </span>
        </div>
      </header>

      <div className="container-editorial order-detail-layout">
        {/* Order Items */}
        <section className="od-section">
          <h2 className="od-section-title">ORDER ITEMS</h2>
          <div className="od-items-list">
            {order.items?.map((item) => (
              <div key={item.id} className="od-item">
                <img
                  src={item.image_url || '/images/blue-aviator.png'}
                  alt={item.product_name}
                  className="od-item-img"
                />
                <div className="od-item-info">
                  <Link
                    to={`/product/${item.product_slug || item.product_id}`}
                    className="od-item-name"
                  >
                    {item.product_name}
                  </Link>
                  {item.sku && <span className="od-item-sku">SKU: {item.sku}</span>}
                  <span className="od-item-qty">Qty: {item.quantity}</span>
                </div>
                <div className="od-item-price-col">
                  <span className="od-item-price">৳{item.price.toFixed(2)}</span>
                  <span className="od-item-subtotal">৳{item.subtotal.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary + Shipping side by side */}
        <div className="od-side-grid">
          {/* Order Summary */}
          <section className="od-section od-summary-card">
            <h2 className="od-section-title">ORDER SUMMARY</h2>
            <div className="od-summary-rows">
              <div className="od-summary-row">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="od-summary-row od-discount">
                  <span>Discount</span>
                  <span>−৳{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="od-summary-row">
                <span>Shipping</span>
                <span>{order.shipping_fee === 0 ? 'Free' : `৳${order.shipping_fee.toFixed(2)}`}</span>
              </div>
              <div className="od-divider" />
              <div className="od-summary-row od-total">
                <span>Total</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
              <div className="od-summary-row">
                <span>Payment</span>
                <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span>
              </div>
            </div>
          </section>

          {/* Shipping Details */}
          <section className="od-section od-shipping-card">
            <h2 className="od-section-title">SHIPPING ADDRESS</h2>
            <div className="od-shipping-info">
              <p className="od-ship-name">{order.shipping_name}</p>
              <p className="od-ship-line">{order.shipping_phone}</p>
              <p className="od-ship-line">{order.shipping_address}</p>
              <p className="od-ship-line">
                {order.shipping_area && `${order.shipping_area}, `}
                {order.shipping_city}
                {order.shipping_postal_code && ` - ${order.shipping_postal_code}`}
              </p>
              {order.notes && (
                <p className="od-ship-notes">Note: {order.notes}</p>
              )}
            </div>
          </section>
        </div>

        {/* Status Timeline */}
        {order.status_history && order.status_history.length > 0 && (
          <section className="od-section">
            <h2 className="od-section-title">ORDER TIMELINE</h2>
            <div className="od-timeline">
              {order.status_history.map((entry, idx) => {
                const st = STATUS_MAP[entry.status] || STATUS_MAP.pending;
                return (
                  <div key={entry.id || idx} className="timeline-entry">
                    <div className="timeline-dot" style={{ backgroundColor: st.color }} />
                    <div className="timeline-content">
                      <span className="timeline-status" style={{ color: st.color }}>
                        {st.label}
                      </span>
                      {entry.note && <p className="timeline-note">{entry.note}</p>}
                      <span className="timeline-date">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
