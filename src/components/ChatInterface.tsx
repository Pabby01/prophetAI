'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect } from 'react'
import { BettingCard } from './BettingCard'
import { Loader2, Send, Cpu, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
        <div className="flex flex-col h-[700px] w-full max-w-3xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/10 blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <Cpu size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-zinc-100 flex items-center gap-2">
                            Prophet.AI
                            <Sparkles size={12} className="text-yellow-500 animate-pulse" />
                        </h2>
                        <p className="text-xs text-zinc-500">Mantle Sepolia Oracle</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-500 font-mono">ONLINE</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent relative z-0">
                <AnimatePresence initial={false}>
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-zinc-500 mt-32"
                        >
                            <div className="mb-6 flex justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-900/20 to-zinc-900 border border-zinc-800 flex items-center justify-center"
                                >
                                    <Cpu size={40} className="text-blue-500/50" />
                                </motion.div>
                            </div>
                            <p className="mb-4 text-zinc-400 font-medium">I see all futures. Ask, and I shall reveal.</p>
                            <div className="flex gap-2 justify-center text-xs flex-wrap">
                                {["Will Bitcoin hit $100k?", "Who wins the US Election?", "Mantle Price Prediction"].map((q, i) => (
                                    <button
                                        key={i}
                                        className="px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 hover:text-zinc-200 transition-colors rounded-full border border-zinc-800 text-zinc-500"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-lg ${m.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-900/20'
                                    : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-none shadow-zinc-900/50'
                                }`}>
                                {m.content && <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>}

                                {m.toolInvocations?.map((toolInvocation) => {
                                    const { toolName, toolCallId, state } = toolInvocation

                                    if (state === 'result') {
                                        if (toolName === 'get_odds') {
                                            const markets = toolInvocation.result
                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    key={toolCallId}
                                                    className="mt-4 space-y-2"
                                                >
                                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Vision Detected</p>
                                                    {markets.map((market: any, idx: number) => (
                                                        <div key={market.id || idx} className="bg-zinc-950/50 border border-zinc-800 p-3 rounded-lg flex justify-between items-center group hover:border-zinc-700 transition-colors cursor-default">
                                                            <span className="text-xs text-zinc-300 font-medium">{market.question || "Unknown Market"}</span>
                                                            <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">
                                                                Odds Loading...
                                                            </span>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )
                                        }

                                        if (toolName === 'prepare_bet_transaction') {
                                            const { marketId, question, isYes, amount } = toolInvocation.result
                                            return (
                                                <div key={toolCallId} className="mt-4">
                                                    <BettingCard
                                                        marketId={marketId}
                                                        question={question}
                                                        isYes={isYes}
                                                        suggestedAmount={amount}
                                                        contractAddress={CONTRACT_ADDRESS as `0x${string}`}
                                                    />
                                                </div>
                                            )
                                        }
                                    }
                                    return (
                                        <div key={toolCallId} className="mt-2 text-xs text-zinc-500 flex items-center gap-2 animate-pulse">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Divining {toolName}...
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-900 rounded-2xl rounded-bl-none px-4 py-3 border border-zinc-800 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                                <span className="text-xs text-zinc-500 animate-pulse">Thinking...</span>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-950 z-10">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <input
                        className="relative w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:ring-0 placeholder:text-zinc-600 shadow-xl"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask the Oracle..."
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-3 top-3 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all hover:scale-105 active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    )
}
