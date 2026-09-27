import { useState } from 'react';
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
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cartCount = 0; // Will be connected to CartContext later
  const wishlistCount = 0; // Will be connected to WishlistContext later

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
    <header className="navbar" id="main-navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="logo-link">
          <span className="logo-icon">👓</span>
          <span className="logo-text">
            Drishti<span className="logo-accent">Atelier</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links" id="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Search Toggle */}
          <button
            className="nav-action-btn"
            id="search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            <HiOutlineMagnifyingGlass size={20} />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="nav-action-btn" id="wishlist-link" aria-label="Wishlist">
            <HiOutlineHeart size={20} />
            {wishlistCount > 0 && (
              <span className="action-badge">{wishlistCount}</span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="nav-action-btn" id="cart-link" aria-label="Cart">
            <HiOutlineShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="action-badge">{cartCount}</span>
            )}
          </Link>

          {/* Account */}
          <Link to="/login" className="nav-action-btn" id="account-link" aria-label="Account">
            <HiOutlineUser size={20} />
          </Link>

          {/* Mobile Toggle */}
          <button
            className="nav-action-btn mobile-toggle"
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiOutlineXMark size={22} /> : <HiOutlineBars3 size={22} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`search-bar ${searchOpen ? 'search-bar-open' : ''}`}>
        <form onSubmit={handleSearch} className="search-form container">
          <HiOutlineMagnifyingGlass size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search for eyewear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            id="search-input"
            autoFocus={searchOpen}
          />
          <button type="submit" className="btn btn-primary btn-sm" id="search-submit">
            Search
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu-open' : ''}`} id="mobile-menu">
        <nav className="mobile-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
              }
              end={link.to === '/'}
              onClick={closeMobile}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mobile-nav-divider" />
          <NavLink to="/wishlist" className="mobile-nav-link" onClick={closeMobile}>
            Wishlist
          </NavLink>
          <NavLink to="/login" className="mobile-nav-link" onClick={closeMobile}>
            Account
          </NavLink>
        </nav>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={closeMobile} aria-hidden="true" />
      )}
    </header>
  );
}
