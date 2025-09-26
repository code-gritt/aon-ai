import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useStore from "../store/store.js";
import { meQuery } from "../store/mutation.js";
import Loader from "../components/Loader.jsx";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email"); // Optional, for logging
  const { setUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user data with token (reuses existing meQuery)
        const response = await meQuery(token);
        if (response.me) {
          setUser(response.me, token);
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        navigate("/login");
      }
    };

    handleCallback();
  }, [token, setUser, navigate]);

  return <Loader text="Completing Google sign-in..." />;
};

export default AuthCallback;
