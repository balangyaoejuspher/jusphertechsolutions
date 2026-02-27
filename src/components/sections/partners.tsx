"use client"

import { Fragment } from "react"
import { Code2, Layers3 } from "lucide-react"
import Image from "next/image"

const techStack = [
    { name: "TypeScript", category: "Language", color: "#3178C6", icon: "TS" },
    { name: "Python", category: "Language", color: "#3776AB", icon: "Py" },
    { name: "Go", category: "Language", color: "#00ADD8", icon: "Go" },
    { name: "Rust", category: "Language", color: "#CE422B", icon: "Rs" },
    { name: "Java", category: "Language", color: "#ED8B00", icon: "Ja" },
    { name: "Swift", category: "Language", color: "#F05138", icon: "Sw" },
    { name: "React", category: "Framework", color: "#61DAFB", icon: "Re" },
    { name: "Node.js", category: "Runtime", color: "#339933", icon: "No" },
    { name: "Next.js", category: "Framework", color: "#ffffff", icon: "Nx" },
    { name: "GraphQL", category: "API", color: "#E10098", icon: "GQ" },
    { name: "Ethereum", category: "Blockchain", color: "#627EEA", icon: "Eth" },
    { name: "Solana", category: "Blockchain", color: "#9945FF", icon: "Sol" },
    { name: "Polygon", category: "Blockchain", color: "#8247E5", icon: "Pol" },
    { name: "BNB Chain", category: "Blockchain", color: "#F3BA2F", icon: "BNB" },
    { name: "Avalanche", category: "Blockchain", color: "#E84142", icon: "Avx" },
    { name: "Solidity", category: "Smart Contract", color: "#636363", icon: "Sol" },
]

const badges = [
    { src: "/globaloutsourcing.png", alt: "Global Outsourcing" },
    { src: "/great-place-to-work.b7542bd2.png", alt: "Great Place to Work" },
    { src: "/Best-Results-Winter-2026.png", alt: "Best Results Winter 2026" },
    { src: "/Grid-Leader-MM-Winter-2026.png", alt: "Grid Leader Mid Market 2026" },
    { src: "/Grid-Leader-Winter-2026.png", alt: "Grid Leader Winter 2026" },
    { src: "/Regional-Leader-Asia-Winter-2026.png", alt: "Regional Leader Asia 2026" },
]

const categoryColor: Record<string, string> = {
    Language: "text-sky-400",
    Framework: "text-emerald-400",
    Runtime: "text-emerald-400",
    API: "text-pink-400",
    Blockchain: "text-violet-400",
    "Smart Contract": "text-amber-400",
}

const legends = [
    { label: "Language / Runtime", icon: <Code2 size={11} />, color: "text-sky-400" },
    { label: "Framework / API", icon: <Layers3 size={11} />, color: "text-emerald-400" },
    { label: "Blockchain / Smart Contract", icon: <span className="text-[10px] font-bold">&#x2B21;</span>, color: "text-violet-400" },
]

export function Partners() {
    const tripled = [...techStack, ...techStack, ...techStack]

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-white/5 overflow-hidden">

            {/* Header */}
            <div className="container mx-auto px-6 md:px-12 mb-10 text-center">
                <p className="text-[10px] md:text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.25em] mb-6">
                    Our technology expertise
                </p>
                <div className="flex items-center justify-center flex-wrap gap-2 md:gap-3">
                    {legends.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5"
                        >
                            <span className={`${item.color} flex items-center`}>{item.icon}</span>
                            <span className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Marquee */}
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-3 md:gap-4 whitespace-nowrap marquee-track">
                    {tripled.map((tech, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2.5 md:gap-3 shrink-0 px-3.5 md:px-5 py-2.5 md:py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl md:rounded-2xl group hover:border-amber-300 dark:hover:border-amber-500/30 hover:bg-amber-50/60 dark:hover:bg-amber-500/5 transition-all duration-300 cursor-default"
                        >
                            <div
                                className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 text-[9px] md:text-[10px] font-bold transition-transform group-hover:scale-110"
                                style={{
                                    backgroundColor: tech.color + "18",
                                    border: `1px solid ${tech.color}35`,
                                }}
                            >
                                <span style={{ color: tech.color }}>{tech.icon}</span>
                            </div>
                            <div>
                                <p className="text-xs md:text-sm font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap leading-tight">
                                    {tech.name}
                                </p>
                                <p className={`text-[10px] md:text-xs whitespace-nowrap font-medium leading-tight ${categoryColor[tech.category] ?? "text-zinc-400"}`}>
                                    {tech.category}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Badges */}
            <div className="container mx-auto px-6 md:px-12 mt-14 md:mt-16">
                <p className="text-[10px] md:text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] text-center mb-8">
                    Recognized by
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4 items-center justify-items-center">
                    {badges.map((badge, i) => (
                        <Fragment key={badge.src}>
                            <div className="relative h-16 md:h-20 w-full max-w-[140px] md:max-w-[160px]">
                                <Image
                                    src={badge.src}
                                    alt={badge.alt}
                                    fill
                                    className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                                />
                            </div>
                            {i < badges.length - 1 && (
                                <div className="hidden lg:block w-px h-10 bg-zinc-200 dark:bg-zinc-800" />
                            )}
                        </Fragment>
                    ))}
                </div>
            </div>

        </section>
    )
}