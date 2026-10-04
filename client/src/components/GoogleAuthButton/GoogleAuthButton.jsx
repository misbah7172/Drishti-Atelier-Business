import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../../services/api';

/**
 * Google "G" multicolor official vector icon
 */
export function GoogleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function GoogleAuthButton({
  onSuccess,
  onError,
  disabled = false,
  text = 'Continue with Google',
  id = 'google-auth-btn',
}) {
  const [loading, setLoading] = useState(false);

  // useGoogleLogin with auth-code flow verified against backend
  const triggerGooglePopup = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        await onSuccess({ code: codeResponse.code });
      } catch (err) {
        onError?.(err.message || 'Google authentication failed.');
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.warn('Google Sign-In popup closed or failed:', errorResponse);
      setLoading(false);
      if (errorResponse?.error !== 'popup_closed_by_user') {
        onError?.(errorResponse?.error_description || 'Google sign-in was interrupted.');
      }
    },
  });

  // Fallback: direct server-side OAuth redirect if popups are restricted
  const handleDirectRedirect = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/google/url');
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('Could not obtain Google authorization URL');
      }
    } catch (err) {
      setLoading(false);
      onError?.('Direct Google authorization failed. Please try again.');
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (disabled || loading) return;
    try {
      triggerGooglePopup();
    } catch (err) {
      console.warn('Popup initialization failed, falling back to direct redirect', err);
      handleDirectRedirect();
    }
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className="w-full bg-[#FFFFFF] hover:bg-[#F8F8FA] active:scale-[0.99] border border-[#DCDCE0] hover:border-[#A0A0A8] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-stone-400 border-t-[#0A0A0A] rounded-full animate-spin" />
          <span className="text-stone-600">Connecting to Google...</span>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <GoogleIcon className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-[#111111] group-hover:text-[#000000] transition-colors">
            {text}
          </span>
        </>
      )}
    </button>
  );
}
