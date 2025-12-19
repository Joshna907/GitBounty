import React from "react";
import DeveloperSidebar from "../components/DeveloperSidebar";

const DeveloperLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <DeveloperSidebar />

     

      {/* Main Content */}
      <div className="flex-1 px-10 py-10 ml-[260px]">
        {children}
      </div>
    </div>
  );
};

export default DeveloperLayout;
