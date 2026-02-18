import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { APIURL } from "../../GlobalAPIURL";
import { FaGithub, FaGoogle, FaEnvelope, FaLock, FaArrowRight, FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import icon from "../../assets/images/icon.png";

// Floating particles background
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-500/10 dark:bg-blue-400/5"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="space-y-1"
    >
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300">
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
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-300
            outline-none
          "
        />
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-full"
          initial={{ width: "0%" }}
          whileInView={{ width: "0%" }}
          whileFocus={{ width: "100%" }}
          transition={{ duration: 0.3 }}
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

export default function SignUp() {
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

  // Animation and expansion states
  const [showContent, setShowContent] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [params] = useSearchParams();


  useEffect(() => {
    setShowContent(true);
    // Auto-show expand button after icons appear
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Google/Github token detect
  useEffect(() => {
    const token = params.get("token");

    const fetchUser = async () => {
      try {
        if (!token) return;

        localStorage.setItem("token", token);

        const res = await fetch(`${APIURL}/auth_me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        navigate("/");
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    };

    fetchUser();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setDone(true);
        setTimeout(() => {
          navigate("/home");
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
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        setError(""); // clear error
        alert("Reset link sent to your Gmail ✅"); // ya custom success state bana sakte ho
      } else {
        setError(data.message || "Failed to send reset link");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignup = () => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    setError("");
    window.location.href = `${APIURL}/auth/google`;
  };

  const handleGitHubSignup = () => {
    setSocialLoading(prev => ({ ...prev, github: true }));
    setError("");
    window.location.href = `${APIURL}/auth/github`;

    setTimeout(() => {
      setSocialLoading(prev => ({ ...prev, github: false }));
    }, 5000);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-linear-to-br">
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-3xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Icon Animation */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <img
                src={icon}
                alt="Logo"
                className="relative w-20 h-20 rounded-full shadow-lg"
              />
            </div>
          </motion.div>

          {/* Header Text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to continue your journey
            </p>
          </motion.div>

          {/* Social Sign-in Buttons - Icons Only Initially */}
          <motion.div
            className="flex justify-center gap-6 mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <motion.button
              onClick={handleGoogleSignup}
              disabled={socialLoading.google || socialLoading.github || loading}
              className="relative group"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-red-500 to-red-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-red-500 transition-all duration-300">
                <FaGoogle className="text-red-500 text-3xl" />
              </div>
              {socialLoading.google && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>

            <motion.button
              onClick={handleGitHubSignup}
              disabled={socialLoading.google || socialLoading.github || loading}
              className="relative group"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-gray-700 to-gray-900 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-700 group-hover:border-white transition-all duration-300">
                <FaGithub className="text-white text-3xl" />
              </div>
              {socialLoading.github && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-gray-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          </motion.div>

          {/* Expand/Collapse Button */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-6"
              >
                <motion.button
                  onClick={toggleDetails}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-medium">
                    {showDetails ? "Hide Login Options" : "Show More Options"}
                  </span>
                  <motion.div
                    animate={{ rotate: showDetails ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {showDetails ? <FaChevronUp /> : <FaChevronDown />}
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expandable Content */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                {/* Divider */}
                <motion.div
                  className="relative mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-500 dark:text-gray-400">
                      Or sign in with email
                    </span>
                  </div>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <motion.div
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      >
                        <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                          <span>⚠️</span>
                          {error}
                        </p>
                      </motion.div>
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
                      className="mb-4 overflow-hidden"
                    >
                      <SuccessAnimation />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email/Password Form */}
                <motion.form
                  className="space-y-4"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatedInput
                    icon={FaEnvelope}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading || socialLoading.google || socialLoading.github}
                    label="Email Address"
                    delay={0.3}
                  />

                  <div className="space-y-1">
                    <AnimatedInput
                      icon={FaLock}
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading || socialLoading.google || socialLoading.github}
                      label="Password"
                      delay={0.4}
                    />
                    <motion.div
                      className="text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 group"
                      >
                        Forgot password?
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </button>

                    </motion.div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || socialLoading.google || socialLoading.github}
                    className="
                      w-full py-3.5 rounded-xl
                      bg-linear-to-r from-blue-600 to-indigo-600
                      hover:from-blue-700 hover:to-indigo-700
                      text-white font-semibold
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-all duration-300
                      shadow-lg hover:shadow-xl
                      relative overflow-hidden group
                    "
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Logging in...</span>
                        </>
                      ) : (
                        <>
                          <span>Log In</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <FaArrowRight />
                          </motion.div>
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.button>
                </motion.form>

                {/* Sign Up Link */}
                <motion.p
                  className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Don't have an account?{" "}
                  <Link
                    to="/"
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1 group"
                  >
                    Sign up
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.p>

                {/* Privacy Note */}
                <motion.p
                  className="text-center mt-4 text-xs text-gray-500 dark:text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="hover:underline text-gray-600 dark:text-gray-400">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="hover:underline text-gray-600 dark:text-gray-400">
                    Privacy Policy
                  </Link>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* If not expanded, show minimal sign up link */}
          {!showDetails && (
            <motion.p
              className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              New here?{" "}
              <Link
                to="/"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Create account
              </Link>
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}