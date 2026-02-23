import { requireActiveClient } from "@/lib/client-auth"
import { redirect } from "next/navigation"
import {
    FolderKanban,
    Receipt,
    CalendarDays,
    LifeBuoy,
    ArrowRight,
    Clock,
    CheckCircle,
    AlertCircle,
    Sparkles,
    TrendingUp,
    MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"


const mockStats = [
    { label: "Active Projects", value: "3", icon: FolderKanban, color: "amber" },
    { label: "Open Invoices", value: "2", icon: Receipt, color: "emerald" },
    { label: "Upcoming Meetings", value: "1", icon: CalendarDays, color: "blue" },
    { label: "Support Tickets", value: "0", icon: LifeBuoy, color: "violet" },
]

const mockProjects = [
    {
        id: "1",
        name: "E-Commerce Web App",
        status: "in_progress",
        progress: 65,
        dueDate: "Mar 15, 2026",
        team: ["JB", "AK", "RM"],
    },
    {
        id: "2",
        name: "Mobile App (iOS/Android)",
        status: "in_progress",
        progress: 30,
        dueDate: "Apr 20, 2026",
        team: ["JB", "ML"],
    },
    {
        id: "3",
        name: "Dashboard Redesign",
        status: "review",
        progress: 90,
        dueDate: "Feb 28, 2026",
        team: ["AK"],
    },
]

const mockMeetings = [
    {
        id: "1",
        title: "Weekly Project Sync",
        date: "Mon, Feb 24, 2026",
        time: "10:00 AM",
        host: "Juspher Balangyao",
        type: "Google Meet",
    },
]

const mockActivity = [
    { id: "1", text: "Invoice #INV-0042 was sent to your email", time: "2 hours ago", icon: Receipt, color: "emerald" },
    { id: "2", text: "Project milestone approved: UI Mockups", time: "Yesterday", icon: CheckCircle, color: "amber" },
    { id: "3", text: "New message from your project manager", time: "2 days ago", icon: MessageSquare, color: "blue" },
    { id: "4", text: "Meeting scheduled for Feb 24", time: "3 days ago", icon: CalendarDays, color: "violet" },
]

const projectStatusConfig = {
    in_progress: { label: "In Progress", color: "bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-400/20" },
    review: { label: "In Review", color: "bg-blue-50  dark:bg-blue-400/10  text-blue-600  dark:text-blue-400  border-blue-200  dark:border-blue-400/20" },
    completed: { label: "Completed", color: "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20" },
    on_hold: { label: "On Hold", color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10" },
}

const colorMap: Record<string, string> = {
    amber: "bg-amber-50  dark:bg-amber-400/10  border-amber-200  dark:border-amber-400/20  text-amber-500  dark:text-amber-400",
    emerald: "bg-emerald-50 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20 text-emerald-500 dark:text-emerald-400",
    blue: "bg-blue-50   dark:bg-blue-400/10   border-blue-200   dark:border-blue-400/20   text-blue-500   dark:text-blue-400",
    violet: "bg-violet-50 dark:bg-violet-400/10 border-violet-200 dark:border-violet-400/20 text-violet-500 dark:text-violet-400",
}

// ============================================================
// PAGE
// ============================================================

export default async function PortalPage() {
    const client = await requireActiveClient()
    if (!client) redirect("/unauthorized")

    const firstName = client.name.split(" ")[0]
    const hour = new Date().getHours()
    const greeting =
        hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">

            {/* ── Header ── */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-amber-500 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">
                        Client Portal
                    </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
                    {greeting}, {firstName}! 👋
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                    Here's what's happening with your projects today.
                </p>
            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {mockStats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-5"
                    >
                        <div className={cn(
                            "w-9 h-9 rounded-xl border flex items-center justify-center mb-3",
                            colorMap[stat.color]
                        )}>
                            <stat.icon size={16} />
                        </div>
                        <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── LEFT col ── */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Active Projects */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <FolderKanban size={15} className="text-amber-500 dark:text-amber-400" />
                                <h2 className="font-bold text-zinc-900 dark:text-white text-sm">Active Projects</h2>
                            </div>
                            <Link
                                href="/portal/projects"
                                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 font-semibold transition-colors"
                            >
                                View all <ArrowRight size={12} />
                            </Link>
                        </div>

                        <div className="divide-y divide-zinc-100 dark:divide-white/5">
                            {mockProjects.map((project) => {
                                const statusCfg = projectStatusConfig[project.status as keyof typeof projectStatusConfig]
                                return (
                                    <div key={project.id} className="px-6 py-4 hover:bg-zinc-50 dark:hover:bg-white/2 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{project.name}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Clock size={11} className="text-zinc-400" />
                                                    <span className="text-xs text-zinc-400 dark:text-zinc-600">Due {project.dueDate}</span>
                                                </div>
                                            </div>
                                            <span className={cn("px-2 py-0.5 rounded-lg border text-[11px] font-semibold shrink-0", statusCfg.color)}>
                                                {statusCfg.label}
                                            </span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 tabular-nums w-8 text-right">
                                                {project.progress}%
                                            </span>
                                        </div>

                                        {/* Team avatars */}
                                        <div className="flex items-center gap-1 mt-3">
                                            <span className="text-xs text-zinc-400 dark:text-zinc-600 mr-1">Team:</span>
                                            {project.team.map((initials) => (
                                                <div
                                                    key={initials}
                                                    className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 border-2 border-white dark:border-zinc-900 -ml-1 first:ml-0"
                                                >
                                                    {initials}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                            <TrendingUp size={15} className="text-amber-500 dark:text-amber-400" />
                            <h2 className="font-bold text-zinc-900 dark:text-white text-sm">Recent Activity</h2>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-white/5">
                            {mockActivity.map((item) => (
                                <div key={item.id} className="flex items-start gap-4 px-6 py-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5",
                                        colorMap[item.color]
                                    )}>
                                        <item.icon size={13} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{item.text}</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT col ── */}
                <div className="flex flex-col gap-6">

                    {/* Upcoming Meeting */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                            <CalendarDays size={15} className="text-amber-500 dark:text-amber-400" />
                            <h2 className="font-bold text-zinc-900 dark:text-white text-sm">Upcoming Meeting</h2>
                        </div>

                        {mockMeetings.length > 0 ? (
                            <div className="p-6">
                                {mockMeetings.map((meeting) => (
                                    <div key={meeting.id}>
                                        <div className="bg-amber-50 dark:bg-amber-400/5 border border-amber-200 dark:border-amber-400/20 rounded-2xl p-4 mb-4">
                                            <p className="font-bold text-zinc-900 dark:text-white text-sm mb-3">{meeting.title}</p>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                                    <CalendarDays size={11} className="text-amber-500 shrink-0" />
                                                    {meeting.date}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                                    <Clock size={11} className="text-amber-500 shrink-0" />
                                                    {meeting.time} · 30 minutes
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                                    <CheckCircle size={11} className="text-amber-500 shrink-0" />
                                                    Hosted by {meeting.host}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href="/portal/meetings"
                                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400 transition-all"
                                        >
                                            View all meetings <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-zinc-400 dark:text-zinc-600 text-sm mb-3">No upcoming meetings</p>
                                <Link href="/book">
                                    <button className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all">
                                        Book a Meeting
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Client info card */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">
                            Your Account
                        </p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Name", value: client.name },
                                { label: "Email", value: client.email },
                                { label: "Type", value: client.type === "company" ? "Company" : "Individual" },
                                { label: "Status", value: client.status.charAt(0).toUpperCase() + client.status.slice(1) },
                                ...(client.location ? [{ label: "Location", value: client.location }] : []),
                            ].map((row) => (
                                <div key={row.label} className="flex items-start justify-between gap-2">
                                    <span className="text-xs text-zinc-400 dark:text-zinc-600 shrink-0">{row.label}</span>
                                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 text-right truncate max-w-[160px]">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                            {client.services.length > 0 && (
                                <div>
                                    <span className="text-xs text-zinc-400 dark:text-zinc-600 block mb-1.5">Services</span>
                                    <div className="flex flex-wrap gap-1">
                                        {client.services.map((s) => (
                                            <span
                                                key={s}
                                                className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400 text-[11px] font-medium"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <Link
                            href="/portal/settings"
                            className="flex items-center gap-1.5 text-xs text-amber-500 dark:text-amber-400 font-semibold hover:underline mt-4"
                        >
                            Edit profile <ArrowRight size={11} />
                        </Link>
                    </div>

                    {/* Need help */}
                    <div className="relative bg-zinc-900 rounded-2xl p-5 overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-[50px] pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={14} className="text-amber-400" />
                                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Need Help?</span>
                            </div>
                            <p className="text-white font-bold text-sm mb-1">We're here for you</p>
                            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                                Having an issue or question? Our support team typically responds within 2 hours.
                            </p>
                            <Link href="/portal/support">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-all">
                                    <LifeBuoy size={13} />
                                    Open a Ticket
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}