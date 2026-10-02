import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user from server using stored token
  const fetchCurrentUser = useCallback(async (authToken) => {
    try {
      const activeToken = authToken || token;
      if (!activeToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      if (response.data?.status === 'success' && response.data?.data?.user) {
        setUser(response.data.data.user);
      } else {
        // Token invalid or user not found
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.warn('Failed to restore auth session:', error?.response?.data?.message || error.message);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial session restoration on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  // Login handler (supports Email OR Phone number)
  const login = async (identifier, password) => {
    try {
      const response = await api.post('/auth/login', {
        identifier: identifier?.trim(),
        email: identifier?.trim(),
        phone: identifier?.trim(),
        password,
      });

      if (response.data?.status === 'success') {
        const loggedInUser = response.data.data?.user || response.data.user;
        const receivedToken = response.data.data?.token || response.data.token;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(loggedInUser);
        toast.success(`Welcome back, ${loggedInUser.name.split(' ')[0]}!`);
        return { success: true, user: loggedInUser };
      }

      throw new Error(response.data?.message || 'Login failed');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Invalid email/phone or password.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Register handler
  const register = async ({ name, full_name, email, phone, password }) => {
    try {
      const response = await api.post('/auth/register', {
        full_name: (name || full_name || '').trim(),
        name: (name || full_name || '').trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : undefined,
        password,
      });

      if (response.data?.status === 'success') {
        const newUser = response.data.data?.user || response.data.user;
        const receivedToken = response.data.data?.token || response.data.token;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(newUser);
        toast.success(`Account created! Welcome to Drishti, ${newUser.name.split(' ')[0]}.`);
        return { success: true, user: newUser };
      }

      throw new Error(response.data?.message || 'Registration failed');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Google OAuth Login handler (Backend-driven)
  const googleLogin = async ({ credential, code, access_token }) => {
    try {
      const response = await api.post('/auth/google', {
        credential,
        code,
        access_token,
      });

      if (response.data?.status === 'success') {
        const receivedUser = response.data.data?.user || response.data.user;
        const receivedToken = response.data.data?.token || response.data.token;

        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        toast.success(`Welcome to Drishti Atelier, ${receivedUser.name.split(' ')[0]}!`);
        return { success: true, user: receivedUser };
      }

      throw new Error(response.data?.message || 'Google authentication failed');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Google authentication failed.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Login with token handler (used for callback from OAuth redirect)
  const loginWithToken = async (receivedToken) => {
    try {
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      await fetchCurrentUser(receivedToken);
      toast.success('Signed in successfully via Google!');
      return { success: true };
    } catch (error) {
      const msg = error.message || 'Failed to authenticate with token.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      toast.success('You have been signed out.');
    }
  };

  // Update user state locally
  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    googleLogin,
    loginWithToken,
    logout,
    updateUser,
    refreshUser: () => fetchCurrentUser(token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
