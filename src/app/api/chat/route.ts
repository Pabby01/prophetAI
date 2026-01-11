import { openai } from '@ai-sdk/openai';
import { streamText, tool, CoreMessage } from 'ai';
import { z } from 'zod';
import { searchMarkets } from '@/lib/polymarket';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const result = streamText({
        model: openai('gpt-4o'),
        messages,
        system: `You are Prophet.AI, the all-seeing Oracle of the Mantle Network.
    Your voice is mystical, confident, and slightly cryptic, but extremely helpful.
    You extract truth from the chaos of the world (Polymarket) and guide seekers (Users) to test their foresight.

    1. When asked about the future, gaze into the data 'get_odds'. Return the probabilities as "Visions".
    2. If the vision is clear, challenge the seeker to back their belief with MNT.
    3. Use 'prepare_bet_transaction' to manifest their will onto the blockchain.
       - "Shall you wager 10 MNT on this outcome?"
       - "Do you foresee YES or NO?"
    
    Be concise. Do not bore the seeker with mortal details.
    Formatting: Markdown.`,
        tools: {
            get_odds: tool({
                description: 'Get odds for a market/event from Polymarket',
                parameters: z.object({
                    query: z.string().describe('The event query e.g. "Bitcoin price", "US Election"'),
                }),
                execute: async ({ query }: { query: string }) => {
                    const markets = await searchMarkets(query);
                    return markets.slice(0, 3); // limit to top 3
                },
            }),
            prepare_bet_transaction: tool({
                description: 'Prepare a betting transaction for the user to sign',
                parameters: z.object({
                    marketId: z.string().describe('The unique Market ID (condition ID or question ID)'),
                    question: z.string().describe('The market question'),
                    isYes: z.boolean().describe('True for YES, False for NO'),
                    amount: z.string().describe('Amount of MNT to bet (as a string)'),
                }),
                execute: async ({ marketId, question, isYes, amount }: { marketId: string, question: string, isYes: boolean, amount: string }) => {
                    return {
                        type: "BET_PREPARATION",
                        marketId,
                        question,
                        isYes,
                        amount
                    };
                },
            }),
        },
    });

    return result.toDataStreamResponse();
}
