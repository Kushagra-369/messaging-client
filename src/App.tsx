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
  className="
  fixed inset-0 -z-10 w-full h-full
  bg-[radial-gradient(120%_120%_at_10%_10%,#38bdf8_0%,#22d3ee_40%,#14b8a6_70%,#ffffff_100%)]
  dark:bg-[radial-gradient(120%_120%_at_10%_10%,#0c4a6e_0%,#0f766e_40%,#022c22_70%,#020617_100%)]
"
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
