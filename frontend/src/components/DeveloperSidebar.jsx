import React from "react";
import { FaHome, FaCode, FaClock, FaEthereum, FaMedal, FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DeveloperSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaHome />, label: "Overview", tab: "overview" },
    { icon: <FaClock />, label: "My Submissions", tab: "submissions" },
    { icon: <FaEthereum />, label: "Earnings", tab: "earnings" },
    { icon: <FaMedal />, label: "NFT Badges", tab: "badges" },
    { icon: <FaBell />, label: "Notifications", tab: "notifications" },
    { icon: <FaUser />, label: "Profile", tab: "profile" },
  ];

  return (
    <aside
      className="w-72 h-screen bg-[#0d0d0d]/80 backdrop-blur-lg border-r border-[#f50090]/25 
                 shadow-[6px_0_35px_rgba(245,0,144,0.35)] p-6 flex flex-col fixed left-0 top-0 z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center space-x-3">
          <img src="/images/logo.png" alt="logo" className="h-14 font-extrabold text-3xl" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-4 font-medium text-base">
        {menuItems.map((item, i) => (
          <div
            key={i}
            onClick={() => setActiveTab(item.tab)}
            className={`flex items-center gap-3 transition cursor-pointer p-3 rounded-lg ${
              activeTab === item.tab
                ? "bg-[#f50090]/20 text-[#f50090] border border-[#f50090]/40"
                : "text-gray-300 hover:text-[#f50090] hover:bg-[#f50090]/10"
            }`}
          >
            <span className="text-[#f50090] text-sm">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 py-2 text-base font-bold rounded-full
                     bg-gradient-to-r from-[#f50090] via-[#9b23ea] to-indigo-600 hover:opacity-90 transition-all
                     shadow-[0_0_20px_rgba(245,0,144,0.55)]"
        >
          <FaSignOutAlt className="text-sm" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default DeveloperSidebar;