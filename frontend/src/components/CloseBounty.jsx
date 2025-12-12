import React, { useState } from "react";
import { ethers } from "ethers";
import { FaTimes, FaWallet } from "react-icons/fa";

const CONTRACT_ADDRESS = "0xd1EF81d6e2fC6f9958E03948688784cB2f14DaF9";

export default function CloseBounty({ bountyId, creatorAddressProp, onClose }) {
  const [loading, setLoading] = useState(false);
  const [creatorAddress, setCreatorAddress] = useState(creatorAddressProp || "");
  const [txHash, setTxHash] = useState("");

  const handleCloseBounty = async () => {
    if (!bountyId) return alert("Bounty ID not provided");
    if (!window.ethereum) return alert("Please install MetaMask");

    setLoading(true);
    try {
      // Connect wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const sender = await signer.getAddress();
      setCreatorAddress(sender);

      // Minimal ABI
      const bountyInterface = new ethers.Interface([
        "function closeBounty(uint256 bountyId) returns (bool)",
        "event BountyClosed(uint256 indexed id, address indexed closer)"
      ]);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, bountyInterface, signer);

      // Call closeBounty
      const tx = await contract.closeBounty(bountyId);
      const receipt = await tx.wait();

      setTxHash(receipt.transactionHash);

      alert("Bounty closed successfully!");
      if (onClose) onClose(); // Optional callback
    } catch (err) {
      console.error("Close Bounty Error:", err);
      alert(err?.data?.message || err?.message || "Failed to close bounty");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-[#0d0d0d] p-6 rounded-2xl border border-[#f50090]/20 shadow-[0_0_20px_rgba(245,0,144,0.3)]">
      <div className="flex items-center gap-2 text-gray-400">
        <FaWallet className="text-[#f50090]" />
        <span>Creator: {creatorAddress || "Not connected…"}</span>
      </div>

      <button
        onClick={handleCloseBounty}
        disabled={loading}
        className="mt-4 w-full py-3 bg-gradient-to-r from-[#f50090] to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition shadow-[0_0_15px_rgba(245,0,144,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <FaTimes /> {loading ? "Closing..." : "Close Bounty"}
      </button>

      {txHash && (
        <p className="text-green-400 text-sm mt-2 break-all">
          Transaction: {txHash}
        </p>
      )}
    </div>
  );
}
