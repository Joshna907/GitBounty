
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaExternalLinkAlt,
  FaClock,
  FaCodeBranch,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xd1EF81d6e2fC6f9958E03948688784cB2f14DaF9";

const CONTRACT_ABI = [
  "function handleClaim(uint256 _id, address claimant, bool approve, string calldata msgForDev) external",
  "function bounties(uint256) view returns (uint256 id, address creator, uint256 rewardAmount, string githubIssueUrl, bool isOpen, string badgeURI, address winner)"
];

export default function HandleClaim() {
  const { bountyId, devAddress } = useParams();
  const navigate = useNavigate();

  const [bounty, setBounty] = useState(null);
  const [claim, setClaim] = useState(null);
  const [onChainBounty, setOnChainBounty] = useState(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [messageFromCreator, setMessageFromCreator] = useState("");
  const [winnerUsername, setWinnerUsername] = useState("");
  const [error, setError] = useState(null);

  const [prFiles, setPrFiles] = useState([]);
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState(null);

  // ------------------ Utils ------------------
  const shortAddress = (addr) =>
    addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "N/A";

  const parsePullRequest = (url) => {
    if (!url) return null;
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2], prNumber: match[3] };
  };

  // ------------------ Fetch PR Files ------------------
  useEffect(() => {
    if (!claim?.submissionLink) return;

    const pr = parsePullRequest(claim.submissionLink);
    if (!pr) {
      setCodeError("Submission link is not a valid GitHub Pull Request");
      return;
    }

    const fetchPRFiles = async () => {
      setCodeLoading(true);
      try {
        const res = await fetch(
          `https://api.github.com/repos/${pr.owner}/${pr.repo}/pulls/${pr.prNumber}/files`
        );
        if (!res.ok) throw new Error();
        setPrFiles(await res.json());
      } catch {
        setCodeError("Unable to load code preview from GitHub");
      } finally {
        setCodeLoading(false);
      }
    };

    fetchPRFiles();
  }, [claim]);

  // ------------------ Load Claim ------------------
  useEffect(() => {
    if (!bountyId || !devAddress) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:2025/api/bounties/claim/${bountyId}/${devAddress}`
        );
        if (res.data?.success) {
          setBounty(res.data.bounty);
          setClaim(res.data.claim);
        } else {
          setError("Unable to load claim");
        }
      } catch (err) {
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bountyId, devAddress]);

  // ------------------ Approve ------------------
  const approveClaim = async () => {
    setActionLoading(true);
    setError(null);

    try {
      if (!window.ethereum) throw new Error("MetaMask not found");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = (await signer.getAddress()).toLowerCase();

      if (
        bounty?.creatorAddress &&
        bounty.creatorAddress.toLowerCase() !== userAddress
      ) {
        const ok = window.confirm(
          "Connected wallet is not the bounty creator. Continue?"
        );
        if (!ok) return;
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const chainBountyId = Number(bountyId);
      const bountyOnChain = await contract.bounties(chainBountyId);
      setOnChainBounty(bountyOnChain);

      // ✅ CORRECT VALIDATION
      if (!bountyOnChain.isOpen) {
        alert("This bounty is already closed");
        return;
      }

      if (bountyOnChain.rewardAmount === 0n) {
        alert("Reward already paid");
        return;
      }

      const tx = await contract.handleClaim(
        chainBountyId,
        devAddress,
        true,
        messageFromCreator || "Approved"
      );

      const receipt = await tx.wait();

      const backendRes = await axios.patch(
        `http://localhost:2025/api/bounties/${bountyId}/handle-claim`,
        {
          developerAddress: devAddress,
          approve: true,
          messageFromCreator: messageFromCreator || "Well done!",
          winnerUsername: winnerUsername || null,
          txHash: receipt.hash,
          timestamp: Math.floor(Date.now() / 1000),
        }
      );

      if (backendRes.data?.success) {
        setClaim({ ...claim, status: "APPROVED" });
        alert("Claim approved 🎉");
      }
      setMessageFromCreator("");
      setWinnerUsername("");
      navigate("/creator-dash")

    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ------------------ Reject ------------------
  const rejectClaim = async () => {
    if (!window.confirm("Reject this claim?")) return;

    setActionLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const chainBountyId = Number(bountyId);
      const bountyOnChain = await contract.bounties(chainBountyId);
      setOnChainBounty(bountyOnChain);

      if (!bountyOnChain.isOpen) {
        alert("Bounty already closed");
        return;
      }

      const tx = await contract.handleClaim(
        chainBountyId,
        devAddress,
        false,
        messageFromCreator || "Rejected"
      );

      const receipt = await tx.wait();

      await axios.patch(
        `http://localhost:2025/api/bounties/${bountyId}/handle-claim`,
        {
          developerAddress: devAddress,
          approve: false,
          messageFromCreator: messageFromCreator || "Rejected",
          txHash: receipt.hash,
          timestamp: Math.floor(Date.now() / 1000),
        }
      );

      setClaim({ ...claim, status: "REJECT" });
      alert("Claim rejected ❌");

      setMessageFromCreator("");
      setWinnerUsername("");
      navigate("/creator-dash");
      
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };


  return (
    <div className="flex bg-[#090909] text-white min-h-screen">
        <div className="p-33 pb-36">
          {/* HEADER */}
          <div
            className="w-full bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20 rounded-2xl p-6 mb-6
                          border border-[#f50090]/30 shadow-[0_0_40px_rgba(245,0,144,0.3)]"
          >
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#f50090] to-[#ca8ff1] bg-clip-text text-transparent">
              ⚡ Finalize This Claim
            </h2>
            <p className="text-lg text-gray-300 mt-2 font-medium">
              Verify the submission and reward the deserving developer.
            </p>
          </div>

          {/* GRID LAYOUT */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* LEFT SIDE */}
            <div className="space-y-10">
              {/* BOUNTY OVERVIEW */}
              <div
                className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-3xl
                            border border-[#f50090]/30
                            shadow-[0_0_35px_rgba(245,0,144,0.32)]"
              >
                <h2 className="text-2xl font-bold text-[#f50090] mb-4">🧩 Bounty Overview</h2>

                <div className="text-gray-300 text-[17px] space-y-2">
                  <p>
                    <span className="text-gray-500">Project:</span> {bounty?.projectName}
                  </p>

                  <p>
                    <span className="text-gray-500">Issue:</span> {bounty?.issueTitle}
                  </p>

                  <p>
                    <span className="text-gray-500">Reward:</span> {bounty?.rewardAmount} ETH
                  </p>

                  <p>
                    <span className="text-gray-500">Language:</span> {bounty?.language}
                  </p>

                  <p>
                    <span className="text-gray-500">Deadline:</span> {bounty?.deadline}
                  </p>

                  <span className="px-4 py-1.5 rounded-full bg-[#00ff8c]/20 text-[#00ff8c] text-sm">
                    {bounty?.status || "Active Bounty"}
                  </span>
                </div>
              </div>

              {/* CLAIM SUMMARY */}
              <div
                className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-3xl
                            border border-[#ca8ff1]/40
                            shadow-[0_0_35px_rgba(202,143,241,0.35)]"
              >
                <h2 className="text-2xl font-bold text-[#ca8ff1] mb-5">📌 Claim Summary</h2>

                <div className="space-y-4 text-gray-300 text-[17px]">
                  {/* Developer Address */}
                  <div className="flex items-center gap-3">
                    <FaUser className="text-[#f50090] text-xl" />
                    {shortAddress(claim?.developerAddress)} (Developer)
                  </div>

                  {/* Submission Proof Link */}
                  <div className="flex items-center gap-3">
                    <FiLink className="text-purple-300 text-xl" />
                    <a
                      href={claim?.submissionLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#ca8ff1] underline flex items-center gap-2 hover:text-[#f50090]"
                    >
                      View Proof <FaExternalLinkAlt className="text-sm" />
                    </a>
                  </div>

                  {/* Notes */}
                  <p className="text-gray-400">
                    <span className="font-semibold text-gray-300">Notes:</span>
                    <br />
                    {claim?.notes || "No notes provided."}
                  </p>

                  {/* Submitted Date */}
                  <p className="flex items-center gap-2 text-gray-400">
                    <FaClock />
                    Submitted on:{" "}
                    {claim?.createdAt ? new Date(claim.createdAt).toLocaleString() : "Unknown"}
                  </p>

                  {/* Status */}
                  <span className="px-4 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
                  {claim?.status || "IN_REVIEW"}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="xl:col-span-2 space-y-10">
              {/* DEVELOPER NOTES */}
              <div
                className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-3xl
                            border border-[#f50090]/30
                            shadow-[0_0_40px_rgba(245,0,144,0.32)]"
              >
                <h2 className="text-2xl font-bold text-[#f50090] mb-3">📝 Developer Notes</h2>

                <p className="text-gray-300 leading-relaxed text-[16px]">
                  {claim?.notes || "No additional notes provided by developer."}
                </p>
              </div>

              {/* CODE PREVIEW */}
            <div
              className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-3xl
                          border border-[#ca8ff1]/30
                          shadow-[0_0_40px_rgba(202,143,241,0.4)]"
            >
              <h2 className="text-2xl font-bold text-[#ca8ff1] mb-4 flex items-center gap-2">
                <FaCodeBranch /> Code Preview
              </h2>

              {codeLoading && (
                <p className="text-gray-400">Loading code changes from GitHub…</p>
              )}

              {codeError && (
                <p className="text-red-400">{codeError}</p>
              )}

              {!codeLoading && !codeError && prFiles.length === 0 && (
                <p className="text-gray-400">No code changes found in this pull request.</p>
              )}

              {!codeLoading &&
                !codeError &&
                prFiles.map((file) => (
                  <div key={file.filename} className="mb-6">
                    {/* File name */}
                    <p className="text-[#f50090] font-semibold mb-2">
                      {file.filename}
                    </p>

                    {/* Code diff */}
                    <pre
                      className="bg-black/50 border border-white/10 p-5 rounded-xl 
                                text-gray-200 text-sm overflow-x-auto whitespace-pre-wrap"
                    >
                      {file.patch || "Binary file or diff not available"}
                    </pre>
                  </div>
                ))}
            </div>


              {/* REVIEW NOTES */}
              <div
                className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-3xl
                            border border-[#f50090]/25"
              >
                <h2 className="text-xl font-semibold mb-4 text-[#f50090]">✍️ Review Notes</h2>

                <textarea
                  value={messageFromCreator}
                  onChange={(e) => setMessageFromCreator(e.target.value)}
                  className="w-full h-48 bg-[#0a0a0a]/80 border border-[#f50090]/30 rounded-xl 
                           p-4 text-white text-lg outline-none focus:ring-2 focus:ring-[#f50090]/40"
                  placeholder="Add comments or feedback... (this will be stored in backend and optionally sent on-chain)"
                ></textarea>

                {/* optional winner username */}
                <div className="mt-3 flex gap-3 items-center">
                  <input
                    value={winnerUsername}
                    onChange={(e) => setWinnerUsername(e.target.value)}
                    className="bg-[#0a0a0a]/80 border border-[#ca8ff1]/30 rounded-lg p-2 text-white w-64"
                    placeholder="Winner username (optional)"
                  />
                  <span className="text-gray-400 text-sm">Add winner username to store in DB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BAR */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/90 
                      backdrop-blur-2xl border-t border-[#f50090]/40 py-3 px-10 
                      flex justify-between items-center
                      shadow-[0_0_45px_rgba(245,0,144,0.5)]"
        >
          <p className="text-gray-300 text-lg">
            <span className="font-semibold text-white">Reward on Approval:</span>{" "}
            {bounty?.rewardAmount} ETH
          </p>

          <div className="flex gap-6">
            <button
              onClick={approveClaim}
              disabled={
                actionLoading ||
                claim?.status === "APPROVED" ||
                claim?.status === "REJECT"
              }
              className={`px-5 py-2 rounded-xl ${
                actionLoading ? "opacity-60 cursor-not-allowed" : "bg-[#f50090] hover:bg-[#c90074]"
              } text-white font-semibold shadow-[0_0_20px_rgba(245,0,144,0.4)] transition-all flex items-center gap-2`}
            >
              <FaCheck /> {actionLoading ? "Processing..." : "Approve"}
            </button>

            <button
              onClick={rejectClaim}
                disabled={
                  actionLoading ||
                  claim?.status === "APPROVED" ||
                  claim?.status === "REJECT"
                }
              className={`px-5 py-2 rounded-xl ${
                actionLoading ? "opacity-60 cursor-not-allowed" : "bg-[#9b23ea] hover:bg-[#7b1cc0]"
              } text-white font-semibold shadow-[0_0_20px_rgba(155,35,234,0.4)] transition-all flex items-center gap-2`}
            >
              <FaTimes /> {actionLoading ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
    </div>
  );
}
