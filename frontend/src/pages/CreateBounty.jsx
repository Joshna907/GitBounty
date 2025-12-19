import React, { useState } from "react";
import axios from "axios";
import badges from "../badges/badges";
import { ethers } from "ethers";
import { FaWallet, FaGithub, FaCoins, FaMedal, FaCrown, FaTags, FaCalendarAlt, FaCode, FaChartLine } from "react-icons/fa";

const CONTRACT_ADDRESS = "0xd1EF81d6e2fC6f9958E03948688784cB2f14DaF9";

export default function CreateBounty() {
  const token = localStorage.getItem("gitbounty_token");

  const [issueUrl, setIssueUrl] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [badgeURI, setBadgeURI] = useState("");
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [creatorAddress, setCreatorAddress] = useState("");

  // ✅ NEW FIELDS ADDED
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("Solidity");
  const [difficultyLevel, setDifficultyLevel] = useState("Beginner");
  const [deadline, setDeadline] = useState("");
  const [rewardRange, setRewardRange] = useState("0 - 0.01 ETH");
  const [tags, setTags] = useState("");

  const fetchIssueDetails = async () => {
    if (!issueUrl.trim()) return;
    try {
      const match = issueUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
      if (!match) return alert("❌ Invalid GitHub issue URL");

      const [, owner, repo, issueNum] = match;
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNum}`);

      setIssueTitle(res.data.title || "No title");
      setIssueDescription(res.data.body || "No description");
    } catch (err) {
      console.error("GitHub API Error:", err);
      alert("GitHub request failed");
    }
  };

  const handleCreateBounty = async () => {
    if (!issueUrl.trim()) return alert("Enter GitHub Issue URL");
    if (!rewardAmount || Number(rewardAmount) <= 0) return alert("Enter ETH amount");
    if (!badgeURI) return alert("Select badge");

    setLoading(true);
    try {
      if (!window.ethereum) return alert("Install MetaMask");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const sender = await signer.getAddress();
      setCreatorAddress(sender);

      const bountyInterface = new ethers.Interface([
  "function createBounty(string issueUrl, string badgeURI) payable",
  "event BountyCreated(uint256 indexed bountyId, address indexed creator, uint256 reward)"
]);

const contract = new ethers.Contract(CONTRACT_ADDRESS, bountyInterface, signer);

const rewardWei = ethers.parseEther(String(rewardAmount));

// 1️⃣ Send transaction
const tx = await contract.createBounty(
  issueUrl.trim(),
  badgeURI,
  { value: rewardWei }
);

// 2️⃣ Wait for confirmation
const receipt = await tx.wait();

// 3️⃣ Extract REAL bountyId from event
const event = receipt.logs
  .map(log => {
    try {
      return contract.interface.parseLog(log);
    } catch {
      return null;
    }
  })
  .find(e => e?.name === "BountyCreated");

if (!event) {
  throw new Error("BountyCreated event not found");
}

const realBountyId = Number(event.args.bountyId);

      
// 5️⃣ Convert tags input into array
const tagsArray = tags
  .split(",")
  .map(t => t.trim())
  .filter(Boolean);

// 6️⃣ Save EXACT blockchain ID to backend
 const res = await axios.post("http://localhost:2025/api/bounties/create-bounty", {
  bountyId: realBountyId,
  githubIssueUrl: issueUrl.trim(),
  issueTitle: issueTitle.trim(),
  rewardAmount: rewardAmount.toString(),
  badgeURI,
  creatorAddress: sender,
  txHash: receipt.hash,
  timestamp: Math.floor(Date.now() / 1000),
  winnerAddress: null,
  winnerUsername: null,
  submissions: [],

  projectName: projectName || null,
  language: language || "Solidity",
  difficultyLevel: difficultyLevel || "Beginner",
  deadline: deadline ? new Date(deadline) : null, // 🔥 FIX
  rewardRange: rewardRange || "0 - 0.01 ETH",
  tags: tagsArray
},{
  headers: {
      Authorization: `Bearer ${token}`
    }
}
);
if (res.data.token) {
  localStorage.setItem("gitbounty_token", res.data.token);

  // 🔥 notify Navbar immediately
  window.dispatchEvent(new Event("tokenUpdated"));
}
alert("🎉 Bounty created successfully!");

      // reset all fields
      setIssueUrl("");
      setIssueTitle("");
      setIssueDescription("");
      setRewardAmount("");
      setBadgeURI("");
      setCreatorAddress("");
      setProjectName("");
      setLanguage("Solidity");
      setDifficultyLevel("Beginner");
      setDeadline("");
      setRewardRange("0 - 0.01 ETH");
      setTags("");

    } catch (err) {
      console.error("❌ Bounty Error:", err);
      alert(err?.data?.message || err?.message || "Failed to create bounty");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="min-h-screen bg-[#090909] text-white font-poppins flex justify-center items-start py-33 px-9">
    <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-8">

      {/* LEFT FORM PANEL */}
      <div className="w-full lg:w-[52%] bg-[#0d0d0d] rounded-2xl p-8 shadow-[0_0_35px_rgba(245,0,144,0.35)] border border-[#f50090]/20">

        <div className="flex items-center gap-3 mb-6">
          <FaCrown className="text-[#f50090] text-3xl"/>
          <h2 className="text-4xl font-extrabold tracking-wide">Create Git Bounty</h2>
        </div>

        {/* GITHUB IMPORT */}
        <div className="flex gap-3 mb-5">
          <input
            value={issueUrl}
            onChange={(e) => setIssueUrl(e.target.value)}
            placeholder="Paste GitHub issue link..."
            className="flex-1 bg-[#111] border border-[#f50090]/40 rounded-lg px-4 py-3 text-xl outline-none focus:ring-2 focus:ring-[#f50090]"
          />
          <button
            onClick={fetchIssueDetails}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#f50090] to-purple-600 text-xl font-bold hover:opacity-90 transition shadow-[0_0_18px_rgba(245,0,144,0.5)]"
          >
            Import
          </button>
        </div>

        {/* Project Name */}
        <div className="flex items-center gap-3 bg-[#111] px-4 py-3 rounded-lg border border-gray-800 mb-4">
          <FaCode className="text-[#f50090] text-2xl"/>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name (optional)"
            className="flex-1 bg-transparent outline-none text-lg text-gray-300"
          />
        </div>

        {/* Language */}
        <div className="mb-4">
          <label className="text-lg text-gray-400 font-semibold mb-2 block">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#111] border border-[#f50090]/40 text-lg px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(245,0,144,0.3)] outline-none cursor-pointer transition-all focus:ring-2 focus:ring-[#f50090]"
            >
            <option>Solidity</option>
            <option>JavaScript</option>
            <option>Rust</option>
            <option>Python</option>
            <option>Php</option>
            <option>Java</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <label className="text-lg text-gray-400 font-semibold mb-2 block">Difficulty Level</label>
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            className="w-full bg-[#111] border border-[#f50090]/40 text-lg px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(245,0,144,0.3)] outline-none cursor-pointer transition-all focus:ring-2 focus:ring-[#f50090]"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Deadline */}
        <div className="mb-4">
          <label className="text-lg text-gray-400 font-semibold mb-2 block">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-[#111] rounded-xl px-5 py-4 text-lg border border-[#f50090]/30 outline-none cursor-pointer transition-all
            hover:bg-[#181818] hover:shadow-[0_0_14px_rgba(245,0,144,0.2)] focus:ring-4 focus:ring-pink-600/10"
          />
        </div>

        {/* Reward Range Bucket */}
        <div className="mb-4">
          <label className="text-lg text-gray-400 font-semibold mb-2 block">Reward Range</label>
          <select
            value={rewardRange}
            onChange={(e) => setRewardRange(e.target.value)}
              className="w-full bg-[#111] border border-[#f50090]/40 text-lg px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(245,0,144,0.3)] outline-none cursor-pointer transition-all focus:ring-2 focus:ring-[#f50090]"

          >
            <option>0 - 0.01 ETH</option>
            <option>0.01 - 0.05 ETH</option>
            <option>0.05 - 0.1 ETH</option>
            <option>0.1 - 1 ETH</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="text-lg text-gray-400 font-semibold mb-2 block">Tags</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ui, smart-contract, hackathon..."
            className="w-full bg-[#111] rounded-xl px-5 py-4 text-lg border border-gray-800/60 outline-none transition-all
            focus:ring-4 focus:ring-[#f50090]/20 hover:shadow-[0_0_18px_rgba(255,0,140,0.2)]"
          />
        </div>

        {/* BADGE SELECTOR */}
        <h3 className="text-2xl font-bold mb-4 text-gray-300">Select Badge</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {badges.map((b, i) => (
            <div
              key={i}
              onClick={() => setBadgeURI(b.url)}
              className={`p-3 rounded-xl cursor-pointer border transition flex flex-col items-center ${
                badgeURI === b.url
                  ? "border-[#f50090] bg-[#f50090]/10 shadow-[0_0_18px_rgba(245,0,144,0.5)]"
                  : "border-gray-700 hover:border-[#f50090]/40 hover:bg-[#1a1a1a]"
              }`}
            >
              <FaMedal className="text-[#f50090] text-2xl"/>
              <img src={b.url} className="w-14 h-14 rounded-full mt-2"/>
              <p className="text-gray-400 mt-2 text-center text-sm">{b.name}</p>
            </div>
          ))}
        </div>

        {/* Reward Amount */}
        <div className="mb-6">
          <label className="text-lg text-gray-400 font-semibold mb-2 block">Reward Amount (ETH)</label>
          <div className="flex items-center gap-3 bg-[#111] px-5 py-4 rounded-lg border border-[#f50090]/30 shadow-[0_0_15px_rgba(245,0,144,0.2)]">
            <FaCoins className="text-[#f50090] text-2xl"/>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              placeholder="Enter ETH reward..."
              className="flex-1 bg-transparent outline-none text-lg text-gray-200 placeholder-gray-500"
            />
            <span className="text-[#00ff6e] text-lg font-bold">ETH</span>
          </div>
        </div>


        {/* DEPLOY BUTTON */}
        <button
          onClick={handleCreateBounty}
          disabled={loading}
          className="w-full py-4 text-2xl font-bold rounded-full bg-gradient-to-r from-[#f50090] via-purple-600 to-indigo-600 hover:opacity-90 transition-all shadow-[0_0_22px_rgba(245,0,144,0.6)] disabled:opacity-50"
        >
          🚀 Deploy Bounty
        </button>
      </div>

      {/* RIGHT INFO PANEL */}
      <div className="w-full lg:w-[48%] bg-[#0b0b0b] rounded-2xl p-7 border border-[#f50090]/20 shadow-[0_0_25px_rgba(245,0,144,0.25)] backdrop-blur-md">

        <div className="flex items-center gap-2 text-3xl font-extrabold text-[#f50090] mb-5">
          <FaCrown className="drop-shadow-[0_0_10px_rgba(245,0,144,0.8)]"/> Bounty Preview
        </div>

        {/* Creator */}
        <div className="flex items-center gap-3 bg-[#111] px-5 py-4 rounded-lg mb-4 border border-[#f50090]/30">
          <FaWallet className="text-[#f50090] text-2xl"/>
          <span className="text-gray-400 text-xl">Creator:</span>
          <span className="font-mono text-white text-lg truncate">
            {creatorAddress || "Not connected…"}
          </span>
        </div>

        {/* Reward */}
        <div className="flex items-center gap-3 bg-[#111] px-5 py-4 rounded-lg mb-4 border border-[#f50090]/30">
          <FaCoins className="text-[#f50090] text-xl"/>
          <span className="text-gray-400 text-xl">Reward:</span>
          <span className="font-semibold text-[#00ff6e] text-lg">
            {rewardAmount && Number(rewardAmount) > 0 ? `${rewardAmount} ETH` : "Not set…"}
          </span>
        </div>

        {/* Badge */}
        <div className="bg-[#111] p-5 rounded-xl text-center border border-[#f50090]/30 mb-5">
          <h3 className="text-2xl font-bold text-[#f50090] mb-2">Selected Badge</h3>
          {badgeURI ? (
            <>
              <img src={badgeURI} className="w-32 h-32 mx-auto rounded-full shadow-lg mb-1"/>
              <p className="text-gray-400 text-sm">Badge ready to mint ✨</p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">No badge selected yet…</p>
          )}
        </div>

        {/* Issue Title */}
        <div className="bg-[#111] p-6 rounded-xl border border-gray-800/50 mb-6">
          <h3 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
            <FaGithub className="text-[#f50090]"/> Issue Title
          </h3>
          <p className="text-gray-400 text-lg">{issueTitle || "Not imported…"}</p>
        </div>

        {/* Issue Description */}
        <div className="bg-[#111] p-6 rounded-xl border border-gray-800/50">
          <h3 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
            <FaCoins className="text-[#f50090]"/> Bounty Description
          </h3>
          <p className="text-gray-400 text-lg whitespace-pre-line">
            {issueDescription || "Not imported…"}
          </p>
        </div>

      </div>
    </div>
  </div>
);

}
