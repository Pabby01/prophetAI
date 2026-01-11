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
        system: `You are Prophet.AI, a prediction market assistant.
    Your goal is to help users find markets on Polymarket and place bets on them via the ProphetMarket contract on Mantle.
    
    1. When user asks about an event, use 'get_odds' to find relevant Polymarket data.
    2. Display the odds and ask if they want to bet.
    3. If they want to bet, use 'prepare_bet_transaction' to generate the betting UI.
       - Ask how much MNT they want to bet if not specified.
       - Ask if they are betting YES or NO.
    
    Be concise and helpful. formatting: Markdown.`,
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
