import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaExternalLinkAlt, FaUser, FaCode, FaClock, FaBullseye } from "react-icons/fa";
import CreatorLayout from "../Layout/CreatorLayout";

const ViewClaims = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const bounty = {
    projectName: "Uniswap Bug Fix",
    reward: "0.001 ETH",
    difficulty: "Beginner",
    language: "JavaScript",
    deadline: "7 Days",
    status: "OPEN",
    tags: ["bug", "frontend", "javascript"],
    description:
      "Fix the critical Uniswap bug related to slippage calculation. Ensure proper test coverage and submit PRs with detailed notes."
  };

  const claims = [
    {
      dev: "0xABC...123",
      link: "https://github.com/proof/21",
      note: "Fixed edge case + tested",
      time: "2 hours ago"
    },
    {
      dev: "0xFFF...999",
      link: "https://github.com/proof/22",
      note: "Resolved bug & optimized",
      time: "1 day ago"
    }
  ];

  return (
    <div className="flex bg-[#090909] text-white min-h-screen">

      {/* Sidebar */}
      <CreatorLayout />

      {/* Main Content */}
      <div className="ml-[-40px] w-full p-10">
      
      {/* banner */}
      <div className="w-full bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20 rounded-2xl p-6 mb-6 border border-[#f50090]/30 shadow-[0_0_40px_rgba(245,0,144,0.3)] hover:shadow-[0_0_55px_rgba(202,143,241,0.5)] transition-all">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">
            🔥 Developers Are Claiming Your Bounty!
          </h2>
          <p className="text-lg text-gray-300 mt-2 font-medium">
          Check their submissions, verify correctness, and reward the right developer.          </p>
        </div>

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold mb-8 tracking-wide">
          <span className="bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">
            Bounty #{id}
          </span>{" "}
          – Developer Submissions
        </h1>

        {/* Bounty Summary Card */}
        <div className="bg-[#111]/60 backdrop-blur-xl p-7 rounded-3xl 
                        border border-[#f50090]/30 
                        shadow-[0_0_40px_rgba(245,0,144,0.28)]
                        hover:shadow-[0_0_55px_rgba(245,0,144,0.4)]
                        transition-all mb-10">

          <h2 className="text-3xl font-bold mb-2">{bounty.projectName}</h2>
          <p className="text-gray-300 text-base mb-4">{bounty.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-300 text-[15px]">
            <p><FaCode className="inline text-pink-400 mr-1" /> Language: {bounty.language}</p>
            <p><FaClock className="inline text-pink-400 mr-1" /> Deadline: {bounty.deadline}</p>
            <p>Reward: {bounty.reward}</p>
            <p>Difficulty: {bounty.difficulty}</p>
            <p>Status: {bounty.status}</p>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-3">
            {bounty.tags.map((tag, i) => (
              <span key={i}
                className="px-4 py-1 bg-[#f50090]/20 text-[#f50090] 
                           border border-[#f50090]/40 
                           rounded-full text-sm font-medium shadow-[0_0_12px_rgba(245,0,144,0.3)]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CLAIM LIST */}
        <h2 className="text-2xl font-bold text-[#f50090] mb-6">Submitted Work</h2>

        <div className="space-y-6">
          {claims.map((c, i) => (
            <div key={i}
              className="bg-[#0f0f0f]/60 p-6 rounded-2xl backdrop-blur-xl 
                         border border-[#ca8ff1]/30
                         shadow-[0_0_25px_rgba(202,143,241,0.25)]
                         hover:shadow-[0_0_40px_rgba(245,0,144,0.5)]
                         transition-all">

              {/* Header Row */}
              <div className="flex justify-between items-center mb-3">
                <p className="text-lg font-semibold">
                  <FaUser className="inline text-pink-400 mr-2" /> {c.dev}
                </p>
                <span className="text-sm text-gray-400">{c.time}</span>
              </div>

              {/* GitHub Link */}
              <p className="text-pink-400 truncate flex items-center gap-2 text-[15px]">
                <FaExternalLinkAlt />
                <a href={c.link} target="_blank" className="hover:underline">
                  {c.link}
                </a>
              </p>

              {/* Notes */}
              <p className="text-gray-300 mt-3">{c.note}</p>

              {/* Buttons */}
              <div className="mt-4 flex gap-4">
                <button
            onClick={() => navigate(`/handle-claim/${id}/${c.dev}`)}     
             className="px-5 py-2 bg-[#f50090]/20 text-[#f50090] 
                             border border-[#f50090]/40 rounded-full 
                             text-sm hover:opacity-85 transition-all">
                  handle Submission
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-2 bg-[#ca8ff1]/20 text-[#ca8ff1]
                             border border-[#ca8ff1]/40 rounded-full 
                             text-sm hover:opacity-85 transition-all">
                  Go Back
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ViewClaims;
