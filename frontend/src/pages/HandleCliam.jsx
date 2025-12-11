"use client";
import React from "react";
import {
  FaUser,
  FaExternalLinkAlt,
  FaClock,
  FaCodeBranch,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import CreatorLayout from "../Layout/CreatorLayout";




export default function HandleClaim() {
  return (
    <div className="flex bg-[#090909] text-white min-h-screen">

    <CreatorLayout>
    

      {/* PAGE WRAPPER */}
      <div className="p-4 pb-36">

        {/* HEADER */}
       <div className="w-full bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20 rounded-2xl p-6 mb-6  border border-[#f50090]/30 shadow-[0_0_40px_rgba(245,0,144,0.3)] hover:shadow-[0_0_55px_rgba(202,143,241,0.5)] transition-all">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">
          ⚡ Finalize This Claim
          </h2>
          <p className="text-lg text-gray-300 mt-2 font-medium">
            Verify the submission and reward the deserving developer.
          </p>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

          {/* LEFT SIDE */}
          <div className="space-y-10">

            {/* BOUNTY OVERVIEW */}
            <div className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-3xl
                            border border-[#f50090]/30
                            shadow-[0_0_35px_rgba(245,0,144,0.32)]">
              <h2 className="text-2xl font-bold text-[#f50090] mb-4">
                🧩 Bounty Overview
              </h2>

              <div className="text-gray-300 text-[17px] space-y-2">
                <p><span className="text-gray-500">Project:</span> Uniswap Bug Fix</p>
                <p><span className="text-gray-500">Issue:</span> Infinite Loop Crash</p>
                <p><span className="text-gray-500">Reward:</span> 0.25 ETH</p>
                <p><span className="text-gray-500">Category:</span> Smart Contract</p>
                <p><span className="text-gray-500">Deadline:</span> 30 Dec 2025</p>

                <span className="px-4 py-1.5 rounded-full bg-[#00ff8c]/20 text-[#00ff8c] text-sm">
                  Active Bounty
                </span>
              </div>
            </div>

            {/* CLAIM SUMMARY */}
            <div className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-3xl
                            border border-[#ca8ff1]/40
                            shadow-[0_0_35px_rgba(202,143,241,0.35)]">

              <h2 className="text-2xl font-bold text-[#ca8ff1] mb-5">📌 Claim Summary</h2>

              <div className="space-y-4 text-gray-300 text-[17px]">

                <div className="flex items-center gap-3">
                  <FaUser className="text-[#f50090] text-xl" />
                  0xAbC...8921 (Developer)
                </div>

                <div className="flex items-center gap-3">
                  <FiLink className="text-purple-300 text-xl" />
                  <a
                    href="#"
                    className="text-[#ca8ff1] underline flex items-center gap-2 hover:text-[#f50090]"
                  >
                    View Proof <FaExternalLinkAlt className="text-sm" />
                  </a>
                </div>

                <p className="flex items-center gap-2 text-gray-400">
                  <FaClock /> Submitted on: 06 Dec 2025
                </p>

                <span className="px-4 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
                  Pending Review
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="xl:col-span-2 space-y-10">

            {/* DEVELOPER NOTES */}
            <div className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-3xl
                            border border-[#f50090]/30
                            shadow-[0_0_40px_rgba(245,0,144,0.32)]">
              <h2 className="text-2xl font-bold text-[#f50090] mb-3">
                📝 Developer Notes
              </h2>

              <p className="text-gray-300 leading-relaxed text-[16px]">
                Fix included adding a termination condition to prevent infinite loop.
                All edge cases were tested on testnet environment.
              </p>
            </div>

            {/* CODE PREVIEW */}
            <div className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-3xl
                            border border-[#ca8ff1]/30
                            shadow-[0_0_40px_rgba(202,143,241,0.4)]">
              <h2 className="text-2xl font-bold text-[#ca8ff1] mb-4 flex items-center gap-2">
                <FaCodeBranch /> Code Preview
              </h2>

              <pre className="bg-black/50 border border-white/10 p-5 rounded-xl 
                              text-gray-200 text-sm overflow-x-auto whitespace-pre-wrap">
{`function safeProcess() public returns(bool) {
  require(msg.sender == owner, "Not authorized");

  for(uint256 i = 0; i < items.length; i++) {
    if(items[i].processed) continue;
    items[i].processed = true;
  }

  return true;
}`}
              </pre>
            </div>

            {/* REVIEW NOTES */}
            <div className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-3xl
                            border border-[#f50090]/25">
              <h2 className="text-xl font-semibold mb-4 text-[#f50090]">✍️ Review Notes</h2>

              <textarea
                className="w-full h-48 bg-[#0a0a0a]/80 border border-[#f50090]/30 rounded-xl 
                           p-4 text-white text-lg outline-none focus:ring-2 focus:ring-[#f50090]/40"
                placeholder="Add comments or feedback..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="fixed bottom-0 left-[288px] right-0 bg-[#0a0a0a]/90 
                      backdrop-blur-2xl border-t border-[#f50090]/40 py-3 px-10 
                      flex justify-between items-center
                      shadow-[0_0_45px_rgba(245,0,144,0.5)]">

        <p className="text-gray-300 text-lg">
          <span className="font-semibold text-white">Reward on Approval:</span> 0.25 ETH
        </p>

        <div className="flex gap-6">
          <button
           className="px-5 py-2 rounded-xl bg-[#f50090] hover:bg-[#c90074]
text-white font-semibold shadow-[0_0_20px_rgba(245,0,144,0.4)]
hover:shadow-[0_0_30px_rgba(245,0,144,0.6)] transition-all">

            <FaCheck /> Approve
          </button>

          <button
          className="px-5 py-2 rounded-xl bg-[#9b23ea] hover:bg-[#7b1cc0]
text-white font-semibold shadow-[0_0_20px_rgba(155,35,234,0.4)]
hover:shadow-[0_0_30px_rgba(155,35,234,0.6)] transition-all">

            <FaTimes /> Reject
          </button>
        </div>
      </div>
    </CreatorLayout>
    </div>
  );
}
