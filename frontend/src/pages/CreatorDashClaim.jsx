import React, { useEffect, useState } from "react";
import CreatorLayout from "../Layout/CreatorLayout";
import { FaSearch, FaChevronDown, FaEye, FaTimes } from "react-icons/fa";
import axios from "axios";
import { ethers } from "ethers";

/* ---------- Status Badge ---------- */
const claimStatus = (isApproved, bountyStatus) => {
  if (bountyStatus === "REJECT") return "Rejected";
  if (isApproved) return "Approved";
  return "Pending";
};

const statusStyle = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "Rejected":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    default:
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  }
};

const CreatorClaims = () => {
  const [bounties, setBounties] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch creator bounties ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const wallet = (await signer.getAddress()).toLowerCase();

        const res = await axios.get(
          `http://localhost:2025/api/bounties/creator/${wallet}`
        );

        setBounties(res.data.bounties || []);
      } catch (err) {
        console.error("Failed to load claims", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- Filter by project ---------- */
  const filtered = bounties.filter((b) =>
    b.projectName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-[#090909] min-h-screen text-white">
      <CreatorLayout />

      <div className="ml-[-40px] w-full p-10">

        {/* HEADER */}
        <div className="mb-8 bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20
                        rounded-2xl p-6 border border-[#f50090]/30
                        shadow-[0_0_40px_rgba(245,0,144,0.3)]">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#f50090] to-[#ca8ff1]
                         bg-clip-text text-transparent">
            📥 Claims Overview
          </h2>
          <p className="text-gray-300 mt-2">
            Review all developer submissions across your projects
          </p>
        </div>

        {/* FILTER */}
        <div className="flex items-center gap-4 mb-6 bg-[#0d0d0d]/60
                        p-4 rounded-2xl border border-[#f50090]/25">
          <FaSearch className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-center text-gray-400">Loading claims...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400">No projects found</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((bounty) => (
              <div
                key={bounty._id}
                className="bg-[#0d0d0d]/70 backdrop-blur-xl rounded-2xl
                           border border-[#f50090]/25
                           shadow-[0_0_30px_rgba(245,0,144,0.25)]"
              >
                {/* BOUNTY HEADER */}
                <button
                  onClick={() =>
                    setExpanded(expanded === bounty._id ? null : bounty._id)
                  }
                  className="w-full flex justify-between items-center p-6"
                >
                  <div className="text-left">
                    <h3 className="text-xl font-bold">{bounty.projectName}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {bounty.rewardAmount} ETH • {bounty.language} •{" "}
                      {bounty.difficultyLevel}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Claims: {bounty.submissions.length}
                    </p>
                  </div>
                  <FaChevronDown
                    className={`transition ${
                      expanded === bounty._id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* CLAIMS TABLE */}
                {expanded === bounty._id && (
                  <div className="px-6 pb-6">
                    {bounty.submissions.length === 0 ? (
                      <p className="text-gray-400 text-sm">
                        No claims submitted yet
                      </p>
                    ) : (
                      <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                          <tr className="text-gray-400 text-sm">
                            <th className="text-left">Developer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bounty.submissions.map((s, i) => {
                            const status = claimStatus(
                              s.isApproved,
                              bounty.status
                            );
                            return (
                              <tr
                                key={i}
                                className="bg-[#111]/60 rounded-xl"
                              >
                                <td className="px-4 py-3 font-mono text-sm">
                                  {s.developerAddress.slice(0, 6)}...
                                  {s.developerAddress.slice(-4)}
                                </td>
                                <td className="text-center text-sm">
                                  {new Date(s.createdAt).toLocaleDateString()}
                                </td>
                                <td className="text-center">
                                  <span
                                    className={`px-3 py-1 rounded-xl text-xs border ${statusStyle(
                                      status
                                    )}`}
                                  >
                                    {status}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <button
                                    onClick={() =>
                                      setSelectedClaim({ bounty, s })
                                    }
                                    className="inline-flex items-center gap-2
                                               px-3 py-1.5 rounded-xl text-xs
                                               bg-[#f50090]/20 text-[#f50090]
                                               border border-[#f50090]/40"
                                  >
                                    <FaEye /> View
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CLAIM MODAL */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0d0d0d] w-[480px] rounded-2xl p-6
                          border border-[#f50090]/40
                          shadow-[0_0_40px_rgba(245,0,144,0.4)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Claim Details</h3>
              <FaTimes
                className="cursor-pointer text-gray-400"
                onClick={() => setSelectedClaim(null)}
              />
            </div>

            <p className="text-sm text-gray-400 mb-2">
              Developer:{" "}
              <span className="font-mono text-white">
                {selectedClaim.s.developerAddress}
              </span>
            </p>

            <a
              href={selectedClaim.s.submissionLink}
              target="_blank"
              rel="noreferrer"
              className="text-[#f50090] text-sm underline"
            >
              Open Submission
            </a>

            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-1">Notes</p>
              <div className="bg-[#111]/70 p-3 rounded-xl text-sm max-h-[120px] overflow-y-auto">
                {selectedClaim.s.notes || "No notes provided"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorClaims;
