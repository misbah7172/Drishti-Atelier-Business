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
      if (from) {
        navigate(from, { replace: true });
      } else if (result.user.role === 'admin') {
        navigate('/admin', { replace: true });
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
      if (from) {
        navigate(from, { replace: true });
      } else if (result.user.role === 'admin') {
        navigate('/admin', { replace: true });
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

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-[#070707] text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <img src="/logo.svg" alt="Drishti" className="w-8 h-8 opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="font-heading tracking-[0.25em] text-lg font-bold text-white">
              DRISHTI <span className="text-[#F97D01] text-xs font-normal">ATELIER</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-white">
            Client Authentication
          </h1>
          <p className="text-xs text-stone-400 uppercase tracking-widest mt-2">
            Access your curated bespoke eyewear archive
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0E0E0E] border border-[#222] p-6 sm:p-8 rounded-lg shadow-2xl relative overflow-hidden">
          {/* Subtle accent hairline */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F97D01] to-transparent opacity-80" />

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 rounded text-red-200 text-xs flex items-start gap-2">
              <span className="text-red-400 font-bold">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email or Phone Field */}
            <div>
              <label
                htmlFor="login-identifier"
                className="block text-[11px] uppercase tracking-wider text-stone-300 font-medium mb-1.5"
              >
                Email Address or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  {identifier && !identifier.includes('@') && /\d/.test(identifier) ? (
                    <HiOutlinePhone size={17} className="text-[#F97D01]" />
                  ) : (
                    <HiOutlineEnvelope size={17} />
                  )}
                </div>
                <input
                  id="login-identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@domain.com or +1 234 567 8900"
                  className="w-full bg-[#151515] border border-[#2a2a2a] focus:border-[#F97D01] focus:ring-1 focus:ring-[#F97D01] rounded py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-600 transition-colors outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="text-[11px] uppercase tracking-wider text-stone-300 font-medium"
                >
                  Passcode
                </label>
                <button
                  type="button"
                  onClick={() => alert('For password recovery, please contact concierge@drishtiatelier.com')}
                  className="text-[11px] text-stone-400 hover:text-[#F97D01] transition-colors"
                >
                  Forgot passcode?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <HiOutlineLockClosed size={17} />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#151515] border border-[#2a2a2a] focus:border-[#F97D01] focus:ring-1 focus:ring-[#F97D01] rounded py-2.5 pl-10 pr-11 text-sm text-white placeholder-stone-600 transition-colors outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition-colors"
                  aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? <HiOutlineEyeSlash size={17} /> : <HiOutlineEye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#151515] border-[#2a2a2a] text-[#F97D01] focus:ring-[#F97D01] focus:ring-offset-0 cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2.5 text-xs text-stone-400 cursor-pointer select-none"
              >
                Remember this workstation
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#F97D01] hover:bg-[#E06F00] active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-widest py-3.5 px-4 rounded transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F97D01]/10 mt-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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

          {/* Luxury Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#222]" />
            </div>
            <span className="relative bg-[#0E0E0E] px-3 text-[10px] text-stone-500 uppercase tracking-widest font-mono">
              or authenticate with
            </span>
          </div>

          {/* Google Sign-In Button */}
          <GoogleAuthButton
            id="login-google-btn"
            onSuccess={handleGoogleSuccess}
            onError={(err) => setErrorMessage(err)}
            disabled={submitting}
            text="Continue with Google"
          />

          {/* Fast Evaluation Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-[#1f1f1f]">
            <div className="flex items-center gap-1.5 text-[10px] text-stone-500 uppercase tracking-widest mb-3">
              <HiOutlineShieldCheck size={14} className="text-[#F97D01]" />
              <span>Instant Evaluation Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@drishtiatelier.com', 'Admin@123')}
                className="text-left p-2.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#252525] hover:border-[#383838] rounded transition-all group"
              >
                <div className="text-[11px] font-medium text-white group-hover:text-[#F97D01] transition-colors">
                  Atelier Admin
                </div>
                <div className="text-[10px] text-stone-500 font-mono truncate">
                  admin@drishtiatelier.com
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('rahim@example.com', 'Customer@123')}
                className="text-left p-2.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#252525] hover:border-[#383838] rounded transition-all group"
              >
                <div className="text-[11px] font-medium text-white group-hover:text-[#F97D01] transition-colors">
                  Patron Client
                </div>
                <div className="text-[10px] text-stone-500 font-mono truncate">
                  rahim@example.com
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Register Footer Link */}
        <p className="text-center text-xs text-stone-400 mt-6">
          New to Drishti?{' '}
          <Link
            to="/register"
            className="text-white hover:text-[#F97D01] font-medium underline underline-offset-4 decoration-[#F97D01]/50 hover:decoration-[#F97D01] transition-colors"
          >
            Create your client dossier
          </Link>
        </p>
      </div>
    </div>
  );
}
