const https = require('https');

// Simpler params as per retry logic
const url = "https://gamma-api.polymarket.com/events?limit=10&active=true&closed=false&q=crypto";

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Status Code:", res.statusCode);
        try {
            const json = JSON.parse(data);
            if (Array.isArray(json) && json.length > 0) {
                const firstEvent = json[0];
                console.log("Event Title:", firstEvent.title);
                if (firstEvent.markets && firstEvent.markets.length > 0) {
                    const market = firstEvent.markets[0];
                    console.log("Market ID:", market.id);
                    console.log("Question:", market.question);
                    console.log("OutcomePrices:", JSON.stringify(market.outcomePrices));
                } else {
                    console.log("No markets in event");
                }
            } else {
                console.log("Response is not an array or empty. First 100 chars:", data.substring(0, 100));
            }
        } catch (e) {
            console.error("Parse Error:", e);
        }
    });
}).on('error', err => {
    console.error("Request Error:", err);
});
