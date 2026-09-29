import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-stone-800 border-t-[#F97D01] rounded-full animate-spin mb-4" />
        <p className="text-stone-400 text-xs tracking-widest uppercase font-mono">
          Authenticating Atelier Access...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <span className="text-xs uppercase tracking-widest text-[#F97D01] font-mono mb-2">
          403 — Unauthorized
        </span>
        <h2 className="text-2xl font-light tracking-tight text-white mb-3">
          Atelier Privileges Required
        </h2>
        <p className="text-stone-400 text-sm max-w-md mb-8">
          This sector is restricted to administrators of the Drishti Atelier. Your current account does not have permission to view this console.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-xs tracking-widest uppercase bg-white text-black font-medium hover:bg-stone-200 transition-colors"
        >
          Return to Overview
        </a>
      </div>
    );
  }

  return children ? children : <Outlet />;
}
