"use client"

import { useEffect, useState, useCallback, useTransition } from "react"
import { Search, ChevronLeft, ChevronRight, Activity, User, Bot, Shield, RefreshCw, X, Clock, Filter } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { CustomSelect } from "@/components/ui/custom-select"
import { toast } from "sonner"
import { portalFetch } from "@/lib/api/private-fetcher"

type ActivityActor = "admin" | "client" | "system"

type ActivityType =
    | "admin_created" | "admin_updated" | "admin_deleted"
    | "talent_created" | "talent_updated" | "talent_deleted"
    | "inquiry_received" | "inquiry_status_changed" | "inquiry_assigned" | "inquiry_resolved"
    | "client_created" | "client_updated" | "client_deleted" | "client_status_changed"
    | "invoice_created" | "invoice_sent" | "invoice_paid" | "invoice_overdue" | "invoice_disputed"
    | "ticket_opened" | "ticket_replied" | "ticket_resolved" | "ticket_status_changed"
    | "portal_login" | "portal_invoice_viewed" | "portal_project_viewed"
    | "auth_sign_in" | "auth_sign_out"
    | "service_created" | "service_updated" | "service_deleted"
    | "placement_created" | "placement_updated" | "placement_completed" | "placement_terminated" | "placement_on_hold" | "placement_deleted"
    | "product_created" | "product_updated" | "product_deleted"
    | "post_created" | "post_updated" | "post_deleted" | "post_published" | "post_unpublished"

interface ActivityLog {
    id: string
    actorType: ActivityActor
    actorId: string
    actorName: string
    type: ActivityType
    summary: string
    entityType: string | null
    entityId: string | null
    entityLabel: string | null
    metadata: Record<string, unknown> | null
    createdAt: string
}

interface PaginatedResponse {
    data: ActivityLog[]
    total: number
    page: number
    pageSize: number
}

const TYPE_GROUPS: Record<string, ActivityType[]> = {
    Admin: ["admin_created", "admin_updated", "admin_deleted"],
    Talent: ["talent_created", "talent_updated", "talent_deleted"],
    Inquiry: ["inquiry_received", "inquiry_status_changed", "inquiry_assigned", "inquiry_resolved"],
    Client: ["client_created", "client_updated", "client_deleted", "client_status_changed"],
    Invoice: ["invoice_created", "invoice_sent", "invoice_paid", "invoice_overdue", "invoice_disputed"],
    Ticket: ["ticket_opened", "ticket_replied", "ticket_resolved", "ticket_status_changed"],
    Portal: ["portal_login", "portal_invoice_viewed", "portal_project_viewed"],
    Auth: ["auth_sign_in", "auth_sign_out"],
    Service: ["service_created", "service_updated", "service_deleted"],
    Placement: ["placement_created", "placement_updated", "placement_completed", "placement_terminated", "placement_on_hold", "placement_deleted"],
    Product: ["product_created", "product_updated", "product_deleted"],
    Post: ["post_created", "post_updated", "post_deleted", "post_published", "post_unpublished"],
}

