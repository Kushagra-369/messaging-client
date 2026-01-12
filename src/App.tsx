import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Signin from "./Components/Login/Signin";
import OTP from "./Components/Login/OTP";
import Login from "./Components/Login/Login";

export default function App() {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  return (
    <div>
      {/* Background */}
      <div
        className="
          fixed inset-0 -z-10 w-full h-full
          [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#7ee0ff_100%)]
          dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]
        "
      />

      {/* Navbar only after login */}
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/signin" replace />
          }
        />

        <Route path="/signin" element={<Signin />} />
        <Route path="/verify-otp" element={<OTP />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
