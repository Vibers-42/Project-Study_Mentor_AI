import axios from 'axios';
import { API_BASE_URL } from '../constants';

const TOKEN_KEY = 'aism_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s — AI responses can be slow
});

// --- Request Interceptor: attach bearer token ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor: handle 401 ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('aism_user');
      // Redirect to login (avoid circular import — use window.location)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Unwrap error message from backend for convenience
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
