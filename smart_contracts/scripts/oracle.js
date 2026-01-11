const hre = require("hardhat");

async function main() {
    const contractAddress = process.env.NEXT_PUBLIC_PROPHET_MARKET_ADDRESS;
    if (!contractAddress) {
        console.error("Please set NEXT_PUBLIC_PROPHET_MARKET_ADDRESS in .env");
        return;
    }

    console.log("🔮 Prophet Oracle starting...");
    console.log(`Connecting to ProphetMarket at ${contractAddress}`);

    const ProphetMarket = await hre.ethers.getContractFactory("ProphetMarket");
    const prophetMarket = ProphetMarket.attach(contractAddress);

    // Poll every 30 seconds
    setInterval(async () => {
        try {
            console.log("Scanning for unresolved markets...");
            // In a real production app, we would query the Graph or filtered events.
            // For MVP, we'll iterate a known list or just simulate checking the latest created markets
            // Since we don't have a getter for all market IDs, we'd rely on an off-chain DB or events.

            // MVP Hack: We will just check a specific market if passed as arg, or just listen for events?
            // Better MVP Hack: The script listens for 'MarketCreated' events and adds them to a tracking list.

            // Let's implement EVENT LISTENING.

        } catch (e) {
            console.error("Polling error:", e);
        }
    }, 30000);

    // Listener
    console.log("Listening for MarketCreated events...");
    prophetMarket.on("MarketCreated", async (id, question, event) => {
        console.log(`New Market Detected: [${id}] ${question}`);
        checkAndResolve(prophetMarket, id, question);
    });
}

async function checkAndResolve(contract, marketId, question) {
    console.log(`Checking Polymarket for: ${question}`);

    // Simulate Polymarket API check (since we can't easily import TS lib here)
    // We'll fetch the public Gamma API directly using fetch
    try {
        const response = await fetch(`https://gamma-api.polymarket.com/events?q=${encodeURIComponent(question)}`);
        const data = await response.json();
        const market = data[0]?.markets?.[0];

        if (market && market.closed) {
            console.log(`Market [${marketId}] is CLOSED. Outcome: ${market.outcome}`);
            // Assuming outcome is "Yes" or "No" or similar
            // Polymarket outcomes can be complex. We'll simplify for MVP.
            // If outcomePrices for "Yes" is 1, then Yes won.

            // Simple Logic: if price > 0.95 assume Yes won, if < 0.05 assume No won.
            // Or rely on 'market.winner' field if available? 
            // Gamma API doesn't always show winner clearly in list.

            // Let's assume user inputs clearly in Chat `get_odds` and we can resolve.
            // For the automated script, we'll just log "Ready to Resolve" for the MVP demo
            // To actually resolve, we need the Private Key to send tx.

            // REAL HACKATHON WIN:
            // Actually resolve it if we are sure.
            const isYes = market.outcome === "1" || market.outcome === "Yes";

            // Call resolveMarket
            // await contract.resolveMarket(marketId, isYes);
            // console.log("Market resolved on-chain!");
        } else {
            console.log(`Market [${marketId}] still active.`);
        }
    } catch (error) {
        console.error("Error checking Polymarket:", error.message);
    }
}

// We need to keep process alive
// main(); 
// Hardhat scripts need to handle async
main().catch((error) => {
    console.error(error);
    // process.exitCode = 1; // Don't exit, keep listening
});
