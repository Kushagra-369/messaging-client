import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIURL } from "../../GlobalAPIURL";
import { FaLock, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

export default function Forgot_Password() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Invalid or expired reset link.
      </div>
    );
  }
  
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { new_password, confirm_password } = formData;

    if (!new_password || !confirm_password) {
      setError("Please fill all fields");
      return;
    }

    if (new_password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const form = new FormData();
      form.append("newPassword", new_password);
      form.append("confirm_password", confirm_password);


      const res = await fetch(
        `${APIURL}/forgotten_update_password/${token}`,
        {
          method: "POST",
          credentials: "include",   // 🔥 IMPORTANT
          body: form,
        }
      );


      const data = await res.json();

      if (res.ok) {
        setDone(true);

        // redirect after success
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Password update failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">

          {/* Heading */}
          <h2 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Reset Password
          </h2>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="flex flex-col items-center text-green-600 dark:text-green-400 mb-4">
              <FaCheckCircle className="text-4xl mb-2" />
              <p>Password Updated! Redirecting...</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type={showPasswords.new ? "text" : "password"}
                name="new_password"
                placeholder="New Password"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                {showPasswords.new ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                {showPasswords.confirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? "Updating..." : "Update Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}