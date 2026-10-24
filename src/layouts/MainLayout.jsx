// src/layouts/MainLayout.js
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Suggest from "../components/Suggest";
import MobileTabs from "../components/MobileTabs";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    // 1. Mobile par normal scroll (min-h-screen), Desktop par fix scroll (md:h-screen md:overflow-hidden)
    <div className="flex flex-col min-h-screen md:h-screen md:overflow-hidden bg-gray-50">
      
      <Header />

      {/* 2. Wrapper */}
      <div className="flex flex-1 overflow-hidden relative">
        
        <Sidebar />

        {/* 3. Content Area: Mobile par scroll normal rahega, Desktop par iske andar scroll hoga */}
        <div className="md:ml-64 flex-1 overflow-y-auto h-full pb-20 md:pb-0">
          <div className="">
            {children}
          </div>
        </div>

        {/* 4. Suggest Area: Sirf desktop par dikhega aur scroll hoga */}
        <div className="">
          <Suggest />
        </div>
        
        {/* Mobile Tabs - Make sure yeh fixed ho */}
     {/* Yahan '/message' (singular) aur aage slash '/' ka hona zaroori hai */}
{!location.pathname.includes("/message/") && (
  <div className="fixed bottom-0 w-full z-50 md:hidden">
    <MobileTabs />
  </div>
)}
        
      </div>
    </div>
  );
};

export default MainLayout;
