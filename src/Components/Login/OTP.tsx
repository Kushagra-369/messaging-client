import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIURL } from "../../GlobalAPIURL";

export default function OTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // 🔹 Get email saved during signup
  useEffect(() => {
    const storedEmail = localStorage.getItem("otp_email");
    if (!storedEmail) {
      navigate("/signup");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  /* =======================
     VERIFY OTP
  ======================= */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${APIURL}/verify_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "OTP verification failed");
        return;
      }

      // ✅ OTP VERIFIED → go to login
      localStorage.removeItem("otp_email");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     RESEND OTP
  ======================= */
  const handleResend = async () => {
    try {
      setResending(true);

      const res = await fetch(`${APIURL}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to resend OTP");
        return;
      }

      alert("OTP resent successfully");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white dark:bg-gray-900 dark:text-white p-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          Verify OTP
        </h1>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
          Enter the 6-digit code sent to <br />
          <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter OTP"
            className="
              w-full px-4 py-3
              text-center tracking-widest text-lg
              border rounded-xl
              dark:bg-gray-800 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2.5 rounded-xl
              bg-blue-600 hover:bg-blue-700
              text-white font-medium
              disabled:opacity-60
            "
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-blue-600 hover:underline disabled:opacity-60"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
