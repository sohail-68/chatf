import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";
// import useChatMessages from '../hooks/useChatMessages';
import { io } from 'socket.io-client';
import { useChatMessages } from '../context/AuthContext'; // Make sure this 
// ipath is correct
import { toast, ToastContainer } from 'react-toastify';
import { Grid3X3, Heart, MessageCircle } from 'lucide-react';
import "react-toastify/dist/ReactToastify.css";


const UserProfile = () => {
  // const {messages,unreadMessages,setSocket,  setMessages,setUnreadMessages}=useChatMessages()
  const { messages,setSocket,socket ,suggestedUsers,fetchSuggestedUsers, setMessages } = useChatMessages();


  const location = useLocation();
 //location);
  
  const params = useParams();
  console.log(params,"ppp");
  
 //params);
 //location);
  const currentUserId = sessionStorage
.getItem("userid");

  const navigate=useNavigate()
  
  const [isFollowing, setIsFollowing] = useState("");
  const [data, setData] = useState(null);
  const [post, setPost] = useState([]);
  const [showChat, setShowChat] = useState(false); // Toggle for chat box visibility
  const token = sessionStorage
.getItem('token');
  const [postCount, setPostCount] = useState(null);

  // Initial check to see if the user is already following
  useEffect(() => {
    if (location.state?.isFollowing) {
      setIsFollowing(location.state.isFollowing);
    }
  }, [location.state]);

  // Toggle follow/unfollow status
  const handleFollowClick = async () => {
    try {
      const res = await axios.post(
        `https://chatbackendnew-1.onrender.com/api/auth/follow/${params.id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setIsFollowing(res.data.message);
      
      fetchUserProfile(); // Refresh user profile data
fetchSuggestedUsers()
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
    }
  };
console.log(token);

const Follow = async () => {
  try {
    const res = await axios.post(
      `https://chatbackendnew-1.onrender.com/api/auth/follow-request/${params.id}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    console.log(res);
    toast.success(res.data.message)
    
    fetchUserProfile(); // Refresh user profile data
} catch (error) {
    console.error("Failed to toggle follow status:", error);
  }
};
console.log(isFollowing);


console.log(data);

  // Fetch user profile and post count
  const fetchUserProfile = async () => {
    try {
      const profileResponse = await axios.get(
        `https://chatbackendnew-1.onrender.com/api/auth/userpro/${params.id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setData(profileResponse.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
 //data);
  console.log("da",data);
  
  const fetchPostCount = async () => {
    try {
      const postResponse = await axios.get(
        `https://chatbackendnew-1.onrender.com/api/count/${params.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
     //postResponse);
      
      setPostCount(postResponse.data.postCount);
      setPost(postResponse.data.postdata); 
      // setpost(postResponse.data.postdata);
    } catch (err) {
      console.error('Error fetching post count:', err);
    }
  };
console.log("pos",post);

  useEffect(() => {
    fetchUserProfile();
    fetchPostCount();
         const newSocket = io('https://chatbackendnew-1.onrender.com');
    setSocket(newSocket);

    newSocket.emit('joinRoom', currentUserId);
        // Listen for incoming messages
        newSocket.on('receiveMessage', (msg) => {
          setMessages((prev) => [...prev, msg]);
          
          // setUnreadMessages((pre)=>pre+1)

          // Show notification if the message is from the other user and the chat window is not in focus
         
      });
  }, []);

  if (!data) return <div>Loading...</div>;
function seTNew(id){
 //id);
  
  navigate(`/message/${id}`)
}
  return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
  <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
    
    {/* Profile Header */}
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mb-6 sm:mb-8">
      {/* Cover Image */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-24 sm:h-28 md:h-32"></div>
      
      <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
        {/* Profile Picture - Responsive positioning */}
        <div className="flex flex-col sm:flex-row sm:items-end relative">
          <div className="relative -mt-12 sm:-mt-16 md:-mt-20 mb-4 sm:mb-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white mx-auto sm:mx-0">
           {data.profilePicture ? (
                <img
                  src={data.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-600">
                        ${data.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-600">
                  {data.username?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>
          </div>

          {/* Profile Info - Mobile responsive */}
          <div className="flex-1 text-center sm:text-left sm:ml-6 md:ml-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {data.username}
                </h1>
                {data.bio && (
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 max-w-md mx-auto sm:mx-0">
                    {data.bio}
                  </p>
                )}
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex gap-2 mt-2 sm:gap-3 justify-center sm:justify-start">
                {/* Follow / Unfollow Button */}
                <button
                  onClick={handleFollowClick}
                  className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold shadow-sm transition text-sm sm:text-base ${
                    data.followers?.includes(sessionStorage.getItem("userid"))
                      ? "bg-gray-400 text-white hover:bg-gray-500"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {data.followers?.includes(sessionStorage.getItem("userid"))
                    ? "Unfollow"
                    : "Follow"}
                </button>

                {/* Request Button */}
                {!data.followers?.includes(sessionStorage.getItem("userid")) && (
                  <button
                    onClick={Follow}
                    className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm transition text-sm sm:text-base"
                  >
                    Request
                  </button>
                )}

                {/* Message Button */}
                {data.followers?.includes(sessionStorage.getItem("userid")) && (
                  <button
                    onClick={() => seTNew(location.state?.post?.user?._id || params.id)}
                    className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 shadow-sm transition text-sm sm:text-base"
                  >
                    Message
                    {messages.length > 0 && (
                      <span className="ml-1 sm:ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {messages.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Stats - Responsive grid */}
            <div className="flex justify-center sm:justify-start space-x-6 sm:space-x-8 mt-4 sm:mt-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{postCount || 0}</div>
                <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{data.followers?.length || 0}</div>
                <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{data.following?.length || 0}</div>
                <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Posts Section */}
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Grid3X3 size={20} className="text-gray-600 sm:w-6 sm:h-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Posts</h2>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {post?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {post.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Post Image */}
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={item.image}
                    alt="Post"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                  
                  {/* Hover Overlay */}
             
                </div>

                {/* Post Info */}
                <div className="p-3 sm:p-4">
                  {item.caption && (
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                  
                
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Grid3X3 size={28} className="text-gray-400 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              When this user shares photos, they'll appear here.
            </p>
          </div>
        )}
      </div>
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
</div>

  );
};

export default UserProfile;
