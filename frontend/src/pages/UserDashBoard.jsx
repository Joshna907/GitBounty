import React, { useEffect, useState } from "react";
import {
  FaCode,
  FaEthereum,
  FaMedal,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowRight,
} from "react-icons/fa";
import { ethers } from "ethers";
import axios from "axios";
import DeveloperSidebar from "../components/DeveloperSidebar";

/* =======================
   Reusable Stat Card
======================= */
const StatCard = ({ icon, label, value }) => (
  <div className="flex flex-col items-center bg-[#111]/60 p-5 rounded-xl
                  border border-[#f50090]/25
                  shadow-[0_0_16px_rgba(245,0,144,0.15)]
                  hover:shadow-[0_0_30px_rgba(245,0,144,0.4)]
                  transition-all">
    <div className="text-[#f50090] text-3xl">{icon}</div>
    <h3 className="mt-2 text-gray-400 text-lg">{label}</h3>
    <p className="text-2xl font-extrabold text-white mt-1">{value}</p>
  </div>
);

/* =======================
   Helpers
======================= */
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getTimelineText = (status) => {
  if (status === "approved") return "Submission Approved";
  if (status === "rejected") return "Submission Rejected";
  return "Submission Under Review";
};

const getStatusIcon = (status) => {
  if (status === "approved") return <FaCheckCircle className="text-green-400" />;
  if (status === "rejected") return <FaTimesCircle className="text-red-400" />;
  return <FaHourglassHalf className="text-yellow-400" />;
};

/* =======================
   Dashboard
======================= */
const UserDashBoard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [wallet, setWallet] = useState("");
  const [stats, setStats] = useState(null);
  const [skills, setSkills] = useState([]);
  const [activity, setActivity] = useState([]);
  const [availableBounties, setAvailableBounties] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = (await signer.getAddress()).toLowerCase();
      setWallet(address);

      const res = await axios.get(
        `http://localhost:2025/api/bounties/dashboard/${address}`
      );

      setStats(res.data.stats);
      setSkills(res.data.skills || []);
      setActivity(res.data.activity || []);
      setAvailableBounties(res.data.availableBounties || []);
    };

    loadDashboard();
  }, []);

  if (!stats) {
    return <div className="text-white p-10">Loading dashboard...</div>;
  }

  return (
    <div className="flex bg-[#090909] min-h-screen text-white">
      <DeveloperSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 px-10 py-10 ml-[260px]">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20
                        rounded-2xl p-6 mb-8 border border-[#f50090]/30">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r
                         from-[#f50090] to-[#ca8ff1]
                         bg-clip-text text-transparent">
            Developer Dashboard 🚀
          </h2>
          <p className="text-gray-300 mt-2">
            Wallet: {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<FaCode />} label="Active Submissions" value={stats.pending} />
          <StatCard icon={<FaCheckCircle />} label="Bounties Won" value={stats.bountiesWon} />
          <StatCard icon={<FaEthereum />} label="ETH Earned" value={`${stats.ethEarned} ETH`} />
          <StatCard icon={<FaMedal />} label="NFT Badges" value={stats.badges} />
        </div>

        {/* Skills */}
        <div className="bg-[#0d0d0d]/70 p-6 rounded-2xl mb-10 border border-[#f50090]/25">
          <h3 className="text-xl font-bold mb-4">🧠 Skills Used</h3>
          <div className="flex gap-3 flex-wrap">
            {skills.map(skill => (
              <span key={skill} className="px-4 py-1 rounded-full bg-[#f50090]/20
                                           border border-[#f50090]/30 text-[#f50090]">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Available Bounties */}
        <div className="bg-[#0d0d0d]/70 p-6 rounded-2xl mb-10 border border-[#f50090]/25">
          <h3 className="text-xl font-bold mb-6">🔍 Available Bounties</h3>

          {availableBounties.map(b => (
            <div key={b._id}
              className="flex justify-between items-center p-4 mb-4 rounded-xl
                         bg-[#111]/60 border border-[#f50090]/20">
              <div>
                <h4 className="font-bold">{b.projectName}</h4>
                <p className="text-sm text-gray-400">
                  {b.language} • Deadline: {formatDate(b.deadline)}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-[#f50090] font-bold">
                  {b.rewardAmount} ETH
                </span>
                <button className="px-4 py-2 rounded-lg bg-[#f50090] text-black font-semibold">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Timeline */}
        <div className="bg-[#0d0d0d]/70 p-6 rounded-2xl border border-[#f50090]/25">
          <h3 className="text-xl font-bold mb-6">🕒 Activity Timeline</h3>

          {activity.map((a, i) => (
            <div key={i} className="flex gap-4 items-start mb-4">
              {getStatusIcon(a.status)}
              <div>
                <p className="font-semibold">
                  {getTimelineText(a.status)}
                </p>
                <p className="text-sm text-gray-400">
                  Project: {a.text} • {formatDate(a.date)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UserDashBoard;
