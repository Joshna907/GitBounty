import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying contracts with:", deployer.address);


  // 1️⃣ Deploy Badge contract
  const GitBountyBadges = await hre.ethers.getContractFactory("GitBountyBadge");
  const badges = await GitBountyBadges.deploy();
  await badges.waitForDeployment();
  const badgeAddress = await badges.getAddress();
  console.log("✅ GitBountyBadges deployed at:", badgeAddress);

  // 2️⃣ Deploy Token contract
  const GitBountyToken = await hre.ethers.getContractFactory("GitBountyToken");
  const token = await GitBountyToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ GitBountyToken deployed at:", tokenAddress);


  // 3️⃣ Deploy Main BountyDispenserGasless contract
  const BountyDispenserGasless = await hre.ethers.getContractFactory("BountyDispenserGasless");
  const dispenser = await BountyDispenserGasless.deploy(
    deployer.address,                              // admin
    "0x0000000000000000000000000000000000000000", // trusted forwarder (for now)
    badgeAddress,                                 // badge address
    tokenAddress                                  // token address
  );
  await dispenser.waitForDeployment();
  const dispenserAddress = await dispenser.getAddress();
  console.log("✅ BountyDispenserGasless deployed at:", dispenserAddress);

  // 4️⃣ Transfer ownership of Badge contract to main contract
  const transferTx = await badges.transferOwnership(dispenserAddress);
  await transferTx.wait();
  console.log("🔑 Ownership of GitBountyBadges transferred to:", dispenserAddress);

  // 5️⃣ Mint some tokens to the admin/deployer
  const mintAmount = hre.ethers.parseUnits("10000", 18);
  const mintTx = await token.mint(deployer.address, mintAmount);
  await mintTx.wait();
  console.log(`💰 Minted ${hre.ethers.formatUnits(mintAmount, 18)} tokens to admin.`);


  // 6️⃣ Approve the main contract to spend tokens
  const approveAmount = hre.ethers.parseUnits("5000", 18);
  const approveTx = await token.approve(dispenserAddress, approveAmount);
  await approveTx.wait();
  console.log(`✅ Approved ${hre.ethers.formatUnits(approveAmount, 18)} tokens for the main contract.`);


  // ✅ Done
  console.log("\n🎉 All contracts deployed and configured successfully!");
  console.log("GitBountyBadge:", badgeAddress);
  console.log("GitBountyToken:", tokenAddress);
  console.log("BountyDispenserGasless:", dispenserAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 

