import { ethers } from "ethers";
import contractFile from  "../contractABI/BountyDispenserGasless.json";


const CONTRACT_ADDRESS = "0xb27A99E4f86fd3342f213Ff41582b16Fa686A154";

const getContract = async (signer) => {
  const abi = contractFile.abi; // ✅ Correct ABI extraction
  console.log("Final ABI:", abi); // debugging

  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

export default getContract;
