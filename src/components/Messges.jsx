// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import { FiMoreVertical, FiSend } from 'react-icons/fi';
// import useChatMessages from '../hooks/useChatMessages';
// import { ArrowLeft, MoreVertical, SendHorizonal } from 'lucide-react';
// import socket from "./socket";

// const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const isToday = date.toDateString() === now.toDateString();
//     const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
//     return isToday ? time : `${date.toLocaleDateString()} ${time}`;
// };


// const Chat = () => {
//   const { setMessages, messages, } = useChatMessages();
//   const currentUserId = sessionStorage.getItem("userid");
//   const { id: recipientId } = useParams();
//   const location = useLocation();

//   const [message, setMessage] = useState("");
//   const [data, setData] = useState({});
//   const [focus, setFocus] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const navigate = useNavigate();

//   const userId = sessionStorage.getItem("userid");
//   // 🔌 Socket setup
//   useEffect(() => {
//   if (userId) {
//     socket.connect();
//     socket.emit("joinRoom", String(userId));
//   }
// }, []);
//   useEffect(() => {

//     socket.emit("joinRoom", currentUserId);

//     // incoming message listener
//     socket.on("receiveMessage", (msg) => {
//       if (
//         (msg.sender === recipientId && msg.receiver === currentUserId) ||
//         (msg.sender === currentUserId && msg.receiver === recipientId)
//       ) {
//         setMessages((prev) => {
//           const updatedMessages = [...prev, msg];
//           localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
//           return updatedMessages;
//         });
//       }
//     });

//     // typing events
//     socket.on("typing", (userId) => {
//       if (userId === recipientId) setIsTyping(true);
//     });

//     socket.on("stopTyping", (userId) => {
//       if (userId === recipientId) setIsTyping(false);
//     });

//     return () => socket.disconnect();
//   }, [currentUserId, recipientId, setMessages, ]);

//   // 📥 Fetch messages from API
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(
//           `https://chatb-vrft.onrender.com/api/messages/${recipientId}`,
//           {
//             headers: {
//               Authorization: sessionStorage.getItem("token"),
//             },
//           }
//         );
//         setMessages(res.data);
//         localStorage.setItem("chatMessages", JSON.stringify(res.data));
//       } catch (err) {
//         console.error("Error fetching chat messages:", err);
//       }
//     };

//     fetchMessages();
//   }, [currentUserId, recipientId, setMessages]);

//   // ✉️ Send message
//   const sendMessage = () => {
//     if (message.trim()) {
//       const msgData = {
//         sender: currentUserId,
//         receiver: recipientId,
//         content: message,
//        createdAt: new Date().toISOString(),

//       };

//       socket.emit("sendMessage", msgData);

//       setMessages((prev) => {
//         const updatedMessages = [...prev, msgData];
//         localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
//         return updatedMessages;
//       });

//       setMessage("");
//       socket.emit("stopTyping", currentUserId);
//     }
//   };

//   // ✍️ Handle typing
//   const handleTyping = (e) => {
//     setMessage(e.target.value);
//     if (e.target.value) {
//       socket.emit("typing", currentUserId);
//     } else {
//       setFocus(false);
//       socket.emit("stopTyping", currentUserId);
//     }
//   };

//   console.log(messages);
  
//   // 👤 Fetch recipient profile
//   const fetchUserProfile = async () => {
//     try {
//       const res = await axios.get(
//         `https://chatb-vrft.onrender.com/api/auth/userpro/${recipientId}`,
//         { headers: { Authorization: sessionStorage.getItem("token") } }
//       );
//       setData(res.data);
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, [recipientId]);

//   return (
// <div className="flex flex-col justify-between h-screen bg-white">
//   {/* Header */}
//   <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
//     <button
//       onClick={() => navigate(-1)}
//       className="p-2 hover:bg-gray-100 rounded-full transition"
//     >
//       <ArrowLeft className="h-5 w-5 text-gray-800" />
//     </button>

//     <Link to={`/userprofile/${data._id}`} className="flex items-center gap-3 flex-1">
//       <img
//         src={data.profilePicture}
//         alt="Profile"
//         className="w-9 h-9 rounded-full object-cover"
//       />
//       <div className="truncate">
//         <h2 className="text-sm font-semibold text-gray-900 truncate">{data.username}</h2>
//         {isTyping && (
//           <span className="text-xs text-gray-500 italic animate-pulse">Typing...</span>
//         )}
//       </div>
//     </Link>

