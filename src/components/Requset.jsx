import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Clock, UserPlus, Users } from "lucide-react";

const Request = () => {
const [requests, setRequests] = useState([]);
const [approved, setApproved] = useState([]); 
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

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

const handleRespond = async (requesterId, action) => {
  try {
    const res = await axios.post(
      "https://chatb-vrft.onrender.com/api/auth/users/follow-request/respond",
      { requesterId, action },
      { headers: { Authorization: `${token}` } }
    );

    alert(res.data.message);

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
      `https://chatb-vrft.onrender.com/api/auth/follow-back/${userId}`,
      {},
      { headers: { Authorization: `${token}` } }
    );
    alert(res.data.message);

    // Remove from approved list after follow back
    setApproved((prev) => prev.filter((r) => r._id !== userId));
  } catch (err) {
    console.error("Follow back error:", err);
  }
};

  useEffect(() => {
    fetchFollowRequests();
  }, []);

  
  return (
   <div className="min-h-screen flex  justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  <div className="max-w-7xl mt-5 w-full mx-auto px-4">
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
  {/* Pending Requests */}
  {requests.length > 0 && (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-4">Pending Requests</h2>
      {requests.map((user) => (
        <div key={user._id} className="flex justify-between items-center p-4 border rounded-xl">
          <div className="flex items-center gap-3">
            <img src={user.profilePicture} alt={user.username} className="w-12 h-12 rounded-full" />
            <span className="font-semibold">{user.username}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleRespond(user._id, "approve")} className="px-4 py-2 bg-green-500 text-white rounded-lg">Accept</button>
            <button onClick={() => handleRespond(user._id, "reject")} className="px-4 py-2 bg-red-500 text-white rounded-lg">Decline</button>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Approved Users (Follow Back Option) */}
  {approved.length > 0 && (
    <div className="space-y-4 mt-8">
      <h2 className="text-lg font-bold mb-4">Follow Back</h2>
      {approved.map((user) => (
        <div key={user._id} className="flex justify-between items-center p-4 border rounded-xl">
          <div className="flex items-center gap-3">
            <img src={user.profilePicture} alt={user.username} className="w-12 h-12 rounded-full" />
            <span className="font-semibold">{user.username}</span>
          </div>
          <button
            onClick={() => handleFollowBack(user._id)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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

  );
};

export default Request;
