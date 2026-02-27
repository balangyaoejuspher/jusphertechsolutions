"use client"

import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { mainNav } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import {
    Blocks,
    CalendarDays,
    ChevronDown,
    ChevronRight,
    Code2,
    LogIn,
    Menu,
    Package,
    X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import type { Service, Product } from "@/server/db/schema"
import { publicFetch } from "@/lib/api/public-fetcher"
import { SERVICE_ICONS } from "@/lib/helpers/service-icons"
import { PRODUCT_ICONS } from "@/lib/helpers/product-icons"

type Role = "admin" | "super_admin" | "client"

const ROLE_REDIRECT: Record<Role, string> = {
    admin: "/dashboard",
    super_admin: "/dashboard",
    client: "/portal",
}

const ROLE_LABEL: Record<string, string> = {
    "/dashboard": "ADMIN",
    "/portal": "MY PORTAL",
}

function DropdownShell({
    isOpen, onMouseEnter, onMouseLeave, width, footer, children,
}: {
    isOpen: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
    width: string
    footer?: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div
            className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl shadow-zinc-200/40 dark:shadow-black/50 overflow-hidden transition-all duration-200 z-50",
                width,
                isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div className="p-5">{children}</div>
            {footer && (
                <div className="px-5 py-3 bg-zinc-50/80 dark:bg-white/5 border-t border-zinc-100/80 dark:border-white/5 flex items-center justify-between">
                    {footer}
                </div>
            )}
        </div>
    )
}

function MobileAccordion({ label, children }: { label: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all"
            >
                {label}
                <ChevronDown size={13} className={cn("opacity-40 transition-transform duration-200", open && "rotate-180")} />
            </button>
            {open && (
                <div className="ml-2 mt-0.5 flex flex-col gap-0.5 pb-1 border-l-2 border-zinc-100 dark:border-white/5 pl-3">
                    {children}
                </div>
            )}
        </div>
    )
}

function MobileMenuGroup({ category, items }: {
    category: string
    items: { href: string; icon: React.ElementType; label: string }[]
}) {
    return (
        <div>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-2 py-1.5">
                {category}
            </p>
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                    <item.icon size={13} className="shrink-0 text-zinc-400" />
                    {item.label}
                </Link>
            ))}
        </div>
    )
}

