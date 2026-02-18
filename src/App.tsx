import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./Components/FirstSign/FirstSignin";
import Signin from "./Components/FirstSign/Signin";
import ThemeToggle from "./Components/ThemeToggle";
import Otp from "./Components/FirstSign/Otp";
import Forgot_Password from "./Components/Forgot_password/Forgot_Password";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
export default function App() {

  // ✅ direct token check (no state needed)
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="relative min-h-screen">

      {!isLoggedIn && <ThemeToggle />}

      <div
        className="fixed inset-0 -z-10 w-full h-full bg-white 
        [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#7ee0ff_100%)]
        dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"
      />

      <Routes>

        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Signin />} />

        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <>
                <Navbar />
                <Home />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />


        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/home" /> : <SignUp />}
        />

        <Route
          path="/otp"
          element={isLoggedIn ? <Navigate to="/home" /> : <Otp />}
        />

        <Route
          path="/forgot_password"
          element={isLoggedIn ? <Navigate to="/home" /> : <Forgot_Password />}
        />

      </Routes>

    </div>
  );
}