//     <button className="p-2 hover:bg-gray-100 rounded-full transition">
//       <MoreVertical className="h-5 w-5 text-gray-800" />
//     </button>
//   </div>

//   {/* Messages */}
//   <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
//     {(location.state || messages).map((msg, idx) => (
//       <div
//         key={idx}
//        className={`flex ${
//     String(msg.sender?._id || msg.sender) === String(currentUserId)
//       ? "justify-end"
//       : "justify-start"
//   }`}
//       >
//         <div
//           className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] shadow ${
//                String(msg.sender?._id || msg.sender) === String(currentUserId)

//               ? "bg-blue-500 text-white rounded-br-none"
//               : "bg-gray-200 text-gray-800 rounded-bl-none"
//           }`}
//         >
//           {msg.content}
//           <div className="text-[10px] text-gray-500 mt-1 text-right">
//                 {new Date(msg.createdAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>

//   {/* Input Section */}
//   <div className="border-t border-gray-200 bg-white px-3 py-2 flex items-center gap-2">
//     <input
//       type="text"
//       value={message}
//       onChange={handleTyping}
//       onFocus={() => setFocus(true)}
//       onBlur={() => setFocus(false)}
//       placeholder="Message..."
//       className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
//     />
//     <button
//       onClick={sendMessage}
//       className="p-2 text-blue-500 hover:scale-110 transition-transform"
//     >
//       <SendHorizonal className="h-6 w-6" />
//     </button>
//   </div>
// </div>

//   );
// };

// export default Chat;






// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import io from "socket.io-client";
// import axios from "axios";

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [newMsg, setNewMsg] = useState("");
//   const [userData, setUserData] = useState(null);
//   const { id: receiverId } = useParams();
//   const currentUserId = sessionStorage.getItem("userid");
//   const messagesEndRef = useRef(null);
//   const socketRef = useRef(null); // 🔑 store socket instance

//   useEffect(() => {
//     if (!currentUserId) return;

//     const socket = io("https://chatb-vrft.onrender.com");
//     socketRef.current = socket; // save in ref

//     socket.emit("join", currentUserId);

//     // Fetch old messages
//     axios
//       .get(`https://chatb-vrft.onrender.com/api/messages/${receiverId}`, {
//         headers: { Authorization: sessionStorage.getItem("token") },
//       })
//       .then((res) => setMessages(res.data))
//       .catch((err) => console.error("Fetch messages error:", err));

//     // Fetch user profile
//     axios
//       .get(`https://chatb-vrft.onrender.com/api/auth/userpro/${receiverId}`, {
//         headers: { Authorization: sessionStorage.getItem("token") },
//       })
//       .then((res) => setUserData(res.data))
//       .catch((err) => console.error("Fetch user error:", err));

//     // Real-time receive
//     socket.on("receiveMessage", (msg) => {
//     if (
//   (msg.senderId === receiverId && msg.receiverId === currentUserId) ||
//   (msg.senderId === currentUserId && msg.receiverId === receiverId)
// ) {
//   setMessages((prev) => [...prev, msg]);
// }

//     });


//     // Clean-up
//     return () => {
//       socket.off("receiveMessage");
//       socket.disconnect(); // 🔑 disconnect properly
//     };
//   }, [currentUserId, receiverId]);

//   console.log(messages);
  
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     if (!newMsg.trim() || !socketRef.current) return;

//     const message = {
//       senderId: currentUserId,
//       receiverId,
//       content: newMsg,
//       createdAt: new Date().toISOString(),
//     };

//     socketRef.current.emit("sendMessage", message); // ✅ use ref

//     setMessages((prev) => [...prev, message]); // optimistic UI
//     setNewMsg("");
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Chat Header */}
//       <div className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 shadow-md">
//         {userData && (
//           <img
//             src={userData.profilePicture || "https://via.placeholder.com/40"}
//             alt="profile"
//             className="w-10 h-10 rounded-full border-2 border-white object-cover"
//           />
//         )}
//         <div>
//           <h2 className="font-semibold text-base">
//             {userData?.username || "Chat"}
//           </h2>
//           <p className="text-xs text-gray-200">Online</p>
//         </div>
//       </div>

