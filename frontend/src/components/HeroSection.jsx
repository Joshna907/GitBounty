import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom"; 
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min.js";
import Navbar from "./Navbar";

const HeroSection = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    const vantaEffect = GLOBE({
      el: vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xf50090,
      size: 1.3,
      backgroundColor: 0x000000,
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative" ref={vantaRef}>
    
    {/* Navbar */}
    <Navbar/>

      {/* Hero Content */}
      <section className="relative flex flex-col justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="z-10 text-center space-y-8 max-w-7xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            <div>ONE PLATFORM.</div>
            <div>UNIFIED SECURITY OPERATIONS.</div>
            <div>COMPLETE ONCHAIN PROTECTION.</div>
          </h1>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-12">
            <Link
              to="/create-bounty"
              className="px-8 py-4 bg-white text-black rounded hover:bg-gray-200 transition-colors text-lg font-semibold"
            >
             Create Bounty
            </Link>
            <Link
              to="/browse-bounty"
              className="px-8 py-4 border-2 border-white text-white rounded hover:bg-white/10 transition-colors text-lg font-semibold"
            >
              Browse Bounty
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
