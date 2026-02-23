"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import Image from "next/image"
import Link from "next/link"
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Globe,
    Video,
    CheckCircle,
    Calendar,
    ArrowRight,
    Sparkles,
    Mail,
    User,
    MessageSquare,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// ============================================================
// CONSTANTS
// ============================================================

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

// Available time slots (Mon–Sat only)
const TIME_SLOTS = [
    "08:00 AM", "08:30 AM",
    "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM",
]

// Static booked slots — safe for SSR, no hydration mismatch
// Format: "YYYY-MM-DD": [slot indices]
// Indices: 0=08:00AM, 1=08:30AM, 2=09:00AM, 3=09:30AM, 4=10:00AM, 5=10:30AM,
//          6=11:00AM, 7=11:30AM, 8=01:00PM, 9=01:30PM, 10=02:00PM, 11=02:30PM,
//          12=03:00PM, 13=03:30PM, 14=04:00PM, 15=04:30PM
const BOOKED_SLOTS: Record<string, number[]> = {
    "2026-02-23": [0, 2, 4, 9, 12],
    "2026-02-24": [1, 3, 8, 11, 14],
    "2026-02-25": [0, 1, 5, 6, 10, 13],
    "2026-02-26": [2, 4, 9, 15],
    "2026-02-27": [0, 3, 7, 8, 12],
    "2026-02-28": [1, 5, 10, 14],
    "2026-03-03": [0, 2, 6, 11, 13],
    "2026-03-04": [3, 4, 8, 9, 15],
    "2026-03-05": [1, 7, 10, 12],
    "2026-03-06": [0, 5, 6, 14],
}

// Timezones
const TIMEZONES = [
    { value: "Asia/Manila", label: "Philippines (PHT, UTC+8)" },
    { value: "America/New_York", label: "New York (ET, UTC-5/-4)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PT, UTC-8/-7)" },
    { value: "America/Chicago", label: "Chicago (CT, UTC-6/-5)" },
    { value: "Europe/London", label: "London (GMT/BST, UTC+0/+1)" },
    { value: "Europe/Paris", label: "Paris (CET, UTC+1/+2)" },
    { value: "Asia/Dubai", label: "Dubai (GST, UTC+4)" },
    { value: "Asia/Singapore", label: "Singapore (SGT, UTC+8)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST, UTC+9)" },
    { value: "Australia/Sydney", label: "Sydney (AEDT, UTC+11)" },
]

// Host info
const HOST = {
    name: "Juspher Balangyao",
    title: "Founder & CEO",
    company: siteConfig.fullName,
    avatar: null, // set to "/team/juspher.jpg" when photo is available
    initials: "JB",
    bio: "Discovery call to explore how Juspher Tech Solutions can help your business grow through outsourcing and software.",
    email: "founder@jusphertechsolution.com",
}

// ============================================================
// HELPERS
// ============================================================

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay()
}

function formatDate(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function isWeekend(date: Date) {
    const day = date.getDay()
    return day === 0 // only Sunday is blocked (Mon–Sat available)
}

function isPast(date: Date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
}

// ============================================================
// STEP INDICATOR
// ============================================================

function StepIndicator({ step }: { step: number }) {
    const steps = ["Pick a Date", "Choose Time", "Your Details", "Confirmed"]
    return (
        <div className="flex items-center gap-0 mb-8">
            {steps.map((label, i) => (
                <div key={label} className="flex items-center">
                    <div className="flex flex-col items-center gap-1">
                        <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                            i + 1 < step
                                ? "bg-amber-400 border-amber-400 text-zinc-950"
                                : i + 1 === step
                                    ? "bg-zinc-900 dark:bg-white border-amber-400 text-white dark:text-zinc-900"
                                    : "bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-400"
                        )}>
                            {i + 1 < step ? <CheckCircle size={14} /> : i + 1}
                        </div>
                        <span className={cn("text-[10px] font-semibold whitespace-nowrap hidden sm:block", i + 1 === step ? "text-zinc-900 dark:text-white" : "text-zinc-400")}>
                            {label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={cn("h-px w-8 sm:w-14 mx-1 mb-4 transition-all", i + 1 < step ? "bg-amber-400" : "bg-zinc-200 dark:bg-zinc-800")} />
                    )}
                </div>
            ))}
        </div>
    )
}

// ============================================================
// HOST CARD
// ============================================================

