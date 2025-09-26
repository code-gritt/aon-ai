import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store.js";
import { meQuery } from "../store/mutation.js";
import Header from "../sections/Header.jsx";

const Dashboard = () => {
  const { user, token, setUser } = useStore();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     if (token) {
  //       try {
  //         const { me } = await meQuery(token);
  //         setUser(me, token); // Refresh user data
  //       } catch (err) {
  //         navigate("/");
  //       }
  //     } else {
  //       navigate("/");
  //     }
  //   };
  //   fetchUser();
  // }, [token, setUser, navigate]);

  // if (!user) return null;

  return (
    <>
      <Header />
      <div className="relative pt-60 pb-40 max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32 bg-s2">
        <div className="container max-w-512 mx-auto">
          <h1 className="mb-6 h1 text-p4 uppercase max-lg:mb-2 max-lg:h2 max-md:mb-4 max-md:text-5xl max-md:leading-12">
            Welcome, {user.username || user.email}
          </h1>
          <p className="max-w-440 mb-14 body-1 max-md:mb-10 text-#EAEDFF">
            You have {user.credits} credits. Start editing your images now!
          </p>
          <div className="border-2 border-s3 rounded-3xl p-6">
            <h2 className="text-#EAEDFF base-bold mb-4">Your Profile</h2>
            <p className="text-#EAEDFF">Email: {user.email}</p>
            <p className="text-#EAEDFF">Username: {user.username || "None"}</p>
            <p className="text-#EAEDFF">Credits: {user.credits}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
