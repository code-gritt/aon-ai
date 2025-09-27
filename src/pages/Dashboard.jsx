import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store.js";
import {
  meQuery,
  uploadImageMutation,
  aiEditMutation,
} from "../store/mutation.js";
import Header from "../sections/Header.jsx";
import Loader from "../components/Loader.jsx";

const Dashboard = () => {
  const { user, token, setUser } = useStore();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editType, setEditType] = useState(""); // crop, resize, AI
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        navigate("/login");
        return;
      }
      try {
        const response = await meQuery(token);
        if (response.me) setUser(response.me, token);
        else navigate("/login");
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, setUser, navigate]);

  // Handle image upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { uploadImage } = await uploadImageMutation(file, token);
      setImages((prev) => [...prev, uploadImage]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle basic canvas edits
  const handleBasicEdit = (type) => {
    if (!selectedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Placeholder for actual edit logic (crop, resize, brightness, etc.)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    };

    img.src = selectedImage.url;
    setEditType(type);
  };

  // Handle AI edits
  const handleAiEdit = async (action, prompt = "") => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const { aiEdit } = await aiEditMutation(
        { imageId: selectedImage.id, action, prompt },
        token
      );
      setImages((prev) =>
        prev.map((img) => (img.id === selectedImage.id ? aiEdit : img))
      );
      setSelectedImage(aiEdit);
    } catch (err) {
      console.error("AI edit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <Loader text="Loading..." />
      </>
    );
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Welcome & Profile */}
          <h1 className="text-4xl font-bold mb-2">
            Welcome, {user.username || user.email}
          </h1>
          <p className="text-gray-300 mb-8">
            You have <span className="font-bold">{user.credits}</span> credits.
            Start editing your images now!
          </p>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-10">
            <h2 className="text-white font-bold mb-4">Your Profile</h2>
            <p className="text-gray-300">Email: {user.email}</p>
            <p className="text-gray-300">Username: {user.username || "None"}</p>
            <p className="text-gray-300">Credits: {user.credits}</p>
          </div>

          {/* Upload */}
          <div className="mb-10">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl"
            >
              Upload Image
            </button>
          </div>

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4"
                >
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <button
                    onClick={() => setSelectedImage(img)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Edit Panel */}
          {selectedImage && (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">
                Editing: {selectedImage.filename}
              </h2>
              <canvas
                ref={canvasRef}
                className="w-full max-w-96 h-auto mb-4 bg-black rounded"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Basic Edits */}
                {["crop", "resize", "rotate", "brightness"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleBasicEdit(type)}
                    className="bg-gray-600 hover:bg-gray-700 p-2 rounded"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}

                {/* AI Edits */}
                <button
                  onClick={() => handleAiEdit("remove_background")}
                  className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
                >
                  Remove BG (5 credits)
                </button>
                <button
                  onClick={() => handleAiEdit("enhance")}
                  className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
                >
                  Enhance (5 credits)
                </button>
                <button
                  onClick={() =>
                    handleAiEdit("remove_object", "Remove the red car")
                  }
                  className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
                >
                  Remove Object (10 credits)
                </button>
                <button
                  onClick={() =>
                    handleAiEdit("style_transfer", "Van Gogh style")
                  }
                  className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
                >
                  Style Transfer (10 credits)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