function ServicesDropdown({ services, isOpen, onMouseEnter, onMouseLeave }: {
    services: Service[]
    isOpen: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
}) {
    const groups = [
        { category: "Development", items: services.filter((s) => s.category === "development") },
        { category: "Outsourcing", items: services.filter((s) => s.category === "outsourcing") },
    ]
    return (
        <DropdownShell isOpen={isOpen} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} width="w-[680px]"
            footer={
                <>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600">Can't find what you need?</p>
                    <Link href="/contact" className="text-xs font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-600 transition-colors flex items-center gap-1">
                        Contact us <ChevronRight size={12} />
                    </Link>
                </>
            }
        >
            <div className="grid grid-cols-2 gap-6">
                {groups.map(({ category, items }) => (
                    <div key={category}>
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 px-2">{category}</p>
                        <div className="flex flex-col gap-0.5">
                            {items.map((item) => {
                                const Icon = SERVICE_ICONS[item.icon] ?? Code2
                                return (
                                    <Link key={item.id} href={`/services/${item.slug}`}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl group hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-150">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-amber-50 dark:group-hover:bg-amber-400/10 transition-colors">
                                            <Icon size={15} className="text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white leading-tight">{item.title}</p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-600 leading-tight mt-0.5">{item.tagline}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </DropdownShell>
    )
}

function ProductsDropdown({ products, isOpen, onMouseEnter, onMouseLeave }: {
    products: Product[]
    isOpen: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
}) {
    const featured = products.find((p) => p.isFeatured) ?? products[0] ?? null
    return (
        <DropdownShell isOpen={isOpen} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} width="w-[560px]"
            footer={
                <>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600">Need a custom solution?</p>
                    <Link href="/contact" className="text-xs font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-600 transition-colors flex items-center gap-1">
                        Talk to us <ChevronRight size={12} />
                    </Link>
                </>
            }
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 px-2">Software Products</p>
                    <div className="flex flex-col gap-0.5">
                        {products.map((product) => {
                            const Icon = PRODUCT_ICONS[product.icon] ?? Package
                            return (
                                <Link key={product.id} href={`/products/${product.slug}`}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl group hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-150">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-amber-50 dark:group-hover:bg-amber-400/10 transition-colors">
                                        <Icon size={15} className="text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white leading-tight">{product.label}</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600 leading-tight mt-0.5">{product.tagline}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1 px-2">Featured</p>
                    {featured && (
                        <Link href={`/products/${featured.slug}`}
                            className="group relative p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 border border-white/10 hover:border-amber-400/30 transition-all overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center mb-3">
                                {(() => { const Icon = PRODUCT_ICONS[featured.icon] ?? Blocks; return <Icon size={17} className="text-amber-400" /> })()}
                            </div>
                            <p className="text-sm font-bold text-white mb-1">{featured.label}</p>
                            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{featured.description}</p>
                            <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs font-semibold">
                                Learn more <ChevronRight size={12} />
                            </div>
                        </Link>
                    )}
                    <Link href="/products"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:border-amber-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all">
                        View all products <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </DropdownShell>
    )
}

function DashboardLink() {
    const [href, setHref] = useState<string | null>(null)
    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => { if (!r.ok) throw new Error(); return r.json() })
            .then((data) => {
                const role = data.data?.role as Role | undefined
                setHref(role ? ROLE_REDIRECT[role] ?? null : null)
            })
            .catch(() => setHref(null))
    }, [])
    if (!href) return null
    return (
        <div className="flex items-center justify-center">
            <Link href={href}>
                <Button variant="ghost" size="sm" className="h-9 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/80 dark:hover:bg-white/5 rounded-lg text-xs">
                    {ROLE_LABEL[href] ?? "Dashboard"}
                </Button>
            </Link>
        </div>
    )
}

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const navRef = useRef<HTMLDivElement>(null)
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    const closeTimer = useRef<NodeJS.Timeout | null>(null)
    const [services, setServices] = useState<Service[]>([])
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        Promise.all([
            publicFetch.get<Service[]>("/services"),
            publicFetch.get<Product[]>("/products"),
        ])
            .then(([s, p]) => { setServices(s); setProducts(p) })
            .catch(console.error)
    }, [])

    const openMenu = (name: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current)
        setActiveMenu(name)
    }

    const closeMenu = () => {
        closeTimer.current = setTimeout(() => setActiveMenu(null), 100)
    }

    useEffect(() => {
        const onScroll = () => {
            setScrollY(window.scrollY)
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => { setIsOpen(false); setActiveMenu(null) }, [pathname])

    // Close mobile menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                isOpen &&
                navRef.current &&
                !navRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [isOpen])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) setActiveMenu(null)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

    const glassOpacity = Math.min(scrollY / 80, 1)

    const navLinkCls = (href: string, startsWith = false) => cn(
        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150",
        (startsWith ? pathname.startsWith(href) : pathname === href)
            ? "text-zinc-900 dark:text-white bg-zinc-900/10 dark:bg-white/10"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5"
    )

    const mobileLinkCls = (href: string): string => cn(
        "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
        pathname === href
            ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
    )

    return (
        <>
            <header ref={navRef} className="fixed top-0 left-0 right-0 z-50">
                <div className="mx-auto px-4 pt-3">
                    <div
                        className={cn(
                            "relative mx-auto max-w-6xl rounded-2xl",
                            "transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out",
                            scrolled
                                ? "shadow-xl shadow-zinc-900/10 dark:shadow-black/40 border border-zinc-200/70 dark:border-white/10"
                                : "border border-transparent"
                        )}
                        style={{
                            backgroundColor: scrolled
                                ? `color-mix(in srgb, var(--nav-bg, #18181b) ${Math.round(glassOpacity * 92)}%, transparent)`
                                : "transparent",
                            backdropFilter: scrolled
                                ? `blur(${Math.round(8 + glassOpacity * 8)}px) saturate(180%)`
                                : "blur(0px)",
                            WebkitBackdropFilter: scrolled
                                ? `blur(${Math.round(8 + glassOpacity * 8)}px) saturate(180%)`
                                : "blur(0px)",
                        }}
                    >
                        <div className="relative flex h-14 items-center justify-between px-5">

                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                                <div className="w-7 h-7 rounded-lg overflow-hidden transition-transform group-hover:scale-105 shrink-0">
                                    <Image src="/icon.svg" alt={siteConfig.fullName} width={28} height={28} className="w-full h-full object-contain" />
                                </div>
                                <div className="hidden sm:flex flex-col leading-none">
                                    <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">
                                        {siteConfig.name.toUpperCase()}
                                    </span>
                                    <span className="text-[9px] font-semibold text-zinc-400 dark:text-amber-400/70 tracking-widest uppercase mt-0.5">
                                        {siteConfig.slogan}
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Nav */}
                            <nav className="hidden lg:flex items-center gap-0.5">
                                <Link href="/" className={navLinkCls("/")}>Home</Link>

                                <div className="relative" onMouseEnter={() => openMenu("services")} onMouseLeave={closeMenu}>
                                    <div className="flex items-center">
                                        <Link href="/services" className={cn(navLinkCls("/services", true), "rounded-r-none")}>Services</Link>
                                        <button onClick={() => setActiveMenu(activeMenu === "services" ? null : "services")}
                                            className={cn(navLinkCls("/services", true), "rounded-l-none px-1.5")}>
                                            <ChevronDown size={13} className={cn("transition-transform duration-200", activeMenu === "services" && "rotate-180")} />
                                        </button>
                                    </div>
                                    <ServicesDropdown services={services} isOpen={activeMenu === "services"} onMouseEnter={() => openMenu("services")} onMouseLeave={closeMenu} />
                                </div>

                                <Link href="/talent" className={navLinkCls("/talent")}>Talent</Link>

                                <div className="relative" onMouseEnter={() => openMenu("products")} onMouseLeave={closeMenu}>
                                    <div className="flex items-center">
                                        <Link href="/products" className={cn(navLinkCls("/products", true), "rounded-r-none")}>Products</Link>
                                        <button onClick={() => setActiveMenu(activeMenu === "products" ? null : "products")}
                                            className={cn(navLinkCls("/products", true), "rounded-l-none px-1.5")}>
                                            <ChevronDown size={13} className={cn("transition-transform duration-200", activeMenu === "products" && "rotate-180")} />
                                        </button>
                                    </div>
                                    <ProductsDropdown products={products} isOpen={activeMenu === "products"} onMouseEnter={() => openMenu("products")} onMouseLeave={closeMenu} />
                                </div>

                                {mainNav.filter((item) => item.href !== "/talent").map((item) => (
                                    <Link key={item.href} href={item.href} className={navLinkCls(item.href)}>{item.label}</Link>
                                ))}
                            </nav>

                            {/* Desktop Right */}
                            <div className="hidden lg:flex items-center gap-2 shrink-0">
                                <ThemeToggle />
                                <div className="w-px h-5 bg-zinc-300/60 dark:bg-white/10 mx-1" />
                                <Link href="/book-a-meeting?type=discovery">
                                    <Button variant="outline" size="sm" className="rounded-xl h-9 border-zinc-200/80 dark:border-white/10 bg-transparent text-zinc-600 dark:text-zinc-400 hover:border-amber-400/60 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/80 dark:hover:bg-amber-400/5 gap-1.5 text-xs font-semibold transition-all">
                                        <CalendarDays size={13} /> Book a Meeting
                                    </Button>
                                </Link>
                                <SignedOut>
                                    <Link href="/sign-in">
                                        <Button size="sm" className="rounded-xl h-9 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 gap-1.5 text-xs font-semibold">
                                            <LogIn size={13} /> Log In
                                        </Button>
                                    </Link>
                                </SignedOut>
                                <SignedIn>
                                    <DashboardLink />
                                    <UserButton />
                                </SignedIn>
                            </div>

                            {/* Mobile — right side */}
                            <div className="lg:hidden flex items-center gap-2">
                                <ThemeToggle />
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className={cn(
                                        "flex items-center justify-center w-9 h-9 rounded-xl transition-all",
                                        isOpen
                                            ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-white/5"
                                    )}
                                    aria-label="Toggle menu"
                                >
                                    <div className={cn("transition-transform duration-200", isOpen && "rotate-90")}>
                                        {isOpen ? <X size={18} /> : <Menu size={18} />}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* ── Mobile Dropdown ── */}
                        {isOpen && (
                            <div className="lg:hidden absolute top-full left-0 right-0 mt-4 mx-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/40 dark:shadow-black/50 overflow-hidden z-50">
                                <div ref={mobileMenuRef} className="px-3 py-4 flex flex-col gap-1 overflow-y-auto max-h-[80vh]">

                                    {/* Nav links */}
                                    <Link href="/" onClick={() => setIsOpen(false)} className={mobileLinkCls("/")}>
                                        Home <ChevronRight size={13} className="opacity-30" />
                                    </Link>

                                    <MobileAccordion label="Services">
                                        {[
                                            { category: "Development", items: services.filter((s) => s.category === "development") },
                                            { category: "Outsourcing", items: services.filter((s) => s.category === "outsourcing") },
                                        ].map(({ category, items }) => (
                                            <MobileMenuGroup
                                                key={category}
                                                category={category}
                                                items={items.map((s) => ({ href: `/services/${s.slug}`, icon: SERVICE_ICONS[s.icon] ?? Code2, label: s.title }))}
                                            />
                                        ))}
                                    </MobileAccordion>

                                    <Link href="/talent" onClick={() => setIsOpen(false)} className={mobileLinkCls("/talent")}>
                                        Talent <ChevronRight size={13} className="opacity-30" />
                                    </Link>

                                    <MobileAccordion label="Products">
                                        <MobileMenuGroup
                                            category="Software Products"
                                            items={products.map((p) => ({ href: `/products/${p.slug}`, icon: PRODUCT_ICONS[p.icon] ?? Package, label: p.label }))}
                                        />
                                    </MobileAccordion>

                                    {mainNav.filter((item) => item.href !== "/talent").map((item) => (
                                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={mobileLinkCls(item.href)}>
                                            {item.label} <ChevronRight size={13} className="opacity-30" />
                                        </Link>
                                    ))}

                                    {/* Divider */}
                                    <div className="border-t border-zinc-100 dark:border-white/5 my-1" />

                                    {/* CTA */}
                                    <Link href="/book-a-meeting?type=discovery" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full rounded-xl h-10 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 text-sm">
                                            <CalendarDays size={14} /> Book a Discovery Call
                                        </Button>
                                    </Link>

                                    <SignedOut>
                                        <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                                            <Button variant="outline" className="w-full rounded-xl h-10 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 gap-2 font-semibold text-sm">
                                                <LogIn size={14} /> Log In to Client Portal
                                            </Button>
                                        </Link>
                                    </SignedOut>
                                    <SignedIn>
                                        <DashboardLink />
                                    </SignedIn>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-20" />
        </>
    )
}