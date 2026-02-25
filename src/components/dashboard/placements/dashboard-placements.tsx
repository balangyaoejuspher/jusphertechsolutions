"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
    Search, X, Calendar, MoreHorizontal,
    DollarSign, CheckCircle, Clock, Ban,
    FileText, ExternalLink, Building2,
    Briefcase, TrendingUp, Hourglass,
    Trash2, FolderKanban, Plus, Edit2,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { portalFetch } from "@/lib/api/fetcher"
import { formatDate } from "@/lib/helpers/format"
import { toast } from "sonner"
import type { Placement } from "@/server/db/schema"
import CreatePlacementModal from "./create-placement-modal"

type PlacementRow = Placement & {
    talentName: string
    clientName: string
    projectTitle: string | null
    contractStatus: string | null
    contractUrl: string | null
    contractSignedAt: Date | null
}

const PAGE_SIZE = 12

const PLACEMENT_STATUS_CONFIG = {
    active: {
        label: "Active",
        icon: TrendingUp,
        className: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
    completed: {
        label: "Completed",
        icon: CheckCircle,
        className: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
        dot: "bg-zinc-400",
    },
    cancelled: {
        label: "Cancelled",
        icon: Ban,
        className: "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400",
        dot: "bg-red-500",
    },
    on_hold: {
        label: "On Hold",
        icon: Hourglass,
        className: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
        dot: "bg-amber-400",
    },
} as const

const CONTRACT_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400" },
    sent: { label: "Sent", cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    signed: { label: "Signed", cls: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    expired: { label: "Expired", cls: "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400" },
}

const STATUS_ACTIONS: Record<string, {
    label: string
    next: Placement["status"]
    icon: React.ElementType
    cls: string
}[]> = {
    active: [
        { label: "Mark Completed", next: "completed", icon: CheckCircle, cls: "bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600 text-white" },
        { label: "Put On Hold", next: "on_hold", icon: Hourglass, cls: "bg-amber-500 hover:bg-amber-400 text-white" },
        { label: "Cancel Placement", next: "cancelled", icon: Ban, cls: "bg-red-500 hover:bg-red-400 text-white" },
    ],
    on_hold: [
        { label: "Resume Placement", next: "active", icon: TrendingUp, cls: "bg-emerald-500 hover:bg-emerald-400 text-white" },
        { label: "Cancel Placement", next: "cancelled", icon: Ban, cls: "bg-red-500 hover:bg-red-400 text-white" },
    ],
    completed: [
        { label: "Reactivate", next: "active", icon: TrendingUp, cls: "bg-emerald-500 hover:bg-emerald-400 text-white" },
    ],
    cancelled: [
        { label: "Reactivate", next: "active", icon: TrendingUp, cls: "bg-emerald-500 hover:bg-emerald-400 text-white" },
    ],
}

const PLACEMENT_STATUSES = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
]

function formatRate(rate: string | null | undefined) {
    if (!rate) return null
    return `$${parseFloat(rate).toLocaleString("en-US", { minimumFractionDigits: 2 })}/hr`
}

function weeklyEarnings(rate: string | null | undefined, hours: number | null | undefined) {
    if (!rate || !hours) return null
    const weekly = parseFloat(rate) * hours
    return `$${weekly.toLocaleString("en-US", { minimumFractionDigits: 2 })}/wk`
}

function PlacementsSkeleton() {
    return (
        <div className="flex flex-col gap-6 p-6 md:p-8">
            <div className="flex justify-between">
                <div><Skeleton className="h-7 w-36 mb-2" /><Skeleton className="h-4 w-52" /></div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4">
                        <Skeleton className="h-6 w-8 mx-auto mb-1" /><Skeleton className="h-3 w-14 mx-auto" />
                    </div>
                ))}
            </div>
            <div className="flex gap-3 mb-4">
                <Skeleton className="h-10 flex-1 max-w-sm rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <Skeleton className="w-10 h-10 rounded-xl" />
                            <div className="flex-1"><Skeleton className="h-4 w-28 mb-1" /><Skeleton className="h-3 w-20" /></div>
                        </div>
                        <Skeleton className="h-3 w-full mb-2" />
                        <Skeleton className="h-3 w-3/4" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function ContractBadge({ status, url }: { status: string | null; url: string | null }) {
    if (!status) return null
    const cfg = CONTRACT_STATUS_CONFIG[status] ?? { label: status, cls: "bg-zinc-100 text-zinc-500" }
    return (
        <div className="flex items-center gap-2">
            <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold", cfg.cls)}>
                <FileText size={11} />
                Contract: {cfg.label}
            </span>
            {url && status === "signed" && (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                >
                    <ExternalLink size={11} /> View
                </a>
            )}
        </div>
    )
}

