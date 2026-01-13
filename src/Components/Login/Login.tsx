import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIURL } from "../../GlobalAPIURL";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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

  const { email, password } = formData;

  if (!email || !password) {
    alert("Email and password are required");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(`${APIURL}/user_login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Invalid server response");
    }

    if (!res.ok) {
      if (res.status === 403 && data.next === "VERIFY_OTP") {
        alert("Account not verified. Please verify OTP.");
        return;
      }

      alert(data.message || "Login failed");
      return;
    }

    // ✅ Save token
    localStorage.setItem("access_token", data.token);

    // ✅ FORCE re-evaluation of auth + redirect to home
    window.location.replace("/");

  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong while logging in");
  } finally {
    setLoading(false);
  }
};




    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border bg-white dark:bg-gray-900 dark:text-white p-6">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Login
                </h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Don’t have an account?{" "}
                    <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate("/signin")}
                    >
                        Create account
                    </span>
                </p>
            </div>
        </div>
    );
}
