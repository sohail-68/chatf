import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaUserCircle, FaCommentDots, FaBell, FaSearch } from 'react-icons/fa'; // Different icons from Font Awesome
import useChatMessages from '../hooks/useChatMessages';
import { io } from 'socket.io-client';
import {
  Home,
  PlusCircle,
  UserCircle,
  MessageCircle,
  Bell,
  Search,
  LogIn,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import axios from 'axios';

const data = [
  { label: "Home", icon: <Home className="h-5 w-5" />, link: "/" },
  { label: "Create Post", icon: <PlusCircle className="h-5 w-5" />, link: "/create" },
  { label: "request", icon: <PlusCircle className="h-5 w-5" />, link: "/request" },
  { label: "Profile", icon: <UserCircle className="h-5 w-5" />, link: "/profile" },
  { label: "Messages", icon: <MessageCircle className="h-5 w-5" />, link: "/messages" },
  { label: "Notifications", icon: <Bell className="h-5 w-5" />, link: "/noti" },
  { label: "Explore", icon: <Search className="h-5 w-5" />, link: "/explore" },
  { label: "Login", icon: <LogIn className="h-5 w-5" />, link: "/login" },
  { label: "Logout", icon: <LogOut className="h-5 w-5" />, },
];



const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // For controlling sidebar on smaller screens
  const [activeIndex, setActiveIndex] = useState(0);
  const { messages, unreadMessages, setSocket, setMessages, setUnreadMessages } = useChatMessages();

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);
  
    // Join room
    newSocket.emit('joinRoom', sessionStorage.getItem("userid"));
  
    // Listen for messages
    newSocket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
      setUnreadMessages((prev) => prev + 1);
    });
  
    // Cleanup
    return () => {
      newSocket.off('receiveMessage'); // Ensure listener is removed
      newSocket.disconnect();
    };
  }, [setMessages, setSocket, setUnreadMessages]);

  useEffect(() => {
    if (location.pathname === "/messages") {
      setUnreadMessages(0); // Reset unread messages on Messages page
    }
  }, [location.pathname, setUnreadMessages]);

  useEffect(() => {
  }, [unreadMessages]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional API call to backend if needed
      await axios.post("http://localhost:5001/api/auth/logout", {}, {
        headers: {
          Authorization: `${sessionStorage.getItem("token")}`,
        },
      });

      // Clear token/session on frontend
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userid");
      sessionStorage.removeItem("user");

      // Redirect to login or homepage
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <>
  <button
  onClick={() => setIsOpen(!isOpen)}
  className="p-2 md:hidden fixed z-50 top-5 left-4 bg-white rounded-lg shadow-sm"
>
  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
</button>

{/* Sidebar */}
<div
  className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out 
  ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
>
  {/* Logo / Title */}
  <div className="p-4 border-b">
    <h1 className="text-xl font-bold text-center text-gray-800">Instagram Clone</h1>
  </div>

  {/* Navigation */}
  <nav className="mt-6">
    <ul className="space-y-2 px-3">
      {data.map((item, index) => (
        <li
          key={index}
          onClick={() => {
            setActiveIndex(index);
            setIsOpen(false);
            item.label === "Logout" && handleLogout();
          }}
          className={`rounded-lg transition-all duration-300 ease-in-out ${
            activeIndex === index ? "bg-slate-900" : ""
          }`}
        >
          <Link
            to={item.link}
            className={`flex items-center space-x-3 text-base font-medium px-3 py-2 rounded-lg transition-colors ${
              activeIndex === index ? "text-white" : "text-gray-700"
            } hover:bg-slate-800 hover:text-white`}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.label === "Messages" && unreadMessages > 0 && (
              <span className="ml-2 text-xs text-blue-600 font-bold bg-white rounded-full px-2">
                {unreadMessages}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  </nav>

  {/* Footer */}
  <div className="absolute bottom-4 left-0 w-full text-center">
    <p className="text-sm text-gray-500">© 2025 ChatGram</p>
  </div>
</div>

    </>
  );
};

export default Sidebar;
