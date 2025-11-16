import React from 'react'
import { Link } from "react-router-dom"; 
import { User } from 'lucide-react';

const Navbar = () => {
  return (
    <>
{/* Navbar */}
<nav className="absolute top-0 left-0 right-0 z-50 ">
    <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex justify-between items-center">
                    
        {/* Logo */}
        <div className="flex items-center space-x-3">
            <img src="/images/logo.png" alt="logo" className="h-16 font-extrabold text-9xl" />
        </div>
        
        {/* Right Side */}
        <div className="hidden md:flex items-center space-x-8 uppercase">
          <Link
            to="/"
            className="relative text-gray-300 hover:text-[#f50090] transition-colors duration-300 text-lg font-semibold tracking-wide"
          >
            Home
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#f50090] transition-all duration-300 hover:w-full"></span>
          </Link>
        
          <Link
            to="/explore-bounty"
            className="relative text-gray-300 hover:text-[#f50090] transition-colors duration-300 text-lg font-semibold tracking-wide"
          >
            Explore Bounty
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#f50090] transition-all duration-300 hover:w-full"></span>
          </Link>

          <Link
            to="/dashboard"
            className="relative text-gray-300 hover:text-[#f50090] transition-colors duration-300 text-lg font-semibold tracking-wide"
          >
            Dashboard
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#f50090] transition-all duration-300 hover:w-full"></span>
          </Link>
        
          <Link
            to="/sign-in"
            className="relative text-gray-300 hover:text-[#f50090] transition-colors duration-300 text-lg font-semibold tracking-wide"
          >
            Sign in
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#f50090] transition-all duration-300 hover:w-full"></span>
          </Link>

          {/* Profile Icon */}
          <Link
            to="/dashboard"
            className="relative group"
            aria-label="Profile"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f50090] to-[#9b23ea] flex items-center justify-center hover:shadow-[0_0_15px_rgba(245,0,144,0.5)] transition-all duration-300">
              <User size={20} className="text-white" />
            </div>
          </Link>
        </div> 
        </div>
    </div>
    </nav>
    </>
  )
}

export default Navbar