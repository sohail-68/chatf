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
        `https://chatb-vrft.onrender.com
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
    // Toggle between menu and comment input
    setMenu(menu === newState ? "" : newState);
  };
  const moods = {
    normal: "😐",
    happy: "😊",
    sad: "😢",
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  return (
  <motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  className="relative rounded-2xl backdrop-blur-md bg-white/40 shadow-xl border border-white/30 p-4 mb-6"
>
  {/* Header */}
  <div className="flex items-center gap-3 mb-3">
    <img
      src={post.user.profilePicture}
      alt="Profile"
      className="w-11 h-11 rounded-full object-cover ring-2 ring-white"
    />
    <h6
      className="text-gray-900 font-semibold hover:underline cursor-pointer text-base"
      onClick={openUserProfile}
    >
      {post.user.username}
    </h6>
  </div>

  {/* Post Image */}
  {post.image && (
    <motion.div className="mb-4 rounded-xl overflow-hidden">
      <img
        src={post.image}
        alt="Post"
        className="w-full object-cover rounded-xl shadow"
      />
    </motion.div>
  )}

  {/* Caption */}
  {post.caption && (
    <motion.p
      ref={ref}
      className="text-base font-medium text-gray-800 bg-gray-100 px-4 py-2 rounded-xl shadow-sm"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
    >
      <span className="font-bold text-gray-900">Caption: </span>
      {post.caption}
    </motion.p>
  )}

  {/* Mood */}
  <motion.p
    ref={ref}
    className="text-base font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-xl shadow-sm mt-2"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
  >
    <span className="font-bold text-gray-900">Mood: </span>
    {post.mood === "Normal"
      ? `${post.mood} ${moods.normal}`
      : post.mood === "Sad"
      ? `${post.mood} ${moods.sad}`
      : post.mood === "Happy"
      ? `${post.mood} ${moods.happy}`
      : "Unknown"}
  </motion.p>

  {/* Actions */}
  <div className="flex items-center gap-6 mt-4">
    {/* Like */}
    <motion.button
      onClick={handleLike}
      className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition"
      whileTap={{ scale: 0.9 }}
    >
      {liked ? (
        <Heart className="w-6 h-6 fill-red-500 text-red-500 transition" />
      ) : (
        <Heart className="w-6 h-6 transition" />
      )}
      <span className="text-sm font-medium">{likesCount}</span>
    </motion.button>

    {/* Save */}
    <motion.button
      onClick={() => handleSave(post._id)}
      className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition"
      whileTap={{ scale: 0.9 }}
    >
      <Bookmark className="w-6 h-6 transition" />
      <span className="text-sm font-medium">Save</span>
    </motion.button>

    {/* Comment */}
    <motion.button
      onClick={() => toggleMenu("comment")}
      className="flex items-center gap-2 text-gray-700 hover:text-green-500 transition"
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircleMore className="w-6 h-6 transition" />
      <span className="text-sm font-medium">Comment</span>
    </motion.button>
  </div>

  {/* Comment Input */}
  {menu === "comment" && (
    <motion.form
      onSubmit={handleComment}
      className="flex items-center gap-2 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
    >
      <input
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button type="submit" className="text-blue-600 font-medium">
        Post
      </button>
    </motion.form>
  )}

  {/* Edit/Delete Menu */}
  {menu === "menu" && (
    <motion.div
      className="mt-3 space-y-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
    >
      <button
        className="w-full text-left px-3 py-1.5 rounded-md text-blue-600 font-medium hover:bg-blue-100"
        onClick={handleEdit}
      >
        Edit
      </button>
      <button
        className="w-full text-left px-3 py-1.5 rounded-md text-red-600 font-medium hover:bg-red-100"
        onClick={handleDelete}
      >
        Delete
      </button>
    </motion.div>
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
</motion.div>

  );
};

export default Post;
