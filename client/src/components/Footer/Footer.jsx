import { Link } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import { FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import './Footer.css';

const companyLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
];

const customerLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/cart', label: 'My Cart' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/account/orders', label: 'Order Tracking' },
];

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">👓</span>
              <span className="logo-text">
                Drishti<span className="logo-accent">Atelier</span>
              </span>
            </Link>
            <p className="footer-desc">
              Premium eyewear for every style. Discover your perfect pair with
              Drishti — where clarity meets fashion.
            </p>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <HiOutlineMapPin size={16} />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="footer-contact-item">
                <HiOutlinePhone size={16} />
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="footer-contact-item">
                <HiOutlineEnvelope size={16} />
                <span>support@drishtiatelier.com</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-link-list">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-col">
            <h4 className="footer-col-title">Customer Service</h4>
            <ul className="footer-link-list">
              {customerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4 className="footer-col-title">Stay Updated</h4>
            <p className="footer-newsletter-text">
              Subscribe to get the latest offers and new arrivals.
            </p>
            <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="footer-newsletter-input"
                id="newsletter-email"
              />
              <button type="submit" className="btn btn-primary btn-sm" id="newsletter-subscribe">
                Subscribe
              </button>
            </form>
            <div className="footer-socials">
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="footer-social-link" aria-label="X / Twitter">
                <FaXTwitter size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              © {currentYear} Drishti. All rights reserved.
            </p>
            <div className="footer-legal-links">
              {legalLinks.map((link) => (
                <Link key={link.to} to={link.to} className="footer-legal-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
