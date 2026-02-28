"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import {
    Search, X, Mail, Building2, Calendar, MessageSquare,
    Phone, DollarSign, Tag, User, AlertTriangle, CheckCircle,
    Clock, Inbox, RefreshCw, Trash2, ArrowRight,
    UserPlus, FolderKanban, Plus, ExternalLink,
    ChevronLeft, ChevronRight, Flame, Zap, Circle,
    MailOpen, Filter, SlidersHorizontal, ArrowUpRight,
    Star, TrendingUp, Hash,
} from "lucide-react"
import ConvertInquiryModal from "./convert-inquiry-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { INQUIRY_STATUS_CONFIG, INQUIRY_STATUSES } from "@/lib/helpers/constants"
import { portalFetch } from "@/lib/api/private-fetcher"
import { formatDate } from "@/lib/helpers/format"
import { toast } from "sonner"
import type { ClientRow, Inquiry, Project } from "@/server/db/schema"
import CreateInquiryModal from "./create-inquiry-modal"

type InquiryRow = Inquiry & {
    talentName: string | null
    adminName: string | null
    projectTitle?: string | null
}

const PAGE_SIZE = 20

// ─── Config ───────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
    low: {
        label: "Low",
        cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
        dot: "bg-zinc-400",
        bar: "bg-zinc-300 dark:bg-zinc-600",
        icon: Circle,
    },
    medium: {
        label: "Medium",
        cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
        dot: "bg-blue-400",
        bar: "bg-blue-400",
        icon: TrendingUp,
    },
    high: {
        label: "High",
        cls: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
        dot: "bg-orange-400",
        bar: "bg-orange-400",
        icon: Flame,
    },
    urgent: {
        label: "Urgent",
        cls: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
        dot: "bg-red-500",
        bar: "bg-red-500",
        icon: Zap,
    },
} as const

const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

const SOURCE_LABEL: Record<string, string> = {
    contact_form: "Contact Form",
    referral: "Referral",
    social_media: "Social Media",
    direct: "Direct",
    other: "Other",
}

const STATUS_ACTIONS: Record<string, {
    label: string; next: Inquiry["status"]; icon: React.ElementType; cls: string
}[]> = {
    new: [
        { label: "Start Working", next: "in_progress", icon: Clock, cls: "bg-blue-500 hover:bg-blue-400 text-white" },
        { label: "Mark Resolved", next: "resolved", icon: CheckCircle, cls: "bg-emerald-500 hover:bg-emerald-400 text-white" },
    ],
    in_progress: [
        { label: "Mark Resolved", next: "resolved", icon: CheckCircle, cls: "bg-emerald-500 hover:bg-emerald-400 text-white" },
        { label: "Move to New", next: "new", icon: Inbox, cls: "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300" },
    ],
    resolved: [
        { label: "Reopen", next: "in_progress", icon: RefreshCw, cls: "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300" },
    ],
}

const STATUS_FILTERS = [
    { value: "all", label: "All" },
    { value: "new", label: "New" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "converted", label: "Converted" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date | string | null | undefined): string {
    if (!date) return "—"
    const d = new Date(date)
    const diff = (Date.now() - d.getTime()) / 1000
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return formatDate(date)
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function InquiriesSkeleton() {
    return (
        <div className="flex h-[100dvh] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
            {/* List pane */}
            <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 border-r border-zinc-100 dark:border-white/[0.07] bg-white dark:bg-zinc-900 p-4 space-y-3">
                <Skeleton className="h-9 w-full rounded-xl" />
                <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-7 flex-1 rounded-lg" />)}
                </div>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="p-3 space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-3.5 w-28 rounded" />
                            <Skeleton className="h-3 w-12 rounded" />
                        </div>
                        <Skeleton className="h-3 w-full rounded" />
                        <Skeleton className="h-3 w-2/3 rounded" />
                    </div>
                ))}
            </div>
            {/* Detail pane — desktop only */}
            <div className="hidden lg:block flex-1 p-8 space-y-4">
                <Skeleton className="h-8 w-48 rounded-xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
        </div>
    )
}

// ─── List Item ────────────────────────────────────────────────────────────────

