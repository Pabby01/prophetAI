'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Loader2 } from 'lucide-react'

// ABI for placeBet (simplified/embedded for MVP)
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
            address: contractAddress as `0x${string}`,
            abi: ABI,
            functionName: 'placeBet',
            args: [marketId, isYes],
            value: parseEther(amount)
        })
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 my-4 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-zinc-100 font-medium text-sm">Prediction Market</h3>
                    <p className="text-zinc-400 text-xs mt-1">{question}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${isYes ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    BET {isYes ? 'YES' : 'NO'}
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Amount (MNT)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-200 text-sm focus:outline-none focus:border-zinc-700"
                    />
                </div>

                <button
                    onClick={handleBet}
                    disabled={isPending || isConfirming || isSuccess}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded py-2 text-sm font-medium transition-colors flex justify-center items-center gap-2"
                >
                    {isPending || isConfirming ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isPending ? 'Check Wallet...' : 'Confirming...'}
                        </>
                    ) : isSuccess ? (
                        'Bet Placed!'
                    ) : (
                        'Place Bet'
                    )}
                </button>

                {error && (
                    <p className="text-red-500 text-xs mt-2">{error.message.split('\n')[0]}</p>
                )}

                {isSuccess && (
                    <p className="text-green-500 text-xs mt-2">
                        Transaction: {hash?.slice(0, 6)}...{hash?.slice(-4)}
                    </p>
                )}
            </div>
        </div>
    )
}
