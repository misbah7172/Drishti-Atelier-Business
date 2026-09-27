import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineMagnifyingGlass,
  HiOutlineBars3,
  HiOutlineXMark,
} from 'react-icons/hi2';
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Overview', end: true },
  { to: '/shop?category=sunglasses', label: 'Sunglasses' },
  { to: '/shop?category=prescription-glasses', label: 'Optical' },
  { to: '/shop?category=blue-light-glasses', label: 'Blue Light' },
  { to: '/about', label: 'The Craft' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cartCount = 0; // Connected to CartContext
  const wishlistCount = 0; // Connected to WishlistContext

  // Track window scroll for glassmorphism transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);



  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`navbar-editorial ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'} ${
        mobileOpen ? 'navbar-mobile-active' : ''
      }`}
      id="main-navbar"
    >
      <div className="navbar-container container-editorial">
        {/* Left: Brand Wordmark with Emblem */}
        <Link to="/" className="navbar-brand" id="logo-link" aria-label="Drishti Atelier">
          <img src="/logo.svg" alt="Drishti Logo" className="navbar-brand-emblem" />
          <div className="navbar-brand-text">
            <span className="navbar-brand-name">DRISHTI</span>
            <span className="navbar-brand-tag">ATELIER</span>
          </div>
        </Link>

        {/* Center: Editorial Categories */}
        <nav className="navbar-links" id="desktop-nav" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `navbar-nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              end={link.end}
            >
              <span className="nav-link-text">{link.label}</span>
              <span className="nav-link-indicator" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="navbar-actions">
          {/* Search Toggle */}
          <button
            type="button"
            className="navbar-action-btn"
            id="search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search bar"
            aria-expanded={searchOpen}
          >
            <HiOutlineMagnifyingGlass size={19} />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="navbar-action-btn"
            id="wishlist-link"
            aria-label="Wishlist"
          >
            <HiOutlineHeart size={19} />
            {wishlistCount > 0 && (
              <span className="navbar-badge-pill">{wishlistCount}</span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="navbar-action-btn"
            id="cart-link"
            aria-label="Shopping Cart"
          >
            <HiOutlineShoppingBag size={19} />
            {cartCount > 0 ? (
              <span className="navbar-badge-pill">{cartCount}</span>
            ) : (
              <span className="navbar-badge-dot" aria-hidden="true" />
            )}
          </Link>

          {/* Account */}
          <Link
            to="/login"
            className="navbar-action-btn desktop-only"
            id="account-link"
            aria-label="Account Login"
          >
            <HiOutlineUser size={19} />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="navbar-action-btn mobile-menu-btn"
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <HiOutlineXMark size={24} /> : <HiOutlineBars3 size={24} />}
          </button>
        </div>
      </div>

      {/* Expandable Minimal Search Overlay */}
      <div
        className={`navbar-search-overlay ${searchOpen ? 'search-open' : ''}`}
        aria-hidden={!searchOpen}
      >
        <form onSubmit={handleSearch} className="navbar-search-form container-editorial">
          <HiOutlineMagnifyingGlass size={20} className="search-input-icon" />
          <input
            type="text"
            placeholder="Search titanium frames, acetate, polarized lenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
            id="search-input"
            autoFocus={searchOpen}
          />
          <button type="submit" className="btn-editorial btn-sm" id="search-submit">
            Search
          </button>
          <button
            type="button"
            className="search-close-btn"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            <HiOutlineXMark size={20} />
          </button>
        </form>
      </div>

      {/* Architectural Fullscreen Mobile Menu Drawer */}
      <div
        className={`navbar-mobile-drawer ${mobileOpen ? 'drawer-open' : ''}`}
        id="mobile-menu"
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-drawer-content container-editorial">
          <span className="mobile-drawer-eyebrow">Drishti Atelier — Collection 2026</span>
          <nav className="mobile-nav-links">
            {navLinks.map((link, idx) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="mobile-editorial-link"
                style={{ '--delay': `${idx * 0.06 + 0.1}s` }}
                end={link.end}
                onClick={closeMobile}
              >
                <span className="mobile-link-num">0{idx + 1}</span>
                <span className="mobile-link-title">{link.label}</span>
              </NavLink>
            ))}
            <NavLink
              to="/about"
              className="mobile-editorial-link"
              style={{ '--delay': '0.4s' }}
              onClick={closeMobile}
            >
              <span className="mobile-link-num">05</span>
              <span className="mobile-link-title">About the House</span>
            </NavLink>
            <NavLink
              to="/contact"
              className="mobile-editorial-link"
              style={{ '--delay': '0.46s' }}
              onClick={closeMobile}
            >
              <span className="mobile-link-num">06</span>
              <span className="mobile-link-title">Bespoke Inquiries</span>
            </NavLink>
          </nav>

          <div className="mobile-drawer-footer">
            <div className="mobile-footer-actions">
              <Link to="/login" className="mobile-footer-link" onClick={closeMobile}>
                Account Login
              </Link>
              <span className="mobile-footer-dot">•</span>
              <Link to="/wishlist" className="mobile-footer-link" onClick={closeMobile}>
                Saved Items
              </Link>
            </div>
            <p className="mobile-footer-copyright">
              Crafted with titanium, sapphire crystal & architectural intent.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
