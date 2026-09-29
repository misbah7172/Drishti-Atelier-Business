import { Link } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

export default function Account() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '2026';

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-[80vh] bg-[#070707] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Profile Card */}
        <div className="bg-[#0E0E0E] border border-[#222] rounded-lg p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F97D01] to-transparent opacity-80" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar Initial */}
              <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#333] flex items-center justify-center text-xl font-heading font-bold text-[#F97D01] shadow-inner">
                {userInitial}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-light tracking-wide text-white">
                    {user.name}
                  </h1>
                  <span
                    className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded ${
                      isAdmin
                        ? 'bg-[#F97D01]/10 text-[#F97D01] border border-[#F97D01]/30'
                        : 'bg-stone-800 text-stone-300 border border-stone-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-stone-400 font-mono">{user.email}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#141414] hover:bg-[#1f1f1f] border border-[#282828] hover:border-stone-600 rounded text-xs text-stone-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              <HiOutlineArrowRightOnRectangle size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Details & Quick Sectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dossier Information */}
          <div className="md:col-span-1 bg-[#0E0E0E] border border-[#222] rounded-lg p-6">
            <h2 className="text-xs uppercase tracking-widest text-[#F97D01] font-mono mb-4 flex items-center gap-1.5">
              <HiOutlineShieldCheck size={15} />
              <span>Dossier Specs</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase">Client ID</span>
                <span className="font-mono text-stone-200">#DRS-{String(user.id).padStart(4, '0')}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase">Telephone</span>
                <span className="text-stone-200">{user.phone || 'None on record'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase">Patron Since</span>
                <span className="text-stone-200">{formattedDate}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase">Account Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="md:col-span-2 space-y-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="block bg-gradient-to-r from-[#141414] to-[#1a140f] border border-[#F97D01]/40 hover:border-[#F97D01] rounded-lg p-5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#F97D01]/10 text-[#F97D01] flex items-center justify-center">
                      <HiOutlineCog6Tooth size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white group-hover:text-[#F97D01] transition-colors">
                        Atelier Administration Console
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Manage inventory, curate catalog, and monitor patron orders
                      </p>
                    </div>
                  </div>
                  <span className="text-stone-500 group-hover:text-white transition-colors">→</span>
                </div>
              </Link>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/account/orders"
                className="bg-[#0E0E0E] hover:bg-[#141414] border border-[#222] hover:border-[#333] rounded-lg p-5 transition-all group block"
              >
                <div className="w-8 h-8 rounded bg-[#181818] text-stone-300 flex items-center justify-center mb-3 group-hover:text-[#F97D01] transition-colors">
                  <HiOutlineShoppingBag size={17} />
                </div>
                <h3 className="text-sm font-medium text-white">Acquisition History</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Track bespoke shipments & receipts
                </p>
              </Link>

              <Link
                to="/wishlist"
                className="bg-[#0E0E0E] hover:bg-[#141414] border border-[#222] hover:border-[#333] rounded-lg p-5 transition-all group block"
              >
                <div className="w-8 h-8 rounded bg-[#181818] text-stone-300 flex items-center justify-center mb-3 group-hover:text-[#F97D01] transition-colors">
                  <HiOutlineHeart size={17} />
                </div>
                <h3 className="text-sm font-medium text-white">Saved Atelier Pieces</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Your personal curated shortlist
                </p>
              </Link>
            </div>

            <div className="bg-[#0E0E0E] border border-[#222] rounded-lg p-5">
              <h3 className="text-xs uppercase tracking-wider text-stone-400 font-mono mb-2">
                Atelier Concierge
              </h3>
              <p className="text-xs text-stone-400 mb-3">
                Need custom prescription alignment, titanium frame adjustments, or bespoke sizing?
              </p>
              <Link
                to="/contact"
                className="text-xs text-[#F97D01] hover:text-[#E06F00] font-medium tracking-wide uppercase inline-flex items-center gap-1"
              >
                <span>Initiate Concierge Request</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
