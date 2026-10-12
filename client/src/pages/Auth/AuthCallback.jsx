import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth Callback Error:', error);
      toast.error(`Authentication error: ${error}`);
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      loginWithToken(token).then((res) => {
        if (res.success) {
          navigate('/account', { replace: true });
        } else {
          toast.error(res.error || 'Failed to authenticate session.');
          navigate('/login', { replace: true });
        }
      });
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#070707] text-white px-4">
      <div className="w-8 h-8 border-2 border-[#F97D01]/30 border-t-[#F97D01] rounded-full animate-spin mb-4" />
      <h2 className="text-sm font-medium uppercase tracking-widest text-stone-300">
        Verifying Atelier Credentials
      </h2>
      <p className="text-xs text-stone-500 mt-2">
        Synchronizing your Google authentication with Drishti...
      </p>
    </div>
  );
}
