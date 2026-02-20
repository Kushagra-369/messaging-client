import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { APIURL } from "../../GlobalAPIURL";
import { FaGithub, FaGoogle, FaArrowRight, FaEnvelope, FaUser, FaPhone, FaLock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import icon from "../../assets/images/icon.png"

// Available country codes from schema
const COUNTRY_CODES = ['+1', '+44', '+91', '+92', '+971'];

// Floating orbs background component
const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            background: `radial-linear(circle, ${i % 2 === 0 ? '#3b82f6' : '#8b5cf6'
              } 0%, transparent 70%)`,
            width: `${300 + i * 100}px`,
            height: `${300 + i * 100}px`,
            left: `${(i * 20) % 100}%`,
            top: `${(i * 15) % 100}%`,
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Input field with animation
const AnimatedInput = ({
  icon: Icon,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  delay = 0,
  select,
  options
}: {
  icon: any;
  name: string;
  placeholder: string;
  type?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  delay?: number;
  select?: boolean;
  options?: string[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300">
        <Icon className="text-lg" />
      </div>
      {select ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all duration-300 appearance-none cursor-pointer"
        >
          {options?.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all duration-300"
        />
      )}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
        initial={{ width: "0%" }}
        whileInView={{ width: "0%" }}
        whileFocus={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// Software icon component
const SoftwareIcon = () => {
  return (
    <motion.div
      className="relative w-16 h-16 mx-auto mb-4"
      animate={{
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50" />
      <div className="relative w-full h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">

        <motion.img
          src={icon}          // ✅ imported image
          alt="Auralink"
          className="w-full h-full object-contain"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

      </div>

    </motion.div>
  );
};

export default function Signin() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    country_code: "+1",
    mobile_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    github: false,
  });

  // Auto-expand after icons animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const { username, first_name, last_name, email, password, country_code, mobile_number } = formData;

    if (!username || !first_name || !last_name || !email || !password || !country_code || !mobile_number) {
      alert("All fields are required");
      return;
    }

    const mobileRegex = /^\d{10,15}$/;
    if (!mobileRegex.test(mobile_number)) {
      alert("Please enter a valid mobile number (10-15 digits)");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${APIURL}/create_user`, {
        method: "POST",
          credentials: "include",   // 🔥 ADD THIS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          first_name,
          last_name,
          email,
          password,
          country_code,
          mobile_No: mobile_number,
        }),
      });

      const data = await res.json();

      if (res.status === 409 && data.next === "LOGIN") {
        navigate("/login");
        return;
      }

      if (res.ok) {
        localStorage.setItem("otp_email", email);
        localStorage.setItem("otp_mobile", mobile_number);
        localStorage.setItem("otp_country_code", country_code);
        localStorage.setItem("otp_userId", data.user._id);
        navigate("/otp");
        return;
      }

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    window.location.href = `${APIURL}/auth/google`;
  };

  const handleGitHubSignIn = async () => {
    setSocialLoading(prev => ({ ...prev, github: true }));
    window.location.href = `${APIURL}/auth/github`;
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-linear-to-br ">
      <FloatingOrbs />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-3xl border bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl dark:text-white p-8 shadow-2xl">
          <SoftwareIcon />

          <motion.h1
            className="text-3xl font-bold text-center mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Create Account
          </motion.h1>

          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Join us today! Choose your sign-up method
          </motion.p>

          {/* Social Sign-in Buttons with Icons Only Initially */}
          <motion.div
            className="flex justify-center gap-6 mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          >
            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={socialLoading.google || socialLoading.github}
              className="relative group"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-red-500 to-red-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative w-14 h-14 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-red-500 transition-all duration-300">
                <FaGoogle className="text-red-500 text-2xl" />
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
              type="button"
              onClick={handleGitHubSignIn}
              disabled={socialLoading.google || socialLoading.github}
              className="relative group"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-gray-700 to-gray-900 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-700 group-hover:border-white transition-all duration-300">
                <FaGithub className="text-white text-2xl" />
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
                  className="inline-flex items-center gap-2 px-6 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{showDetails ? "Hide Details" : "Show More Options"}</span>
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

          {/* Email Sign-up Form with Animation */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <div className="relative mb-6 mt-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                      Or continue with email & mobile
                    </span>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    style={{ display: "none" }}
                    onChange={() => { }}
                  />
                  <AnimatedInput
                    icon={FaUser}
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    delay={0.1}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <AnimatedInput
                      icon={FaUser}
                      name="first_name"
                      placeholder="First name"
                      value={formData.first_name}
                      onChange={handleChange}
                      delay={0.2}
                    />

                    <AnimatedInput
                      icon={FaUser}
                      name="last_name"
                      placeholder="Last name"
                      value={formData.last_name}
                      onChange={handleChange}
                      delay={0.25}
                    />
                  </div>

                  <AnimatedInput
                    icon={FaEnvelope}
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    delay={0.3}
                  />

                  <div className="flex gap-2">
                    <div className="w-28">
                      <AnimatedInput
                        icon={FaPhone}
                        name="country_code"
                        placeholder="Code"
                        value={formData.country_code}
                        onChange={handleChange}
                        delay={0.35}
                        select={true}
                        options={COUNTRY_CODES}
                      />
                    </div>

                    <div className="flex-1">
                      <AnimatedInput
                        icon={FaPhone}
                        name="mobile_number"
                        type="tel"
                        placeholder="Mobile number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        delay={0.4}
                      />
                    </div>
                  </div>

                  <AnimatedInput
                    icon={FaLock}
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    delay={0.45}
                  />

                  <motion.button
                    type="submit"
                    disabled={loading || socialLoading.google || socialLoading.github}
                    className="
                      w-full py-4 rounded-xl
                      bg-linear-to-r from-blue-600 to-purple-600
                      hover:from-blue-700 hover:to-purple-700
                      text-white font-semibold
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-all duration-300
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
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign Up</span>
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
                      className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p
            className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Already have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}