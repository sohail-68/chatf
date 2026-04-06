import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { useChatMessages } from '../context/AuthContext';
import { ArrowLeft } from "lucide-react";

const Messgesss = () => {
  const { suggestedUsers, fetchSuggestedUsers, notification } = useChatMessages();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const Chat = (userId) => {
    navigate(`/message/${userId}`);
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  // 🔍 Filter users based on search
  const filteredUsers = suggestedUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* 🔙 Back Button */}
      <div className="flex items-center gap-3 mt-6 px-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <div className="px-4 mt-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 📦 Container */}
      <div className="max-w-2xl mx-auto mt-6 px-4 py-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Suggestions For You
        </h3>

        <div className="space-y-6">
          {/* ❌ No users found */}
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-start justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                {/* 👤 User Info */}
                <div className="flex gap-4">
               {user.profilePicture ? (
  <img
    src={user.profilePicture}
    alt={user.username}
    className="w-14 h-14 rounded-full object-cover border"
  />
) : (
  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500">
    {user.username?.charAt(0).toUpperCase()}
  </div>
)}
                  <div>
                    <p className="text-md font-semibold text-gray-800">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Joined:{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                {/* ✉️ Message Button */}
                <button
                  onClick={() => Chat(user._id)}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 border border-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50 hover:shadow-sm transition"
                >
                  <FaPaperPlane />
                  Message
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Messgesss;
