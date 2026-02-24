"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { TICKET_FILTERS, TICKET_STATUS_CONFIG, TICKET_PRIORITY_CONFIG, TICKET_CATEGORY_COLORS } from "@/lib/helpers/constants"
import { cn } from "@/lib/utils"

import {
    ChevronRight,
    Clock,
    LifeBuoy,
    MessageSquare,
    Paperclip,
    Plus,
    Tag,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function SupportPageSkeleton() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <Skeleton className="h-3 w-24 mb-3" />
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl px-5 py-4">
                        <Skeleton className="h-7 w-8 mb-2" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mb-6">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-xl" />)}
            </div>
            <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                                <div className="flex gap-2 mb-2">
                                    <Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-20 rounded-lg" /><Skeleton className="h-4 w-16 rounded-lg" />
                                </div>
                                <Skeleton className="h-5 w-64 mb-1" />
                                <Skeleton className="h-3 w-full" />
                            </div>
                            <Skeleton className="h-8 w-16 rounded-xl shrink-0" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Mock data ─────────────────────────────────────────────────
const mockTickets = [
    {
        id: "TKT-001",
        subject: "Payment gateway not processing correctly",
        category: "Bug Report",
        priority: "urgent",
        status: "open",
        lastMessage: "The Stripe webhook is returning a 400 error on production. Can you check the endpoint configuration?",
        createdAt: "Feb 20, 2026",
        updatedAt: "2 hours ago",
        replies: 3,
        hasAttachment: true,
    },
    {
        id: "TKT-002",
        subject: "Add CSV export to the orders table",
        category: "Feature Request",
        priority: "medium",
        status: "in_progress",
        lastMessage: "We've scoped this out — it will be included in the next sprint starting March 1.",
        createdAt: "Feb 18, 2026",
        updatedAt: "Yesterday",
        replies: 5,
        hasAttachment: false,
    },
    {
        id: "TKT-003",
        subject: "Question about Invoice #INV-0041",
        category: "Billing / Invoice",
        priority: "low",
        status: "resolved",
        lastMessage: "The invoice has been updated and resent to your email. Let us know if you need anything else.",
        createdAt: "Feb 15, 2026",
        updatedAt: "Feb 16, 2026",
        replies: 4,
        hasAttachment: false,
    },
    {
        id: "TKT-004",
        subject: "How do I add a new product category?",
        category: "Project Question",
        priority: "low",
        status: "resolved",
        lastMessage: "You can add categories from the admin panel under Products > Categories. Happy to jump on a call if needed.",
        createdAt: "Feb 10, 2026",
        updatedAt: "Feb 11, 2026",
        replies: 2,
        hasAttachment: false,
    },
    {
        id: "TKT-005",
        subject: "Mobile app crashing on Android 13",
        category: "Bug Report",
        priority: "high",
        status: "open",
        lastMessage: "Submitted crash logs from three different devices. The issue seems related to the offline sync feature.",
        createdAt: "Feb 22, 2026",
        updatedAt: "1 hour ago",
        replies: 1,
        hasAttachment: true,
    },
]

const FILTER_STATUS_MAP: Record<string, string | null> = {
    "All": null,
    "Open": "open",
    "In Progress": "in_progress",
    "Resolved": "resolved",
}

export function SupportList() {
    const [activeFilter, setActiveFilter] = useState("All")

    const total = mockTickets.length
    const open = mockTickets.filter((t) => t.status === "open").length
    const inProgress = mockTickets.filter((t) => t.status === "in_progress").length
    const resolved = mockTickets.filter((t) => t.status === "resolved").length

    const filteredTickets = activeFilter === "All"
        ? mockTickets
        : mockTickets.filter((t) => t.status === FILTER_STATUS_MAP[activeFilter])

    const FILTER_COUNTS: Record<string, number> = {
        "Open": open,
        "In Progress": inProgress,
        "Resolved": resolved,
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <LifeBuoy size={14} className="text-amber-500 dark:text-amber-400" />
                        <span className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">Client Portal</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">Support</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Track your tickets and communicate with our team.</p>
                </div>
                <Link
                    href="/portal/support/new"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-400/20 shrink-0"
                >
                    <Plus size={15} /> New Ticket
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Total", value: total },
                    { label: "Open", value: open },
                    { label: "In Progress", value: inProgress },
                    { label: "Resolved", value: resolved },
                ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl px-5 py-4">
                        <p className="text-2xl font-black text-zinc-900 dark:text-white">{s.value}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 font-medium mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                {TICKET_FILTERS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs font-semibold border transition-all",
                            activeFilter === filter
                                ? "bg-amber-400 border-amber-400 text-zinc-950"
                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400"
                        )}
                    >
                        {filter}
                        {filter !== "All" && (
                            <span className="ml-1.5 text-[10px]">({FILTER_COUNTS[filter]})</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Ticket list */}
            <div className="flex flex-col gap-3">
                {filteredTickets.map((ticket) => {
                    const status = TICKET_STATUS_CONFIG[ticket.status as keyof typeof TICKET_STATUS_CONFIG]
                    const priority = TICKET_PRIORITY_CONFIG[ticket.priority as keyof typeof TICKET_PRIORITY_CONFIG]
                    const StatusIcon = status.icon

                    return (
                        <Link
                            key={ticket.id}
                            href={`/portal/support/${ticket.id}`}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 hover:border-amber-400/30 dark:hover:border-amber-400/20 transition-all duration-200 group block"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1 min-w-0">
                                    {/* Badges row */}
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-600">{ticket.id}</span>
                                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-semibold", status.color)}>
                                            <StatusIcon size={10} />{status.label}
                                        </span>
                                        <span className={cn("inline-flex px-2 py-0.5 rounded-lg border text-[11px] font-semibold capitalize", priority.color)}>
                                            {priority.label}
                                        </span>
                                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-semibold", TICKET_CATEGORY_COLORS[ticket.category])}>
                                            <Tag size={9} />{ticket.category}
                                        </span>
                                    </div>

                                    {/* Subject */}
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-1">
                                        {ticket.subject}
                                    </h3>

                                    {/* Last message preview */}
                                    <p className="text-xs text-zinc-400 dark:text-zinc-600 line-clamp-1">{ticket.lastMessage}</p>
                                </div>

                                <ChevronRight size={15} className="text-zinc-300 dark:text-zinc-700 group-hover:text-amber-400 transition-colors shrink-0 mt-1" />
                            </div>

                            {/* Meta row */}
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
                                    <Clock size={10} /> Updated {ticket.updatedAt}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
                                    <MessageSquare size={10} /> {ticket.replies} {ticket.replies === 1 ? "reply" : "replies"}
                                </div>
                                {ticket.hasAttachment && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
                                        <Paperclip size={10} /> Attachment
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-600 ml-auto">
                                    <Calendar size={10} /> {ticket.createdAt}
                                </div>
                            </div>
                        </Link>
                    )
                })}

                {/* Empty state */}
                {filteredTickets.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 flex items-center justify-center mb-4">
                            <LifeBuoy size={22} className="text-zinc-400" />
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">No tickets found</h3>
                        <p className="text-sm text-zinc-400 dark:text-zinc-600 max-w-xs leading-relaxed mb-5">
                            {activeFilter === "All"
                                ? "Have an issue or question? Open a support ticket and our team will get back to you within 2 hours."
                                : `You have no ${activeFilter.toLowerCase()} tickets.`}
                        </p>
                        {activeFilter === "All" && (
                            <Link href="/portal/support/new" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all">
                                <Plus size={14} /> Open a Ticket
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function Calendar({ size, className }: { size: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    )
}