import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store.js";
import { meQuery } from "../store/mutation.js";
import Header from "../sections/Header.jsx";

const Dashboard = () => {
  const { user, token, setUser } = useStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await meQuery(token);
        if (response.me) {
          setUser(response.me, token);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, setUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-s2">
        <Header />
        <p className="text-center mt-40 text-#EAEDFF">Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }
  return (
    <>
      <Header />
      <div className="relative pt-40 pb-20 bg-gray-900 min-h-screen">
        <div className="container max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">
            Welcome, {user.username || user.email}
          </h1>
          <p className="text-gray-300 mb-8">
            You have {user.credits} credits. Start editing your images now!
          </p>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-4">Your Profile</h2>
            <p className="text-gray-300">Email: {user.email}</p>
            <p className="text-gray-300">Username: {user.username || "None"}</p>
            <p className="text-gray-300">Credits: {user.credits}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
