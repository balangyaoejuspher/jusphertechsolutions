"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, X, CheckCheck, Trash2, BellOff, ChevronRight, Dot } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/hooks/use-notifications"
import type { Notification } from "@/server/db/schema"
import { useRouter } from "next/navigation"

const ENTITY_ROUTES: Record<string, (id: string) => string> = {
    inquiry: (id) => `/dashboard/inquiries/${id}`,
    invoice: (id) => `/dashboard/invoices/${id}`,
    client: (id) => `/dashboard/clients/${id}`,
    talent: (id) => `/dashboard/talent/${id}`,
    placement: (id) => `/dashboard/placements/${id}`,
}

const TYPE_CONFIG: Record<string, { dot: string; bg: string }> = {
    inquiry: { dot: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    talent: { dot: "bg-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
    invoice: { dot: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    client: { dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    placement: { dot: "bg-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
    system: { dot: "bg-zinc-400", bg: "bg-zinc-100 dark:bg-white/5" },
}

function relativeTime(date: Date | string): string {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function NotificationItem({
    notification,
    onRead,
    onDelete,
    onNavigate,
}: {
    notification: Notification
    onRead: (id: string) => void
    onDelete: (id: string) => void
    onNavigate: (n: Notification) => void
}) {
    const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system
    const isClickable = !!notification.entityId && !!notification.entityType

    return (
        <div
            className={cn(
                "group relative flex gap-3 px-4 py-3 transition-colors rounded-xl mx-2",
                !notification.read
                    ? "bg-zinc-50 dark:bg-white/[0.03] border-l-2 border-amber-400 pl-3"
                    : "border-l-2 border-transparent pl-3",
                isClickable
                    ? "cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5"
                    : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]"
            )}
            onClick={() => {
                if (!notification.read) onRead(notification.id)
                if (isClickable) onNavigate(notification)
            }}
        >
            {/* Type icon bubble */}
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5", config.bg)}>
                <span className={cn("w-2 h-2 rounded-full", config.dot)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className={cn(
                        "text-xs leading-snug",
                        notification.read
                            ? "text-zinc-500 dark:text-zinc-400 font-normal"
                            : "text-zinc-900 dark:text-white font-semibold"
                    )}>
                        {notification.title}
                    </p>
                </div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed line-clamp-2">
                    {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-[10px] text-zinc-300 dark:text-zinc-600">
                        {relativeTime(notification.createdAt)}
                    </p>
                    {!notification.read && (
                        <span className="text-[10px] font-semibold text-amber-500 dark:text-amber-400">New</span>
                    )}
                    {isClickable && (
                        <span className="text-[10px] text-zinc-300 dark:text-zinc-600 flex items-center gap-0.5 ml-auto">
                            View <ChevronRight size={9} />
                        </span>
                    )}
                </div>
            </div>

            {/* Delete */}
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(notification.id) }}
                className="absolute top-3 right-3 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-all"
            >
                <X size={11} />
            </button>
        </div>
    )
}

export function NotificationBell() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    const {
        items,
        unreadCount,
        loading,
        connected,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearRead,
    } = useNotifications()

    const displayed = showAll ? items : items.filter((n) => !n.read)
    const hasRead = items.some((n) => n.read)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
        }
        if (open) document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [open])

    useEffect(() => {
        function handleKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false) }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [])

    function handleNavigate(notification: Notification) {
        if (!notification.entityId || !notification.entityType) return
        const route = ENTITY_ROUTES[notification.entityType]?.(notification.entityId)
        if (route) { router.push(route); setOpen(false) }
    }

    return (
        <div className="relative" ref={panelRef}>

            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "relative flex items-center justify-center w-9 h-9 rounded-xl transition-all",
                    open
                        ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                        : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                )}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
                <span className={cn(
                    "absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full",
                    connected ? "bg-emerald-400" : "bg-zinc-300"
                )} />
            </button>

            {/* Dropdown Panel */}
            <div className={cn(
                "absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-zinc-200/60 dark:shadow-black/60 flex flex-col overflow-hidden transition-all duration-200 origin-top-right z-50",
                "max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:w-auto max-sm:top-16",
                open
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            )}>

                {/* Top accent */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shrink-0" />

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <Bell size={14} className="text-zinc-400" />
                        <span className="font-bold text-zinc-900 dark:text-white text-sm">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="flex items-center justify-center h-4 px-1.5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                title="Mark all read"
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                            >
                                <CheckCheck size={14} />
                            </button>
                        )}
                        {hasRead && (
                            <button
                                onClick={clearRead}
                                title="Clear read"
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-1 mx-4 mb-2 p-0.5 bg-zinc-100 dark:bg-white/5 rounded-xl shrink-0">
                    <button
                        onClick={() => setShowAll(false)}
                        className={cn(
                            "flex-1 py-1 rounded-lg text-xs font-semibold transition-all",
                            !showAll
                                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
                        )}
                    >
                        Unread {unreadCount > 0 && `(${unreadCount})`}
                    </button>
                    <button
                        onClick={() => setShowAll(true)}
                        className={cn(
                            "flex-1 py-1 rounded-lg text-xs font-semibold transition-all",
                            showAll
                                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
                        )}
                    >
                        All {items.length > 0 && `(${items.length})`}
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto max-h-[420px] max-sm:max-h-[60vh] py-1
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-zinc-200
                    [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                    [&::-webkit-scrollbar-thumb]:rounded-full">
                    {loading ? (
                        <div className="flex flex-col gap-1 px-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 px-3 py-3 animate-pulse">
                                    <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-white/5 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-3/4 bg-zinc-100 dark:bg-white/5 rounded-lg" />
                                        <div className="h-2.5 w-full bg-zinc-100 dark:bg-white/5 rounded-lg" />
                                        <div className="h-2 w-1/4 bg-zinc-100 dark:bg-white/5 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : displayed.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2.5">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                                <BellOff size={18} className="text-zinc-300 dark:text-zinc-600" />
                            </div>
                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {showAll ? "No notifications" : "All caught up!"}
                            </p>
                            <p className="text-xs text-zinc-400 text-center max-w-44 leading-relaxed">
                                {showAll
                                    ? "You have no notifications yet."
                                    : "No unread notifications right now."}
                            </p>
                            {!showAll && items.length > 0 && (
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors mt-1"
                                >
                                    View all →
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-0.5 py-1">
                            {displayed.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onRead={markAsRead}
                                    onDelete={deleteNotification}
                                    onNavigate={handleNavigate}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-white/5 shrink-0">
                    <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1.5">
                        <span className={cn("w-1.5 h-1.5 rounded-full inline-block", connected ? "bg-emerald-400" : "bg-zinc-300")} />
                        {connected ? "Live updates active" : "Reconnecting..."}
                    </p>
                </div>
            </div>
        </div>
    )
}