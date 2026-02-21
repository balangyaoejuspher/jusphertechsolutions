"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Menu, X, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/shared/theme-toggle"

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    return (
        <>
            <header
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
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-amber-400 flex items-center justify-center transition-transform group-hover:scale-105">
                                <span className="text-white dark:text-zinc-950 text-sm font-black">PA</span>
                            </div>
                            <span className="font-bold text-zinc-900 dark:text-white tracking-tight hidden sm:block">
                                {siteConfig.name}
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {siteConfig.nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150",
                                        pathname === item.href
                                            ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-2">
                            <ThemeToggle />
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg"
                                    >
                                        Sign In
                                    </Button>
                                </SignInButton>
                                <Link href="/sign-up">
                                    <Button
                                        size="sm"
                                        className="rounded-lg bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 hover:bg-zinc-700 dark:hover:bg-amber-300 font-semibold shadow-sm"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </SignedOut>
                            <SignedIn>
                                <Link href="/dashboard">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                    </div>
                </div>
            </header>

            {/* Mobile Drawer Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 md:hidden transition-all duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Drawer */}
                <div
                    className={cn(
                        "absolute top-0 right-0 h-full w-72 bg-white dark:bg-zinc-950 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border-l border-zinc-100 dark:border-white/5 transition-transform duration-300 ease-out flex flex-col",
                        isOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-100 dark:border-white/5">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-amber-400 flex items-center justify-center">
                                <span className="text-white dark:text-zinc-950 text-xs font-black">PA</span>
                            </div>
                            <span className="font-bold text-zinc-900 dark:text-white text-sm">
                                {siteConfig.name}
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex flex-col px-3 py-4 gap-1 flex-1">
                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-3 mb-2">
                            Navigation
                        </p>
                        {siteConfig.nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                                    pathname === item.href
                                        ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                                )}
                            >
                                {item.label}
                                <ChevronRight
                                    size={15}
                                    className={cn(
                                        "opacity-40",
                                        pathname === item.href ? "opacity-60" : ""
                                    )}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Auth */}
                    <div className="px-4 py-5 border-t border-zinc-100 dark:border-white/5 flex flex-col gap-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                                Appearance
                            </span>
                            <ThemeToggle />
                        </div>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5"
                                >
                                    Sign In
                                </Button>
                            </SignInButton>
                            <Link href="/sign-up" className="w-full">
                                <Button className="w-full rounded-xl bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 hover:bg-zinc-700 dark:hover:bg-amber-300 font-semibold">
                                    Get Started
                                </Button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard" className="w-full">
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl border-zinc-200 dark:border-white/10"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3 px-1 pt-1">
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