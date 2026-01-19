// context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { APIURL } from '../../GlobalAPIURL';

/* ===================== TYPES ===================== */

export interface User {
  _id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profileImg: {
    public_id: string;
    secure_url: string;
  };
  gender: string;
  bio: string;
  isOnline: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  gender: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  clearError: () => void;
}

/* ===================== CONTEXT ===================== */

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUser: () => {},
  clearError: () => {},
});

/* ===================== PROVIDER ===================== */

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* ===================== INIT AUTH ===================== */

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /* ===================== HELPERS ===================== */

  const clearAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  /* ===================== LOGIN ===================== */

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post<AuthResponse>(`${APIURL}/login`, {
        email,
        password,
      });

      if (res.data.success && res.data.token && res.data.user) {
        localStorage.setItem('access_token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      }

      setError(res.data.message || 'Login failed');
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ===================== REGISTER ===================== */

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post<AuthResponse>(`${APIURL}/register`, data);

      if (res.data.success && res.data.token && res.data.user) {
        localStorage.setItem('access_token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      }

      setError(res.data.message || 'Registration failed');
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ===================== LOGOUT ===================== */

  const logout = () => {
    clearAuth();
  };

  /* ===================== UPDATE USER ===================== */

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const clearError = () => setError(null);

  /* ===================== AXIOS INTERCEPTORS ===================== */

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const resInterceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          clearAuth();
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  /* ===================== CONTEXT VALUE ===================== */

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ===================== HOOK ===================== */

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
