import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Package } from "lucide-react"
import { productService } from "@/server/services/product.service"
import { PRODUCT_ICONS } from "@/lib/helpers/product-icons"
import type { Product } from "@/server/db/schema"

export const metadata: Metadata = {
    title: "Products",
    description:
        "Business software built for Philippine companies — HRIS, Loan Management, Inventory, School Management, POS, and Project Management.",
}

export default async function ProductsPage() {
    const products = await productService.getAll()

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">

            {/* ── Hero ── */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-zinc-950" />
                <div className="container relative mx-auto px-6 md:px-12 text-center">
                    <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                        — Business Software
                    </p>
                    <h1 className="text-6xl md:text-8xl font-bold text-zinc-900 dark:text-white leading-[0.95] tracking-tight mb-6">
                        Tools Built
                        <br />
                        <span className="text-zinc-400 dark:text-zinc-500">for Operations</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed font-light">
                        Purpose-built software for Philippine businesses. No bloat, no unnecessary complexity — just the features your team actually needs.
                    </p>
                </div>
            </section>

            {/* ── Products Grid ── */}
            <div className="container mx-auto px-6 md:px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const Icon = PRODUCT_ICONS[product.icon] ?? Package
                        const features = (product.features ?? []) as { title: string }[]

                        return (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group flex flex-col bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-amber-400/40 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300"
                            >
                                {/* Top accent */}
                                <div className="h-1 w-full bg-gradient-to-r from-amber-400/60 to-amber-300/10" />

                                <div className="flex flex-col flex-1 p-7">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl ${product.bgColor} ${product.borderColor} border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                                        <Icon size={22} className={product.textColor} />
                                    </div>

                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                                            {product.label}
                                        </h2>
                                        <Badges product={product} />
                                    </div>

                                    <p className={`text-xs font-semibold mb-3 ${product.textColor}`}>
                                        {product.tagline}
                                    </p>
                                    <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed mb-6 flex-1">
                                        {product.description.slice(0, 120)}…
                                    </p>

                                    {/* Feature preview */}
                                    <ul className="space-y-2 mb-6">
                                        {features.slice(0, 3).map((f) => (
                                            <li key={f.title} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                                                <Check size={12} className={product.textColor} />
                                                {f.title}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-white/5">
                                        <span className="text-xs text-zinc-400 dark:text-zinc-600">
                                            {features.length} features
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                                            Learn more <ArrowRight size={11} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* ── CTA ── */}
            <div className="container mx-auto px-6 md:px-12 pb-20">
                <div className="relative rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 overflow-hidden p-10 md:p-14 text-center">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/5 rounded-full blur-[40px] pointer-events-none" />
                    <div className="relative">
                        <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                            Not sure which fits?
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
                            Let's Find the Right Fit
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                            Book a free 30-minute call and we'll walk you through which product matches your business stage and needs.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-colors"
                        >
                            Book a Free Demo <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

function Badges({ product }: { product: Product }) {
    return (
        <div className="flex items-center gap-1.5 shrink-0">
            {product.isNew && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    NEW
                </span>
            )}
            {product.isFeatured && (
                <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                    ★
                </span>
            )}
            {product.badge && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold">
                    {product.badge}
                </span>
            )}
        </div>
    )
}