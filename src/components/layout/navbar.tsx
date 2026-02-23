"use client"

import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { mainNav, servicesMenu, productsMenu } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs"
import Image from "next/image"
import {
    Blocks,
    CalendarDays,
    ChevronDown,
    ChevronRight,
    LogIn,
    Menu,
    X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// ============================================================
// DESKTOP MEGA MENU
// ============================================================

function MegaMenu({
    items,
    isOpen,
    onMouseEnter,
    onMouseLeave,
}: {
    items: typeof servicesMenu
    isOpen: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
}) {
    return (
        <div
            className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/40 overflow-hidden transition-all duration-200 z-50",
                isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div className="p-5 grid grid-cols-2 gap-6">
                {items.map((group) => (
                    <div key={group.category}>
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 px-2">
                            {group.category}
                        </p>
                        <div className="flex flex-col gap-0.5">
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl group hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-150"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-amber-50 dark:group-hover:bg-amber-400/10 transition-colors">
                                        <item.icon size={15} className="text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white leading-tight">
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600 leading-tight mt-0.5">
                                            {item.desc}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="px-5 py-3 bg-zinc-50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
                <p className="text-xs text-zinc-400 dark:text-zinc-600">Can't find what you need?</p>
                <Link href="/contact" className="text-xs font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-600 transition-colors flex items-center gap-1">
                    Contact us <ChevronRight size={12} />
                </Link>
            </div>
        </div>
    )
}

// ============================================================
// PRODUCTS MEGA MENU
// ============================================================

function ProductsMegaMenu({
    isOpen,
    onMouseEnter,
    onMouseLeave,
}: {
    isOpen: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
}) {
    return (
        <div
            className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[560px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/40 overflow-hidden transition-all duration-200 z-50",
                isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div className="p-5 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 px-2">
                        Software Products
                    </p>
                    <div className="flex flex-col gap-0.5">
                        {productsMenu[0].items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl group hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-150"
                            >
                                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-amber-50 dark:group-hover:bg-amber-400/10 transition-colors">
                                    <item.icon size={15} className="text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white leading-tight">
                                        {item.label}
                                    </p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-600 leading-tight mt-0.5">
                                        {item.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1 px-2">
                        Featured
                    </p>
                    <Link
                        href="/services/blockchain"
                        className="group relative p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 border border-white/10 hover:border-amber-400/30 transition-all overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center mb-3">
                            <Blocks size={17} className="text-amber-400" />
                        </div>
                        <p className="text-sm font-bold text-white mb-1">Blockchain & Web3</p>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Certified Web3 developer. Smart contracts, DeFi, NFT platforms & more.
                        </p>
                        <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs font-semibold">
                            Learn more <ChevronRight size={12} />
                        </div>
                    </Link>
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:border-amber-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all"
                    >
                        View all products <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
            <div className="px-5 py-3 bg-zinc-50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
                <p className="text-xs text-zinc-400 dark:text-zinc-600">Need a custom solution?</p>
                <Link href="/contact" className="text-xs font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-600 transition-colors flex items-center gap-1">
                    Talk to us <ChevronRight size={12} />
                </Link>
            </div>
        </div>
    )
}

// ============================================================
// MOBILE ACCORDION
// ============================================================

function MobileAccordion({ label, items, onClose }: {
    label: string
    items: typeof servicesMenu
    onClose: () => void
}) {
    const [open, setOpen] = useState(false)
    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all"
            >
                {label}
                <ChevronDown size={15} className={cn("opacity-40 transition-transform duration-200", open && "rotate-180")} />
            </button>
            {open && (
                <div className="ml-3 mt-1 flex flex-col gap-0.5 pb-1">
                    {items.map((group) => (
                        <div key={group.category}>
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-4 py-2">
                                {group.category}
                            </p>
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all"
                                >
                                    <item.icon size={14} className="shrink-0 text-zinc-400" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ============================================================
// MAIN NAVBAR
// ============================================================

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const navRef = useRef<HTMLDivElement>(null)
    const closeTimer = useRef<NodeJS.Timeout | null>(null)

    const openMenu = (name: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current)
        setActiveMenu(name)
    }

    const closeMenu = () => {
        closeTimer.current = setTimeout(() => setActiveMenu(null), 100)
    }

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => { setIsOpen(false); setActiveMenu(null) }, [pathname])

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) setActiveMenu(null)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

    return (
        <>
            <header
                ref={navRef}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    scrolled
                        ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm shadow-zinc-100 dark:shadow-zinc-900 border-b border-zinc-200/80 dark:border-white/5"
                        : "bg-white/60 dark:bg-transparent backdrop-blur-sm"
                )}
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex h-16 items-center justify-between">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                            <div className="w-8 h-8 rounded-lg overflow-hidden transition-transform group-hover:scale-105 shrink-0">
                                <Image src="/icon.svg" alt={siteConfig.fullName} width={32} height={32} className="w-full h-full object-contain" />
                            </div>
                            <div className="hidden sm:flex flex-col leading-none">
                                <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">
                                    {siteConfig.name.toUpperCase()}
                                </span>
                                <span className="text-[10px] font-semibold text-zinc-400 dark:text-amber-400/70 tracking-widest uppercase mt-0.5">
                                    {siteConfig.slogan}
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-0.5">
                            <Link href="/" className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150", pathname === "/" ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5")}>
                                Home
                            </Link>

                            {/* Services mega */}
                            <div className="relative" onMouseEnter={() => openMenu("services")} onMouseLeave={closeMenu}>
                                <div className="flex items-center">
                                    <Link href="/services" className={cn("flex items-center px-4 py-2 text-sm font-medium rounded-l-lg transition-all duration-150", pathname.startsWith("/services") ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5")}>
                                        Services
                                    </Link>
                                    <button onClick={() => setActiveMenu(activeMenu === "services" ? null : "services")} className={cn("flex items-center px-1.5 py-2 text-sm font-medium rounded-r-lg transition-all duration-150", pathname.startsWith("/services") ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5")}>
                                        <ChevronDown size={13} className={cn("transition-transform duration-200", activeMenu === "services" && "rotate-180")} />
                                    </button>
                                </div>
                                <MegaMenu items={servicesMenu} isOpen={activeMenu === "services"} onMouseEnter={() => openMenu("services")} onMouseLeave={closeMenu} />
                            </div>

                            <Link href="/talent" className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150", pathname === "/talent" ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5")}>
                                Talent
                            </Link>

                            {/* Products mega */}
                            <div className="relative" onMouseEnter={() => openMenu("products")} onMouseLeave={closeMenu}>
                                <div className="flex items-center">
                                    <Link href="/products" className={cn("flex items-center px-4 py-2 text-sm font-medium rounded-l-lg transition-all duration-150", pathname.startsWith("/products") ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5")}>
                                        Products
                                    </Link>
                                    <button onClick={() => setActiveMenu(activeMenu === "products" ? null : "products")} className={cn("flex items-center px-1.5 py-2 text-sm font-medium rounded-r-lg transition-all duration-150", pathname.startsWith("/products") ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5")}>
                                        <ChevronDown size={13} className={cn("transition-transform duration-200", activeMenu === "products" && "rotate-180")} />
                                    </button>
                                </div>
                                <ProductsMegaMenu isOpen={activeMenu === "products"} onMouseEnter={() => openMenu("products")} onMouseLeave={closeMenu} />
                            </div>

                            {/* Blog, About, Contact */}
                            {mainNav.filter((item) => item.href !== "/talent").map((item) => (
                                <Link key={item.href} href={item.href} className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150", pathname === item.href ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5")}>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Right Actions */}
                        <div className="hidden lg:flex items-center gap-2 shrink-0">

                            <ThemeToggle />

                            {/* Divider */}
                            <div className="w-px h-5 bg-zinc-200 dark:bg-white/10 mx-1" />

                            {/* Book a Meeting */}
                            <Link href="/book-a-meeting?type=discovery">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl h-9 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-amber-400/60 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/5 gap-1.5 text-xs font-semibold transition-all"
                                >
                                    <CalendarDays size={13} />
                                    Book a Meeting
                                </Button>
                            </Link>

                            {/* Signed out — Log In */}
                            <SignedOut>
                                <Link href="/sign-in">
                                    <Button
                                        size="sm"
                                        className="rounded-xl h-9 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 gap-1.5 text-xs font-semibold"
                                    >
                                        <LogIn size={13} />
                                        Log In
                                    </Button>
                                </Link>
                            </SignedOut>

                            {/* Signed in — Dashboard + avatar */}
                            <SignedIn>
                                <Link href="/dashboard">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg text-xs"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div className={cn("fixed inset-0 z-40 lg:hidden transition-all duration-300", isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}>
                <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

                <div className={cn(
                    "absolute top-0 right-0 h-full w-80 bg-white dark:bg-zinc-950 shadow-2xl border-l border-zinc-100 dark:border-white/5 transition-transform duration-300 ease-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}>

                    {/* Drawer header */}
                    <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-100 dark:border-white/5 shrink-0">
                        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 group">
                            <div className="w-7 h-7 rounded-md overflow-hidden shrink-0">
                                <Image src="/icon.svg" alt={siteConfig.fullName} width={28} height={28} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">{siteConfig.name}</span>
                                <span className="text-[9px] font-semibold text-zinc-400 dark:text-amber-400/70 tracking-widest uppercase mt-0.5">{siteConfig.slogan}</span>
                            </div>
                        </Link>
                        <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Drawer nav */}
                    <nav className="flex flex-col px-3 py-4 gap-1 flex-1 overflow-y-auto">
                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-3 mb-2">Navigation</p>

                        <Link href="/" onClick={() => setIsOpen(false)} className={cn("flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all", pathname === "/" ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white")}>
                            Home <ChevronRight size={15} className="opacity-40" />
                        </Link>

                        <MobileAccordion label="Services" items={servicesMenu} onClose={() => setIsOpen(false)} />

                        <Link href="/talent" onClick={() => setIsOpen(false)} className={cn("flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all", pathname === "/talent" ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white")}>
                            Talent <ChevronRight size={15} className="opacity-40" />
                        </Link>

                        <MobileAccordion label="Products" items={productsMenu} onClose={() => setIsOpen(false)} />

                        {mainNav.filter((item) => item.href !== "/talent").map((item) => (
                            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={cn("flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all", pathname === item.href ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white")}>
                                {item.label} <ChevronRight size={15} className="opacity-40" />
                            </Link>
                        ))}
                    </nav>

                    {/* Drawer footer */}
                    <div className="px-4 py-5 border-t border-zinc-100 dark:border-white/5 flex flex-col gap-3 shrink-0">

                        {/* Book a meeting CTA — always visible */}
                        <Link href="/book-a-meeting?type=discovery" onClick={() => setIsOpen(false)}>
                            <Button className="w-full rounded-xl h-11 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2">
                                <CalendarDays size={15} />
                                Book a Discovery Call
                            </Button>
                        </Link>

                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Appearance</span>
                            <ThemeToggle />
                        </div>

                        {/* Auth */}
                        <SignedOut>
                            <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                                <Button variant="outline" className="w-full rounded-xl h-11 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 gap-2 font-semibold">
                                    <LogIn size={15} />
                                    Log In to Client Portal
                                </Button>
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                <Button variant="outline" className="w-full rounded-xl border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                                    Dashboard
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3 px-1">
                                <UserButton afterSignOutUrl="/" />
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">My Account</span>
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="h-16" />
        </>
    )
}