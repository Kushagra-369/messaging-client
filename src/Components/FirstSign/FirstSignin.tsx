import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APIURL } from "../../GlobalAPIURL";
import { FaGithub, FaGoogle, FaEnvelope, FaLock, FaArrowRight, FaCheckCircle, FaMusic, FaMicrophone } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import icon from "../../assets/images/icon.png";



// Animated input field
const AnimatedInput = ({
  icon: Icon,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  disabled,
  label,
  delay = 0,
}: {
  icon: any;
  type?: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="space-y-1"
    >
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300">
          <Icon className="text-lg" />
        </div>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="
            w-full pl-10 pr-4 py-3 rounded-xl
            border-2 border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-300
            outline-none
          "
        />
      </div>
    </motion.div>
  );
};

// Success animation component
const SuccessAnimation = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex flex-col items-center justify-center py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <FaCheckCircle className="text-green-500 text-3xl" />
        </motion.div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-green-600 dark:text-green-400 font-semibold"
      >
        Login successful! Redirecting...
      </motion.p>
    </motion.div>
  );
};

// Right side content component
const RightSideContent = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden items-center justify-center p-8
      bg-linear-to-br from-green-600 via-teal-600 to-emerald-500
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      dark:border-l dark:border-gray-800">

      {/* Animated circles */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -right-4 w-64 h-64 bg-white dark:bg-green-500/20 rounded-full mix-blend-overlay dark:mix-blend-soft-light opacity-10 dark:opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white dark:bg-teal-500/20 rounded-full mix-blend-overlay dark:mix-blend-soft-light opacity-10 dark:opacity-30 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white dark:bg-emerald-500/20 rounded-full mix-blend-overlay dark:mix-blend-soft-light opacity-5 dark:opacity-20 animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-white dark:text-gray-100 max-w-lg">
        {/* App Icon and Name */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/20 dark:bg-gray-800/50 p-2 rounded-2xl backdrop-blur-sm">
            <img src={icon} alt="Auralink" className="h-8 w-8" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/80 dark:from-green-400 dark:to-teal-400">
            Auralink
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-white/90 dark:from-green-400 dark:via-teal-400 dark:to-emerald-400">
            Welcome back to the conversation
          </span>
        </h1>

        <p className="text-base mb-5 text-white/80 dark:text-gray-300">
          Continue your audio journey with us.
        </p>

        {/* Stats - Compact */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4">
            <FaMusic className="text-2xl mb-2 text-white/90" />
            <div className="text-lg font-bold text-white">10M+</div>
            <div className="text-xs text-white/70">Tracks Shared</div>
          </div>
          <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4">
            <FaMicrophone className="text-2xl mb-2 text-white/90" />
            <div className="text-lg font-bold text-white">50K+</div>
            <div className="text-xs text-white/70">Live Rooms</div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-6 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm italic text-white/90">
            "The best audio community I've ever been part of. The quality and connections are unmatched."
          </p>
          <p className="text-xs text-white/70 mt-2">— Sarah Chen, Daily Listener</p>
        </div>
      </div>
    </div>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    github: false,
  });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [, setIsExiting] = useState(false);

  useEffect(() => {
    const reset = setTimeout(() => {
      setSocialLoading({ google: false, github: false });
    }, 8000);

    return () => clearTimeout(reset);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${APIURL}/user_login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setDone(true);
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 2000);
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Enter your email first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const form = new FormData();
      form.append("email", formData.email);

      const res = await fetch(`${APIURL}/forgot_password_gmail`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Reset link sent to your Gmail ✅");
      } else {
        setError(data.message || "Failed to send reset link");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    setError("");
    window.location.href = `${APIURL}/auth/google`;
  };

  const handleGitHubLogin = () => {
    setSocialLoading(prev => ({ ...prev, github: true }));
    setError("");
    window.location.href = `${APIURL}/auth/github`;
  };

  const handleFlipToSignup = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/login");
    }, 400);
  };


  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-white dark:bg-gray-950"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden"
      }}
    >

      {/* Left side - Login Form */}
      <div className="flex-1 h-full flex items-center justify-center p-4 lg:w-1/2 overflow-y-auto lg:overflow-hidden">
        <div
          style={{
            transformStyle: "preserve-3d",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="w-full max-w-[320px]">
            {/* Logo - Mobile mein dikhega */}
            <div className="text-center mb-4 lg:hidden">
              <div className="inline-block p-2.5 bg-linear-to-br from-green-100 to-teal-100 dark:from-gray-800 dark:to-gray-900 rounded-xl mb-1">
                <img src={icon} alt="Auralink" className="h-8 w-8" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Sign in to continue
              </p>
            </div>

            {/* Social Buttons */}
            <div className="space-y-2 mb-3">
              <button
                onClick={handleGoogleLogin}
                disabled={socialLoading.google || socialLoading.github || loading}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 
                    border border-gray-200 dark:border-gray-800 
                    bg-white dark:bg-gray-900
                    hover:bg-gray-50 dark:hover:bg-gray-800/80
                    text-gray-700 dark:text-gray-300
                    rounded-lg text-sm 
                    transition-all"
              >
                <FaGoogle className="text-red-500 text-sm" />
                <span>Google</span>
              </button>

              <button
                onClick={handleGitHubLogin}
                disabled={socialLoading.google || socialLoading.github || loading}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 
                    border border-gray-200 dark:border-gray-800 
                    bg-white dark:bg-gray-900
                    hover:bg-gray-50 dark:hover:bg-gray-800/80
                    text-gray-700 dark:text-gray-300
                    rounded-lg text-sm 
                    transition-all"
              >
                <FaGithub className="text-gray-900 dark:text-white text-sm" />
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-gray-950 text-gray-500">
                  or
                </span>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3"
                >
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1">
                      <span>⚠️</span>
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3"
                >
                  <SuccessAnimation />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <input
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                className="hidden"
              />

              <AnimatedInput
                icon={FaEnvelope}
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || socialLoading.google || socialLoading.github}
                delay={0.1}
              />

              <div className="space-y-1">
                <AnimatedInput
                  icon={FaLock}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading || socialLoading.google || socialLoading.github}
                  delay={0.2}
                />
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-green-600 dark:text-green-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading || socialLoading.google || socialLoading.github}
                className="
                    w-full py-2.5 rounded-lg
                    bg-linear-to-r from-green-600 to-teal-600 
                    hover:from-green-700 hover:to-teal-700
                    dark:from-green-500 dark:to-teal-500
                    text-white font-medium text-sm
                    transition-all
                    disabled:opacity-50
                    flex items-center justify-center gap-2
                  "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign Up Link with Flip Animation */}
            <div className="text-center mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Don't have an account?{" "}
                <motion.button
                  onClick={handleFlipToSignup}
                  className="text-green-600 dark:text-green-400 hover:underline font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign up
                </motion.button>
              </p>
            </div>

            {/* Terms */}
            <p className="text-center mt-3 text-[10px] text-gray-400 dark:text-gray-600">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="hover:underline">Terms</Link>{" "}
              and{" "}
              <Link to="/privacy" className="hover:underline">Privacy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Content */}
      <RightSideContent />
    </div >
  );
}