"use client"

import { SignIn } from "@clerk/nextjs"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { Shield, Zap, Users, Lock } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function SignInPage() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const isDark = resolvedTheme === "dark"

    const clerkAppearance = {
        variables: {
            colorPrimary: "#fbbf24",
            colorBackground: isDark ? "#18181b" : "#ffffff",
            colorInputBackground: isDark ? "#27272a" : "#f4f4f5",
            colorInputText: isDark ? "#ffffff" : "#09090b",
            colorText: isDark ? "#ffffff" : "#09090b",
            colorTextSecondary: isDark ? "#a1a1aa" : "#71717a",
            colorDanger: "#f87171",
            borderRadius: "0.75rem",
            fontFamily: "inherit",
            spacingUnit: "16px",
        },
        elements: {
            card: isDark
                ? "bg-zinc-900 border border-white/5 shadow-2xl shadow-black/60 rounded-2xl"
                : "bg-white border border-zinc-200 shadow-xl shadow-zinc-100/80 rounded-2xl",
            cardBox: "shadow-none",

            headerTitle: isDark ? "text-white font-bold text-xl" : "text-zinc-900 font-bold text-xl",
            headerSubtitle: isDark ? "text-zinc-400 text-sm" : "text-zinc-500 text-sm",

            logoBox: "hidden",
            logoImage: "hidden",

            formFieldLabel: isDark
                ? "text-zinc-300 text-xs font-semibold uppercase tracking-wider"
                : "text-zinc-600 text-xs font-semibold uppercase tracking-wider",

            formFieldInput: isDark
                ? "bg-zinc-800 border border-white/10 text-white placeholder:text-zinc-600 rounded-xl h-11 focus:border-amber-400/60 focus:ring-amber-400/20 transition-all"
                : "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 rounded-xl h-11 focus:border-amber-400/60 focus:ring-amber-400/20 transition-all",

            formButtonPrimary:
                "bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl h-11 transition-all shadow-lg shadow-amber-500/20",

            socialButtonsBlockButton: isDark
                ? "bg-zinc-800 border border-white/10 text-white hover:bg-zinc-700 hover:border-white/20 rounded-xl h-11 font-medium transition-all"
                : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 rounded-xl h-11 font-medium transition-all",
            socialButtonsBlockButtonText: isDark
                ? "text-zinc-200 text-sm font-semibold"
                : "text-zinc-700 text-sm font-semibold",

            dividerLine: isDark ? "bg-white/10" : "bg-zinc-200",
            dividerText: isDark ? "text-zinc-600 text-xs" : "text-zinc-400 text-xs",

            formFieldAction: "text-amber-500 hover:text-amber-400 text-xs font-semibold",
            identityPreviewEditButton: "text-amber-500 hover:text-amber-400",

            footerAction__signUp: "hidden",
            footerAction: "hidden",
            footer: "hidden",
            footerPages: "hidden",
            footerPagesLink__signUp: "hidden",

            alert: isDark
                ? "bg-red-500/10 border border-red-500/20 rounded-xl"
                : "bg-red-50 border border-red-200 rounded-xl",
            alertText: "text-red-500 text-sm",

            otpCodeField: "gap-2",
            otpCodeFieldInput: isDark
                ? "bg-zinc-800 border border-white/10 text-white rounded-xl focus:border-amber-400/60"
                : "bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl focus:border-amber-400/60",
        },
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex transition-colors duration-300">

            {/* ── Left panel — branding ── */}
            <div className="hidden lg:flex flex-col w-[480px] shrink-0 relative overflow-hidden border-r border-zinc-100 dark:border-white/5">

                {/* Light mode background */}
                <div className="absolute inset-0 bg-zinc-50 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-950 dark:to-black transition-colors duration-300" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888810_1px,transparent_1px),linear-gradient(to_bottom,#88888810_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute top-0 left-0 w-80 h-80 bg-amber-400/5 dark:bg-amber-400/8 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

                <div className="relative flex flex-col h-full px-10 py-12">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-auto">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                            <Image src="/icon.svg" alt={siteConfig.fullName} width={40} height={40} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-base font-black text-zinc-900 dark:text-white tracking-tight">
                                {siteConfig.name.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-semibold text-amber-500 dark:text-amber-400/70 tracking-[0.2em] uppercase mt-0.5">
                                {siteConfig.slogan}
                            </span>
                        </div>
                    </div>

                    <div className="my-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/5 dark:border-amber-400/20 mb-6">
                            <Lock size={11} className="text-amber-500 dark:text-amber-400" />
                            <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-widest uppercase">
                                Secure Portal
                            </span>
                        </div>

                        <h1 className="text-4xl font-black text-zinc-900 dark:text-white leading-[1.05] tracking-tight mb-4">
                            Welcome back to<br />
                            <span className="text-amber-500 dark:text-amber-400">{siteConfig.name}.</span>
                        </h1>

                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xs">
                            Your gateway to manage talent, track projects, and access all your {siteConfig.name} services — all in one place.
                        </p>

                        {/* Feature list */}
                        <div className="flex flex-col gap-3 mt-8">
                            {[
                                { icon: Users, label: "Manage your team & talent" },
                                { icon: Zap, label: "Track projects in real time" },
                                { icon: Shield, label: "Enterprise-grade security" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 dark:border-amber-400/20 flex items-center justify-center shrink-0">
                                        <item.icon size={13} className="text-amber-500 dark:text-amber-400" />
                                    </div>
                                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="mt-auto pt-8 border-t border-zinc-200 dark:border-white/5">
                        <p className="text-zinc-400 dark:text-zinc-600 text-xs leading-relaxed">
                            This portal is for{" "}
                            <span className="text-zinc-600 dark:text-zinc-400 font-semibold">Juspher clients</span> and{" "}
                            <span className="text-zinc-600 dark:text-zinc-400 font-semibold">team administrators</span> only.
                            Access is granted by invitation or account approval.
                        </p>
                        <p className="text-zinc-300 dark:text-zinc-700 text-xs mt-3">
                            © {new Date().getFullYear()} {siteConfig.fullName}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Right panel — Clerk form ── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative bg-white dark:bg-zinc-950 transition-colors duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#fbbf2406_0%,transparent_70%)] pointer-events-none" />

                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-2.5 mb-10">
                    <div className="w-9 h-9 rounded-xl overflow-hidden">
                        <Image src="/icon.svg" alt={siteConfig.fullName} width={36} height={36} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">{siteConfig.name.toUpperCase()}</span>
                        <span className="text-[9px] font-semibold text-amber-500 dark:text-amber-400/70 tracking-[0.2em] uppercase mt-0.5">{siteConfig.slogan}</span>
                    </div>
                </div>

                {/* Clerk form — only render after mount to avoid theme flicker */}
                <div className="relative w-full max-w-sm">
                    {mounted ? (
                        <SignIn appearance={clerkAppearance} />
                    ) : (
                        /* Skeleton while theme resolves */
                        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-8 animate-pulse">
                            <div className="w-32 h-5 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-2" />
                            <div className="w-48 h-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-8" />
                            <div className="w-full h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-3" />
                            <div className="w-full h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-6" />
                            <div className="w-full h-11 rounded-xl bg-amber-200 dark:bg-amber-400/20" />
                        </div>
                    )}
                </div>

                {/* Below form note */}
                <p className="relative mt-8 text-zinc-400 dark:text-zinc-600 text-xs text-center max-w-xs">
                    Don't have access?{" "}
                    <a href="/contact" className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 font-semibold transition-colors">
                        Contact {siteConfig.name}
                    </a>{" "}
                    to request an account.
                </p>
            </div>
        </div>
    )
}