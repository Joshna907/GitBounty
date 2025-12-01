import { BUNDLER_URL, PAYMASTER_KEY, PAYMASTER_URL } from "./config";

export const getSmartAccount = async ({ usePaymaster = true } = {}) => {
  if (!window.ethereum) {
    console.error("❌ Wallet not found in window.ethereum");
    alert("MetaMask not detected");
    return null;
  }

  try {
    const { ethers } = await import("ethers");
    const { BiconomySmartAccountV2 } = await import("@biconomy/account");
    const { BiconomyPaymaster } = await import("@biconomy/paymaster");

    // 1️⃣ Create provider & signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    console.log("✅ Signer acquired:", signerAddress);

    // 2️⃣ Setup paymaster safely
    let paymaster;
    if (usePaymaster && PAYMASTER_URL) {
      try {
        paymaster = new BiconomyPaymaster({
          paymasterUrl: PAYMASTER_URL,
          paymasterKey: PAYMASTER_KEY
        });
        console.log("✅ Paymaster attached (auto gas sponsoring if eligible)");
      } catch (pmErr) {
        console.warn("⚠️ Paymaster init failed, proceeding without it", pmErr.message);
      }
    }

    // 3️⃣ Create Smart Account
    const smartAccount = await BiconomySmartAccountV2.create({
      signer,
      chainId: 11155111, // Sepolia
      bundlerUrl: BUNDLER_URL,
      paymaster: paymaster ?? undefined
    });

    const accountAddress = await smartAccount.getAccountAddress();
    console.log("✅ Smart Account Ready:", accountAddress);

    // 4️⃣ Wrap buildUserOp to always apply fallback gas
    const originalBuildUserOp = smartAccount.buildUserOp.bind(smartAccount);
    smartAccount.buildUserOp = async (txs, options = {}) => {
      let userOp = await originalBuildUserOp(txs, options);

      // Fallback gas limits if undefined
      userOp.callGasLimit = userOp.callGasLimit ?? 600_000n;
      userOp.verificationGasLimit = userOp.verificationGasLimit ?? 300_000n;
      userOp.preVerificationGas = userOp.preVerificationGas ?? 80_000n;

      // Safe paymaster data
      if (usePaymaster) {
        try {
          const paymasterData = await smartAccount.getPaymasterAndData({ usePaymaster: true });
          userOp.paymasterAndData = paymasterData ?? "0x";
        } catch (err) {
          console.warn("⚠️ Paymaster fetch failed in UserOp, skipping", err.message);
          userOp.paymasterAndData = "0x";
        }
      }

      return userOp;
    };

    return smartAccount;
  } catch (err) {
    console.error("❌ Smart Account Init Error:", err.message);
    alert("Smart account init failed: " + (err.message || String(err)));
    return null;
  }
};
