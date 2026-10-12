import { Link } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineShieldCheck,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import './Account.css';

export default function Account() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Oct 2026';

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="account-page" id="account-portal">
      <div className="account-container">
        {/* Header Profile Card */}
        <div className="account-header-card">
          <div className="account-header-accent" />

          <div className="account-header-content">
            <div className="account-user-meta">
              {/* Avatar Initial */}
              <div className="account-avatar" aria-hidden="true">
                {userInitial}
              </div>
              <div className="account-user-details">
                <div className="account-name-row">
                  <h1 className="account-name">{user.name}</h1>
                  <span
                    className={`account-role-badge ${
                      isAdmin ? 'role-admin' : 'role-customer'
                    }`}
                  >
                    {isAdmin ? 'Administrator' : user.role || 'Patron'}
                  </span>
                </div>
                <p className="account-email">{user.email}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={logout}
              className="account-signout-btn"
              aria-label="Sign out of account"
            >
              <HiOutlineArrowRightOnRectangle size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Administration Console Access Banner */}
        {isAdmin && (
          <Link to="/admin" className="account-admin-card" id="admin-console-link">
            <div className="account-admin-inner">
              <div className="account-admin-left">
                <div className="account-admin-icon">
                  <HiOutlineCog6Tooth size={22} />
                </div>
                <div>
                  <h2 className="account-admin-title">
                    Atelier Administration Console
                  </h2>
                  <p className="account-admin-subtitle">
                    Manage inventory, curate catalog, update orders & review patrons
                  </p>
                </div>
              </div>
              <span className="account-admin-arrow" aria-hidden="true">→</span>
            </div>
          </Link>
        )}

        {/* Two-Column Grid: Dossier Specs & Sectors */}
        <div className="account-main-grid">
          {/* Left Column: Dossier Specs */}
          <aside className="dossier-card" aria-label="Account Dossier">
            <h2 className="dossier-card-title">
              <HiOutlineShieldCheck size={17} />
              <span>Dossier Specs</span>
            </h2>

            <div className="dossier-specs-list">
              <div className="dossier-spec-item">
                <span className="dossier-spec-label">Client ID</span>
                <span className="spec-mono">
                  #DRS-{String(user.id || 1).padStart(4, '0')}
                </span>
              </div>

              <div className="dossier-spec-item">
                <span className="dossier-spec-label">Telephone</span>
                <span className="dossier-spec-value">
                  {user.phone || 'None on record'}
                </span>
              </div>

              <div className="dossier-spec-item">
                <span className="dossier-spec-label">Patron Since</span>
                <span className="dossier-spec-value">{formattedDate}</span>
              </div>

              <div className="dossier-spec-item">
                <span className="dossier-spec-label">Account Status</span>
                <span className="spec-status-badge">
                  <span className="status-dot-active" aria-hidden="true" />
                  Active
                </span>
              </div>
            </div>
          </aside>

          {/* Right Column: Quick Action Sectors */}
          <main className="account-sectors-container">
            <div className="account-sectors-grid">
              <Link
                to="/account/orders"
                className="sector-card"
                id="link-acquisition-history"
              >
                <div className="sector-icon-wrap">
                  <HiOutlineShoppingBag size={20} />
                </div>
                <h3 className="sector-title">Acquisition History</h3>
                <p className="sector-desc">
                  Track bespoke shipments, receipts and delivery status
                </p>
              </Link>

              <Link
                to="/wishlist"
                className="sector-card"
                id="link-saved-pieces"
              >
                <div className="sector-icon-wrap">
                  <HiOutlineHeart size={20} />
                </div>
                <h3 className="sector-title">Saved Atelier Pieces</h3>
                <p className="sector-desc">
                  Your personal curated shortlist and bookmarked styles
                </p>
              </Link>

              <Link
                to="/account/profile"
                className="sector-card"
                id="link-profile-settings"
              >
                <div className="sector-icon-wrap">
                  <HiOutlineUser size={20} />
                </div>
                <h3 className="sector-title">Profile Settings</h3>
                <p className="sector-desc">
                  Edit patron name, email, contact telephone & passkey
                </p>
              </Link>

              <Link
                to="/account/addresses"
                className="sector-card"
                id="link-saved-addresses"
              >
                <div className="sector-icon-wrap">
                  <HiOutlineEnvelope size={20} />
                </div>
                <h3 className="sector-title">Saved Addresses</h3>
                <p className="sector-desc">
                  Manage multiple delivery residences and default shipping location
                </p>
              </Link>
            </div>

            {/* Concierge Support Block */}
            <div className="account-concierge-card">
              <h3 className="concierge-card-title">Atelier Concierge</h3>
              <p className="concierge-card-desc">
                Need custom prescription alignment, titanium frame adjustments, or bespoke sizing advice?
              </p>
              <Link to="/contact" className="concierge-card-link">
                <span>Initiate Concierge Request</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
