const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const ProphetMarket = await hre.ethers.getContractFactory("ProphetMarket");
    const prophetMarket = await ProphetMarket.deploy();

    await prophetMarket.waitForDeployment();

    console.log("ProphetMarket deployed to:", await prophetMarket.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
