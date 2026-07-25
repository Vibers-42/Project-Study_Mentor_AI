import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/auth.service';

const AuthContext = createContext(null);

const TOKEN_KEY = 'aism_token';
const USER_KEY  = 'aism_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(false);

  // Keep axios default header in sync
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      const accessToken = data.session?.access_token || data.token || null;
      // Write to localStorage immediately — before any state update triggers re-renders
      if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
      if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      setToken(accessToken);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, full_name) => {
    setIsLoading(true);
    try {
      const data = await authService.register(email, password, full_name);
      const accessToken = data.session?.access_token || data.token || null;
      if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
      if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      setToken(accessToken);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* silent */ }
    setUser(null);
    setToken(null);
  }, []);

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
