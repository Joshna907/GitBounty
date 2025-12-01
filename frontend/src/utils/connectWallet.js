import { ethers } from "ethers";

const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum); // FIX
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { signer, address };
};

export default connectWallet;   
