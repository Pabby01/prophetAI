'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const MOCK_DATA = [
    { pair: "BTC > $100k", prob: "12%" },
    { pair: "ETH > $4k", prob: "45%" },
    { pair: "Mantle Airdrop", prob: "88%" },
    { pair: "Fed Rate Cut", prob: "3%" },
    { pair: "US Election", prob: "Resolved" },
    { pair: "Solana ETF", prob: "22%" },
    { pair: "Trump Tweet", prob: "99%" },
]

export function MarketTicker() {
    return (
        <div className="w-full bg-zinc-950 border-b border-zinc-800 overflow-hidden py-2 flex items-center relative z-20">
            <div className="flex absolute left-0 bg-gradient-to-r from-zinc-950 to-transparent w-12 h-full z-10" />
            <div className="flex absolute right-0 bg-gradient-to-l from-zinc-950 to-transparent w-12 h-full z-10" />

            <motion.div
                className="flex gap-8 whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    duration: 30,
                    ease: "linear"
                }}
            >
                {[...MOCK_DATA, ...MOCK_DATA, ...MOCK_DATA].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                        <span className="text-zinc-500">{item.pair}:</span>
                        <span className={item.prob === "Resolved" ? "text-blue-400" : "text-green-400"}>
                            {item.prob}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
