
export interface Market {
    id: string;
    question: string;
    outcome: string;
    json_odds: string;
    active: boolean;
    closed: boolean;
    market_slug: string;
    end_date_iso: string;
}

export async function searchMarkets(query: string): Promise<Market[]> {
    try {
        // CLOB API or Gamma API. Using Gamma API usually better for reading. 
        // Example endpoint (simplified): https://gamma-api.polymarket.com/events?q=...
        // Or CLOB: https://clob.polymarket.com/markets

        // For Hackathon/Simple MVP, we can use a mock or a specific endpoint.
        // Let's use the Gamma API which is public.
        const response = await fetch(`https://gamma-api.polymarket.com/events?limit=5&q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            console.error("Polymarket API error");
            return [];
        }

        const data = await response.json();

        // Mapping complex gamma structure to simple Market
        return data.map((event: any) => {
            // Gamma events have multiple markets. We take the first one or the main one.
            const market = event.markets?.[0];
            if (!market) return null;

            return {
                id: market.id,
                question: market.question,
                outcome: "N/A", // Not needed for search
                json_odds: JSON.stringify(market.outcomePrices),
                active: market.active,
                closed: market.closed,
                market_slug: market.slug,
                end_date_iso: market.endDate
            };
        }).filter(Boolean);

    } catch (error) {
        console.error("Error fetching markets", error);
        return [];
    }
}

export async function getMarketDetails(conditionId: string) {
    // fetching specific market details
    // For MVP, we might rely on the AI using searchMarkets mostly.
    return { id: conditionId };
}
