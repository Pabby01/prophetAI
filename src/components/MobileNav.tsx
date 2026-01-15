'use client'

import { Menu, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppSidebar } from './AppSidebar'
import Link from 'next/link'

export function MobileHeader() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-zinc-900 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Prophet AI" className="w-8 h-8 rounded-lg" />
                    <span className="font-bold text-zinc-100">Prophet AI</span>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-zinc-400 hover:text-white"
                >
                    <Menu />
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-black border-r border-zinc-900 z-50 md:hidden overflow-y-auto"
                        >
                            <AppSidebar />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-zinc-500"
                            >
                                ✕
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
