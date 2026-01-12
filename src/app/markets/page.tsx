'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, ArrowRight } from 'lucide-react'

// Mock Data for the Hackathon Demo
// Ideally this comes from the Polymarket API we built in lib/polymarket.ts
const TRENDING_MARKETS = [
    { title: "Bitcoin > $100k in 2025?", volume: "$12.4M", chance: "12%", color: "text-green-500" },
    { title: "Mantle Token Airdrop announced?", volume: "$2.1M", chance: "88%", color: "text-blue-500" },
    { title: "Fed cuts rates in May?", volume: "$45M", chance: "75%", color: "text-purple-500" },
    { title: "GTA 6 Release Date?", volume: "$5M", chance: "33%", color: "text-orange-500" },
    { title: "Ethereum ETF Approval?", volume: "$18M", chance: "91%", color: "text-blue-400" },
    { title: "SpaceX Starship Launch Success?", volume: "$800k", chance: "60%", color: "text-red-500" },
]

export default function MarketsPage() {
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-zinc-100 mb-2">Market Explorer</h1>
                <p className="text-zinc-500">Discover trending prediction events on Mantle Network.</p>
            </div>

            {/* Featured Card */}
            <div className="mb-12 relative group rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors z-0" />
                <div className="absolute top-0 right-0 p-32 bg-blue-500/20 blur-[100px]" />

                <div className="relative z-10 p-8 md:p-12 border border-blue-500/30 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4 text-blue-400 font-bold uppercase tracking-widest text-xs">
                        <TrendingUp size={14} /> Featured Event
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-3xl">Will Mantle flip Solana in Total Value Locked (TVL) by 2026?</h2>

                    <div className="flex flex-wrap gap-6 mb-8 text-sm text-zinc-300">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-zinc-500" />
                            <span>24,192 Traders</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-zinc-500" />
                            <span>Ends Dec 31, 2025</span>
                        </div>
                    </div>

                    <button className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                        Predict Now <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TRENDING_MARKETS.map((market, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 p-6 rounded-xl cursor-pointer group transition-all hover:bg-zinc-900"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`text-2xl font-bold ${market.color}`}>{market.chance}</div>
                            <div className="text-xs text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                                Vol: {market.volume}
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors mb-4 line-clamp-2">
                            {market.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-zinc-500 mt-auto pt-4 border-t border-zinc-800/50">
                            <span>Polymarket</span>
                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
