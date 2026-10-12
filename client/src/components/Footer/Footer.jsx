import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiArrowRight,
} from 'react-icons/hi2';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';
import api from '../../services/api';
import './Footer.css';

const shopLinks = [
  { to: '/shop?category=new', label: 'New Arrivals' },
  { to: '/shop?category=sunglasses', label: 'Sunglasses' },
  { to: '/shop?category=prescription-glasses', label: 'Optical Frames' },
  { to: '/shop?category=blue-light-glasses', label: 'Blue Light Optics' },
];

const companyLinks = [
  { to: '/about', label: 'The Atelier' },
  { to: '/contact', label: 'Bespoke Inquiries' },
  { to: '/faq', label: 'Fitting & Care' },
];

const customerLinks = [
  { to: '/shop', label: 'Archive Index' },
  { to: '/cart', label: 'Shopping Bag' },
  { to: '/wishlist', label: 'Saved Pieces' },
  { to: '/account/orders', label: 'Order Tracking' },
];

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [nlEmail, setNlEmail] = useState('');
  const [nlSending, setNlSending] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!nlEmail) return;
    setNlSending(true);
    try {
      await api.post('/newsletter', { email: nlEmail });
      toast.success('Subscribed!', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } });
      setNlEmail('');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setNlSending(false); }
  };

  return (
    <footer className="footer-editorial" id="main-footer">
      <div className="container-editorial">
        <div className="footer-editorial-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand-wordmark" aria-label="Drishti Atelier">
              <img src="/logo.svg" alt="Drishti Logo" className="footer-brand-emblem" />
              <div className="footer-brand-text">
                <span className="footer-brand-title">DRISHTI</span>
                <span className="footer-brand-sub">ATELIER</span>
              </div>
            </Link>
            <p className="footer-editorial-desc">
              Architectural eyewear sculpted in aerospace titanium and hand-buffed
              crystal optics. Form, clarity, and structural poise.
            </p>
            <div className="footer-atelier-location">
              <div className="footer-loc-item">
                <HiOutlineMapPin size={14} />
                <span>Dhaka &amp; Tokyo</span>
              </div>
              <div className="footer-loc-item">
                <HiOutlineEnvelope size={14} />
                <span>concierge@drishtiatelier.com</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Group (Responsive 3-Column on mobile) */}
          <div className="footer-links-group">
            {/* Shop Column */}
            <div className="footer-links-col">
              <h4 className="footer-col-heading">COLLECTIONS</h4>
              <ul className="footer-nav-list">
                {shopLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="footer-nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="footer-links-col">
              <h4 className="footer-col-heading">THE HOUSE</h4>
              <ul className="footer-nav-list">
                {companyLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="footer-nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Client Service Column */}
            <div className="footer-links-col">
              <h4 className="footer-col-heading">SERVICE</h4>
              <ul className="footer-nav-list">
                {customerLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="footer-nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="footer-newsletter-col">
            <h4 className="footer-col-heading">DISPATCHES</h4>
            <p className="footer-newsletter-sub">
              Receive private invitations to limited archive releases.
            </p>
            <form className="footer-minimal-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Email address..."
                className="footer-minimal-input"
                id="footer-email-input"
                required
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
              />
              <button
                type="submit"
                className="footer-submit-arrow"
                id="footer-email-submit"
                aria-label="Subscribe to dispatches"
                disabled={nlSending}
              >
                <HiArrowRight size={16} />
              </button>
            </form>

            <div className="footer-social-icons">
              <a href="#" className="footer-social-btn" aria-label="Instagram">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="footer-social-btn" aria-label="X / Twitter">
                <FaXTwitter size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="footer-editorial-bottom">
          <p className="footer-copyright-text">
            © {currentYear} Drishti Atelier Inc. Engineered for Human Contours.
          </p>
          <div className="footer-bottom-links">
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} className="footer-sub-link">
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className="footer-sub-link replay-btn"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('drishti:replay-intro'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Replay Intro
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
