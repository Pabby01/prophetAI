import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppSidebar } from '@/components/AppSidebar'
import { MarketTicker } from '@/components/MarketTicker'
import { MobileHeader } from '@/components/MobileNav'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prophet AI | Mantle Prediction Market',
  description: 'The first AI-powered prediction market built on Mantle Network. Trade on future events with proprietary AI insights.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Prophet AI - Predict the Future',
    description: 'Trade on AI-powered prediction markets on Mantle Network.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-zinc-100 flex h-screen overflow-hidden selection:bg-blue-500/30`}>
        <Providers>
          {/* Desktop Sidebar */}
          <div className="hidden md:flex h-full">
            <AppSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-black">
            <MobileHeader />
            <MarketTicker />
            <main className="flex-1 overflow-y-auto w-full relative">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
