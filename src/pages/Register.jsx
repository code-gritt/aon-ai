import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useStore from "../store/store.js";
import Button from "../components/Button.jsx";
import { registerMutation } from "../store/mutation.js";
import Loader from "../components/Loader.jsx";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { register } = await registerMutation({
        email,
        password,
        username,
      });
      setUser(register.user, register.token);
      navigate("/dashboard");
    } catch {
      setError("Email already registered or invalid input");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Creating your account..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Register for Aon AI
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          Create an account to unlock AI-powered image editing with 100 free
          credits.
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
              Username (Optional)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition"
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

          <Button icon="/images/zap.svg" className="w-full py-3 mt-2">
            Register
          </Button>
        </form>

        <p className="mt-6 text-gray-300 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
