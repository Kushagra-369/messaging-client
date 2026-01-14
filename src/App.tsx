import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Signin from "./Components/Login/Signin";
import OTP from "./Components/Login/OTP";
import Login from "./Components/Login/Login";
import { APIURL } from "./GlobalAPIURL";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      // 🚪 No token → not logged in
      if (!token) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch(`${APIURL}/auth_me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // 🔥 Token invalid / user deleted / inactive
          localStorage.removeItem("access_token");
          setIsAuthenticated(false);
          setCheckingAuth(false);
          return;
        }

        // ✅ Backend confirms user is valid
        setIsAuthenticated(true);
        setCheckingAuth(false);

      } catch {
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // ⏳ Prevent route flicker
  if (checkingAuth) {
    return null; // or loader
  }

  return (
    <div>
      {/* Navbar only after login */}
      {isAuthenticated && <Navbar />}

      {/* Global background */}
      <div
        className="
          fixed inset-0 -z-10 w-full h-full
          [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#7ee0ff_100%)]
          dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]
        "
      />

      <Routes>
        {/* 🏠 HOME */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/signin" replace />
          }
        />

        {/* 🔐 AUTH ROUTES */}
        <Route
          path="/signin"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Signin />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          }
        />

        <Route
          path="/verify-otp"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <OTP />
          }
        />

        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </div>
  );
}
