import { requireActiveClient } from "@/lib/client-auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import {
    FolderKanban, CheckCircle, CircleDot, PauseCircle,
    ChevronRight, Calendar, Users, TrendingUp, AlertCircle, Layers,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
    return <div className={cn("animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800", className)} />
}

export function ProjectsPageSkeleton() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">
            <div className="mb-8">
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl px-5 py-4">
                        <Skeleton className="h-7 w-8 mb-2" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                        <div className="h-0.5 bg-zinc-100 dark:bg-white/5" />
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-5 w-20 rounded-lg" />
                                        <Skeleton className="h-5 w-14 rounded-lg" />
                                    </div>
                                    <Skeleton className="h-4 w-full mb-1" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                                <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between mb-1.5">
                                    <Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-8" />
                                </div>
                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex gap-4">
                                    <Skeleton className="h-3 w-36" /><Skeleton className="h-3 w-24" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-3 w-20" />
                                    <div className="flex -space-x-1.5">
                                        {Array.from({ length: 3 }).map((_, j) => <Skeleton key={j} className="w-6 h-6 rounded-full" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Mock data ─────────────────────────────────────────────────
const mockProjects = [
    {
        id: "1", name: "E-Commerce Web App",
        description: "Full-stack e-commerce platform with product catalog, cart, and payment integration.",
        status: "in_progress", priority: "high", progress: 65,
        startDate: "Jan 10, 2026", dueDate: "Mar 15, 2026", budget: "$8,500", spent: "$5,200",
        team: [
            { initials: "JB", name: "Juspher Balangyao", role: "Project Manager" },
            { initials: "AK", name: "Ana Kim", role: "Frontend Dev" },
            { initials: "RM", name: "Rico Mendez", role: "Backend Dev" },
        ],
        tags: ["Next.js", "PostgreSQL", "Stripe", "Tailwind"],
        milestones: [
            { label: "Project Kickoff", done: true },
            { label: "UI/UX Design", done: true },
            { label: "Frontend Development", done: true },
            { label: "Backend API", done: false },
            { label: "Payment Integration", done: false },
            { label: "Testing & QA", done: false },
        ],
    },
    {
        id: "2", name: "Mobile App (iOS/Android)",
        description: "Cross-platform mobile app for field service management with offline support.",
        status: "in_progress", priority: "medium", progress: 30,
        startDate: "Feb 1, 2026", dueDate: "Apr 20, 2026", budget: "$12,000", spent: "$3,600",
        team: [
            { initials: "JB", name: "Juspher Balangyao", role: "Project Manager" },
            { initials: "ML", name: "Mark Lim", role: "Mobile Dev" },
        ],
        tags: ["React Native", "Node.js", "Firebase"],
        milestones: [
            { label: "Requirements Gathering", done: true },
            { label: "Wireframes", done: true },
            { label: "Core App Structure", done: false },
            { label: "Offline Mode", done: false },
            { label: "Testing & Launch", done: false },
        ],
    },
    {
        id: "3", name: "Dashboard Redesign",
        description: "Complete UI/UX overhaul of the admin dashboard with new design system.",
        status: "review", priority: "high", progress: 90,
        startDate: "Jan 20, 2026", dueDate: "Feb 28, 2026", budget: "$3,200", spent: "$2,900",
        team: [{ initials: "AK", name: "Ana Kim", role: "UI/UX Designer" }],
        tags: ["Figma", "React", "Tailwind"],
        milestones: [
            { label: "Audit & Research", done: true },
            { label: "Design System", done: true },
            { label: "Component Library", done: true },
            { label: "Implementation", done: true },
            { label: "Client Review", done: false },
        ],
    },
    {
        id: "4", name: "SEO & Content Strategy",
        description: "6-month SEO campaign with content creation, link building, and technical audit.",
        status: "completed", priority: "low", progress: 100,
        startDate: "Aug 1, 2025", dueDate: "Jan 31, 2026", budget: "$4,800", spent: "$4,800",
        team: [{ initials: "SV", name: "Sofia Vega", role: "SEO Specialist" }],
        tags: ["SEO", "Content", "Analytics"],
        milestones: [
            { label: "Technical Audit", done: true },
            { label: "Keyword Strategy", done: true },
            { label: "Content Creation", done: true },
            { label: "Link Building", done: true },
            { label: "Performance Report", done: true },
        ],
    },
    {
        id: "5", name: "Virtual Assistant Support",
        description: "Dedicated VA for email management, scheduling, and administrative tasks.",
        status: "on_hold", priority: "medium", progress: 45,
        startDate: "Dec 1, 2025", dueDate: "Mar 1, 2026", budget: "$2,400", spent: "$1,080",
        team: [{ initials: "LC", name: "Lea Cruz", role: "Virtual Assistant" }],
        tags: ["Admin Support", "Scheduling", "Email"],
        milestones: [
            { label: "Onboarding", done: true },
            { label: "Email Setup", done: true },
            { label: "Calendar Management", done: false },
            { label: "Process Documentation", done: false },
        ],
    },
]

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

// ── Content (async) ───────────────────────────────────────────
async function ProjectsContent() {
    const client = await requireActiveClient()
    if (!client) redirect("/unauthorized")

    const total = mockProjects.length
    const active = mockProjects.filter((p) => p.status === "in_progress").length
    const inReview = mockProjects.filter((p) => p.status === "review").length
    const completed = mockProjects.filter((p) => p.status === "completed").length

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <FolderKanban size={14} className="text-amber-500 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">Client Portal</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">Your Projects</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Track progress, milestones, and your team across all active engagements.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total", value: total },
                    { label: "In Progress", value: active },
                    { label: "In Review", value: inReview },
                    { label: "Completed", value: completed },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl px-5 py-4">
                        <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 font-medium mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {mockProjects.map((project) => {
                    const status = statusConfig[project.status as keyof typeof statusConfig]
                    const StatusIcon = status.icon
                    const doneMilestones = project.milestones.filter((m) => m.done).length

                    return (
                        <div key={project.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-amber-400/30 dark:hover:border-amber-400/20 transition-all duration-200 group">
                            <div className="h-0.5 bg-zinc-100 dark:bg-white/5">
                                <div className="h-full bg-amber-400 transition-all duration-700" style={{ width: `${project.progress}%` }} />
                            </div>
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                                            <h2 className="text-base font-bold text-zinc-900 dark:text-white">{project.name}</h2>
                                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold", status.color)}>
                                                <StatusIcon size={11} />{status.label}
                                            </span>
                                            <span className={cn("inline-flex px-2 py-0.5 rounded-lg border text-[11px] font-semibold capitalize", priorityConfig[project.priority as keyof typeof priorityConfig])}>
                                                {project.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">{project.description}</p>
                                    </div>
                                    <Link href={`/portal/projects/${project.id}`} className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400 transition-all">
                                        View <ChevronRight size={13} />
                                    </Link>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium flex items-center gap-1.5"><TrendingUp size={11} /> Progress</span>
                                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">{project.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full transition-all duration-700", project.status === "completed" ? "bg-emerald-400" : "bg-amber-400")} style={{ width: `${project.progress}%` }} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-600">
                                            <Calendar size={11} /><span>{project.startDate} → {project.dueDate}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-600">
                                            <Layers size={11} /><span>{doneMilestones}/{project.milestones.length} milestones</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-xs">
                                            <span className="text-zinc-400 dark:text-zinc-600">Budget: </span>
                                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{project.budget}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={11} className="text-zinc-400 dark:text-zinc-600 mr-1" />
                                            <div className="flex">
                                                {project.team.map((member, i) => (
                                                    <div key={member.initials + i} title={`${member.name} — ${member.role}`} className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-[10px] font-bold text-zinc-950 border-2 border-white dark:border-zinc-900 -ml-1.5 first:ml-0">
                                                        {member.initials}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center gap-1 flex-wrap">
                                            {project.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-500 text-[11px] font-medium">{tag}</span>
                                            ))}
                                            {project.tags.length > 3 && <span className="text-[11px] text-zinc-400 dark:text-zinc-600">+{project.tags.length - 3}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {mockProjects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 flex items-center justify-center mb-4">
                            <FolderKanban size={22} className="text-zinc-400" />
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">No projects yet</h3>
                        <p className="text-sm text-zinc-400 dark:text-zinc-600 max-w-xs leading-relaxed mb-5">Your active projects will appear here once our team gets started.</p>
                        <Link href="/contact" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all">Start a Project</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────
export default function ProjectsPage() {
    return (
        <ProjectsContent />
    )
}