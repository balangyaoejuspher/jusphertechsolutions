"use client"

import { Fragment } from "react"
import { Code2, Layers3, Zap } from "lucide-react"
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

const CATEGORY_STYLE: Record<string, { dot: string; label: string }> = {
    Language: { dot: "bg-sky-400", label: "text-sky-400" },
    Framework: { dot: "bg-emerald-400", label: "text-emerald-400" },
    Runtime: { dot: "bg-emerald-400", label: "text-emerald-400" },
    API: { dot: "bg-pink-400", label: "text-pink-400" },
    Blockchain: { dot: "bg-violet-400", label: "text-violet-400" },
    "Smart Contract": { dot: "bg-amber-400", label: "text-amber-400" },
}

const LEGEND = [
    { label: "Language / Runtime", color: "bg-sky-400", icon: Code2 },
    { label: "Framework / API", color: "bg-emerald-400", icon: Layers3 },
    { label: "Blockchain / Smart Contract", color: "bg-violet-400", icon: Zap },
]

export function Partners() {
    const row1 = [...techStack, ...techStack, ...techStack]
    const row2 = [...techStack].reverse()
    const row2tripled = [...row2, ...row2, ...row2]

    return (
        <section className="relative py-20 md:py-28 bg-zinc-950 overflow-hidden">
            <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none">
                <div className="w-[600px] h-[180px] bg-gradient-to-b from-amber-400/20 via-amber-400/5 to-transparent blur-2xl" />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-amber-400/80 blur-sm" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 flex justify-center pointer-events-none">
                <div className="w-[600px] h-[180px] bg-gradient-to-t from-amber-400/20 via-amber-400/5 to-transparent blur-2xl" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-amber-400/80 blur-sm" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

            <div className="relative container mx-auto px-6 md:px-12 mb-12 text-center">
                <p className="text-[10px] font-bold text-amber-400/60 uppercase tracking-[0.3em] mb-4">
                    Technology Expertise
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
                    Built on the Stack
                    <span className="text-amber-400"> You Trust</span>
                </h2>

                {/* Legend pills */}
                <div className="flex items-center justify-center flex-wrap gap-2">
                    {LEGEND.map(({ label, color, icon: Icon }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                        >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color}`} />
                            <Icon size={10} className="text-zinc-500" />
                            <span className="text-[10px] text-zinc-400 whitespace-nowrap font-medium">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative mb-3">
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
                <div className="flex gap-3 whitespace-nowrap marquee-track">
                    {row1.map((tech, i) => (
                        <TechPill key={i} tech={tech} />
                    ))}
                </div>
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
                <div className="flex gap-3 whitespace-nowrap marquee-track-reverse">
                    {row2tripled.map((tech, i) => (
                        <TechPill key={i} tech={tech} variant="outline" />
                    ))}
                </div>
            </div>

            <div className="relative container mx-auto px-6 md:px-12 mt-16 mb-12">
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/5" />
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] whitespace-nowrap">
                        Recognized by Industry Leaders
                    </p>
                    <div className="flex-1 h-px bg-white/5" />
                </div>
            </div>

            <div className="relative container mx-auto px-6 md:px-12">
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                    {badges.map((badge) => (
                        <div
                            key={badge.src}
                            className="relative h-14 md:h-16 w-28 md:w-36 group"
                        >
                            <Image
                                src={badge.src}
                                alt={badge.alt}
                                fill
                                className="object-contain opacity-30 group-hover:opacity-70 transition-all duration-500 filter grayscale group-hover:grayscale-0"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-33.333%); }
                }
                @keyframes marquee-reverse {
                    from { transform: translateX(-33.333%); }
                    to   { transform: translateX(0); }
                }
                .marquee-track {
                    animation: marquee 35s linear infinite;
                }
                .marquee-track-reverse {
                    animation: marquee-reverse 40s linear infinite;
                }
                .marquee-track:hover,
                .marquee-track-reverse:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    )
}

function TechPill({
    tech,
    variant = "filled",
}: {
    tech: typeof techStack[number]
    variant?: "filled" | "outline"
}) {
    const cat = CATEGORY_STYLE[tech.category] ?? { dot: "bg-zinc-500", label: "text-zinc-400" }

    return (
        <div
            className={`
                flex items-center gap-2.5 shrink-0 px-4 py-2.5 rounded-xl cursor-default
                group hover:scale-105 transition-all duration-200
                ${variant === "filled"
                    ? "bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15"
                    : "bg-transparent border border-white/5 hover:bg-white/5 hover:border-white/10"
                }
            `}
        >
            {/* Icon badge */}
            <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[9px] font-bold transition-transform group-hover:scale-110"
                style={{
                    backgroundColor: tech.color + "20",
                    border: `1px solid ${tech.color}30`,
                }}
            >
                <span style={{ color: tech.color }}>{tech.icon}</span>
            </div>

            {/* Name + category */}
            <div className="leading-tight">
                <p className="text-xs font-semibold text-zinc-200 whitespace-nowrap">{tech.name}</p>
                <p className={`text-[10px] font-medium whitespace-nowrap ${cat.label}`}>{tech.category}</p>
            </div>

            {/* Category dot */}
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cat.dot} opacity-60`} />
        </div>
    )
}