//       {/* Messages Section */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`flex ${
//               m.senderId === currentUserId ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${
//                 m.senderId === currentUserId
//                   ? "bg-blue-500 text-white rounded-br-none"
//                   : "bg-white text-gray-800 border rounded-bl-none"
//               }`}
//             >
//               {m.content}
//               <div className="text-[10px] text-gray-300 mt-1 text-right">
//                 {new Date(m.createdAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef}></div>
//       </div>

//       {/* Input Section */}
//       <div className="p-3 bg-white border-t flex items-center gap-2">
//         <input
//           value={newMsg}
//           onChange={(e) => setNewMsg(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={sendMessage}
//           className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, MoreVertical, SendHorizonal } from "lucide-react";
import useChatMessages from "../hooks/useChatMessages";
import { getSocket } from "./socket"; // ✅ import singleton socket

const Chat = () => {
  const { setMessages, messages, setSocket } = useChatMessages();
  const currentUserId = sessionStorage.getItem("userid");
  const { id: recipientId } = useParams();
  const location = useLocation();

  const [message, setMessage] = useState("");
  const [data, setData] = useState({});
  const [focus, setFocus] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  // 🔌 Socket setup
  useEffect(() => {
    const socket = getSocket();
    socket.connect(); // ✅ connect explicitly
    setSocket(socket);

    socket.emit("joinRoom", currentUserId);

    // incoming message listener
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.sender === recipientId && msg.receiver === currentUserId) ||
        (msg.sender === currentUserId && msg.receiver === recipientId)
      ) {
        setMessages((prev) => {
          const updatedMessages = [...prev, msg];
          localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      }
    });

    // typing events
    socket.on("typing", (userId) => {
      if (userId === recipientId) setIsTyping(true);
    });

    socket.on("stopTyping", (userId) => {
      if (userId === recipientId) setIsTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [currentUserId, recipientId, setMessages, setSocket]);

  // 📥 Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://chatb-vrft.onrender.com/api/messages/${recipientId}`,
          {
            headers: {
              Authorization: sessionStorage.getItem("token"),
            },
          }
        );
        setMessages(res.data);
        localStorage.setItem("chatMessages", JSON.stringify(res.data));
      } catch (err) {
        console.error("Error fetching chat messages:", err);
      }
    };

    fetchMessages();
  }, [currentUserId, recipientId, setMessages]);

  // ✉️ Send message
  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        sender: currentUserId,
        receiver: recipientId,
        content: message,
        createdAt: new Date().toISOString(),
      };

      const socket = getSocket();
      socket.emit("sendMessage", msgData);

      setMessages((prev) => {
        const updatedMessages = [...prev, msgData];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      setMessage("");
      socket.emit("stopTyping", currentUserId);
    }
  };

  // ✍️ Handle typing
  const handleTyping = (e) => {
    setMessage(e.target.value);
    const socket = getSocket();
    if (e.target.value) {
      socket.emit("typing", currentUserId);
    } else {
      setFocus(false);
      socket.emit("stopTyping", currentUserId);
    }
  };

  // 👤 Fetch recipient profile
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        `https://chatb-vrft.onrender.com/api/auth/userpro/${recipientId}`,
        { headers: { Authorization: sessionStorage.getItem("token") } }
      );
      setData(res.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [recipientId]);

  return (
    <div className="flex flex-col justify-between h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-800" />
        </button>

        <Link
          to={`/userprofile/${data._id}`}
          className="flex items-center gap-3 flex-1"
        >
          <img
            src={data.profilePicture}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="truncate">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {data.username}
            </h2>
            {isTyping && (
              <span className="text-xs text-gray-500 italic animate-pulse">
                Typing...
              </span>
            )}
          </div>
        </Link>

        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <MoreVertical className="h-5 w-5 text-gray-800" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
        {(location.state || messages).map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              String(msg.sender?._id || msg.sender) === String(currentUserId)
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] shadow ${
                String(msg.sender?._id || msg.sender) === String(currentUserId)
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.content}
              <div className="text-[10px] text-gray-500 mt-1 text-right">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-200 bg-white px-3 py-2 flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder="Message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <button
          onClick={sendMessage}
          className="p-2 text-blue-500 hover:scale-110 transition-transform"
        >
          <SendHorizonal className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
