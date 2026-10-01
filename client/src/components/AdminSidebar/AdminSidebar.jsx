import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HiOutlineChartBarSquare,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineTicket,
  HiOutlineStar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2';
import './AdminSidebar.css';

const NAV_ITEMS = [
  { path: '/admin', icon: HiOutlineChartBarSquare, label: 'Dashboard', exact: true },
  { path: '/admin/products', icon: HiOutlineCube, label: 'Products' },
  { path: '/admin/orders', icon: HiOutlineShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: HiOutlineUsers, label: 'Users' },
  { path: '/admin/categories', icon: HiOutlineTag, label: 'Categories' },
  { path: '/admin/coupons', icon: HiOutlineTicket, label: 'Coupons' },
  { path: '/admin/reviews', icon: HiOutlineStar, label: 'Reviews' },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`admin-sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-brand">
        {!collapsed && (
          <>
            <span className="sidebar-brand-name">DRISHTI</span>
            <span className="sidebar-brand-sub">Admin Console</span>
          </>
        )}
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <HiOutlineChevronRight size={16} /> : <HiOutlineChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, icon: Icon, label, exact }) => {
          const isActive = exact
            ? location.pathname === path
            : location.pathname.startsWith(path);

          return (
            <NavLink
              key={path}
              to={path}
              className={`sidebar-link ${isActive ? 'sidebar-active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={19} className="sidebar-icon" />
              {!collapsed && <span className="sidebar-label">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="sidebar-link sidebar-back">
          <HiOutlineChevronLeft size={16} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-label">Back to Store</span>}
        </NavLink>
      </div>
    </aside>
  );
}
