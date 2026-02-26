import { Button } from "@/components/ui/button"
import { serviceService } from "@/server/services"
import {
    ArrowRight,
    Blocks,
    CheckCircle,
    ChevronRight,
    Code2,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SERVICE_ICONS } from "@/lib/helpers/service-icons"

export async function generateStaticParams() {
    const all = await serviceService.getAll({ visible: true })
    return all.map((s) => ({ slug: String(s.slug) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const service = await serviceService.getBySlug(slug)
    if (!service) return { title: "Service Not Found" }
    return { title: service.title, description: service.description }
}

export default async function ServiceSlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const [service, allServices] = await Promise.all([
        serviceService.getBySlug(slug),
        serviceService.getAll({ visible: true }),
    ])

    if (!service) notFound()

    const Icon = SERVICE_ICONS[service.icon] ?? Code2
    const isFeatured = service.featured

    const relatedServices = allServices
        .filter((s) => s.id !== service.id && s.category === service.category)
        .slice(0, 3)

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">

            <section className={`relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden ${isFeatured ? "bg-zinc-900" : "bg-zinc-50 dark:bg-zinc-950"}`}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-${isFeatured ? "zinc-900" : "white dark:to-zinc-950"}`} />

                {isFeatured && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-400/10 rounded-full blur-[80px] pointer-events-none" />
                )}

                <div className="container relative mx-auto px-6 md:px-12">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-8">
                        <Link href="/" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/services" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Services</Link>
                        <span>/</span>
                        <span className={isFeatured ? "text-amber-400" : "text-zinc-600 dark:text-zinc-300"}>{service.title}</span>
                    </div>

                    <div className="max-w-3xl">
                        {isFeatured && service.badge && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 text-xs font-semibold mb-6">
                                <Blocks size={12} />
                                {service.badge}
                            </div>
                        )}

                        <p className={`text-xs font-semibold tracking-[0.2em] uppercase mb-4 ${isFeatured ? "text-amber-400" : "text-amber-500 dark:text-amber-400"}`}>
                            Service {service.number} — {service.category}
                        </p>

                        <h1 className={`text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6 ${isFeatured ? "text-white" : "text-zinc-900 dark:text-white"}`}>
                            {service.title}
                        </h1>

                        <p className={`text-xl font-light italic mb-6 ${isFeatured ? "text-amber-300/80" : "text-zinc-500 dark:text-zinc-300"}`}>
                            "{service.tagline}"
                        </p>

                        <p className={`text-base leading-relaxed mb-10 max-w-2xl ${isFeatured ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                            {service.longDescription ?? service.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/contact">
                                <Button className="h-12 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 group">
                                    Get Started
                                    <ArrowRight size={15} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/services">
                                <Button
                                    variant="outline"
                                    className={`h-12 px-8 rounded-2xl ${isFeatured
                                        ? "border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
                                        : "border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400"
                                        }`}
                                >
                                    All Services
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features + Stack */}
            <section className="py-20 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Features */}
                        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-3xl p-8 md:p-10">
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-6">
                                What's Included
                            </p>
                            <ul className="flex flex-col gap-4">
                                {(service.features ?? []).map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <CheckCircle size={17} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                                        <span className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Stack */}
                        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-3xl p-8 md:p-10">
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-6">
                                Tools & Technologies
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {(service.stack ?? []).map((tool) => (
                                    <span
                                        key={tool}
                                        className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 text-sm hover:border-amber-400/40 hover:text-amber-500 dark:hover:text-amber-400 transition-all cursor-default"
                                    >
                                        {tool}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-8 p-5 rounded-2xl bg-amber-50 dark:bg-amber-400/5 border border-amber-200 dark:border-amber-400/20">
                                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                                    Need a specific tool or stack?
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-3">
                                    We adapt to your existing tech stack — just let us know.
                                </p>
                                <Link href="/contact" className="text-xs font-bold text-amber-500 dark:text-amber-400 hover:text-amber-600 flex items-center gap-1">
                                    Tell us your requirements <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Services */}
            {relatedServices.length > 0 && (
                <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                                Related {service.category} Services
                            </p>
                            <Link href="/services" className="text-xs font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-600 flex items-center gap-1">
                                View all <ArrowRight size={12} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {relatedServices.map((related) => {
                                const RelatedIcon = SERVICE_ICONS[related.icon] ?? Code2
                                return (
                                    <Link
                                        key={related.id}
                                        href={`/services/${service.slug}`}
                                        className="group flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-amber-400/40 dark:hover:border-amber-500/20 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-amber-50 dark:group-hover:bg-amber-400/10 transition-colors">
                                            <RelatedIcon size={17} className="text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">{related.title}</p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-600 truncate">{related.tagline}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700 shrink-0 ml-auto group-hover:text-amber-400 transition-colors" />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-500 mb-8 max-w-md mx-auto">
                        Tell us about your project and we'll match you with the right talent within 48 hours.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" className="h-14 px-10 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-lg shadow-amber-500/20">
                            Get a Free Consultation
                            <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}