const hre = require("hardhat");

async function main() {

  const GameToken = await hre.ethers.getContractFactory("GameToken");


  const game = await GameToken.deploy();
  await game.waitForDeployment();

  
  console.log(`Game token deployed to ${game.target}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
