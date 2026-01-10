import { Link, useNavigate } from "react-router-dom";

type SigninProps = {
  onLogin: () => void;
};

export default function Signin({ onLogin }: SigninProps) {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onLogin();        // ✅ tell App user is logged in
    navigate("/");    // ✅ redirect to home
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white dark:text-white dark:bg-gray-900 p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Sign In
        </h1>

        <form className="space-y-4 dark:text-white" onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <input
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-blue-600 text-white"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          New here?{" "}
          <Link to="/signup" className="text-blue-600">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
