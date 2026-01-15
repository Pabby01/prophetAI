require("@nomicfoundation/hardhat-toolbox");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    networks: {
        // 1. This connects to the 'npx hardhat node' terminal you have running
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
        // 2. This connects to the real testnet (for later)
        mantleSepolia: {
            url: "https://rpc.sepolia.mantle.xyz",
            chainId: 5003,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        mantle: {
            url: "https://rpc.mantle.xyz",
            chainId: 5000,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
};