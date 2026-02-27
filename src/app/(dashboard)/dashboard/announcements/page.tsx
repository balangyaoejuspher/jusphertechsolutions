"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Megaphone, Search, Filter, Loader2, MoreHorizontal, Eye, Pencil, Archive, Trash2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Announcement } from "@/server/db/schema"

// ─── Badge configs ────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
    draft: { label: "Draft", class: "bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400" },
    scheduled: { label: "Scheduled", class: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    published: { label: "Published", class: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" },
    archived: { label: "Archived", class: "bg-zinc-100 dark:bg-white/5 text-zinc-400" },
}

const TYPE_BADGE: Record<string, { label: string; class: string }> = {
    general: { label: "General", class: "bg-zinc-100 dark:bg-white/5 text-zinc-500" },
    maintenance: { label: "Maintenance", class: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
    new_feature: { label: "New Feature", class: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    urgent: { label: "Urgent", class: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" },
    event: { label: "Event", class: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
}

const AUDIENCE_BADGE: Record<string, { label: string; class: string }> = {
    all: { label: "Everyone", class: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    clients: { label: "Clients", class: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    talents: { label: "Talents", class: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
}

function Badge({ config }: { config: { label: string; class: string } }) {
    return (
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold", config.class)}>
            {config.label}
        </span>
    )
}

function relativeTime(date: Date | string): string {
    const now = new Date()
    const then = new Date(date)
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000)
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return then.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ─── Row Actions Menu ─────────────────────────────────────────────────────────

function RowActions({
    announcement,
    onPublish,
    onArchive,
    onDelete,
}: {
    announcement: Announcement
    onPublish: (id: string) => void
    onArchive: (id: string) => void
    onDelete: (id: string) => void
}) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
                <MoreHorizontal size={16} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-9 z-20 w-44 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
                        <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/announcements/${announcement.id}/edit`); setOpen(false) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            <Pencil size={14} /> Edit
                        </button>

                        {(announcement.status === "draft" || announcement.status === "scheduled") && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onPublish(announcement.id); setOpen(false) }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
                            >
                                <Send size={14} /> Publish Now
                            </button>
                        )}

                        {announcement.status !== "archived" && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onArchive(announcement.id); setOpen(false) }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                            >
                                <Archive size={14} /> Archive
                            </button>
                        )}

                        <div className="border-t border-zinc-100 dark:border-white/5" />

                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(announcement.id); setOpen(false) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ["all", "draft", "scheduled", "published", "archived"] as const
type StatusFilter = typeof STATUS_FILTERS[number]

export default function AnnouncementsPage() {
    const router = useRouter()
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

    async function fetchAnnouncements() {
        try {
            const res = await fetch("/api/v1/admin/announcements", { credentials: "include" })
            const json = await res.json()
            setAnnouncements(json?.data ?? json)
        } catch {
            toast.error("Failed to load announcements")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAnnouncements() }, [])

    async function handlePublish(id: string) {
        try {
            const res = await fetch(`/api/v1/admin/announcements/${id}/publish`, {
                method: "PATCH",
                credentials: "include",
            })
            if (!res.ok) throw new Error()
            toast.success("Announcement published")
            fetchAnnouncements()
        } catch {
            toast.error("Failed to publish announcement")
        }
    }

    async function handleArchive(id: string) {
        try {
            const res = await fetch(`/api/v1/admin/announcements/${id}/archive`, {
                method: "PATCH",
                credentials: "include",
            })
            if (!res.ok) throw new Error()
            toast.success("Announcement archived")
            fetchAnnouncements()
        } catch {
            toast.error("Failed to archive announcement")
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this announcement?")) return
        try {
            const res = await fetch(`/api/v1/admin/announcements/${id}`, {
                method: "DELETE",
                credentials: "include",
            })
            if (!res.ok) throw new Error()
            toast.success("Announcement deleted")
            setAnnouncements((prev) => prev.filter((a) => a.id !== id))
        } catch {
            toast.error("Failed to delete announcement")
        }
    }

    const filtered = announcements.filter((a) => {
        const matchesSearch =
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.content.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "all" || a.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const counts = {
        all: announcements.length,
        draft: announcements.filter((a) => a.status === "draft").length,
        scheduled: announcements.filter((a) => a.status === "scheduled").length,
        published: announcements.filter((a) => a.status === "published").length,
        archived: announcements.filter((a) => a.status === "archived").length,
    }

    return (
        <div className="p-5 md:p-8 lg:p-10 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                        Announcements
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Broadcast updates to your clients and talents.
                    </p>
                </div>
                <Button
                    onClick={() => router.push("/dashboard/announcements/new")}
                    className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shrink-0"
                >
                    <Plus size={16} className="mr-1.5" />
                    New
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                {/* Search */}
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <Input
                        placeholder="Search announcements..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10"
                    />
                </div>

                {/* Status filter tabs */}
                <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-white/5 rounded-xl shrink-0 overflow-x-auto">
                    {STATUS_FILTERS.map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize whitespace-nowrap",
                                statusFilter === status
                                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
                            )}
                        >
                            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                            <span className="ml-1.5 text-[10px] opacity-60">{counts[status]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex flex-col divide-y divide-zinc-100 dark:divide-white/5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                                <div className="flex-1">
                                    <div className="h-4 w-2/3 bg-zinc-100 dark:bg-white/5 rounded-lg mb-2" />
                                    <div className="h-3 w-1/3 bg-zinc-100 dark:bg-white/5 rounded-lg" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-5 w-16 bg-zinc-100 dark:bg-white/5 rounded-lg" />
                                    <div className="h-5 w-16 bg-zinc-100 dark:bg-white/5 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                            <Megaphone size={22} className="text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                            {search || statusFilter !== "all" ? "No results found" : "No announcements yet"}
                        </p>
                        <p className="text-xs text-zinc-400 text-center max-w-xs">
                            {search || statusFilter !== "all"
                                ? "Try adjusting your search or filter."
                                : "Create your first announcement to broadcast to clients and talents."}
                        </p>
                        {!search && statusFilter === "all" && (
                            <Button
                                size="sm"
                                onClick={() => router.push("/dashboard/announcements/new")}
                                className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold mt-1"
                            >
                                <Plus size={14} className="mr-1.5" />
                                Create Announcement
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Table header */}
                        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center px-5 py-3 border-b border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02]">
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Announcement</p>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Type</p>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Audience</p>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Status</p>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Date</p>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest w-8" />
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-zinc-100 dark:divide-white/5">
                            {filtered.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    onClick={() => router.push(`/dashboard/announcements/${announcement.id}/edit`)}
                                    className="group grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 md:gap-4 items-center px-5 py-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
                                >
                                    {/* Title + preview */}
                                    <div className="min-w-0">
                                        <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate mb-0.5">
                                            {announcement.title}
                                        </p>
                                        <p className="text-xs text-zinc-400 truncate">
                                            by {(announcement as any).createdByName ?? "Admin"}
                                        </p>
                                    </div>

                                    {/* Badges row on mobile */}
                                    <div className="flex flex-wrap gap-1.5 md:contents">
                                        <Badge config={TYPE_BADGE[announcement.type] ?? TYPE_BADGE.general} />
                                        <Badge config={AUDIENCE_BADGE[announcement.audience] ?? AUDIENCE_BADGE.all} />
                                        <Badge config={STATUS_BADGE[announcement.status] ?? STATUS_BADGE.draft} />

                                        {/* Date */}
                                        <span className="text-xs text-zinc-400 md:whitespace-nowrap">
                                            {announcement.status === "scheduled" && announcement.scheduledAt
                                                ? `Scheduled ${relativeTime(announcement.scheduledAt)}`
                                                : announcement.status === "published" && announcement.publishedAt
                                                    ? `Published ${relativeTime(announcement.publishedAt)}`
                                                    : `Created ${relativeTime(announcement.createdAt)}`}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <RowActions
                                            announcement={announcement}
                                            onPublish={handlePublish}
                                            onArchive={handleArchive}
                                            onDelete={handleDelete}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Count */}
            {!loading && filtered.length > 0 && (
                <p className="text-xs text-zinc-400 mt-3 text-right">
                    Showing {filtered.length} of {announcements.length} announcements
                </p>
            )}
        </div>
    )
}