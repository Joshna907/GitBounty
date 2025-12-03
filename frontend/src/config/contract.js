import { ethers } from "ethers";
import contractFile from  "../contractABI/BountyDispenserGasless.json";


const CONTRACT_ADDRESS = "0xd1EF81d6e2fC6f9958E03948688784cB2f14DaF9";

const getContract = async (signer) => {
  const abi = contractFile.abi; // ✅ Correct ABI extraction
  console.log("Final ABI:", abi); // debugging

  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

export default getContract;
