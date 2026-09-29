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
  HiOutlineCheck,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

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

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  // Password strength calculation
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-stone-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Standard', color: 'bg-orange-500' };
    if (score <= 4) return { score: 2, label: 'Secure', color: 'bg-yellow-400' };
    return { score: 3, label: 'Atelier Vault Grade', color: 'bg-[#F97D01]' };
  };

  const strength = calculateStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (formData.name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Passcode must be at least 6 characters long.');
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
            Client Registration
          </h1>
          <p className="text-xs text-stone-400 uppercase tracking-widest mt-2">
            Establish your personal patron profile & bespoke records
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0E0E0E] border border-[#222] p-6 sm:p-8 rounded-lg shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F97D01] to-transparent opacity-80" />

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 rounded text-red-200 text-xs flex items-start gap-2">
              <span className="text-red-400 font-bold">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label
                htmlFor="register-name"
                className="block text-[11px] uppercase tracking-wider text-stone-300 font-medium mb-1.5"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <HiOutlineUser size={17} />
                </div>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Liam Sterling"
                  className="w-full bg-[#151515] border border-[#2a2a2a] focus:border-[#F97D01] focus:ring-1 focus:ring-[#F97D01] rounded py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-600 transition-colors outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="register-email"
                className="block text-[11px] uppercase tracking-wider text-stone-300 font-medium mb-1.5"
              >
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <HiOutlineEnvelope size={17} />
                </div>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="client@drishtiatelier.com"
                  className="w-full bg-[#151515] border border-[#2a2a2a] focus:border-[#F97D01] focus:ring-1 focus:ring-[#F97D01] rounded py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-600 transition-colors outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="register-phone"
                className="block text-[11px] uppercase tracking-wider text-stone-300 font-medium mb-1.5"
              >
                Phone Number <span className="text-stone-500 text-[10px] lowercase">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <HiOutlinePhone size={17} />
                </div>
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1700 000000"
                  className="w-full bg-[#151515] border border-[#2a2a2a] focus:border-[#F97D01] focus:ring-1 focus:ring-[#F97D01] rounded py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-600 transition-colors outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-[11px] uppercase tracking-wider text-stone-300 font-medium mb-1.5"
              >
                Passcode * <span className="text-stone-500 text-[10px] lowercase">(min 6 characters)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <HiOutlineLockClosed size={17} />
                </div>
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-[#222] rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength.score >= 1 ? strength.color : 'bg-transparent'
                      } ${strength.score >= 1 ? 'w-1/3' : 'w-0'}`}
                    />
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength.score >= 2 ? strength.color : 'bg-transparent'
                      } ${strength.score >= 2 ? 'w-1/3' : 'w-0'}`}
                    />
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength.score >= 3 ? strength.color : 'bg-transparent'
                      } ${strength.score >= 3 ? 'w-1/3' : 'w-0'}`}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono tracking-wider uppercase">
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className="block text-[11px] uppercase tracking-wider text-stone-300 font-medium mb-1.5"
              >
                Confirm Passcode *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <HiOutlineLockClosed size={17} />
                </div>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full bg-[#151515] border border-[#2a2a2a] focus:border-[#F97D01] focus:ring-1 focus:ring-[#F97D01] rounded py-2.5 pl-10 pr-11 text-sm text-white placeholder-stone-600 transition-colors outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showConfirmPassword ? <HiOutlineEyeSlash size={17} /> : <HiOutlineEye size={17} />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start pt-1">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded bg-[#151515] border-[#2a2a2a] text-[#F97D01] focus:ring-[#F97D01] focus:ring-offset-0 cursor-pointer"
              />
              <label
                htmlFor="agree-terms"
                className="ml-2.5 text-[11px] text-stone-400 cursor-pointer select-none leading-relaxed"
              >
                I agree to the{' '}
                <Link to="/terms" className="text-white hover:text-[#F97D01] underline underline-offset-2">
                  Atelier Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-white hover:text-[#F97D01] underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#F97D01] hover:bg-[#E06F00] active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-widest py-3.5 px-4 rounded transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F97D01]/10 mt-3"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
        </div>

        {/* Login Footer Link */}
        <p className="text-center text-xs text-stone-400 mt-6">
          Already have an Atelier dossier?{' '}
          <Link
            to="/login"
            className="text-white hover:text-[#F97D01] font-medium underline underline-offset-4 decoration-[#F97D01]/50 hover:decoration-[#F97D01] transition-colors"
          >
            Sign in to your account
          </Link>
        </p>
      </div>
    </div>
  );
}
