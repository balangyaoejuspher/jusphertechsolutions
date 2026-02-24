import Link from "next/link"
import { ArrowRight, Globe, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROLE_DEVELOPER, ROLE_DESIGNER, ROLE_VA, ROLE_PROJECT_MANAGER, ROLE_DATA_ANALYST, ROLES } from "@/lib/helpers/constants"

const FEATURED_ROLES = [
    { ...ROLE_DEVELOPER, color: "text-blue-500    dark:text-blue-400" },
    { ...ROLE_DESIGNER, color: "text-violet-500  dark:text-violet-400" },
    { ...ROLE_VA, color: "text-emerald-500 dark:text-emerald-400" },
    { ...ROLE_PROJECT_MANAGER, color: "text-amber-500   dark:text-amber-400" },
    { ...ROLE_DATA_ANALYST, color: "text-rose-500    dark:text-rose-400" },
]

const remainingCount = ROLES.filter((r) => r.value !== "all").length - FEATURED_ROLES.length

const perks = [
    { icon: Globe, label: "Work with global clients" },
    { icon: Star, label: "Competitive rates" },
    { icon: Zap, label: "Flexible & remote" },
]

export function JoinTeamSection() {
    return (
        <section className="relative bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

            {/* Glows */}
            <div className="absolute -top-32    -left-32   w-96  h-96  bg-amber-400/20  rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32  w-96  h-96  bg-amber-400/15  rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2    -left-20   w-72  h-72  bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/4    -right-20  w-72  h-72  bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4  left-1/3  w-64  h-64  bg-amber-300/10  rounded-full blur-[80px]  pointer-events-none" />

            <div className="relative container mx-auto px-6 md:px-12 py-20 md:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">Now Accepting Applications</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-[1.05] tracking-tight mb-5">
                            Are you a skilled<br />
                            <span className="text-amber-500 dark:text-amber-400">professional?</span>
                        </h2>

                        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed mb-8 max-w-md">
                            Join our vetted network and get matched with global clients who value your expertise. We handle the contracts, payments, and client relationships — you focus on the work.
                        </p>

                        {/* Perks */}
                        <div className="flex flex-col gap-3 mb-10">
                            {perks.map((perk) => (
                                <div key={perk.label} className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                                        <perk.icon size={13} className="text-amber-500 dark:text-amber-400" />
                                    </div>
                                    <span className="text-zinc-600 dark:text-zinc-300 text-sm font-medium">{perk.label}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/application-form?type=join">
                            <Button className="rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-13 px-8 gap-2 shadow-xl shadow-amber-500/20 text-base">
                                Apply to Join <ArrowRight size={16} />
                            </Button>
                        </Link>
                        <p className="text-zinc-400 dark:text-zinc-600 text-xs mt-3">Free to apply · We'll reach out within 48h</p>
                    </div>

                    {/* Right — Role cards */}
                    <div className="relative">
                        <div className="flex flex-col gap-3">
                            {FEATURED_ROLES.map((role, i) => (
                                <div
                                    key={role.value}
                                    className="flex items-center gap-4 px-5 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-amber-400/30 dark:hover:border-amber-400/20 hover:shadow-sm dark:hover:bg-zinc-800/80 transition-all duration-300 group"
                                    style={{ transform: `translateX(${i % 2 === 0 ? "0px" : "24px"})` }}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-amber-400/20 transition-colors">
                                        <role.icon size={15} className={role.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-zinc-900 dark:text-white text-sm font-semibold">{role.label}</p>
                                        <p className="text-zinc-400 dark:text-zinc-600 text-xs">Open for applications</p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                </div>
                            ))}
                        </div>

                        {/* Bottom tag */}
                        {remainingCount > 0 && (
                            <div className="mt-4 ml-6 inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl">
                                <span className="text-zinc-400 dark:text-zinc-500 text-xs">+{remainingCount} more roles available</span>
                                <ArrowRight size={11} className="text-zinc-400 dark:text-zinc-600" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}