function HostCard({ compact = false }: { compact?: boolean }) {
    return (
        <div className={cn("flex flex-col", compact ? "gap-3" : "gap-4")}>
            {/* Avatar + name */}
            <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                    {HOST.avatar ? (
                        <Image src={HOST.avatar} alt={HOST.name} width={compact ? 40 : 52} height={compact ? 40 : 52} className={cn("rounded-2xl object-cover", compact ? "w-10 h-10" : "w-13 h-13")} />
                    ) : (
                        <div className={cn("rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-zinc-950 font-black", compact ? "w-10 h-10 text-sm" : "w-13 h-13 text-base")}>
                            {HOST.initials}
                        </div>
                    )}
                    {/* Online dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-900" />
                </div>
                <div>
                    <p className={cn("font-bold text-zinc-900 dark:text-white", compact ? "text-sm" : "text-base")}>{HOST.name}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">{HOST.title} · {HOST.company}</p>
                </div>
            </div>

            {!compact && (
                <>
                    {/* Meeting meta */}
                    <div className="flex flex-col gap-2">
                        {[
                            { icon: Clock, label: "30 minutes" },
                            { icon: Video, label: "Google Meet / Zoom" },
                            { icon: Mail, label: HOST.email },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2.5 text-sm text-zinc-500 dark:text-zinc-400">
                                <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                    <item.icon size={12} className="text-zinc-500 dark:text-zinc-400" />
                                </div>
                                {item.label}
                            </div>
                        ))}
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed border-t border-zinc-100 dark:border-white/5 pt-4">
                        {HOST.bio}
                    </p>
                </>
            )}
        </div>
    )
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function BookMeetingPage() {
    const today = new Date()
    const [currentMonth, setCurrentMonth] = useState(today.getMonth())
    const [currentYear, setCurrentYear] = useState(today.getFullYear())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [timezone, setTimezone] = useState("Asia/Manila")
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({ name: "", email: "", company: "", message: "" })
    const [submitted, setSubmitted] = useState(false)


    // Calendar grid
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const calendarCells = useMemo(() => {
        const cells: (Date | null)[] = Array(firstDay).fill(null)
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(new Date(currentYear, currentMonth, d))
        }
        // pad to complete last row
        while (cells.length % 7 !== 0) cells.push(null)
        return cells
    }, [currentYear, currentMonth, daysInMonth, firstDay])

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1) }
        else setCurrentMonth((m) => m - 1)
        setSelectedDate(null); setSelectedSlot(null)
    }

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1) }
        else setCurrentMonth((m) => m + 1)
        setSelectedDate(null); setSelectedSlot(null)
    }

    const bookedKey = selectedDate ? formatDate(selectedDate) : ""
    const bookedIndices = BOOKED_SLOTS[bookedKey] ?? []

    const canGoBack = !(currentYear === today.getFullYear() && currentMonth === today.getMonth())

    const handleSubmit = () => {
        if (!form.name || !form.email) return
        setSubmitted(true)
        setStep(4)
    }

    // ── STEP 4: Confirmed ──
    if (step === 4 && submitted) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="relative w-full max-w-md text-center">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-10 shadow-xl">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                            <CheckCircle size={28} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">You're booked!</h2>
                        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                            A confirmation has been sent to <span className="font-semibold text-zinc-700 dark:text-zinc-300">{form.email}</span>. We look forward to meeting you!
                        </p>

                        {/* Booking summary */}
                        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-5 text-left mb-6 flex flex-col gap-3">
                            <HostCard compact />
                            <div className="border-t border-zinc-100 dark:border-white/10 pt-3 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={13} className="text-amber-500 shrink-0" />
                                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
                                        {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock size={13} className="text-amber-500 shrink-0" />
                                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{selectedSlot} · 30 minutes</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Globe size={13} className="text-amber-500 shrink-0" />
                                    <span className="text-zinc-500 dark:text-zinc-400">{TIMEZONES.find((t) => t.value === timezone)?.label}</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/">
                            <Button className="w-full rounded-xl h-11 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-b from-transparent to-white/50 dark:to-zinc-950/80 pointer-events-none" />

            <div className="relative container mx-auto px-4 md:px-6 py-10 md:py-16 max-w-6xl">

                {/* Page header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 mb-4">
                        <Sparkles size={11} className="text-amber-500 dark:text-amber-400" />
                        <span className="text-amber-600 dark:text-amber-400 text-xs font-bold tracking-widest uppercase">Free Discovery Call</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">
                        Book a Meeting
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-md mx-auto">
                        30 minutes with our team to explore how we can help you grow. No commitment, just a conversation.
                    </p>
                </div>

                {/* Step indicator */}
                <div className="flex justify-center mb-8">
                    <StepIndicator step={step} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── LEFT: Host info card ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-6 sticky top-6">
                            {/* Top amber line */}
                            <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mb-6" />

                            <div className="flex items-center gap-2 mb-5">
                                <Calendar size={13} className="text-amber-500" />
                                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Your Host</span>
                            </div>

                            <HostCard />

                            {/* Booking summary (shows after date selected) */}
                            {selectedDate && (
                                <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-white/5">
                                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Your Selection</p>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar size={13} className="text-amber-500 shrink-0" />
                                            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
                                                {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                            </span>
                                        </div>
                                        {selectedSlot && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock size={13} className="text-amber-500 shrink-0" />
                                                <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{selectedSlot}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm">
                                            <Globe size={13} className="text-zinc-400 shrink-0" />
                                            <span className="text-zinc-400 dark:text-zinc-500 text-xs">
                                                {TIMEZONES.find((t) => t.value === timezone)?.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Timezone selector */}
                            <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-white/5">
                                <label className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <Globe size={11} />
                                    Your Timezone
                                </label>
                                <Select value={timezone} onValueChange={setTimezone}>
                                    <SelectTrigger className="mt-2 w-full rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs h-10">
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIMEZONES.map((tz) => (
                                            <SelectItem key={tz.value} value={tz.value}>
                                                {tz.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Steps ── */}
                    <div className="lg:col-span-2">

                        {/* ═══ STEP 1: Calendar ═══ */}
                        {step === 1 && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden">
                                <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

                                {/* Month nav */}
                                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                                    <button
                                        onClick={prevMonth}
                                        disabled={!canGoBack}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-400 hover:border-amber-400/50 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                                        {MONTHS[currentMonth]} {currentYear}
                                    </h2>
                                    <button
                                        onClick={nextMonth}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-400 hover:border-amber-400/50 hover:text-amber-500 transition-all"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                {/* Day headers */}
                                <div className="grid grid-cols-7 px-4 pb-2">
                                    {DAYS.map((d) => (
                                        <div key={d} className={cn("text-center text-xs font-bold uppercase tracking-widest py-2", d === "Sun" ? "text-zinc-300 dark:text-zinc-700" : "text-zinc-400 dark:text-zinc-600")}>
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar grid */}
                                <div className="grid grid-cols-7 gap-1 px-4 pb-6">
                                    {calendarCells.map((date, i) => {
                                        if (!date) return <div key={`empty-${i}`} />
                                        const isDisabled = isPast(date) || isWeekend(date)
                                        const isSunday = date.getDay() === 0
                                        const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate)
                                        const isToday = formatDate(date) === formatDate(today)

                                        return (
                                            <button
                                                key={formatDate(date)}
                                                onClick={() => { if (!isDisabled) { setSelectedDate(date); setSelectedSlot(null) } }}
                                                disabled={isDisabled}
                                                className={cn(
                                                    "relative flex flex-col items-center justify-center h-10 w-full rounded-xl text-sm font-semibold transition-all duration-150",
                                                    isSelected
                                                        ? "bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/30"
                                                        : isDisabled
                                                            ? isSunday
                                                                ? "text-zinc-200 dark:text-zinc-800 cursor-not-allowed"
                                                                : "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                                                            : "text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-amber-400/10 hover:text-amber-600 dark:hover:text-amber-400"
                                                )}
                                            >
                                                {date.getDate()}
                                                {isToday && !isSelected && (
                                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Legend */}
                                <div className="flex items-center gap-5 px-6 pb-5 border-t border-zinc-100 dark:border-white/5 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-amber-400" />
                                        <span className="text-xs text-zinc-400">Selected</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm border border-zinc-200 dark:border-white/10" />
                                        <span className="text-xs text-zinc-400">Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-zinc-100 dark:bg-zinc-800" />
                                        <span className="text-xs text-zinc-400">Unavailable</span>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        <span className="text-xs text-zinc-400">Today</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                {selectedDate && (
                                    <div className="px-6 pb-6">
                                        <Button
                                            onClick={() => setStep(2)}
                                            className="w-full h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2"
                                        >
                                            Continue to Time Slots
                                            <ArrowRight size={15} />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══ STEP 2: Time slots ═══ */}
                        {step === 2 && selectedDate && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden">
                                <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                                <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                                            {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                                        </h2>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                                            All times in {TIMEZONES.find((t) => t.value === timezone)?.label}
                                        </p>
                                    </div>
                                    <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                                        <X size={13} /> Change date
                                    </button>
                                </div>

                                <div className="px-6 pb-6">
                                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">
                                        Available Slots · 30 min each
                                    </p>

                                    {/* Morning */}
                                    <div className="mb-5">
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-2 font-semibold">Morning</p>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {TIME_SLOTS.filter((s) => s.includes("AM")).map((slot, i) => {
                                                const isBooked = bookedIndices.includes(i)
                                                const isSelected = selectedSlot === slot
                                                return (
                                                    <button
                                                        key={slot}
                                                        onClick={() => { if (!isBooked) setSelectedSlot(slot) }}
                                                        disabled={isBooked}
                                                        className={cn(
                                                            "py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all duration-150",
                                                            isSelected
                                                                ? "bg-amber-400 border-amber-400 text-zinc-950 shadow-md shadow-amber-400/20"
                                                                : isBooked
                                                                    ? "bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-white/5 text-zinc-300 dark:text-zinc-700 cursor-not-allowed line-through"
                                                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-400/5 hover:text-amber-600 dark:hover:text-amber-400"
                                                        )}
                                                    >
                                                        {slot}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Afternoon */}
                                    <div>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-2 font-semibold">Afternoon</p>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {TIME_SLOTS.filter((s) => s.includes("PM")).map((slot, i) => {
                                                const slotIdx = TIME_SLOTS.indexOf(slot)
                                                const isBooked = bookedIndices.includes(slotIdx)
                                                const isSelected = selectedSlot === slot
                                                return (
                                                    <button
                                                        key={slot}
                                                        onClick={() => { if (!isBooked) setSelectedSlot(slot) }}
                                                        disabled={isBooked}
                                                        className={cn(
                                                            "py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all duration-150",
                                                            isSelected
                                                                ? "bg-amber-400 border-amber-400 text-zinc-950 shadow-md shadow-amber-400/20"
                                                                : isBooked
                                                                    ? "bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-white/5 text-zinc-300 dark:text-zinc-700 cursor-not-allowed line-through"
                                                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-400/5 hover:text-amber-600 dark:hover:text-amber-400"
                                                        )}
                                                    >
                                                        {slot}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 flex gap-3">
                                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-500 gap-1.5">
                                        <ChevronLeft size={14} /> Back
                                    </Button>
                                    <Button
                                        onClick={() => setStep(3)}
                                        disabled={!selectedSlot}
                                        className="flex-1 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 disabled:opacity-40"
                                    >
                                        Continue to Details
                                        <ArrowRight size={15} />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ═══ STEP 3: Contact form ═══ */}
                        {step === 3 && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden">
                                <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                                <div className="px-6 pt-6 pb-4">
                                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">Your Details</h2>
                                    <p className="text-xs text-zinc-400 mt-0.5">We'll use this to send your confirmation</p>
                                </div>

                                {/* Booking recap pill */}
                                <div className="mx-6 mb-5 flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-400/5 border border-amber-200 dark:border-amber-400/20 rounded-2xl">
                                    <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0">
                                        <Calendar size={14} className="text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">
                                            {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} · {selectedSlot}
                                        </p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500">30 min · {TIMEZONES.find((t) => t.value === timezone)?.label}</p>
                                    </div>
                                    <button onClick={() => setStep(2)} className="ml-auto text-xs text-amber-500 dark:text-amber-400 font-semibold hover:underline shrink-0">
                                        Edit
                                    </button>
                                </div>

                                <div className="px-6 pb-6 flex flex-col gap-4">
                                    {[
                                        { id: "name", label: "Full Name", icon: User, placeholder: "Your full name", type: "text" },
                                        { id: "email", label: "Email Address", icon: Mail, placeholder: "you@company.com", type: "email" },
                                        { id: "company", label: "Company", icon: Sparkles, placeholder: "Your company (optional)", type: "text" },
                                    ].map((field) => (
                                        <div key={field.id}>
                                            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <field.icon size={11} />
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                value={form[field.id as keyof typeof form]}
                                                onChange={(e) => setForm((p) => ({ ...p, [field.id]: e.target.value }))}
                                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                                            />
                                        </div>
                                    ))}

                                    <div>
                                        <label className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <MessageSquare size={11} />
                                            What would you like to discuss?
                                        </label>
                                        <textarea
                                            placeholder="Tell us briefly what you're looking for — hiring, software, a specific service..."
                                            value={form.message}
                                            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3 mt-2">
                                        <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-500 gap-1.5">
                                            <ChevronLeft size={14} /> Back
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={!form.name || !form.email}
                                            className="flex-1 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 disabled:opacity-40 shadow-lg shadow-amber-500/20"
                                        >
                                            Confirm Booking
                                            <CheckCircle size={15} />
                                        </Button>
                                    </div>

                                    <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
                                        By booking, you agree to our{" "}
                                        <Link href="/privacy" className="text-amber-500 hover:underline">privacy policy</Link>.
                                        A calendar invite will be sent to your email.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}