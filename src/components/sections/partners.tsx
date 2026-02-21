import { Building2 } from "lucide-react"

const partners = [
    { name: "Acme Corp", industry: "Technology" },
    { name: "Globex", industry: "Finance" },
    { name: "Initech", industry: "Software" },
    { name: "Umbrella Co", industry: "Healthcare" },
    { name: "Hooli", industry: "AI & ML" },
    { name: "Pied Piper", industry: "SaaS" },
    { name: "Dunder Mifflin", industry: "Media" },
    { name: "Waystar", industry: "E-commerce" },
    { name: "Bluth Co", industry: "Real Estate" },
    { name: "Sterling Cooper", industry: "Marketing" },
]

export function Partners() {
    const doubled = [...partners, ...partners]

    return (
        <section className="py-16 bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 mb-10 text-center">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">
                    Trusted by companies worldwide
                </p>
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none"></div>

                <div className="flex gap-4 whitespace-nowrap animate-marquee hover:pause-animation">
                    {doubled.map((partner, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 shrink-0 px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl group hover:border-amber-300 dark:hover:border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/5 transition-all duration-300"
                        >
                            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-colors">
                                <Building2
                                    size={15}
                                    className="text-zinc-500 dark:text-zinc-500 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                                    {partner.name}
                                </p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600 whitespace-nowrap">
                                    {partner.industry}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}