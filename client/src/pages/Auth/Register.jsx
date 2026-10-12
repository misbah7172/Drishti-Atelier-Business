import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import GoogleAuthButton from '../../components/GoogleAuthButton/GoogleAuthButton';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  // Password strength calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ['', 'Weak', 'Good', 'Strong'];
    const colors = ['', '#ef4444', '#F97D01', '#22c55e'];
    return { score, label: labels[score], color: colors[score] };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage('Name, email, and passcode are required.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Passcode must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passcodes do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('You must acknowledge the Atelier terms to proceed.');
      return;
    }

    setSubmitting(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });
    setSubmitting(false);

    if (result.success) {
      navigate('/account', { replace: true });
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
      navigate('/account', { replace: true });
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="auth-page" id="register-view">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <Link to="/" className="auth-brand-link">
            <img src="/logo.svg" alt="Drishti" className="auth-brand-emblem" />
            <span className="auth-brand-name">
              DRISHTI <span className="auth-brand-tag">ATELIER</span>
            </span>
          </Link>
          <h1 className="auth-title">Client Registration</h1>
          <p className="auth-subtitle">Establish your personal patron profile & bespoke records</p>
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
            {/* Full Name */}
            <div>
              <label htmlFor="register-name" className="auth-field-label">
                Full Name *
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <HiOutlineUser size={17} />
                </span>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Liam Sterling"
                  className="auth-input"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="register-email" className="auth-field-label">
                Email Address *
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <HiOutlineEnvelope size={17} />
                </span>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="client@drishtiatelier.com"
                  className="auth-input"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="register-phone" className="auth-field-label">
                Phone Number <span style={{ color: '#888', fontSize: '0.62rem' }}>(optional)</span>
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <HiOutlinePhone size={17} />
                </span>
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1700 000000"
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="auth-field-label">
                Passcode * <span style={{ color: '#888', fontSize: '0.62rem' }}>(min 6 characters)</span>
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <HiOutlineLockClosed size={17} />
                </span>
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ flex: 1, height: '3px', background: '#EAEAEA', borderRadius: '3px', display: 'flex', gap: '2px', overflow: 'hidden' }}>
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        style={{
                          flex: 1,
                          height: '100%',
                          borderRadius: '3px',
                          background: strength.score >= level ? strength.color : 'transparent',
                          transition: 'background 0.3s',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm-password" className="auth-field-label">
                Confirm Passcode *
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <HiOutlineLockClosed size={17} />
                </span>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="auth-input"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-input-right-btn"
                  aria-label={showConfirmPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showConfirmPassword ? <HiOutlineEyeSlash size={17} /> : <HiOutlineEye size={17} />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="auth-remember-row" style={{ alignItems: 'flex-start' }}>
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="auth-checkbox"
                style={{ marginTop: '2px' }}
              />
              <label htmlFor="agree-terms" className="auth-remember-label" style={{ fontSize: '0.7rem', lineHeight: 1.5, color: '#555' }}>
                I agree to the{' '}
                <Link to="/terms" style={{ color: '#0A0A0A', textDecoration: 'underline', textUnderlineOffset: '2px', fontWeight: 500 }}>
                  Atelier Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" style={{ color: '#0A0A0A', textDecoration: 'underline', textUnderlineOffset: '2px', fontWeight: 500 }}>
                  Privacy Policy
                </Link>.
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={submitting} className="auth-submit-btn">
              {submitting ? (
                <>
                  <div className="auth-spinner" />
                  <span>Enrolling...</span>
                </>
              ) : (
                <>
                  <span>Create Client Dossier</span>
                  <HiOutlineArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or enroll with</span>
          </div>

          {/* Google Sign-In Button */}
          <GoogleAuthButton
            id="register-google-btn"
            onSuccess={handleGoogleSuccess}
            onError={(err) => setErrorMessage(err)}
            disabled={submitting}
            text="Continue with Google"
          />
        </div>

        {/* Login Footer Link */}
        <p className="auth-footer">
          Already have an Atelier dossier?{' '}
          <Link to="/login" className="auth-footer-link">
            Sign in to your account
          </Link>
        </p>
      </div>
    </div>
  );
}
