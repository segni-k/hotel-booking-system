'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useLanguage } from './LanguageContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('elitestay-token');
    if (savedToken) {
      setToken(savedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      fetchUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get<{ data: User }>('/auth/user');
      setUser(response.data.data);
    } catch {
      // Token expired or invalid
      clearAuth();
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('elitestay-token');
    delete api.defaults.headers.common['Authorization'];
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await api.post<{ data: AuthResponse }>('/auth/login', credentials);
      const { user, token } = response.data.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('elitestay-token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      toast.success(t.auth.login_success);
      return true;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || t.common.error);
      return false;
    }
  }, [t]);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await api.post<{ data: AuthResponse }>('/auth/register', data);
      const { user, token } = response.data.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('elitestay-token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      toast.success(t.auth.register_success);
      return true;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || t.common.error);
      return false;
    }
  }, [t]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors
    }
    clearAuth();
    toast.success(t.auth.logout_success);
  }, [t]);

  const refreshUser = useCallback(async () => {
    if (token) await fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
