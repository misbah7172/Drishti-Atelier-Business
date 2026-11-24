import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const API_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : rawApiUrl.endsWith('/')
    ? `${rawApiUrl}api`
    : `${rawApiUrl}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors & SPA fallback misroutes
api.interceptors.response.use(
  (response) => {
    // Detect if API endpoint returned HTML instead of expected JSON
    // (Happens when static hosting rewrites /api/* to index.html or backend is down)
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!doctype html') || response.data.includes('<html'))
    ) {
      const error = new Error(
        `[API Error] Endpoint '${response.config?.url}' returned HTML instead of JSON. Ensure the backend is deployed and Vercel Root Directory is './'.`
      );
      error.isHtmlFallback = true;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // Only redirect if not already on login/register page
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        // Will be enhanced with AuthContext in Phase 3
      }
    }
    return Promise.reject(error);
  }
);

export default api;
