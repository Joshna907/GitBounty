import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { testBounties } from "../data/testBounties";
import { 
  FaShieldAlt, 
  FaCode, 
  FaCheckCircle, 
  FaExternalLinkAlt, 
  FaClock,
  FaCoins,
  FaUsers,
  FaFileContract,
  FaLock,
  FaChartLine
} from "react-icons/fa";

const BountyDetails = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("information");

  // Get bounty from state or from testBounties using id
  const bounty = location.state?.bounty || testBounties.find(b => b.id === parseInt(id));

  if (!bounty) {
    return (
      <div className="min-h-screen bg-[#090909] text-white font-poppins flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Bounty Not Found</h2>
          <button
            onClick={() => navigate("/explore")}
            className="bg-gradient-to-r from-[#f50090] to-[#9b23ea] px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "information", label: "Information", icon: <FaShieldAlt /> },
    { id: "rewards", label: "Rewards", icon: <FaCoins /> },
    { id: "scope", label: "Scope & Assets", icon: <FaCode /> },
    { id: "resources", label: "Resources", icon: <FaFileContract /> }
  ];

  return (
    <div className="min-h-screen bg-[#090909] text-white font-poppins">
      {/* Hero Section with Gradient Background */}
      <div 
        className="relative w-full h-[400px] bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 9, 0.3), rgba(9, 9, 9, 0.95)), url('/images/gradient.png')` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090909]/60 to-[#090909]"></div>
        
        {/* Back Button */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">
          <button
            onClick={() => navigate(-1)}
            className="text-white bg-black/40 backdrop-blur-sm px-5 py-2.5 rounded-lg hover:bg-black/60 transition border border-white/10 flex items-center gap-2"
          >
            <span>←</span> Back to Explore
          </button>
        </div>

        {/* Project Header */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-end h-full pb-45">
          <div className="flex items-center gap-6">
            {/* Project Logo/Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#f50090] to-[#9b23ea] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,0,144,0.5)]">
              <FaShieldAlt className="text-5xl text-white" />
            </div>
            
            {/* Project Name & Status */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-2 break-words max-w-2xl">
  {bounty?.name ?? "Unnamed Bounty"}
</h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30 flex items-center gap-1">
                  <FaCheckCircle /> Active
                </span>
                {bounty.features.map((feature, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-[#1c1c1c] border border-[#f50090]/40 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#121212] rounded-xl p-6 border border-[#f50090]/20 hover:border-[#f50090]/40 transition">
                <div className="flex items-center gap-3 mb-2">
                  <FaCoins className="text-2xl text-[#f50090]" />
                  <p className="text-gray-400 text-sm">Maximum Bounty</p>
                </div>
                <p className="text-3xl font-bold text-white">{bounty.metrics.maxBounty}</p>
              </div>
              
              <div className="bg-[#121212] rounded-xl p-6 border border-[#f50090]/20 hover:border-[#f50090]/40 transition">
                <div className="flex items-center gap-3 mb-2">
                  <FaClock className="text-2xl text-blue-400" />
                  <p className="text-gray-400 text-sm">Live Since</p>
                </div>
                <p className="text-3xl font-bold text-white">{bounty.metrics.liveSince}</p>
              </div>
              
              <div className="bg-[#121212] rounded-xl p-6 border border-[#f50090]/20 hover:border-[#f50090]/40 transition">
                <div className="flex items-center gap-3 mb-2">
                  <FaChartLine className="text-2xl text-green-400" />
                  <p className="text-gray-400 text-sm">Last Updated</p>
                </div>
                <p className="text-3xl font-bold text-white">{bounty.metrics.lastUpdated}</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-[#121212] rounded-xl border border-[#f50090]/20 overflow-hidden">
              <div className="flex border-b border-[#f50090]/20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20 text-[#f50090] border-b-2 border-[#f50090]"
                        : "text-gray-400 hover:text-white hover:bg-[#1c1c1c]"
                    }`}
                  >
                    {tab.icon}
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === "information" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <FaShieldAlt className="text-[#f50090]" />
                        Program Overview
                      </h3>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {bounty.description}
                      </p>
                      <p className="text-gray-400 mt-4 leading-relaxed">
                        {bounty.tabs.information}
                      </p>
                    </div>

                    <div className="bg-[#0d0d0d] rounded-lg p-6 border border-[#f50090]/20">
                      <h4 className="text-xl font-semibold mb-4">Tags & Categories</h4>
                      <div className="flex flex-wrap gap-3">
                        {bounty.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-[#1c1c1c] border border-[#f50090]/40 rounded-lg text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "rewards" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FaCoins className="text-[#f50090]" />
                      Reward Tiers
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        { severity: "Critical", amount: bounty.metrics.maxBounty, color: "red" },
                        { severity: "High", amount: "$3,000", color: "orange" },
                        { severity: "Medium", amount: "$1,500", color: "yellow" },
                        { severity: "Low", amount: "$500", color: "blue" }
                      ].map((tier, idx) => (
                        <div 
                          key={idx}
                          className="bg-[#0d0d0d] rounded-lg p-6 border border-[#f50090]/20 hover:border-[#f50090]/40 transition flex justify-between items-center"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full bg-${tier.color}-500`}></div>
                            <div>
                              <p className="text-xl font-bold">{tier.severity}</p>
                              <p className="text-gray-400 text-sm">Severity Level</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-400">{tier.amount}</p>
                            <p className="text-gray-400 text-sm">Maximum Reward</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-[#f50090]/10 to-[#9b23ea]/10 rounded-lg p-6 border border-[#f50090]/30">
                      <p className="text-sm text-gray-300">
                        <strong>Note:</strong> Actual rewards are determined based on the severity and impact of the vulnerability. 
                        All submissions are reviewed by our security team.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "scope" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <FaCode className="text-[#f50090]" />
                        In-Scope Assets
                      </h3>
                      <div className="space-y-3">
                        {bounty.tabs.scope.map((asset, idx) => (
                          <div 
                            key={idx}
                            className="bg-[#0d0d0d] rounded-lg p-5 border border-green-500/30 hover:border-green-500/50 transition"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1" />
                                <div>
                                  <p className="text-lg font-semibold">{asset.name}</p>
                                  <p className="text-gray-400 text-sm mt-1">
                                    Type: <span className="text-white">{asset.type}</span>
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500 bg-[#1c1c1c] px-3 py-1 rounded">
                                Added: {asset.addedOn}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {bounty.tabs.outOfScope && bounty.tabs.outOfScope.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <FaLock className="text-red-400" />
                          Out of Scope
                        </h3>
                        <div className="space-y-3">
                          {bounty.tabs.outOfScope.map((item, idx) => (
                            <div 
                              key={idx}
                              className="bg-[#0d0d0d] rounded-lg p-5 border border-red-500/30"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <p className="text-gray-300">{item}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FaFileContract className="text-[#f50090]" />
                      Documentation & Resources
                    </h3>
                    <div className="space-y-3">
                      {bounty.tabs.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-[#0d0d0d] rounded-lg p-5 border border-[#f50090]/20 hover:border-[#f50090]/50 transition group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaFileContract className="text-[#f50090] text-xl" />
                              <span className="text-lg font-medium group-hover:text-[#f50090] transition">
                                {resource.label}
                              </span>
                            </div>
                            <FaExternalLinkAlt className="text-gray-500 group-hover:text-[#f50090] transition" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Submit Bug Card */}
            <div className="bg-[#121212] rounded-xl p-6 border border-[#f50090]/40 shadow-lg sticky top-6 z-30">
  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Submit a Bug Report</h3>
  <p className="text-gray-300 text-sm mb-6">
    Found a vulnerability? Submit your report and earn rewards for helping secure the protocol.
  </p>
  <button className="w-full bg-gradient-to-r from-[#f50090] to-[#9b23ea] px-6 py-4 rounded-lg hover:opacity-90 transition font-semibold text-lg shadow-lg">
    Submit Bug Report
  </button>
</div>


            {/* Vault Information */}
            {bounty.vault && (
              <div className="bg-[#121212] rounded-xl p-6 border border-[#f50090]/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaLock className="text-[#f50090]" />
                  Vault Information
                </h3>
                <div className="space-y-4">
                  <div className="bg-[#0d0d0d] rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Funds Available</p>
                    <p className="text-2xl font-bold text-green-400">{bounty.vault.fundsAvailable}</p>
                  </div>
                  <div className="bg-[#0d0d0d] rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">30-Day Average</p>
                    <p className="text-xl font-semibold">{bounty.vault.avg30d}</p>
                  </div>
                  <div className="bg-[#0d0d0d] rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Assets in Vault</p>
                    <p className="text-lg font-medium">{bounty.vault.assetsInVault}</p>
                  </div>
                  <div className="bg-[#0d0d0d] rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Vault Address</p>
                    <p className="text-sm font-mono text-[#f50090] break-all">{bounty.vault.vaultAddress}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Program Stats */}
            <div className="bg-[#121212] rounded-xl p-6 border border-[#f50090]/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaUsers className="text-[#f50090]" />
                Program Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#f50090]/10">
                  <span className="text-gray-400">Total Submissions</span>
                  <span className="font-semibold">127</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#f50090]/10">
                  <span className="text-gray-400">Accepted Reports</span>
                  <span className="font-semibold text-green-400">43</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#f50090]/10">
                  <span className="text-gray-400">Total Paid Out</span>
                  <span className="font-semibold text-green-400">$127,500</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Active Researchers</span>
                  <span className="font-semibold">89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default BountyDetails;