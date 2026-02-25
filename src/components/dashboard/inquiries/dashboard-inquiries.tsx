"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
    Search, X, Mail, Building2, Calendar, MessageSquare,
    ChevronLeft, ChevronRight, Phone, DollarSign, Tag,
    User, AlertTriangle, CheckCircle, Clock, Inbox,
    RefreshCw, Trash2, ArrowRight,
    UserPlus, FolderKanban,
} from "lucide-react"
import ConvertInquiryModal from "./convert-inquiry.modal"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { INQUIRY_STATUS_CONFIG, INQUIRY_STATUSES } from "@/lib/helpers/constants"
import { portalFetch } from "@/lib/api/fetcher"
import { formatDate } from "@/lib/helpers/format"
import { toast } from "sonner"
import type { ClientRow, Inquiry, Project } from "@/server/db/schema"
import { Talent } from "@/types"

type InquiryRow = Inquiry & {
    talentName: string | null
    adminName: string | null
    projectTitle?: string | null   // populated when inquiry has been converted
}

const PAGE_SIZE = 4

const PRIORITY_CONFIG = {
    low: { label: "Low", cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400", dot: "bg-zinc-400" },
    medium: { label: "Medium", cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400", dot: "bg-blue-400" },
    high: { label: "High", cls: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400", dot: "bg-orange-400" },
    urgent: { label: "Urgent", cls: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400", dot: "bg-red-500" },
} as const

// Priority sort order for prioritization display
const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

const SOURCE_LABEL: Record<string, string> = {
    contact_form: "Contact Form",
    referral: "Referral",
    social_media: "Social Media",
    direct: "Direct",
    other: "Other",
}

const STATUS_ACTIONS: Record<string, {
    label: string
    next: Inquiry["status"]
    icon: React.ElementType
    cls: string
}[]> = {
    new: [
        { label: "Start Working", next: "in_progress", icon: Clock, cls: "bg-blue-500 hover:bg-blue-400 text-white" },
        { label: "Mark Resolved", next: "resolved", icon: CheckCircle, cls: "bg-emerald-500 hover:bg-emerald-400 text-white" },
    ],
    in_progress: [
        { label: "Mark Resolved", next: "resolved", icon: CheckCircle, cls: "bg-emerald-500 hover:bg-emerald-400 text-white" },
        { label: "Move Back to New", next: "new", icon: Inbox, cls: "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300" },
    ],
    resolved: [
        { label: "Reopen", next: "in_progress", icon: RefreshCw, cls: "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300" },
    ],
}

const EXTENDED_STATUSES = [
    ...INQUIRY_STATUSES,
    { value: "converted", label: "Converted" },
]

function InquiriesSkeleton() {
    return (
        <div className="p-8 md:p-10">
            <div className="mb-8"><Skeleton className="h-7 w-32 mb-2" /><Skeleton className="h-4 w-48" /></div>
            <div className="flex gap-2 mb-6">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-28 rounded-xl" />)}</div>
            <Skeleton className="h-11 w-80 rounded-xl mb-6" />
            <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5">
                        <div className="flex justify-between mb-3">
                            <div><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-24" /></div>
                            <Skeleton className="h-6 w-20 rounded-lg" />
                        </div>
                        <Skeleton className="h-3 w-full mb-1" /><Skeleton className="h-3 w-3/4 mb-3" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function DashboardInquiries() {
    const [inquiries, setInquiries] = useState<InquiryRow[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterPriority, setFilterPriority] = useState("all")
    const [sortByPriority, setSortByPriority] = useState(false)
    const [selected, setSelected] = useState<InquiryRow | null>(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [updating, setUpdating] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [convertModal, setConvertModal] = useState(false)

    const [talentDetails, setTalentDetails] = useState<any | null>(null)
    const [loadingTalent, setLoadingTalent] = useState(false)

    useEffect(() => {
        if (!selected?.talentId) {
            setTalentDetails(null)
            return
        }

        setLoadingTalent(true)
        portalFetch.get<Talent[]>(`/admin/talents/${selected.talentId}`)
            .then((res) => setTalentDetails(res))
            .catch(() => toast.error("Failed to load talent details"))
            .finally(() => setLoadingTalent(false))
    }, [selected])

    useEffect(() => {
        portalFetch.get<InquiryRow[]>("/admin/inquiries")
            .then(setInquiries)
            .catch(() => toast.error("Failed to load inquiries"))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => setCurrentPage(1), [search, filterStatus, filterPriority])

    const filtered = useMemo(() => {
        let list = inquiries
            .filter((i) => {
                if (filterStatus === "converted") return !!i.clientId
                if (filterStatus === "all") return true
                return i.status === filterStatus
            })
            .filter((i) => filterPriority === "all" || i.priority === filterPriority)
            .filter((i) =>
                i.name.toLowerCase().includes(search.toLowerCase()) ||
                (i.company ?? "").toLowerCase().includes(search.toLowerCase()) ||
                i.email.toLowerCase().includes(search.toLowerCase())
            )

        if (sortByPriority) {
            list = [...list].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9))
        }

        return list
    }, [inquiries, filterStatus, filterPriority, search, sortByPriority])

    const totalPages = useMemo(() => Math.ceil(filtered.length / PAGE_SIZE), [filtered])
    const paginated = useMemo(() =>
        filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filtered, currentPage]
    )

    const counts = useMemo(() => ({
        all: inquiries.length,
        new: inquiries.filter((i) => i.status === "new").length,
        in_progress: inquiries.filter((i) => i.status === "in_progress").length,
        resolved: inquiries.filter((i) => i.status === "resolved").length,
        converted: inquiries.filter((i) => !!i.clientId).length,
    }), [inquiries])

    const patchInquiry = async (id: string, payload: Partial<Inquiry>) => {
        setUpdating(true)
        try {
            const updated = await portalFetch.patch<InquiryRow>(`/admin/inquiries/${id}`, payload)
            setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, ...updated } : i))
            setSelected((prev) => prev?.id === id ? { ...prev, ...updated } : prev)
            return updated
        } finally {
            setUpdating(false)
        }
    }

    const handleStatusChange = async (id: string, status: Inquiry["status"]) => {
        try {
            await patchInquiry(id, { status })
            toast.success(`Moved to ${INQUIRY_STATUS_CONFIG[status]?.label ?? status}`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update status")
        }
    }

    const handlePriorityChange = async (id: string, priority: Inquiry["priority"]) => {
        try {
            await patchInquiry(id, { priority })
            toast.success(`Priority set to ${PRIORITY_CONFIG[priority]?.label ?? priority}`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update priority")
        }
    }

    const handleDelete = async () => {
        if (!selected) return
        setDeleting(true)
        try {
            await portalFetch.delete(`/admin/inquiries/${selected.id}`)
            setInquiries((prev) => prev.filter((i) => i.id !== selected.id))
            setSelected(null)
            setDeleteModal(false)
            toast.success("Inquiry deleted")
        } catch (err: any) {
            toast.error(err.message ?? "Failed to delete inquiry")
        } finally {
            setDeleting(false)
        }
    }

    const handleConverted = (result: { client: ClientRow; project: Project }) => {
        setInquiries((prev) => prev.map((i) =>
            i.id === selected?.id
                ? { ...i, clientId: result.client.id, status: "in_progress", projectTitle: result.project.title }
                : i
        ))
        setSelected(null)
        toast.success(`${result.client.name} is now a client! Project "${result.project.title}" created.`)
    }

    if (loading) return <InquiriesSkeleton />

    return (
        <div className="p-8 md:p-10">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Inquiries</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">{inquiries.length} total client inquiries</p>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap mb-4">
                {EXTENDED_STATUSES.map((s) => (
                    <button
                        key={s.value}
                        onClick={() => setFilterStatus(s.value)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
                            filterStatus === s.value
                                ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 border-transparent"
                                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700",
                            // Distinct style for the Converted tab when inactive
                            s.value === "converted" && filterStatus !== "converted" &&
                            "border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/5 hover:bg-emerald-100 dark:hover:bg-emerald-500/10"
                        )}
                    >
                        {s.value === "converted" && <FolderKanban size={13} />}
                        {s.label}
                        <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded-md font-semibold",
                            filterStatus === s.value
                                ? "bg-white/20"
                                : s.value === "converted"
                                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                    : "bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400"
                        )}>
                            {counts[s.value as keyof typeof counts] ?? 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search + Priority + Sort */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by name, company or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-amber-400 transition-all"
                    />
                </div>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-36 rounded-xl border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-sm text-zinc-600 dark:text-zinc-400">
                        <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl dark:bg-zinc-900 dark:border-white/10">
                        <SelectItem value="all">All Priority</SelectItem>
                        {Object.entries(PRIORITY_CONFIG).map(([val, cfg]) => (
                            <SelectItem key={val} value={val}>{cfg.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* Priority sort toggle */}
                <button
                    onClick={() => setSortByPriority((v) => !v)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                        sortByPriority
                            ? "bg-amber-400 border-amber-400 text-zinc-950"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                    )}
                >
                    <AlertTriangle size={14} />
                    {sortByPriority ? "Sorted by Priority" : "Sort by Priority"}
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
                            {filterStatus === "converted" ? "No converted inquiries yet." : "No inquiries found."}
                        </div>
                    ) : paginated.map((inquiry) => (
                        <div
                            key={inquiry.id}
                            onClick={() => setSelected(inquiry)}
                            className={cn(
                                "bg-white dark:bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-sm",
                                selected?.id === inquiry.id
                                    ? "border-amber-400 shadow-sm shadow-amber-100 dark:shadow-amber-500/10"
                                    : "border-zinc-100 dark:border-white/5 hover:border-zinc-200 dark:hover:border-white/10"
                            )}
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{inquiry.name}</p>
                                        {inquiry.clientId && (
                                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                                                <CheckCircle size={9} /> Client
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-zinc-400 dark:text-zinc-500 text-xs truncate">{inquiry.company ?? "—"}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <span className={cn(
                                        "hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
                                        PRIORITY_CONFIG[inquiry.priority as keyof typeof PRIORITY_CONFIG]?.cls
                                    )}>
                                        <span className={cn("w-1.5 h-1.5 rounded-full", PRIORITY_CONFIG[inquiry.priority as keyof typeof PRIORITY_CONFIG]?.dot)} />
                                        {PRIORITY_CONFIG[inquiry.priority as keyof typeof PRIORITY_CONFIG]?.label}
                                    </span>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-xs font-medium",
                                        INQUIRY_STATUS_CONFIG[inquiry.status]?.className ?? "bg-zinc-100 text-zinc-500"
                                    )}>
                                        {INQUIRY_STATUS_CONFIG[inquiry.status]?.label ?? inquiry.status}
                                    </span>
                                </div>
                            </div>

                            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-3">
                                {inquiry.message}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-zinc-300 dark:text-zinc-600 text-xs">
                                    <Calendar size={11} />
                                    {formatDate(inquiry.createdAt)}
                                </div>
                                <div className="flex items-center gap-2">
                                    {inquiry.projectTitle && (
                                        <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                                            <FolderKanban size={11} /> {inquiry.projectTitle}
                                        </span>
                                    )}
                                    {inquiry.talentName && (
                                        <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                                            <User size={11} /> {inquiry.talentName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

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

                {/* Detail Panel */}
                {selected && (
                    <div className="hidden lg:flex flex-col flex-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl overflow-hidden min-w-0">

                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Inquiry Details</h3>
                                <span className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
                                    PRIORITY_CONFIG[selected.priority as keyof typeof PRIORITY_CONFIG]?.cls
                                )}>
                                    <AlertTriangle size={10} />
                                    {PRIORITY_CONFIG[selected.priority as keyof typeof PRIORITY_CONFIG]?.label}
                                </span>
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

                            {/* Contact */}
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                        {selected.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-zinc-900 dark:text-white text-sm">{selected.name}</p>
                                            {selected.clientId && (
                                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                    <CheckCircle size={9} /> Converted
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-zinc-400 dark:text-zinc-500 text-xs">{selected.company ?? "No company"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-white/5 rounded-2xl p-4">
                                    {[
                                        { icon: Mail, value: selected.email, href: `mailto:${selected.email}`, amber: true },
                                        { icon: Phone, value: selected.phone, href: null, amber: false },
                                        { icon: Building2, value: selected.company, href: null, amber: false },
                                        { icon: Calendar, value: formatDate(selected.createdAt), href: null, amber: false },
                                        { icon: DollarSign, value: selected.budget, href: null, amber: false },
                                        { icon: Tag, value: SOURCE_LABEL[selected.source] ?? selected.source, href: null, amber: false },
                                        { icon: User, value: selected.talentName ? `Talent: ${selected.talentName}` : null, href: null, amber: false },
                                        { icon: User, value: selected.adminName ? `Handler: ${selected.adminName}` : null, href: null, amber: true },
                                        { icon: FolderKanban, value: selected.projectTitle ? `Project: ${selected.projectTitle}` : null, href: null, amber: false },
                                    ].filter((r) => r.value).map(({ icon: Icon, value, href, amber }, i) => (
                                        <div key={i} className="flex items-center gap-2.5">
                                            <Icon size={13} className="text-zinc-400 shrink-0" />
                                            {href
                                                ? <a href={href} className="text-amber-500 hover:underline text-xs truncate">{value}</a>
                                                : <span className={cn("text-xs", amber ? "text-amber-500" : "text-zinc-600 dark:text-zinc-400")}>{value}</span>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare size={13} className="text-zinc-400" />
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Message</p>
                                </div>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed bg-zinc-50 dark:bg-white/5 rounded-2xl p-4">
                                    {selected.message}
                                </p>
                            </div>

                            {/* Notes */}
                            {selected.notes && (
                                <div>
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Internal Notes</p>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-4">
                                        {selected.notes}
                                    </p>
                                </div>
                            )}

                            {/* Move Inquiry */}
                            <div>
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Move Inquiry</p>
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
                                {selected.status === "resolved" && selected.resolvedAt && (
                                    <p className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle size={11} /> Resolved on {formatDate(selected.resolvedAt)}
                                    </p>
                                )}
                            </div>

                            {/* Priority */}
                            <div>
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Priority</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {(Object.entries(PRIORITY_CONFIG) as [keyof typeof PRIORITY_CONFIG, typeof PRIORITY_CONFIG[keyof typeof PRIORITY_CONFIG]][]).map(([val, cfg]) => (
                                        <button
                                            key={val}
                                            disabled={updating || selected.priority === val}
                                            onClick={() => handlePriorityChange(selected.id, val as Inquiry["priority"])}
                                            className={cn(
                                                "flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-xs font-semibold transition-all",
                                                selected.priority === val
                                                    ? cn(cfg.cls, "border-current ring-1 ring-current/20 scale-105")
                                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-600 hover:border-zinc-300 dark:hover:border-white/20 hover:scale-105 disabled:opacity-40"
                                            )}
                                        >
                                            <span className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                                            {cfg.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {!selected.clientId && (
                            <button
                                onClick={() => setConvertModal(true)}
                                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-colors mx-6 mb-2"
                            >
                                <UserPlus size={15} /> Accept & Convert to Client
                            </button>
                        )}

                        {selected.clientId && (
                            <div className="flex items-center justify-center gap-2 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mx-6 mb-2">
                                <CheckCircle size={13} /> Already converted to client
                            </div>
                        )}

                        {/* Panel Footer */}
                        <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/5 flex flex-col gap-2 shrink-0">
                            <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selected.email}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all"
                            >
                                <Mail size={15} /> Reply via Email
                            </a>
                            <button
                                onClick={() => setDeleteModal(true)}
                                className="flex items-center justify-center gap-2 h-11 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium text-sm transition-colors"
                            >
                                <Trash2 size={15} /> Delete Inquiry
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Delete Inquiry</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
                            Are you sure you want to delete the inquiry from <strong className="text-zinc-900 dark:text-white">{selected?.name}</strong>? This cannot be undone.
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

            {convertModal && selected && (
                <ConvertInquiryModal
                    inquiry={selected}
                    onClose={() => setConvertModal(false)}
                    onConverted={handleConverted}
                />
            )}
        </div>
    )
}