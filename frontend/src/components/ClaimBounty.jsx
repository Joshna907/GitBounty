import { useState } from "react";
import { ethers } from "ethers";

if (typeof window !== "undefined") window.process = { env: {} };

export default function ClaimBounty() {
  const [status, setStatus] = useState("");

  // ✅ Your Biconomy config
  const BUNDLER_URL =
    "https://bundler.biconomy.io/api/v3/11155111/bundler_UTQLKEAPXgbLQ8z8oQdriw";
  const PAYMASTER_URL =
    "https://paymaster.biconomy.io/api/v2/11155111/UOeBu1gX3.96675185-9413-4efa-a501-882be6d6d382";
  const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
  const CONTRACT_ADDRESS = "0x372f671bd08083fa11020c8465f29c0d17981ee6"; // ✅ deployed contract

  const handleClaim = async () => {
    try {
      if (!window.ethereum) {
        setStatus("❌ MetaMask not installed!");
        return;
      }

      // 🟢 Step 1: Connect wallet
      setStatus("🔄 Connecting MetaMask...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log("👤 Connected:", userAddress);

      // 🟢 Step 2: Validate contract
      if (!ethers.isAddress(CONTRACT_ADDRESS)) {
        setStatus("❌ Invalid CONTRACT_ADDRESS format!");
        return;
      }

      // 🟢 Step 3: Initialize Biconomy Smart Account
      const { createSmartAccountClient, PaymasterMode } = await import("@biconomy/account");

      const smartAccount = await createSmartAccountClient({
        signer,
        chainId: 11155111, // Sepolia
        bundlerUrl: BUNDLER_URL,
        rpcUrl: RPC_URL,
        biconomyPaymaster: { paymasterUrl: PAYMASTER_URL },
      });

      setStatus("🧠 Smart Account initialized!");

      // 🟢 Step 4: Encode your contract call
      // ⬇️ Replace 'claimBounty(uint256)' with your real function name from Solidity
      const iface = new ethers.Interface(["function claimBounty(uint256 _bountyId)"]);
      const bountyId = 1; // 👈 Example bounty ID to claim
      const txData = iface.encodeFunctionData("claimBounty", [bountyId]);

      // 🟢 Step 5: Build transaction object
      const transaction = {
        transactions: [
          {
            to: CONTRACT_ADDRESS,
            data: txData,
            value: 0n,
            gasLimit: 250000n,
          },
        ],
      };

      console.log("📦 Transaction:", transaction);

      // 🟢 Step 6: Send gasless transaction
      setStatus("🚀 Sending gasless transaction...");
      const userOpResponse = await smartAccount.sendTransaction(transaction, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      const txHash =
        userOpResponse?.transactionHash ||
        userOpResponse?.userOpHash ||
        "pending...";

      console.log("✅ Response:", userOpResponse);
      setStatus(`✅ Gasless Tx Sent! Hash: ${txHash}`);
    } catch (err) {
      console.error("Error:", err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🚀 Claim Bounty (Gasless)</h2>
      <button
        onClick={handleClaim}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Claim
      </button>
      <p style={{ marginTop: "20px", fontWeight: "bold" }}>{status}</p>
    </div>
  );
}
