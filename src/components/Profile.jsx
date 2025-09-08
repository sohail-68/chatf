// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ImagetoBase64 } from "../utility/ImagetoBase64.js";
import { FaBookmark, FaHeart, FaTrashAlt } from "react-icons/fa";
import useChatMessages from "../hooks/useChatMessages.jsx";
import { Del } from "../services/api.jsx";
import { Camera, Edit3, Pencil, Save, Trash2, User, X } from "lucide-react";
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [use, setuse] = useState([]);
  const [count, setcount] = useState([]);
const {bookmarks,setbookmarks} =useChatMessages()

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://chatb-vrft.onrender.com/api/auth/myprofile",
          {
            headers: { Authorization: token },
          }
        );
       //response);
console.log(response);

setUser(response.data.user);
setMessage(response.data.message);
        setFormData({
          username: response.data.user.username,
          email: response.data.user.email,
          bio: response.data.user.bio,
          profilePicture: response.data.user.profilePicture,
          gender: response.data.user.gender,
        });
        sessionStorage.setItem("profile", JSON.stringify(response.data.user));
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle input changes
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files?.length > 0) {
      const data = await ImagetoBase64(files[0]);
     //data);

      if (data) {
        setFormData((prev) => ({
          ...prev,
          profilePicture: data, // Set profilePicture as a Base64 string
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => setEditMode((prev) => !prev);

  // Handle form submission
  const handleSave = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.put(
        "https://chatb-vrft.onrender.com/api/auth/myprofile",
        formData,
        { headers: { Authorization: token } }
      );
      setUser(response.data.user);

      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };
  console.log(user);
  
  const fetchUserProfilUser = async () => {
    try {
      const response = await axios.get(
        `https://chatb-vrft.onrender.com/api/userpost/all`,
        {
          headers: {
            Authorization: `${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      
      setuse(response.data);
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
 //use);
console.log(use);

  const Count = async () => {
    try {
      const response = await axios.get(
        `https://chatb-vrft.onrender.com/api/user/postCount`,
        {
          headers: {
            Authorization: `${sessionStorage.getItem("token")}`, // Add "Bearer" before the token
          },
        }
      );
  
      setcount(response.data.postCount); // Set only the post count
     //"Response data:", response.data);
    } catch (error) {
      console.error('Error fetching user post count:', error.message);
    }
  };
  
  const Bookmark = async () => {
    try {
      const response = await axios.get(
        "https://chatb-vrft.onrender.com/api/auth/bookmarked",
        {
          headers: { Authorization: sessionStorage.getItem("token") },
        }
      );
      console.log(response);
      
     //response.data);
      setbookmarks(response.data.bookmarks)
      
      
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };
  console.log("bbok",bookmarks);
  
 //bookmarks);
  const del = async () => {
    
    try {
      const token =sessionStorage.getItem("token"); // Retrieve token from sessionStorage
      if (!token) throw new Error("User not authenticated");
  
      // Make POST request to bookmark API
      const response = await axios.delete(
        `https://chatb-vrft.onrender.com/api/auth/users/bookmarks`,
        {
          headers: { Authorization: `${token}` },
        }
      );
  
     //"del bookmarked:", response.data); // Optional logging for confirmation
      setbookmarks([])
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };


  useEffect(()=>{
    fetchUserProfilUser()

    Count()
    window.addEventListener("resize", function(){
      if(this.window.innerWidth>700){
        setShow(true)
      }
    });
  },[])
  
 useEffect(()=>{
  // del()

 },[])
 useEffect(()=>{
  Bookmark();


 },[])
 const handleDelete = async (postId) => {
  try {
    await Del(postId);
    fetchUserProfilUser()

  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

 console.log(use);
 const moods = {
  Normal: "😐",
  Happy: "😊",
  Sad: "😢",
};

function Chnage(){
  navigate("/changepassword")
}
  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Main Profile Card */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">

          {/* Profile Header Section */}
          <div className="flex lg:flex-row  items-center gap-8">
            
            {/* Profile Picture Section */}
            <div className="relative group">
              <div className="w-36 h-36 md:w-44 md:h-44 relative">
                {/* Gradient border ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1 animate-pulse">
                  <div className="w-full h-full bg-white rounded-full p-1">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {formData.profilePicture ? (
                        <img
                          src={formData.profilePicture}
                          alt={`${formData.username}'s profile`}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                          <User className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Camera overlay for edit mode */}
                {editMode && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              
              {/* Upload Button */}
              {editMode && (
                <div className="mt-4 text-center">
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              )}
            </div>

            {/* User Info Section */}
          <div className="flex text-center">
  {editMode ? (
    <div className="space-y-4">
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Enter your username"
        className="w-full px-6 py-3 text-xl font-semibold bg-white/70 backdrop-blur-sm border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:shadow-lg transition-all duration-300"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-6 py-3 bg-white/70 backdrop-blur-sm border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:shadow-lg transition-all duration-300"
      />
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        className="w-full px-6 py-3 bg-white/70 backdrop-blur-sm border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:shadow-lg transition-all duration-300 resize-none"
        placeholder="Tell us about yourself..."
        rows="3"
      />
    </div>
  ) : (
    <div className="space-y-3">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        {formData.username}
      </h1>
      <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        {formData.email}
      </p>
      <p className="text-gray-700 leading-relaxed max-w-md mx-auto">
        {formData.bio || "No bio available"}
      </p>
    </div>
  )}
</div>

          </div>

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-300"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {user?.followers.length.toLocaleString()}
                </div>
                <div className="text-blue-600 font-medium">Followers</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-300"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-purple-700 mb-1">
                  {user?.following.length.toLocaleString()}
                </div>
                <div className="text-purple-600 font-medium">Following</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-300"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-green-700 mb-1">
                  {count.toLocaleString()}
                </div>
                <div className="text-green-600 font-medium">Posts</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-300"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-amber-700 mb-1">
                  {user?.bookmarks.length}
                </div>
                <div className="text-amber-600 font-medium">Bookmarks</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={toggleEditMode}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={toggleEditMode}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
            
            <button
              onClick={Chnage}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed  xl:top-2 xl:right-8 lg:top-2 lg:right-6 md:top-6 md:right-6 max-md:top-2 max-md:right-6 z-50 flex gap-3">
          <button
            onClick={del}
            aria-label="Remove all bookmarks"
            className="group relative p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
          >
            <FaTrashAlt className="w-4 h-4" />
          

          </button>

          {bookmarks.length > 0 && (
            <button
              onClick={() => setShow(!show)}
              className="group relative p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
            >
              <FaBookmark className="w-5 h-5" />
              
            </button>
          )}
        </div>
                       

        {/* Posts Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            My Posts
          </h2>
          
          <div className={`grid gap-6 ${use.length ? '' : 'min-h-[200px]'} sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
            {use.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 z-10 transition-all duration-200"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>

                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Post ${index}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4 bg-gradient-to-t from-white to-gray-50">
                  <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                    <strong className="text-gray-900">Caption:</strong> {item.caption || "No caption"}
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    <strong className="text-gray-800">Mood:</strong>{" "}
                    {Object.keys(moods).includes(item.mood)
                      ? `${item.mood} ${moods[item.mood]}`
                      : "Unknown 😶"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookmarks Sidebar */}
      {
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-black   shadow-2xl transform transition-transform duration-500 ease-in-out z-40 ${
            show ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaBookmark className="text-blue-400" />
                Bookmarks
              </h3>
              <button
                onClick={() => setShow(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="space-y-4">
              {bookmarks.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt="Bookmarked post"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-1 line-clamp-2">
                        {item.caption}
                      </p>
                      <p className="text-gray-400 text-sm mb-2">
                        {item.comments.length > 0
                          ? `${item.comments.length} comments`
                          : "No comments"}
                      </p>
                      {item.likes.length > 0 && (
                        <div className="flex items-center text-red-400">
                          <FaHeart className="w-3 h-3 mr-1" />
                          <span className="text-sm">{item.likes.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }

      {/* Backdrop for bookmarks */}
      {!show && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setShow(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
