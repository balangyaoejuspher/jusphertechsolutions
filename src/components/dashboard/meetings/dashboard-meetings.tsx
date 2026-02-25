"use client"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { TimePicker } from "@/components/ui/time-picker"
import { cn } from "@/lib/utils"
import { Meeting, MeetingStatus, MeetingType } from "@/types/meeting"
import {
    Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock,
    Eye, HelpCircle, Link as LinkIcon, MapPin, MessageSquare,
    Plus, RefreshCw, Send, Video, X, XCircle, Edit2, Trash2,
    Users, Check, AlertTriangle, Briefcase
} from "lucide-react"
import { useMemo, useState } from "react"

interface MeetingsWithClient extends Meeting {
    client: string
}

const mockMeetings: MeetingsWithClient[] = [
    {
        id: "1", title: "Sprint Review & Demo",
        project: "E-Commerce Web App",
        client: "TechCorp Inc.",
        date: "Feb 25, 2026", dateISO: "2026-02-25", time: "10:00 AM", duration: 60,
        status: "scheduled", type: "video",
        host: { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
        attendees: [
            { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
            { name: "Ana Kim", initials: "AK", role: "Frontend Dev" },
            { name: "Rico Mendez", initials: "RM", role: "Backend Dev" },
        ],
        joinUrl: "https://meet.google.com/abc-defg-hij",
        agenda: "1. Demo of completed frontend\n2. Backend API walkthrough\n3. Q&A and feedback\n4. Next sprint planning",
    },
    {
        id: "2", title: "Project Kickoff",
        project: "Mobile App (iOS/Android)",
        client: "StartupXYZ",
        date: "Mar 3, 2026", dateISO: "2026-03-03", time: "2:00 PM", duration: 90,
        status: "scheduled", type: "video",
        host: { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
        attendees: [
            { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
            { name: "Mark Lim", initials: "ML", role: "Mobile Dev" },
        ],
        joinUrl: "https://meet.google.com/xyz-uvwx-yz",
        agenda: "1. Project scope overview\n2. Timeline and milestones\n3. Communication plan\n4. Tool access setup",
    },
    {
        id: "3", title: "Design Review",
        project: "Dashboard Redesign",
        client: "DesignStudio Co.",
        date: "Feb 20, 2026", dateISO: "2026-02-20", time: "3:00 PM", duration: 45,
        status: "completed", type: "video",
        host: { name: "Ana Kim", initials: "AK", role: "UI/UX Designer" },
        attendees: [
            { name: "Ana Kim", initials: "AK", role: "UI/UX Designer" },
        ],
        notes: "Client approved all designs. Minor color adjustments requested for the dark mode palette. Final assets to be delivered by Feb 22.",
    },
    {
        id: "4", title: "Monthly Progress Update",
        project: "Virtual Assistant Support",
        client: "FreelanceHub",
        date: "Feb 15, 2026", dateISO: "2026-02-15", time: "11:00 AM", duration: 30,
        status: "rescheduled", type: "call",
        host: { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
        attendees: [
            { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
            { name: "Lea Cruz", initials: "LC", role: "Virtual Assistant" },
        ],
        notes: "Rescheduled to Feb 28 at 11:00 AM at client's request.",
    },
    {
        id: "5", title: "SEO Performance Review",
        project: "SEO & Content Strategy",
        client: "GrowthLabs",
        date: "Jan 30, 2026", dateISO: "2026-01-30", time: "4:00 PM", duration: 60,
        status: "completed", type: "video",
        host: { name: "Sofia Vega", initials: "SV", role: "SEO Specialist" },
        attendees: [
            { name: "Sofia Vega", initials: "SV", role: "SEO Specialist" },
        ],
        notes: "Reviewed 6-month performance metrics. Organic traffic up 142%. Final campaign wrap-up completed.",
    },
    {
        id: "6", title: "Technical Architecture Review",
        project: "E-Commerce Web App",
        client: "TechCorp Inc.",
        date: "Feb 10, 2026", dateISO: "2026-02-10", time: "9:00 AM", duration: 60,
        status: "cancelled", type: "video",
        host: { name: "Rico Mendez", initials: "RM", role: "Backend Dev" },
        attendees: [
            { name: "Rico Mendez", initials: "RM", role: "Backend Dev" },
        ],
        cancelReason: "Client requested cancellation — covered via email thread instead.",
    },
    {
        id: "7", title: "Requirement Clarification",
        project: "Mobile App (iOS/Android)",
        client: "StartupXYZ",
        date: "Mar 10, 2026", dateISO: "2026-03-10", time: "1:00 PM", duration: 30,
        status: "pending", type: "video",
        host: { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
        attendees: [
            { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
        ],
        agenda: "Clarify offline sync requirements and GPS tracking accuracy expectations.",
    },
    {
        id: "8", title: "Monthly Sync",
        project: "E-Commerce Web App",
        client: "TechCorp Inc.",
        date: "Mar 17, 2026", dateISO: "2026-03-17", time: "10:00 AM", duration: 45,
        status: "pending", type: "video",
        host: { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
        attendees: [
            { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
            { name: "Ana Kim", initials: "AK", role: "Frontend Dev" },
        ],
        agenda: "Monthly progress review and upcoming milestone planning.",
    },
]

const STATUS_CONFIG: Record<MeetingStatus, { label: string; icon: React.ElementType; color: string; dot: string }> = {
    scheduled: { label: "Scheduled", icon: Calendar, color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", dot: "bg-amber-500" },
    completed: { label: "Completed", icon: CheckCircle, color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", dot: "bg-emerald-500" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10", dot: "bg-zinc-400" },
    pending: { label: "Pending Approval", icon: HelpCircle, color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", dot: "bg-blue-500" },
    rescheduled: { label: "Rescheduled", icon: RefreshCw, color: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20", dot: "bg-violet-500" },
}

const TYPE_CONFIG: Record<MeetingType, { label: string; icon: React.ElementType }> = {
    video: { label: "Video Call", icon: Video },
    call: { label: "Phone Call", icon: MessageSquare },
    in_person: { label: "In Person", icon: MapPin },
}

const TABS = [
    { value: "all", label: "All" },
    { value: "scheduled", label: "Scheduled" },
    { value: "pending", label: "Pending" },
    { value: "rescheduled", label: "Rescheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export function DashboardMeetingsSkeleton() {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <div className="px-6 md:px-8 pt-6 pb-5 border-b border-zinc-200 dark:border-white/5 shrink-0">
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <Skeleton className="h-7 w-32 mb-2" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                    <Skeleton className="h-10 w-36 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4">
                            <Skeleton className="h-3 w-20 mb-3" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-20 rounded-lg" />
                    ))}
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-full md:w-80 lg:w-[380px] border-r border-zinc-200 dark:border-white/5 flex flex-col">
                    <Skeleton className="h-64 m-4 rounded-2xl" />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-4 px-4 py-4 border-b border-zinc-100 dark:border-white/5">
                            <Skeleton className="w-2 h-2 rounded-full mt-1 shrink-0" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-40 mb-2" />
                                <Skeleton className="h-3 w-28 mb-2" />
                                <Skeleton className="h-5 w-20 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function MiniCalendar({
    meetings,
    onSelectDate,
    selectedDate
}: {
    meetings: MeetingsWithClient[]
    onSelectDate: (date: string) => void
    selectedDate: string | null
}) {
    const today = new Date("2026-02-23")
    const [viewYear, setViewYear] = useState(today.getFullYear())
    const [viewMonth, setViewMonth] = useState(today.getMonth())

    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    const cells: (number | null)[] = [
        ...Array.from({ length: firstDay }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]

    const toISO = (d: number) =>
        `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`

    const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => {
                        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
                        else setViewMonth(m => m - 1)
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 transition-colors"
                >
                    <ChevronLeft size={14} />
                </button>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{MONTHS[viewMonth]} {viewYear}</p>
                <button
                    onClick={() => {
                        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
                        else setViewMonth(m => m + 1)
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 transition-colors"
                >
                    <ChevronRight size={14} />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                    <div key={d} className="text-center text-[10px] font-bold text-zinc-400 dark:text-zinc-600 py-1">{d}</div>
                ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                    if (!day) return <div key={`empty-${i}`} />
                    const iso = toISO(day)
                    const dayMeetings = meetings.filter((m) => m.dateISO === iso)
                    const hasMeeting = dayMeetings.length > 0
                    const isToday = iso === todayISO
                    const isSelected = iso === selectedDate

                    return (
                        <button
                            key={iso}
                            onClick={() => onSelectDate(isSelected ? "" : iso)}
                            className={cn(
                                "relative flex flex-col items-start justify-start p-1 h-14 w-full rounded-lg transition-all overflow-hidden",
                                isSelected
                                    ? "bg-amber-400 shadow-md shadow-amber-400/20"
                                    : isToday
                                        ? "bg-zinc-900 dark:bg-zinc-700"
                                        : hasMeeting
                                            ? "bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                                            : "hover:bg-zinc-50 dark:hover:bg-white/5"
                            )}
                        >
                            <span className={cn(
                                "text-xs font-black leading-none",
                                isSelected
                                    ? "text-zinc-950"
                                    : isToday
                                        ? "text-white"
                                        : hasMeeting
                                            ? "text-emerald-700 dark:text-emerald-400"
                                            : "text-zinc-500 dark:text-zinc-400"
                            )}>
                                {day}
                            </span>

                            {hasMeeting && (
                                <div className="mt-0.5 w-full flex flex-col gap-0.5">
                                    {dayMeetings.slice(0, 1).map((m, idx) => (
                                        <span key={idx} className={cn(
                                            "block w-full truncate text-[8px] font-semibold leading-tight px-0.5 rounded",
                                            isSelected ? "text-zinc-950/70" : "text-emerald-700 dark:text-emerald-400"
                                        )}>
                                            {m.title}
                                        </span>
                                    ))}
                                    {dayMeetings.length > 1 && (
                                        <span className={cn(
                                            "text-[8px] font-bold px-0.5",
                                            isSelected ? "text-zinc-950/60" : "text-emerald-600 dark:text-emerald-500"
                                        )}>
                                            +{dayMeetings.length - 1} more
                                        </span>
                                    )}
                                </div>
                            )}

                            {isToday && !isSelected && (
                                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30" />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">Has meeting</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-md bg-zinc-900 dark:bg-zinc-700" />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-amber-400" />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">Selected</span>
                </div>
            </div>
        </div>
    )
}

function MeetingFormModal({
    meeting,
    onClose,
    onSave
}: {
    meeting: MeetingsWithClient | null
    onClose: () => void
    onSave: (meeting: MeetingsWithClient) => void
}) {
    const isEditing = !!meeting
    const [formData, setFormData] = useState<Partial<MeetingsWithClient>>(
        meeting || {
            title: "",
            project: "",
            client: "",
            date: "",
            dateISO: "",
            time: "",
            duration: 60,
            type: "video",
            status: "scheduled",
            host: { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
            attendees: [],
            agenda: "",
            joinUrl: "",
        }
    )

    const projects = ["E-Commerce Web App", "Mobile App (iOS/Android)", "Dashboard Redesign", "SEO & Content Strategy", "Virtual Assistant Support"]
    const clients = ["TechCorp Inc.", "StartupXYZ", "DesignStudio Co.", "GrowthLabs", "FreelanceHub"]
    const durations = [15, 30, 45, 60, 90, 120]
    const types: { value: MeetingType; label: string }[] = [
        { value: "video", label: "Video Call" },
        { value: "call", label: "Phone Call" },
        { value: "in_person", label: "In Person" },
    ]

    const handleDateChange = (dateStr: string) => {
        if (!dateStr) return
        const date = new Date(dateStr)
        const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        setFormData(prev => ({ ...prev, date: formatted, dateISO: dateStr }))
    }

    const handleSave = () => {
        if (!formData.title || !formData.project || !formData.client || !formData.dateISO || !formData.time) return

        const savedMeeting: MeetingsWithClient = {
            id: meeting?.id || String(Date.now()),
            title: formData.title || "",
            project: formData.project || "",
            client: formData.client || "",
            date: formData.date || "",
            dateISO: formData.dateISO || "",
            time: formData.time || "",
            duration: formData.duration || 60,
            status: (formData.status as MeetingStatus) || "scheduled",
            type: (formData.type as MeetingType) || "video",
            host: formData.host || { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
            attendees: formData.attendees || [],
            agenda: formData.agenda,
            joinUrl: formData.joinUrl,
            notes: formData.notes,
        }
        onSave(savedMeeting)
        onClose()
    }

    const inputCls = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-white/5 outline-none focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            {isEditing ? <Edit2 size={16} className="text-amber-500" /> : <Plus size={16} className="text-amber-500" />}
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base">
                                {isEditing ? "Edit Meetings" : "Schedule Meetings"}
                            </h2>
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">
                                {isEditing ? "Update meeting details" : "Create a new meeting"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                Meeting Title <span className="text-amber-500">*</span>
                            </label>
                            <input
                                className={inputCls}
                                placeholder="e.g. Sprint Review"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    Project <span className="text-amber-500">*</span>
                                </label>
                                <Select value={formData.project} onValueChange={(v) => setFormData({ ...formData, project: v })}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-sm text-zinc-900 dark:text-white">
                                        <SelectValue placeholder="Select project" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl dark:bg-zinc-900 dark:border-white/10">
                                        {projects.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    Client <span className="text-amber-500">*</span>
                                </label>
                                <Select value={formData.client} onValueChange={(v) => setFormData({ ...formData, client: v })}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-sm text-zinc-900 dark:text-white">
                                        <SelectValue placeholder="Select client" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl dark:bg-zinc-900 dark:border-white/10">
                                        {clients.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    Date <span className="text-amber-500">*</span>
                                </label>
                                <DatePicker
                                    value={formData.dateISO}
                                    onChange={(val) => handleDateChange(val)}
                                    placeholder="Select date"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    Time <span className="text-amber-500">*</span>
                                </label>
                                <TimePicker
                                    value={formData.time}
                                    onChange={(val) => setFormData({ ...formData, time: val })}
                                    placeholder="Pick a time"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    Duration
                                </label>
                                <Select value={String(formData.duration)} onValueChange={(v) => setFormData({ ...formData, duration: parseInt(v) })}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-sm text-zinc-900 dark:text-white">
                                        <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl dark:bg-zinc-900 dark:border-white/10">
                                        {durations.map((d) => <SelectItem key={d} value={String(d)}>{d} min</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                Meeting Type
                            </label>
                            <div className="flex gap-2">
                                {types.map((t) => {
                                    const TypeIcon = TYPE_CONFIG[t.value].icon
                                    return (
                                        <button
                                            key={t.value}
                                            onClick={() => setFormData({ ...formData, type: t.value })}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                                                formData.type === t.value
                                                    ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20 text-amber-600 dark:text-amber-400"
                                                    : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                            )}
                                        >
                                            <TypeIcon size={14} /> {t.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {formData.type === "video" && (
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    Join URL
                                </label>
                                <div className="relative">
                                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="url"
                                        className={`${inputCls} pl-9`}
                                        placeholder="https://meet.google.com/..."
                                        value={formData.joinUrl || ""}
                                        onChange={(e) => setFormData({ ...formData, joinUrl: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                Agenda
                            </label>
                            <textarea
                                rows={3}
                                className={inputCls}
                                placeholder="MeetingsWithClient agenda or discussion points..."
                                value={formData.agenda || ""}
                                onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/5 flex gap-3 shrink-0">
                    <Button
                        onClick={handleSave}
                        disabled={!formData.title || !formData.project || !formData.client || !formData.dateISO || !formData.time}
                        className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2 disabled:opacity-40"
                    >
                        <Check size={14} /> {isEditing ? "Save Changes" : "Schedule Meetings"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl border-zinc-200 dark:border-white/10 h-11 px-6"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}

function DeleteConfirmModal({
    meeting,
    onClose,
    onConfirm
}: {
    meeting: MeetingsWithClient
    onClose: () => void
    onConfirm: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-sm p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center mb-4">
                        <Trash2 size={22} className="text-red-500" />
                    </div>
                    <h2 className="font-bold text-zinc-900 dark:text-white text-lg mb-1">Delete Meeting?</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                        Are you sure you want to delete <span className="font-semibold text-zinc-700 dark:text-zinc-300">{meeting.title}</span>? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 w-full">
                        <Button
                            onClick={onConfirm}
                            className="flex-1 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold h-11"
                        >
                            Delete
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 h-11"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MeetingDetail({
    meeting,
    onClose,
    onEdit,
    onDelete,
    onApprove,
    onComplete,
    onCancel
}: {
    meeting: MeetingsWithClient
    onClose: () => void
    onEdit: () => void
    onDelete: () => void
    onApprove: () => void
    onComplete: () => void
    onCancel: () => void
}) {
    const cfg = STATUS_CONFIG[meeting.status]
    const StatusIcon = cfg.icon
    const typeCfg = TYPE_CONFIG[meeting.type]
    const TypeIcon = typeCfg.icon

    const canEdit = meeting.status === "scheduled" || meeting.status === "pending"
    const canDelete = meeting.status !== "completed"
    const canApprove = meeting.status === "pending"
    const canComplete = meeting.status === "scheduled" || meeting.status === "rescheduled"
    const canCancel = meeting.status === "scheduled" || meeting.status === "pending" || meeting.status === "rescheduled"
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(meeting.joinUrl!);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <TypeIcon size={13} className="text-zinc-400 dark:text-zinc-600 shrink-0" />
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">{typeCfg.label}</p>
                        </div>
                        <h2 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight">{meeting.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Briefcase size={11} className="text-zinc-400" />
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">{meeting.project}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Users size={11} className="text-zinc-400" />
                            <span className="text-xs text-zinc-400 dark:text-zinc-600">{meeting.client}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold", cfg.color)}>
                            <StatusIcon size={11} />{cfg.label}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Date/time/duration row */}
                <div className="flex flex-wrap items-center gap-3">
                    {[
                        { icon: Calendar, label: meeting.date },
                        { icon: Clock, label: `${meeting.time} · ${meeting.duration} min` },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl">
                            <item.icon size={12} className="text-zinc-400 dark:text-zinc-600" />
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Attendees */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Attendees</p>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-xs font-black text-zinc-950 shrink-0">
                            {meeting.host.initials}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{meeting.host.name}</p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">{meeting.host.role} · Host</p>
                        </div>
                    </div>
                    {meeting.attendees.filter(a => a.name !== meeting.host.name).map((a) => (
                        <div key={a.name} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-400 shrink-0">
                                {a.initials}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{a.name}</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600">{a.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Agenda / Notes / Cancel reason */}
            {(meeting.agenda || meeting.notes || meeting.cancelReason) && (
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                    {meeting.agenda && (
                        <>
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">Agenda</p>
                            <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl p-4 mb-3">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">{meeting.agenda}</p>
                            </div>
                        </>
                    )}
                    {meeting.notes && (
                        <>
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">Notes</p>
                            <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl p-4 mb-3">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{meeting.notes}</p>
                            </div>
                        </>
                    )}
                    {meeting.cancelReason && (
                        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/10">
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{meeting.cancelReason}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="p-6 border-t border-zinc-100 dark:border-white/5 mt-auto flex flex-col gap-2">
                {/* Approved */}
                {canApprove && (
                    <Button
                        onClick={onApprove}
                        className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-11 gap-2"
                    >
                        <Check size={14} /> Approve Meeting
                    </Button>
                )}
                {/* Complete */}
                {canComplete && (
                    <Button
                        onClick={onComplete}
                        className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2"
                    >
                        <CheckCircle size={14} /> Mark as Completed
                    </Button>
                )}

                {/* Join + Copy */}
                {meeting.joinUrl && meeting.status === "scheduled" && (
                    <>
                        <a href={meeting.joinUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full rounded-xl bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold h-11 gap-2">
                                <Video size={14} /> Join Meeting
                            </Button>
                        </a>

                        <button
                            onClick={handleCopy}
                            className={cn(
                                "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold transition-all h-11",
                                copied
                                    ? "border border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-700 dark:hover:text-zinc-300"
                            )}
                        >
                            {copied ? (
                                <>
                                    <Check size={12} className="animate-scale-in" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <LinkIcon size={12} />
                                    Copy Join Link
                                </>
                            )}
                        </button>
                    </>
                )}

                {/* Edit / Cancel / Delete */}
                <div className="flex gap-2">
                    {canEdit && (
                        <Button onClick={onEdit} variant="outline" className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 h-10 gap-1.5 text-sm">
                            <Edit2 size={13} /> Edit
                        </Button>
                    )}

                    {canCancel && (
                        <Button
                            onClick={onCancel}
                            variant="outline"
                            className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 h-10 gap-1.5 text-sm text-red-500 hover:border-red-200 dark:hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                            <XCircle size={13} /> Cancel
                        </Button>
                    )}

                    {canDelete && (
                        <Button
                            onClick={onDelete}
                            variant="outline"
                            className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 h-10 gap-1.5 text-sm text-zinc-500 hover:text-red-500"
                        >
                            <Trash2 size={13} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

function CancelRescheduleModal({
    meeting,
    onClose,
    onConfirm
}: {
    meeting: MeetingsWithClient
    onClose: () => void
    onConfirm: (type: "cancel" | "reschedule", data: { newDate?: string; newTime?: string; reason?: string }) => void
}) {
    const [mode, setMode] = useState<"cancel" | "reschedule">("cancel")
    const [reason, setReason] = useState("")
    const [newDate, setNewDate] = useState("")
    const [newTime, setNewTime] = useState("")

    const handleSubmit = () => {
        onConfirm(mode, { newDate, newTime, reason })
        onClose()
    }

    const inputCls = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-white/5 outline-none focus:border-amber-400 transition-all"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-bold text-zinc-900 dark:text-white text-base">Modify MeetingsWithClient</h2>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600">{meeting.title}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                        <X size={16} />
                    </button>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-2 mb-5">
                    {[
                        { value: "reschedule", label: "Reschedule", icon: RefreshCw },
                        { value: "cancel", label: "Cancel", icon: XCircle },
                    ].map((m) => (
                        <button
                            key={m.value}
                            onClick={() => setMode(m.value as "cancel" | "reschedule")}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                                mode === m.value
                                    ? m.value === "cancel"
                                        ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
                                        : "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20 text-amber-600 dark:text-amber-400"
                                    : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                            )}
                        >
                            <m.icon size={13} /> {m.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    {mode === "reschedule" && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    New Date
                                </label>
                                <DatePicker
                                    value={newDate}
                                    onChange={(val) => setNewDate(val)}
                                    placeholder="Select date"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    New Time
                                </label>
                                <TimePicker
                                    value={newTime}
                                    onChange={(val) => setNewTime(val)}
                                    placeholder="Pick a time"
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                            {mode === "cancel" ? "Cancellation Reason" : "Reason (Optional)"}
                        </label>
                        <textarea
                            rows={3}
                            className={inputCls}
                            placeholder={mode === "cancel" ? "Why is this meeting being cancelled?" : "Add a note about the change..."}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSubmit}
                            className={cn(
                                "flex-1 rounded-xl font-bold h-11 gap-2",
                                mode === "cancel"
                                    ? "bg-red-500 hover:bg-red-400 text-white"
                                    : "bg-amber-400 hover:bg-amber-300 text-zinc-950"
                            )}
                        >
                            {mode === "cancel" ? <><XCircle size={14} /> Confirm Cancel</> : <><RefreshCw size={14} /> Reschedule</>}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl border-zinc-200 dark:border-white/10 h-11 px-5"
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function DashboardMeetings() {
    const [activeTab, setActiveTab] = useState("all")
    const [selected, setSelected] = useState<MeetingsWithClient | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [editingMeeting, setEditingMeeting] = useState<MeetingsWithClient | null>(null)
    const [showDelete, setShowDelete] = useState(false)
    const [showCancelReschedule, setShowCancelReschedule] = useState(false)
    const [meetings, setMeetings] = useState<MeetingsWithClient[]>(mockMeetings)

    const filtered = useMemo(() => {
        return meetings
            .filter((m) => activeTab === "all" || m.status === activeTab)
            .filter((m) => !selectedDate || m.dateISO === selectedDate)
            .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
    }, [activeTab, selectedDate, meetings])

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { all: meetings.length }
        meetings.forEach((m) => { counts[m.status] = (counts[m.status] ?? 0) + 1 })
        return counts
    }, [meetings])

    const stats = useMemo(() => {
        const scheduled = meetings.filter((m) => m.status === "scheduled").length
        const pending = meetings.filter((m) => m.status === "pending").length
        const completed = meetings.filter((m) => m.status === "completed").length
        const cancelled = meetings.filter((m) => m.status === "cancelled").length
        const totalDuration = meetings
            .filter((m) => m.status === "completed" || m.status === "scheduled")
            .reduce((sum, m) => sum + m.duration, 0)
        return { scheduled, pending, completed, cancelled, totalDuration }
    }, [meetings])

    const upcoming = useMemo(() =>
        meetings
            .filter((m) => m.status === "scheduled" || m.status === "pending")
            .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
            .slice(0, 3),
        [meetings]
    )

    const handleCreate = () => {
        setEditingMeeting(null)
        setShowForm(true)
    }

    const handleEdit = () => {
        if (selected) {
            setEditingMeeting(selected)
            setShowForm(true)
        }
    }

    const handleSave = (meeting: MeetingsWithClient) => {
        if (editingMeeting) {
            setMeetings(prev => prev.map(m => m.id === meeting.id ? meeting : m))
        } else {
            setMeetings(prev => [meeting, ...prev])
        }
        if (selected?.id === meeting.id) {
            setSelected(meeting)
        }
    }

    const handleDelete = () => {
        if (selected) {
            setMeetings(prev => prev.filter(m => m.id !== selected.id))
            setSelected(null)
            setShowDelete(false)
        }
    }

    const handleApprove = () => {
        if (selected) {
            const updated = { ...selected, status: "scheduled" as MeetingStatus }
            setMeetings(prev => prev.map(m => m.id === selected.id ? updated : m))
            setSelected(updated)
        }
    }

    const handleComplete = () => {
        if (selected) {
            const updated = { ...selected, status: "completed" as MeetingStatus }
            setMeetings(prev => prev.map(m => m.id === selected.id ? updated : m))
            setSelected(updated)
        }
    }

    const handleCancelReschedule = (type: "cancel" | "reschedule", data: { newDate?: string; newTime?: string; reason?: string }) => {
        if (!selected) return

        if (type === "cancel") {
            const updated = { ...selected, status: "cancelled" as MeetingStatus, cancelReason: data.reason }
            setMeetings(prev => prev.map(m => m.id === selected.id ? updated : m))
            setSelected(updated)
        } else {
            const updated: MeetingsWithClient = {
                ...selected,
                status: "rescheduled" as MeetingStatus,
                dateISO: data.newDate || selected.dateISO,
                date: data.newDate
                    ? new Date(data.newDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : selected.date,
                time: data.newTime || selected.time,
                notes: data.reason ? `Rescheduled: ${data.reason}` : selected.notes,
            }
            setMeetings(prev => prev.map(m => m.id === selected.id ? updated : m))
            setSelected(updated)
        }
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <div className="px-6 md:px-8 pt-6 pb-5 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/5 shrink-0">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Meetings</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Schedule, manage, and track client meetings.</p>
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-10 gap-2"
                    >
                        <Plus size={14} /> Schedule Meeting
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                    {[
                        { label: "Scheduled", value: stats.scheduled, icon: Calendar, color: "text-amber-500 dark:text-amber-400" },
                        { label: "Pending", value: stats.pending, icon: HelpCircle, color: "text-blue-500 dark:text-blue-400" },
                        { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-emerald-500 dark:text-emerald-400" },
                        { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "text-zinc-500 dark:text-zinc-400" },
                        { label: "Total Hours", value: `${Math.round(stats.totalDuration / 60)}h`, icon: Clock, color: "text-violet-500 dark:text-violet-400" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4">
                            <div className="flex items-center gap-1.5 mb-2">
                                <s.icon size={12} className={s.color} />
                                <p className="text-[11px] text-zinc-400 dark:text-zinc-600 font-medium">{s.label}</p>
                            </div>
                            <p className="text-lg font-black text-zinc-900 dark:text-white">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => { setActiveTab(tab.value); setSelected(null); setSelectedDate(null) }}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                                activeTab === tab.value
                                    ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            )}
                        >
                            {tab.label}
                            {(tabCounts[tab.value] ?? 0) > 0 && (
                                <span className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                    activeTab === tab.value
                                        ? "bg-white/20 text-inherit"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                                )}>
                                    {tabCounts[tab.value]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split panel */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left — Calendar + List */}
                <div className={cn(
                    "flex flex-col overflow-y-auto border-r border-zinc-200 dark:border-white/5 shrink-0 bg-zinc-50 dark:bg-zinc-950",
                    selected ? "hidden md:flex md:w-80 lg:w-[380px]" : "w-full"
                )}>
                    {/* Mini calendar */}
                    <div className="p-4 border-b border-zinc-100 dark:border-white/5">
                        <MiniCalendar
                            meetings={meetings}
                            selectedDate={selectedDate}
                            onSelectDate={(d) => { setSelectedDate(d || null); setSelected(null) }}
                        />
                        {selectedDate && (
                            <button
                                onClick={() => setSelectedDate(null)}
                                className="mt-2 text-xs text-amber-500 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                            >
                                <X size={11} /> Clear date filter
                            </button>
                        )}
                    </div>

                    {/* Upcoming strip */}
                    {activeTab === "all" && !selectedDate && (
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-white/5">
                            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2.5">Upcoming</p>
                            <div className="flex flex-col gap-1.5">
                                {upcoming.map((m) => {
                                    const cfg = STATUS_CONFIG[m.status]
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => setSelected(m)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all text-left group"
                                        >
                                            <div className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{m.title}</p>
                                                <p className="text-[10px] text-zinc-400 dark:text-zinc-600">{m.date} · {m.time}</p>
                                            </div>
                                            {m.joinUrl && (
                                                <Video size={12} className="text-amber-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Full list */}
                    <div className="flex flex-col flex-1">
                        {selectedDate && (
                            <div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-400/5 border-b border-amber-100 dark:border-amber-400/10">
                                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                    Showing meetings for {selectedDate}
                                </p>
                            </div>
                        )}
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center flex-1 py-16 text-center">
                                <Calendar size={28} className="text-zinc-300 dark:text-zinc-700 mb-2" />
                                <p className="text-zinc-400 dark:text-zinc-600 text-sm">No meetings found</p>
                            </div>
                        ) : (
                            filtered.map((m) => {
                                const cfg = STATUS_CONFIG[m.status]
                                const isSelected = selected?.id === m.id
                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelected(m)}
                                        className={cn(
                                            "flex items-start gap-3 px-4 py-4 border-b border-zinc-100 dark:border-white/5 text-left transition-all hover:bg-white dark:hover:bg-zinc-900/50",
                                            isSelected && "bg-white dark:bg-zinc-900 border-l-2 border-l-amber-400"
                                        )}
                                    >
                                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", cfg.dot)} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate mb-0.5">{m.title}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mb-0.5">{m.project}</p>
                                            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 truncate mb-1.5">{m.client}</p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold", cfg.color)}>
                                                    <cfg.icon size={9} />{cfg.label}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 dark:text-zinc-600">{m.date} · {m.time}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700 shrink-0 mt-1" />
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Right — Detail */}
                {selected ? (
                    <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-white/5 md:hidden">
                            <button
                                onClick={() => setSelected(null)}
                                className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                                <ChevronLeft size={12} /> Back
                            </button>
                        </div>
                        <MeetingDetail
                            meeting={selected}
                            onClose={() => setSelected(null)}
                            onEdit={handleEdit}
                            onDelete={() => setShowDelete(true)}
                            onApprove={handleApprove}
                            onComplete={handleComplete}
                            onCancel={() => setShowCancelReschedule(true)}
                        />
                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center bg-white dark:bg-zinc-900">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                                <Eye size={22} className="text-zinc-400 dark:text-zinc-600" />
                            </div>
                            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Select a meeting to view details</p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">or pick a date on the calendar</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showForm && (
                <MeetingFormModal
                    meeting={editingMeeting}
                    onClose={() => setShowForm(false)}
                    onSave={handleSave}
                />
            )}
            {showDelete && selected && (
                <DeleteConfirmModal
                    meeting={selected}
                    onClose={() => setShowDelete(false)}
                    onConfirm={handleDelete}
                />
            )}
            {showCancelReschedule && selected && (
                <CancelRescheduleModal
                    meeting={selected}
                    onClose={() => setShowCancelReschedule(false)}
                    onConfirm={handleCancelReschedule}
                />
            )}
        </div>
    )
}