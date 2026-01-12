'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/config/wagmi'
import { ChatInterface } from '@/components/ChatInterface'
import { useState } from 'react'

export default function Home() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* Main Chat Container */}
        <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-full">

          {/* Header for Chat Context - optional */}
          <div className="w-full max-w-3xl mb-4 md:mb-8 flex justify-center">
            <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-full px-6 py-2 text-xs text-zinc-400 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Connecting to Mantle Sepolia Network
            </div>
          </div>

          <ChatInterface />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
