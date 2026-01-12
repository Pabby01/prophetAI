'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, LineChart, Settings, User, PlusCircle, MessageSquare, LogOut, ChevronRight, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ConnectWallet } from './ConnectWallet'

const MENU_ITEMS = [
    { icon: Home, label: 'Oracle Chat', href: '/' },
    { icon: LineChart, label: 'Markets', href: '/markets' },
]

export function AppSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    // History is now an object array { id, title, timestamp }
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        const loadHistory = () => {
            const stored = localStorage.getItem('prophet_chats')
            if (stored) {
                setHistory(JSON.parse(stored))
            }
        }
        loadHistory()
        window.addEventListener('storage', loadHistory)
        return () => window.removeEventListener('storage', loadHistory)
    }, [])

    const handleClear = () => {
        localStorage.removeItem('prophet_chats')
        setHistory([])
    }

    const handleHistoryClick = (chatId: string) => {
        window.location.href = `/?c=${chatId}`
    }

    const handleNewChat = () => {
        window.location.href = "/"
    }

    return (
        <div className="flex flex-col h-full bg-black border-r border-zinc-900 w-64 shrink-0 transition-all duration-300">
            {/* Brand */}
            <div className="p-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        ⚡
                    </div>
                    Prophet.AI
                </h1>
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-6">
                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-zinc-900/20 active:scale-95 duration-200"
                >
                    <PlusCircle size={20} />
                    <span>New Prediction</span>
                </button>
            </div>

            {/* Main Nav */}
            <nav className="px-2 space-y-1">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-zinc-900 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'}`}
                        >
                            <item.icon size={20} className={isActive ? 'text-blue-500' : 'text-zinc-600 group-hover:text-zinc-400'} />
                            <span className="font-medium text-sm">{item.label}</span>
                            {isActive && (
                                <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-auto" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Recent Chats Section */}
            <div className="mt-8 px-6 flex-1 overflow-y-auto scrollbar-none">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Recent Visions</h3>
                    {history.length > 0 && (
                        <button onClick={handleClear} className="text-zinc-700 hover:text-red-500 transition-colors">
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>

                <div className="space-y-1">
                    {history.length === 0 ? (
                        <div className="text-xs text-zinc-700 italic">No visions yet...</div>
                    ) : (
                        history.map((chat, i) => (
                            <button
                                key={i}
                                onClick={() => handleHistoryClick(chat.id)}
                                className="nav-item w-full text-left truncate text-sm px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300"
                            >
                                <MessageSquare size={14} className="shrink-0 opacity-50" />
                                <span className="truncate">{chat.title}</span>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Footer User Profile */}
            <div className="mt-auto p-4 border-t border-zinc-900">
                <ConnectWallet />
            </div>
        </div>
    )
}
