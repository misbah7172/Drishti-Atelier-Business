import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiArrowLeft, HiOutlineShoppingBag } from 'react-icons/hi2';
import api from '../../services/api';
import './Orders.css';

const STATUS_MAP = {
  pending: { label: 'Pending', color: '#F97D01' },
  confirmed: { label: 'Confirmed', color: '#16a34a' },
  processing: { label: 'Processing', color: '#2563eb' },
  shipped: { label: 'Shipped', color: '#7c3aed' },
  delivered: { label: 'Delivered', color: '#059669' },
  cancelled: { label: 'Cancelled', color: '#dc2626' },
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => console.error('Orders fetch error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="orders-page" id="orders-view">
        <div className="orders-container orders-loading">
          <div className="order-skeleton-card" />
          <div className="order-skeleton-card" />
          <div className="order-skeleton-card" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page" id="orders-view">
        <div className="orders-container">
          <Link to="/account" className="back-link">
            <HiArrowLeft size={14} />
            <span>Back to Account</span>
          </Link>
          <div className="orders-empty">
            <HiOutlineShoppingBag size={56} className="empty-icon" />
            <span className="editorial-eyebrow">Order History</span>
            <h1 className="editorial-section-title empty-title">NO ORDERS YET</h1>
            <p className="editorial-body empty-desc">
              You haven't placed any orders yet. Start exploring our bespoke eyewear archive.
            </p>
            <Link to="/shop" className="btn-editorial">
              <span>Explore Archive</span>
              <HiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page" id="orders-view">
      <div className="orders-container">
        <Link to="/account" className="back-link">
          <HiArrowLeft size={14} />
          <span>Back to Account</span>
        </Link>

        <header className="orders-header">
          <span className="editorial-eyebrow">Your Account</span>
          <h1 className="orders-title">
            ORDER HISTORY <span style={{ color: '#94a3b8', fontSize: '1.25rem' }}>({orders.length})</span>
          </h1>
        </header>

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
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <span
                    className="order-status-badge"
                    style={{
                      color: status.color,
                      borderColor: status.color,
                      backgroundColor: `${status.color}15`,
                    }}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="order-card-bottom">
                  <div className="order-meta">
                    <span>{order.items_count || order.items?.length || 1} item{(order.items_count || order.items?.length) !== 1 ? 's' : ''}</span>
                    <span className="meta-dot">·</span>
                    <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span>
                  </div>
                  <span className="order-total">৳{Number(order.total || 0).toFixed(2)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
