"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import {
    Search, X, Calendar, DollarSign, CheckCircle, Clock, Ban,
    FileText, ExternalLink, Building2, Briefcase, TrendingUp,
    Hourglass, Trash2, FolderKanban, Plus, ArrowRight,
    Send, Eye, ThumbsUp, FileCheck, Mail, CheckCircle2,
    Download, MoreHorizontal, Zap, Users, GripVertical,
} from "lucide-react"
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
    useDroppable,
} from "@dnd-kit/core"
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Skeleton } from "@/components/ui/skeleton"
import { portalFetch } from "@/lib/api/private-fetcher"
import { formatDate } from "@/lib/helpers/format"
import { toast } from "sonner"
import type { Placement } from "@/server/db/schema"
import CreatePlacementModal from "./create-placement-modal"
import { PlacementRow } from "@/server/services/placement.service"

// ─── Types ────────────────────────────────────────────────────────────────────

type InquiryStatus =
    | "draft" | "submitted" | "under_review" | "approved"
    | "contract_generated" | "contract_sent" | "contract_signed"
    | "active" | "rejected"

// ─── Constants ────────────────────────────────────────────────────────────────

const INQUIRY_STEPS: { key: InquiryStatus; label: string; icon: React.ElementType }[] = [
    { key: "draft", label: "Draft", icon: FileText },
    { key: "submitted", label: "Submitted", icon: Send },
    { key: "under_review", label: "Review", icon: Eye },
    { key: "approved", label: "Approved", icon: ThumbsUp },
    { key: "contract_generated", label: "Generated", icon: FileCheck },
    { key: "contract_sent", label: "Sent", icon: Mail },
    { key: "contract_signed", label: "Signed", icon: CheckCircle2 },
    { key: "active", label: "Active", icon: TrendingUp },
]
const INQUIRY_ORDER = INQUIRY_STEPS.map((s) => s.key)

const COLUMNS: {
    key: Placement["status"]
    label: string
    color: string
    dot: string
    headerBg: string
    countBg: string
    dropBg: string
}[] = [
        {
            key: "active",
            label: "Active",
            color: "text-emerald-600 dark:text-emerald-400",
            dot: "bg-emerald-500",
            headerBg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/20",
            countBg: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
            dropBg: "bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/40",
        },
        {
            key: "on_hold",
            label: "On Hold",
            color: "text-amber-600 dark:text-amber-400",
            dot: "bg-amber-400",
            headerBg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200/60 dark:border-amber-500/20",
            countBg: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
            dropBg: "bg-amber-50/80 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/40",
        },
        {
            key: "completed",
            label: "Completed",
            color: "text-zinc-500 dark:text-zinc-400",
            dot: "bg-zinc-400",
            headerBg: "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-white/10",
            countBg: "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300",
            dropBg: "bg-zinc-100/80 dark:bg-zinc-700/40 border-zinc-300 dark:border-zinc-500",
        },
        {
            key: "cancelled",
            label: "Cancelled",
            color: "text-red-500 dark:text-red-400",
            dot: "bg-red-500",
            headerBg: "bg-red-50 dark:bg-red-500/10 border-red-200/60 dark:border-red-500/20",
            countBg: "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300",
            dropBg: "bg-red-50/80 dark:bg-red-500/10 border-red-300 dark:border-red-500/40",
        },
    ]

const STATUS_TRANSITIONS: Record<string, { label: string; next: Placement["status"]; icon: React.ElementType }[]> = {
    active: [
        { label: "Complete", next: "completed", icon: CheckCircle },
        { label: "Hold", next: "on_hold", icon: Hourglass },
        { label: "Cancel", next: "cancelled", icon: Ban },
    ],
    on_hold: [
        { label: "Resume", next: "active", icon: TrendingUp },
        { label: "Cancel", next: "cancelled", icon: Ban },
    ],
    completed: [{ label: "Reactivate", next: "active", icon: TrendingUp }],
    cancelled: [{ label: "Reactivate", next: "active", icon: TrendingUp }],
}

