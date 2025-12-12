const ethers = require("ethers");
require("dotenv").config();

// Using Ethers v5 syntax
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const contractAddress = process.env.CONTRACT_ADDRESS;

// 1. Load the *full* JSON artifact into a unique temporary variable name
const contractArtifact = require("../../frontend/src/contractABI/BountyDispenserGasless.json");

// 2. Extract only the 'abi' array from the artifact using a new 'const' declaration
const contractABI = contractArtifact.abi;

// Initialize the contract
const contract = new ethers.Contract(
    contractAddress,
    contractABI, // This is now correctly an array
    provider
);

module.exports = contract;