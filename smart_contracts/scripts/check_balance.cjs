const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("-----------------------------------------");
    console.log("🔍 Checking Balance for Account:");
    console.log(`Address: ${deployer.address}`);

    const provider = hre.ethers.provider;
    const balance = await provider.getBalance(deployer.address);

    console.log(`Balance: ${hre.ethers.formatEther(balance)} MNT`);

    const network = await provider.getNetwork();
    console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);
    console.log("-----------------------------------------");

    if (balance.toString() === "0") {
        console.log("❌ ERROR: Balance is strictly 0.");
        console.log("Please send MNT Testnet tokens to the address above.");
    } else {
        console.log("✅ Balance found. Try deploying again.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
