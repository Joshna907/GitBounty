// ClaimBounty.jsx
import React, { useEffect, useState } from "react";
import { FaWallet, FaGithub, FaPaperPlane, FaMedal, FaShieldAlt, FaCoins, FaCrown, FaStickyNote } from "react-icons/fa";
import axios from "axios";
import { ethers } from "ethers";
import { useLocation } from "react-router-dom";


const CONTRACT_ADDRESS = "0xd1EF81d6e2fC6f9958E03948688784cB2f14DaF9";
const BACKEND_BASE = "http://localhost:2025";

// Minimal ABI
const CONTRACT_ABI = [
  "function claimBounty(uint256 _id, string calldata _proof) external"
];

const ClaimBounty = () => {
  


  const [walletAddress, setWalletAddress] = useState("");
  const [bountyId, setBountyId] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [note, setNote] = useState(""); 
  const [githubUrl, setGithubUrl] = useState("");
  const [reward, setReward] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { bounty } = location.state || {};

useEffect(() => {
  if (bounty) {
    setBountyId(bounty.bountyId);                 
    setGithubUrl(bounty.githubIssueUrl);      
    setReward(bounty.rewardAmount);           
  }
}, [bounty]);


  
  
  
  // Auto detect wallet
  useEffect(() => {
    const detect = async () => {
      if (!window.ethereum) {
        setWalletAddress("MetaMask Not Installed");
        return;
      }
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        setWalletAddress(accounts.length ? accounts[0] : "Not Connected");

        window.ethereum.on("accountsChanged", (accs) => {
          setWalletAddress(accs.length ? accs[0] : "Not Connected");
        });
      } catch (e) {
        setWalletAddress("Not Connected");
      }
    };

    detect();
  }, []);

  // Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } catch {
      alert("Wallet connection failed.");
    }
  };

  // Submit proof
  const handleSubmit = async () => {
    if (!bountyId || !proofLink || !note) {
      return alert("⚠️ Please enter Bounty ID, Proof Link, and Developer Note.");
    }
    if (!window.ethereum) {
      return alert("MetaMask not found.");
    }

    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddr = await signer.getAddress();
      setWalletAddress(signerAddr);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Blockchain tx
      const tx = await contract.claimBounty(Number(bountyId), proofLink);
      alert("⏳ Waiting for blockchain confirmation...");
      await tx.wait();

      // Save to backend
      const backendUrl = `${BACKEND_BASE}/api/bounties/${bountyId}/claim`;

      const payload = {
        bountyId:bountyId,
        developerAddress: signerAddr,
        submissionLink: proofLink,
        notes: note, // ✅ send developer note
      };

      try {
        const res = await axios.post(backendUrl, payload);
        if (res.data?.success) {
          alert("✅ Claim submitted successfully to blockchain + backend.");
        } else {
          alert("⚠️ On-chain success, but backend returned unexpected response.");
        }
      } catch (backendErr) {
        alert("⚠️ On-chain success, but backend save failed. Check console.");
        console.error("Backend Error:", backendErr);
      }

      setBountyId("");
      setProofLink("");
      setNote("");

    } catch (err) {
      console.error("Submit error:", err);
      const msg = err?.reason || err?.data?.message || err?.message || "Transaction failed";
      alert("❌ " + msg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white font-poppins flex justify-center items-start py-33 px-9">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-10">

        {/* LEFT FORM BOX */}
        <div className="w-full lg:w-[58%] bg-[#0d0d0d]/60 backdrop-blur-xl rounded-2xl p-10 
                        border border-[#f50090]/25 shadow-[0_0_40px_rgba(202,143,241,0.25)]">

          <div className="flex items-center gap-3 mb-6">
            <FaShieldAlt className="text-[#ca8ff1] text-3xl" />
            <h1 className="text-3xl font-extrabold tracking-wide">
              Claim <span className="bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">Bounty</span>
            </h1>
          </div>

          <p className="text-gray-400 text-lg mb-8">
            Submit your proof link securely and get verified for your on-chain reward.
          </p>

          {/* Bounty ID */}
          {/* <div className="flex items-center gap-3 bg-[#111]/50 px-5 py-4 rounded-xl mb-5 
                          border border-[#ca8ff1]/30 shadow-[0_0_12px_rgba(202,143,241,0.12)]">
            <FaCoins className="text-[#f50090] text-xl"/>
            <input
              type="hidden"
              placeholder="Enter Bounty ID..."
              className="flex-1 bg-transparent text-lg outline-none placeholder-gray-600"
              value={bountyId}
              onChange={(e) => setBountyId(e.target.value)}
              readOnly 
            />
          </div> */}

          {/* Proof Link */}
          <div className="flex items-center gap-3 bg-[#111]/50 px-5 py-4 rounded-xl mb-5 
                          border border-[#ca8ff1]/30 shadow-[0_0_12px_rgba(202,143,241,0.12)]">
            <FaPaperPlane className="text-[#f50090] text-xl"/>
            <input
              type="text"
              placeholder="Paste Proof Link..."
              className="flex-1 bg-transparent text-lg outline-none placeholder-gray-600"
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
            />
          </div>

          {/* ✅ Developer Note */}
          <div className="flex gap-3 bg-[#111]/50 px-5 py-4 rounded-xl mb-6 
                          border border-[#ca8ff1]/30 shadow-[0_0_12px_rgba(202,143,241,0.12)]">
            <FaStickyNote className="text-[#f50090] text-xl mt-1"/>
            <textarea
              placeholder="Add Developer Note... (explanation, steps, issue details)"
              className="flex-1 bg-transparent text-lg outline-none placeholder-gray-600 h-28 resize-none"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 text-xl font-bold rounded-full
                       bg-gradient-to-r from-[#f50090] via-[#9b23ea] to-indigo-600 hover:opacity-90 transition-all shadow-[0_0_25px_rgba(245,0,144,0.5)] disabled:opacity-50"
          >
            <FaCrown className="text-white"/> {loading ? "Submitting..." : "Submit Proof"}
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            Reward unlocks after creator approval & NFT badge mint.
          </p>

        </div>

        {/* RIGHT INFO PANEL */}
        <div className="w-full lg:w-[38%] bg-[#0b0b0b]/50 backdrop-blur-xl rounded-2xl p-8 
                        border border-[#ca8ff1]/20 shadow-[0_0_30px_rgba(202,143,241,0.18)]">

          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent flex items-center gap-2 mb-6">
            <FaShieldAlt className="text-[#f50090]"/> Submission Info
          </h2>

          {/* Wallet */}
          <div className="flex items-center gap-3 bg-[#111]/60 px-5 py-4 rounded-xl mb-6 
                          border border-[#ca8ff1]/30 shadow-[0_0_15px_rgba(202,143,241,0.1)]">
            <FaWallet className="text-[#f50090] text-xl"/>
            <div className="flex flex-col w-full">
              <span className="text-gray-500 text-sm">Developer Wallet</span>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm truncate text-white">
                  {walletAddress}
                </span>
                <button
                  onClick={connectWallet}
                  className="text-xs px-2 py-1 rounded bg-[#f50090] text-white ml-3"
                >
                  {walletAddress === "Not Connected" ? "Connect" : "Reconnect"}
                </button>
              </div>
            </div>
          </div>

          {/* GitHub Issue */}
          <div className="bg-[#111]/60 p-6 rounded-xl border border-[#ca8ff1]/20 mb-6">
            <h3 className="text-lg font-semibold text-[#f50090] mb-2 flex items-center gap-2">
              <FaGithub className="text-[#ca8ff1]"/> GitHub Issue
            </h3>
            <p className="font-mono text-sm text-gray-400 truncate">
              {githubUrl}
            </p>
          </div>

          {/* Reward */}
          <div className="bg-[#111]/60 p-5 rounded-xl border border-[#ca8ff1]/30 mb-6 flex items-center justify-between">
            <span className="text-gray-400 text-md flex items-center gap-2">
              <FaCoins className="text-[#f50090]"/> Reward Locked:
            </span>
            <span className="bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent font-bold">
              {reward}ETH
            </span>
          </div>

    
          {/* Notice */}
          <div className="mt-8 bg-[#111]/60 border border-[#ca8ff1]/20 rounded-xl p-5 text-center">
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
