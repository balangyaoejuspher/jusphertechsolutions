"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
    Search, X, Calendar, DollarSign, CheckCircle, Clock, Ban,
    FileText, ExternalLink, Building2, Briefcase, TrendingUp,
    Hourglass, Trash2, FolderKanban, Plus, ArrowRight,
    ChevronLeft, ChevronRight, Send, Eye, ThumbsUp,
    FileCheck, Mail, CheckCircle2, Download,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { portalFetch } from "@/lib/api/private-fetcher"
import { formatDate } from "@/lib/helpers/format"
import { toast } from "sonner"
import type { Placement } from "@/server/db/schema"
import CreatePlacementModal from "./create-placement-modal"
import { PlacementRow } from "@/server/services/placement.service"

const PAGE_SIZE = 12

type InquiryStatus =
    | "draft" | "submitted" | "under_review" | "approved"
    | "contract_generated" | "contract_sent" | "contract_signed"
    | "active" | "rejected"

const INQUIRY_STEPS: { key: InquiryStatus; label: string; icon: React.ElementType }[] = [
    { key: "draft", label: "Draft", icon: FileText },
    { key: "submitted", label: "Submitted", icon: Send },
    { key: "under_review", label: "Under Review", icon: Eye },
    { key: "approved", label: "Approved", icon: ThumbsUp },
    { key: "contract_generated", label: "Contract Generated", icon: FileCheck },
    { key: "contract_sent", label: "Contract Sent", icon: Mail },
    { key: "contract_signed", label: "Contract Signed", icon: CheckCircle2 },
    { key: "active", label: "Active", icon: TrendingUp },
]

const INQUIRY_ORDER = INQUIRY_STEPS.map((s) => s.key)

