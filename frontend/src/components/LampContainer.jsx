import React from "react";

const LampContainer = ({ children }) => {
  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden">
      <div className="tube-container">
        {/* Background glow effect */}
        <div className="tube-glow" />
        
        {/* Main tube with sliding beam */}
        <div className="tube">
          <div className="tube-beam" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-24">
        {children}
      </div>
    </div>
  );
};

export default LampContainer;
