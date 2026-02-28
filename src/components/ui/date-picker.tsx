"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react"

type DatePickerProps = {
    value?: string          // ISO string "YYYY-MM-DD"
    onChange: (val: string) => void
    placeholder?: string
    label?: string
    minDate?: Date
    maxDate?: Date
    className?: string
    disabled?: boolean
    dropdownAlign?: "left" | "right"
}

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
]

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

const parseDate = (val?: string): Date | null => {
    if (!val) return null
    const d = new Date(val + "T00:00:00")
    return isNaN(d.getTime()) ? null : d
}

const toISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

const formatDisplay = (val?: string): string => {
    const d = parseDate(val)
    if (!d) return ""
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate()

const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay()

export function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
    label,
    minDate,
    maxDate,
    className,
    disabled = false,
    dropdownAlign
}: DatePickerProps) {
    const today = new Date()
    const selected = parseDate(value)

    const [open, setOpen] = useState(false)
    const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear())
    const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth())
    const [hovered, setHovered] = useState<number | null>(null)
    const [yearPicker, setYearPicker] = useState(false)

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
                setYearPicker(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    useEffect(() => {
        if (selected) {
            setViewYear(selected.getFullYear())
            setViewMonth(selected.getMonth())
        }
    }, [value])

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
        else setViewMonth((m) => m - 1)
    }

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
        else setViewMonth((m) => m + 1)
    }

    const handleSelect = (day: number) => {
        const d = new Date(viewYear, viewMonth, day)
        onChange(toISO(d))
        setOpen(false)
        setYearPicker(false)
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange("")
    }

    const isSelected = (day: number) => {
        if (!selected) return false
        return selected.getFullYear() === viewYear &&
            selected.getMonth() === viewMonth &&
            selected.getDate() === day
    }

    const isToday = (day: number) =>
        today.getFullYear() === viewYear &&
        today.getMonth() === viewMonth &&
        today.getDate() === day

    const isDisabled = (day: number) => {
        const d = new Date(viewYear, viewMonth, day)
        if (minDate && d < minDate) return true
        if (maxDate && d > maxDate) return true
        return false
    }

    const daysInMonth = getDaysInMonth(viewYear, viewMonth)
    const firstDaySlot = getFirstDayOfMonth(viewYear, viewMonth)

    const yearStart = Math.floor(viewYear / 12) * 12
    const years = Array.from({ length: 12 }, (_, i) => yearStart + i)

    return (
        <div ref={ref} className={cn("relative", className)}>
            <div
                role="button"
                tabIndex={0}
                onClick={() => !disabled && setOpen((o) => !o)}
                onKeyDown={(e) => !disabled && e.key === "Enter" && setOpen((o) => !o)}
                className={cn(
                    "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl",
                    "border border-zinc-200 dark:border-white/10",
                    "bg-zinc-50 dark:bg-white/5",
                    "text-sm transition-all outline-none cursor-pointer select-none",
                    "hover:border-zinc-300 dark:hover:border-white/20",
                    open
                        ? "border-amber-400 dark:border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.12)]"
                        : "",
                    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                )}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <CalendarDays size={14} className={cn(
                        "shrink-0 transition-colors",
                        value ? "text-amber-500" : "text-zinc-400"
                    )} />
                    <span className={cn(
                        "truncate",
                        value
                            ? "text-zinc-900 dark:text-white font-medium"
                            : "text-zinc-400 dark:text-zinc-600"
                    )}>
                        {value ? formatDisplay(value) : placeholder}
                    </span>
                </div>
                {value && (
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={handleClear}
                        onKeyDown={(e) => e.key === "Enter" && handleClear(e as any)}
                        className="shrink-0 w-5 h-5 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <X size={12} />
                    </div>
                )}
            </div>

            {/* Calendar Dropdown */}
            {open && !disabled && (
                <div className={cn(
                    "absolute z-50 top-full mt-2",
                    dropdownAlign === "right" ? "right-0" : "left-0",
                    "w-72 rounded-2xl overflow-hidden",
                    "bg-white dark:bg-zinc-900",
                    "border border-zinc-200 dark:border-white/10",
                    "shadow-xl shadow-zinc-200/60 dark:shadow-black/40",
                    "animate-in fade-in-0 zoom-in-95 duration-150",
                )}>

                    {yearPicker ? (
                        /* ── Year Picker ── */
                        <div className="p-3">
                            {/* Year nav */}
                            <div className="flex items-center justify-between mb-3 px-1">
                                <button
                                    type="button"
                                    onClick={() => setViewYear((y) => y - 12)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <ChevronLeft size={15} />
                                </button>
                                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                    {yearStart} – {yearStart + 11}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setViewYear((y) => y + 12)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <ChevronRight size={15} />
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-1.5">
                                {years.map((y) => (
                                    <button
                                        key={y}
                                        type="button"
                                        onClick={() => { setViewYear(y); setYearPicker(false) }}
                                        className={cn(
                                            "py-2 rounded-xl text-xs font-semibold transition-all",
                                            y === viewYear
                                                ? "bg-amber-400 text-zinc-950"
                                                : y === today.getFullYear()
                                                    ? "border border-amber-400/50 text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                        )}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        </div>

                    ) : (
                        /* ── Month/Day Picker ── */
                        <div className="p-3">

                            {/* Month + Year Header */}
                            <div className="flex items-center justify-between mb-3">
                                <button
                                    type="button"
                                    onClick={prevMonth}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <ChevronLeft size={15} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setYearPicker(true)}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                                        {MONTHS[viewMonth]}
                                    </span>
                                    <span className="text-sm font-bold text-amber-500">
                                        {viewYear}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <ChevronRight size={15} />
                                </button>
                            </div>

                            {/* Day labels */}
                            <div className="grid grid-cols-7 mb-1">
                                {DAYS.map((d) => (
                                    <div key={d} className="h-8 flex items-center justify-center text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Day grid */}
                            <div className="grid grid-cols-7 gap-y-0.5">
                                {/* Empty slots */}
                                {Array.from({ length: firstDaySlot }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}

                                {/* Days */}
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                    const sel = isSelected(day)
                                    const tod = isToday(day)
                                    const dis = isDisabled(day)
                                    const hov = hovered === day && !dis && !sel

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            disabled={dis}
                                            onClick={() => !dis && handleSelect(day)}
                                            onMouseEnter={() => setHovered(day)}
                                            onMouseLeave={() => setHovered(null)}
                                            className={cn(
                                                "h-8 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                                                dis && "opacity-25 cursor-not-allowed",
                                                sel && "bg-amber-400 text-zinc-950 font-bold shadow-sm",
                                                tod && !sel && "border border-amber-400/60 text-amber-500 dark:text-amber-400",
                                                hov && "bg-zinc-100 dark:bg-white/5",
                                                !sel && !tod && !dis && !hov && "text-zinc-700 dark:text-zinc-300",
                                            )}
                                        >
                                            {day}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setViewYear(today.getFullYear())
                                        setViewMonth(today.getMonth())
                                        handleSelect(today.getDate())
                                    }}
                                    className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors"
                                >
                                    Today
                                </button>
                                {value && (
                                    <button
                                        type="button"
                                        onClick={() => { onChange(""); setOpen(false) }}
                                        className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}