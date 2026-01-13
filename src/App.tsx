import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Signin from "./Components/Login/Signin";
import OTP from "./Components/Login/OTP";
import Login from "./Components/Login/Login";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div >
      {/* Navbar only after login */}
      {isAuthenticated && <Navbar />}

      <div className="fixed inset-0 -z-10 w-full h-full bg-white 
          [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#7ee0ff_100%)]
          dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">

      </div>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/signin" replace />
          }
        />

        <Route
          path="/signin"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Signin />
          }
        />

        <Route path="/verify-otp" element={<OTP />} />

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          }
        />
      </Routes>
    </div>
  );
}
