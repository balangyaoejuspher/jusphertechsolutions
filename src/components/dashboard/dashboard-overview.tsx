"use client"

import { cn } from "@/lib/utils"
import type { DashboardStats } from "@/types/dashboard"
import {
    AlertCircle,
    ArrowUpRight,
    BadgeCheck,
    Briefcase,
    Clock,
    DollarSign,
    MessageSquare,
    Receipt,
    RefreshCw,
    UserPlus,
    Users
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis,
} from "recharts"
import { AnimatedNumber } from "@/components/shared/animated-number"
import { portalFetch } from "@/lib/api/private-fetcher"
import { toast } from "sonner"

type ChartType = "area" | "bar"
type ChartMetric = "inquiries" | "placements" | "revenue" | "all"

const COLORS = {
    inquiries: "#f59e0b",
    placements: "#10b981",
    talent: "#3b82f6",
    revenue: "#a855f7",
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 shadow-2xl shadow-zinc-200/60 dark:shadow-black/40">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 mb-2.5 uppercase tracking-widest">{label}</p>
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center gap-2.5 text-xs font-semibold mb-1 last:mb-0">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                    <span className="text-zinc-500 dark:text-zinc-400 capitalize">{p.name}:</span>
                    <span className="text-zinc-900 dark:text-white">
                        {p.name === "revenue" ? `$${Number(p.value).toLocaleString()}` : p.value.toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    )
}

const ACTIVITY_CONFIG = {
    inquiry: { icon: MessageSquare, bg: "bg-amber-50 dark:bg-amber-500/10", dot: "bg-amber-400", color: "text-amber-500" },
    placement: { icon: Briefcase, bg: "bg-emerald-50 dark:bg-emerald-500/10", dot: "bg-emerald-400", color: "text-emerald-500" },
    talent: { icon: UserPlus, bg: "bg-blue-50 dark:bg-blue-500/10", dot: "bg-blue-400", color: "text-blue-500" },
    invoice: { icon: Receipt, bg: "bg-violet-50 dark:bg-violet-500/10", dot: "bg-violet-400", color: "text-violet-500" },
}

const INVOICE_STATUS_BADGE: Record<string, string> = {
    paid: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    unpaid: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    overdue: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
    partial: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    draft: "bg-zinc-100 dark:bg-white/5 text-zinc-500",
}

function StatCard({
    label, value, sub, icon: Icon, color, bg, border, prefix = "", suffix = "",
    badge, badgeColor, href,
}: {
    label: string
    value: number
    sub: string
    icon: React.ElementType
    color: string
    bg: string
    border: string
    prefix?: string
    suffix?: string
    badge?: string
    badgeColor?: string
    href?: string
}) {
    const inner = (
        <div className={cn(
            "relative bg-white dark:bg-zinc-900 rounded-2xl border p-5 transition-all duration-200 group overflow-hidden",
            border,
            href && "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
        )}>
            {/* Subtle glow on hover */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl",
                bg
            )} style={{ opacity: 0 }} />

            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
                        <Icon size={17} className={color} />
                    </div>
                    <div className="flex items-center gap-2">
                        {badge && (
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-lg", badgeColor)}>
                                {badge}
                            </span>
                        )}
                        {href && (
                            <ArrowUpRight size={14} className="text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                        )}
                    </div>
                </div>

                <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1 tabular-nums tracking-tight">
                    <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
                </div>
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-0.5">{label}</div>
                <div className="text-xs text-zinc-400 dark:text-zinc-500">{sub}</div>
            </div>
        </div>
    )

    return href ? <Link href={href}>{inner}</Link> : inner
}

function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <div>
                <h2 className="font-bold text-zinc-900 dark:text-white text-base">{title}</h2>
                {sub && <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{sub}</p>}
            </div>
            {action}
        </div>
    )
}

