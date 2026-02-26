"use client"

import { siteConfig } from "@/config/site"
import Image from "next/image"
import { useEffect, useState } from "react"

const loadingMessages = [
    "Setting up your workspace...",
    "Checking your access...",
    "Loading your dashboard...",
    "Almost there...",
    "Preparing your portal...",
    "Fetching your data...",
    "Syncing your account...",
    "Verifying permissions...",
    "Connecting to services...",
    "Organizing your content...",
    "Loading team members...",
    "Retrieving recent activity...",
    "Applying your preferences...",
    "Initializing modules...",
    "Just a moment...",
]

export function PageLoader({ message, ready = false }: { message?: string; ready?: boolean }) {
    const [msgIndex, setMsgIndex] = useState(0)
    const [fade, setFade] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (message) return
        const interval = setInterval(() => {
            setFade(false)
            setTimeout(() => {
                setMsgIndex((i) => (i + 1) % loadingMessages.length)
                setFade(true)
            }, 300)
        }, 2200)
        return () => clearInterval(interval)
    }, [message])

    useEffect(() => {
        const steps = [15, 28, 42, 55, 67, 74, 83, 90]
        let i = 0
        const interval = setInterval(() => {
            if (i < steps.length) {
                setProgress(steps[i])
                i++
            } else {
                clearInterval(interval)
            }
        }, 600)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (ready) setProgress(100)
    }, [ready])

    const displayMessage = message ?? loadingMessages[msgIndex]

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-zinc-950">

            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white dark:from-zinc-950/0 dark:via-zinc-950/0 dark:to-zinc-950 pointer-events-none" />

            {/* Amber glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col items-center gap-6 px-6 max-w-sm w-full">

                {/* Logo with pulse ring */}
                <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping" />
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 flex items-center justify-center">
                        <Image
                            src="/icon.svg"
                            alt={siteConfig.fullName}
                            width={36}
                            height={36}
                            className="w-9 h-9 object-contain"
                        />
                    </div>
                </div>

                {/* Brand */}
                <div className="flex flex-col items-center gap-1">
                    <span className="text-base font-black text-zinc-900 dark:text-white tracking-tight">
                        {siteConfig.name.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-500 dark:text-amber-400/70 tracking-[0.25em] uppercase">
                        {siteConfig.slogan}
                    </span>
                </div>

                {/* Animated dots loader */}
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-amber-400"
                            style={{
                                animation: "bounce 1.2s ease-in-out infinite",
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Message */}
                <div className="text-center min-h-[48px] flex flex-col items-center justify-center gap-1.5">
                    <p
                        className="text-sm font-medium text-zinc-600 dark:text-zinc-400 transition-opacity duration-300"
                        style={{ opacity: fade ? 1 : 0 }}
                    >
                        {displayMessage}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600">
                        This will only take a moment
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-full">
                    <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-right text-[10px] text-zinc-400 dark:text-zinc-600 mt-1.5 tabular-nums">
                        {progress}%
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30%            { transform: translateY(-6px); opacity: 1; }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    )
}