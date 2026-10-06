import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import GoogleAuthButton from '../../components/GoogleAuthButton/GoogleAuthButton';
import './Auth.css';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to the page user originally attempted to visit or account/admin
  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter your email address or phone number, and passcode.');
      return;
    }

    setSubmitting(true);
    const result = await login(identifier, password);
    setSubmitting(false);

    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate((from && from.startsWith('/admin')) ? from : '/admin', { replace: true });
      } else if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/account', { replace: true });
      }
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleGoogleSuccess = async (googleData) => {
    setErrorMessage('');
    setSubmitting(true);
    const result = await googleLogin(googleData);
    setSubmitting(false);

    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate((from && from.startsWith('/admin')) ? from : '/admin', { replace: true });
      } else if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/account', { replace: true });
      }
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleDemoFill = (demoId, demoPass) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setErrorMessage('');
  };

  const isPhone = identifier && !identifier.includes('@') && /\d/.test(identifier);

  return (
    <div className="auth-page" id="login-view">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <Link to="/" className="auth-brand-link">
            <img src="/logo.svg" alt="Drishti" className="auth-brand-emblem" />
            <span className="auth-brand-name">
              DRISHTI <span className="auth-brand-tag">ATELIER</span>
            </span>
          </Link>
          <h1 className="auth-title">Client Authentication</h1>
          <p className="auth-subtitle">Access your curated bespoke eyewear archive</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card-accent" />

          {/* Error Banner */}
          {errorMessage && (
            <div className="auth-error-banner">
              <span className="auth-error-icon">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email or Phone Field */}
            <div>
              <label htmlFor="login-identifier" className="auth-field-label">
                Email Address or Phone Number
              </label>
              <div className="auth-input-wrap">
                <span className={`auth-input-icon ${isPhone ? 'icon-active' : ''}`}>
                  {isPhone ? <HiOutlinePhone size={17} /> : <HiOutlineEnvelope size={17} />}
                </span>
                <input
                  id="login-identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@domain.com or +880 1234 567890"
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="auth-field-row">
                <label htmlFor="login-password" className="auth-field-label" style={{ marginBottom: 0 }}>
                  Passcode
                </label>
                <button
                  type="button"
                  onClick={() => alert('For password recovery, please contact concierge@drishtiatelier.com')}
                  className="auth-forgot-link"
                >
                  Forgot passcode?
                </button>
              </div>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <HiOutlineLockClosed size={17} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="auth-input"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-input-right-btn"
                  aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? <HiOutlineEyeSlash size={17} /> : <HiOutlineEye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="auth-remember-row">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="auth-checkbox"
              />
              <label htmlFor="remember-me" className="auth-remember-label">
                Remember this workstation
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={submitting} className="auth-submit-btn">
              {submitting ? (
                <>
                  <div className="auth-spinner" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Atelier</span>
                  <HiOutlineArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or authenticate with</span>
          </div>

          {/* Google Sign-In Button */}
          <GoogleAuthButton
            id="login-google-btn"
            onSuccess={handleGoogleSuccess}
            onError={(err) => setErrorMessage(err)}
            disabled={submitting}
            text="Continue with Google"
          />

          {/* Demo Accounts */}
          <div className="auth-demo-section">
            <div className="auth-demo-header">
              <HiOutlineShieldCheck size={14} />
              <span>Instant Evaluation Credentials</span>
            </div>
            <div className="auth-demo-grid">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@drishtiatelier.com', 'Admin@123')}
                className="auth-demo-btn"
              >
                <span className="auth-demo-btn-title">Atelier Admin</span>
                <span className="auth-demo-btn-email">admin@drishtiatelier.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('rahim@example.com', 'Customer@123')}
                className="auth-demo-btn"
              >
                <span className="auth-demo-btn-title">Patron Client</span>
                <span className="auth-demo-btn-email">rahim@example.com</span>
              </button>
            </div>
          </div>
        </div>

        {/* Register Footer Link */}
        <p className="auth-footer">
          New to Drishti?{' '}
          <Link to="/register" className="auth-footer-link">
            Create your client dossier
          </Link>
        </p>
      </div>
    </div>
  );
}
