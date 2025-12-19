import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEye } from "react-icons/fa";
import CreatorLayout from "../Layout/CreatorLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";

const statusColor = (status) => {
  switch (status) {
    case "OPEN":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "IN_REVIEW":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "CLOSED":
      return "bg-gray-500/30 text-gray-300 border-gray-500/30";
    default:
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
  }
};

const MyBounties = () => {
  const navigate = useNavigate();

  const [bounties, setBounties] = useState([]);
  const [filteredBounties, setFilteredBounties] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // 🔐 Fetch creator wallet & bounties
  useEffect(() => {
    const fetchBounties = async () => {
      try {
        if (!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const wallet = (await signer.getAddress()).toLowerCase();

        const res = await axios.get(
          `http://localhost:2025/api/bounties/creator/${wallet}`
        );

        setBounties(res.data.bounties);
        setFilteredBounties(res.data.bounties);
      } catch (err) {
        console.error("Failed to fetch bounties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  // 🔍 Filters
  useEffect(() => {
    let data = [...bounties];

    if (statusFilter !== "ALL") {
      data = data.filter((b) => b.status === statusFilter);
    }

    if (search) {
      data = data.filter((b) =>
        b.projectName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBounties(data);
  }, [statusFilter, search, bounties]);

  return (
    <div className="flex bg-[#090909] min-h-screen text-white">
      <CreatorLayout />

      <div className="ml-[-40px] w-full p-10">

        {/* HEADER */}
        <div className="w-full mb-8 bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20
                        rounded-2xl p-6 border border-[#f50090]/30 shadow-[0_0_40px_rgba(245,0,144,0.3)]">
          <div className="flex justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#f50090] to-[#ca8ff1]
                             bg-clip-text text-transparent">
                🔥 Developers Are Claiming Your Bounties
              </h2>
              <p className="text-gray-300 mt-2">
                Monitor submissions, review work, and close bounties securely.
              </p>
            </div>

            <button
              onClick={() => navigate("/create-bounty")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl
                         bg-gradient-to-r from-[#f50090] via-[#9b23ea] to-indigo-600
                         font-bold shadow-[0_0_25px_rgba(245,0,144,0.5)]"
            >
              <FaPlus /> Create Bounty
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-4 mb-6 bg-[#0d0d0d]/60 p-4 rounded-2xl
                        border border-[#f50090]/25">

          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111]/70 px-4 py-2 rounded-xl border border-[#f50090]/30"
          >
            <option value="ALL">Status: All</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_REVIEW">IN_REVIEW</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <div className="flex items-center bg-[#111]/70 px-4 py-2 rounded-xl
                          border border-[#f50090]/30 ml-auto">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search project..."
              className="bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#0d0d0d]/60 rounded-2xl p-6
                        border border-[#f50090]/25">

          {loading ? (
            <p className="text-center text-gray-400">Loading bounties...</p>
          ) : filteredBounties.length === 0 ? (
            <p className="text-center text-gray-400">No bounties found</p>
          ) : (
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-gray-400 text-sm">
                  <th className="text-left px-4">Project</th>
                  <th>Reward</th>
                  <th>Difficulty</th>
                  <th>Language</th>
                  <th>Submissions</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBounties.map((b) => (
                  <tr key={b._id} className="bg-[#111]/60 rounded-xl">
                    <td className="px-4 py-4 font-semibold">{b.projectName}</td>
                    <td className="text-center">{b.rewardAmount} ETH</td>
                    <td className="text-center">{b.difficultyLevel}</td>
                    <td className="text-center">{b.language}</td>
                    <td className="text-center">{b.submissions.length}</td>

                    <td className="text-center">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${statusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </td>

                    <td className="text-center text-sm">
                      {b.deadline || "—"}
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() => navigate(`/view-claim/${b.bountyId}`)}
                        className="inline-flex items-center gap-2 px-3 py-1.9
                                   rounded-xl text-[17px] font-bold
                                   bg-[#f50090]/20 text-[#f50090]
                                   border border-[#f50090]/40"
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBounties;
