// context/AuthContext.tsx

import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { APIURL } from "../../GlobalAPIURL";

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
  logout: () => { },
  updateUser: () => { },
  clearError: () => { },
});

/* ===================== TOKEN VALIDATOR ===================== */

// 🔥 JWT must have 3 parts
// first & last length fixed (change according to your backend token)
const FIRST_LENGTH = 36;
const LAST_LENGTH = 43;

const validateTokenStructure = (token: string) => {
  const parts = token.split(".");

  if (parts.length !== 3) return false;

  const [first, middle, last] = parts;

  if (first.length !== FIRST_LENGTH) return false;
  if (last.length !== LAST_LENGTH) return false;
  if (!middle || middle.length < 10) return false;

  return true;
};

/* ===================== PROVIDER ===================== */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* ===================== API SPAM GUARD ===================== */

  const requestTimestamps: number[] = [];

  /* ===================== CLEAR AUTH ===================== */

  const clearAuth = () => {
    const theme = localStorage.getItem("theme");

    localStorage.clear();

    if (theme) localStorage.setItem("theme", theme);

    setUser(null);
    setToken(null);
    setError(null);
  };

  /* ===================== INIT AUTH ===================== */

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("access_token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      // 🔥 token structure check
      if (!validateTokenStructure(storedToken)) {
        clearAuth();
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${APIURL}/auth_me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.data?.user) {
          setUser(res.data.user);
          setToken(storedToken);
          localStorage.setItem("user", JSON.stringify(res.data.user));
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

  /* ===================== STORAGE LISTENER (NO POLLING) ===================== */

  useEffect(() => {
    const handleStorage = async () => {
      const storedToken = localStorage.getItem("access_token");

      if (!storedToken) {
        clearAuth();
        return;
      }

      if (!validateTokenStructure(storedToken)) {
        clearAuth();
        return;
      }

      if (storedToken !== token) {
        try {
          const res = await axios.get(`${APIURL}/auth_me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          if (!res.data?.user) {
            clearAuth();
          } else {
            setToken(storedToken);
            setUser(res.data.user);
          }
        } catch {
          clearAuth();
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [token]);

  /* ===================== LOGIN ===================== */

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post<AuthResponse>(`${APIURL}/user_login`, {
        email,
        password,
      });

      if (res.data.token && res.data.user) {
        // 🔥 TOKEN STRUCTURE CHECK
        if (!validateTokenStructure(res.data.token)) {
          setError("Invalid token format");
          return false;
        }

        localStorage.setItem("access_token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setToken(res.data.token);
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

  /* ===================== LOGOUT ===================== */

  const logout = () => {
    clearAuth();
  };

  /* ===================== UPDATE USER ===================== */

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;

    const newUser = { ...user, ...updatedUser };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const clearError = () => setError(null);

  /* ===================== AXIOS INTERCEPTORS ===================== */

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      const now = Date.now();

      requestTimestamps.push(now);

      while (
        requestTimestamps.length &&
        now - requestTimestamps[0] > 1000
      ) {
        requestTimestamps.shift();
      }

      // 🔥 SPAM PROTECTION
      if (requestTimestamps.length >= 10) {
        setError("⚠️ I am not a robot — Too many requests detected.");
        return Promise.reject("Too many requests");
      }

      const accessToken = localStorage.getItem("access_token");

      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    const resInterceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {

        /* 🔥 ROBOT CHECK HANDLER */
        if (err.response?.data?.type === "ROBOT_CHECK") {
          window.location.href = "/robot-check";
          return Promise.reject(err);
        }

        /* 🔐 AUTH FAIL */
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
    token,
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