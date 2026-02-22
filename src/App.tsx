import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Components/Context/AuthContext";
import React from "react";
import SignUp from "./Components/FirstSign/FirstSignin";
import Signin from "./Components/FirstSign/Signin";
import ThemeToggle from "./Components/ThemeToggle";
import Otp from "./Components/FirstSign/Otp";
import Forgot_Password from "./Components/Forgot_password/Forgot_Password";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import PageTransition from "./Components/PageTransition";

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    if (!loading) {
      window.dispatchEvent(new Event("app-ready"));
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Loading ChatApp...
      </div>
    );
  }

  // Don't apply page transition to home/dashboard pages
  const isAuthPage = ["/login", "/signup", "/otp", "/forgot_password"].includes(location.pathname);

  return (
    <div className="relative min-h-screen">
      {!user && <ThemeToggle />}

      <div className="
        fixed inset-0 -z-10 w-full h-full
        bg-[radial-gradient(120%_120%_at_10%_10%,#38bdf8_0%,#22d3ee_40%,#14b8a6_70%,#ffffff_100%)]
        dark:bg-[radial-gradient(120%_120%_at_10%_10%,#0c4a6e_0%,#0f766e_40%,#022c22_70%,#020617_100%)]
      " />

      {isAuthPage ? (
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={!user ? <Signin /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/otp" element={!user ? <Otp /> : <Navigate to="/" />} />
            <Route path="/forgot_password" element={!user ? <Forgot_Password /> : <Navigate to="/" />} />
          </Routes>
        </PageTransition>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <>
                  <Navbar />
                  <Home />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      )}
    </div>
  );
}