export function DashboardOverviewClient({
    firstName,
}: {
    firstName: string | null
}) {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [chartType, setChartType] = useState<ChartType>("area")
    const [chartMetric, setChartMetric] = useState<ChartMetric>("all")
    const [refreshing, setRefreshing] = useState(false)

    async function fetchStats(silent = false) {
        if (!silent) setLoading(true)
        else setRefreshing(true)

        portalFetch.get<DashboardStats>("/admin/dashboard/stats")
            .then(setStats)
            .catch(() => toast.error("Failed to load dashboard stats"))
            .finally(() => {
                setLoading(false)
                setRefreshing(false)
            })
    }

    useEffect(() => { fetchStats() }, [])

    const showInquiries = chartMetric === "all" || chartMetric === "inquiries"
    const showPlacements = chartMetric === "all" || chartMetric === "placements"
    const showRevenue = chartMetric === "all" || chartMetric === "revenue"

    const statCards = stats ? [
        {
            label: "Vetted Talent",
            value: stats.vettedTalent,
            sub: `${stats.totalTalent} total in network`,
            icon: BadgeCheck,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-500/10",
            border: "border-blue-100 dark:border-blue-500/20",
            href: "/dashboard/talent",
        },
        {
            label: "Open Inquiries",
            value: stats.openInquiries,
            sub: `${stats.totalInquiries} total inquiries`,
            icon: MessageSquare,
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-500/10",
            border: "border-amber-100 dark:border-amber-500/20",
            badge: stats.openInquiries > 0 ? "Needs action" : undefined,
            badgeColor: "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
            href: "/dashboard/inquiries",
        },
        {
            label: "Active Placements",
            value: stats.activePlacements,
            sub: `${stats.totalPlacements} total placements`,
            icon: Briefcase,
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            border: "border-emerald-100 dark:border-emerald-500/20",
            href: "/dashboard/placements",
        },
        {
            label: "New Clients",
            value: stats.newClientsThisMonth,
            sub: `${stats.totalClients} total clients`,
            icon: Users,
            color: "text-cyan-500",
            bg: "bg-cyan-50 dark:bg-cyan-500/10",
            border: "border-cyan-100 dark:border-cyan-500/20",
            badge: "This month",
            badgeColor: "bg-zinc-100 dark:bg-white/5 text-zinc-500",
            href: "/dashboard/clients",
        },
        {
            label: "Total Revenue",
            value: stats.totalRevenue,
            sub: "From paid invoices",
            icon: DollarSign,
            color: "text-violet-500",
            bg: "bg-violet-50 dark:bg-violet-500/10",
            border: "border-violet-100 dark:border-violet-500/20",
            prefix: "$",
            href: "/dashboard/invoices",
        },
        {
            label: "Pending Revenue",
            value: stats.pendingRevenue,
            sub: `${stats.pendingInvoices} unpaid invoices`,
            icon: AlertCircle,
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-500/10",
            border: "border-red-100 dark:border-red-500/20",
            prefix: "$",
            badge: stats.pendingInvoices > 0 ? `${stats.pendingInvoices} pending` : undefined,
            badgeColor: "bg-red-50 dark:bg-red-500/10 text-red-500",
            href: "/dashboard/invoices",
        },
    ] : []

    const chartMetrics: { value: ChartMetric; label: string }[] = [
        { value: "all", label: "All" },
        { value: "inquiries", label: "Inquiries" },
        { value: "placements", label: "Placements" },
        { value: "revenue", label: "Revenue" },
    ]

    const greetingHour = new Date().getHours()
    const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening"

    if (loading) {
        return (
            <div className="p-5 md:p-8 lg:p-10 min-h-screen bg-zinc-50 dark:bg-zinc-950">

                {/* Header skeleton */}
                <div className="mb-8">
                    <div className="h-3 w-24 bg-zinc-200 dark:bg-white/5 rounded-lg animate-pulse mb-2" />
                    <div className="h-8 w-56 bg-zinc-200 dark:bg-white/5 rounded-xl animate-pulse mb-2" />
                    <div className="h-3 w-40 bg-zinc-200 dark:bg-white/5 rounded-lg animate-pulse" />
                </div>

                {/* Stat cards skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/5 animate-pulse" />
                                <div className="w-16 h-5 rounded-lg bg-zinc-100 dark:bg-white/5 animate-pulse" />
                            </div>
                            <div className="h-8 w-24 bg-zinc-100 dark:bg-white/5 rounded-xl animate-pulse mb-2" />
                            <div className="h-3.5 w-32 bg-zinc-100 dark:bg-white/5 rounded-lg animate-pulse mb-1.5" />
                            <div className="h-3 w-24 bg-zinc-100 dark:bg-white/5 rounded-lg animate-pulse" />
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 p-6 mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="h-4 w-44 bg-zinc-100 dark:bg-white/5 rounded-lg animate-pulse mb-2" />
                            <div className="h-3 w-32 bg-zinc-100 dark:bg-white/5 rounded-lg animate-pulse" />
                        </div>
                        <div className="h-8 w-48 bg-zinc-100 dark:bg-white/5 rounded-xl animate-pulse" />
                    </div>
                    <div className="h-[260px] bg-zinc-50 dark:bg-white/[0.02] rounded-2xl animate-pulse" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 p-6">
                        <div className="h-4 w-36 bg-zinc-100 dark:bg-white/5 rounded-lg animate-pulse mb-5" />
                        <div className="flex flex-col gap-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-start gap-3 py-3 border-b border-zinc-50 dark:border-white/[0.03] last:border-0">
                                    <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-white/5 animate-pulse shrink-0" />
                                    <div className="flex-1">
                                        <div className="h-3.5 w-3/4 bg-zinc-100 dark:bg-white/5 rounded-lg animate-pulse mb-2" />
                                        <div className="h-3 w-16 bg-zinc-100 dark:bg-white/5 rounded-lg animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 p-6">
                        <div className="h-4 w-28 bg-zinc-100 dark:bg-white/5 rounded-lg animate-pulse mb-5" />
                        <div className="flex flex-col gap-2">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="h-11 rounded-xl bg-zinc-50 dark:bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-5 md:p-8 lg:p-10 min-h-screen bg-zinc-50 dark:bg-zinc-950">

            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-8 gap-4">
                <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                        {greeting}
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        {firstName ? `${firstName}'s Dashboard` : "Dashboard"}
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                </div>
                <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-white/10 transition-all disabled:opacity-50"
                >
                    <RefreshCw size={13} className={cn(refreshing && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {statCards.map((card) => (
                    <StatCard key={card.label} {...card} />
                ))}
            </div>

            {/* ── Chart ── */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 p-6 mb-6">
                <SectionHeader
                    title="Performance Overview"
                    sub="Last 6 months · based on created dates"
                    action={
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                            {/* Metric filter */}
                            <div className="flex items-center gap-0.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                {chartMetrics.map((m) => (
                                    <button
                                        key={m.value}
                                        onClick={() => setChartMetric(m.value)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                            chartMetric === m.value
                                                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                        )}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>

                            {/* Chart type */}
                            <div className="flex items-center gap-0.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                {(["area", "bar"] as ChartType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setChartType(type)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                                            chartType === type
                                                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    }
                />

                <ResponsiveContainer width="100%" height={260}>
                    {chartType === "area" ? (
                        <AreaChart data={stats?.monthlyData ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                {showInquiries && <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.inquiries} stopOpacity={0.12} /><stop offset="95%" stopColor={COLORS.inquiries} stopOpacity={0} /></linearGradient>}
                                {showPlacements && <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.placements} stopOpacity={0.12} /><stop offset="95%" stopColor={COLORS.placements} stopOpacity={0} /></linearGradient>}
                                {showRevenue && <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.revenue} stopOpacity={0.12} /><stop offset="95%" stopColor={COLORS.revenue} stopOpacity={0} /></linearGradient>}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-[0.06]" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            {showInquiries && <Area type="monotone" dataKey="inquiries" name="inquiries" stroke={COLORS.inquiries} strokeWidth={2} fill="url(#gI)" dot={{ r: 3, fill: COLORS.inquiries, strokeWidth: 0 }} activeDot={{ r: 5 }} />}
                            {showPlacements && <Area type="monotone" dataKey="placements" name="placements" stroke={COLORS.placements} strokeWidth={2} fill="url(#gP)" dot={{ r: 3, fill: COLORS.placements, strokeWidth: 0 }} activeDot={{ r: 5 }} />}
                            {showRevenue && <Area type="monotone" dataKey="revenue" name="revenue" stroke={COLORS.revenue} strokeWidth={2} fill="url(#gR)" dot={{ r: 3, fill: COLORS.revenue, strokeWidth: 0 }} activeDot={{ r: 5 }} />}
                        </AreaChart>
                    ) : (
                        <BarChart data={stats?.monthlyData ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-[0.06]" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                            {showInquiries && <Bar dataKey="inquiries" name="inquiries" fill={COLORS.inquiries} radius={[4, 4, 0, 0]} maxBarSize={28} />}
                            {showPlacements && <Bar dataKey="placements" name="placements" fill={COLORS.placements} radius={[4, 4, 0, 0]} maxBarSize={28} />}
                            {showRevenue && <Bar dataKey="revenue" name="revenue" fill={COLORS.revenue} radius={[4, 4, 0, 0]} maxBarSize={28} />}
                        </BarChart>
                    )}
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex items-center gap-5 mt-4 flex-wrap">
                    {[
                        { label: "Inquiries", color: COLORS.inquiries },
                        { label: "Placements", color: COLORS.placements },
                        { label: "Revenue", color: COLORS.revenue },
                    ].map((l) => (
                        <div key={l.label} className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                            {l.label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 p-6">
                    <SectionHeader
                        title="Recent Activity"
                        sub="Latest across all modules"
                        action={
                            <Link href="/dashboard/activity" className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
                                View all <ArrowUpRight size={12} />
                            </Link>
                        }
                    />
                    <div className="flex flex-col divide-y divide-zinc-50 dark:divide-white/[0.03]">
                        {(stats?.recentActivity ?? []).map((activity, i) => {
                            const config = ACTIVITY_CONFIG[activity.type]
                            const Icon = config.icon
                            return (
                                <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 group">
                                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5", config.bg)}>
                                        <Icon size={14} className={config.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{activity.text}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500">{activity.time}</p>
                                            {activity.meta && (
                                                <span className={cn(
                                                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-md capitalize",
                                                    INVOICE_STATUS_BADGE[activity.meta] ?? "bg-zinc-100 text-zinc-500"
                                                )}>
                                                    {activity.meta}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-2.5", config.dot)} />
                                </div>
                            )
                        })}
                        {(!stats?.recentActivity?.length) && (
                            <p className="text-sm text-zinc-400 py-8 text-center">No recent activity yet.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions — narrower */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 p-6">
                    <SectionHeader title="Quick Actions" />
                    <div className="flex flex-col gap-2">
                        {[
                            { label: "Add New Talent", href: "/dashboard/talent", accent: true },
                            { label: "View Inquiries", href: "/dashboard/inquiries", accent: false, highlight: true },
                            { label: "Manage Placements", href: "/dashboard/placements", accent: false },
                            { label: "Clients", href: "/dashboard/clients", accent: false },
                            { label: "Invoices", href: "/dashboard/invoices", accent: false },
                            { label: "Announcements", href: "/dashboard/announcements", accent: false },
                            { label: "Settings", href: "/dashboard/settings", accent: false },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all group",
                                    action.accent
                                        ? "bg-amber-400 hover:bg-amber-300 text-zinc-950"
                                        : action.highlight
                                            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-700 dark:hover:bg-zinc-100"
                                            : "bg-zinc-50 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white"
                                )}
                            >
                                {action.label}
                                <ArrowUpRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>

                    {/* Avg match time pill */}
                    {stats?.avgMatchTime && (
                        <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                <Clock size={14} className="text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-zinc-900 dark:text-white">{stats.avgMatchTime}</p>
                                <p className="text-[10px] text-zinc-400">Average time to placement</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}