function InquiryListItem({
    inquiry,
    isSelected,
    onClick,
}: {
    inquiry: InquiryRow
    isSelected: boolean
    onClick: () => void
}) {
    const pCfg = PRIORITY_CONFIG[inquiry.priority as keyof typeof PRIORITY_CONFIG]
    const sCfg = INQUIRY_STATUS_CONFIG[inquiry.status]
    const PriorityIcon = pCfg?.icon ?? Circle
    const isUnread = inquiry.status === "new"
    const isUrgent = inquiry.priority === "urgent"

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left px-3.5 py-3 rounded-xl transition-all duration-150 group relative",
                isSelected
                    ? "bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-300/60 dark:ring-amber-500/30"
                    : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]",
                isUrgent && !isSelected && "border-l-2 border-l-red-500 rounded-l-none pl-[calc(0.875rem-2px)]"
            )}
        >
            {/* Unread dot */}
            {isUnread && (
                <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            )}

            <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                    {/* Avatar */}
                    <div className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[10px] shrink-0",
                        isUrgent ? "bg-gradient-to-br from-red-500 to-orange-500"
                            : "bg-gradient-to-br from-amber-400 to-orange-400"
                    )}>
                        {inquiry.name.charAt(0)}
                    </div>
                    <span className={cn(
                        "text-sm truncate",
                        isUnread ? "font-semibold text-zinc-900 dark:text-white" : "font-medium text-zinc-700 dark:text-zinc-300"
                    )}>
                        {inquiry.name}
                    </span>
                    {inquiry.clientId && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Converted" />
                    )}
                </div>
                <span className="text-[10px] text-zinc-400 whitespace-nowrap shrink-0 mt-0.5">
                    {timeAgo(inquiry.createdAt)}
                </span>
            </div>

            {/* Company + message preview */}
            <div className="pl-8">
                {inquiry.company && (
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mb-0.5">{inquiry.company}</p>
                )}
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {inquiry.message}
                </p>
            </div>

            {/* Tags row */}
            <div className="flex items-center gap-1.5 mt-2 pl-8">
                <span className={cn(
                    "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold",
                    pCfg?.cls
                )}>
                    <PriorityIcon size={8} />
                    {pCfg?.label}
                </span>
                <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-medium",
                    sCfg?.className ?? "bg-zinc-100 text-zinc-500"
                )}>
                    {sCfg?.label ?? inquiry.status}
                </span>
            </div>
        </button>
    )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function InquiryDetailPanel({
    inquiry,
    updating,
    onStatusChange,
    onPriorityChange,
    onConvert,
    onDelete,
}: {
    inquiry: InquiryRow
    updating: boolean
    onStatusChange: (id: string, status: Inquiry["status"]) => void
    onPriorityChange: (id: string, priority: Inquiry["priority"]) => void
    onConvert: () => void
    onDelete: () => void
}) {
    const pCfg = PRIORITY_CONFIG[inquiry.priority as keyof typeof PRIORITY_CONFIG]
    const sCfg = INQUIRY_STATUS_CONFIG[inquiry.status]
    const PriorityIcon = pCfg?.icon ?? Circle
    const isUrgent = inquiry.priority === "urgent"
    const isHigh = inquiry.priority === "high"
    const actions = STATUS_ACTIONS[inquiry.status] ?? []

    return (
        <div className="flex flex-col h-full overflow-hidden">

            {/* Top strip — priority accent for urgent/high */}
            {(isUrgent || isHigh) && (
                <div className={cn(
                    "h-1 w-full shrink-0",
                    isUrgent ? "bg-gradient-to-r from-red-500 via-orange-500 to-red-500"
                        : "bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400"
                )} />
            )}

            <div className="flex-1 overflow-y-auto
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full">

                {/* Hero section */}
                <div className="px-4 md:px-8 pt-5 md:pt-8 pb-5 md:pb-6 border-b border-zinc-100 dark:border-white/[0.07]">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={cn(
                                "w-11 h-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl md:text-2xl shrink-0 shadow-md",
                                isUrgent ? "bg-gradient-to-br from-red-500 to-orange-500 shadow-red-200 dark:shadow-red-500/20"
                                    : "bg-gradient-to-br from-amber-400 to-orange-400 shadow-amber-200 dark:shadow-amber-500/20"
                            )}>
                                {inquiry.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white tracking-tight truncate">
                                        {inquiry.name}
                                    </h2>
                                    {inquiry.clientId && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shrink-0">
                                            <CheckCircle size={9} /> Client
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs md:text-sm text-zinc-400 mt-0.5 truncate">{inquiry.company ?? inquiry.email}</p>
                            </div>
                        </div>

                        {/* Status + Priority badges */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className={cn(
                                "flex items-center gap-1.5 px-2 md:px-2.5 py-1 rounded-lg text-xs font-semibold",
                                sCfg?.className ?? "bg-zinc-100 text-zinc-500"
                            )}>
                                {sCfg?.label ?? inquiry.status}
                            </span>
                            <span className={cn(
                                "flex items-center gap-1.5 px-2 md:px-2.5 py-1 rounded-lg text-xs font-semibold",
                                pCfg?.cls
                            )}>
                                <PriorityIcon size={10} />
                                {pCfg?.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-4 md:px-8 py-5 md:py-6 space-y-5 md:space-y-6">

                    {/* Message — main content, hero treatment */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <MailOpen size={13} className="text-zinc-400" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em]">Message</span>
                        </div>
                        <div className="bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/[0.06] rounded-2xl p-5">
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {inquiry.message}
                            </p>
                        </div>
                    </div>

                    {/* Info grid */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Hash size={13} className="text-zinc-400" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em]">Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { icon: Mail, label: "Email", value: inquiry.email, href: `mailto:${inquiry.email}` },
                                { icon: Phone, label: "Phone", value: inquiry.phone ?? "—", href: null },
                                { icon: Building2, label: "Company", value: inquiry.company ?? "—", href: null },
                                { icon: Calendar, label: "Received", value: timeAgo(inquiry.createdAt), href: null },
                                { icon: DollarSign, label: "Budget", value: inquiry.budget ?? "—", href: null },
                                { icon: Tag, label: "Source", value: SOURCE_LABEL[inquiry.source] ?? inquiry.source, href: null },
                                ...(inquiry.talentName ? [{ icon: User, label: "Talent", value: inquiry.talentName, href: null }] : []),
                                ...(inquiry.adminName ? [{ icon: User, label: "Handler", value: inquiry.adminName, href: null }] : []),
                                ...(inquiry.projectTitle ? [{ icon: FolderKanban, label: "Project", value: inquiry.projectTitle, href: null }] : []),
                            ].map(({ icon: Icon, label, value, href }, i) => (
                                <div key={i} className="bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/[0.05] rounded-xl p-3">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Icon size={10} className="text-zinc-400 shrink-0" />
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
                                    </div>
                                    {href ? (
                                        <a href={href} className="text-xs font-semibold text-amber-500 hover:underline truncate block">
                                            {value}
                                        </a>
                                    ) : (
                                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">{value}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    {inquiry.notes && (
                        <div className="bg-amber-50/80 dark:bg-amber-500/5 border border-amber-200/60 dark:border-amber-500/20 rounded-2xl p-4">
                            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                                Internal Notes
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{inquiry.notes}</p>
                        </div>
                    )}

                    {/* Priority selector */}
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] mb-3">Set Priority</p>
                        <div className="grid grid-cols-4 gap-2">
                            {(Object.entries(PRIORITY_CONFIG) as [keyof typeof PRIORITY_CONFIG, typeof PRIORITY_CONFIG[keyof typeof PRIORITY_CONFIG]][]).map(([val, cfg]) => {
                                const Icon = cfg.icon
                                const isActive = inquiry.priority === val
                                return (
                                    <button
                                        key={val}
                                        disabled={updating || isActive}
                                        onClick={() => onPriorityChange(inquiry.id, val as Inquiry["priority"])}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 py-3 rounded-xl border text-[11px] font-semibold transition-all active:scale-95",
                                            isActive
                                                ? cn(cfg.cls, "ring-2 ring-current/20 scale-[1.03] border-transparent")
                                                : "bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/[0.08] text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-40"
                                        )}
                                    >
                                        <Icon size={12} />
                                        {cfg.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Status actions */}
                    {actions.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] mb-3">Move Inquiry</p>
                            <div className="flex flex-col gap-2">
                                {actions.map((action) => (
                                    <button
                                        key={action.next}
                                        disabled={updating}
                                        onClick={() => onStatusChange(inquiry.id, action.next)}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 active:scale-[0.99]",
                                            action.cls
                                        )}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {updating
                                                ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                                : <action.icon size={14} />
                                            }
                                            {action.label}
                                        </div>
                                        <ArrowRight size={13} className="opacity-50" />
                                    </button>
                                ))}
                                {inquiry.status === "resolved" && inquiry.resolvedAt && (
                                    <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 px-1">
                                        <CheckCircle size={10} /> Resolved {timeAgo(inquiry.resolvedAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky action footer */}
            <div className="shrink-0 px-4 md:px-8 py-4 md:py-5 border-t border-zinc-100 dark:border-white/[0.07] bg-white dark:bg-zinc-900 space-y-2.5">

                {/* Convert CTA — visually dominant */}
                {!inquiry.clientId ? (
                    <button
                        onClick={onConvert}
                        className="w-full flex items-center justify-between px-5 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md shadow-emerald-200 dark:shadow-emerald-500/20 group"
                    >
                        <div className="flex items-center gap-2.5">
                            <UserPlus size={15} />
                            Accept & Convert to Client
                        </div>
                        <ArrowUpRight size={14} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                ) : (
                    <div className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-500/20">
                        <CheckCircle size={12} /> Already converted to client
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                    <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${inquiry.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-zinc-950 font-bold text-xs transition-all"
                    >
                        <Mail size={13} /> Reply via Email
                    </a>
                    <button
                        onClick={onDelete}
                        className="flex items-center justify-center gap-2 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-red-200 dark:hover:border-red-500/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 font-medium text-xs transition-all"
                    >
                        <Trash2 size={13} /> Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-12">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Inbox size={24} className="text-zinc-400" />
            </div>
            <div>
                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                    {hasFilter ? "No matching inquiries" : "No inquiries yet"}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    {hasFilter ? "Try adjusting your search or filters" : "New inquiries will appear here"}
                </p>
            </div>
        </div>
    )
}

// ─── No Selection ─────────────────────────────────────────────────────────────

function NoSelection({ count }: { count: number }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-12 bg-zinc-50 dark:bg-zinc-950">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.07] flex items-center justify-center shadow-sm">
                <MailOpen size={22} className="text-zinc-400" />
            </div>
            <div>
                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                    Select an inquiry
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    {count} {count === 1 ? "inquiry" : "inquiries"} in your inbox
                </p>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardInquiries() {
    const [inquiries, setInquiries] = useState<InquiryRow[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterPriority, setFilterPriority] = useState("all")
    const [sortByPriority, setSortByPriority] = useState(false)
    const [selected, setSelected] = useState<InquiryRow | null>(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [convertModal, setConvertModal] = useState(false)
    const [createModal, setCreateModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        portalFetch.get<InquiryRow[]>("/admin/inquiries")
            .then(setInquiries)
            .catch(() => toast.error("Failed to load inquiries"))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => setCurrentPage(1), [search, filterStatus, filterPriority])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (deleteModal) { setDeleteModal(false); return }
                if (convertModal) { setConvertModal(false); return }
                if (createModal) { setCreateModal(false); return }
                setSelected(null)
            }
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [deleteModal, convertModal, createModal])

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

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    const counts = useMemo(() => ({
        all: inquiries.length,
        new: inquiries.filter(i => i.status === "new").length,
        in_progress: inquiries.filter(i => i.status === "in_progress").length,
        resolved: inquiries.filter(i => i.status === "resolved").length,
        converted: inquiries.filter(i => !!i.clientId).length,
    }), [inquiries])

    const urgentCount = useMemo(() =>
        inquiries.filter(i => i.priority === "urgent" && i.status !== "resolved").length,
        [inquiries]
    )

    const patchInquiry = async (id: string, payload: Partial<Inquiry>) => {
        setUpdating(true)
        try {
            const updated = await portalFetch.patch<InquiryRow>(`/admin/inquiries/${id}`, payload)
            setInquiries(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i))
            setSelected(prev => prev?.id === id ? { ...prev, ...updated } : prev)
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
            toast.error(err.message ?? "Failed to update")
        }
    }

    const handlePriorityChange = async (id: string, priority: Inquiry["priority"]) => {
        try {
            await patchInquiry(id, { priority })
            toast.success(`Priority → ${PRIORITY_CONFIG[priority]?.label}`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update")
        }
    }

    const handleDelete = async () => {
        if (!selected) return
        setDeleting(true)
        try {
            await portalFetch.delete(`/admin/inquiries/${selected.id}`)
            setInquiries(prev => prev.filter(i => i.id !== selected.id))
            setSelected(null)
            setDeleteModal(false)
            toast.success("Inquiry deleted")
        } catch (err: any) {
            toast.error(err.message ?? "Failed to delete")
        } finally {
            setDeleting(false)
        }
    }

    const handleConverted = (result: { client: ClientRow; project: Project }) => {
        setInquiries(prev => prev.map(i =>
            i.id === selected?.id
                ? { ...i, clientId: result.client.id, status: "in_progress", projectTitle: result.project.title }
                : i
        ))
        setSelected(null)
        toast.success(`${result.client.name} is now a client!`)
    }

    if (loading) return <InquiriesSkeleton />

    // On mobile: show list OR detail (not both at once)
    const showDetail = !!selected
    const showList = !selected // mobile: hide list when detail is open

    // Shared sidebar content extracted for reuse
    const sidebarHeader = (
        <div className="shrink-0 px-4 pt-5 pb-3 border-b border-zinc-100 dark:border-white/[0.07]">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">Inquiries</h1>
                    {urgentCount > 0 && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold">
                            <Flame size={9} /> {urgentCount} urgent
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setCreateModal(true)}
                    className="flex items-center gap-1 px-2.5 h-7 rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 font-bold text-xs transition-all"
                >
                    <Plus size={11} /> New
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search inquiries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all"
                />
                {search && (
                    <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                        <X size={11} />
                    </button>
                )}
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {STATUS_FILTERS.map((s) => {
                    const count = counts[s.value as keyof typeof counts] ?? 0
                    const isActive = filterStatus === s.value
                    return (
                        <button
                            key={s.value}
                            onClick={() => setFilterStatus(s.value)}
                            className={cn(
                                "flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0",
                                isActive
                                    ? s.value === "converted"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                    : s.value === "converted"
                                        ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5"
                            )}
                        >
                            {s.label}
                            <span className={cn(
                                "tabular-nums text-[10px] px-1 py-0.5 rounded font-semibold",
                                isActive ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                            )}>
                                {count}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Priority + Sort controls */}
            <div className="flex items-center gap-2 mt-2.5">
                <div className="flex gap-1 flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {["all", "urgent", "high", "medium", "low"].map(p => {
                        const cfg = p !== "all" ? PRIORITY_CONFIG[p as keyof typeof PRIORITY_CONFIG] : null
                        const isActive = filterPriority === p
                        return (
                            <button
                                key={p}
                                onClick={() => setFilterPriority(p)}
                                className={cn(
                                    "flex items-center gap-1 px-2 h-6 rounded-md text-[10px] font-semibold whitespace-nowrap transition-all shrink-0",
                                    isActive
                                        ? cfg ? cfg.cls + " ring-1 ring-current/20" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                                        : "text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-white/5"
                                )}
                            >
                                {cfg && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />}
                                {p === "all" ? "All" : cfg?.label}
                            </button>
                        )
                    })}
                </div>
                <button
                    onClick={() => setSortByPriority(v => !v)}
                    className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center transition-all shrink-0",
                        sortByPriority ? "bg-amber-400 text-zinc-950" : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-600"
                    )}
                    title="Sort by priority"
                >
                    <SlidersHorizontal size={11} />
                </button>
            </div>
        </div>
    )

    const sidebarList = (
        <>
            {(search || filterStatus !== "all" || filterPriority !== "all") && (
                <div className="px-4 py-2 text-[10px] text-zinc-400 border-b border-zinc-100 dark:border-white/[0.05] shrink-0">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </div>
            )}
            <div className="flex-1 overflow-y-auto py-2 px-2
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full">
                {paginated.length === 0 ? (
                    <EmptyState hasFilter={!!(search || filterStatus !== "all" || filterPriority !== "all")} />
                ) : (
                    <div className="space-y-0.5">
                        {paginated.map((inquiry) => (
                            <InquiryListItem
                                key={inquiry.id}
                                inquiry={inquiry}
                                isSelected={selected?.id === inquiry.id}
                                onClick={() => setSelected(selected?.id === inquiry.id ? null : inquiry)}
                            />
                        ))}
                    </div>
                )}
            </div>
            {totalPages > 1 && (
                <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-white/[0.07]">
                    <span className="text-[10px] text-zinc-400 tabular-nums">
                        {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="w-6 h-6 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                            <ChevronLeft size={13} />
                        </button>
                        <span className="text-[10px] text-zinc-400 tabular-nums px-1">{currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="w-6 h-6 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                            <ChevronRight size={13} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )

    return (
        <div className="flex h-[100dvh] overflow-hidden bg-zinc-50 dark:bg-zinc-950">

            {/* ── MOBILE: List view (hidden when detail is open) ── */}
            <div className={cn(
                "flex flex-col w-full bg-white dark:bg-zinc-900 overflow-hidden",
                "lg:hidden",
                showList ? "flex" : "hidden"
            )}>
                {sidebarHeader}
                {sidebarList}
            </div>

            {/* ── MOBILE: Detail view (full screen, shown when item selected) ── */}
            {showDetail && (
                <div className="lg:hidden flex flex-col w-full bg-white dark:bg-zinc-900 overflow-hidden">
                    {/* Mobile detail header with back button */}
                    <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-white/[0.07] bg-white dark:bg-zinc-900">
                        <button
                            onClick={() => setSelected(null)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            <ChevronLeft size={15} />
                            Back
                        </button>
                        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{selected.name}</p>
                        {selected.priority === "urgent" && (
                            <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold shrink-0">
                                <Zap size={9} /> Urgent
                            </span>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <InquiryDetailPanel
                            inquiry={selected}
                            updating={updating}
                            onStatusChange={handleStatusChange}
                            onPriorityChange={handlePriorityChange}
                            onConvert={() => setConvertModal(true)}
                            onDelete={() => setDeleteModal(true)}
                        />
                    </div>
                </div>
            )}

            {/* ── DESKTOP: Side-by-side split layout (lg+) ── */}
            <div className="hidden lg:flex w-full overflow-hidden">

                {/* Left sidebar */}
                <div className="flex flex-col w-[360px] xl:w-[400px] shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-white/[0.07] overflow-hidden">
                    {sidebarHeader}
                    {sidebarList}
                </div>

                {/* Right detail panel */}
                <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-900 flex flex-col">
                    {selected ? (
                        <InquiryDetailPanel
                            inquiry={selected}
                            updating={updating}
                            onStatusChange={handleStatusChange}
                            onPriorityChange={handlePriorityChange}
                            onConvert={() => setConvertModal(true)}
                            onDelete={() => setDeleteModal(true)}
                        />
                    ) : (
                        <NoSelection count={filtered.length} />
                    )}
                </div>
            </div>

            {/* ── MODALS ── */}

            {/* Delete confirm */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-zinc-100 dark:border-white/10">
                        <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                            <Trash2 size={16} className="text-red-500" />
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-1.5">Delete Inquiry</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
                            Delete the inquiry from{" "}
                            <strong className="text-zinc-900 dark:text-white">{selected?.name}</strong>? This can't be undone.
                        </p>
                        <div className="flex gap-2.5">
                            <button
                                onClick={() => setDeleteModal(false)}
                                className="flex-1 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 h-9 flex items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-400 active:scale-[0.98] disabled:opacity-50 text-white text-sm font-bold transition-all"
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

            {createModal && (
                <CreateInquiryModal
                    onClose={() => setCreateModal(false)}
                    onCreated={(newInquiry) => {
                        setInquiries(prev => [
                            { ...newInquiry, talentName: null, adminName: null, projectTitle: null },
                            ...prev,
                        ])
                        setCreateModal(false)
                    }}
                />
            )}
        </div>
    )
}