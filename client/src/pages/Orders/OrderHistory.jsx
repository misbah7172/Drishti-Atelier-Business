import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineShoppingBag } from 'react-icons/hi2';
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

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(res.data.data))
      .catch((err) => console.error('Orders fetch error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="orders-page" id="orders-view">
        <div className="container-editorial orders-loading">
          <div className="skeleton-line skeleton-title shimmer" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="order-skeleton-card shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page" id="orders-view">
        <div className="container-editorial orders-empty">
          <HiOutlineShoppingBag size={56} className="empty-icon" />
          <span className="editorial-eyebrow">Order History</span>
          <h1 className="editorial-section-title empty-title">NO ORDERS YET</h1>
          <p className="editorial-body empty-desc">
            You haven't placed any orders. Start exploring our archive.
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
    <div className="orders-page" id="orders-view">
      <header className="orders-header container-editorial">
        <span className="editorial-eyebrow">Your Account</span>
        <h1 className="editorial-section-title orders-title">
          ORDER HISTORY <span className="text-muted-editorial">({orders.length})</span>
        </h1>
      </header>

      <div className="container-editorial">
        <div className="orders-list">
          {orders.map((order) => {
            const status = STATUS_MAP[order.order_status] || STATUS_MAP.pending;
            return (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="order-card"
              >
                <div className="order-card-top">
                  <div>
                    <span className="order-number">{order.order_number}</span>
                    <span className="order-date">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <span
                    className="order-status-badge"
                    style={{ color: status.color, borderColor: status.color }}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="order-card-bottom">
                  <div className="order-meta">
                    <span>{order.items_count} item{order.items_count !== 1 ? 's' : ''}</span>
                    <span className="meta-dot">·</span>
                    <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span>
                  </div>
                  <span className="order-total">৳{order.total.toFixed(2)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
