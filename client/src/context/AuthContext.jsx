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

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data?.status === 'success') {
        const { user: loggedInUser, token: receivedToken } = response.data.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(loggedInUser);
        toast.success(`Welcome back, ${loggedInUser.name.split(' ')[0]}!`);
        return { success: true, user: loggedInUser };
      }

      throw new Error(response.data?.message || 'Login failed');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Invalid email or password.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Register handler
  const register = async ({ name, email, phone, password }) => {
    try {
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : undefined,
        password,
      });

      if (response.data?.status === 'success') {
        const { user: newUser, token: receivedToken } = response.data.data;
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
