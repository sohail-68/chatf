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
<div className="flex flex-col  min-h-screen">
      <Header />
      <div className="flex flex-1 ">
        <Sidebar />
        <div className="md:ml-64 flex-1  ">
          {children}
        </div>
        <div className="">
          <Suggest/>
        </div>
        {/* <Suggest /> */}
       <MobileTabs />
        
      </div>
    </div>
  );
};

export default MainLayout;