const TYPE_COLOR: Record<string, { dot: string; badge: string }> = {
    admin: { dot: "bg-violet-400", badge: "bg-violet-500/10 text-violet-500 dark:text-violet-400 border-violet-500/20" },
    talent: { dot: "bg-amber-400", badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    inquiry: { dot: "bg-sky-400", badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
    client: { dot: "bg-emerald-400", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    invoice: { dot: "bg-green-400", badge: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
    ticket: { dot: "bg-orange-400", badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
    portal: { dot: "bg-cyan-400", badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" },
    auth: { dot: "bg-pink-400", badge: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20" },
    service: { dot: "bg-indigo-400", badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
    placement: { dot: "bg-teal-400", badge: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20" },
    product: { dot: "bg-rose-400", badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
    post: { dot: "bg-yellow-400", badge: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" },
}

const ACTOR_CONFIG: Record<ActivityActor, { icon: React.ElementType; color: string; label: string }> = {
    admin: { icon: Shield, color: "text-violet-500 dark:text-violet-400", label: "Admin" },
    client: { icon: User, color: "text-emerald-500 dark:text-emerald-400", label: "Client" },
    system: { icon: Bot, color: "text-muted-foreground", label: "System" },
}

const TYPE_OPTIONS = [
    { value: "all", label: "All Types" },
    ...Object.keys(TYPE_GROUPS).map(g => ({ value: g.toLowerCase(), label: g })),
] as const

const ACTOR_OPTIONS = [
    { value: "all", label: "All Actors" },
    { value: "admin", label: "Admin" },
    { value: "client", label: "Client" },
    { value: "system", label: "System" },
] as const

type TypeOption = typeof TYPE_OPTIONS[number]["value"]
type ActorOption = typeof ACTOR_OPTIONS[number]["value"]

function getTypeGroup(type: ActivityType): string {
    for (const [group, types] of Object.entries(TYPE_GROUPS)) {
        if ((types as string[]).includes(type)) return group.toLowerCase()
    }
    return "admin"
}

function formatType(type: string) {
    return type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}

function ActivityRow({ log }: { log: ActivityLog }) {
    const group = getTypeGroup(log.type)
    const colors = TYPE_COLOR[group] ?? TYPE_COLOR.admin
    const actor = ACTOR_CONFIG[log.actorType]
    const ActorIcon = actor.icon

    return (
        <div className="flex items-start gap-4 px-5 py-4 hover:bg-muted/40 border-b border-border last:border-0 transition-colors duration-150">
            <div className="mt-1.5 flex-shrink-0">
                <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-snug">{log.summary}</p>
                        {log.entityLabel && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {log.entityType && (
                                    <span className="text-muted-foreground/60">{log.entityType} · </span>
                                )}
                                {log.entityLabel}
                            </p>
                        )}
                    </div>
                    <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${colors.badge}`}>
                        {formatType(log.type)}
                    </span>
                </div>

                <div className="flex items-center gap-3 mt-2">
                    <div className={`flex items-center gap-1 text-xs ${actor.color}`}>
                        <ActorIcon size={11} />
                        <span>{log.actorName}</span>
                        <span className="text-muted-foreground/40 mx-0.5">·</span>
                        <span className="text-muted-foreground capitalize">{actor.label}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={10} />
                        <span>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SkeletonRow() {
    return (
        <div className="flex items-start gap-4 px-5 py-4 border-b border-border last:border-0">
            <div className="mt-1.5 w-2 h-2 rounded-full bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
            </div>
            <div className="h-5 w-28 bg-muted rounded animate-pulse" />
        </div>
    )
}

const PAGE_SIZE = 10

export default function ActivityPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [, startTransition] = useTransition()

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState<TypeOption>("all")
    const [actorFilter, setActorFilter] = useState<ActorOption>("all")

    const totalPages = Math.ceil(total / PAGE_SIZE)

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 350)
        return () => clearTimeout(t)
    }, [search])

    useEffect(() => { setPage(1) }, [debouncedSearch, typeFilter, actorFilter])

    const fetchLogs = useCallback(() => {
        setLoading(true)

        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(PAGE_SIZE),
            ...(debouncedSearch && { search: debouncedSearch }),
            ...(typeFilter !== "all" && { group: typeFilter }),
            ...(actorFilter !== "all" && { actor: actorFilter }),
        })

        portalFetch.get<PaginatedResponse>(`/admin/activity?${params}`)
            .then(res => { setLogs(res.data); setTotal(res.total) })
            .catch(() => toast.error("Failed to load activity logs"))
            .finally(() => setLoading(false))
    }, [page, debouncedSearch, typeFilter, actorFilter])

    useEffect(() => {
        startTransition(() => { fetchLogs() })
    }, [fetchLogs])

    const hasFilters = search || typeFilter !== "all" || actorFilter !== "all"

    const clearFilters = () => {
        setSearch("")
        setTypeFilter("all")
        setActorFilter("all")
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-8">

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Activity size={15} className="text-amber-500 dark:text-amber-400" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                        {total.toLocaleString()} total events
                    </p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-all"
                >
                    <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1 min-w-56">
                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search logs..."
                        className="w-full h-10 bg-background border border-input rounded-xl pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                </div>

                {/* Type filter */}
                <div className="flex items-center gap-2 min-w-48">
                    <Filter size={13} className="text-muted-foreground flex-shrink-0" />
                    <CustomSelect
                        value={typeFilter}
                        options={TYPE_OPTIONS}
                        onChange={val => setTypeFilter(val as TypeOption)}
                        className="flex-1"
                    />
                </div>

                {/* Actor filter */}
                <div className="flex items-center gap-2 min-w-44">
                    <User size={13} className="text-muted-foreground flex-shrink-0" />
                    <CustomSelect
                        value={actorFilter}
                        options={ACTOR_OPTIONS}
                        onChange={val => setActorFilter(val as ActorOption)}
                        className="flex-1"
                    />
                </div>

                {/* Clear */}
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-all"
                    >
                        <X size={12} />
                        Clear
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Event</span>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Type</span>
                </div>

                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Activity size={32} className="mb-3 opacity-30" />
                        <p className="text-sm">No activity found</p>
                        {hasFilters && (
                            <button onClick={clearFilters} className="mt-2 text-xs text-amber-500 dark:text-amber-400 hover:underline">
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    logs.map(log => <ActivityRow key={log.id} log={log} />)
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-5">
                    <p className="text-xs text-muted-foreground">
                        Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={15} />
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const p = totalPages <= 5
                                ? i + 1
                                : page <= 3
                                    ? i + 1
                                    : page >= totalPages - 2
                                        ? totalPages - 4 + i
                                        : page - 2 + i
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page
                                            ? "bg-amber-400 text-zinc-950 font-bold"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {p}
                                </button>
                            )
                        })}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}