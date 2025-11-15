import React from "react";
import { FaCrown } from "react-icons/fa";

const ClaimBountyByWinner = () => {
  return (
    <div className="min-h-screen bg-[#090909] text-white font-poppins">
      {/* ---- Hero Section ---- */}
      <div className="text-left py-32 px-10 bg-[#090909]">
        <h1 className="text-6xl font-bold mt-4">
          Claim: <span className="text-[#f50090]">Your Bounty Reward</span>
        </h1>
        <p className="text-gray-400 text-[20px] max-w-3xl mt-6 leading-relaxed">
          Winners can securely claim their bounty rewards and exclusive NFT badges.  
          Gasless GitBounty ensures your reward is delivered instantly and transparently.
        </p>
      </div>

      {/* ---- Claim Section ---- */}
      <div className="bg-[#0d0d0d] mx-10 px-8 py-10 rounded-lg flex flex-col items-center shadow-[0_0_25px_rgba(245,0,144,0.3)] border border-[#f50090]/20">
        {/* Icon and Title */}
        <div className="flex items-center gap-3 mb-6">
          <FaCrown className="text-[#f50090] text-3xl" />
          <h2 className="text-3xl font-bold text-white">Claim Bounty</h2>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-center text-lg max-w-2xl mb-10 leading-relaxed">
          Enter your verified bounty ID to claim your reward.  
          Once verified, your bounty amount and NFT badge will be automatically transferred.
        </p>

        {/* Input Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-[600px]">
          <input
            type="text"
            placeholder="Enter Bounty ID"
            className="bg-[#111] text-white border border-[#f50090]/40 rounded-md px-5 py-4 w-full text-lg placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#f50090] transition"
          />
          <button
  className="bg-gradient-to-r from-[#f50090] to-[#9b23ea] px-10 py-3 
             rounded-md text-lg font-semibold hover:opacity-90 
             transition shadow-[0_0_20px_rgba(245,0,144,0.4)] 
             whitespace-nowrap flex items-center justify-center gap-2">
  Claim&nbsp;Bounty
</button>

        </div>

        {/* Info / Notice Box */}
        <div className="mt-10 bg-[#111] border border-[#f50090]/30 rounded-md p-6 max-w-2xl text-center">
          <h3 className="text-xl font-semibold text-[#f50090] mb-2">
            Important Notice
          </h3>
          <p className="text-gray-400 text-md leading-relaxed">
            Ensure you’re the verified winner of the bounty before claiming.  
            Any unauthorized attempts will be rejected automatically by the contract.
          </p>
        </div>
      </div>

      {/* ---- Footer ---- */}
      <div className="text-center text-gray-500 text-sm py-8">
        Powered by <span className="text-[#f50090] font-semibold">Gasless GitBounty</span>
      </div>
    </div>
  );
};

export default ClaimBountyByWinner;
