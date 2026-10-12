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
  HiOutlineCog6Tooth,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineXMark,
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
  { path: '/admin/settings', icon: HiOutlineCog6Tooth, label: 'Settings' },
];

export default function AdminSidebar({
  collapsed: propCollapsed,
  setCollapsed: propSetCollapsed,
  mobileOpen = false,
  closeMobile,
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const location = useLocation();

  const collapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const setCollapsed = propSetCollapsed !== undefined ? propSetCollapsed : setInternalCollapsed;

  const handleLinkClick = () => {
    if (closeMobile) closeMobile();
  };

  return (
    <aside
      className={`admin-sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${
        mobileOpen ? 'sidebar-mobile-open' : ''
      }`}
      id="admin-sidebar"
      aria-label="Admin Navigation"
    >
      <div className="sidebar-brand">
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">DRISHTI</span>
            <span className="sidebar-brand-sub">Admin Console</span>
          </div>
        )}

        {/* Mobile close button */}
        {closeMobile && (
          <button
            type="button"
            className="sidebar-mobile-close-btn"
            onClick={closeMobile}
            aria-label="Close sidebar menu"
          >
            <HiOutlineXMark size={20} />
          </button>
        )}

        {/* Desktop collapse button */}
        <button
          type="button"
          className="sidebar-collapse-btn desktop-only-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <HiOutlineChevronRight size={15} /> : <HiOutlineChevronLeft size={15} />}
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
              onClick={handleLinkClick}
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
        <NavLink to="/" className="sidebar-link sidebar-back" onClick={handleLinkClick}>
          <HiOutlineChevronLeft size={16} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-label">Back to Store</span>}
        </NavLink>
      </div>
    </aside>
  );
}
