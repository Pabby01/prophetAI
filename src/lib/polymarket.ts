export interface Market {
    id: string;
    question: string;
    outcome: string;
    json_odds: string;
    active: boolean;
    closed: boolean;
    market_slug: string;
    end_date_iso: string;
    volume?: string;
}

// Fallback data in case API fails (Critical for Demo stability)
export const MOCK_MARKETS: Market[] = [
    {
        id: "mock-1",
        question: "Will Bitcoin hit $100k in 2025?",
        outcome: "N/A",
        json_odds: "[0.15, 0.85]",
        active: true,
        closed: false,
        market_slug: "btc-100k-2025",
        end_date_iso: "2025-12-31",
        volume: "$12.5M"
    },
    {
        id: "mock-2",
        question: "Ethereum ETF Approval in May?",
        outcome: "N/A",
        json_odds: "[0.91, 0.09]",
        active: true,
        closed: false,
        market_slug: "eth-etf-may",
        end_date_iso: "2025-05-31",
        volume: "$45.2M"
    },
    {
        id: "mock-3",
        question: "Will Mantle Airdrop Season 2 happen?",
        outcome: "N/A",
        json_odds: "[0.88, 0.12]",
        active: true,
        closed: false,
        market_slug: "mantle-airdrop-s2",
        end_date_iso: "2025-06-30",
        volume: "$2.1M"
    },
    {
        id: "mock-4",
        question: "Fed Interest Rate Cut > 50bps?",
        outcome: "N/A",
        json_odds: "[0.33, 0.67]",
        active: true,
        closed: false,
        market_slug: "fed-cut-50bps",
        end_date_iso: "2025-09-20",
        volume: "$105M"
    },
    {
        id: "mock-5",
        question: "GTA 6 Release Date Announced?",
        outcome: "N/A",
        json_odds: "[0.60, 0.40]",
        active: true,
        closed: false,
        market_slug: "gta-6-announce",
        end_date_iso: "2025-11-15",
        volume: "$8.4M"
    },
    {
        id: "mock-6",
        question: "SpaceX Starship reaches orbit?",
        outcome: "N/A",
        json_odds: "[0.95, 0.05]",
        active: true,
        closed: false,
        market_slug: "spacex-orbit",
        end_date_iso: "2025-04-20",
        volume: "$15.1M"
    }
];

export async function searchMarkets(query: string): Promise<Market[]> {
    try {
        let data;

        // SERVER-SIDE CHECK (Node Environment)
        if (typeof window === 'undefined') {
            const baseUrl = `https://gamma-api.polymarket.com/events`;
            const params = `limit=20&active=true&closed=false&sort=volume&order=desc&q=${encodeURIComponent(query)}`;

            console.log(`Fetching: ${baseUrl}?${params}`);

            let response = await fetch(`${baseUrl}?${params}`, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProphetAI/1.0)' }
            });

            // Retry with simple query if 422 (often caused by sorting issues on low data)
            if (response.status === 422) {
                console.warn("422 Error with Sort. Retrying simple query...");
                const simpleParams = `limit=10&active=true&closed=false&q=${encodeURIComponent(query)}`;
                response = await fetch(`${baseUrl}?${simpleParams}`, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProphetAI/1.0)' }
                });
            }

            if (!response.ok) throw new Error(`Polymarket API Error: ${response.status}`);
            data = await response.json();
        }
        // CLIENT-SIDE: Use Proxy
        else {
            const response = await fetch(`/api/markets?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Proxy API Error");
            data = await response.json();
        }

        if (!Array.isArray(data)) {
            console.warn("Invalid API Data Format");
            return MOCK_MARKETS;
        }

        const markets = data.map((event: any) => {
            const market = event.markets?.[0];
            if (!market) return null;

            return {
                id: market.id,
                question: market.question,
                outcome: "N/A",
                json_odds: JSON.stringify(market.outcomePrices),
                active: market.active,
                closed: market.closed,
                market_slug: market.slug,
                end_date_iso: market.endDate,
                volume: event.volume ? `$${(Number(event.volume) / 1000000).toFixed(1)}M` : 'N/A'
            };
        }).filter(Boolean) as Market[]; // Explicit cast to remove nulls type-check

        return markets.length > 0 ? markets : MOCK_MARKETS;

    } catch (error) {
        console.error("Error fetching markets, using fallback", error);
        return MOCK_MARKETS;
    }
}

export async function getTrendingMarkets(): Promise<Market[]> {
    // For MVP, we search for "2025" or generic term to get a mix of good markets
    return searchMarkets("2025");
}

export async function getMarketDetails(conditionId: string) {
    return { id: conditionId };
}
