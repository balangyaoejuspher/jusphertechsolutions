"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedNumberProps {
    value: number | string | null
    prefix?: string
    suffix?: string
    decimals?: number
    duration?: number
    fallback?: string
}

export function AnimatedNumber({
    value,
    prefix = "",
    suffix = "",
    decimals = 0,
    duration = 1400,
    fallback = "—",
}: AnimatedNumberProps) {
    const [display, setDisplay] = useState<number>(0)
    const rafRef = useRef<number | null>(null)

    useEffect(() => {
        if (typeof value !== "number") return
        if (value === 0) { setDisplay(0); return }

        const startTime = performance.now()
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

        const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1)
            setDisplay(easeOutCubic(progress) * value)
            if (progress < 1) rafRef.current = requestAnimationFrame(animate)
            else setDisplay(value)
        }

        rafRef.current = requestAnimationFrame(animate)
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    }, [value, duration])

    if (value === null) {
        return <span className="text-zinc-300 dark:text-zinc-700 animate-pulse">{fallback}</span>
    }

    if (typeof value === "string") return <>{prefix}{value}{suffix}</>

    const formatted = decimals > 0
        ? display.toFixed(decimals)
        : Math.round(display).toLocaleString()

    return <>{prefix}{formatted}{suffix}</>
}