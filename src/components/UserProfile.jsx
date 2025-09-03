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
        `https://chatb-vrft.onrender.com/api/auth/follow/${params.id}`,
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
      `https://chatb-vrft.onrender.com/api/auth/follow-request/${params.id}`,
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
        `https://chatb-vrft.onrender.com/api/auth/userpro/${params.id}`,
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
        `https://chatb-vrft.onrender.com/api/count/${params.id}`,
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
         const newSocket = io('https://chatb-vrft.onrender.com');
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-32"></div>
          
          <div className="relative px-8 pb-8">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src={data.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 flex flex-col lg:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.username}</h1>
                <p className="text-gray-600 text-lg mb-4 max-w-md">{data.bio}</p>
                
                {/* Stats */}
                <div className="flex space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{postCount}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.followers.length}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.following.length}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide">Following</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
            <div className="flex gap-3 mt-2"> {/* Follow / Unfollow */} <button onClick={handleFollowClick} className={`px-5 py-2 rounded-lg font-semibold shadow-sm transition ${ data.followers.includes(sessionStorage.getItem("userid")) ? "bg-gray-400 text-white hover:bg-gray-500" : "bg-blue-500 text-white hover:bg-blue-600" }`} > {data.followers.includes(sessionStorage.getItem("userid")) ? "Unfollow" : "Follow"} </button> {/* Request (only if not following) */} {!data.followers.includes(sessionStorage.getItem("userid")) && ( <button onClick={Follow} className="px-5 py-2 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm transition" > Request </button> )} {/* Message (only if following) */} {data.followers.includes(sessionStorage.getItem("userid")) && ( <button onClick={() => seTNew( location.state ? location.state.post.user._id : params.id ) } className="px-5 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 shadow-sm transition" > Message {messages.length > 0 && `(${messages.length})`} </button> )} </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Grid3X3 size={24} className="text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
            </div>
          </div>

          <div className="p-8">
            {post.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {post.map((item, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt="Post"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart size={20} fill="currentColor" />
                            <span className="font-semibold">{item.likes.length}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle size={20} />
                            <span className="font-semibold">0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-gray-700 text-sm leading-relaxed">{item.caption}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1">
                          <Heart 
                            size={18} 
                            className={`transition-colors cursor-pointer ${
                              item.likes.length > 0 ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-400'
                            }`}
                          />
                          <span className="text-sm text-gray-500">{item.likes.length}</span>
                        </div>
                        <MessageCircle 
                          size={18} 
                          className="text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Grid3X3 size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
                <p className="text-gray-500">When this user shares photos, they'll appear here.</p>
              </div>
            )}
          </div>
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

  );
};

export default UserProfile;
