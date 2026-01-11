'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/config/wagmi'
import { ChatInterface } from '@/components/ChatInterface'
import { MarketTicker } from '@/components/MarketTicker'
import { useState } from 'react'

export default function Home() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <main className="flex min-h-screen flex-col bg-black selection:bg-blue-500/30">
          <MarketTicker />

          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 relative overflow-hidden">
            {/* bg grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
              <p className="fixed bottom-4 left-1/2 -translate-x-1/2 flex w-max justify-center border border-zinc-800 bg-zinc-950/80 backdrop-blur-2xl rounded-full px-4 py-2 text-zinc-500 text-xs shadow-xl">
                Connected to Mantle Sepolia
              </p>
            </div>

            <ChatInterface />
          </div>
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
