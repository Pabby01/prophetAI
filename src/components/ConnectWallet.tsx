'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState, useEffect } from 'react'
import { Loader2, Wallet, LogOut } from 'lucide-react'
import { formatUnits } from 'viem'

export function ConnectWallet() {
    const { address, isConnected, chain } = useAccount()
    const { connect, isPending } = useConnect()
    const { disconnect } = useDisconnect()
    const { data: balance } = useBalance({ address })
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    if (isConnected && address) {
        // Safely format balance. Default to 18 decimals if missing.
        const formattedBalance = balance ? formatUnits(balance.value, balance.decimals) : '0'

        return (
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end text-right">
                    <span className="text-xs text-zinc-400 font-medium">Connected to {chain?.name}</span>
                    <span className="text-xs text-zinc-500 font-mono">{formattedBalance.slice(0, 6)} {balance?.symbol}</span>
                </div>

                <button
                    onClick={() => disconnect()}
                    className="group relative flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-red-900/50 hover:bg-red-950/20 text-zinc-300 px-4 py-2 rounded-full transition-all"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 group-hover:bg-red-500 transition-colors" />
                    <span className="text-xs font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
                    <LogOut size={14} className="opacity-0 group-hover:opacity-100 absolute right-4 transition-opacity text-red-500" />
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => connect({ connector: injected() })}
            disabled={isPending}
            className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-zinc-900/20 flex items-center gap-2 hover:scale-105 active:scale-95"
        >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
            {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>
    )
}
