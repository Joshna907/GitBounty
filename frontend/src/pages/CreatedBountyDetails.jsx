import React from "react";
import { FaWallet, FaCrown, FaExternalLinkAlt, FaMedal, FaCode, FaClock, FaSignOutAlt, FaGithub, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CreatorLayout from "../Layout/CreatorLayout";



const StatBox = ({ icon, label, value }) => (
  <div className="flex flex-col items-center bg-[#111]/60 p-5 rounded-xl border border-[#f50090]/25 shadow-[0_0_16px_rgba(245,0,144,0.15)] hover:shadow-[0_0_30px_rgba(245,0,144,0.4)] transition-all">
    <div className="text-[#f50090] text-3xl">{icon}</div>
    <h3 className="mt-2 text-gray-400 text-lg font-medium">{label}</h3>
    <p className="text-2xl font-extrabold mt-1">{value}</p>
  </div>
);

const CreatedBountyDetails = () => {
  const navigate = useNavigate();
  const wallet = "0xf0703a90c9ad42c5ad5f59162b8563c8d98e097c"; // demo wallet

  // Dummy Data
  const bounties = [
    { projectName: "Uniswap Bug Fix", reward: "0.001 ETH", rewardRange: "0 – 0.01 ETH", difficulty: "Beginner", language: "JavaScript", deadline: "7 Days", status: "OPEN" },
    { projectName: "Smart Contract Optimization", reward: "0.005 ETH", rewardRange: "0.01 – 0.1 ETH", difficulty: "Intermediate", language: "Solidity", deadline: "10 Days", status: "IN_REVIEW" },
    { projectName: "Rust Wallet Issue", reward: "0.05 ETH", rewardRange: "0.01 – 1 ETH", difficulty: "Advanced", language: "Rust", deadline: "14 Days", status: "CLOSED" }
  ];

  const recentSubs = [
    { project: "Smart Contract Optimization", dev: "0xabc..123", link: "github.com/proof/21", note: "Gas fix done" },
    { project: "Uniswap Bug Fix", dev: "0xdef..456", link: "github.com/proof/22", note: "Edge case handled" },
    { project: "Rust Wallet Issue", dev: "0x999..888", link: "github.com/proof/23", note: "Memory leak fixed" }
  ];

  const mintedBadges = ["Badge #1", "Badge #2", "Badge #3", "Badge #4"];

  return (
    <div className="flex bg-[#090909] text-white min-h-screen">
      <CreatorLayout />

      <div className="ml-[-40px] w-full p-10">
        {/* Banner */}
        <div className="w-full bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20 rounded-2xl p-6 mb-6 border border-[#f50090]/30 shadow-[0_0_40px_rgba(245,0,144,0.3)] hover:shadow-[0_0_55px_rgba(202,143,241,0.5)] transition-all">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">
            🚀 Welcome Back Creator!
          </h2>
          <p className="text-lg text-gray-300 mt-2 font-medium">
            Manage your bounties, verify developer submissions, mint badges & release rewards.
          </p>
        </div>

        {/* Header */}
        <header className="flex justify-between items-center pb-4 border-b border-[#f50090]/40">
          <h1 className="text-3xl font-bold tracking-wide">
            CREATOR <span className="bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">DASHBOARD</span>
          </h1>

          <div className="flex items-center gap-3 bg-[#111]/70 px-5 py-2.5 rounded-xl border border-[#f50090]/50 shadow-[0_0_20px_rgba(245,0,144,0.4)] max-w-[200px]">
            <FaWallet className="text-[#f50090] text-lg"/>
            <span className="font-mono text-base truncate">{wallet}</span>
          </div>
        </header>

        {/* Stats Row */}
        <section className="mt-8 grid grid-cols-3 md:grid-cols-3 gap-6">
          <StatBox icon={<FaCode />} label="Open Bounties" value={bounties.filter(b=>b.status==="OPEN").length} />
          <StatBox icon={<FaClock />} label="Waiting Claims" value="8" />
          <StatBox icon={<FaMedal />} label="NFT Minted" value={mintedBadges.length} />
        </section>

        {/* Created Bounties Table */}
       {/* Created Bounties Table */}
<section className="mt-8 bg-[#0d0d0d]/60 rounded-2xl p-6 border border-[#f50090]/25 shadow-[0_0_35px_rgba(245,0,144,0.25)]">
  <h2 className="text-xl font-bold mb-5 text-[#f50090]">Created Bounties</h2>

  <div className="overflow-x-auto rounded-xl">
    <table className="w-full border-separate border-spacing-y-2">

      {/* Table Head */}
      <thead>
        <tr className="bg-gradient-to-r from-[#f50090]/30 to-[#ca8ff1]/30 text-gray-200 rounded-xl">
          {["Project", "Reward", "Range", "Level", "Lang", "Deadline", "Status", "Actions"].map((h, i) => (
            <th key={i} className="px-4 py-3 text-sm font-semibold tracking-wide">
              {h}
            </th>
          ))}
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        {bounties.map((b, i) => (
          <tr
            key={i}
            className="bg-[#111]/60 hover:bg-[#1a1a1a]/70 transition-all duration-200
                       border border-[#ca8ff1]/20 rounded-xl shadow-[0_0_10px_rgba(202,143,241,0.15)]"
          >
            <td className="px-4 py-3 font-semibold text-gray-200">{b.projectName}</td>
            <td className="px-4 py-3 text-gray-300">{b.reward}</td>
            <td className="px-4 py-3 text-gray-300">{b.rewardRange}</td>
            <td className="px-4 py-3 text-gray-300">{b.difficulty}</td>
            <td className="px-4 py-3 text-gray-300">{b.language}</td>
            <td className="px-4 py-3 text-gray-300">{b.deadline}</td>

            <td className="px-4 py-3">
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold backdrop-blur-sm
                  ${
                    b.status === "OPEN"
                      ? "bg-green-500/20 text-green-400"
                      : b.status === "IN_REVIEW"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : b.status === "APPROVED"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-600/20 text-gray-400"
                  }
                `}
              >
                {b.status}
              </span>
            </td>

            {/* Neon Buttons Row */}
            <td className="px-4 py-3">
              <div className="flex gap-2">

                {/* View */}
                <button
                  onClick={() => navigate(`/view-claim/${i}`)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold
                             bg-[#f50090]/15 text-[#f50090]
                             border border-[#f50090]/30
                             hover:bg-[#f50090]/25 hover:shadow-[0_0_10px_rgba(245,0,144,0.4)]
                             transition-all"
                >
                  View
                </button>

                {/* Handle */}
                <button
                  onClick={() => navigate(`/handle-claim/${i}/${wallet}`)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold
                             bg-[#ca8ff1]/15 text-[#ca8ff1]
                             border border-[#ca8ff1]/30
                             hover:bg-[#ca8ff1]/25 hover:shadow-[0_0_10px_rgba(202,143,241,0.4)]
                             transition-all"
                >
                  Handle
                </button>

                {/* Close */}
                {b.status === "OPEN" && (
                  <button
                    onClick={() => navigate(`/close-bounty/${i}`)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold
                               bg-red-500/15 text-red-400
                               border border-red-500/30
                               hover:bg-red-500/25 hover:shadow-[0_0_10px_rgba(255,0,0,0.4)]
                               transition-all"
                  >
                    Close
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>

    </table>
  </div>
</section>


        {/* Recent Submissions */}
        <section className="mt-8 bg-[#0b0b0b]/40 rounded-2xl p-5 border border-[#ca8ff1]/20 shadow-[0_0_22px_rgba(202,143,241,0.15)]">
          <h2 className="text-lg font-bold mb-3 text-[#f50090]">Latest Claims</h2>
          <div className="space-y-3">
            {recentSubs.map((s,i)=>(
              <div key={i} className="bg-[#111]/60 rounded-xl p-4 border border-[#ca8ff1]/20 shadow-[0_0_12px_rgba(202,143,241,0.1)] text-sm">
                <p className="text-gray-300 text-base">Project: <span className="font-semibold">{s.project}</span></p>
                <p className="text-gray-500 text-base">Dev: {s.dev}</p>
                <p className="text-pink-400 truncate text-base">{s.link}</p>
                <p className="text-gray-500 text-base">Note: {s.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NFT Strip */}
        <section className="mt-8 bg-[#0d0d0d]/50 rounded-2xl p-6 border border-[#f50090]/35 shadow-[0_0_25px_rgba(245,0,144,0.2)]">
          <h2 className="text-2xl font-bold text-[#f50090] mb-4">🏆 Minted NFT Badges</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {mintedBadges.map((nft,i)=>(
              <div key={i} className="min-w-[110px] bg-[#111]/50 p-4 rounded-xl border border-[#ca8ff1]/30 text-center text-lg font-semibold hover:shadow-[0_0_20px_rgba(245,0,144,0.3)] transition-all cursor-pointer">
                <FaMedal className="text-pink-400 text-2xl mx-auto mb-1"/>
                {nft}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default CreatedBountyDetails;
