'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, LineChart, Settings, User, PlusCircle, MessageSquare, LogOut, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const MENU_ITEMS = [
    { icon: Home, label: 'Oracle Chat', href: '/' },
    { icon: LineChart, label: 'Markets', href: '/markets' },
    //   { icon: User, label: 'Profile', href: '/profile' }, // Future
    //   { icon: Settings, label: 'Settings', href: '/settings' }, // Future
]

const RECENT_CHATS = [
    "Bitcoin Prediction May 2025",
    "US Election Odds",
    "Mantle Ecosystem Growth",
    "Ethereum ETF Approval",
]

export function AppSidebar() {
    const pathname = usePathname()
    const [activeChat, setActiveChat] = useState(0)

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
                <button className="w-full flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-zinc-900/20 active:scale-95 duration-200">
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
            <div className="mt-8 px-6">
                <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-4">Recent Visions</h3>
                <div className="space-y-1">
                    {RECENT_CHATS.map((chat, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveChat(i)}
                            className={`nav-item w-full text-left truncate text-sm px-2 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeChat === i ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'}`}
                        >
                            <MessageSquare size={14} className="shrink-0 opacity-50" />
                            <span className="truncate">{chat}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer User Profile */}
            <div className="mt-auto p-4 border-t border-zinc-900">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/50 cursor-pointer transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">Hacker User</p>
                        <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
                    </div>
                    <Settings size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
            </div>
        </div>
    )
}
