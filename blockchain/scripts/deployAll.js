import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying contracts with:", deployer.address);

  // 1️⃣ Deploy Badge contract
  const BadgeFactory = await hre.ethers.getContractFactory("GitBountyBadge");
  const badgeContract = await BadgeFactory.deploy();
  await badgeContract.waitForDeployment();
  const badgeAddress = await badgeContract.getAddress();
  console.log("✅ GitBountyBadge deployed at:", badgeAddress);

  // 2️⃣ Deploy BountyDispenserGasless contract (ETH-only)
  const BountyFactory = await hre.ethers.getContractFactory("BountyDispenserGasless");
  const bountyContract = await BountyFactory.deploy(badgeAddress);

  await bountyContract.waitForDeployment();
  const bountyAddress = await bountyContract.getAddress();
  console.log("✅ BountyDispenserGasless deployed at:", bountyAddress);

  // 3️⃣ Transfer Badge ownership → Bounty contract
  const tx = await badgeContract.transferOwnership(bountyAddress);
  await tx.wait();
  console.log("🔑 Badge ownership transferred to:", bountyAddress);

  console.log("\n🎉 Deployment complete!");
  console.log("GitBountyBadge:", badgeAddress);
  console.log("BountyDispenserGasless:", bountyAddress);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
