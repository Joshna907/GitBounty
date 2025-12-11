import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { testBounties } from "../data/testBounties";
import { useNavigate } from "react-router-dom";

const ExploreBounty = () => {
  const navigate = useNavigate();

  const [bounties, setBounties] = useState([]);
  const [filteredBounties, setFilteredBounties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("rewardRange");

  const [selectedFilters, setSelectedFilters] = useState({
    rewardRange: [],
    difficultyLevel: [],
    status: [],
    language: [],
  });

  // Filter Options
  const filterOptions = {
rewardRange: [
  "0 - 0.01 ETH",
  "0.01 - 0.1 ETH",
  "0.1 - 1 ETH",
  "1+ ETH",
],
    difficultyLevel:  ["Beginner", "Intermediate", "Advanced"],
    status:["OPEN","IN_REVIEW", "APPROVED", "CLOSED"],
    language: ["Solidity", "JavaScript", "Rust", "Python" ,"Php" ,"Java","C++" , "TypeScript", "Go" ,"C#" ,"Ruby", "Swift"],
  };

  // Fetch Bounties
  // Fetch Bounties
const fetchBounties = async () => {
  try {
    const res = await fetch("http://localhost:2025/api/bounties/all");
    const data = await res.json();

    if (data.success && Array.isArray(data.bounties)) {
      setBounties(data.bounties);
      setFilteredBounties(data.bounties);
    } else {
      setBounties([]);
      setFilteredBounties([]);
    }
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchBounties();
  }, []);

  // Toggle Checkbox Filter
  const toggleFilter = (type, value) => {
    setSelectedFilters((prev) => {
      const already = prev[type].includes(value);

      return {
        ...prev,
        [type]: already
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  // Re-Filter Whenever Filters/Search Change
  useEffect(() => {
    let updated = [...bounties];

    // Search Filter
    if (searchTerm.trim() !== "") {
      updated = updated.filter(
        (b) =>
          b.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.githubIssueUrl?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Reward Range
    if (selectedFilters.rewardRange.length > 0) {
      updated = updated.filter((b) =>
        selectedFilters.rewardRange.includes(b.rewardRange)
      );
    }

    // Difficulty Level
    if (selectedFilters.difficultyLevel.length > 0) {
      updated = updated.filter((b) =>
        selectedFilters.difficultyLevel.includes(b.difficultyLevel)
      );
    }

    // Status
    if (selectedFilters.status.length > 0) {
      updated = updated.filter((b) =>
        selectedFilters.status.includes(b.status)
      );
    }

    // Language
    if (selectedFilters.language.length > 0) {
      updated = updated.filter((b) =>
        selectedFilters.language.includes(b.language)
      );
    }

    setFilteredBounties(updated);
  }, [searchTerm, selectedFilters, bounties]);

  // Clear All Filters
  const clearAllFilters = () => {
    setSelectedFilters({
      rewardRange: [],
      difficultyLevel: [],
      status: [],
      language: [],
    });
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white font-poppins">
      {/* ---- Hero Section ---- */}
      <div className="py-32 px-20 bg-[#090909]">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold mt-4">
            Explore: <span className="text-[#f50090]">Bug Bounties</span>
          </h1>

          <p className="text-gray-400 text-[20px] max-w-3xl mt-6 leading-relaxed">
            Discover verified Web2 And Web3 bounty programs powered by Gasless
            GitBounty. All metrics update daily, ensuring transparency while
            keeping sensitive report details confidential.
          </p>
        </div>
      </div>

      {/* ---- Top Filter Bar ---- */}
      <div className="bg-[#0d0d0d] mx-10 px-6 py-4 rounded-lg flex flex-col md:flex-row justify-between items-center shadow-[0_0_15px_rgba(245,0,144,0.3)] border border-[#f50090]/20 gap-4">
        <div className="flex items-center gap-3">
          <button className="text-xl font-semibold text-white px-6 py-3 bg-gradient-to-r from-[#f50090] to-[#9b23ea] rounded-md hover:opacity-90 transition">
            All
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-xl font-semibold text-gray-300 px-6 py-3 border border-[#f50090]/40 rounded-md hover:bg-[#1a1a1a] transition"
          >
            {showFilters ? "Hide All Filters" : "Show All Filters"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-[#111] border border-[#f50090]/30 rounded-md px-4 py-3 w-full md:w-[450px] text-xl shadow-[0_0_10px_rgba(245,0,144,0.2)]">
          <FaSearch className="text-[#f50090] mr-3 text-lg" />
          <input
            type="text"
            placeholder="Search by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white placeholder-gray-500 outline-none w-full"
          />
        </div>
      </div>

      {/* ---- Filter Section ---- */}
      {showFilters && (
        <div className="bg-[#0d0d0d] border border-[#f50090]/30 rounded-lg px-8 py-8 mt-6 mx-10 flex flex-col md:flex-row gap-6 shadow-[0_0_20px_rgba(245,0,144,0.2)]">
          {/* Left Side */}
          <div className="w-full md:w-1/4 border-r border-[#f50090]/30 pr-4">
            <h3 className="text-xl font-semibold mb-4 text-[#f50090]">
              Filter By
            </h3>

            <ul className="space-y-4 text-gray-300 text-lg">
              {Object.keys(filterOptions).map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => setActiveFilter(item)}
                  className={`cursor-pointer transition-all ${
                    activeFilter === item
                      ? "text-[#f50090] font-semibold"
                      : "hover:text-[#f50090]"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Filter Options */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-200">
                Select to limit results
              </span>

              <div className="flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-400 px-3 py-1 border border-[#f50090]/40 rounded hover:bg-[#1a1a1a] transition"
                >
                  Clear Filters
                </button>

                <button className="text-sm text-white px-3 py-1 rounded bg-gradient-to-r from-[#f50090] to-[#9b23ea] hover:opacity-90 transition">
                  View {filteredBounties.length} Bounties
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filterOptions[activeFilter].map((option, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer text-md"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters[activeFilter].includes(option)}
                    onChange={() => toggleFilter(activeFilter, option)}
                    className="accent-[#f50090] w-5 h-5 rounded"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- Table Section ---- */}
      <div className="mt-12 mx-auto w-11/12 overflow-x-auto">
        <table className="w-full border-collapse bg-[#0b0b0b] rounded-lg overflow-hidden shadow-[0_0_20px_rgba(245,0,144,0.25)]">
          <thead className="bg-[#1c1c1c]">
            <tr className="text-[#f50090]">
              <th className="p-4 border-b border-[#f50090]/20 text-left">
                Name
              </th>
              <th className="p-4 border-b border-[#f50090]/20 text-left">
                Issue Title
              </th>
              <th className="p-4 border-b border-[#f50090]/20 text-left">
                Language
              </th>
              <th className="p-4 border-b border-[#f50090]/20 text-left">
                Reward
              </th>
              <th className="p-4 border-b border-[#f50090]/20 text-left">
                Deadline
              </th>
              <th className="p-4 border-b border-[#f50090]/20 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredBounties.map((bounty, index) => (
              <tr
                key={index}
                className="hover:bg-[#151515] transition duration-200 border-b border-[#f50090]/10"
              >
                <td className="p-4 font-semibold">{bounty.projectName}</td>
                <td className="p-4 text-gray-400">{bounty.issueTitle}</td>
                <td className="p-4 text-gray-400">{bounty.language}</td>
                <td className="p-4 text-green-400">
                  ${bounty.rewardAmount}
                </td>
                <td className="p-4 text-gray-400">{bounty.deadline}</td>

                <td className="p-4 text-center flex flex-col md:flex-row gap-3 ">
                  <button
                    onClick={() =>
                      navigate(`/bounty/${bounty.bountyId}`, {
                        state: { bounty },
                      })
                    }
                    className="bg-gradient-to-r from-[#f50090] to-[#9b23ea] px-3 py-2 rounded-full hover:opacity-90 transition"
                  >
                    View Bounty
                  </button>

                  {/* //claim bounty button */}
                  <button
                    onClick={() =>
                      navigate(`/claim/${bounty._id}`, {
                        state: { bounty },
                      })
                    }
                    className="bg-gradient-to-r from-[#f50090] to-[#9b23ea] px-3 py-2 rounded-full hover:opacity-90 transition"
                  >
                    claim Bounty
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Footer ---- */}
      <div className="text-center text-gray-500 text-sm py-8">
        Showing {filteredBounties.length} bounty programs
      </div>
    </div>
  );
};

export default ExploreBounty;
