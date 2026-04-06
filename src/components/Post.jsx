import { Trash2, Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import {
  likePost,
  commentOnPost,
  Del,
} from "../services/api";
import { HeartIcon, BookmarkIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import {
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaEdit,
  FaEllipsisV,
  FaBookmark,
  FaCommentDots,
} from "react-icons/fa";
import { Heart, Bookmark, MessageCircleMore, HeartCrack } from "lucide-react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles
const Post = ({ post, handleDeleteSuccess }) => {
  const [comment, setComment] = useState("");
  const [menu, setMenu] = useState(""); // Menu state for managing different UI views
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const isPostLiked = post.likes.some(
      (like) => like.user === sessionStorage.getItem("userid")
    );
    setLiked(isPostLiked);
  }, [post.likes]);

  const handleLike = async () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    try {
      const updatedPost = await likePost(post._id);
      const isLiked = updatedPost.data.post.likes.some(
        (like) => like.user === sessionStorage.getItem("userid")
      );
      setLiked(isLiked);
      setLikesCount(updatedPost.data.post.likes.length);
    } catch (error) {
      console.error("Error liking post:", error);
      setLiked(!liked); // Revert like on error
      setLikesCount(liked ? likesCount + 1 : likesCount - 1);
    }
  };
  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await commentOnPost(post._id, { text: comment });
      setComment("");
  
      // Toast notification for success
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error commenting on post:", error);
  
      // Toast notification for error
      toast.error("Failed to post comment. Please try again.");
    }
  };
  

  const handleEdit = () =>
    navigate(`create/${post._id}`, { state: { post } });

  const handleDelete = async () => {
    try {
      await Del(post._id);
      handleDeleteSuccess(post._id);
  
      // Toast notification for success
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
  
      // Toast notification for error
      toast.error("Failed to delete post. Please try again.");
    }
  };
  

  const openUserProfile = () => {
    if (post.user._id === sessionStorage.getItem("userid")) {
      navigate("/profile");
    } else {
      navigate(`/userprofile/${post.user._id}`, { state: { post } });
    }
  };

  const handleSave = async (data) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");
  
      await axios.post(
        `http://localhost:5001
/api/auth/bookmark/${data}`,
        {},
        { headers: { Authorization: `${token}` } }
      );
  
      // Toast notification for success
      toast.success("Post bookmarked successfully!");
    } catch (error) {
      console.error("Error bookmarking post:", error);
  
      // Toast notification for error
      toast.error("Failed to bookmark post. Please try again.");
    }
  };
  

  const toggleMenu = (newState) => {
    console.log(newState);
    
    // Toggle between menu and comment input
    setMenu(menu === newState ? "" : newState);
  };
  const moods = {
    normal: "😐",
    happy: "😊",
    sad: "😢",
  };

  // Animation Variants
 

  return (
<div className="relative rounded-xl bg-white shadow-sm border border-gray-200 mb-4 overflow-hidden">
  {/* Header */}
  <div className="flex items-center justify-between px-4 pt-3 pb-2">
    <div className="flex items-center gap-3">
      {
        post.user.profilePicture ? (
          <img
            src={post.user.profilePicture}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500">
            {post.user.username?.charAt(0).toUpperCase()}
          </div>
        )
      }
    
      <div className="flex flex-col">
        <h6
          className="font-semibold text-sm hover:underline cursor-pointer text-gray-900"
          onClick={openUserProfile}
        >
          {post.user.username}
        </h6>
        {post.location && (
          <span className="text-xs text-gray-500">{post.location}</span>
        )}
      </div>
    </div>
    {/* <button
      onClick={() => toggleMenu("menu")}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    </button> */}
  </div>

  {/* Post Image with improved no-image design */}
  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
    {post.image ? (
      <div className="relative group">
        <img
          src={post.image}
          alt="Post"
          className="w-full max-h-[600px] max-md:max-h-[300px] object-cover bg-black/5"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `
              <div class="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                <svg class="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-gray-500 text-sm">Image failed to load</p>
              </div>
            `;
          }}
        />
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-80 bg-gradient-to-br from-gray-50 to-gray-100">
        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-400 text-sm font-medium">No image to display</p>
        <p className="text-gray-300 text-xs mt-1">Share a moment with an image</p>
      </div>
    )}
  </div>

  {/* Action Buttons */}
  <div className="px-4 pt-2 pb-1">
    <div className="flex items-center gap-4">
      <button
        onClick={handleLike}
        className="p-1.5 hover:bg-gray-100 rounded-full transition-all transform hover:scale-105"
      >
        {liked ? (
          <Heart className="w-6 h-6 fill-red-500 text-red-500 transition" />
        ) : (
          <Heart className="w-6 h-6 text-gray-700 transition" />
        )}
      </button>

      <button
        onClick={() => toggleMenu("comment")}
        className="p-1.5 hover:bg-gray-100 rounded-full transition-all transform hover:scale-105"
      >
        <MessageCircleMore className="w-6 h-6 text-gray-700 transition" />
      </button>

      <button
        onClick={() => handleSave(post._id)}
        className="p-1.5 hover:bg-gray-100 rounded-full transition-all transform hover:scale-105 ml-auto"
      >
        <Bookmark className="w-6 h-6 text-gray-700 transition" />
      </button>
    </div>

    {/* Likes count */}
    {likesCount > 0 && (
      <div className="mt-2">
        <span className="text-sm font-semibold text-gray-900">
          {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
        </span>
      </div>
    )}
  </div>

  {/* Caption */}
  {(post.caption || post.mood) && (
    <div className="px-4 pb-2">
      {post.caption && (
        <p className="text-sm text-gray-800">
          <span className="font-semibold text-gray-900">{post.user.username}</span>{" "}
          {post.caption}
        </p>
      )}
      
      {/* Mood badge */}
      {post.mood && (
        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
          <span className="text-gray-600">Feeling</span>
          <span className="font-medium text-gray-800">
            {post.mood === "Normal" && `😐 ${post.mood}`}
            {post.mood === "Sad" && `😢 ${post.mood}`}
            {post.mood === "Happy" && `😊 ${post.mood}`}
            {!["Normal", "Sad", "Happy"].includes(post.mood) && post.mood}
          </span>
        </div>
      )}
    </div>
  )}

  {/* Comment Input */}
  {menu === "comment" && (
    <div className="border-t border-gray-100 mt-2 pt-3 px-4 pb-3">
      <form onSubmit={handleComment} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border-0 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
        <button 
          type="submit" 
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            comment.trim() 
              ? 'text-blue-600 hover:bg-blue-50' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          disabled={!comment.trim()}
        >
          Post
        </button>
      </form>
    </div>
  )}

  {/* Edit/Delete Menu */}
  {menu === "menu" && (
    <div className="absolute right-4 top-12 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-200">
      <button
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        onClick={handleEdit}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </button>
      <button
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
        onClick={handleDelete}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
  )}

  <ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    draggable
    theme="colored"
  />
</div>

  );
};

export default Post;
