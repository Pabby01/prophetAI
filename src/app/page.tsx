'use client'

import { ChatInterface } from '@/components/ChatInterface'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ChatWrapper() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q')
  return <ChatInterface initialPrompt={q || undefined} />
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-full">
      <Suspense fallback={<div className="text-zinc-500 text-sm">Loading Oracle...</div>}>
        <ChatWrapper />
      </Suspense>
    </div>
  )
}
