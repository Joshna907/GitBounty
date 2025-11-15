import React from "react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const SignIn = () => {
  return (
    <>
    <div className="min-h-screen flex flex-col bg-[#050505] text-white relative overflow-hidden">
      {/* Gradient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-black" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#f50090]/20 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#9b23ea]/20 rounded-full blur-[160px]" />

      

      {/* Split Layout */}
      <div className="flex flex-1 flex-col md:flex-row relative z-10">
        

        {/* Right: Full Page Sign-In Side (No Box) */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-20 bg-gradient-to-br from-[#111] via-[#0a0a0a] to-black"
        >
          <div className="max-w-md w-full center">
            <h2 className="text-5xl font-bold mb-4">Welcome Back 👋</h2>
            <p className="text-gray-500 mb-10">
              Sign in with your GitHub account to start earning from verified open-source bounties.
            </p>

            <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#f50090] to-[#9b23ea] text-white font-semibold py-3 rounded-full hover:opacity-90 transition-all duration-300">
              <FaGithub className="text-3xl" />
              Sign in with GitHub
            </button>

            <p className="text-gray-500 text-x mt-8">
              By continuing, you agree to our{" "}
              <a href="#" className="text-[#f50090] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#f50090] hover:underline">
                Privacy Policy
              </a>.
            </p>

            <p className="text-gray-600 text-x mt-10">
              © {new Date().getFullYear()} GitBounty Dispenser — Built for developers.
            </p>
          </div>
        </motion.div>

        {/* Left: Background Image + Overlay + Text */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 h-[60vh] md:h-auto relative flex items-center justify-center"
        >
          <img
            src="/images/sign-back.jpeg"
            alt="bounty background"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 px-10 md:px-16 text-left">
            <h1 className="text-6xl font-bold leading-tight mb-4">
              Build. Contribute. <br />
              <span className="bg-gradient-to-r from-[#f50090] to-[#9b23ea] text-transparent bg-clip-text">
                Earn Effortlessly.
              </span>
            </h1>
            <p className="text-gray-400 max-w-md text-[20px]">
              Join the future of open source rewards — powered by blockchain, driven by developers.
            </p>
          </div>
        </motion.div>

      </div>
    </div>

  </>
  );
};

export default SignIn;
