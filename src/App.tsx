import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Signin from "./Components/Login/Signin";
import OTP from "./Components/Login/OTP";
import Login from "./Components/Login/Login";
import Profile from "./Components/User/Profile";
import Chatting from "./Components/Chatting/Chatting";
import { APIURL } from "./GlobalAPIURL";
import Conversation from "./Components/Chatting/Conversation";
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

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

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
          setIsAuthenticated(false);
          setCheckingAuth(false);
          return;
        }

        setIsAuthenticated(true);
        setCheckingAuth(false);
      } catch (error) {
        console.warn("Backend unreachable, keeping user logged in");
        setIsAuthenticated(true);
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

        {/* 👤 PROFILE */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/signin" replace />
          }
        />

        {/* 💬 CHAT (FIXED – PROTECTED) */}
        <Route
          path="/chat"
          element={
            isAuthenticated ? <Chatting /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/conversation/:userId?"
          element={
            isAuthenticated ? <Conversation /> : <Navigate to="/signin" replace />
          }
        />


        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/signin" replace />} />

      </Routes>
    </div>
  );
}
