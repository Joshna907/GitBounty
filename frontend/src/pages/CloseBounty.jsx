import React from "react";
import { FaTimesCircle, FaWallet, FaExclamationTriangle, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import CreatorLayout from "../Layout/CreatorLayout";
import { useNavigate, useParams } from "react-router-dom";

export default function CloseBounty() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dummy data (replace with blockchain data later)
  const bounty = {
    projectName: "Uniswap Bug Fix",
    reward: "0.001 ETH",
    github: "https://github.com/uniswap/issue/24",
    deadline: "7 Days",
    creator: "0xf0703a90c9ad42c5ad5f59162b8563c8d98e097c",
    status: "OPEN"
  };

  const handleClose = () => {
    alert("Bounty Closed Successfully! (Blockchain Integration Pending)");
    navigate("/creator-dashboard");
  };

  return (
    <div className="flex bg-[#090909] text-white min-h-screen">
      <CreatorLayout />

      {/* MAIN PAGE */}
      <div className="ml-[-40px] w-full p-10">
        
        {/* Page Header */}
        <div className="w-full bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20 rounded-2xl p-6 mb-6 
        border border-[#f50090]/30 shadow-[0_0_40px_rgba(245,0,144,0.3)]">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#f50090] to-[#ca8ff1] 
          bg-clip-text text-transparent">
            ❌ Close Bounty
          </h2>
          <p className="text-lg text-gray-300 mt-2 font-medium">
            You are closing this bounty permanently. ETH will be refunded back to your wallet.
          </p>
        </div>

        {/* Bounty Info Card */}
        <div className="bg-[#0d0d0d]/50 rounded-2xl p-6 border border-[#f50090]/35 
        shadow-[0_0_35px_rgba(245,0,144,0.25)] mb-8">

          <h3 className="text-2xl font-bold mb-4 text-[#f50090]">Bounty Overview</h3>

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-[#111]/60 p-4 rounded-xl border border-[#f50090]/25
            shadow-[0_0_20px_rgba(245,0,144,0.15)]">
              <p className="text-gray-400 text-sm">Project Name</p>
              <p className="text-xl font-semibold">{bounty.projectName}</p>
            </div>

            <div className="bg-[#111]/60 p-4 rounded-xl border border-[#f50090]/25
            shadow-[0_0_20px_rgba(245,0,144,0.15)]">
              <p className="text-gray-400 text-sm">Reward Locked</p>
              <p className="text-xl font-semibold text-pink-400">{bounty.reward}</p>
            </div>

            <div className="bg-[#111]/60 p-4 rounded-xl border border-[#f50090]/25
            shadow-[0_0_20px_rgba(245,0,144,0.15)]">
              <p className="text-gray-400 text-sm">Deadline</p>
              <p className="text-xl font-semibold">{bounty.deadline}</p>
            </div>

            <div className="bg-[#111]/60 p-4 rounded-xl border border-[#f50090]/25
            shadow-[0_0_20px_rgba(245,0,144,0.15)]">
              <p className="text-gray-400 text-sm">GitHub Issue</p>
              <a
                href={bounty.github}
                target="_blank"
                className="flex items-center gap-2 text-pink-400 font-semibold hover:underline">
                View Issue <FaExternalLinkAlt size={14}/>
              </a>
            </div>

          </div>
        </div>

        {/* Warning Panel */}
        <div className="bg-[#150707]/70 p-6 rounded-2xl border border-red-500/30 
        shadow-[0_0_30px_rgba(255,20,20,0.25)] mb-8">

          <div className="flex gap-4 text-red-400 items-center">
            <FaExclamationTriangle className="text-3xl"/>
            <h3 className="text-2xl font-bold">Warning: Closing This Bounty is Permanent</h3>
          </div>

          <ul className="text-gray-300 mt-4 text-lg space-y-2 ml-2">
            <li>⚠ You cannot reopen this bounty again.</li>
            <li>⚠ Developers cannot submit new claims.</li>
            <li>⚠ All pending claims will be rejected.</li>
            <li>⚠ ETH reward will be refunded to your wallet.</li>
          </ul>

        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="w-full py-4 text-xl font-bold rounded-2xl mt-4
          bg-gradient-to-r from-[#f50090] to-[#9b23ea]
          hover:opacity-90 transition shadow-[0_0_25px_rgba(245,0,144,0.5)]">
          ❌ Close Bounty & Refund ETH
        </button>

      </div>
    </div>
  );
}
