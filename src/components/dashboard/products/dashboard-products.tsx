"use client"

import { useState } from "react"
import {
    Search, Eye, EyeOff, ExternalLink,
    CheckCircle, DollarSign, Users, Zap,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { allProducts } from "@/lib/products"
import { PRODUCT_ACCENT_MAP } from "@/lib/helpers/constants"


const stats = [
    { label: "Total Products", value: "6", icon: Zap, desc: "Active in catalog" },
    { label: "Starting From", value: "₱900", icon: DollarSign, desc: "Lowest monthly plan" },
    { label: "Total Features", value: "36", icon: CheckCircle, desc: "Across all products" },
    { label: "Use Cases", value: "24", icon: Users, desc: "Industries covered" },
]

export default function DashboardProducts() {
    const [search, setSearch] = useState("")
    const [visibility, setVisibility] = useState<Record<string, boolean>>(
        Object.fromEntries(allProducts.map((p) => [p.slug, true]))
    )
    const [expandedProduct, setExpandedProduct] = useState<string | null>(null)

    const filtered = allProducts.filter((p) =>
        p.label.toLowerCase().includes(search.toLowerCase()) ||
        p.tagline.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    )

    const toggleVisibility = (slug: string) => {
        setVisibility((prev) => ({ ...prev, [slug]: !prev[slug] }))
    }

    return (
        <div className="flex flex-col gap-8 p-6 md:p-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Products</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage your software product catalog and pricing
                    </p>
                </div>
                <Link
                    href="/products"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-sm font-bold transition-colors shrink-0"
                >
                    <ExternalLink size={14} />
                    View Public Page
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                                {stat.label}
                            </p>
                            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <stat.icon size={13} className="text-zinc-400 dark:text-zinc-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{stat.desc}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 h-11 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-colors"
                />
            </div>

            {/* Products list */}
            <div className="flex flex-col gap-4">
                {filtered.length === 0 && (
                    <div className="text-center py-16 text-zinc-400 dark:text-zinc-600 text-sm">
                        No products found matching "{search}"
                    </div>
                )}

                {filtered.map((product) => {
                    const accent = PRODUCT_ACCENT_MAP[product.accentColor] ?? PRODUCT_ACCENT_MAP.amber
                    const isVisible = visibility[product.slug]
                    const isExpanded = expandedProduct === product.slug

                    return (
                        <div
                            key={product.slug}
                            className={cn(
                                "bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-200",
                                isVisible
                                    ? `border-zinc-200 dark:border-white/5 ${accent.ring}`
                                    : "border-zinc-100 dark:border-white/[0.03] opacity-60"
                            )}
                        >
                            {/* Accent top bar */}
                            <div className={`h-0.5 w-full ${accent.bar}`} />

                            {/* Main row */}
                            <div className="flex items-center gap-4 p-5">

                                {/* Icon */}
                                <div className={cn("w-11 h-11 rounded-xl border flex items-center justify-center shrink-0", accent.icon)}>
                                    <product.icon size={20} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                                            {product.label}
                                        </h3>
                                        <span className={cn("px-2 py-0.5 rounded-md border text-xs font-semibold", accent.badge)}>
                                            {product.category}
                                        </span>
                                        {!isVisible && (
                                            <span className="px-2 py-0.5 rounded-md border text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-white/10">
                                                Hidden
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                                        {product.tagline}
                                    </p>
                                </div>

                                {/* Pricing summary */}
                                <div className="hidden md:flex items-center gap-1 shrink-0">
                                    {product.pricing.map((tier) => (
                                        <div
                                            key={tier.label}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg border text-xs transition-all",
                                                tier.highlight
                                                    ? `${accent.badge} font-bold`
                                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-500"
                                            )}
                                        >
                                            {tier.price}
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => toggleVisibility(product.slug)}
                                        title={isVisible ? "Hide from public" : "Show on public"}
                                        className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-white/20 transition-all"
                                    >
                                        {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                                    </button>

                                    <Link
                                        href={`/products/${product.slug}`}
                                        target="_blank"
                                        className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-white/20 transition-all"
                                        title="View public page"
                                    >
                                        <ExternalLink size={15} />
                                    </Link>

                                    <button
                                        onClick={() => setExpandedProduct(isExpanded ? null : product.slug)}
                                        className={cn(
                                            "px-4 h-9 rounded-xl border text-xs font-semibold transition-all",
                                            isExpanded
                                                ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
                                                : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                                        )}
                                    >
                                        {isExpanded ? "Collapse" : "Details"}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded details */}
                            {isExpanded && (
                                <div className="border-t border-zinc-100 dark:border-white/5 p-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                                    {/* Features */}
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">
                                            Features ({product.features.length})
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {product.features.map((f) => (
                                                <div key={f.title} className="flex items-start gap-2">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", accent.dot)} />
                                                    <div>
                                                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{f.title}</p>
                                                        <p className="text-xs text-zinc-400 dark:text-zinc-600 leading-relaxed">{f.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pricing tiers */}
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">
                                            Pricing Tiers
                                        </p>
                                        <div className="flex flex-col gap-3">
                                            {product.pricing.map((tier) => (
                                                <div
                                                    key={tier.label}
                                                    className={cn(
                                                        "p-3 rounded-xl border",
                                                        tier.highlight
                                                            ? `${product.bgColor} ${product.borderColor}`
                                                            : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{tier.label}</p>
                                                            {tier.note && (
                                                                <span className={cn("text-xs font-semibold px-1.5 py-0.5 rounded", accent.badge)}>
                                                                    {tier.note}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={cn("text-sm font-bold", product.textColor)}>{tier.price}</p>
                                                    </div>
                                                    <ul className="flex flex-col gap-1">
                                                        {tier.features.map((f) => (
                                                            <li key={f} className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                                                <CheckCircle size={11} className={product.textColor} />
                                                                {f}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Use cases + Tech */}
                                    <div className="flex flex-col gap-5">
                                        <div>
                                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">
                                                Use Cases
                                            </p>
                                            <div className="flex flex-col gap-1.5">
                                                {product.useCases.map((uc) => (
                                                    <div key={uc} className="flex items-start gap-2">
                                                        <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", accent.dot)} />
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{uc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">
                                                Tech Highlights
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {product.techHighlights.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs text-zinc-500 dark:text-zinc-400"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}