import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineBanknotes,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';
import api from '../../../services/api';
import './Dashboard.css';

const STATUS_COLORS = {
  pending: '#F97D01',
  confirmed: '#22c55e',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setData(res.data.data))
      .catch((err) => console.error('Dashboard error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="admin-dashboard" id="admin-dashboard-view">
        <header className="dash-header">
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Loading analytics...</p>
        </header>
        <div className="dash-stats-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="stat-card stat-skeleton shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-dashboard">
        <header className="dash-header">
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Failed to load dashboard data.</p>
        </header>
      </div>
    );
  }

  const { stats, recent_orders, best_sellers, low_stock, orders_by_status } = data;

  return (
    <div className="admin-dashboard" id="admin-dashboard-view">
      {/* Header */}
      <header className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Real-time overview of your Atelier</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="dash-stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon-wrap stat-icon-sales">
            <HiOutlineBanknotes size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">৳{stats.total_sales.toLocaleString()}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-orders">
            <HiOutlineShoppingBag size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total_orders}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-customers">
            <HiOutlineUsers size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total_customers}</span>
            <span className="stat-label">Customers</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-products">
            <HiOutlineCube size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total_products}</span>
            <span className="stat-label">Active Products</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-pending">
            <HiOutlineClock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.pending_orders}</span>
            <span className="stat-label">Pending Orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-discount">
            <HiOutlineArrowTrendingUp size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">৳{stats.total_discounts.toLocaleString()}</span>
            <span className="stat-label">Discounts Given</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dash-content-grid">
        {/* Recent Orders */}
        <section className="dash-panel dash-orders-panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent Orders</h2>
            <Link to="/admin/orders" className="panel-link">View All →</Link>
          </div>
          <div className="orders-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent_orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/admin/orders/${order.id}`} className="order-link">
                        {order.order_number}
                      </Link>
                      <span className="order-date-sm">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="customer-cell">{order.customer_name}</td>
                    <td>{order.items_count}</td>
                    <td className="total-cell">৳{order.total.toLocaleString()}</td>
                    <td>
                      <span
                        className="status-badge-sm"
                        style={{ color: STATUS_COLORS[order.order_status] || '#888' }}
                      >
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recent_orders.length === 0 && (
                  <tr><td colSpan={5} className="empty-table">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: Best Sellers + Low Stock + Order Status */}
        <div className="dash-side-panels">
          {/* Orders by Status */}
          <section className="dash-panel dash-status-panel">
            <h2 className="panel-title">Orders by Status</h2>
            <div className="status-bars">
              {orders_by_status.map((s) => (
                <div key={s.status} className="status-bar-row">
                  <span className="status-bar-label" style={{ color: STATUS_COLORS[s.status] || '#888' }}>
                    {s.status}
                  </span>
                  <div className="status-bar-track">
                    <div
                      className="status-bar-fill"
                      style={{
                        width: `${Math.max(8, (s.count / Math.max(1, stats.total_orders)) * 100)}%`,
                        backgroundColor: STATUS_COLORS[s.status] || '#444',
                      }}
                    />
                  </div>
                  <span className="status-bar-count">{s.count}</span>
                </div>
              ))}
              {orders_by_status.length === 0 && (
                <p className="panel-empty">No order data</p>
              )}
            </div>
          </section>

          {/* Best Sellers */}
          <section className="dash-panel">
            <div className="panel-header">
              <h2 className="panel-title">Best Sellers</h2>
              <Link to="/admin/products" className="panel-link">All Products →</Link>
            </div>
            <div className="best-sellers-list">
              {best_sellers.map((product, idx) => (
                <div key={product.id} className="bs-item">
                  <span className="bs-rank">#{idx + 1}</span>
                  <img
                    src={product.image_url || '/images/blue-aviator.png'}
                    alt={product.name}
                    className="bs-img"
                  />
                  <div className="bs-info">
                    <span className="bs-name">{product.name}</span>
                    <span className="bs-meta">{product.total_sold} sold · ৳{product.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {best_sellers.length === 0 && (
                <p className="panel-empty">No sales data yet</p>
              )}
            </div>
          </section>

          {/* Low Stock Alerts */}
          {low_stock.length > 0 && (
            <section className="dash-panel dash-lowstock-panel">
              <div className="panel-header">
                <h2 className="panel-title">
                  <HiOutlineExclamationTriangle size={16} className="lowstock-icon" />
                  Low Stock Alerts
                </h2>
              </div>
              <div className="lowstock-list">
                {low_stock.map((product) => (
                  <div key={product.id} className="lowstock-item">
                    <span className="lowstock-name">{product.name}</span>
                    <span className={`lowstock-count ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
