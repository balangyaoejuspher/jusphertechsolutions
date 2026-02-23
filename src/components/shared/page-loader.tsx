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
]

export function PageLoader({ message }: { message?: string }) {
    const [msgIndex, setMsgIndex] = useState(0)

    useEffect(() => {
        if (message) return // don't cycle if custom message provided
        const interval = setInterval(() => {
            setMsgIndex((i) => (i + 1) % loadingMessages.length)
        }, 1800)
        return () => clearInterval(interval)
    }, [message])

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-zinc-950">

            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white dark:from-zinc-950/0 dark:via-zinc-950/0 dark:to-zinc-950 pointer-events-none" />

            {/* Amber glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col items-center gap-6">

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

                {/* Cycling message */}
                <p
                    key={msgIndex}
                    className="text-xs text-zinc-400 dark:text-zinc-600 font-medium animate-fade-in"
                >
                    {message ?? loadingMessages[msgIndex]}
                </p>
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