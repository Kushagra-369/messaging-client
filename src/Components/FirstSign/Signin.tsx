import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { APIURL } from "../../GlobalAPIURL";
import { FaGithub, FaGoogle, FaHeadphones, FaUsers, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import icon from "../../assets/images/icon.png"

const COUNTRY_CODES = ['+1', '+44', '+91', '+92', '+971'];

export default function Signin() {
  const navigate = useNavigate();
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
  const [, setSocialLoading] = useState({ google: false, github: false });
  const [showEmailSignup, setShowEmailSignup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowEmailSignup(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const { username, first_name, last_name, email, password, country_code, mobile_number } = formData;

    if (!username || !first_name || !last_name || !email || !password || !mobile_number) {
      alert("Please fill all fields");
      return;
    }

    if (!/^\d{10,15}$/.test(mobile_number)) {
      alert("Invalid mobile number");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${APIURL}/create_user`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username, first_name, last_name, email, password,
          country_code, mobile_No: mobile_number,
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

      alert(data.message || "Signup failed");
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = (provider: 'google' | 'github') => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    window.location.href = `${APIURL}/auth/${provider}`;
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-white dark:bg-gray-950">
      
      {/* Left side - Beautiful BG with App Description */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden items-center justify-center p-8
        bg-linear-to-br from-blue-600 via-purple-600 to-pink-500
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        dark:border-r dark:border-gray-800">
        
        {/* Animated circles */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-64 h-64 bg-white dark:bg-blue-500/20 rounded-full mix-blend-overlay dark:mix-blend-soft-light opacity-10 dark:opacity-30 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white dark:bg-purple-500/20 rounded-full mix-blend-overlay dark:mix-blend-soft-light opacity-10 dark:opacity-30 animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white dark:bg-pink-500/20 rounded-full mix-blend-overlay dark:mix-blend-soft-light opacity-5 dark:opacity-20 animate-pulse delay-500" />
        </div>

        {/* Content - Centered vertically */}
        <div className="relative z-10 text-white dark:text-gray-100 max-w-lg">
          {/* App Icon and Name */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 dark:bg-gray-800/50 p-2 rounded-2xl backdrop-blur-sm">
              <img src={icon} alt="Auralink" className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/80 dark:from-blue-400 dark:to-purple-400">
              Auralink
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-white/90 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
              Connect with the world through sound
            </span>
          </h1>
          
          <p className="text-base mb-5 text-white/80 dark:text-gray-300">
            Join millions of creators and listeners.
          </p>

          {/* Features - Compact */}
          <div className="space-y-3 mb-5">
            {[
              { icon: FaHeadphones, title: "High Quality Audio", desc: "Crystal clear sound" },
              { icon: FaUsers, title: "Community Driven", desc: "Connect with like-minded people" },
              { icon: FaShieldAlt, title: "Secure & Private", desc: "Your data is protected" }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="bg-white/20 dark:bg-gray-800/50 p-2 rounded-lg">
                  <feature.icon className="text-base text-white dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-white dark:text-white">{feature.title}</h3>
                  <p className="text-xs text-white/70 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats - Compact */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/20 dark:border-gray-800">
            {[
              { value: "10M+", label: "Users" },
              { value: "50K+", label: "Creators" },
              { value: "100+", label: "Countries" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-lg font-bold text-white dark:text-blue-400">{stat.value}</div>
                <div className="text-xs text-white/70 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Signin Form */}
      <div className="flex-1 h-full flex items-center justify-center p-4 lg:w-1/2 overflow-y-auto lg:overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[320px]"
        >
          {/* Logo - Mobile mein dikhega */}
          <div className="text-center mb-4 lg:hidden">
            <div className="inline-block p-2.5 bg-linear-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-xl mb-1">
              <img src={icon} alt="Auralink" className="h-8 w-8" />
            </div>
          </div>
          
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Create account
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Join Auralink today
            </p>
          </div>

          {/* Social Buttons */}
          <div className="space-y-2 mb-3">
            <button
              onClick={() => handleSocialSignIn('google')}
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
              onClick={() => handleSocialSignIn('github')}
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

          {/* Email Signup */}
          {showEmailSignup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
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

              {/* Ultra Compact Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 
                    border border-gray-200 dark:border-gray-800 
                    bg-white dark:bg-gray-900
                    text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-600
                    rounded-lg text-xs 
                    focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />

                <div className="flex gap-2">
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-1/2 px-3 py-2 
                      border border-gray-200 dark:border-gray-800 
                      bg-white dark:bg-gray-900
                      text-gray-900 dark:text-white
                      placeholder-gray-400 dark:placeholder-gray-600
                      rounded-lg text-xs 
                      focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-1/2 px-3 py-2 
                      border border-gray-200 dark:border-gray-800 
                      bg-white dark:bg-gray-900
                      text-gray-900 dark:text-white
                      placeholder-gray-400 dark:placeholder-gray-600
                      rounded-lg text-xs 
                      focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 
                    border border-gray-200 dark:border-gray-800 
                    bg-white dark:bg-gray-900
                    text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-600
                    rounded-lg text-xs 
                    focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />

                <div className="flex gap-2">
                  <select
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleChange}
                    className="w-20 px-2 py-2 
                      border border-gray-200 dark:border-gray-800 
                      bg-white dark:bg-gray-900
                      text-gray-900 dark:text-white
                      rounded-lg text-xs 
                      focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  >
                    {COUNTRY_CODES.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="mobile_number"
                    placeholder="Mobile"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 
                      border border-gray-200 dark:border-gray-800 
                      bg-white dark:bg-gray-900
                      text-gray-900 dark:text-white
                      placeholder-gray-400 dark:placeholder-gray-600
                      rounded-lg text-xs 
                      focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                </div>

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 
                    border border-gray-200 dark:border-gray-800 
                    bg-white dark:bg-gray-900
                    text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-600
                    rounded-lg text-xs 
                    focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 
                    bg-linear-to-r from-blue-600 to-purple-600 
                    hover:from-blue-700 hover:to-purple-700
                    dark:from-blue-500 dark:to-purple-500
                    text-white font-medium 
                    rounded-lg text-xs 
                    transition-all
                    disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Sign up"}
                </button>
              </form>
            </motion.div>
          )}

          {/* Footer Links */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Already have an account?{" "}
              <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Log in
              </Link>
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2">
              Terms • Privacy
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}