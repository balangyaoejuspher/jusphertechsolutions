"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Meeting, MeetingStatus } from "@/types/meeting"
import {
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    HelpCircle,
    Link as LinkIcon,
    MapPin,
    MessageSquare,
    Plus,
    RefreshCw,
    Send,
    Video,
    X,
    XCircle
} from "lucide-react"
import { useMemo, useState } from "react"

const mockMeetings: Meeting[] = [
    {
        id: "1", title: "Sprint Review & Demo",
        project: "E-Commerce Web App",
        date: "Feb 25, 2026", dateISO: "2026-02-25", time: "10:00 AM", duration: 60,
        status: "scheduled", type: "video",
        host: { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
        attendees: [
            { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
            { name: "Ana Kim",           initials: "AK", role: "Frontend Dev" },
            { name: "Rico Mendez",       initials: "RM", role: "Backend Dev" },
        ],
        joinUrl: "https://meet.google.com/abc-defg-hij",
        agenda: "1. Demo of completed frontend\n2. Backend API walkthrough\n3. Q&A and feedback\n4. Next sprint planning",
    },
    {
        id: "2", title: "Project Kickoff",
        project: "Mobile App (iOS/Android)",
        date: "Mar 3, 2026", dateISO: "2026-03-03", time: "2:00 PM", duration: 90,
        status: "scheduled", type: "video",
        host: { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
        attendees: [
            { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
            { name: "Mark Lim",          initials: "ML", role: "Mobile Dev" },
        ],
        joinUrl: "https://meet.google.com/xyz-uvwx-yz",
        agenda: "1. Project scope overview\n2. Timeline and milestones\n3. Communication plan\n4. Tool access setup",
    },
    {
        id: "3", title: "Design Review",
        project: "Dashboard Redesign",
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
        date: "Feb 15, 2026", dateISO: "2026-02-15", time: "11:00 AM", duration: 30,
        status: "rescheduled", type: "call",
        host: { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
        attendees: [
            { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
            { name: "Lea Cruz",          initials: "LC", role: "Virtual Assistant" },
        ],
        notes: "Rescheduled to Feb 28 at 11:00 AM at client's request.",
    },
    {
        id: "5", title: "SEO Performance Review",
        project: "SEO & Content Strategy",
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
        date: "Mar 17, 2026", dateISO: "2026-03-17", time: "10:00 AM", duration: 45,
        status: "pending", type: "video",
        host: { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
        attendees: [
            { name: "Juspher Balangyao", initials: "JB", role: "Project Manager" },
            { name: "Ana Kim",           initials: "AK", role: "Frontend Dev" },
        ],
        agenda: "Monthly progress review and upcoming milestone planning.",
    },
]

const statusConfig: Record<MeetingStatus, { label: string; icon: React.ElementType; color: string; dot: string }> = {
    scheduled: { label: "Scheduled", icon: Calendar, color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", dot: "bg-amber-500" },
    completed: { label: "Completed", icon: CheckCircle, color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", dot: "bg-emerald-500" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10", dot: "bg-zinc-400" },
    pending: { label: "Pending Approval", icon: HelpCircle, color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", dot: "bg-blue-500" },
    rescheduled: { label: "Rescheduled", icon: RefreshCw, color: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20", dot: "bg-violet-500" },
}

const typeConfig = {
    video: { label: "Video Call", icon: Video },
    call: { label: "Phone Call", icon: MessageSquare },
    in_person: { label: "In Person", icon: MapPin },
}

const tabs = [
    { value: "all", label: "All" },
    { value: "scheduled", label: "Scheduled" },
    { value: "pending", label: "Pending" },
    { value: "rescheduled", label: "Rescheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
]

// ── Calendar mini view ────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function MiniCalendar({ meetings, onSelectDate, selectedDate }: {
    meetings: Meeting[]
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
                <button onClick={() => {
                    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
                    else setViewMonth(m => m - 1)
                }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 transition-colors">
                    <ChevronLeft size={14} />
                </button>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{MONTHS[viewMonth]} {viewYear}</p>
                <button onClick={() => {
                    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
                    else setViewMonth(m => m + 1)
                }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 transition-colors">
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
                    const dayMeetings = meetings.filter((m: Meeting) => m.dateISO === iso)
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
                            {/* Date number */}
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

                            {/* Meeting titles */}
                            {hasMeeting && (
                                <div className="mt-0.5 w-full flex flex-col gap-0.5">
                                    {dayMeetings.slice(0, 1).map((m: Meeting, idx: number) => (
                                        <span key={idx} className={cn(
                                            "block w-full truncate text-[8px] font-semibold leading-tight px-0.5 rounded",
                                            isSelected
                                                ? "text-zinc-950/70"
                                                : "text-emerald-700 dark:text-emerald-400"
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

                            {/* Today dot */}
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

// ── Request Meeting Modal ─────────────────────────────────────

function RequestMeetingModal({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState("")
    const [project, setProject] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [duration, setDuration] = useState("60")
    const [type, setType] = useState("video")
    const [agenda, setAgenda] = useState("")
    const [sent, setSent] = useState(false)

    const projects = ["E-Commerce Web App", "Mobile App (iOS/Android)", "Dashboard Redesign", "SEO & Content Strategy", "Virtual Assistant Support"]
    const durations = ["15", "30", "45", "60", "90", "120"]
    const types = [
        { value: "video", label: "Video Call" },
        { value: "call", label: "Phone Call" },
        { value: "in_person", label: "In Person" },
    ]

    const canSubmit = title && project && date && time

    const handleSubmit = () => {
        if (!canSubmit) return
        setSent(true)
        setTimeout(() => { setSent(false); onClose() }, 1800)
    }

    const inputCls = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-white/5 outline-none focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            <Calendar size={15} className="text-amber-500 dark:text-amber-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base">Request a Meeting</h2>
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">We'll confirm within 24 hours</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">Meeting Title <span className="text-amber-500">*</span></label>
                        <input className={inputCls} placeholder="e.g. Sprint Review" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">Project <span className="text-amber-500">*</span></label>
                        <div className="relative">
                            <select className={`${inputCls} appearance-none`} value={project} onChange={(e) => setProject(e.target.value)}>
                                <option value="">Select project</option>
                                {projects.map((p) => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">Preferred Date <span className="text-amber-500">*</span></label>
                            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">Preferred Time <span className="text-amber-500">*</span></label>
                            <input type="time" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">Duration</label>
                            <div className="relative">
                                <select className={`${inputCls} appearance-none`} value={duration} onChange={(e) => setDuration(e.target.value)}>
                                    {durations.map((d) => <option key={d} value={d}>{d} mins</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">Meeting Type</label>
                            <div className="flex flex-col gap-1.5">
                                {types.map((t) => (
                                    <button key={t.value} onClick={() => setType(t.value)}
                                        className={cn("px-3 py-1.5 rounded-xl border text-xs font-semibold text-left transition-all",
                                            type === t.value
                                                ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20 text-amber-600 dark:text-amber-400"
                                                : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                        )}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">Agenda / Notes</label>
                        <textarea rows={3} className={inputCls} placeholder="What would you like to discuss?"
                            value={agenda} onChange={(e) => setAgenda(e.target.value)} />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <Button onClick={handleSubmit} disabled={!canSubmit}
                            className={cn("flex-1 rounded-xl font-bold h-11 gap-2 transition-all",
                                sent ? "bg-emerald-400 text-zinc-950" : "bg-amber-400 hover:bg-amber-300 text-zinc-950 disabled:opacity-40"
                            )}>
                            {sent ? <><CheckCircle size={14} /> Requested!</> : <><Send size={14} /> Send Request</>}
                        </Button>
                        <Button variant="outline" onClick={onClose} className="rounded-xl border-zinc-200 dark:border-white/10 h-11 px-5">Cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Cancel/Reschedule Modal ───────────────────────────────────

function CancelModal({ meeting, onClose }: { meeting: Meeting; onClose: () => void }) {
    const [mode, setMode] = useState<"cancel" | "reschedule">("cancel")
    const [reason, setReason] = useState("")
    const [newDate, setNewDate] = useState("")
    const [newTime, setNewTime] = useState("")
    const [sent, setSent] = useState(false)

    const handleSubmit = () => {
        setSent(true)
        setTimeout(() => { setSent(false); onClose() }, 1800)
    }

    const inputCls = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-white/5 outline-none focus:border-amber-400 transition-all"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-bold text-zinc-900 dark:text-white text-base">Modify Meeting</h2>
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
                        { value: "cancel", label: "Cancel Meeting", icon: XCircle },
                    ].map((m) => (
                        <button key={m.value} onClick={() => setMode(m.value as "cancel" | "reschedule")}
                            className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                                mode === m.value
                                    ? m.value === "cancel"
                                        ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
                                        : "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20 text-amber-600 dark:text-amber-400"
                                    : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                            )}>
                            <m.icon size={13} /> {m.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    {mode === "reschedule" && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">New Date</label>
                                <input type="date" className={inputCls} value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">New Time</label>
                                <input type="time" className={inputCls} value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">Reason</label>
                        <textarea rows={3} className={inputCls} placeholder="Optional — let us know why"
                            value={reason} onChange={(e) => setReason(e.target.value)} />
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleSubmit}
                            className={cn("flex-1 rounded-xl font-bold h-11 gap-2 transition-all",
                                sent ? "bg-emerald-400 text-zinc-950" :
                                    mode === "cancel" ? "bg-red-500 hover:bg-red-400 text-white" : "bg-amber-400 hover:bg-amber-300 text-zinc-950"
                            )}>
                            {sent ? <><CheckCircle size={14} /> Done!</> : mode === "cancel" ? <><XCircle size={14} /> Confirm Cancel</> : <><RefreshCw size={14} /> Reschedule</>}
                        </Button>
                        <Button variant="outline" onClick={onClose} className="rounded-xl border-zinc-200 dark:border-white/10 h-11 px-5">Back</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Meeting Detail Panel ──────────────────────────────────────

function MeetingDetail({ meeting, onClose, onModify }: {
    meeting: Meeting
    onClose: () => void
    onModify: () => void
}) {
    const cfg = statusConfig[meeting.status]
    const StatusIcon = cfg.icon
    const typeCfg = typeConfig[meeting.type]
    const TypeIcon = typeCfg.icon
    const canModify = meeting.status === "scheduled" || meeting.status === "pending" || meeting.status === "rescheduled"
    const canJoin = meeting.status === "scheduled" && meeting.joinUrl

    return (
        <div className="flex flex-col h-full overflow-y-auto">

            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <TypeIcon size={13} className="text-zinc-400 dark:text-zinc-600 shrink-0" />
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">{typeCfg.label}</p>
                        </div>
                        <h2 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight">{meeting.title}</h2>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{meeting.project}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold", cfg.color)}>
                            <StatusIcon size={11} />{cfg.label}
                        </span>
                        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Date/time/duration row */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
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
                    {meeting.attendees.map((a) => (
                        <div key={a.name} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-xs font-black text-zinc-950 shrink-0">
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
                {canJoin && (
                    <a href={meeting.joinUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2">
                            <Video size={14} /> Join Meeting
                        </Button>
                    </a>
                )}
                {meeting.joinUrl && meeting.status === "scheduled" && (
                    <button onClick={() => navigator.clipboard.writeText(meeting.joinUrl!)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all">
                        <LinkIcon size={12} /> Copy Join Link
                    </button>
                )}
                {canModify && (
                    <Button onClick={onModify} variant="outline"
                        className="w-full rounded-xl border-zinc-200 dark:border-white/10 h-10 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <RefreshCw size={13} /> Cancel or Reschedule
                    </Button>
                )}
            </div>
        </div>
    )
}

// ── Skeleton ──────────────────────────────────────────────────

function Sk({ className }: { className?: string }) {
    return <div className={cn("animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800", className)} />
}

export function MeetingsPageSkeleton() {
    return (
        <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <div className="px-6 md:px-8 pt-8 pb-6 border-b border-zinc-200 dark:border-white/5 shrink-0">
                <div className="flex items-start justify-between mb-6">
                    <div><Sk className="h-7 w-28 mb-2" /><Sk className="h-4 w-52" /></div>
                    <Sk className="h-10 w-36 rounded-xl" />
                </div>
                <div className="flex gap-2">
                    {Array.from({ length: 6 }).map((_, i) => <Sk key={i} className="h-8 w-20 rounded-lg" />)}
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-full md:w-80 lg:w-96 border-r border-zinc-200 dark:border-white/5 flex flex-col">
                    <Sk className="h-64 m-4 rounded-2xl" />
                    <div className="px-4 flex flex-col gap-0">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex gap-4 py-4 border-b border-zinc-100 dark:border-white/5">
                                <Sk className="w-2 h-2 rounded-full mt-1 shrink-0" />
                                <div className="flex-1">
                                    <Sk className="h-4 w-40 mb-2" />
                                    <Sk className="h-3 w-28 mb-2" />
                                    <Sk className="h-5 w-20 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden md:flex flex-1 items-center justify-center bg-white dark:bg-zinc-900">
                    <div className="text-center">
                        <Sk className="w-14 h-14 rounded-2xl mx-auto mb-3" />
                        <Sk className="h-4 w-48 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────

export default function Meetings() {
    const [activeTab, setActiveTab] = useState("all")
    const [selected, setSelected] = useState<Meeting | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [showRequest, setShowRequest] = useState(false)
    const [showModify, setShowModify] = useState(false)

    const filtered = useMemo(() => {
        return mockMeetings
            .filter((m) => activeTab === "all" || m.status === activeTab)
            .filter((m) => !selectedDate || m.dateISO === selectedDate)
            .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
    }, [activeTab, selectedDate])

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { all: mockMeetings.length }
        mockMeetings.forEach((m) => { counts[m.status] = (counts[m.status] ?? 0) + 1 })
        return counts
    }, [])

    const upcoming = useMemo(() =>
        mockMeetings.filter((m) => m.status === "scheduled" || m.status === "pending")
            .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
            .slice(0, 3),
        []
    )

    const LIST_PER_PAGE = 5
    const [listPage, setListPage] = useState(0)

    const filteredPaged = filtered.slice(listPage * LIST_PER_PAGE, (listPage + 1) * LIST_PER_PAGE)
    const listTotalPages = Math.ceil(filtered.length / LIST_PER_PAGE)

    return (
        <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">

            {/* Header */}
            <div className="px-6 md:px-8 pt-8 pb-5 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/5 shrink-0">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Meetings</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Schedule, view, and manage your meetings.</p>
                    </div>
                    <Button onClick={() => setShowRequest(true)}
                        className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-10 gap-2 px-4 shrink-0">
                        <Plus size={14} /> Request Meeting
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl overflow-x-auto">
                    {tabs.map((tab) => (
                        <button key={tab.value}
                            onClick={() => { setActiveTab(tab.value); setSelected(null); setSelectedDate(null); setListPage(0) }}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                                activeTab === tab.value
                                    ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            )}>
                            {tab.label}
                            {(tabCounts[tab.value] ?? 0) > 0 && (
                                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                    activeTab === tab.value ? "bg-white/20 text-inherit" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
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
                    "flex flex-col overflow-y-auto border-r border-zinc-200 dark:border-white/5 shrink-0",
                    selected ? "hidden md:flex md:w-80 lg:w-[380px]" : "w-full"
                )}>
                    {/* Mini calendar */}
                    <div className="p-4 border-b border-zinc-100 dark:border-white/5">
                        <MiniCalendar
                            meetings={mockMeetings}
                            selectedDate={selectedDate}
                            onSelectDate={(d) => { setSelectedDate(d || null); setSelected(null); setListPage(0) }}
                        />
                        {selectedDate && (
                            <button onClick={() => setSelectedDate(null)}
                                className="mt-2 text-xs text-amber-500 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1">
                                <X size={11} /> Clear date filter
                            </button>
                        )}
                    </div>

                    {/* Upcoming strip (only on "all" tab with no date filter) */}
                    {activeTab === "all" && !selectedDate && (
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-white/5">
                            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2.5">Upcoming</p>
                            <div className="flex flex-col gap-1.5">
                                {upcoming.map((m) => {
                                    const cfg = statusConfig[m.status]
                                    return (
                                        <button key={m.id} onClick={() => setSelected(m)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all text-left group">
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
                            filteredPaged.map((m) => {
                                const cfg = statusConfig[m.status]
                                const isSelected = selected?.id === m.id
                                return (
                                    <button key={m.id} onClick={() => setSelected(m)}
                                        className={cn(
                                            "flex items-start gap-3 px-4 py-4 border-b border-zinc-100 dark:border-white/5 text-left transition-all hover:bg-white dark:hover:bg-zinc-900/50",
                                            isSelected && "bg-white dark:bg-zinc-900 border-l-2 border-l-amber-400"
                                        )}>
                                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", cfg.dot)} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate mb-0.5">{m.title}</p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-600 truncate mb-1.5">{m.project}</p>
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
                    {/* Pagination controls */}
                    {listTotalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-white/5 mt-auto">
                            <button
                                onClick={() => setListPage((p) => Math.max(0, p - 1))}
                                disabled={listPage === 0}
                                className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={13} /> Prev
                            </button>
                            <span className="text-xs text-zinc-400 dark:text-zinc-600 tabular-nums">
                                {listPage + 1} / {listTotalPages}
                            </span>
                            <button
                                onClick={() => setListPage((p) => Math.min(listTotalPages - 1, p + 1))}
                                disabled={listPage === listTotalPages - 1}
                                className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Next <ChevronRight size={13} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right — Detail */}
                {selected ? (
                    <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-white/5 md:hidden">
                            <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                                <ChevronLeft size={12} /> Back
                            </button>
                        </div>
                        <MeetingDetail
                            meeting={selected}
                            onClose={() => setSelected(null)}
                            onModify={() => setShowModify(true)}
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
            {showRequest && <RequestMeetingModal onClose={() => setShowRequest(false)} />}
            {showModify && selected && <CancelModal meeting={selected} onClose={() => setShowModify(false)} />}
        </div>
    )
}