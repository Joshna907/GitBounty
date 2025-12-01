import React, { useState } from "react";
import axios from "axios";
import badges from "../badges/badges";
import { Interface, parseEther } from "ethers";
import { getSmartAccount } from "../gasless/smartAccount";
import { CONTRACT_ADDRESS } from "../gasless/config";

export default function CreateBounty() {
  const [issueUrl, setIssueUrl] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [badgeURI, setBadgeURI] = useState("");
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchIssueDetails = async () => {
    const cleanUrl = issueUrl.trim();
    if (!cleanUrl) return;

    try {
      const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
      if (!match) return alert("❌ Invalid issue URL");

      const [, owner, repo, issueNum] = match;
      const githubRes = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/issues/${issueNum}`
      );

      setIssueTitle(githubRes.data.title || "No title");
      setIssueDescription(githubRes.data.body || "No description");
      console.log("✅ Issue fetched from GitHub:", githubRes.data.title);
    } catch (err) {
      console.error("GitHub fetch fail:", err.message);
      alert("❌ GitHub issue fetch failed");
    }
  };

  const handleCreateBounty = async () => {
    if (!issueUrl.trim()) return alert("❌ Enter issue URL");
    if (!rewardAmount || Number(rewardAmount) <= 0) return alert("❌ Enter valid ETH amount");
    if (!badgeURI) return alert("❌ Select a badge");

    setLoading(true);

    try {
      // 1️⃣ Connect MetaMask
      const walletAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const eoa = walletAccounts[0];
      console.log("✅ MetaMask connected:", eoa);

      // 2️⃣ Check network
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0xaa36a7") {
        alert("❌ Switch network in MetaMask to Ethereum Sepolia");
        setLoading(false);
        return;
      }
      console.log("✅ Connected to Ethereum Sepolia");

      // 3️⃣ Initialize Smart Account
      console.log("Initializing Biconomy...");
      const smartAccount = await getSmartAccount({ usePaymaster: true });
      if (!smartAccount) {
        alert("❌ Smart account init failed — check bundler/paymaster");
        setLoading(false);
        return;
      }
      const sender = await smartAccount.getAccountAddress();
      console.log("✅ Sender smart account:", sender);

      // 4️⃣ Encode contract call
      const abi = ["function createBounty(string,string) payable returns(uint256)"];
      const bountyInterface = new Interface(abi);
      const valueWei = parseEther(String(rewardAmount));
      const callData = bountyInterface.encodeFunctionData("createBounty", [issueUrl, badgeURI]);
      const tx = { to: CONTRACT_ADDRESS, data: callData, value: valueWei };

      // 5️⃣ Dry-run
      const provider = new (await import("ethers")).BrowserProvider(window.ethereum);
      const signerForDryRun = await provider.getSigner();
      try {
        await signerForDryRun.call(tx);
        console.log("✅ Dry-run ok");
      } catch (dryErr) {
        console.error("❌ Dry run fail:", dryErr.message);
        alert("❌ Dry run reverted. Check issue URL or contract");
        setLoading(false);
        return;
      }

      // 6️⃣ Build UserOp safely
      console.log("Building UserOp...");
      let userOp;
      try {
        userOp = await smartAccount.buildUserOp([tx]);
        if (!userOp) throw new Error("UserOp undefined from Bundler v3");

        // 🔹 SAFELY set fallback gas
        userOp.callGasLimit = userOp.callGasLimit ?? 600_000n;
        userOp.verificationGasLimit = userOp.verificationGasLimit ?? 300_000n;
        userOp.preVerificationGas = userOp.preVerificationGas ?? 80_000n;

        // 🔹 Attach Paymaster safely
        try {
          const paymasterData = await smartAccount.getPaymasterAndData({ usePaymaster: true });
          userOp.paymasterAndData = paymasterData ?? "0x";
          console.log("✅ Paymaster data attached");
        } catch (pmErr) {
          console.warn("⚠️ Paymaster fetch failed, skipping", pmErr.message);
          userOp.paymasterAndData = "0x";
        }

      } catch (opErr) {
        console.error("❌ UserOp build fail:", opErr.message);

        // 🔹 Fallback: normal on-chain transaction
        const fallbackTx = await signerForDryRun.sendTransaction({
          to: CONTRACT_ADDRESS,
          data: tx.data,
          value: valueWei
        });
        alert("Fallback on-chain tx sent: " + fallbackTx.hash);
        setLoading(false);
        return;
      }

      // 7️⃣ Send UserOp
      console.log("Sending UserOp...");
      const res = await smartAccount.sendUserOp(userOp);
      console.log("🎉 UserOp sent:", res);
      alert("✅ Transaction sent! Hash: " + (res.transactionHash || res.userOpHash));

      // 8️⃣ Clear form
      setIssueUrl("");
      setRewardAmount("");
      setBadgeURI("");

      // 9️⃣ Optional: Save to backend
      try {
        await axios.post("http://localhost:2025/api/bounties/create-bounty", {
          bountyId: res.userOpHash || "",
          issueUrl,
          rewardAmount,
          rewardType: "ETH",
          badgeURI,
          creatorAddress: sender,
          eoa
        });
        console.log("✅ Saved to backend");
      } catch (backendErr) {
        console.warn("⚠️ Backend save failed:", backendErr.message);
      }

    } catch (mainErr) {
      console.error("❌ Unexpected:", mainErr.message);
      alert("❌ Error: " + (mainErr.message || String(mainErr)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-8">Create New Git Bounty</h1>

        <div className="flex gap-4 justify-center mb-10">
          <input
            value={issueUrl}
            onChange={(e) => setIssueUrl(e.target.value)}
            placeholder="GitHub issue link"
            className="w-[60%] px-4 py-3 rounded-xl bg-[#111]/60 border border-cyan-500/30 text-white"
          />
          <button
            onClick={fetchIssueDetails}
            className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 transition"
          >
            Import
          </button>
        </div>

        {issueTitle && (
          <div className="bg-[#111]/60 p-6 rounded-2xl w-[60%] mx-auto mb-10 text-left border border-cyan-500/30">
            <h2 className="text-2xl font-semibold text-cyan-400">{issueTitle}</h2>
            <p className="text-gray-400 mt-2 text-sm max-h-40 overflow-y-auto whitespace-pre-line">
              {issueDescription}
            </p>
          </div>
        )}

        <div className="border border-cyan-500/30 p-8 w-[60%] mx-auto rounded-2xl bg-[#111]/50">
          <h2 className="text-3xl font-bold mb-6">Select Reward Badge</h2>

          <div className="grid grid-cols-4 gap-6 mb-6">
            {badges.map((b, i) => (
              <div
                key={i}
                onClick={() => setBadgeURI(b.url)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  badgeURI === b.url ? "border-cyan-400 scale-105 bg-cyan-400/10" : "border-gray-700"
                }`}
              >
                <img src={b.url} className="w-14 h-14 mx-auto" alt={b.name} />
                <p className="text-center mt-2 text-sm text-gray-300">{b.name}</p>
              </div>
            ))}
          </div>

          <input
            type="number"
            value={rewardAmount}
            onChange={(e) => setRewardAmount(e.target.value)}
            placeholder="ETH amount"
            className="w-full px-4 py-3 rounded-xl bg-[#000]/40 border border-cyan-500/30 text-white mb-4"
            step="0.01"
            min="0"
          />

          <button
            onClick={handleCreateBounty}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xl font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "⏳ Creating..." : "🚀 Create Gasless Bounty"}
          </button>
        </div>
      </div>
    </div>
  );
}
