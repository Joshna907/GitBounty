import React from "react";
import CreatorSidebar from "../components/CreatorSidebar";

const CreatorLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <CreatorSidebar />

     

      {/* Main Content */}
      <div className="flex-1 px-10 py-10 ml-[260px]">
        {children}
      </div>
    </div>
  );
};

export default CreatorLayout;
