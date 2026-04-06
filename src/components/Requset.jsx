import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Clock, UserPlus, Users } from "lucide-react";
import { toast } from "react-toastify";

const Request = () => {
const [requests, setRequests] = useState([]);
const [approved, setApproved] = useState([]); 
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  const fetchFollowRequests = async () => {
    try {
      const res = await axios.get(
        "https://chatbackendnew-1.onrender.com/api/auth/users/follow-requests",
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

const handleRespond = async (requesterId, action) => {
  try {
    const res = await axios.post(
      "https://chatbackendnew-1.onrender.com/api/auth/users/follow-request/respond",
      { requesterId, action },
      { headers: { Authorization: `${token}` } }
    );

    toast.success(res.data.message)

console.log(res.data);

    if (action === "approve") {
      // Remove from requests
      setRequests((prev) => prev.filter((r) => r._id !== requesterId));
      // Add to approved list
      setApproved((prev) => [...prev, res.data.user]);
    } else {
      fetchFollowRequests(); // reject ke case me refresh
    }
  } catch (error) {
    console.error(error.response?.data?.message || "Something went wrong");
  }
};

const handleFollowBack = async (userId) => {
  try {
    const res = await axios.post(
      `https://chatbackendnew-1.onrender.com/api/auth/follow-back/${userId}`,
      {},
      { headers: { Authorization: `${token}` } }
    );
        toast.success(res.data.message)


    // Remove from approved list after follow back
    setApproved((prev) => prev.filter((r) => r._id !== userId));
  } catch (err) {
    console.error("Follow back error:", err);
  }
};
console.log(approved);

  useEffect(() => {
    fetchFollowRequests();
  }, []);

  
  return (
  <div>
     <div className="min-h-full">
  <div className="w-full max-w-3xl mt-3 sm:mt-5 px-2 sm:px-4">
    
    <div className="bg-white shadow-xl sm:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
      
      {/* HEADER */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                Follow Requests
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm">
                {requests.length} pending request{requests.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {requests.length > 0 && (
            <div className="bg-white/20 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
              <span className="text-white font-semibold text-xs sm:text-sm">
                {requests.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-8">
        
        {/* PENDING */}
        {requests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-4">
              Pending Requests
            </h2>

            {requests.map((user) => (
              <div
                key={user._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-xl"
              >
                {/* USER */}
                <div className="flex items-center gap-3">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-purple-500 to-pink-500">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="font-semibold text-sm sm:text-base">
                    {user.username}
                  </span>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleRespond(user._id, "approve")}
                    className="flex-1 sm:flex-none px-3 py-2 text-sm bg-green-500 text-white rounded-lg"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleRespond(user._id, "reject")}
                    className="flex-1 sm:flex-none px-3 py-2 text-sm bg-red-500 text-white rounded-lg"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOLLOW BACK */}
        {approved.length > 0 && (
          <div className="space-y-4 mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-4">
              Follow Back
            </h2>

            {approved.map((user) => (
              <div
                key={user._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-blue-500 to-indigo-500">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="font-semibold text-sm sm:text-base">
                    {user.username}
                  </span>
                </div>

                <button
                  onClick={() => handleFollowBack(user._id)}
                  className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-500 text-white rounded-lg"
                >
                  Follow Back
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
</div>
</div>

  );
};

export default Request;
