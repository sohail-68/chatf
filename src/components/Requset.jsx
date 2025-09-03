import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Clock, UserPlus, Users } from "lucide-react";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  // Fetch pending follow requests
  const fetchFollowRequests = async () => {
    try {
      const res = await axios.get(
        "https://chatb-vrft.onrender.com/api/auth/users/follow-requests",
        {
          headers: { Authorization: `${token}` },
        }
      );
      setRequests(res.data.followRequests || []);
    } catch (error) {
      console.error(
        "Error fetching follow requests:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Approve or reject request
  const handleRespond = async (requesterId, action) => {
    try {
      const res = await axios.post(
        "https://chatb-vrft.onrender.com/api/auth/users/follow-request/respond",
        { requesterId, action },
        { headers: { Authorization: `${token}` } }
      );
      alert(res.data.message);
      fetchFollowRequests(); // refresh after action
    } catch (error) {
      console.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchFollowRequests();
  }, []);

  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  <div className="max-w-7xl w-full mx-auto px-4">
    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
      
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Follow Requests</h1>
              <p className="text-blue-100 text-sm">
                {requests.length} pending request{requests.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {requests.length > 0 && (
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="text-white font-semibold text-sm">{requests.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No follow requests</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              When someone requests to follow you, their request will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((user, index) => (
              <div
                key={user._id}
                className="group relative bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-blue-200"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards",
                }}
              >
                <div className="flex items-center justify-between">
                  {/* User Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative">
                      <img
                        src={user.profilePicture || "https://via.placeholder.com/60"}
                        alt={user.username}
                        className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <UserPlus className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg truncate">{user.username}</h3>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{user.requestedAt}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {user.bio || "No bio available"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 ml-4">
                    <button
                      onClick={() => handleRespond(user._id, "approve")}
                      className="group/btn relative px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => handleRespond(user._id, "reject")}
                      className="group/btn relative px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <span>Decline</span>
                    </button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
</div>

  );
};

export default Request;
