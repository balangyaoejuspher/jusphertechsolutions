import { MessageTeamButton } from "@/components/portal/MessageTeamButton"
import { requireActiveClient } from "@/lib/client-auth"
import { cn } from "@/lib/utils"
import {
    AlertCircle,
    ArrowUpRight,
    Calendar,
    CheckCircle,
    ChevronLeft,
    CircleDot,
    Clock, DollarSign,
    MessageSquare, Paperclip,
    PauseCircle,
    Tag,
    TrendingUp,
    Users
} from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
    return <div className={cn("animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800", className)} />
}

export function ProjectDetailSkeleton() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">
            <Skeleton className="h-4 w-28 mb-6 rounded-lg" />
            <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                    <Skeleton className="h-3 w-24 mb-3" />
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-2 shrink-0">
                    <Skeleton className="h-9 w-24 rounded-xl" />
                    <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-5">
                        <Skeleton className="h-3 w-16 mb-3" />
                        <Skeleton className="h-6 w-24 mb-1" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                            <Skeleton className="h-5 w-32 mb-5" />
                            <div className="flex flex-col gap-4">
                                {Array.from({ length: 4 }).map((_, j) => (
                                    <div key={j} className="flex items-start gap-3">
                                        <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                                        <div className="flex-1">
                                            <Skeleton className="h-4 w-48 mb-1.5" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <Skeleton className="h-5 w-16 rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                            <Skeleton className="h-4 w-24 mb-4" />
                            <div className="flex flex-col gap-3">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="flex justify-between">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ── Mock data ─────────────────────────────────────────────────
const mockProjects = [
    {
        id: "1",
        name: "E-Commerce Web App",
        description: "Full-stack e-commerce platform with product catalog, cart, checkout flow, and Stripe payment integration. Includes admin panel for inventory and order management.",
        status: "in_progress",
        priority: "high",
        progress: 65,
        startDate: "Jan 10, 2026",
        dueDate: "Mar 15, 2026",
        budget: "$8,500",
        spent: "$5,200",
        remaining: "$3,300",
        team: [
            { initials: "JB", name: "Juspher Balangyao", role: "Project Manager", email: "juspher@juspher.com" },
            { initials: "AK", name: "Ana Kim", role: "Frontend Dev", email: "ana@juspher.com" },
            { initials: "RM", name: "Rico Mendez", role: "Backend Dev", email: "rico@juspher.com" },
        ],
        tags: ["Next.js", "PostgreSQL", "Stripe", "Tailwind", "TypeScript"],
        milestones: [
            { label: "Project Kickoff", done: true, date: "Jan 10, 2026", description: "Initial meeting, requirements finalized." },
            { label: "UI/UX Design", done: true, date: "Jan 22, 2026", description: "Figma designs approved by client." },
            { label: "Frontend Development", done: true, date: "Feb 5, 2026", description: "All pages and components built." },
            { label: "Backend API", done: false, date: "Feb 20, 2026", description: "REST API + database schema." },
            { label: "Payment Integration", done: false, date: "Mar 1, 2026", description: "Stripe checkout + webhook setup." },
            { label: "Testing & QA", done: false, date: "Mar 10, 2026", description: "End-to-end testing and bug fixes." },
            { label: "Launch", done: false, date: "Mar 15, 2026", description: "Production deployment and handover." },
        ],
        activity: [
            { id: "a1", text: "Frontend development milestone marked as complete", time: "2 days ago", icon: CheckCircle, color: "emerald" },
            { id: "a2", text: "Ana Kim left a comment on the product listing page", time: "3 days ago", icon: MessageSquare, color: "blue" },
            { id: "a3", text: "Design assets uploaded to project folder", time: "5 days ago", icon: Paperclip, color: "amber" },
            { id: "a4", text: "UI/UX Design milestone approved", time: "Jan 22", icon: CheckCircle, color: "emerald" },
            { id: "a5", text: "Project kickoff meeting completed", time: "Jan 10", icon: CheckCircle, color: "emerald" },
        ],
    },
    {
        id: "2",
        name: "Mobile App (iOS/Android)",
        description: "Cross-platform mobile app for field service management. Features include job scheduling, GPS tracking, offline data sync, and digital signatures.",
        status: "in_progress", priority: "medium", progress: 30,
        startDate: "Feb 1, 2026", dueDate: "Apr 20, 2026",
        budget: "$12,000", spent: "$3,600", remaining: "$8,400",
        team: [
            { initials: "JB", name: "Juspher Balangyao", role: "Project Manager", email: "juspher@juspher.com" },
            { initials: "ML", name: "Mark Lim", role: "Mobile Dev", email: "mark@juspher.com" },
        ],
        tags: ["React Native", "Node.js", "Firebase", "TypeScript"],
        milestones: [
            { label: "Requirements Gathering", done: true, date: "Feb 1, 2026", description: "Scope defined and signed off." },
            { label: "Wireframes", done: true, date: "Feb 8, 2026", description: "All screens wireframed." },
            { label: "Core App Structure", done: false, date: "Feb 22, 2026", description: "Navigation and auth flow." },
            { label: "Offline Mode", done: false, date: "Mar 10, 2026", description: "Local DB + sync logic." },
            { label: "Testing & Launch", done: false, date: "Apr 15, 2026", description: "QA + App Store submission." },
        ],
        activity: [
            { id: "a1", text: "Wireframes approved by client", time: "Feb 8", icon: CheckCircle, color: "emerald" },
            { id: "a2", text: "Requirements document shared", time: "Feb 1", icon: Paperclip, color: "amber" },
        ],
    },
    {
        id: "3",
        name: "Dashboard Redesign",
        description: "Complete UI/UX overhaul of the admin dashboard including new design system, component library, and improved user flows.",
        status: "review", priority: "high", progress: 90,
        startDate: "Jan 20, 2026", dueDate: "Feb 28, 2026",
        budget: "$3,200", spent: "$2,900", remaining: "$300",
        team: [{ initials: "AK", name: "Ana Kim", role: "UI/UX Designer", email: "ana@juspher.com" }],
        tags: ["Figma", "React", "Tailwind"],
        milestones: [
            { label: "Audit & Research", done: true, date: "Jan 20, 2026", description: "Existing UI reviewed." },
            { label: "Design System", done: true, date: "Jan 28, 2026", description: "Tokens and components set." },
            { label: "Component Library", done: true, date: "Feb 5, 2026", description: "All components built." },
            { label: "Implementation", done: true, date: "Feb 18, 2026", description: "Pages implemented." },
            { label: "Client Review", done: false, date: "Feb 28, 2026", description: "Final sign-off pending." },
        ],
        activity: [
            { id: "a1", text: "Implementation complete — awaiting client review", time: "Feb 18", icon: AlertCircle, color: "blue" },
            { id: "a2", text: "Component library delivered", time: "Feb 5", icon: CheckCircle, color: "emerald" },
        ],
    },
    {
        id: "4",
        name: "SEO & Content Strategy",
        description: "6-month SEO campaign with content creation, link building, and technical audit.",
        status: "completed", priority: "low", progress: 100,
        startDate: "Aug 1, 2025", dueDate: "Jan 31, 2026",
        budget: "$4,800", spent: "$4,800", remaining: "$0",
        team: [{ initials: "SV", name: "Sofia Vega", role: "SEO Specialist", email: "sofia@juspher.com" }],
        tags: ["SEO", "Content", "Analytics"],
        milestones: [
            { label: "Technical Audit", done: true, date: "Aug 10, 2025", description: "Site audit completed." },
            { label: "Keyword Strategy", done: true, date: "Aug 20, 2025", description: "Target keywords finalized." },
            { label: "Content Creation", done: true, date: "Oct 15, 2025", description: "12 articles published." },
            { label: "Link Building", done: true, date: "Dec 1, 2025", description: "45 backlinks acquired." },
            { label: "Performance Report", done: true, date: "Jan 31, 2026", description: "Final report delivered." },
        ],
        activity: [
            { id: "a1", text: "Final performance report delivered", time: "Jan 31", icon: CheckCircle, color: "emerald" },
        ],
    },
    {
        id: "5",
        name: "Virtual Assistant Support",
        description: "Dedicated VA for email management, scheduling, and administrative tasks.",
        status: "on_hold", priority: "medium", progress: 45,
        startDate: "Dec 1, 2025", dueDate: "Mar 1, 2026",
        budget: "$2,400", spent: "$1,080", remaining: "$1,320",
        team: [{ initials: "LC", name: "Lea Cruz", role: "Virtual Assistant", email: "lea@juspher.com" }],
        tags: ["Admin Support", "Scheduling", "Email"],
        milestones: [
            { label: "Onboarding", done: true, date: "Dec 1, 2025", description: "Tools and access setup." },
            { label: "Email Setup", done: true, date: "Dec 5, 2025", description: "Inbox management started." },
            { label: "Calendar Management", done: false, date: "TBD", description: "On hold — awaiting resume." },
            { label: "Process Documentation", done: false, date: "TBD", description: "SOPs to be documented." },
        ],
        activity: [
            { id: "a1", text: "Project put on hold by client", time: "Jan 15", icon: PauseCircle, color: "zinc" },
            { id: "a2", text: "Email management setup complete", time: "Dec 5", icon: CheckCircle, color: "emerald" },
        ],
    },
]

// ── Config ────────────────────────────────────────────────────
const statusConfig = {
    in_progress: { label: "In Progress", icon: CircleDot, color: "bg-amber-50  dark:bg-amber-400/10  text-amber-600  dark:text-amber-400  border-amber-200  dark:border-amber-400/20" },
    review: { label: "In Review", icon: AlertCircle, color: "bg-blue-50   dark:bg-blue-400/10   text-blue-600   dark:text-blue-400   border-blue-200   dark:border-blue-400/20" },
    completed: { label: "Completed", icon: CheckCircle, color: "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20" },
    on_hold: { label: "On Hold", icon: PauseCircle, color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10" },
}

const priorityConfig = {
    high: "text-red-500   dark:text-red-400   bg-red-50   dark:bg-red-400/10   border-red-200   dark:border-red-400/20",
    medium: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20",
    low: "text-zinc-500  dark:text-zinc-400  bg-zinc-100 dark:bg-zinc-800     border-zinc-200  dark:border-white/10",
}

const activityColorMap: Record<string, string> = {
    emerald: "bg-emerald-50 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20 text-emerald-500 dark:text-emerald-400",
    blue: "bg-blue-50   dark:bg-blue-400/10   border-blue-200   dark:border-blue-400/20   text-blue-500   dark:text-blue-400",
    amber: "bg-amber-50  dark:bg-amber-400/10  border-amber-200  dark:border-amber-400/20  text-amber-500  dark:text-amber-400",
    zinc: "bg-zinc-100  dark:bg-zinc-800      border-zinc-200   dark:border-white/10      text-zinc-500   dark:text-zinc-400",
}

// ── Content (async) ───────────────────────────────────────────
export async function ProjectDetailContent({ id }: { id: string }) {
    const client = await requireActiveClient()
    if (!client) redirect("/unauthorized")

    const project = mockProjects.find((p) => p.id === id)
    if (!project) notFound()

    const status = statusConfig[project.status as keyof typeof statusConfig]
    const StatusIcon = status.icon
    const doneMilestones = project.milestones.filter((m) => m.done).length
    const budgetPct = Math.round((parseFloat(project.spent.replace(/\D/g, "")) / parseFloat(project.budget.replace(/\D/g, ""))) * 100)

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">

            {/* Back */}
            <Link href="/portal/projects" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 font-semibold mb-6 transition-colors group">
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Projects
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold", status.color)}>
                            <StatusIcon size={11} />{status.label}
                        </span>
                        <span className={cn("inline-flex px-2 py-0.5 rounded-lg border text-[11px] font-semibold capitalize", priorityConfig[project.priority as keyof typeof priorityConfig])}>
                            {project.priority} priority
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-1">{project.name}</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">{project.description}</p>
                </div>
                <MessageTeamButton team={project.team} projectName={project.name} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Progress", value: `${project.progress}%`, sub: `${doneMilestones}/${project.milestones.length} milestones`, icon: TrendingUp },
                    { label: "Due Date", value: project.dueDate, sub: `Started ${project.startDate}`, icon: Calendar },
                    { label: "Budget", value: project.budget, sub: `${project.spent} spent`, icon: DollarSign },
                    { label: "Team Members", value: `${project.team.length}`, sub: project.team.map((t) => t.role).join(", "), icon: Users },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-5">
                        <div className="flex items-center gap-1.5 mb-2">
                            <stat.icon size={12} className="text-zinc-400 dark:text-zinc-600" />
                            <p className="text-xs text-zinc-400 dark:text-zinc-600 font-medium uppercase tracking-wider">{stat.label}</p>
                        </div>
                        <p className="text-lg font-black text-zinc-900 dark:text-white leading-none mb-1">{stat.value}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 truncate">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT col */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Progress card */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <TrendingUp size={14} className="text-amber-500 dark:text-amber-400" />
                            <h2 className="font-bold text-zinc-900 dark:text-white text-sm">Overall Progress</h2>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-zinc-400 dark:text-zinc-600">Completion</span>
                            <span className="text-sm font-black text-zinc-900 dark:text-white">{project.progress}%</span>
                        </div>
                        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
                            <div
                                className={cn("h-full rounded-full transition-all duration-700", project.status === "completed" ? "bg-emerald-400" : "bg-amber-400")}
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>

                        {/* Budget progress */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-zinc-400 dark:text-zinc-600">Budget used</span>
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{project.spent} of {project.budget}</span>
                        </div>
                        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-700", budgetPct > 90 ? "bg-red-400" : "bg-emerald-400")}
                                style={{ width: `${Math.min(budgetPct, 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-600">{budgetPct}% used</span>
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-600">{project.remaining} remaining</span>
                        </div>
                    </div>

                    {/* Milestones */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-amber-500 dark:text-amber-400" />
                                <h2 className="font-bold text-zinc-900 dark:text-white text-sm">Milestones</h2>
                            </div>
                            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600">
                                {doneMilestones} of {project.milestones.length} done
                            </span>
                        </div>

                        <div className="p-6 flex flex-col gap-0">
                            {project.milestones.map((milestone, i) => (
                                <div key={milestone.label} className="flex items-start gap-4 relative">
                                    {/* Vertical line */}
                                    {i < project.milestones.length - 1 && (
                                        <div className={cn(
                                            "absolute left-[11px] top-6 w-0.5 h-full",
                                            milestone.done ? "bg-amber-200 dark:bg-amber-400/20" : "bg-zinc-100 dark:bg-zinc-800"
                                        )} />
                                    )}

                                    {/* Circle */}
                                    <div className={cn(
                                        "relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                                        milestone.done
                                            ? "bg-amber-400 border-amber-400"
                                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                                    )}>
                                        {milestone.done
                                            ? <CheckCircle size={12} className="text-zinc-950" />
                                            : <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                                        }
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-5 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className={cn("text-sm font-semibold", milestone.done ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500")}>
                                                    {milestone.label}
                                                </p>
                                                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{milestone.description}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <Clock size={10} className="text-zinc-400 dark:text-zinc-600" />
                                                <span className="text-[11px] text-zinc-400 dark:text-zinc-600 whitespace-nowrap">{milestone.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                            <Clock size={14} className="text-amber-500 dark:text-amber-400" />
                            <h2 className="font-bold text-zinc-900 dark:text-white text-sm">Activity</h2>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-white/5">
                            {project.activity.map((item) => {
                                const ActivityIcon = item.icon
                                return (
                                    <div key={item.id} className="flex items-start gap-4 px-6 py-4">
                                        <div className={cn("w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5", activityColorMap[item.color])}>
                                            <ActivityIcon size={13} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{item.text}</p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{item.time}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT col */}
                <div className="flex flex-col gap-6">

                    {/* Team */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                            <Users size={14} className="text-amber-500 dark:text-amber-400" />
                            <h2 className="font-bold text-zinc-900 dark:text-white text-sm">Your Team</h2>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-white/5">
                            {project.team.map((member) => (
                                <div key={member.email} className="flex items-center gap-3 px-6 py-4">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-xs font-black text-zinc-950 shrink-0">
                                        {member.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{member.name}</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600">{member.role}</p>
                                    </div>
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400 hover:text-amber-500 hover:border-amber-400/50 transition-all shrink-0"
                                    >
                                        <ArrowUpRight size={12} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project info */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">Project Info</p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Start Date", value: project.startDate },
                                { label: "Due Date", value: project.dueDate },
                                { label: "Budget", value: project.budget },
                                { label: "Spent", value: project.spent },
                                { label: "Remaining", value: project.remaining },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-400 dark:text-zinc-600">{row.label}</span>
                                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Tag size={13} className="text-amber-500 dark:text-amber-400" />
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Tech Stack</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                                <span key={tag} className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Need help */}
                    <div className="relative bg-zinc-900 rounded-2xl p-5 overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/10 rounded-full blur-[50px] pointer-events-none" />
                        <div className="relative">
                            <p className="text-white font-bold text-sm mb-1">Have a question?</p>
                            <p className="text-zinc-400 text-xs leading-relaxed mb-4">Reach out to your project manager directly or open a support ticket.</p>
                            <Link href="/portal/support" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-all w-fit">
                                Open Ticket
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
