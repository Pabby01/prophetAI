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
const MOCK_MARKETS: Market[] = [
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
        // Use our internal proxy to avoid CORS
        const response = await fetch(`/api/markets?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            console.warn("API Error, utilizing fallback data");
            return MOCK_MARKETS;
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("Empty Data, utilizing fallback data");
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
