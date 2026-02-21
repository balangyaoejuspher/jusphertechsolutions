"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BriefcaseBusiness,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"

type Admin = {
  id: string
  name: string
  email: string
  role: "super_admin" | "admin" | "editor"
}

const roleStyles = {
  super_admin: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  admin: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  editor: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20",
}

const roleLabels = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
}

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Talent", href: "/dashboard/talent", icon: Users },
  { label: "Inquiries", href: "/dashboard/inquiries", icon: FileText },
  { label: "Services", href: "/dashboard/services", icon: BriefcaseBusiness },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

function SignOutButton() {
  const { signOut } = useClerk()
  return (
    <button
      onClick={() => signOut({ redirectUrl: "/" })}
      className="flex items-center gap-3 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150 w-full"
    >
      <LogOut size={16} className="text-zinc-600" />
      Sign Out
    </button>
  )
}

function SidebarContent({ admin, onClose }: { admin: Admin; onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 h-16 flex items-center justify-between border-b border-white/5 shrink-0">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-zinc-950 text-sm font-black">PA</span>
          </div>
          <span className="font-bold text-white tracking-tight text-sm">
            {siteConfig.name}
          </span>
        </Link>
        {/* Close button - mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
        <p className="text-zinc-600 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-amber-400 text-zinc-950"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={17}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-zinc-950"
                      : "text-zinc-600 group-hover:text-white"
                  )}
                />
                {item.label}
              </div>
              {isActive && (
                <ChevronRight size={14} className="text-zinc-950/50" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-white/5 flex flex-col gap-3 shrink-0">
        <div className="px-2 py-3 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-zinc-950 font-bold text-sm shrink-0">
              {admin.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{admin.name}</p>
              <p className="text-zinc-500 text-xs truncate">{admin.email}</p>
            </div>
          </div>
          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${roleStyles[admin.role]}`}>
            {roleLabels[admin.role]}
          </span>
        </div>
        <SignOutButton />
      </div>
    </div>
  )
}

export function DashboardSidebar({ admin }: { admin: Admin }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-zinc-950 border-b border-white/5 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-zinc-950 text-xs font-black">PA</span>
          </div>
          <span className="font-bold text-white text-sm tracking-tight">
            {siteConfig.name}
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="lg:hidden h-14" />

      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-zinc-950 border-r border-white/5 sticky top-0">
        <SidebarContent admin={admin} />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={cn(
            "absolute top-0 left-0 h-full w-72 bg-zinc-950 border-r border-white/5 shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent admin={admin} onClose={() => setMobileOpen(false)} />
        </div>
      </div>
    </>
  )
}