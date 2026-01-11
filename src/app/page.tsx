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
        <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 md:p-24 selection:bg-blue-500/30">
          <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-zinc-800 bg-black/50 backdrop-blur-2xl pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-zinc-900/50 lg:p-4 lg:dark:bg-zinc-800/30">
              Get started by connecting your Mantle Sepolia wallet
            </p>
          </div>

          <ChatInterface />

        </main>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
