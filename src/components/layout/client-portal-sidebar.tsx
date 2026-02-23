"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    FolderKanban,
    Receipt,
    CalendarDays,
    LifeBuoy,
    Settings,
    ChevronRight,
    LogOut,
    Menu,
    X,
    ExternalLink,
    Bell,
} from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useState, useEffect } from "react"
import type { ClientRow } from "@/server/db/schema"

// ============================================================
// NAV CONFIG
// ============================================================

const navGroups = [
    {
        label: "My Portal",
        items: [
            { label: "Overview", href: "/portal", icon: LayoutDashboard },
            { label: "Projects", href: "/portal/projects", icon: FolderKanban },
            { label: "Invoices", href: "/portal/invoices", icon: Receipt },
        ],
    },
    {
        label: "Schedule",
        items: [
            { label: "Meetings", href: "/portal/meetings", icon: CalendarDays },
        ],
    },
    {
        label: "Support",
        items: [
            { label: "Help & Tickets", href: "/portal/support", icon: LifeBuoy },
            { label: "Settings", href: "/portal/settings", icon: Settings },
        ],
    },
]

// ============================================================
// STATUS BADGE
// ============================================================

const statusStyles = {
    active: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    prospect: "bg-amber-50  dark:bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-200  dark:border-amber-500/20",
    inactive: "bg-zinc-100  dark:bg-zinc-800      text-zinc-500   dark:text-zinc-400   border-zinc-200   dark:border-white/10",
}

const statusLabels = {
    active: "Active Client",
    prospect: "Prospect",
    inactive: "Inactive",
}

// ============================================================
// SIGN OUT
// ============================================================

function SignOutButton() {
    const { signOut } = useClerk()
    return (
        <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/5 transition-all duration-150 w-full"
        >
            <LogOut size={16} />
            Sign Out
        </button>
    )
}

// ============================================================
// SIDEBAR CONTENT
// ============================================================

function SidebarContent({
    client,
    onClose,
}: {
    client: ClientRow
    onClose?: () => void
}) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950">

            {/* Logo */}
            <div className="px-6 h-16 flex items-center justify-between border-b border-zinc-200 dark:border-white/5 shrink-0">
                <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg overflow-hidden transition-transform group-hover:scale-105 shrink-0">
                        <Image
                            src="/icon.svg"
                            alt={siteConfig.fullName}
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">
                            {siteConfig.name.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-amber-400/70 tracking-widest uppercase mt-0.5">
                            {siteConfig.slogan}
                        </span>
                    </div>
                </Link>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-5 flex flex-col gap-5 overflow-y-auto">
                {navGroups.map((group) => (
                    <div key={group.label}>
                        <p className="text-zinc-400 dark:text-zinc-600 text-xs font-semibold uppercase tracking-widest px-3 mb-2">
                            {group.label}
                        </p>
                        <div className="flex flex-col gap-0.5">
                            {group.items.map((item) => {
                                const isActive =
                                    item.href === "/portal"
                                        ? pathname === "/portal"
                                        : pathname.startsWith(item.href)

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                                            isActive
                                                ? "bg-amber-400 text-zinc-950"
                                                : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon
                                                size={16}
                                                className={cn(
                                                    "transition-colors",
                                                    isActive
                                                        ? "text-zinc-950"
                                                        : "text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-white"
                                                )}
                                            />
                                            {item.label}
                                        </div>
                                        {isActive && <ChevronRight size={14} className="text-zinc-950/50" />}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {/* Quick link back to main site */}
                <div className="mt-auto">
                    <div className="h-px bg-zinc-100 dark:bg-white/5 mb-4" />
                    <Link
                        href="/"
                        target="_blank"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all group"
                    >
                        <ExternalLink size={15} className="group-hover:scale-110 transition-transform" />
                        Visit Main Site
                    </Link>
                </div>
            </nav>

            {/* Footer — client card */}
            <div className="px-4 py-5 border-t border-zinc-200 dark:border-white/5 flex flex-col gap-2 shrink-0">

                {/* Client info card */}
                <div className="px-3 py-3 bg-zinc-50 dark:bg-white/5 rounded-xl mb-1">
                    <div className="flex items-center gap-2.5 mb-2.5">
                        {/* Avatar — initials */}
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-zinc-950 font-black text-sm shrink-0">
                            {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-zinc-900 dark:text-white text-xs font-semibold truncate">
                                {client.name}
                            </p>
                            <p className="text-zinc-400 dark:text-zinc-500 text-xs truncate">
                                {client.email}
                            </p>
                        </div>
                    </div>

                    {/* Type + status badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Type badge */}
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium border bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10 capitalize">
                            {client.type}
                        </span>
                        {/* Status badge */}
                        <span className={cn(
                            "inline-flex px-2 py-0.5 rounded-md text-xs font-medium border",
                            statusStyles[client.status as keyof typeof statusStyles] ?? statusStyles.inactive
                        )}>
                            {statusLabels[client.status as keyof typeof statusLabels] ?? client.status}
                        </span>
                    </div>
                </div>

                {/* Sign out + theme */}
                <div className="flex items-center justify-between px-1">
                    <SignOutButton />
                    <ThemeToggle />
                </div>
            </div>
        </div>
    )
}

// ============================================================
// MAIN EXPORT
// ============================================================

export function ClientPortalSidebar({ client }: { client: ClientRow }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => { setMobileOpen(false) }, [pathname])

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [mobileOpen])

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                        <Image src="/icon.svg" alt={siteConfig.fullName} width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">
                            {siteConfig.name}
                        </span>
                        <span className="text-[9px] font-semibold text-zinc-400 dark:text-amber-400/70 tracking-widest uppercase mt-0.5">
                            {siteConfig.slogan}
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    {/* Notification bell — placeholder */}
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors relative">
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
                    </button>
                    <ThemeToggle />
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            <div className="lg:hidden h-14" />

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/5 sticky top-0 h-screen">
                <SidebarContent client={client} />
            </aside>

            {/* Mobile Drawer */}
            <div className={cn(
                "fixed inset-0 z-50 lg:hidden transition-all duration-300",
                mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <div
                    className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
                <div className={cn(
                    "absolute top-0 left-0 h-full w-72 border-r border-zinc-200 dark:border-white/5 shadow-2xl transition-transform duration-300 ease-out",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <SidebarContent client={client} onClose={() => setMobileOpen(false)} />
                </div>
            </div>
        </>
    )
}