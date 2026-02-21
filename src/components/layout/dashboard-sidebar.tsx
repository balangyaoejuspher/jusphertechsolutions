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
} from "lucide-react"

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Talent",
    href: "/dashboard/talent",
    icon: Users,
  },
  {
    label: "Inquiries",
    href: "/dashboard/inquiries",
    icon: FileText,
  },
  {
    label: "Services",
    href: "/dashboard/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
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

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-white/5 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="px-6 h-16 flex items-center border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-zinc-950 text-sm font-black">PA</span>
          </div>
          <span className="font-bold text-white tracking-tight text-sm">
            {siteConfig.name}
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        <p className="text-zinc-600 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
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
                    isActive ? "text-zinc-950" : "text-zinc-600 group-hover:text-white"
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
      <div className="px-4 py-5 border-t border-white/5 flex flex-col gap-2">
        {/* Sign Out Button */}
        <SignOutButton />
      </div>
    </aside>

  )
}