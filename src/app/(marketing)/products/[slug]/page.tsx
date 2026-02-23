import { createMetadata, createStaticParams } from "@/lib/metadata"
import { allProducts } from "@/lib/products"
import { ArrowLeft, ArrowRight, Check, Zap } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export function generateStaticParams() {
    return createStaticParams({ items: allProducts, slugField: "slug" })
}

export const generateMetadata = createMetadata({
    items: allProducts,
    slugField: "slug",
    notFoundTitle: "Product Not Found",
})

// ── Page ─────────────────────────────────────────────────────

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const product = allProducts.find((p) => p.slug === slug)
    if (!product) notFound()

    const Icon = product.icon

    const related = allProducts
        .filter((p) => p.slug !== product.slug)
        .slice(0, 3)

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">

            {/* ── Hero ── */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-zinc-950" />

                <div className="container relative mx-auto px-6 md:px-12 max-w-4xl">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors mb-8 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        All Products
                    </Link>

                    <div className="flex items-start gap-6 mb-8">
                        <div className={`w-16 h-16 rounded-2xl ${product.bgColor} ${product.borderColor} border flex items-center justify-center shrink-0`}>
                            <Icon size={28} className={product.textColor} />
                        </div>
                        <div>
                            <p className={`text-xs font-semibold tracking-[0.2em] uppercase mb-1 ${product.textColor}`}>
                                {product.category}
                            </p>
                            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
                                {product.label}
                            </h1>
                        </div>
                    </div>

                    <p className="text-2xl md:text-3xl font-semibold text-zinc-400 dark:text-zinc-500 mb-6 leading-snug">
                        {product.tagline}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-2xl">
                        {product.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-8">
                        {product.techHighlights.map((t) => (
                            <span
                                key={t}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${product.bgColor} ${product.borderColor} ${product.textColor}`}
                            >
                                <Zap size={10} />
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 md:px-12 max-w-4xl py-16 space-y-20">

                {/* ── Features ── */}
                <section>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-8">
                        What's included
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {product.features.map((feature) => (
                            <div
                                key={feature.title}
                                className={`p-6 rounded-2xl border ${product.bgColor} ${product.borderColor}`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Check size={14} className={product.textColor} />
                                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Use Cases ── */}
                <section>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-6">
                        Who it's for
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.useCases.map((uc) => (
                            <div
                                key={uc}
                                className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5"
                            >
                                <div className={`w-2 h-2 rounded-full shrink-0 bg-current ${product.textColor}`} />
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">{uc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Pricing ── */}
                <section>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-8">
                        Pricing
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {product.pricing.map((plan) => (
                            <div
                                key={plan.label}
                                className={`relative flex flex-col p-7 rounded-2xl border transition-all ${plan.highlight
                                        ? "bg-zinc-900 dark:bg-white/5 border-amber-400/40 shadow-lg shadow-amber-500/10"
                                        : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/5"
                                    }`}
                            >
                                {plan.note && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold whitespace-nowrap">
                                        {plan.note}
                                    </span>
                                )}
                                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-zinc-300" : "text-zinc-500 dark:text-zinc-400"}`}>
                                    {plan.label}
                                </p>
                                <p className={`text-3xl font-bold mb-6 ${plan.highlight ? "text-white" : "text-zinc-900 dark:text-white"}`}>
                                    {plan.price}
                                </p>
                                <ul className="space-y-3 flex-1 mb-6">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm">
                                            <Check size={13} className={plan.highlight ? "text-amber-400" : product.textColor} />
                                            <span className={plan.highlight ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"}>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/contact"
                                    className={`w-full text-center py-2.5 rounded-xl text-sm font-bold transition-colors ${plan.highlight
                                            ? "bg-amber-400 hover:bg-amber-300 text-zinc-950"
                                            : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                                        }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="relative rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 overflow-hidden p-10 text-center">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                    <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                        Ready to get started?
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">
                        See {product.label} in Action
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-500 mb-6 max-w-sm mx-auto text-sm leading-relaxed">
                        Book a free demo and we'll walk you through everything — no commitment required.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-colors"
                    >
                        Book a Free Demo <ArrowRight size={15} />
                    </Link>
                </section>

                {/* ── Other Products ── */}
                <section>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-6">
                        Other products
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {related.map((p) => {
                            const RelIcon = p.icon
                            return (
                                <Link
                                    key={p.slug}
                                    href={`/products/${p.slug}`}
                                    className="group flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-amber-400/40 dark:hover:border-amber-500/20 transition-all"
                                >
                                    <div className={`w-9 h-9 rounded-lg ${p.bgColor} ${p.borderColor} border flex items-center justify-center shrink-0`}>
                                        <RelIcon size={16} className={p.textColor} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                                            {p.label}
                                        </p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600 leading-snug">{p.tagline}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </section>

                {/* ── Back ── */}
                <div>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:border-amber-400/40 hover:text-amber-500 dark:hover:text-amber-400 transition-all group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to all products
                    </Link>
                </div>

            </div>
        </div>
    )
}