export default function DashboardPlacements() {
    const [placements, setPlacements] = useState<PlacementRow[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortByRate, setSortByRate] = useState(false)
    const [selected, setSelected] = useState<PlacementRow | null>(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [createModal, setCreateModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [updating, setUpdating] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        portalFetch.get<PlacementRow[]>("/admin/placements")
            .then(setPlacements)
            .catch(() => toast.error("Failed to load placements"))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => setCurrentPage(1), [search, filterStatus])

    const filtered = useMemo(() => {
        let list = placements
            .filter((p) => filterStatus === "all" || p.status === filterStatus)
            .filter((p) =>
                p.talentName.toLowerCase().includes(search.toLowerCase()) ||
                p.clientName.toLowerCase().includes(search.toLowerCase()) ||
                p.role.toLowerCase().includes(search.toLowerCase()) ||
                (p.projectTitle ?? "").toLowerCase().includes(search.toLowerCase())
            )

        if (sortByRate) {
            list = [...list].sort((a, b) =>
                parseFloat(b.hourlyRate ?? "0") - parseFloat(a.hourlyRate ?? "0")
            )
        }

        return list
    }, [placements, filterStatus, search, sortByRate])

    const totalPages = useMemo(() => Math.ceil(filtered.length / PAGE_SIZE), [filtered])
    const paginated = useMemo(() =>
        filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filtered, currentPage]
    )

    const counts = useMemo(() => ({
        all: placements.length,
        active: placements.filter((p) => p.status === "active").length,
        on_hold: placements.filter((p) => p.status === "on_hold").length,
        completed: placements.filter((p) => p.status === "completed").length,
        cancelled: placements.filter((p) => p.status === "cancelled").length,
    }), [placements])

    const patchPlacement = async (id: string, payload: Partial<Placement>) => {
        setUpdating(true)
        try {
            const updated = await portalFetch.patch<PlacementRow>(`/admin/placements/${id}`, payload)
            setPlacements((prev) => prev.map((p) => p.id === id ? { ...p, ...updated } : p))
            setSelected((prev) => prev?.id === id ? { ...prev, ...updated } : prev)
            return updated
        } finally {
            setUpdating(false)
        }
    }

    const handleStatusChange = async (id: string, status: Placement["status"]) => {
        try {
            await patchPlacement(id, { status })
            toast.success(`Placement moved to ${PLACEMENT_STATUS_CONFIG[status as keyof typeof PLACEMENT_STATUS_CONFIG]?.label ?? status}`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update placement")
        }
    }

    const handleDelete = async () => {
        if (!selected) return
        setDeleting(true)
        try {
            await portalFetch.delete(`/admin/placements/${selected.id}`)
            setPlacements((prev) => prev.filter((p) => p.id !== selected.id))
            setSelected(null)
            setDeleteModal(false)
            toast.success("Placement deleted")
        } catch (err: any) {
            toast.error(err.message ?? "Failed to delete placement")
        } finally {
            setDeleting(false)
        }
    }

    if (loading) return <PlacementsSkeleton />

    return (
        <div className="flex flex-col gap-6 p-6 md:p-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Placements</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        {counts.active} active · {placements.length} total placements
                    </p>
                </div>
                <Button
                    onClick={() => setCreateModal(true)}
                    className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 shadow-sm"
                >
                    <Plus size={16} /> New Placement
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {PLACEMENT_STATUSES.map((s) => {
                    const cfg = PLACEMENT_STATUS_CONFIG[s.value as keyof typeof PLACEMENT_STATUS_CONFIG]
                    const count = counts[s.value as keyof typeof counts] ?? 0
                    return (
                        <button
                            key={s.value}
                            onClick={() => setFilterStatus(s.value)}
                            className={cn(
                                "bg-white dark:bg-zinc-900 border rounded-2xl p-4 text-center transition-all",
                                filterStatus === s.value
                                    ? "border-amber-400 shadow-sm shadow-amber-100 dark:shadow-amber-500/10"
                                    : "border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10"
                            )}
                        >
                            <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{count}</div>
                            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                {cfg && <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />}
                                {s.label}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Search + Filters */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search talent, client, role or project..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-amber-400 transition-all"
                    />
                </div>
                <button
                    onClick={() => setSortByRate((v) => !v)}
                    className={cn(
                        "flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium transition-all",
                        sortByRate
                            ? "bg-amber-400 border-amber-400 text-zinc-950"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                    )}
                >
                    <DollarSign size={14} />
                    {sortByRate ? "Sorted by Rate" : "Sort by Rate"}
                </button>
            </div>

            {/* Content */}
            <div className="flex gap-6">

                {/* List */}
                <div className={cn(
                    "flex flex-col gap-3 transition-all duration-300 min-w-0",
                    selected ? "w-full lg:w-2/5" : "w-full"
                )}>
                    {paginated.length === 0 ? (
                        <div className="text-center py-16 text-zinc-400 dark:text-zinc-600 text-sm bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl">
                            No placements found.
                        </div>
                    ) : paginated.map((placement) => {
                        const statusCfg = PLACEMENT_STATUS_CONFIG[placement.status as keyof typeof PLACEMENT_STATUS_CONFIG]
                        return (
                            <div
                                key={placement.id}
                                onClick={() => setSelected(placement)}
                                className={cn(
                                    "bg-white dark:bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-sm",
                                    selected?.id === placement.id
                                        ? "border-amber-400 shadow-sm shadow-amber-100 dark:shadow-amber-500/10"
                                        : "border-zinc-100 dark:border-white/5 hover:border-zinc-200 dark:hover:border-white/10"
                                )}
                            >
                                {/* Row top */}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{placement.talentName}</p>
                                        <p className="text-zinc-400 dark:text-zinc-500 text-xs truncate flex items-center gap-1">
                                            <Briefcase size={10} /> {placement.role}
                                        </p>
                                    </div>
                                    {statusCfg && (
                                        <span className={cn(
                                            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium shrink-0",
                                            statusCfg.className
                                        )}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                                            {statusCfg.label}
                                        </span>
                                    )}
                                </div>

                                {/* Meta row */}
                                <div className="flex items-center gap-4 mb-3 flex-wrap">
                                    <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                        <Building2 size={11} className="text-zinc-400" /> {placement.clientName}
                                    </span>
                                    {placement.hourlyRate && (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            {formatRate(placement.hourlyRate)}
                                        </span>
                                    )}
                                    {placement.hoursPerWeek && (
                                        <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                                            <Clock size={11} /> {placement.hoursPerWeek}h/wk
                                        </span>
                                    )}
                                </div>

                                {/* Bottom row */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-zinc-300 dark:text-zinc-600 text-xs">
                                        <Calendar size={11} />
                                        {formatDate(placement.startDate)}
                                        {placement.endDate && <> → {formatDate(placement.endDate)}</>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {placement.projectTitle && (
                                            <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                                                <FolderKanban size={11} /> {placement.projectTitle}
                                            </span>
                                        )}
                                        {placement.contractStatus === "signed" && (
                                            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                                <FileText size={11} /> Signed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={15} />
                                </button>
                                {(() => {
                                    const pages: (number | string)[] = []
                                    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
                                    else {
                                        pages.push(1)
                                        if (currentPage > 3) pages.push("...")
                                        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
                                        if (currentPage < totalPages - 2) pages.push("...")
                                        pages.push(totalPages)
                                    }
                                    return pages.map((page, idx) =>
                                        page === "..." ? (
                                            <span key={`e-${idx}`} className="w-8 h-8 flex items-center justify-center text-zinc-400 text-sm">…</span>
                                        ) : (
                                            <button key={page} onClick={() => setCurrentPage(page as number)}
                                                className={cn(
                                                    "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                                                    currentPage === page ? "bg-amber-400 text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                                )}
                                            >{page}</button>
                                        )
                                    )
                                })()}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Detail Panel ── */}
                {selected && (() => {
                    const statusCfg = PLACEMENT_STATUS_CONFIG[selected.status as keyof typeof PLACEMENT_STATUS_CONFIG]
                    return (
                        <div className="hidden lg:flex flex-col flex-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl overflow-hidden min-w-0">

                            {/* Panel Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Placement Details</h3>
                                    {statusCfg && (
                                        <span className={cn(
                                            "flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
                                            statusCfg.className
                                        )}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                                            {statusCfg.label}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6
                                [&::-webkit-scrollbar]:w-1.5
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:bg-zinc-200
                                [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                                [&::-webkit-scrollbar-thumb]:rounded-full">

                                {/* Identity */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                            {selected.talentName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-900 dark:text-white text-sm">{selected.talentName}</p>
                                            <p className="text-zinc-400 dark:text-zinc-500 text-xs flex items-center gap-1">
                                                <Briefcase size={10} /> {selected.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-white/5 rounded-2xl p-4">
                                        {[
                                            { icon: Building2, label: "Client", value: selected.clientName },
                                            { icon: FolderKanban, label: "Project", value: selected.projectTitle },
                                            { icon: Calendar, label: "Start", value: formatDate(selected.startDate) },
                                            { icon: Calendar, label: "End", value: selected.endDate ? formatDate(selected.endDate) : "Ongoing" },
                                            { icon: DollarSign, label: "Rate", value: formatRate(selected.hourlyRate) },
                                            { icon: Clock, label: "Hours/wk", value: selected.hoursPerWeek ? `${selected.hoursPerWeek} hrs` : null },
                                            { icon: TrendingUp, label: "Est. Weekly", value: weeklyEarnings(selected.hourlyRate, selected.hoursPerWeek) },
                                        ].filter((r) => r.value).map(({ icon: Icon, label, value }, i) => (
                                            <div key={i} className="flex items-center gap-2.5">
                                                <Icon size={13} className="text-zinc-400 shrink-0" />
                                                <span className="text-xs text-zinc-400 dark:text-zinc-500 w-16 shrink-0">{label}</span>
                                                <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Contract Section */}
                                <div>
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Contract</p>
                                    {selected.contractStatus ? (
                                        <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-3">
                                            <ContractBadge status={selected.contractStatus} url={selected.contractUrl} />
                                            {selected.contractSignedAt && (
                                                <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                                    <CheckCircle size={11} />
                                                    Signed on {formatDate(selected.contractSignedAt)}
                                                </p>
                                            )}
                                            {selected.contractUrl && selected.contractStatus !== "signed" && (
                                                <a
                                                    href={selected.contractUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors w-fit"
                                                >
                                                    <FileText size={13} /> View Contract Document
                                                    <ExternalLink size={11} />
                                                </a>
                                            )}
                                            {selected.contractUrl && selected.contractStatus === "signed" && (
                                                <a
                                                    href={selected.contractUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors w-fit"
                                                >
                                                    <FileText size={13} /> View Signed Contract
                                                    <ExternalLink size={11} />
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4 text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                                            <FileText size={13} />
                                            No contract linked. Attach a project to manage contracts.
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                {selected.description && (
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Description</p>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed bg-zinc-50 dark:bg-white/5 rounded-2xl p-4">
                                            {selected.description}
                                        </p>
                                    </div>
                                )}

                                {/* Notes */}
                                {selected.notes && (
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Internal Notes</p>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-4">
                                            {selected.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Status Actions */}
                                <div>
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Move Placement</p>
                                    <div className="flex flex-col gap-2">
                                        {(STATUS_ACTIONS[selected.status] ?? []).map((action) => (
                                            <button
                                                key={action.next}
                                                disabled={updating}
                                                onClick={() => handleStatusChange(selected.id, action.next)}
                                                className={cn(
                                                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                                    action.cls
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {updating
                                                        ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                                        : <action.icon size={15} />
                                                    }
                                                    {action.label}
                                                </div>
                                                <ArrowRight size={14} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Panel Footer */}
                            <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/5 flex flex-col gap-2 shrink-0">
                                <button
                                    onClick={() => setDeleteModal(true)}
                                    className="flex items-center justify-center gap-2 h-11 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium text-sm transition-colors"
                                >
                                    <Trash2 size={15} /> Delete Placement
                                </button>
                            </div>
                        </div>
                    )
                })()}
            </div>

            {/* Create Modal */}
            {createModal && (
                <CreatePlacementModal
                    onClose={() => setCreateModal(false)}
                    onCreated={(newPlacement) => {
                        setPlacements((prev) => [newPlacement, ...prev])
                        setCreateModal(false)
                    }}
                />
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Delete Placement</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
                            Are you sure you want to remove <strong className="text-zinc-900 dark:text-white">{selected?.talentName}</strong>'s placement at <strong className="text-zinc-900 dark:text-white">{selected?.clientName}</strong>? This cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteModal(false)}
                                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-40 text-white text-sm font-bold transition"
                            >
                                {deleting && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}