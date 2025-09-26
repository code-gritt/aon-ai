import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useStore from "../store/store.js";
import Button from "../components/Button.jsx";
import { loginMutation } from "../store/mutation.js";
import Loader from "../components/Loader.jsx";
import GoogleButton from "../components/GoogleButton.jsx"; // ✅ New import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { login } = await loginMutation({ email, password });
      setUser(login.user, login.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ✅ New: Google login redirect
  const handleGoogleLogin = () => {
    window.location.href = "https://aon-ai-api.onrender.com/auth/google";
  };

  if (loading) return <Loader text="Logging you in..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Login to Aon AI
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          Access your account and start editing images with AI magic.
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-200 mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
        </form>

        {/* ✅ New Google Button Section */}
        <div className="mt-4 text-center">
          <Button icon="/images/zap.svg" className="w-full py-3 mt-2">
            Login
          </Button>
          <p className="text-gray-400 text-sm my-3">Or</p>
          <GoogleButton onClick={handleGoogleLogin} />
        </div>

        <p className="mt-6 text-gray-300 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