const AVATAR_GRADIENTS = [
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-600",
    "from-cyan-500 to-sky-600",
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

function InquiryTimeline({ status }: { status: string }) {
    const currentIdx = INQUIRY_ORDER.indexOf(status as InquiryStatus)
    const isRejected = status === "rejected"
    const progress = isRejected ? 0 : Math.round((currentIdx / (INQUIRY_STEPS.length - 1)) * 100)

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.12em]">
                    Inquiry Progress
                </span>
                {isRejected ? (
                    <span className="text-[10px] font-bold text-red-500">Rejected</span>
                ) : (
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tabular-nums">{progress}%</span>
                )}
            </div>
            <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", isRejected ? "bg-red-400" : "bg-amber-400")}
                    style={{ width: isRejected ? "100%" : `${progress}%` }}
                />
            </div>
            <div className="flex items-center justify-between px-0.5">
                {INQUIRY_STEPS.map((step, idx) => {
                    const isDone = idx < currentIdx
                    const isCurrent = idx === currentIdx
                    return (
                        <div key={step.key} className="relative group/step flex flex-col items-center">
                            <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                                isDone ? "bg-amber-400 text-zinc-900"
                                    : isCurrent ? "bg-amber-400 text-zinc-900 ring-4 ring-amber-400/20"
                                        : isRejected ? "bg-red-200 dark:bg-red-500/20 text-red-400"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                            )}>
                                <step.icon size={9} />
                            </div>
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 dark:bg-zinc-700 text-white text-[10px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover/step:opacity-100 transition-opacity pointer-events-none z-10">
                                {step.label}
                                {isCurrent && <span className="ml-1 text-amber-400">← now</span>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function PlacementCardBase({
    placement,
    isSelected,
    isDragging = false,
    isOverlay = false,
    onClick,
    onStatusChange,
    updating,
    dragHandleProps,
}: {
    placement: PlacementRow
    isSelected: boolean
    isDragging?: boolean
    isOverlay?: boolean
    onClick?: () => void
    onStatusChange?: (id: string, status: Placement["status"]) => void
    updating?: boolean
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const transitions = STATUS_TRANSITIONS[placement.status] ?? []

    return (
        <div
            className={cn(
                "group relative bg-white dark:bg-zinc-900 border rounded-xl p-4 transition-all duration-150 select-none",
                isOverlay
                    ? "shadow-2xl shadow-zinc-400/30 dark:shadow-black/70 border-amber-400 ring-1 ring-amber-400/30 rotate-1 scale-[1.03] cursor-grabbing"
                    : isDragging
                        ? "opacity-40 scale-[0.98] border-dashed border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50"
                        : isSelected
                            ? "border-amber-400 shadow-md shadow-amber-100/60 dark:shadow-amber-500/10 ring-1 ring-amber-400/20 cursor-pointer"
                            : "border-zinc-100 dark:border-white/[0.07] hover:border-zinc-200 dark:hover:border-white/[0.12] hover:shadow-sm cursor-pointer"
            )}
            onClick={!isDragging ? onClick : undefined}
        >
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    {/* Drag handle */}
                    <div
                        {...dragHandleProps}
                        className={cn(
                            "shrink-0 text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors cursor-grab active:cursor-grabbing mt-0.5",
                            !isOverlay && "opacity-0 group-hover:opacity-100"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical size={13} />
                    </div>
                    <div className={cn(
                        "w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm",
                        getGradient(placement.talentName)
                    )}>
                        {placement.talentName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight truncate">
                            {placement.talentName}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">{placement.role}</p>
                    </div>
                </div>

                {/* Quick-action menu */}
                {transitions.length > 0 && !isOverlay && (
                    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className={cn(
                                "w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all",
                                menuOpen
                                    ? "bg-zinc-100 dark:bg-white/10 opacity-100"
                                    : "opacity-0 group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-white/10"
                            )}
                        >
                            <MoreHorizontal size={13} />
                        </button>
                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 top-7 z-20 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/10 rounded-xl shadow-xl py-1 min-w-[150px] overflow-hidden">
                                    <p className="px-3 pt-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                                        Move to
                                    </p>
                                    {transitions.map((t) => (
                                        <button
                                            key={t.next}
                                            disabled={updating}
                                            onClick={() => { onStatusChange?.(placement.id, t.next); setMenuOpen(false) }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                                        >
                                            <t.icon size={11} className="text-zinc-400" />
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Client + Rate */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <Building2 size={9} className="text-zinc-400 shrink-0" />
                    {placement.clientName}
                </span>
                {placement.hourlyRate && (
                    <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 ml-auto shrink-0">
                        <DollarSign size={9} />
                        {formatRate(placement.hourlyRate)}
                    </span>
                )}
            </div>

            {/* Inquiry mini progress */}
            {(placement as any).inquiryStatus && (
                <div className="mb-3">
                    {(() => {
                        const idx = INQUIRY_ORDER.indexOf((placement as any).inquiryStatus)
                        const pct = Math.round((idx / (INQUIRY_STEPS.length - 1)) * 100)
                        const step = INQUIRY_STEPS[idx]
                        return (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                        {step && <step.icon size={9} />}
                                        {step?.label ?? "Unknown"}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 tabular-nums">{pct}%</span>
                                </div>
                                <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        )
                    })()}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-white/5">
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                    <Calendar size={9} />
                    {formatDate(placement.startDate)}
                </span>
                {placement.hoursPerWeek && (
                    <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                        <Clock size={9} />
                        {placement.hoursPerWeek}h/wk
                    </span>
                )}
            </div>
        </div>
    )
}

function SortableCard({
    placement,
    isSelected,
    onClick,
    onStatusChange,
    updating,
}: {
    placement: PlacementRow
    isSelected: boolean
    onClick: () => void
    onStatusChange: (id: string, status: Placement["status"]) => void
    updating: boolean
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: placement.id,
        data: { placement },
    })

    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
            <PlacementCardBase
                placement={placement}
                isSelected={isSelected}
                isDragging={isDragging}
                onClick={onClick}
                onStatusChange={onStatusChange}
                updating={updating}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    )
}

// ─── Droppable column ─────────────────────────────────────────────────────────

function KanbanColumn({
    column, placements, selectedId, onSelect, onStatusChange, updatingId, onAdd, isOver,
}: {
    column: typeof COLUMNS[0]
    placements: PlacementRow[]
    selectedId: string | null
    onSelect: (p: PlacementRow | null) => void
    onStatusChange: (id: string, status: Placement["status"]) => void
    updatingId: string | null
    onAdd: () => void
    isOver: boolean
}) {
    const { setNodeRef } = useDroppable({ id: column.key })

    return (
        <div className="flex flex-col min-w-[272px] w-[272px] shrink-0">
            {/* Column header */}
            <div className={cn(
                "flex items-center justify-between px-3.5 py-3 rounded-xl border mb-3 transition-all duration-200",
                isOver ? column.dropBg : column.headerBg
            )}>
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "w-2 h-2 rounded-full shrink-0 transition-transform duration-200",
                        column.dot,
                        isOver && "scale-125"
                    )} />
                    <span className={cn("text-sm font-semibold", column.color)}>{column.label}</span>
                    <span className={cn(
                        "text-xs font-bold px-1.5 py-0.5 rounded-md tabular-nums transition-all",
                        column.countBg
                    )}>
                        {placements.length}
                    </span>
                </div>
                {column.key === "active" && (
                    <button
                        onClick={onAdd}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-white/10 transition-all"
                    >
                        <Plus size={13} />
                    </button>
                )}
            </div>

            {/* Drop zone */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex flex-col gap-2.5 flex-1 min-h-[120px] rounded-xl transition-all duration-200",
                    isOver && "ring-2 ring-dashed ring-zinc-300/70 dark:ring-zinc-600/70 bg-zinc-50/60 dark:bg-white/[0.015] p-1 -m-1"
                )}
            >
                <SortableContext items={placements.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    {placements.length === 0 ? (
                        <div className={cn(
                            "flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-xl gap-2 transition-all duration-200",
                            isOver
                                ? "border-zinc-300 dark:border-zinc-500 bg-white dark:bg-zinc-800/50 scale-[1.01]"
                                : "border-zinc-200 dark:border-white/[0.07]"
                        )}>
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <Briefcase size={14} className="text-zinc-400" />
                            </div>
                            <p className="text-[11px] text-zinc-400">
                                {isOver ? "Drop here" : "No placements"}
                            </p>
                        </div>
                    ) : (
                        placements.map((p) => (
                            <SortableCard
                                key={p.id}
                                placement={p}
                                isSelected={selectedId === p.id}
                                onClick={() => onSelect(selectedId === p.id ? null : p)}
                                onStatusChange={onStatusChange}
                                updating={updatingId === p.id}
                            />
                        ))
                    )}
                </SortableContext>
            </div>
        </div>
    )
}

function DetailPanel({
    selected, updatingAction, generating, onStatusChange, onGenerateContract, onDelete, onClose,
}: {
    selected: PlacementRow
    updatingAction: Placement["status"] | null
    generating: boolean
    onStatusChange: (id: string, status: Placement["status"]) => void
    onGenerateContract: () => void
    onDelete: () => void
    onClose: () => void
}) {
    const transitions = STATUS_TRANSITIONS[selected.status] ?? []

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-white/[0.07] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                        "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shrink-0",
                        getGradient(selected.talentName)
                    )}>
                        {selected.talentName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{selected.talentName}</p>
                        <p className="text-xs text-zinc-400 truncate">{selected.role}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all shrink-0"
                >
                    <X size={13} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full">

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: "Rate", value: formatRate(selected.hourlyRate), bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                        { label: "Hours/wk", value: selected.hoursPerWeek ? `${selected.hoursPerWeek}h` : null, bg: "bg-blue-50 dark:bg-blue-500/10" },
                        { label: "Weekly", value: weeklyEarnings(selected.hourlyRate, selected.hoursPerWeek), bg: "bg-amber-50 dark:bg-amber-500/10" },
                        { label: "Client", value: selected.clientName, bg: "bg-violet-50 dark:bg-violet-500/10" },
                    ].filter(r => r.value).map(({ label, value, bg }) => (
                        <div key={label} className={cn("rounded-xl p-3", bg)}>
                            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">{label}</p>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Details */}
                <div>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.12em] mb-2">Details</p>
                    <div className="bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-xl overflow-hidden">
                        {[
                            { icon: FolderKanban, label: "Project", value: selected.projectTitle },
                            { icon: Calendar, label: "Start", value: formatDate(selected.startDate) },
                            { icon: Calendar, label: "End", value: selected.endDate ? formatDate(selected.endDate) : "Ongoing" },
                        ].filter(r => r.value).map(({ icon: Icon, label, value }, i, arr) => (
                            <div key={i} className={cn(
                                "flex items-center gap-3 px-3.5 py-2.5",
                                i < arr.length - 1 && "border-b border-zinc-100 dark:border-white/5"
                            )}>
                                <Icon size={11} className="text-zinc-400 shrink-0" />
                                <span className="text-[11px] text-zinc-400 w-14 shrink-0">{label}</span>
                                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 truncate">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inquiry Timeline */}
                {(selected as any).inquiryStatus && (
                    <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.12em] mb-3">Inquiry Status</p>
                        <div className="bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-xl p-4">
                            <InquiryTimeline status={(selected as any).inquiryStatus} />
                        </div>
                    </div>
                )}

                {/* Contract */}
                <div>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.12em] mb-2">Contract</p>
                    {selected.contractStatus ? (
                        <div className="bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                                    <FileText size={10} /> {selected.contractStatus}
                                </span>
                                {selected.contractUrl && (
                                    <a href={selected.contractUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 transition-colors">
                                        <ExternalLink size={10} /> View
                                    </a>
                                )}
                            </div>
                            {selected.contractSignedAt && (
                                <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                    <CheckCircle size={10} /> Signed {formatDate(selected.contractSignedAt)}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="border border-dashed border-zinc-200 dark:border-white/10 rounded-xl p-3.5 text-xs text-zinc-400 flex items-center gap-2">
                            <FileText size={11} /> No contract yet
                        </div>
                    )}
                </div>

                {/* Notes */}
                {selected.notes && (
                    <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.12em] mb-2">Notes</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed bg-amber-50/70 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-xl p-3.5">
                            {selected.notes}
                        </p>
                    </div>
                )}

                {/* Move to */}
                {transitions.length > 0 && (
                    <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.12em] mb-2">Move to</p>
                        <div className="flex flex-col gap-1.5">
                            {transitions.map((t) => {
                                const isLoading = updatingAction === t.next
                                return (
                                    <button
                                        key={t.next}
                                        disabled={updatingAction !== null}
                                        onClick={() => onStatusChange(selected.id, t.next)}
                                        className={cn(
                                            "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all",
                                            updatingAction && !isLoading ? "opacity-40" : "",
                                            "bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isLoading
                                                ? <div className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                                                : <t.icon size={12} className="text-zinc-400" />
                                            }
                                            {t.label}
                                        </div>
                                        <ArrowRight size={11} className="text-zinc-400" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-zinc-100 dark:border-white/[0.07] space-y-2 shrink-0">
                <button
                    onClick={onGenerateContract}
                    disabled={generating}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] disabled:opacity-50 text-zinc-950 font-bold text-xs transition-all"
                >
                    {generating
                        ? <div className="w-3.5 h-3.5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                        : <Download size={12} />
                    }
                    {generating ? "Generating..." : "Generate Contract PDF"}
                </button>
                <button
                    onClick={onDelete}
                    className="w-full flex items-center justify-center gap-2 h-9 rounded-xl text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 font-medium text-xs transition-all"
                >
                    <Trash2 size={12} /> Delete Placement
                </button>
            </div>
        </div>
    )
}

// ─── Page skeleton ────────────────────────────────────────────────────────────

function PageSkeleton() {
    return (
        <div className="flex flex-col gap-5 p-6 md:p-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-40 rounded-xl" />
                <Skeleton className="h-9 w-36 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 flex-1 rounded-xl" />)}
            </div>
            <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="min-w-[272px] space-y-3">
                        <Skeleton className="h-11 rounded-xl" />
                        {Array.from({ length: 3 }).map((_, j) => <Skeleton key={j} className="h-32 rounded-xl" />)}
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DashboardPlacements() {
    const [placements, setPlacements] = useState<PlacementRow[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState<PlacementRow | null>(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [createModal, setCreateModal] = useState(false)
    const [updatingAction, setUpdatingAction] = useState<Placement["status"] | null>(null)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [generating, setGenerating] = useState(false)

    // DnD state
    const [activeDragId, setActiveDragId] = useState<string | null>(null)
    const [overColumnId, setOverColumnId] = useState<Placement["status"] | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    )

    useEffect(() => {
        portalFetch.get<PlacementRow[]>("/admin/placements")
            .then(setPlacements)
            .catch(() => toast.error("Failed to load placements"))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null) }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [])

    const filtered = useMemo(() => {
        if (!search) return placements
        const q = search.toLowerCase()
        return placements.filter(p =>
            p.talentName.toLowerCase().includes(q) ||
            p.clientName.toLowerCase().includes(q) ||
            p.role.toLowerCase().includes(q) ||
            (p.projectTitle ?? "").toLowerCase().includes(q)
        )
    }, [placements, search])

    const byStatus = useMemo(() => {
        const map: Record<string, PlacementRow[]> = {}
        for (const col of COLUMNS) map[col.key] = []
        for (const p of filtered) {
            if (map[p.status]) map[p.status].push(p)
        }
        return map
    }, [filtered])

    const totals = useMemo(() => ({
        active: placements.filter(p => p.status === "active").length,
        on_hold: placements.filter(p => p.status === "on_hold").length,
        completed: placements.filter(p => p.status === "completed").length,
        cancelled: placements.filter(p => p.status === "cancelled").length,
        total: placements.length,
        totalRevenue: placements
            .filter(p => p.status === "active" && p.hourlyRate && p.hoursPerWeek)
            .reduce((sum, p) => sum + parseFloat(p.hourlyRate!) * p.hoursPerWeek!, 0),
    }), [placements])

    const activeDragPlacement = useMemo(
        () => placements.find(p => p.id === activeDragId) ?? null,
        [placements, activeDragId]
    )

    // ── DnD ──────────────────────────────────────────────────────────────────

    function handleDragStart({ active }: DragStartEvent) {
        setActiveDragId(active.id as string)
    }

    function handleDragOver({ over }: DragOverEvent) {
        if (!over) { setOverColumnId(null); return }
        const colKey = COLUMNS.find(c => c.key === over.id)?.key
        if (colKey) { setOverColumnId(colKey); return }
        const cardCol = placements.find(p => p.id === over.id)?.status
        setOverColumnId(cardCol ?? null)
    }

    function handleDragEnd({ active, over }: DragEndEvent) {
        setActiveDragId(null)
        setOverColumnId(null)
        if (!over) return

        const dragged = placements.find(p => p.id === active.id)
        if (!dragged) return

        const overColKey = COLUMNS.find(c => c.key === over.id)?.key
        const overCardColKey = placements.find(p => p.id === over.id)?.status
        const targetStatus = (overColKey ?? overCardColKey) as Placement["status"] | undefined

        if (!targetStatus || targetStatus === dragged.status) return

        // Optimistic update
        setPlacements(prev => prev.map(p => p.id === dragged.id ? { ...p, status: targetStatus } : p))
        setSelected(prev => prev?.id === dragged.id ? { ...prev, status: targetStatus } : prev)

        const col = COLUMNS.find(c => c.key === targetStatus)
        setUpdatingId(dragged.id)

        portalFetch.patch(`/admin/placements/${dragged.id}`, { status: targetStatus })
            .then(() => toast.success(`${dragged.talentName} → ${col?.label}`))
            .catch((err: any) => {
                // Roll back
                setPlacements(prev => prev.map(p => p.id === dragged.id ? { ...p, status: dragged.status } : p))
                setSelected(prev => prev?.id === dragged.id ? { ...prev, status: dragged.status } : prev)
                toast.error(err.message ?? "Failed to move placement")
            })
            .finally(() => setUpdatingId(null))
    }

    // ── Mutations ─────────────────────────────────────────────────────────────

    const patchPlacement = async (id: string, payload: Partial<Placement>) => {
        const updated = await portalFetch.patch<PlacementRow>(`/admin/placements/${id}`, payload)
        setPlacements(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p))
        setSelected(prev => prev?.id === id ? { ...prev, ...updated } : prev)
        return updated
    }

    const handleStatusChange = async (id: string, status: Placement["status"]) => {
        setUpdatingId(id)
        setUpdatingAction(status)
        try {
            await patchPlacement(id, { status })
            const col = COLUMNS.find(c => c.key === status)
            toast.success(`Moved to ${col?.label ?? status}`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update")
        } finally {
            setUpdatingId(null)
            setUpdatingAction(null)
        }
    }

    const handleDelete = async () => {
        if (!selected) return
        setDeleting(true)
        try {
            await portalFetch.delete(`/admin/placements/${selected.id}`)
            setPlacements(prev => prev.filter(p => p.id !== selected.id))
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
            setPlacements(prev => prev.map(p => p.id === selected.id ? { ...p, ...patch } : p))
            setSelected(prev => prev ? { ...prev, ...patch } : prev)
            toast.success("Contract generated!")
        } catch (err: any) {
            toast.error(err.message ?? "Failed to generate contract")
        } finally {
            setGenerating(false)
        }
    }

    if (loading) return <PageSkeleton />

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">

                {/* ── Top bar ── */}
                <div className="shrink-0 px-4 md:px-8 pt-5 md:pt-7 pb-4 md:pb-5 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-white/[0.07]">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Placements</h1>
                            <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md font-medium tabular-nums">
                                {totals.total}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                            <div className="relative flex-1 md:flex-none">
                                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8 pr-8 h-8 w-full md:w-48 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all"
                                />
                                {search && (
                                    <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                                        <X size={11} />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => setCreateModal(true)}
                                className="flex items-center gap-1.5 px-3 md:px-3.5 h-8 rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-[0.97] text-zinc-950 font-bold text-xs transition-all shadow-sm shadow-amber-200 dark:shadow-amber-500/20 shrink-0 whitespace-nowrap"
                            >
                                <Plus size={12} />
                                <span className="hidden sm:inline">New Placement</span>
                                <span className="sm:hidden">New</span>
                            </button>
                        </div>
                    </div>

                    {/* Stat strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:items-stretch gap-2 md:gap-3 md:overflow-x-auto md:pb-0.5 [&::-webkit-scrollbar]:hidden">
                        <div className="col-span-2 sm:col-span-1 flex items-center gap-3 px-4 py-3 bg-amber-400 rounded-xl md:shrink-0 md:min-w-[170px]">
                            <div className="w-7 h-7 rounded-lg bg-amber-300/50 flex items-center justify-center shrink-0">
                                <Zap size={13} className="text-zinc-900" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider">Weekly Revenue</p>
                                <p className="text-sm font-bold text-zinc-900 tabular-nums truncate">
                                    ${totals.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                                </p>
                            </div>
                        </div>
                        {COLUMNS.map(col => (
                            <div key={col.key} className="flex items-center gap-2.5 px-3 md:px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/[0.07] rounded-xl md:shrink-0">
                                <span className={cn("w-2 h-2 rounded-full shrink-0", col.dot)} />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider truncate">{col.label}</p>
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white tabular-nums">
                                        {totals[col.key as keyof typeof totals] as number}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div className="hidden md:flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/[0.07] rounded-xl shrink-0 md:ml-auto">
                            <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                <Users size={12} className="text-zinc-500 dark:text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Total</p>
                                <p className="text-sm font-bold text-zinc-900 dark:text-white tabular-nums">{totals.total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Board ── */}
                <div className="flex flex-1 overflow-hidden">
                    <div className={cn(
                        "flex-1 overflow-x-auto overflow-y-auto",
                        "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1",
                        "[&::-webkit-scrollbar-track]:bg-transparent",
                        "[&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10",
                        "[&::-webkit-scrollbar-thumb]:rounded-full"
                    )}>
                        <div className="flex gap-4 p-4 md:p-6 min-h-full w-max">
                            {COLUMNS.map(col => (
                                <KanbanColumn
                                    key={col.key}
                                    column={col}
                                    placements={byStatus[col.key] ?? []}
                                    selectedId={selected?.id ?? null}
                                    onSelect={setSelected}
                                    onStatusChange={handleStatusChange}
                                    updatingId={updatingId}
                                    onAdd={() => setCreateModal(true)}
                                    isOver={overColumnId === col.key}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Detail panel — desktop */}
                    {selected && (
                        <div className="hidden lg:flex w-[320px] shrink-0 flex-col border-l border-zinc-100 dark:border-white/[0.07] overflow-hidden">
                            <DetailPanel
                                selected={selected}
                                updatingAction={updatingAction}
                                generating={generating}
                                onStatusChange={handleStatusChange}
                                onGenerateContract={handleGenerateContract}
                                onDelete={() => setDeleteModal(true)}
                                onClose={() => setSelected(null)}
                            />
                        </div>
                    )}
                </div>

                {/* Mobile bottom sheet */}
                {selected && (
                    <>
                        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSelected(null)} />
                        <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden flex flex-col bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl" style={{ maxHeight: "88dvh" }}>
                            <div className="flex justify-center pt-3 pb-1 shrink-0">
                                <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                            </div>
                            <DetailPanel
                                selected={selected}
                                updatingAction={updatingAction}
                                generating={generating}
                                onStatusChange={handleStatusChange}
                                onGenerateContract={handleGenerateContract}
                                onDelete={() => setDeleteModal(true)}
                                onClose={() => setSelected(null)}
                            />
                        </div>
                    </>
                )}

                {/* Create Modal */}
                {createModal && (
                    <CreatePlacementModal
                        onClose={() => setCreateModal(false)}
                        onCreated={(p) => {
                            setPlacements(prev => [p, ...prev])
                            setCreateModal(false)
                        }}
                    />
                )}

                {/* Delete Modal */}
                {deleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-zinc-100 dark:border-white/10">
                            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                                <Trash2 size={16} className="text-red-500" />
                            </div>
                            <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-1.5">Delete Placement</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
                                Remove <strong className="text-zinc-900 dark:text-white">{selected?.talentName}</strong>'s
                                placement at <strong className="text-zinc-900 dark:text-white">{selected?.clientName}</strong>?
                                This can't be undone.
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
            </div>

            <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
                {activeDragPlacement ? (
                    <PlacementCardBase
                        placement={activeDragPlacement}
                        isSelected={false}
                        isOverlay
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}