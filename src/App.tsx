import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Signin from "./Components/Login/Signin";
import { useState } from "react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

      {/* Show Navbar ONLY after login */}
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* Signin */}
        <Route
          path="/signin"
          element={<Signin onLogin={() => setIsAuthenticated(true)} />}
        />
      </Routes>
    </div>
  );
}