function InquiryTimeline({ status }: { status: string }) {
    const currentIdx = INQUIRY_ORDER.indexOf(status as InquiryStatus)
    const isRejected = status === "rejected"

    return (
        <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 px-0.5">
                Inquiry Status
            </p>
            {isRejected ? (
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
                    <Ban size={13} className="text-red-500 shrink-0" />
                    <span className="text-xs font-semibold text-red-500">Rejected</span>
                </div>
            ) : (
                <div className="flex items-start">
                    {INQUIRY_STEPS.map((step, idx) => {
                        const isDone = idx < currentIdx
                        const isCurrent = idx === currentIdx
                        const isLast = idx === INQUIRY_STEPS.length - 1
                        return (
                            <div key={step.key} className="flex items-start flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={cn(
                                        "w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0",
                                        isDone ? "bg-emerald-500 text-white"
                                            : isCurrent ? "bg-amber-400 text-zinc-950 ring-2 ring-amber-400/30"
                                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                    )}>
                                        <step.icon size={12} />
                                    </div>
                                    <p className={cn(
                                        "text-[11px] mt-1.5 text-center leading-tight",
                                        isDone ? "text-emerald-600 dark:text-emerald-400"
                                            : isCurrent ? "text-amber-600 dark:text-amber-400 font-semibold"
                                                : "text-zinc-400 dark:text-zinc-600"
                                    )}>
                                        {step.label}
                                    </p>
                                    {isCurrent && <p className="text-[9px] text-zinc-400 mt-0.5">Current</p>}
                                </div>
                                {!isLast && (
                                    <div className={cn(
                                        "h-0.5 flex-1 mt-3.5 mx-1 shrink-0",
                                        isDone ? "bg-emerald-400" : "bg-zinc-200 dark:bg-zinc-700"
                                    )} />
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

const PLACEMENT_STATUS_CONFIG = {
    active: {
        label: "Active", icon: TrendingUp,
        className: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
        dot: "bg-emerald-500",
    },
    completed: {
        label: "Completed", icon: CheckCircle,
        className: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/10",
        dot: "bg-zinc-400",
    },
    cancelled: {
        label: "Cancelled", icon: Ban,
        className: "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20",
        dot: "bg-red-500",
    },
    on_hold: {
        label: "On Hold", icon: Hourglass,
        className: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
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
    label: string; next: Placement["status"]; icon: React.ElementType; cls: string
}[]> = {
    active: [
        { label: "Mark Completed", next: "completed", icon: CheckCircle, cls: "bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600 text-white" },
        { label: "Put On Hold", next: "on_hold", icon: Hourglass, cls: "bg-amber-500 hover:bg-amber-400 text-white" },
        { label: "Cancel", next: "cancelled", icon: Ban, cls: "bg-red-500 hover:bg-red-400 text-white" },
    ],
    on_hold: [
        { label: "Resume", next: "active", icon: TrendingUp, cls: "bg-emerald-500 hover:bg-emerald-400 text-white" },
        { label: "Cancel", next: "cancelled", icon: Ban, cls: "bg-red-500 hover:bg-red-400 text-white" },
    ],
    completed: [{ label: "Reactivate", next: "active", icon: TrendingUp, cls: "bg-emerald-500 hover:bg-emerald-400 text-white" }],
    cancelled: [{ label: "Reactivate", next: "active", icon: TrendingUp, cls: "bg-emerald-500 hover:bg-emerald-400 text-white" }],
}

const PLACEMENT_STATUSES = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
]

const AVATAR_GRADIENTS = [
    "from-blue-500 to-indigo-500", "from-violet-500 to-purple-500",
    "from-rose-500 to-pink-500", "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500", "from-cyan-500 to-sky-500",
]
function getGradient(name: string) {
    return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length]
}
function formatRate(rate: string | null | undefined) {
    if (!rate) return null
    return `$${parseFloat(rate).toLocaleString("en-US", { minimumFractionDigits: 2 })}/hr`
}
function weeklyEarnings(rate: string | null | undefined, hours: number | null | undefined) {
    if (!rate || !hours) return null
    return `$${(parseFloat(rate) * hours).toLocaleString("en-US", { minimumFractionDigits: 2 })}/wk`
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PlacementsSkeleton() {
    return (
        <div className="flex flex-col gap-6 p-6 md:p-8">
            <div className="flex justify-between items-start">
                <div><Skeleton className="h-8 w-40 mb-2 rounded-xl" /><Skeleton className="h-4 w-56 rounded-lg" /></div>
                <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-4">
                        <Skeleton className="h-7 w-10 mx-auto mb-1.5 rounded-lg" /><Skeleton className="h-3 w-16 mx-auto rounded-full" />
                    </div>
                ))}
            </div>
            <div className="flex gap-3"><Skeleton className="h-10 flex-1 max-w-sm rounded-xl" /><Skeleton className="h-10 w-36 rounded-xl" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-1.5"><Skeleton className="h-4 w-32 rounded-lg" /><Skeleton className="h-3 w-20 rounded-full" /></div>
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-px w-full" />
                        <div className="flex justify-between"><Skeleton className="h-3 w-28 rounded-full" /><Skeleton className="h-3 w-14 rounded-full" /></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Contract Badge ───────────────────────────────────────────────────────────

function ContractBadge({ status, url }: { status: string | null; url: string | null }) {
    if (!status) return null
    const cfg = CONTRACT_STATUS_CONFIG[status] ?? { label: status, cls: "bg-zinc-100 text-zinc-500" }
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold", cfg.cls)}>
                <FileText size={11} /> {cfg.label}
            </span>
            {url && (
                <a href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    <ExternalLink size={11} /> View
                </a>
            )}
        </div>
    )
}

// ─── Shared Detail Content ────────────────────────────────────────────────────
// Extracted so it renders identically in both the desktop sidebar and mobile drawer

function PlacementDetail({
    selected, updatingAction, generating,
    onStatusChange, onGenerateContract, onDelete,
}: {
    selected: PlacementRow
    updatingAction: Placement["status"] | null
    generating: boolean
    onStatusChange: (id: string, status: Placement["status"]) => void
    onGenerateContract: () => void
    onDelete: () => void
}) {
    return (
        <>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-zinc-200
                [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full">

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: "Rate", value: formatRate(selected.hourlyRate), icon: DollarSign, color: "text-emerald-500" },
                        { label: "Hours/wk", value: selected.hoursPerWeek ? `${selected.hoursPerWeek}h` : null, icon: Clock, color: "text-blue-500" },
                        { label: "Weekly Est.", value: weeklyEarnings(selected.hourlyRate, selected.hoursPerWeek), icon: TrendingUp, color: "text-amber-500" },
                        { label: "Client", value: selected.clientName, icon: Building2, color: "text-violet-500" },
                    ].filter(r => r.value).map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-zinc-50 dark:bg-white/5 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Icon size={11} className={color} />
                                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{label}</span>
                            </div>
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Details row */}
                <div className="bg-zinc-50 dark:bg-white/5 rounded-xl divide-y divide-zinc-100 dark:divide-white/5">
                    {[
                        { icon: FolderKanban, label: "Project", value: selected.projectTitle },
                        { icon: Calendar, label: "Start", value: formatDate(selected.startDate) },
                        { icon: Calendar, label: "End", value: selected.endDate ? formatDate(selected.endDate) : "Ongoing" },
                    ].filter(r => r.value).map(({ icon: Icon, label, value }, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                            <Icon size={12} className="text-zinc-400 shrink-0" />
                            <span className="text-xs text-zinc-400 w-16 shrink-0">{label}</span>
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Inquiry Timeline */}
                {(selected as any).inquiryStatus && (
                    <InquiryTimeline status={(selected as any).inquiryStatus} />
                )}

                {/* Contract */}
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5 px-0.5">Contract</p>
                    {selected.contractStatus ? (
                        <div className="bg-zinc-50 dark:bg-white/5 rounded-xl p-3.5 flex flex-col gap-2.5">
                            <ContractBadge status={selected.contractStatus} url={selected.contractUrl} />
                            {selected.contractSignedAt && (
                                <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle size={11} /> Signed {formatDate(selected.contractSignedAt)}
                                </p>
                            )}
                            {(selected as any).contractGeneratedAt && (
                                <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                                    <FileCheck size={11} /> Generated {formatDate((selected as any).contractGeneratedAt)}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-zinc-50 dark:bg-white/5 rounded-xl p-3.5 text-xs text-zinc-400 flex items-center gap-2">
                            <FileText size={12} /> No contract linked
                        </div>
                    )}
                </div>

                {/* Description */}
                {selected.description && (
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5 px-0.5">Description</p>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed bg-zinc-50 dark:bg-white/5 rounded-xl p-3.5">
                            {selected.description}
                        </p>
                    </div>
                )}

                {/* Notes */}
                {selected.notes && (
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5 px-0.5">Notes</p>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-xl p-3.5">
                            {selected.notes}
                        </p>
                    </div>
                )}

                {/* Status Actions */}
                {(STATUS_ACTIONS[selected.status] ?? []).length > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5 px-0.5">Move Placement</p>
                        <div className="flex flex-col gap-2">
                            {(STATUS_ACTIONS[selected.status] ?? []).map((action) => {
                                const isThisLoading = updatingAction === action.next
                                const isAnyLoading = updatingAction !== null
                                return (
                                    <button
                                        key={action.next}
                                        disabled={isAnyLoading}
                                        onClick={() => onStatusChange(selected.id, action.next)}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:cursor-not-allowed",
                                            isAnyLoading && !isThisLoading ? "opacity-40" : "opacity-100",
                                            action.cls
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isThisLoading
                                                ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                                : <action.icon size={14} />
                                            }
                                            {action.label}
                                        </div>
                                        {!isThisLoading && <ArrowRight size={13} className="opacity-60" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-zinc-100 dark:border-white/5 flex flex-col gap-2 shrink-0">
                <button
                    onClick={onGenerateContract}
                    disabled={generating}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-zinc-950 font-bold text-sm transition-colors"
                >
                    {generating
                        ? <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                        : <Download size={14} />
                    }
                    {generating ? "Generating..." : "Generate Contract PDF"}
                </button>
                <button
                    onClick={onDelete}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium text-sm transition-colors"
                >
                    <Trash2 size={14} /> Delete Placement
                </button>
            </div>
        </>
    )
}

// ─── Panel Header (reused in desktop sidebar + mobile drawer) ─────────────────

function PanelHeader({ selected, onClose }: { selected: PlacementRow; onClose: () => void }) {
    const statusCfg = PLACEMENT_STATUS_CONFIG[selected.status as keyof typeof PLACEMENT_STATUS_CONFIG]
    return (
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
                <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shrink-0", getGradient(selected.talentName))}>
                    {selected.talentName.charAt(0)}
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-zinc-900 dark:text-white text-sm leading-tight truncate">{selected.talentName}</p>
                    <p className="text-xs text-zinc-400 leading-tight truncate">{selected.role}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {statusCfg && (
                    <span className={cn("hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusCfg.className)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                        {statusCfg.label}
                    </span>
                )}
                <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
    const [updatingAction, setUpdatingAction] = useState<Placement["status"] | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [generating, setGenerating] = useState(false)

    useEffect(() => {
        portalFetch.get<PlacementRow[]>("/admin/placements")
            .then(setPlacements)
            .catch(() => toast.error("Failed to load placements"))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => setCurrentPage(1), [search, filterStatus])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null) }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [])

    useEffect(() => {
        if (selected) document.body.style.overflow = "hidden"
        else document.body.style.overflow = ""
        return () => { document.body.style.overflow = "" }
    }, [selected])

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
            list = [...list].sort((a, b) => parseFloat(b.hourlyRate ?? "0") - parseFloat(a.hourlyRate ?? "0"))
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
        const updated = await portalFetch.patch<PlacementRow>(`/admin/placements/${id}`, payload)
        setPlacements((prev) => prev.map((p) => p.id === id ? { ...p, ...updated } : p))
        setSelected((prev) => prev?.id === id ? { ...prev, ...updated } : prev)
        return updated
    }

    const handleStatusChange = async (id: string, status: Placement["status"]) => {
        setUpdatingAction(status)
        try {
            await patchPlacement(id, { status })
            toast.success(`Moved to ${PLACEMENT_STATUS_CONFIG[status as keyof typeof PLACEMENT_STATUS_CONFIG]?.label ?? status}`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update")
        } finally {
            setUpdatingAction(null)
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
            toast.error(err.message ?? "Failed to delete")
        } finally {
            setDeleting(false)
        }
    }

    const handleGenerateContract = async () => {
        if (!selected) return
        setGenerating(true)
        try {
            const { pdf, filename } = await portalFetch.post<{ pdf: string; filename: string }>(
                `/admin/placements/${selected.id}/generate-contract`, {}
            )
            const link = document.createElement("a")
            link.href = `data:application/pdf;base64,${pdf}`
            link.download = filename
            link.click()
            const patch = { inquiryStatus: "contract_generated" as InquiryStatus, contractGeneratedAt: new Date() }
            setPlacements((prev) => prev.map((p) => p.id === selected.id ? { ...p, ...patch } : p))
            setSelected((prev) => prev ? { ...prev, ...patch } : prev)
            toast.success("Contract generated!")
        } catch (err: any) {
            toast.error(err.message ?? "Failed to generate contract")
        } finally {
            setGenerating(false)
        }
    }

    const detailProps = selected ? {
        selected,
        updatingAction,
        generating,
        onStatusChange: handleStatusChange,
        onGenerateContract: handleGenerateContract,
        onDelete: () => setDeleteModal(true),
    } : null

    if (loading) return <PlacementsSkeleton />

    return (
        <div className="flex flex-col gap-6 p-6 pt-8 md:p-8 min-h-screen">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Placements</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        <span className="text-emerald-500 font-semibold">{counts.active} active</span>
                        <span className="mx-1.5 text-zinc-300 dark:text-zinc-600">·</span>
                        {placements.length} total
                    </p>
                </div>
                <Button
                    onClick={() => setCreateModal(true)}
                    className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 shadow-sm shrink-0"
                >
                    <Plus size={15} /> New Placement
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {PLACEMENT_STATUSES.map((s) => {
                    const cfg = PLACEMENT_STATUS_CONFIG[s.value as keyof typeof PLACEMENT_STATUS_CONFIG]
                    const count = counts[s.value as keyof typeof counts] ?? 0
                    const isActive = filterStatus === s.value
                    return (
                        <button key={s.value} onClick={() => setFilterStatus(s.value)}
                            className={cn(
                                "relative bg-white dark:bg-zinc-900 border rounded-2xl p-4 text-center transition-all duration-200 overflow-hidden",
                                isActive
                                    ? "border-amber-400 shadow-md shadow-amber-100 dark:shadow-amber-500/10"
                                    : "border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 hover:shadow-sm"
                            )}
                        >
                            {isActive && <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />}
                            <div className="text-2xl font-bold text-zinc-900 dark:text-white tabular-nums mb-1">{count}</div>
                            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                {cfg && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />}
                                {s.label}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap items-center">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text" placeholder="Search talent, client, role..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-amber-400 transition-all"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                            <X size={14} />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setSortByRate((v) => !v)}
                    className={cn(
                        "flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium transition-all",
                        sortByRate
                            ? "bg-amber-400 border-amber-400 text-zinc-950"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                    )}
                >
                    <DollarSign size={13} />
                    {sortByRate ? "Sorted by Rate" : "Sort by Rate"}
                </button>
                <div className="ml-auto text-xs text-zinc-400 dark:text-zinc-600">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-5 items-start">

                {/* ── List ── */}
                <div className={cn(
                    "flex flex-col gap-3 transition-all duration-300 min-w-0 w-full",
                    selected ? "lg:w-[45%]" : "lg:w-full"
                )}>
                    {paginated.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <Briefcase size={20} className="text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">No placements found</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">Try adjusting your filters</p>
                            </div>
                        </div>
                    ) : paginated.map((placement) => {
                        const statusCfg = PLACEMENT_STATUS_CONFIG[placement.status as keyof typeof PLACEMENT_STATUS_CONFIG]
                        const isSelected = selected?.id === placement.id
                        return (
                            <div
                                key={placement.id}
                                onClick={() => setSelected(isSelected ? null : placement)}
                                className={cn(
                                    "bg-white dark:bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md",
                                    isSelected
                                        ? "border-amber-400 shadow-md shadow-amber-100 dark:shadow-amber-500/10 ring-1 ring-amber-400/20"
                                        : "border-zinc-100 dark:border-white/5 hover:border-zinc-200 dark:hover:border-white/10"
                                )}
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shrink-0", getGradient(placement.talentName))}>
                                            {placement.talentName.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{placement.talentName}</p>
                                            <p className="text-zinc-400 dark:text-zinc-500 text-xs flex items-center gap-1 mt-0.5">
                                                <Briefcase size={9} className="shrink-0" /> {placement.role}
                                            </p>
                                        </div>
                                    </div>
                                    {statusCfg && (
                                        <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0", statusCfg.className)}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                                            {statusCfg.label}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                    <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                        <Building2 size={11} className="text-zinc-400 shrink-0" /> {placement.clientName}
                                    </span>
                                    {placement.hourlyRate && (
                                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            <DollarSign size={10} /> {formatRate(placement.hourlyRate)}
                                        </span>
                                    )}
                                    {placement.hoursPerWeek && (
                                        <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                                            <Clock size={10} /> {placement.hoursPerWeek}h/wk
                                        </span>
                                    )}
                                </div>
                                <div className="h-px bg-zinc-100 dark:bg-white/5 mb-3" />
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                                        <Calendar size={10} />
                                        {formatDate(placement.startDate)}
                                        {placement.endDate && <> → {formatDate(placement.endDate)}</>}
                                    </div>
                                    {placement.projectTitle && (
                                        <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-[120px]">
                                            <FolderKanban size={10} /> {placement.projectTitle}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                            </p>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
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
                                                className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                                                    currentPage === page ? "bg-amber-400 text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                                )}>{page}</button>
                                        )
                                    )
                                })()}
                                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Desktop side panel (lg+) ── */}
                {selected && detailProps && (
                    <div className="hidden lg:flex flex-col flex-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl overflow-hidden min-w-0 sticky top-6 max-h-[calc(100vh-6rem)]">
                        <PanelHeader selected={selected} onClose={() => setSelected(null)} />
                        <PlacementDetail {...detailProps} />
                    </div>
                )}
            </div>

            {/* ── Mobile bottom drawer (below lg) ── */}
            {selected && detailProps && (
                <>
                    {/* Backdrop — tap to close */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                        onClick={() => setSelected(null)}
                    />
                    {/* Drawer sheet */}
                    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden flex flex-col bg-white dark:bg-zinc-900 rounded-t-3xl border-t border-zinc-100 dark:border-white/10 shadow-2xl"
                        style={{ maxHeight: "85dvh" }}>
                        {/* Pull handle */}
                        <div className="flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                        </div>
                        <PanelHeader selected={selected} onClose={() => setSelected(null)} />
                        <PlacementDetail {...detailProps} />
                    </div>
                </>
            )}

            {/* Create Modal */}
            {createModal && (
                <CreatePlacementModal
                    onClose={() => setCreateModal(false)}
                    onCreated={(p) => {
                        setPlacements((prev) => [p, ...prev])
                        setCreateModal(false)
                    }}
                />
            )}

            {/* Delete Confirm Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-zinc-100 dark:border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                            <Trash2 size={18} className="text-red-500" />
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-1.5">Delete Placement</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
                            Remove <strong className="text-zinc-900 dark:text-white">{selected?.talentName}</strong>'s placement at{" "}
                            <strong className="text-zinc-900 dark:text-white">{selected?.clientName}</strong>? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={deleting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white text-sm font-bold transition">
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