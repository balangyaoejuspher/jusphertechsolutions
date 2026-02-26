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
    isOpen,
    onMouseEnter,
    onMouseLeave,
    width,
    footer,
    children,
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
                "absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/40 overflow-hidden transition-all duration-200 z-50",
                width,
                isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div className="p-5">{children}</div>
            {footer && (
                <div className="px-5 py-3 bg-zinc-50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
                    {footer}
                </div>
            )}
        </div>
    )
}

function MobileAccordion({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
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
                    {children}
                </div>
            )}
        </div>
    )
}

function MobileMenuGroup({
    category,
    items,
}: {
    category: string
    items: { href: string; icon: React.ElementType; label: string; desc?: string }[]
}) {
    return (
        <div>
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-4 py-2">
                {category}
            </p>
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                    <item.icon size={14} className="shrink-0 text-zinc-400" />
                    {item.label}
                </Link>
            ))}
        </div>
    )
}

function ServicesDropdown({
    services,
    isOpen,
    onMouseEnter,
    onMouseLeave,
}: {
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
        <DropdownShell
            isOpen={isOpen}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            width="w-[680px]"
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
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 px-2">
                            {category}
                        </p>
                        <div className="flex flex-col gap-0.5">
                            {items.map((item) => {
                                const Icon = SERVICE_ICONS[item.icon] ?? Code2
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/services/${item.slug}`}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl group hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-150"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-amber-50 dark:group-hover:bg-amber-400/10 transition-colors">
                                            <Icon size={15} className="text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white leading-tight">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-600 leading-tight mt-0.5">
                                                {item.tagline}
                                            </p>
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

function ProductsDropdown({
    products,
    isOpen,
    onMouseEnter,
    onMouseLeave,
}: {
    products: Product[]
    isOpen: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
}) {
    const featured = products.find((p) => p.isFeatured) ?? products[0] ?? null

    return (
        <DropdownShell
            isOpen={isOpen}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            width="w-[560px]"
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
                {/* Product list */}
                <div>
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 px-2">
                        Software Products
                    </p>
                    <div className="flex flex-col gap-0.5">
                        {products.map((product) => {
                            const Icon = PRODUCT_ICONS[product.icon] ?? Package
                            return (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl group hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-150"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-amber-50 dark:group-hover:bg-amber-400/10 transition-colors">
                                        <Icon size={15} className="text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white leading-tight">
                                            {product.label}
                                        </p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600 leading-tight mt-0.5">
                                            {product.tagline}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Featured + CTA */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1 px-2">
                        Featured
                    </p>
                    {featured ? (
                        <Link
                            href={`/products/${featured.slug}`}
                            className="group relative p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 border border-white/10 hover:border-amber-400/30 transition-all overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center mb-3">
                                {(() => {
                                    const Icon = PRODUCT_ICONS[featured.icon] ?? Blocks
                                    return <Icon size={17} className="text-amber-400" />
                                })()}
                            </div>
                            <p className="text-sm font-bold text-white mb-1">{featured.label}</p>
                            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{featured.description}</p>
                            <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs font-semibold">
                                Learn more <ChevronRight size={12} />
                            </div>
                        </Link>
                    ) : null}
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:border-amber-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all"
                    >
                        View all products <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </DropdownShell>
    )
}

function MobileServicesAccordion({ services, onClose }: { services: Service[]; onClose: () => void }) {
    const groups = [
        { category: "Development", items: services.filter((s) => s.category === "development") },
        { category: "Outsourcing", items: services.filter((s) => s.category === "outsourcing") },
    ]

    return (
        <MobileAccordion label="Services">
            {groups.map(({ category, items }) => (
                <MobileMenuGroup
                    key={category}
                    category={category}
                    items={items.map((s) => ({
                        href: `/services/${s.slug}`,
                        icon: SERVICE_ICONS[s.icon] ?? Code2,
                        label: s.title,
                    }))}
                />
            ))}
        </MobileAccordion>
    )
}

function MobileProductsAccordion({ products, onClose }: { products: Product[]; onClose: () => void }) {
    return (
        <MobileAccordion label="Products">
            <MobileMenuGroup
                category="Software Products"
                items={products.map((p) => ({
                    href: `/products/${p.slug}`,
                    icon: PRODUCT_ICONS[p.icon] ?? Package,
                    label: p.label,
                }))}
            />
        </MobileAccordion>
    )
}

function DashboardLink() {
    const [href, setHref] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => {
                if (!r.ok) throw new Error()
                return r.json()
            })
            .then((data) => {
                const role = data.data?.role as Role | undefined
                setHref(role ? ROLE_REDIRECT[role] ?? null : null)
            })
            .catch(() => setHref(null))
    }, [])

    if (!href) return null

    return (
        <Link href={href}>
            <Button variant="ghost" size="sm" className="h-9 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg text-xs">
                {ROLE_LABEL[href] ?? "Dashboard"}
            </Button>
        </Link>
    )
}

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const navRef = useRef<HTMLDivElement>(null)
    const closeTimer = useRef<NodeJS.Timeout | null>(null)
    const [services, setServices] = useState<Service[]>([])
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        Promise.all([
            publicFetch.get<Service[]>("/services"),
            publicFetch.get<Product[]>("/products"),
        ])
            .then(([s, p]) => {
                setServices(s)
                setProducts(p)
            })
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

    const navLinkCls = (href: string, startsWith = false) => cn(
        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150",
        (startsWith ? pathname.startsWith(href) : pathname === href)
            ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
    )

    const mobileLinkCls = (href: string) => cn(
        "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
        pathname === href
            ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
    )

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
                            <Link href="/" className={navLinkCls("/")}>Home</Link>

                            {/* Services */}
                            <div className="relative" onMouseEnter={() => openMenu("services")} onMouseLeave={closeMenu}>
                                <div className="flex items-center">
                                    <Link href="/services" className={cn(navLinkCls("/services", true), "rounded-r-none")}>
                                        Services
                                    </Link>
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === "services" ? null : "services")}
                                        className={cn(navLinkCls("/services", true), "rounded-l-none px-1.5")}
                                    >
                                        <ChevronDown size={13} className={cn("transition-transform duration-200", activeMenu === "services" && "rotate-180")} />
                                    </button>
                                </div>
                                <ServicesDropdown
                                    services={services}
                                    isOpen={activeMenu === "services"}
                                    onMouseEnter={() => openMenu("services")}
                                    onMouseLeave={closeMenu}
                                />
                            </div>

                            <Link href="/talent" className={navLinkCls("/talent")}>Talent</Link>

                            {/* Products */}
                            <div className="relative" onMouseEnter={() => openMenu("products")} onMouseLeave={closeMenu}>
                                <div className="flex items-center">
                                    <Link href="/products" className={cn(navLinkCls("/products", true), "rounded-r-none")}>
                                        Products
                                    </Link>
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === "products" ? null : "products")}
                                        className={cn(navLinkCls("/products", true), "rounded-l-none px-1.5")}
                                    >
                                        <ChevronDown size={13} className={cn("transition-transform duration-200", activeMenu === "products" && "rotate-180")} />
                                    </button>
                                </div>
                                <ProductsDropdown
                                    products={products}
                                    isOpen={activeMenu === "products"}
                                    onMouseEnter={() => openMenu("products")}
                                    onMouseLeave={closeMenu}
                                />
                            </div>

                            {mainNav.filter((item) => item.href !== "/talent").map((item) => (
                                <Link key={item.href} href={item.href} className={navLinkCls(item.href)}>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Right Actions */}
                        <div className="hidden lg:flex items-center gap-2 shrink-0">
                            <ThemeToggle />
                            <div className="w-px h-5 bg-zinc-200 dark:bg-white/10 mx-1" />
                            <Link href="/book-a-meeting?type=discovery">
                                <Button variant="outline" size="sm" className="rounded-xl h-9 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-amber-400/60 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/5 gap-1.5 text-xs font-semibold transition-all">
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
                        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
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

                        <Link href="/" onClick={() => setIsOpen(false)} className={mobileLinkCls("/")}>
                            Home <ChevronRight size={15} className="opacity-40" />
                        </Link>

                        <MobileServicesAccordion services={services} onClose={() => setIsOpen(false)} />

                        <Link href="/talent" onClick={() => setIsOpen(false)} className={mobileLinkCls("/talent")}>
                            Talent <ChevronRight size={15} className="opacity-40" />
                        </Link>

                        <MobileProductsAccordion products={products} onClose={() => setIsOpen(false)} />

                        {mainNav.filter((item) => item.href !== "/talent").map((item) => (
                            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={mobileLinkCls(item.href)}>
                                {item.label} <ChevronRight size={15} className="opacity-40" />
                            </Link>
                        ))}
                    </nav>

                    {/* Drawer footer */}
                    <div className="px-4 py-5 border-t border-zinc-100 dark:border-white/5 flex flex-col gap-3 shrink-0">
                        <Link href="/book-a-meeting?type=discovery" onClick={() => setIsOpen(false)}>
                            <Button className="w-full rounded-xl h-11 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2">
                                <CalendarDays size={15} /> Book a Discovery Call
                            </Button>
                        </Link>
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Appearance</span>
                            <ThemeToggle />
                        </div>
                        <SignedOut>
                            <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                                <Button variant="outline" className="w-full rounded-xl h-11 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 gap-2 font-semibold">
                                    <LogIn size={15} /> Log In to Client Portal
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
                                <UserButton />
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