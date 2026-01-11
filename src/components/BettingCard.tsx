'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button' // If we had shadcn, but we'll use raw for now to save time

const ABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "marketId", "type": "string" },
            { "internalType": "bool", "name": "isYes", "type": "bool" }
        ],
        "name": "placeBet",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
] as const

interface BettingCardProps {
    marketId: string
    question: string
    isYes: boolean
    suggestedAmount: string
    contractAddress: `0x${string}`
}

export function BettingCard({ marketId, question, isYes, suggestedAmount, contractAddress }: BettingCardProps) {
    const [amount, setAmount] = useState(suggestedAmount)
    const { data: hash, writeContract, isPending, error } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const handleBet = async () => {
        if (!amount || !contractAddress) return

        writeContract({
            address: contractAddress,
            abi: ABI,
            functionName: 'placeBet',
            args: [marketId, isYes],
            value: parseEther(amount)
        })
    }

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative group"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />

            <div className="p-5">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h3 className="text-zinc-100 font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            Prediction Contract
                        </h3>
                        <p className="text-zinc-400 text-xs mt-1.5 leading-snug">{question}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-inner ${isYes ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                        {isYes ? 'YES' : 'NO'} POSITION
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 block">Wager Amount (MNT)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-500 text-sm">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-zinc-200 text-lg font-mono focus:outline-none focus:ring-0 placeholder:text-zinc-700"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleBet}
                        disabled={isPending || isConfirming || isSuccess}
                        className={`w-full relative overflow-hidden group/btn ${isSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-500'} disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg py-3 text-sm font-bold transition-all shadow-lg active:scale-[0.98]`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isPending || isConfirming ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isPending ? 'Confirm in Wallet' : 'Mining Transaction...'}
                                </>
                            ) : isSuccess ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Bet Confirmed
                                </>
                            ) : (
                                'Place Wager'
                            )}
                        </span>
                        {!isSuccess && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />}
                    </button>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                className="flex items-start gap-2 text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/20"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>{error.message.split('\n')[0]}</p>
                            </motion.div>
                        )}

                        {isSuccess && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                className="flex items-center gap-2 text-green-400 text-xs bg-green-500/10 p-2 rounded border border-green-500/20"
                            >
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <a
                                    href={`https://explorer.sepolia.mantle.xyz/tx/${hash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline"
                                >
                                    View on Explorer
                                </a>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}
