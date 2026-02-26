"use client"

import Link from "next/link"
import {
    Users, FileText, TrendingUp, Clock,
    ArrowUpRight, CheckCircle, Briefcase, MessageSquare,
} from "lucide-react"
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend,
} from "recharts"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { DashboardStats } from "@/types/dashboard"


type ChartType = "area" | "bar"
type ChartMetric = "inquiries" | "placements" | "talent" | "all"


function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 shadow-xl">
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 mb-2 uppercase tracking-widest">{label}</p>
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center gap-2 text-xs font-semibold">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-zinc-500 dark:text-zinc-400 capitalize">{p.name}:</span>
                    <span className="text-zinc-900 dark:text-white">{p.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    )
}

function activityIcon(type: string) {
    if (type === "inquiry") return <MessageSquare size={12} className="text-amber-500" />
    if (type === "placement") return <Briefcase size={12} className="text-emerald-500" />
    return <Users size={12} className="text-blue-500" />
}

function activityDot(type: string) {
    if (type === "inquiry") return "bg-amber-400"
    if (type === "placement") return "bg-emerald-400"
    return "bg-blue-400"
}

const COLORS = {
    inquiries: "#f59e0b",
    placements: "#10b981",
    talent: "#3b82f6",
}

export function DashboardOverviewClient({
    firstName,
    stats,
}: {
    firstName: string | null
    stats: DashboardStats
}) {
    const [chartType, setChartType] = useState<ChartType>("area")
    const [chartMetric, setChartMetric] = useState<ChartMetric>("all")

    const statCards = [
        {
            label: "Total Talent",
            value: stats.totalTalent.toLocaleString(),
            icon: Users,
            change: "Active professionals",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-500/10",
            border: "border-blue-100 dark:border-blue-500/20",
        },
        {
            label: "Inquiries",
            value: stats.totalInquiries.toLocaleString(),
            icon: FileText,
            change: "Client inquiries",
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-500/10",
            border: "border-amber-100 dark:border-amber-500/20",
        },
        {
            label: "Placements",
            value: stats.totalPlacements.toLocaleString(),
            icon: TrendingUp,
            change: "Successful hires",
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            border: "border-emerald-100 dark:border-emerald-500/20",
        },
        {
            label: "Avg. Match Time",
            value: stats.avgMatchTime,
            icon: Clock,
            change: "Time to placement",
            color: "text-violet-500",
            bg: "bg-violet-50 dark:bg-violet-500/10",
            border: "border-violet-100 dark:border-violet-500/20",
        },
    ]

    const metrics: { value: ChartMetric; label: string; color: string }[] = [
        { value: "all", label: "All", color: "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" },
        { value: "inquiries", label: "Inquiries", color: "bg-amber-400 text-zinc-950" },
        { value: "placements", label: "Placements", color: "bg-emerald-400 text-zinc-950" },
        { value: "talent", label: "Talent", color: "bg-blue-400 text-zinc-950" },
    ]

    const showInquiries = chartMetric === "all" || chartMetric === "inquiries"
    const showPlacements = chartMetric === "all" || chartMetric === "placements"
    const showTalent = chartMetric === "all" || chartMetric === "talent"

    return (
        <div className="p-6 md:p-8 lg:p-10 min-h-screen bg-zinc-50 dark:bg-zinc-950">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                    Welcome back{firstName ? `, ${firstName}` : ""}! 👋
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    Here's what's happening with your agency today.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className={cn(
                        "bg-white dark:bg-zinc-900 rounded-2xl border p-6 hover:shadow-md transition-all duration-200 group",
                        stat.border
                    )}>
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                                <stat.icon size={18} className={stat.color} />
                            </div>
                            <ArrowUpRight size={15} className="text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                        </div>
                        <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1 tabular-nums">{stat.value}</div>
                        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">{stat.label}</div>
                        <div className="text-xs text-zinc-400 dark:text-zinc-500">{stat.change}</div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 p-6 mb-6">

                {/* Chart header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="font-bold text-zinc-900 dark:text-white">Performance Overview</h2>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">Last 6 months · based on created dates</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Metric filter */}
                        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                            {metrics.map((m) => (
                                <button
                                    key={m.value}
                                    onClick={() => setChartMetric(m.value)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                        chartMetric === m.value
                                            ? m.color
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                    )}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Chart type toggle */}
                        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
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
                </div>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={280}>
                    {chartType === "area" ? (
                        <AreaChart data={stats.monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                {showInquiries && (
                                    <linearGradient id="gradInquiries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.inquiries} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={COLORS.inquiries} stopOpacity={0} />
                                    </linearGradient>
                                )}
                                {showPlacements && (
                                    <linearGradient id="gradPlacements" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.placements} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={COLORS.placements} stopOpacity={0} />
                                    </linearGradient>
                                )}
                                {showTalent && (
                                    <linearGradient id="gradTalent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.talent} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={COLORS.talent} stopOpacity={0} />
                                    </linearGradient>
                                )}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-10" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            {showInquiries && <Area type="monotone" dataKey="inquiries" name="Inquiries" stroke={COLORS.inquiries} strokeWidth={2} fill="url(#gradInquiries)" dot={{ r: 3, fill: COLORS.inquiries, strokeWidth: 0 }} activeDot={{ r: 5 }} />}
                            {showPlacements && <Area type="monotone" dataKey="placements" name="Placements" stroke={COLORS.placements} strokeWidth={2} fill="url(#gradPlacements)" dot={{ r: 3, fill: COLORS.placements, strokeWidth: 0 }} activeDot={{ r: 5 }} />}
                            {showTalent && <Area type="monotone" dataKey="talent" name="Talent" stroke={COLORS.talent} strokeWidth={2} fill="url(#gradTalent)" dot={{ r: 3, fill: COLORS.talent, strokeWidth: 0 }} activeDot={{ r: 5 }} />}
                        </AreaChart>
                    ) : (
                        <BarChart data={stats.monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-10" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                            {showInquiries && <Bar dataKey="inquiries" name="Inquiries" fill={COLORS.inquiries} radius={[4, 4, 0, 0]} maxBarSize={32} />}
                            {showPlacements && <Bar dataKey="placements" name="Placements" fill={COLORS.placements} radius={[4, 4, 0, 0]} maxBarSize={32} />}
                            {showTalent && <Bar dataKey="talent" name="Talent" fill={COLORS.talent} radius={[4, 4, 0, 0]} maxBarSize={32} />}
                        </BarChart>
                    )}
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                    {[
                        { label: "Inquiries", color: COLORS.inquiries },
                        { label: "Placements", color: COLORS.placements },
                        { label: "Talent", color: COLORS.talent },
                    ].map((l) => (
                        <div key={l.label} className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                            {l.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Activity Feed */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-zinc-900 dark:text-white">Recent Activity</h2>
                        <Link href="/dashboard/activity" className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                            View all →
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        {stats.recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                    activity.type === "inquiry" ? "bg-amber-50   dark:bg-amber-500/10" :
                                        activity.type === "placement" ? "bg-emerald-50 dark:bg-emerald-500/10" :
                                            "bg-blue-50    dark:bg-blue-500/10"
                                )}>
                                    {activityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{activity.text}</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{activity.time}</p>
                                </div>
                                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-2", activityDot(activity.type))} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 p-6">
                    <h2 className="font-bold text-zinc-900 dark:text-white mb-6">Quick Actions</h2>
                    <div className="flex flex-col gap-3">
                        {[
                            { label: "Add New Talent", href: "/dashboard/talent", color: "bg-amber-400 text-zinc-950 hover:bg-amber-300" },
                            { label: "View Inquiries", href: "/dashboard/inquiries", color: "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-700 dark:hover:bg-zinc-100" },
                            { label: "Manage Clients", href: "/dashboard/clients", color: "bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10" },
                            { label: "Meetings", href: "/dashboard/meetings", color: "bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10" },
                            { label: "Settings", href: "/dashboard/settings", color: "bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10" },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className={cn(
                                    "flex items-center justify-between px-5 py-3.5 rounded-xl font-medium text-sm transition-all",
                                    action.color
                                )}
                            >
                                {action.label}
                                <ArrowUpRight size={15} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}