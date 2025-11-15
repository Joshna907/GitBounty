import React, { useState } from "react";

const CreateBounty = () => {
  const [issueUrl, setIssueUrl] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [isToken, setIsToken] = useState(false);
  const [badgeURI, setBadgeURI] = useState("");
  const [issueTitle, setIssueTitle] = useState("Issue Title (Fetched from GitHub)");
  const [issueDescription, setIssueDescription] = useState(
    "Here will appear the issue description fetched from GitHub once you import the issue."
  );

  return (
    <div className="bg-black text-white min-h-screen py-20 px-6 relative overflow-hidden ">
      <div className="max-w-7xl mx-auto text-center mt-12 ">
        {/* Heading */}
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#f50090] to-[#9b23ea] bg-clip-text text-transparent">
          Create a New Bounty
        </h1>
        <p className="text-gray-400 text-lg mb-16 max-w-7xl mx-auto mt-3">
          Turn your GitHub issue into a blockchain bounty in seconds.<br />
          Paste your GitHub issue URL below and see issue details before creating the bounty.
        </p>

        {/* GitHub Issue URL + Import Button */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
          <input
            type="text"
            value={issueUrl}
            onChange={(e) => setIssueUrl(e.target.value)}
            placeholder="Enter GitHub Issue URL"
            className="w-full md:w-2/3 px-5 py-4 rounded-xl bg-[#111]/60 backdrop-blur-xl border border-[#f50090]/30 focus:border-[#f50090] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300"
          />
          <button className="text-xl bg-gradient-to-r from-[#f50090] to-[#9b23ea] px-6 py-4 rounded-xl font-semibold shadow-[0_0_20px_rgba(245,0,144,0.4)] hover:opacity-90 transition-all">
            Import Issue
          </button>
        </div>

        {/* Issue Info Section */}
        <div className="max-w-7xl mx-auto bg-[#111]/60 backdrop-blur-xl rounded-2xl p-8 text-left mb-16 shadow-[0_0_30px_rgba(245,0,144,0.25)] border border-[#f50090]/30 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-3 text-[#f50090]">
            {issueTitle}
          </h2>
          <p className="text-gray-400">{issueDescription}</p>
        </div>

        {/* Bounty Details Section */}
        <div className="bg-[#111]/60 backdrop-blur-xl rounded-2xl p-8 text-left max-w-4xl mx-auto shadow-[0_0_30px_rgba(245,0,144,0.25)] border border-[#f50090]/30">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#f50090] to-[#9b23ea] bg-clip-text text-transparent">
            Bounty Details
          </h2>

          {/* Badge URI */}
          <input
            type="text"
            value={badgeURI}
            onChange={(e) => setBadgeURI(e.target.value)}
            placeholder="Enter Badge URI (e.g., IPFS URL or Image Link)"
            className="w-full mb-6 px-5 py-4 rounded-xl bg-[#111]/60 border border-[#f50090]/30 focus:border-[#f50090] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300"
          />

          {/* Reward Type Toggle */}
          <div className="flex items-center justify-between text-gray-400 text-xl mb-6">
            <span>Reward Type:</span>
            <div className="flex gap-3">
              <button
                onClick={() => setIsToken(false)}
                className={`px-6 py-3 rounded-lg border ${
                  !isToken
                    ? "bg-[#f50090]/40 border-[#f50090]"
                    : "border-[#f50090]/30 hover:bg-[#f50090]/20"
                } transition-all`}
              >
                ETH
              </button>
              <button
                onClick={() => setIsToken(true)}
                className={`px-6 py-3 rounded-lg border ${
                  isToken
                    ? "bg-[#9b23ea]/40 border-[#9b23ea]"
                    : "border-[#9b23ea]/30 hover:bg-[#9b23ea]/20"
                } transition-all`}
              >
                Token
              </button>
            </div>
          </div>

          {/* Reward Amount */}
          <input
            type="number"
            value={rewardAmount}
            onChange={(e) => setRewardAmount(e.target.value)}
            placeholder="Enter Reward Amount"
            className="w-full px-6 py-4 rounded-xl bg-[#111]/60 border border-[#f50090]/30 focus:border-[#f50090] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300 mb-6"
          />

          {/* Create Bounty Button */}
          <button className="bg-gradient-to-r from-[#f50090] to-[#9b23ea] px-9 py-4 rounded-xl font-semibold shadow-[0_0_20px_rgba(245,0,144,0.4)] hover:opacity-90 transition-all text-2xl w-full">
            Create Bounty
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBounty;
