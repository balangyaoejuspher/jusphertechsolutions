"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function MouseFlashlight() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [enabled, setEnabled] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const outerRef = useRef<HTMLDivElement>(null)
    const innerRef = useRef<HTMLDivElement>(null)
    const coreRef = useRef<HTMLDivElement>(null)
    const posRef = useRef({ x: -999, y: -999 })
    const rafRef = useRef<number | null>(null)
    const toastRef = useRef<NodeJS.Timeout | null>(null)
    const [showHint, setShowHint] = useState(false)
    const hintShownRef = useRef(false)

    useEffect(() => {
        if (!mounted || resolvedTheme !== "dark") return
        if (hintShownRef.current) return

        hintShownRef.current = true
        setShowHint(true)
        const t = setTimeout(() => setShowHint(false), 4000)
        return () => clearTimeout(t)
    }, [mounted, resolvedTheme])

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (!mounted) return
        const onDblClick = () => {
            setEnabled((prev) => {
                const next = !prev
                setShowToast(true)
                if (toastRef.current) clearTimeout(toastRef.current)
                toastRef.current = setTimeout(() => setShowToast(false), 1800)
                return next
            })
        }
        window.addEventListener("dblclick", onDblClick)
        return () => {
            window.removeEventListener("dblclick", onDblClick)
            if (toastRef.current) clearTimeout(toastRef.current)
        }
    }, [mounted])

    useEffect(() => {
        if (!mounted || resolvedTheme !== "dark") return
        const outer = outerRef.current
        const inner = innerRef.current
        const core = coreRef.current
        if (!outer || !inner || !core) return

        const onMove = (e: MouseEvent) => {
            posRef.current = { x: e.clientX, y: e.clientY }
        }

        const tick = () => {
            const { x, y } = posRef.current
            const t = "translate(-50%, -50%)"
            if (outer) { outer.style.left = `${x}px`; outer.style.top = `${y}px`; outer.style.transform = t }
            if (inner) { inner.style.left = `${x}px`; inner.style.top = `${y}px`; inner.style.transform = t }
            if (core) { core.style.left = `${x}px`; core.style.top = `${y}px`; core.style.transform = t }
            rafRef.current = requestAnimationFrame(tick)
        }

        window.addEventListener("mousemove", onMove)
        rafRef.current = requestAnimationFrame(tick)

        return () => {
            window.removeEventListener("mousemove", onMove)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [mounted, resolvedTheme])

    // Don't render anything until client is mounted and theme is dark
    if (!mounted || resolvedTheme !== "dark") return null

    return (
        <>
            <div ref={outerRef} aria-hidden="true" className="pointer-events-none fixed z-[9990] rounded-full transition-opacity duration-500"
                style={{ width: 700, height: 700, left: -999, top: -999, opacity: enabled ? 1 : 0, background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(251,191,36,0.04) 30%, transparent 70%)", mixBlendMode: "screen", willChange: "left, top" }}
            />
            <div ref={innerRef} aria-hidden="true" className="pointer-events-none fixed z-[9991] rounded-full transition-opacity duration-500"
                style={{ width: 320, height: 320, left: -999, top: -999, opacity: enabled ? 1 : 0, background: "radial-gradient(circle, rgba(255,255,255,0.13) 0%, rgba(255,248,220,0.10) 35%, rgba(251,191,36,0.05) 60%, transparent 80%)", mixBlendMode: "screen", willChange: "left, top" }}
            />
            <div ref={coreRef} aria-hidden="true" className="pointer-events-none fixed z-[9992] rounded-full transition-opacity duration-500"
                style={{ width: 120, height: 120, left: -999, top: -999, opacity: enabled ? 1 : 0, background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,248,220,0.12) 50%, transparent 80%)", mixBlendMode: "screen", willChange: "left, top" }}
            />

            {/* One-time hint on mount */}
            <div aria-live="polite" className={cn(
                "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]",
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl",
                "bg-zinc-900 border border-white/10 shadow-xl shadow-black/40",
                "text-xs font-semibold text-white transition-all duration-300",
                showHint && !showToast
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
            )}>
                <span className="text-base">🔦</span>
                Double-click anywhere to turn on the flashlight
                <span className="text-zinc-600 font-normal">· dark mode only</span>
            </div>

            {/* Toggle feedback toast */}
            <div aria-live="polite" className={cn(
                "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]",
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl",
                "bg-zinc-900 border border-white/10 shadow-xl shadow-black/40",
                "text-xs font-semibold text-white transition-all duration-300",
                showToast
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
            )}>
                <span className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                    enabled ? "bg-amber-400" : "bg-zinc-600"
                )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", enabled ? "bg-zinc-950" : "bg-zinc-400")} />
                </span>
                Flashlight {enabled ? "on" : "off"}
                <span className="text-zinc-600 font-normal ml-1">· double-click to toggle</span>
            </div>
        </>
    )
}