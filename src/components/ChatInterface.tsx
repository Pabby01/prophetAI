'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect } from 'react'
import { BettingCard } from './BettingCard'
import { Loader2, Send, Cpu } from 'lucide-react'

// Environment variable for contract address or fallback
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROPHET_MARKET_ADDRESS || "0x0000000000000000000000000000000000000000"

export function ChatInterface() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
    })
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Cpu size={18} />
                </div>
                <div>
                    <h2 className="font-semibold text-zinc-100">Prophet.AI</h2>
                    <p className="text-xs text-zinc-500">Mantle Sepolia Agent</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="text-center text-zinc-500 mt-20">
                        <p className="mb-2">Ask me anything about future events.</p>
                        <div className="flex gap-2 justify-center text-xs">
                            <span className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">Bitcoin Price?</span>
                            <span className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">US Elections?</span>
                        </div>
                    </div>
                )}

                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-none'
                            }`}>
                            {m.content && <div className="whitespace-pre-wrap text-sm">{m.content}</div>}

                            {/* Tool Invocations Display */}
                            {m.toolInvocations?.map((toolInvocation) => {
                                const { toolName, toolCallId, state } = toolInvocation

                                if (state === 'result') {
                                    if (toolName === 'get_odds') {
                                        const markets = toolInvocation.result
                                        return (
                                            <div key={toolCallId} className="mt-3 space-y-2">
                                                <p className="text-xs text-zinc-500 font-medium">Found Markets:</p>
                                                {markets.map((market: any) => (
                                                    <div key={market.id} className="bg-zinc-950 border border-zinc-800 p-2 rounded text-xs text-zinc-300">
                                                        {market.question}
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }

                                    if (toolName === 'prepare_bet_transaction') {
                                        const { marketId, question, isYes, amount } = toolInvocation.result
                                        return (
                                            <BettingCard
                                                key={toolCallId}
                                                marketId={marketId}
                                                question={question}
                                                isYes={isYes}
                                                suggestedAmount={amount}
                                                contractAddress={CONTRACT_ADDRESS as `0x${string}`}
                                            />
                                        )
                                    }
                                }
                                return (
                                    <div key={toolCallId} className="mt-2 text-xs text-zinc-500 flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Using {toolName}...
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-900 rounded-2xl rounded-bl-none px-4 py-3 border border-zinc-800">
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-950">
                <div className="relative">
                    <input
                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder:text-zinc-600"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Will ETH hit $3k this month?"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    )
}
