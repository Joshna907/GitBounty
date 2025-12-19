import React from "react";
import {
  FaHome,
  FaChartLine,
  FaMedal,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DeveloperSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { icon: <FaChartLine />, label: "Overview", path: "/dev-dash" },
    { icon: <FaMedal />, label: "My Claims", path: "/claim" },
    { icon: <FaSearch />, label: "Explore Bounties", path: "/explore" },
  ];

  return (
    <aside
      className="w-72 h-screen bg-[#0d0d0d]/80 backdrop-blur-lg
                 border-r border-[#f50090]/25
                 shadow-[6px_0_35px_rgba(245,0,144,0.35)]
                 p-6 flex flex-col fixed left-0 top-0 z-50"
    >
      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10">
        <img
          src="/images/logo.png"
          alt="logo"
          className="h-14"
        />
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-4 font-medium text-base">
        {menuItems.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-3
                       text-gray-300 hover:text-[#f50090]
                       transition cursor-pointer"
          >
            <span className="text-[#f50090] text-sm">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto">
        <button
          onClick={() => navigate("/logout")}
          className="w-full flex items-center justify-center gap-2 py-2
                     text-base font-bold rounded-full
                     bg-gradient-to-r from-[#f50090] via-[#9b23ea] to-indigo-600
                     hover:opacity-90 transition-all
                     shadow-[0_0_20px_rgba(245,0,144,0.55)]"
        >
          <FaSignOutAlt className="text-sm" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default DeveloperSidebar;
