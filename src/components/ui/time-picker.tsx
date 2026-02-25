"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Clock, ChevronUp, ChevronDown, X } from "lucide-react"

type TimePickerProps = {
    value?: string   // "HH:MM" 24h
    onChange: (val: string) => void
    placeholder?: string
    className?: string
}

const pad = (n: number) => String(n).padStart(2, "0")

const parseTime = (val?: string) => {
    if (!val) return { hour: 8, minute: 0, period: "AM" as "AM" | "PM" }
    const [h, m] = val.split(":").map(Number)
    return {
        hour: h > 12 ? h - 12 : h === 0 ? 12 : h,
        minute: m,
        period: (h >= 12 ? "PM" : "AM") as "AM" | "PM",
    }
}

const toDisplay = (val?: string) => {
    if (!val) return ""
    const { hour, minute, period } = parseTime(val)
    return `${pad(hour)}:${pad(minute)} ${period}`
}

const to24h = (hour: number, minute: number, period: "AM" | "PM") => {
    let h = hour
    if (period === "AM" && hour === 12) h = 0
    if (period === "PM" && hour !== 12) h = hour + 12
    return `${pad(h)}:${pad(minute)}`
}

const PRESETS = [
    { label: "9:00 AM", value: "09:00" },
    { label: "10:00 AM", value: "10:00" },
    { label: "11:00 AM", value: "11:00" },
    { label: "12:00 PM", value: "12:00" },
    { label: "1:00 PM", value: "13:00" },
    { label: "2:00 PM", value: "14:00" },
    { label: "3:00 PM", value: "15:00" },
    { label: "4:00 PM", value: "16:00" },
    { label: "5:00 PM", value: "17:00" },
    { label: "6:00 PM", value: "18:00" },
]

const MINUTE_STEPS = [0, 15, 30, 45]

function Spinner({
    value,
    min,
    max,
    onUp,
    onDown,
    display,
}: {
    value: number
    min: number
    max: number
    onUp: () => void
    onDown: () => void
    display: string
}) {
    return (
        <div className="flex flex-col items-center gap-0.5">
            <button
                type="button"
                onClick={onUp}
                className="w-8 h-6 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
                <ChevronUp size={14} />
            </button>
            <div className="w-12 h-9 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white font-bold text-lg tabular-nums">
                {display}
            </div>
            <button
                type="button"
                onClick={onDown}
                className="w-8 h-6 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
                <ChevronDown size={14} />
            </button>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────

export function TimePicker({ value, onChange, placeholder = "Pick a time", className }: TimePickerProps) {
    const parsed = parseTime(value)
    const [open, setOpen] = useState(false)
    const [hour, setHour] = useState(parsed.hour)
    const [minute, setMinute] = useState(parsed.minute)
    const [period, setPeriod] = useState<"AM" | "PM">(parsed.period)

    const ref = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    // Sync state when value changes externally
    useEffect(() => {
        if (value) {
            const p = parseTime(value)
            setHour(p.hour)
            setMinute(p.minute)
            setPeriod(p.period)
        }
    }, [value])

    const emit = (h: number, m: number, p: "AM" | "PM") => {
        onChange(to24h(h, m, p))
    }

    const upHour = () => { const h = hour >= 12 ? 1 : hour + 1; setHour(h); emit(h, minute, period) }
    const downHour = () => { const h = hour <= 1 ? 12 : hour - 1; setHour(h); emit(h, minute, period) }
    const upMin = () => { const m = minute >= 45 ? 0 : minute + 15; setMinute(m); emit(hour, m, period) }
    const downMin = () => { const m = minute <= 0 ? 45 : minute - 15; setMinute(m); emit(hour, m, period) }

    const togglePeriod = () => {
        const p = period === "AM" ? "PM" : "AM"
        setPeriod(p)
        emit(hour, minute, p)
    }

    const handlePreset = (val: string) => {
        const p = parseTime(val)
        setHour(p.hour)
        setMinute(p.minute)
        setPeriod(p.period)
        onChange(val)
        setOpen(false)
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange("")
    }

    return (
        <div ref={ref} className={cn("relative", className)}>

            {/* Trigger */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
                className={cn(
                    "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl",
                    "border border-zinc-200 dark:border-white/10",
                    "bg-zinc-50 dark:bg-white/5",
                    "text-sm transition-all outline-none cursor-pointer select-none",
                    "hover:border-zinc-300 dark:hover:border-white/20",
                    open && "border-amber-400 dark:border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.12)]",
                )}
            >
                <div className="flex items-center gap-2.5">
                    <Clock size={14} className={cn("shrink-0 transition-colors", value ? "text-amber-500" : "text-zinc-400")} />
                    <span className={cn(
                        value ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-400 dark:text-zinc-600"
                    )}>
                        {value ? toDisplay(value) : placeholder}
                    </span>
                </div>
                {value && (
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={handleClear}
                        onKeyDown={(e) => e.key === "Enter" && handleClear(e as any)}
                        className="w-5 h-5 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <X size={12} />
                    </div>
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className={cn(
                    "absolute z-50 top-full mt-2 left-0 w-64",
                    "rounded-2xl overflow-hidden",
                    "bg-white dark:bg-zinc-900",
                    "border border-zinc-200 dark:border-white/10",
                    "shadow-xl shadow-zinc-200/60 dark:shadow-black/40",
                    "animate-in fade-in-0 zoom-in-95 duration-150",
                )}>

                    {/* Spinner row */}
                    <div className="flex items-center justify-center gap-3 p-4 border-b border-zinc-100 dark:border-white/5">
                        <Spinner
                            value={hour}
                            min={1} max={12}
                            onUp={upHour} onDown={downHour}
                            display={pad(hour)}
                        />

                        <span className="text-2xl font-bold text-zinc-300 dark:text-zinc-600 pb-0.5">:</span>

                        <Spinner
                            value={minute}
                            min={0} max={45}
                            onUp={upMin} onDown={downMin}
                            display={pad(minute)}
                        />

                        {/* AM/PM toggle */}
                        <div className="flex flex-col gap-1 ml-1">
                            {(["AM", "PM"] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => { setPeriod(p); emit(hour, minute, p) }}
                                    className={cn(
                                        "w-10 h-[42px] rounded-xl text-xs font-bold transition-all",
                                        period === p
                                            ? "bg-amber-400 text-zinc-950"
                                            : "bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-white/10"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="p-2">
                        <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-2 mb-1.5">
                            Quick Select
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                            {PRESETS.map((p) => (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => handlePreset(p.value)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left",
                                        value === p.value
                                            ? "bg-amber-400 text-zinc-950"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}