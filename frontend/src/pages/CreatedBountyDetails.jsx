import React, { useEffect, useState } from "react";
import { FaWallet, FaMedal, FaCode, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import CreatorLayout from "../Layout/CreatorLayout";
import BountyDispenserGaslessABI from "../contractABI/BountyDispenserGasless.json"; // Make sure ABI is here

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"; // Replace with your deployed contract address

const StatBox = ({ icon, label, value }) => (
  <div className="flex flex-col items-center bg-[#111]/60 p-5 rounded-xl border border-[#f50090]/25 shadow-[0_0_16px_rgba(245,0,144,0.15)] hover:shadow-[0_0_30px_rgba(245,0,144,0.4)] transition-all">
    <div className="text-[#f50090] text-3xl">{icon}</div>
    <h3 className="mt-2 text-gray-400 text-lg font-medium">{label}</h3>
    <p className="text-2xl font-extrabold mt-1">{value}</p>
  </div>
);

const CreatedBountyDetails = () => {
  const navigate = useNavigate();

  const [bounties, setBounties] = useState([]);
  const [recentSubs, setRecentSubs] = useState([]);
  const [mintedBadges, setMintedBadges] = useState([]);
  const [wallet, setWallet] = useState(null);

  // Connect wallet manually
 const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("No crypto wallet detected. Please install a browser wallet.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const address = await signer.getAddress();

    setWallet(address);
  } catch (err) {
    console.error("Wallet connection error:", err);
  }
};

  // Fetch data only when wallet is connected
  useEffect(() => {
    if (!wallet) return;

    const fetchCreatorData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:2025/api/bounties/creator/${wallet}`
        );
        setBounties(res.data.bounties || []);
        setRecentSubs(res.data.recentSubmissions || []);
        setMintedBadges(res.data.badges || []);
      } catch (err) {
        console.error("Error loading creator data:", err);
      }
    };

    fetchCreatorData();
  }, [wallet]);

  // Close bounty function
  const closeBounty = async (bounty) => {
    if (!wallet) return alert("Connect your wallet first!");

    try {
      // 1. Connect to contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        BountyDispenserGaslessABI,
        signer
      );

      // 2. Call closeBounty on blockchain
      const tx = await contract.closeBounty(bounty.bountyId);
      await tx.wait(); // wait for confirmation

      // 3. Update backend DB
      await axios.put(`http://localhost:2025/api/bounties/${bounty._id}/close`);

      // 4. Update local state
      setBounties((prev) =>
        prev.map((b) =>
          b._id === bounty._id ? { ...b, status: "CLOSED" } : b
        )
      );

      alert("Bounty closed successfully!");
    } catch (err) {
      console.error("Error closing bounty:", err);
      alert("Failed to close bounty. See console for details.");
    }
  };

  return (
    <div className="flex bg-[#090909] text-white min-h-screen">
      <CreatorLayout />

      <div className="ml-[-40px] w-full p-10">

        {/* Banner */}
        <div className="w-full bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20 rounded-2xl p-6 mb-6 border border-[#f50090]/30 shadow-[0_0_40px_rgba(245,0,144,0.3)]">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">
            Welcome Back Creator!
          </h2>
          <p className="text-lg text-gray-300 mt-2">
            Manage your bounties, verify submissions, mint badges & release rewards.
          </p>
        </div>

        {/* Header */}
        <header className="flex justify-between items-center pb-4 border-b border-[#f50090]/40">
          <h1 className="text-3xl font-bold tracking-wide">
            CREATOR <span className="bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">DASHBOARD</span>
          </h1>

          {/* Wallet Section */}
          {wallet ? (
            <div className="flex items-center gap-3 bg-[#111]/70 px-5 py-2.5 rounded-xl border border-[#f50090]/50 shadow-[0_0_20px_rgba(245,0,144,0.4)] max-w-[260px]">
              <FaWallet className="text-[#f50090] text-lg" />
              <span className="font-mono text-base truncate">{wallet}</span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-[#f50090] px-5 py-2.5 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(245,0,144,0.5)] hover:bg-[#d1007c]"
            >
              Connect Wallet
            </button>
          )}
        </header>

        {/* Show nothing until wallet is connected */}
        {!wallet ? (
          <div className="text-center mt-10 text-gray-400 text-lg">
            Please <span className="text-[#f50090] font-bold">connect your wallet</span> to view your creator dashboard.
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <section className="mt-8 grid grid-cols-3 gap-6">
              <StatBox icon={<FaCode />} label="Open Bounties" value={bounties.filter(b => b.status === "OPEN").length} />
              <StatBox icon={<FaClock />} label="Waiting Claims" value={recentSubs.length} />
              <StatBox icon={<FaMedal />} label="NFT Minted" value={mintedBadges.length} />
            </section>

            {/* Created Bounties Table */}
            <section className="mt-8 bg-[#0d0d0d]/60 rounded-2xl p-6 border border-[#f50090]/25">
              <h2 className="text-xl font-bold mb-5 text-[#f50090]">Created Bounties</h2>

              <div className="overflow-x-auto rounded-xl">
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#f50090]/30 to-[#ca8ff1]/30 text-gray-200 rounded-xl">
                      {["Project", "Reward", "Range", "Level", "Lang", "Deadline", "Status", "Actions"].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-sm font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {bounties.map((b) => (
                      <tr key={b._id} className="bg-[#111]/60 border border-[#ca8ff1]/20 rounded-xl">

                        <td className="px-4 py-3 font-semibold">{b.projectName}</td>
                        <td className="px-4 py-3">{b.rewardAmount} ETH</td>
                        <td className="px-4 py-3">{b.rewardRange}</td>
                        <td className="px-4 py-3">{b.difficultyLevel}</td>
                        <td className="px-4 py-3">{b.language}</td>
                        <td className="px-4 py-3">{b.deadline}</td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-bold ${
                              b.status === "OPEN"
                                ? "bg-green-500/20 text-green-300"
                                : b.status === "IN_REVIEW"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : b.status === "CLOSED"
                                ? "bg-gray-500/30 text-gray-300"
                                : "bg-blue-500/20 text-blue-300"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex gap-2">

                            {/* View */}
                            <button
                              onClick={() => navigate(`/view-claim/${b.bountyId}`)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#f50090]/15 text-[#f50090] border border-[#f50090]/30 hover:bg-[#f50090]/25"
                            >
                              View Bounty
                            </button>

                            {/* Close Bounty */}
                            {b.status === "OPEN" && (
                              <button
                                onClick={() => closeBounty(b)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"
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
            <section className="mt-8 bg-[#0b0b0b]/40 rounded-2xl p-5 border border-[#ca8ff1]/20">
              <h2 className="text-lg font-bold mb-3 text-[#f50090]">Latest Claims</h2>

              <div className="space-y-3">
                {recentSubs.length === 0 && (
                  <p className="text-gray-400">No recent submissions yet.</p>
                )}

                {recentSubs.map((s, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-[#111]/60 rounded-xl p-4 border border-[#ca8ff1]/20 text-sm"
                  >
                    <div>
                      <p className="text-gray-300 text-base">
                        Project: <span className="font-semibold">{s.projectName}</span>
                      </p>
                      <p className="text-gray-400 text-base">Dev: {s.developerAddress}</p>
                      <p className="text-[#f50090] truncate text-base">{s.submissionLink}</p>
                      <p className="text-gray-400 text-base">Note: {s.notes}</p>
                    </div>

                    <button
                      onClick={() => navigate(`/handle-claim/${s.bountyId}/${s.developerAddress}`)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#f50090]/20 text-[#f50090] border border-[#f50090]/40 hover:bg-[#f50090]/30 transition-all"
                    >
                      Handle Claim
                    </button>
                  </div>
                ))}

              </div>
            </section>

          </>
        )}

      </div>
    </div>
  );
};

export default CreatedBountyDetails;
