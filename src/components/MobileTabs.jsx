import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  UserCircle,
  MessageCircle,
  Search,
} from 'lucide-react';
import useChatMessages from '../hooks/useChatMessages';
import { io } from 'socket.io-client';

const tabs = [
  { label: "Home", icon: Home, link: "/" },
  { label: "Explore", icon: Search, link: "/explore" },
  { label: "Post", icon: PlusCircle, link: "/create" },
  { label: "Messages", icon: MessageCircle, link: "/messages" },
  { label: "Profile", icon: UserCircle, link: "/profile" },
];

const MobileTabs = () => {
  // const { unreadMessages } = useChatMessages();
  const { messages, unreadMessages, setSocket, setMessages, setUnreadMessages } = useChatMessages();

  const location = useLocation();


 
  

  return (
   <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

      {/* Blur background */}
      <div className="absolute inset-0 rounded-t-3xl overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/8" />
      </div>

      {/* Active top bar */}
      <div className="relative flex justify-around items-center px-2 pt-1 pb-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.link;

          return (
            <NavLink
              key={index}
              to={tab.link}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2 group"
            >
              {/* Top accent line */}
              <span className={`absolute top-0 h-0.5 rounded-b-full transition-all duration-300 ${
                isActive ? 'w-8 bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'w-0 bg-transparent'
              }`} />

              {/* Icon pill */}
              <div className={`relative flex items-center justify-center w-10 h-7 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-indigo-500/20' : 'bg-transparent'
              }`}>
                <Icon className={`h-5 w-5 transition-all duration-300 ${
                  isActive
                    ? 'text-indigo-400 scale-110 -translate-y-px'
                    : 'text-slate-500 group-hover:text-slate-300'
                }`} />

                {/* Notification dot */}
                {tab.label === "Messages" && unreadMessages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-slate-950" />
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                isActive ? 'text-indigo-400' : 'text-slate-500'
              }`}>
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabs;
