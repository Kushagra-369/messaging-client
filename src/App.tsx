import { Route, Routes } from "react-router-dom";
import SignUp from "./Components/FirstSign/FirstSignin";
import Signin from "./Components/FirstSign/Signin";
import ThemeToggle from "./Components/ThemeToggle";
import Otp from "./Components/FirstSign/Otp";
export default function App() {
  return (
    <div className="relative min-h-screen">

      {/* 🌙 Theme Toggle */}
      <ThemeToggle />

      {/* Background */}
      <div
        className="fixed inset-0 -z-10 w-full h-full bg-white 
        [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#7ee0ff_100%)]
        dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"
      />

      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/login" element={<SignUp />} />
        <Route path="/otp" element={<Otp />} />
        
      </Routes>
    </div>
  );
}
