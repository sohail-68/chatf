import React, { useEffect, useState } from "react";
import { createPost, Edit } from "../services/api";
import { ImagetoBase64 } from "../utility/ImagetoBase64.js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [mood, setMood] = useState("normal");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const[imgpr,setPreviewImage]=useState(null)
  
  const location = useLocation();
const navigate=useNavigate()
  // Initialize form fields for edit mode
  useEffect(() => {
    if (location.state?.post) {
      const { caption, image, mood } = location.state.post;
      setCaption(caption);
      setMood(mood);
      setImage(image);
        setPreviewImage(image); 
    }
  }, [location.state]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);   
        setPreviewImage(reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (location.state?.post) {
        // Update existing post
        const data = await Edit(location.state.post._id, {
          caption,
          image,
          mood,
        });
        toast.success("Post updated successfully!");

        setTimeout(() => {
        navigate("/")
          
        }, 3000);
        console.log("Post updated:", data);
      } else {
        // Create a new post
        const data = await createPost({ caption, image, mood });
        console.log(data);
        
        toast.success("Post created successfully!");
        console.log("Post created:", data);
      }
   setCaption("");
      setMood("");
      setCaption("")
   ;
    } catch (error) {
      toast.error("An error occurred while submitting the post.");
      console.error("Error submitting post:", error);
    } finally {
      setLoading(false);
    }
  };

  const moods = {
    normal: "😐",
    happy: "😊",
    sad: "😢",
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
  <div className="flex justify-center items-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header with close button */}
      <div className="flex justify-between items-center px-6 pt-6 pb-3 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">
          {location.state?.post ? "Edit Post" : "Create new post"}
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Image Upload Area */}
        <div>
          {imgpr ? (
            <div className="relative group">
              <img
                src={imgpr}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setImage(null);
                }}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-12 h-12 text-gray-400 group-hover:text-gray-500 transition-colors mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">Click to upload image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                id="file-upload"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Caption Input */}
        <div>
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows="3"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400"
          />
          <p className="text-right text-xs text-gray-400 mt-1">
            {caption.length}/2200
          </p>
        </div>

        {/* Modern Mood Selector with Emojis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling?
          </label>
          <div className="flex gap-3">
            {[
              { value: "Happy", emoji: "😊", label: "Happy", color: "hover:bg-yellow-50" },
              { value: "Normal", emoji: "😐", label: "Normal", color: "hover:bg-gray-50" },
              { value: "Sad", emoji: "😢", label: "Sad", color: "hover:bg-blue-50" }
            ].map((moodOption) => (
              <button
                key={moodOption.value}
                type="button"
                onClick={() => setMood(moodOption.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  mood === moodOption.value
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                } ${moodOption.color}`}
              >
                <span className="text-2xl">{moodOption.emoji}</span>
                <span className={`text-sm font-medium ${
                  mood === moodOption.value ? "text-blue-600" : "text-gray-600"
                }`}>
                  {moodOption.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all transform ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{location.state?.post ? "Updating..." : "Creating..."}</span>
            </div>
          ) : (
            location.state?.post ? "Update Post" : "Share Post"
          )}
        </button>
      </div>
    </form>
  </div>

  <ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={false}
    closeOnClick
    pauseOnHover
    draggable
    theme="colored"
  />
</div>
  );
};

export default CreatePost;
