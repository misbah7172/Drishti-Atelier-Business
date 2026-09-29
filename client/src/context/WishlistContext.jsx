/**
 * Drishti Atelier — Wishlist Context
 * Server-synced wishlist for authenticated users
 * Local state for unauthenticated browsing
 */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const WishlistContext = createContext(null);

const GUEST_WISHLIST_KEY = 'drishti_guest_wishlist';

function loadGuestWishlist() {
  try {
    const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveGuestWishlist(ids) {
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(ids));
  } catch {}
}

function clearGuestWishlist() {
  localStorage.removeItem(GUEST_WISHLIST_KEY);
}

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const prevAuthRef = useRef(isAuthenticated);

  // ──────────────────────────────────────────
  // Fetch wishlist from server
  // ──────────────────────────────────────────
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await api.get('/wishlist');
      const wishlistItems = res.data.data.items;
      setItems(wishlistItems);
      setWishlistIds(new Set(wishlistItems.map((i) => i.product_id)));
    } catch (err) {
      console.error('Wishlist fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // ──────────────────────────────────────────
  // Load wishlist on mount and auth change
  // ──────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
      // Clear guest wishlist on login
      if (!prevAuthRef.current) {
        clearGuestWishlist();
      }
      prevAuthRef.current = true;
    } else {
      prevAuthRef.current = false;
      // Load guest wishlist IDs
      const guestIds = loadGuestWishlist();
      setWishlistIds(new Set(guestIds));
      setItems([]); // No full product data for guest
    }
  }, [isAuthenticated, fetchWishlist]);

  // ──────────────────────────────────────────
  // Toggle wishlist item
  // ──────────────────────────────────────────
  const toggleWishlist = useCallback(async (productId) => {
    const isCurrentlyWishlisted = wishlistIds.has(productId);

    if (isAuthenticated) {
      try {
        if (isCurrentlyWishlisted) {
          await api.delete(`/wishlist/${productId}`);
          setItems((prev) => prev.filter((i) => i.product_id !== productId));
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
          });
        } else {
          await api.post('/wishlist', { product_id: productId });
          setWishlistIds((prev) => new Set(prev).add(productId));
          // Refetch to get full product data
          fetchWishlist();
        }
        return { success: true, added: !isCurrentlyWishlisted };
      } catch (err) {
        console.error('Wishlist toggle error:', err);
        return { success: false, message: err.response?.data?.message || 'Failed' };
      }
    } else {
      // Guest wishlist — just track IDs
      const guestIds = loadGuestWishlist();
      let added;
      if (isCurrentlyWishlisted) {
        const filtered = guestIds.filter((id) => id !== productId);
        saveGuestWishlist(filtered);
        setWishlistIds(new Set(filtered));
        added = false;
      } else {
        guestIds.push(productId);
        saveGuestWishlist(guestIds);
        setWishlistIds(new Set(guestIds));
        added = true;
      }
      return { success: true, added };
    }
  }, [isAuthenticated, wishlistIds, fetchWishlist]);

  // ──────────────────────────────────────────
  // Check if product is wishlisted
  // ──────────────────────────────────────────
  const isWishlisted = useCallback((productId) => {
    return wishlistIds.has(productId);
  }, [wishlistIds]);

  const value = {
    items,
    wishlistIds,
    count: wishlistIds.size,
    isLoading,
    toggleWishlist,
    isWishlisted,
    refreshWishlist: fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export default WishlistContext;
