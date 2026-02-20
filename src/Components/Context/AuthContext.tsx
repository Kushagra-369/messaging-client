import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { APIURL } from "../../GlobalAPIURL";

/* ===================== GLOBAL AXIOS CONFIG ===================== */

axios.defaults.withCredentials = true;

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

interface AuthResponse {
  user?: User;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  clearError: () => void;
}

/* ===================== CONTEXT ===================== */

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => false,
  logout: async () => {},
  updateUser: () => {},
  clearError: () => {},
});

/* ===================== PROVIDER ===================== */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* ===================== SPAM GUARD FIX ===================== */

  const requestTimestamps = React.useRef<number[]>([]);

  /* ===================== CLEAR AUTH ===================== */

  const clearAuth = () => {
    setUser(null);
    setError(null);
  };

  /* ===================== INIT AUTH (COOKIE BASED) ===================== */

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${APIURL}/auth_me`);

        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  /* ===================== LOGIN ===================== */

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post<AuthResponse>(
        `${APIURL}/user_login`,
        { email, password }
      );

      if (res.data.user) {
        setUser(res.data.user);
        return true;
      }

      setError(res.data.message || "Login failed");
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ===================== LOGOUT (REAL FIX) ===================== */

  const logout = async () => {
    try {
      await axios.post(`${APIURL}/logout`);
    } catch {}

    clearAuth();
  };

  /* ===================== UPDATE USER ===================== */

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;

    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
  };

  const clearError = () => setError(null);

  /* ===================== AXIOS INTERCEPTORS ===================== */

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      const now = Date.now();

      requestTimestamps.current.push(now);

      while (
        requestTimestamps.current.length &&
        now - requestTimestamps.current[0] > 1000
      ) {
        requestTimestamps.current.shift();
      }

      // 🔥 SPAM PROTECTION
      if (requestTimestamps.current.length >= 10) {
        setError("⚠️ Too many requests detected.");
        return Promise.reject("Too many requests");
      }

      return config;
    });

    const resInterceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.data?.type === "ROBOT_CHECK") {
          window.location.href = "/robot-check";
          return Promise.reject(err);
        }

        // 🔐 AUTO LOGOUT IF COOKIE INVALID
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

  /* ===================== VALUE ===================== */

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ===================== HOOK ===================== */

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};