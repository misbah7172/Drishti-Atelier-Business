/**
 * Drishti Atelier — Cart Context
 * Manages cart state with:
 *  - Guest cart via localStorage (unauthenticated users)
 *  - Server cart via API (authenticated users)
 *  - Cart merge on login
 *  - Stock validation
 */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'drishti_guest_cart';

// ──────────────────────────────────────────
// Guest cart helpers (localStorage)
// ──────────────────────────────────────────
function loadGuestCart() {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage might be full or disabled
  }
}

function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  // Cart state
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    items_count: 0,
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevAuthRef = useRef(isAuthenticated);

  // ──────────────────────────────────────────
  // Compute guest cart summary
  // ──────────────────────────────────────────
  const computeGuestSummary = useCallback((cartItems) => {
    const itemsCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const shipping = subtotal > 2000 || cartItems.length === 0 ? 0 : 60;
    return {
      items_count: itemsCount,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      discount: 0,
      total: parseFloat((subtotal + shipping).toFixed(2)),
    };
  }, []);

  // ──────────────────────────────────────────
  // Fetch cart from server (authenticated)
  // ──────────────────────────────────────────
  const fetchServerCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/cart');
      const data = response.data.data;
      setItems(data.items);
      setSummary(data.summary);
    } catch (err) {
      console.error('Cart fetch error:', err);
      setError('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // ──────────────────────────────────────────
  // Apply server response to state
  // ──────────────────────────────────────────
  const applyServerResponse = (data) => {
    setItems(data.items);
    setSummary(data.summary);
  };

  // ──────────────────────────────────────────
  // Load cart on mount and auth state change
  // ──────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      // User just logged in — merge guest cart
      const wasGuest = !prevAuthRef.current;
      prevAuthRef.current = true;

      if (wasGuest) {
        const guestItems = loadGuestCart();
        if (guestItems.length > 0) {
          // Merge guest cart into server cart
          api.post('/cart/merge', {
            items: guestItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
          })
            .then((res) => {
              applyServerResponse(res.data.data);
              clearGuestCart();
            })
            .catch(() => {
              fetchServerCart();
              clearGuestCart();
            });
        } else {
          fetchServerCart();
        }
      } else {
        fetchServerCart();
      }
    } else {
      prevAuthRef.current = false;
      // Load guest cart
      const guestItems = loadGuestCart();
      setItems(guestItems);
      setSummary(computeGuestSummary(guestItems));
    }
  }, [isAuthenticated, fetchServerCart, computeGuestSummary]);

  // ──────────────────────────────────────────
  // Add to cart
  // ──────────────────────────────────────────
  const addToCart = useCallback(async (product, quantity = 1) => {
    setError(null);

    if (isAuthenticated) {
      // Server cart
      try {
        const res = await api.post('/cart', {
          product_id: product.id || product.product_id,
          quantity,
        });
        applyServerResponse(res.data.data);
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to add to cart';
        setError(msg);
        return { success: false, message: msg };
      }
    } else {
      // Guest cart
      const guestItems = loadGuestCart();
      const existingIdx = guestItems.findIndex(
        (i) => i.product_id === (product.id || product.product_id)
      );

      if (existingIdx >= 0) {
        guestItems[existingIdx].quantity += quantity;
        // Basic stock check for guest cart
        if (product.stock && guestItems[existingIdx].quantity > product.stock) {
          guestItems[existingIdx].quantity = product.stock;
        }
      } else {
        guestItems.push({
          id: `guest-${Date.now()}`,
          product_id: product.id || product.product_id,
          quantity,
          name: product.name,
          slug: product.slug,
          price: parseFloat(product.price),
          compare_price: product.comparePrice || product.compare_price || null,
          image: product.image || product.primary_image || '/images/blue-aviator.png',
          stock: product.stock || 999,
          brand: product.brand || '',
          frame_color: product.frame_color || '',
        });
      }

      saveGuestCart(guestItems);
      setItems([...guestItems]);
      setSummary(computeGuestSummary(guestItems));
      return { success: true };
    }
  }, [isAuthenticated, computeGuestSummary]);

  // ──────────────────────────────────────────
  // Update quantity
  // ──────────────────────────────────────────
  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    setError(null);

    if (isAuthenticated) {
      try {
        const res = await api.put(`/cart/${itemId}`, { quantity: newQuantity });
        applyServerResponse(res.data.data);
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to update quantity';
        setError(msg);
        return { success: false, message: msg };
      }
    } else {
      const guestItems = loadGuestCart();
      if (newQuantity <= 0) {
        const filtered = guestItems.filter((i) => i.id !== itemId);
        saveGuestCart(filtered);
        setItems([...filtered]);
        setSummary(computeGuestSummary(filtered));
      } else {
        const idx = guestItems.findIndex((i) => i.id === itemId);
        if (idx >= 0) {
          guestItems[idx].quantity = Math.min(newQuantity, guestItems[idx].stock || 999);
        }
        saveGuestCart(guestItems);
        setItems([...guestItems]);
        setSummary(computeGuestSummary(guestItems));
      }
      return { success: true };
    }
  }, [isAuthenticated, computeGuestSummary]);

  // ──────────────────────────────────────────
  // Remove item
  // ──────────────────────────────────────────
  const removeItem = useCallback(async (itemId) => {
    setError(null);

    if (isAuthenticated) {
      try {
        const res = await api.delete(`/cart/${itemId}`);
        applyServerResponse(res.data.data);
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to remove item';
        setError(msg);
        return { success: false, message: msg };
      }
    } else {
      const guestItems = loadGuestCart().filter((i) => i.id !== itemId);
      saveGuestCart(guestItems);
      setItems([...guestItems]);
      setSummary(computeGuestSummary(guestItems));
      return { success: true };
    }
  }, [isAuthenticated, computeGuestSummary]);

  // ──────────────────────────────────────────
  // Clear cart
  // ──────────────────────────────────────────
  const clearCartAction = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      clearGuestCart();
    }
    setItems([]);
    setSummary({ items_count: 0, subtotal: 0, shipping: 0, discount: 0, total: 0 });
  }, [isAuthenticated]);

  // ──────────────────────────────────────────
  // Check if product is in cart
  // ──────────────────────────────────────────
  const isInCart = useCallback((productId) => {
    return items.some((i) => (i.product_id || i.id) === productId);
  }, [items]);

  // Derived
  const itemCount = summary.items_count;
  const isEmpty = items.length === 0;

  const value = {
    items,
    summary,
    itemCount,
    isEmpty,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart: clearCartAction,
    isInCart,
    refreshCart: fetchServerCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
