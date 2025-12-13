import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import {
  FaWallet, FaMedal, FaCode, FaClock, FaEthereum, FaTrophy,
  FaGithub, FaExternalLinkAlt, FaBell, FaUser, FaShieldAlt,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf
} from "react-icons/fa";
import DeveloperSidebar from "../components/DeveloperSidebar";

const StatBox = ({ icon, label, value }) => (
  <div className="flex flex-col items-center bg-[#111]/60 p-5 rounded-xl border border-[#f50090]/25 
                  shadow-[0_0_16px_rgba(245,0,144,0.15)] hover:shadow-[0_0_30px_rgba(245,0,144,0.4)] 
                  transition-all">
    <div className="text-[#f50090] text-3xl">{icon}</div>
    <h3 className="mt-2 text-gray-400 text-lg font-medium">{label}</h3>
    <p className="text-2xl font-extrabold mt-1">{value}</p>
  </div>
);

const UserDashBoard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [wallet, setWallet] = useState(null);
  const [network, setNetwork] = useState("");
  const [balance, setBalance] = useState("0.00");
  const [stats, setStats] = useState({ ethEarned: 0, bountiesWon: 0, activeSubmissions: 0, badgesEarned: 0 });
  const [availableBounties, setAvailableBounties] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [approvedBounties, setApprovedBounties] = useState([]);
  const [badges, setBadges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({ language: "", difficulty: "", rewardRange: "" });

  // Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask not found!");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const bal = await provider.getBalance(address);
      const net = await provider.getNetwork();
      
      setWallet(address);
      setBalance(ethers.formatEther(bal));
      setNetwork(net.name);
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  // Fetch Dashboard Data
  useEffect(() => {
    if (!wallet) return;
    
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:2025/api/developer/${wallet}`);
        setStats(res.data.stats || stats);
        setMySubmissions(res.data.submissions || []);
        setApprovedBounties(res.data.approved || []);
        setBadges(res.data.badges || []);
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Error fetching developer data:", err);
      }
    };

    const fetchBounties = async () => {
      try {
        const res = await axios.get("http://localhost:2025/api/bounties/available");
        setAvailableBounties(res.data.bounties || []);
      } catch (err) {
        console.error("Error fetching bounties:", err);
      }
    };

    fetchData();
    fetchBounties();
  }, [wallet]);

  // Filter Bounties
  const filteredBounties = availableBounties.filter(b => 
    (!filters.language || b.language === filters.language) &&
    (!filters.difficulty || b.difficultyLevel === filters.difficulty) &&
    (!filters.rewardRange || parseFloat(b.rewardAmount) >= parseFloat(filters.rewardRange))
  );

  const getStatusColor = (status) => {
    const colors = {
      "Pending Review": "bg-yellow-500/20 text-yellow-300",
      "Approved": "bg-green-500/20 text-green-300",
      "Rejected": "bg-red-500/20 text-red-300",
      "OPEN": "bg-blue-500/20 text-blue-300"
    };
    return colors[status] || "bg-gray-500/20 text-gray-300";
  };

  return (
    <div className="flex bg-[#090909] text-white min-h-screen">
      {/* Sidebar */}
      <DeveloperSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 px-10 py-10 ml-[260px]">
        
        {/* Banner */}
        <div className="w-full bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20 rounded-2xl p-6 mb-6 
                        border border-[#f50090]/30 shadow-[0_0_40px_rgba(245,0,144,0.3)]">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#f50090] to-[#ca8ff1] 
                         bg-clip-text text-transparent">
            Welcome Back Developer! 🚀
          </h2>
          <p className="text-lg text-gray-300 mt-2 font-medium">
            Track your bounties, manage submissions, and grow your Web3 portfolio.
          </p>
        </div>

        {/* Header */}
        <header className="flex justify-between items-center pb-4 border-b border-[#f50090]/40">
          <h1 className="text-3xl font-bold tracking-wide">
            DEVELOPER <span className="bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">DASHBOARD</span>
          </h1>

          {/* Wallet Section */}
          {wallet ? (
            <div className="flex items-center gap-3 bg-[#111]/70 px-5 py-2.5 rounded-xl border border-[#f50090]/50 
                            shadow-[0_0_20px_rgba(245,0,144,0.4)] max-w-[260px]">
              <FaWallet className="text-[#f50090] text-lg" />
              <span className="font-mono text-base truncate">{wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-[#f50090] px-5 py-2.5 rounded-xl font-bold text-white 
                         shadow-[0_0_20px_rgba(245,0,144,0.5)] hover:bg-[#d1007c]"
            >
              Connect Wallet
            </button>
          )}
        </header>

        {/* Show nothing until wallet is connected */}
        {!wallet ? (
          <div className="text-center mt-10 text-gray-400 text-lg">
            Please <span className="text-[#f50090] font-bold">connect your wallet</span> to view your developer dashboard.
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <section className="mt-8 grid grid-cols-4 gap-6">
              <StatBox icon={<FaEthereum />} label="Total ETH Earned" value={`${stats.ethEarned} ETH`} />
              <StatBox icon={<FaTrophy />} label="Bounties Won" value={stats.bountiesWon} />
              <StatBox icon={<FaClock />} label="Active Submissions" value={stats.activeSubmissions} />
              <StatBox icon={<FaMedal />} label="NFT Badges" value={stats.badgesEarned} />
            </section>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <section className="mt-8 bg-[#0d0d0d]/60 rounded-2xl p-6 border border-[#f50090]/25">
                <h2 className="text-xl font-bold mb-5 text-[#f50090]">Recent Activity</h2>
                <div className="space-y-3">
                  {mySubmissions.slice(0, 5).map((sub, i) => (
                    <div key={i} className="flex justify-between items-center bg-[#111]/60 rounded-xl p-4 
                                          border border-[#ca8ff1]/20 text-sm">
                      <div>
                        <p className="text-gray-300 text-base font-semibold">{sub.projectName}</p>
                        <p className="text-gray-400 text-sm">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "explore" && (
              <section className="mt-8 bg-[#0d0d0d]/60 rounded-2xl p-6 border border-[#f50090]/25">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-[#f50090]">Available Bounties</h2>
                  <div className="flex gap-3">
                    <select value={filters.language} onChange={(e) => setFilters({...filters, language: e.target.value})}
                            className="bg-[#111] border border-[#f50090]/30 rounded-xl px-4 py-2 text-sm">
                      <option value="">All Languages</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="Python">Python</option>
                      <option value="Solidity">Solidity</option>
                    </select>
                    <select value={filters.difficulty} onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                            className="bg-[#111] border border-[#f50090]/30 rounded-xl px-4 py-2 text-sm">
                      <option value="">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#f50090]/30 to-[#ca8ff1]/30 text-gray-200 rounded-xl">
                        {["Project", "Reward", "Level", "Lang", "Deadline", "Status", "Actions"].map((h, i) => (
                          <th key={i} className="px-4 py-3 text-sm font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBounties.map((b) => (
                        <tr key={b._id} className="bg-[#111]/60 border border-[#ca8ff1]/20 rounded-xl">
                          <td className="px-4 py-3 font-semibold">{b.projectName}</td>
                          <td className="px-4 py-3 text-[#f50090]">{b.rewardAmount} ETH</td>
                          <td className="px-4 py-3">{b.difficultyLevel}</td>
                          <td className="px-4 py-3">{b.language}</td>
                          <td className="px-4 py-3">{b.deadline}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(b.status)}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => navigate(`/claim/${b.bountyId}`)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#f50090]/15 text-[#f50090] 
                                       border border-[#f50090]/30 hover:bg-[#f50090]/25"
                            >
                              Submit Claim
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === "submissions" && (
              <section className="mt-8 bg-[#0d0d0d]/60 rounded-2xl p-6 border border-[#f50090]/25">
                <h2 className="text-xl font-bold mb-5 text-[#f50090]">My Submissions</h2>
                <div className="space-y-4">
                  {mySubmissions.map((sub, i) => (
                    <div key={i} className="bg-[#111]/60 p-5 rounded-xl border border-[#ca8ff1]/20 
                                          hover:shadow-[0_0_25px_rgba(202,143,241,0.3)] transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold">{sub.projectName}</h3>
                          <p className="text-gray-400 text-sm">Bounty ID: {sub.bountyId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(sub.status)}`}>
                          {sub.status === "Pending Review" && <FaHourglassHalf className="inline mr-1" />}
                          {sub.status === "Approved" && <FaCheckCircle className="inline mr-1" />}
                          {sub.status === "Rejected" && <FaTimesCircle className="inline mr-1" />}
                          {sub.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <p className="text-gray-300">
                          <FaExternalLinkAlt className="inline text-[#f50090] mr-2" />
                          <a href={sub.submissionLink} target="_blank" rel="noreferrer" 
                             className="text-[#ca8ff1] hover:underline">
                            View Submission
                          </a>
                        </p>
                        <p className="text-gray-400">
                          <FaClock className="inline mr-2" />
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-300">Notes: {sub.notes || "No notes"}</p>
                        {sub.status === "Approved" && (
                          <p className="text-green-400 font-bold">Reward: {sub.reward} ETH</p>
                        )}
                      </div>
                      {sub.status === "Rejected" && sub.rejectionMessage && (
                        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <p className="text-red-400 text-sm">
                            <strong>Rejection:</strong> {sub.rejectionMessage}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "earnings" && (
              <section className="mt-8 bg-[#0d0d0d]/60 rounded-2xl p-6 border border-[#f50090]/25">
                <h2 className="text-xl font-bold mb-5 text-[#f50090]">Approved Bounties & Earnings</h2>
                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#f50090]/30 to-[#ca8ff1]/30 text-gray-200 rounded-xl">
                        {["Bounty ID", "Project", "ETH Received", "Transaction", "Date", "Badge"].map((h, i) => (
                          <th key={i} className="px-4 py-3 text-sm font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {approvedBounties.map((b) => (
                        <tr key={b._id} className="bg-[#111]/60 border border-[#ca8ff1]/20 rounded-xl">
                          <td className="px-4 py-3 font-mono text-sm">{b.bountyId}</td>
                          <td className="px-4 py-3 font-semibold">{b.projectName}</td>
                          <td className="px-4 py-3 text-green-400 font-bold">{b.ethReceived} ETH</td>
                          <td className="px-4 py-3">
                            <a href={`https://sepolia.etherscan.io/tx/${b.txHash}`} target="_blank" rel="noreferrer"
                               className="text-[#ca8ff1] hover:underline text-sm flex items-center gap-1">
                              {b.txHash?.slice(0, 8)}... <FaExternalLinkAlt className="text-xs" />
                            </a>
                          </td>
                          <td className="px-4 py-3 text-sm">{new Date(b.approvedDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            {b.badgeEarned ? (
                              <FaMedal className="text-yellow-400 text-xl" />
                            ) : (
                              <span className="text-gray-500 text-sm">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === "badges" && (
              <section className="mt-8 bg-[#0d0d0d]/60 rounded-2xl p-6 border border-[#f50090]/25">
                <h2 className="text-xl font-bold mb-5 text-[#f50090]">NFT Badge Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {badges.map((badge, i) => (
                    <div key={i} className="bg-[#111]/60 p-5 rounded-2xl border border-[#ca8ff1]/20 
                                          hover:shadow-[0_0_30px_rgba(245,0,144,0.4)] transition-all group">
                      <img src={badge.imageURI} alt={badge.name} 
                           className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform" />
                      <h3 className="text-lg font-bold mb-2">{badge.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">
                        Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-[#f50090]/20 text-[#f50090] 
                                         border border-[#f50090]/40 rounded-lg text-xs font-bold 
                                         hover:bg-[#f50090]/30 transition-all">
                          Download
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#ca8ff1]/20 text-[#ca8ff1] 
                                         border border-[#ca8ff1]/40 rounded-lg text-xs font-bold 
                                         hover:bg-[#ca8ff1]/30 transition-all">
                          Metadata
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="mt-8 bg-[#0d0d0d]/60 rounded-2xl p-6 border border-[#f50090]/25">
                <h2 className="text-xl font-bold mb-5 text-[#f50090]">
                  <FaBell className="inline mr-2" /> Notifications
                </h2>
                <div className="space-y-3">
                  {notifications.map((notif, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${
                      notif.type === "success" ? "bg-green-500/10 border-green-500/30" :
                      notif.type === "error" ? "bg-red-500/10 border-red-500/30" :
                      "bg-blue-500/10 border-blue-500/30"
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold mb-1">{notif.title}</h4>
                          <p className="text-gray-300 text-sm">{notif.message}</p>
                        </div>
                        <span className="text-xs text-gray-400">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "profile" && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile */}
                <div className="bg-[#0d0d0d]/60 rounded-2xl p-6 border border-[#f50090]/25">
                  <h2 className="text-xl font-bold text-[#f50090] mb-4">
                    <FaUser className="inline mr-2" /> Developer Profile
                  </h2>
                  <div className="space-y-3 text-gray-300">
                    <p><strong>Wallet:</strong> {wallet}</p>
                    <p><strong>Network:</strong> {network || "Sepolia"}</p>
                    <p><strong>Balance:</strong> {parseFloat(balance).toFixed(4)} ETH</p>
                    <p><strong>GitHub:</strong> <FaGithub className="inline text-[#ca8ff1]" /> @username</p>
                    <p><strong>Preferred Languages:</strong> JavaScript, Solidity, Python</p>
                    <p><strong>Experience Level:</strong> Intermediate</p>
                    <p><strong>Total Wins:</strong> {stats.bountiesWon}</p>
                    <p><strong>Badges Count:</strong> {stats.badgesEarned}</p>
                  </div>
                </div>

                {/* Security */}
                <div className="bg-[#0d0d0d]/60 rounded-2xl p-6 border border-[#ca8ff1]/25">
                  <h2 className="text-xl font-bold text-[#ca8ff1] mb-4">
                    <FaShieldAlt className="inline mr-2" /> Security & Transparency
                  </h2>
                  <div className="space-y-3 text-gray-300 text-sm">
                    <p><strong>Smart Contract:</strong> <span className="font-mono text-xs">0x1234...5678</span></p>
                    <p><strong>Network:</strong> {network || "Sepolia Testnet"}</p>
                    <p><strong>Last Interaction:</strong> 2 hours ago</p>
                    <p><strong>Gas Used (Total):</strong> 0.0023 ETH</p>
                    <a href="https://sepolia.etherscan.io" target="_blank" rel="noreferrer"
                       className="text-[#f50090] hover:underline flex items-center gap-2 mt-3">
                      View on Etherscan <FaExternalLinkAlt />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashBoard;