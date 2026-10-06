import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBars3,
  HiOutlineChevronRight,
} from 'react-icons/hi2';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const SECTION_TITLES = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'Add Product',
  '/admin/orders': 'Orders',
  '/admin/users': 'Users',
  '/admin/categories': 'Categories',
  '/admin/coupons': 'Coupons',
  '/admin/reviews': 'Reviews',
  '/admin/settings': 'Settings',
};

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Determine current section title
  const currentPath = location.pathname;
  const currentTitle = SECTION_TITLES[currentPath] || 'Console';

  return (
    <div className="admin-layout" id="admin-root">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      {/* Main Area */}
      <div
        className={`admin-main ${collapsed ? 'admin-main-collapsed' : ''}`}
      >
        {/* Dedicated Admin Top Navbar */}
        <header className="admin-topbar" id="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation drawer"
            >
              <HiOutlineBars3 size={22} />
            </button>

            <nav className="admin-breadcrumb" aria-label="Breadcrumb">
              <span className="admin-crumb-root">Atelier Console</span>
              <HiOutlineChevronRight size={13} className="admin-crumb-sep" />
              <span className="admin-crumb-current">{currentTitle}</span>
            </nav>
          </div>

          <div className="admin-topbar-right">
            {/* View Live Store */}
            <Link
              to="/"
              className="admin-btn-store"
              target="_blank"
              rel="noreferrer"
              title="Open storefront in new tab"
            >
              <span className="admin-btn-store-text">View Store</span>
              <HiOutlineArrowTopRightOnSquare size={14} />
            </Link>

            {/* Admin User Chip */}
            <div className="admin-user-chip">
              <div className="admin-user-avatar">
                {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="admin-user-info">
                <span className="admin-user-name">
                  {user?.name || 'Administrator'}
                </span>
                <span className="admin-user-badge">Admin</span>
              </div>
            </div>

            {/* Dedicated Logout Action */}
            <button
              type="button"
              onClick={logout}
              className="admin-logout-action-btn"
              title="Sign Out of Admin Console"
              id="admin-logout-btn"
            >
              <HiOutlineArrowRightOnRectangle size={17} />
              <span className="admin-logout-label">Logout</span>
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-content-outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
