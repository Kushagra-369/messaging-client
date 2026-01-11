import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { APIURL } from "../../GlobalAPIURL";

export default function Signin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, first_name, last_name, email, password } = formData;

    if (!username || !first_name || !last_name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${APIURL}/create_users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          first_name,
          last_name,
          email,
          password,
        }),
      });

      const data = await res.json();

      // 🔴 HANDLE OTP VERIFIED CASE (409)
      if (res.status === 409 && data.next === "LOGIN") {
        navigate("/login");
        return;
      }

      // 🔴 HANDLE OTP NOT VERIFIED
      if (data.next === "VERIFY_OTP") {
        localStorage.setItem("otp_email", email);
        navigate("/verify-otp");
        return;
      }

      // REAL ERROR (only if no `next`)
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



  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white dark:bg-gray-900 dark:text-white p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <input
            name="first_name"
            placeholder="First name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <input
            name="last_name"
            placeholder="Last name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 rounded-xl
              bg-blue-600 hover:bg-blue-700
              text-white font-medium
              disabled:opacity-60
            "
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
