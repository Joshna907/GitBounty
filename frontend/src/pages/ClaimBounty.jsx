import React from "react";
import { FaWallet, FaGithub, FaPaperPlane, FaMedal, FaShieldAlt, FaCoins, FaCrown } from "react-icons/fa";

const ClaimBounty = () => {
  return (
    <div className="min-h-screen bg-[#090909] text-white font-poppins flex justify-center items-start py-33 px-9">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-10">

        {/* LEFT BOX: CLAIM FORM */}
        <div className="w-full lg:w-[58%] bg-[#0d0d0d]/60 backdrop-blur-xl rounded-2xl p-10 
                        border border-[#f50090]/25 shadow-[0_0_40px_rgba(202,143,241,0.25)]">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <FaShieldAlt className="text-[#ca8ff1] text-3xl" />
            <h1 className="text-3xl font-extrabold tracking-wide">
              Claim <span className="bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">Bounty</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg mb-8">
            Submit your proof link securely and get verified for your on-chain reward.
          </p>

          {/* Bounty ID Input */}
          <div className="flex items-center gap-3 bg-[#111]/50 px-5 py-4 rounded-xl mb-5 
                          border border-[#ca8ff1]/30 shadow-[0_0_12px_rgba(202,143,241,0.12)]">
            <FaCoins className="text-[#f50090] text-xl"/>
            <input
              type="text"
              placeholder="Enter Bounty ID..."
              className="flex-1 bg-transparent text-lg outline-none placeholder-gray-600"
            />
          </div>

          {/* Proof Link Input */}
          <div className="flex items-center gap-3 bg-[#111]/50 px-5 py-4 rounded-xl mb-6 
                          border border-[#ca8ff1]/30 shadow-[0_0_12px_rgba(202,143,241,0.12)]">
            <FaPaperPlane className="text-[#f50090] text-xl"/>
            <input
              type="text"
              placeholder="Paste Proof Link..."
              className="flex-1 bg-transparent text-lg outline-none placeholder-gray-600"
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full flex items-center justify-center gap-3 py-3 text-xl font-bold rounded-full
                       bg-gradient-to-r from-[#f50090] via-[#9b23ea] to-indigo-600 hover:opacity-90 transition-all shadow-[0_0_25px_rgba(245,0,144,0.5)]"
          >
            <FaCrown className="text-white"/> Submit Proof
          </button>

          {/* Bottom Note */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Reward will unlock after creator approval & NFT badge mint.
          </p>
        </div>

        {/* RIGHT BOX: INFO PANEL */}
        <div className="w-full lg:w-[38%] bg-[#0b0b0b]/50 backdrop-blur-xl rounded-2xl p-8 
                        border border-[#ca8ff1]/20 shadow-[0_0_30px_rgba(202,143,241,0.18)]">

          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent flex items-center gap-2 mb-6">
            <FaShieldAlt className="text-[#f50090]"/> Submission Info
          </h2>

          {/* Wallet Box */}
          <div className="flex items-center gap-3 bg-[#111]/60 px-5 py-4 rounded-xl mb-6 
                          border border-[#ca8ff1]/30 shadow-[0_0_15px_rgba(202,143,241,0.1)]">
            <FaWallet className="text-[#f50090] text-xl"/>
            <div className="flex flex-col w-full">
              <span className="text-gray-500 text-sm">Developer Wallet</span>
              <span className="font-mono text-sm truncate text-white">
                0xYourWalletAddress
              </span>
            </div>
          </div>

          {/* GitHub Issue Box */}
          <div className="bg-[#111]/60 p-6 rounded-xl border border-[#ca8ff1]/20 mb-6 
                          shadow-[0_0_18px_rgba(202,143,241,0.1)]">
            <h3 className="text-lg font-semibold text-[#f50090] mb-2 flex items-center gap-2">
              <FaGithub className="text-[#ca8ff1]"/> GitHub Issue
            </h3>
            <p className="font-mono text-sm text-gray-400 truncate">
              github.com/owner/repo/issues/123
            </p>
          </div>

          {/* Reward Box */}
          <div className="bg-[#111]/60 p-5 rounded-xl border border-[#ca8ff1]/30 mb-6 
                          shadow-[0_0_18px_rgba(202,143,241,0.08)] flex items-center justify-between">
            <span className="text-gray-400 text-md flex items-center gap-2">
              <FaCoins className="text-[#f50090]"/> Reward Locked:
            </span>
            <span className="bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent font-bold">
              0.5 ETH
            </span>
          </div>

          {/* Badge Preview */}
          <div className="bg-[#111]/60 p-6 rounded-xl border border-[#f50090]/30 text-center mb-6 
                          shadow-[0_0_30px_rgba(202,143,241,0.12)]">
            <div className="bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent text-2xl justify-center flex mb-2">
              <FaMedal/>
            </div>
            <p className="text-sm text-gray-400">NFT Badge will mint after approval</p>
          </div>

          {/* Notice */}
          <div className="mt-8 bg-[#111]/60 border border-[#ca8ff1]/20 rounded-xl p-5 text-center 
                          shadow-[0_0_16px_rgba(202,143,241,0.08)]">
            <h3 className="text-lg font-bold bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent mb-2 flex justify-center gap-2 items-center">
              <FaShieldAlt className="text-[#f50090]"/> Creator Approval Only
            </h3>
            <p className="text-gray-400 text-sm">
              Only the issue creator can approve and release the bounty reward.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClaimBounty;
