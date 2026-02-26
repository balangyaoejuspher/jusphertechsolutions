"use client"

import { Button } from "@/components/ui/button"
import { publicFetch } from "@/lib/api/public-fetcher"
import { ROLES } from "@/lib/helpers/constants"
import {
    TALENT_STATUSES,
    TALENT_SORT_OPTIONS,
    TALENT_MODE_CONFIG,
    TEAM_SCALES,
    PROJECT_TYPE_VALUES,
    PROJECT_TYPE_COLOR_VARIANTS,
    PROJECT_SUGGESTIONS,
    STACK_GROUPS,
    GUIDED_QUESTIONS,
    type TalentSortOption,
    type TalentMode,
    PLACEHOLDER_TALENT,
    STATUS_DISPLAY,
} from "@/lib/helpers/marketing-constants"
import { cn } from "@/lib/utils"
import { Talent } from "@/types"
import {
    ArrowRight, ArrowUpRight, Blocks, Briefcase, Building2,
    CheckCircle, ChevronLeft, ChevronRight, Code2, Cpu,
    Globe, GraduationCap, HelpCircle, MessageCircle,
    Minus, Plus, ShoppingCart, SlidersHorizontal,
    Smartphone, Sparkles, Star, Users, X, Zap,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

const PAGE_SIZE = 9

const PROJECT_TYPE_ICONS: Record<string, React.ElementType> = {
    "web-app": Globe,
    "mobile-app": Smartphone,
    "ecommerce": ShoppingCart,
    "saas": Building2,
    "blockchain": Blocks,
    "ai": Cpu,
    "enterprise": Building2,
    "edu": GraduationCap,
    "custom": Briefcase,
}

const TALENT_MODE_ICONS: Record<keyof typeof TALENT_MODE_CONFIG, React.ElementType> = {
    browse: Users,
    guided: HelpCircle,
    team: Building2,
}

function TalentCardSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-16 h-4 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
            </div>
            <div className="w-32 h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-2" />
            <div className="w-24 h-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-1" />
            <div className="w-16 h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-4" />
            <div className="flex gap-1.5 mb-2">
                {[60, 80, 50].map((w, i) => <div key={i} className="h-5 rounded-lg bg-zinc-100 dark:bg-zinc-800" style={{ width: w }} />)}
            </div>
        </div>
    )
}

function TalentGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <TalentCardSkeleton key={i} />)}
        </div>
    )
}

function SidebarSkeleton() {
    return (
        <div className="hidden lg:flex flex-col w-52 shrink-0 gap-6 sticky top-24 self-start animate-pulse">
            {[5, 3, 3].map((count, gi) => (
                <div key={gi}>
                    <div className="w-16 h-3 rounded bg-zinc-200 dark:bg-zinc-800 mb-3" />
                    <div className="flex flex-col gap-1.5">
                        {Array.from({ length: count }).map((_, i) => (
                            <div key={i} className="w-full h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

function TeamBuilder() {
    const [teamSize, setTeamSize] = useState(3)
    const [scale, setScale] = useState("small")
    const [projectType, setProjectType] = useState<string | null>(null)
    const [selectedStack, setSelectedStack] = useState<string[]>([])
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [expandedStack, setExpandedStack] = useState<string | null>("Frontend")

    const currentScale = TEAM_SCALES.find((s) => s.value === scale)!
    const suggestions = projectType ? PROJECT_SUGGESTIONS[projectType] : null

    const handleProjectChange = (value: string | null) => {
        setProjectType(value)
        if (value && PROJECT_SUGGESTIONS[value]) {
            setSelectedRoles(PROJECT_SUGGESTIONS[value].roles)
            setSelectedStack(PROJECT_SUGGESTIONS[value].stack)
        } else {
            setSelectedRoles([])
            setSelectedStack([])
        }
    }

    const handleScaleChange = (s: typeof TEAM_SCALES[number]) => {
        setScale(s.value)
        setTeamSize(Math.max(s.min, Math.min(s.max, teamSize)))
    }

    const sliderMin = currentScale.min
    const sliderMax = currentScale.max
    const sliderPct = ((teamSize - sliderMin) / Math.max(sliderMax - sliderMin, 1)) * 100

    const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        setTeamSize(Math.round(sliderMin + pct * (sliderMax - sliderMin)))
    }

    const toggleStack = (item: string) =>
        setSelectedStack((p) => p.includes(item) ? p.filter((x) => x !== item) : [...p, item])
    const toggleRole = (role: string) =>
        setSelectedRoles((p) => p.includes(role) ? p.filter((r) => r !== role) : [...p, role])

    const hasConfig = !!projectType || selectedRoles.length > 0 || selectedStack.length > 0

    const contactParams = new URLSearchParams({
        team: String(teamSize),
        scale,
        ...(projectType ? { project: projectType } : {}),
        ...(selectedRoles.length ? { roles: selectedRoles.join(",") } : {}),
        ...(selectedStack.length ? { stack: selectedStack.join(",") } : {}),
    }).toString()

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="px-5 md:px-8 pt-5 md:pt-8 pb-4 border-b border-zinc-100 dark:border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                    <Building2 size={16} className="text-amber-500 dark:text-amber-400" />
                </div>
                <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white leading-tight">Team Builder</h3>
                    <p className="text-zinc-400 dark:text-zinc-500 text-xs md:text-sm">Design your ideal team, step by step</p>
                </div>
            </div>

            <div className="p-5 md:p-8 flex flex-col gap-6 md:gap-8">

                {/* STEP 1 */}
                <div>
                    <StepLabel n={1} label="What are you building?" />
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                        {PROJECT_TYPE_VALUES.map((pt) => {
                            const active = projectType === pt.value
                            const Icon = PROJECT_TYPE_ICONS[pt.value]
                            return (
                                <button key={pt.value} onClick={() => handleProjectChange(active ? null : pt.value)}
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border text-center transition-all",
                                        active ? "bg-amber-400/10 border-amber-400/40 shadow-sm" : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"
                                    )}>
                                    <div className={cn("w-7 h-7 rounded-xl border flex items-center justify-center",
                                        active ? PROJECT_TYPE_COLOR_VARIANTS[pt.color] : "bg-white dark:bg-zinc-700 border-zinc-200 dark:border-white/10")}>
                                        <Icon size={13} className={active ? "" : "text-zinc-400 dark:text-zinc-500"} />
                                    </div>
                                    <span className={cn("text-[10px] font-semibold leading-tight", active ? "text-amber-600 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-400")}>
                                        {pt.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* STEP 2 */}
                <div>
                    <StepLabel n={2} label="What's your team scale?" />
                    {/* Scrollable row on mobile */}
                    <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x md:grid md:grid-cols-5 md:overflow-visible md:pb-0 mb-4">
                        {TEAM_SCALES.map((s) => (
                            <button key={s.value} onClick={() => handleScaleChange(s)}
                                className={cn(
                                    "flex flex-col items-center gap-1 py-2.5 px-3 rounded-2xl border text-center transition-all shrink-0 snap-start min-w-[68px] md:min-w-0",
                                    scale === s.value ? "bg-amber-400/10 border-amber-400/40" : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"
                                )}>
                                <span className="text-xl leading-none">{s.emoji}</span>
                                <span className={cn("text-[11px] font-bold mt-0.5", scale === s.value ? "text-amber-600 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-400")}>{s.label}</span>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-600">{s.range}</span>
                            </button>
                        ))}
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Headcount</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5 hidden sm:block">{currentScale.desc}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setTeamSize((n) => Math.max(sliderMin, n - 1))} disabled={teamSize <= sliderMin}
                                    className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:border-amber-400/60 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                    <Minus size={13} />
                                </button>
                                <div className="text-center min-w-[48px]">
                                    <span className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tabular-nums">{teamSize}</span>
                                    <p className="text-[10px] text-zinc-400 dark:text-zinc-600">{teamSize === 1 ? "person" : "people"}</p>
                                </div>
                                <button onClick={() => setTeamSize((n) => Math.min(sliderMax, n + 1))} disabled={teamSize >= sliderMax}
                                    className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:border-amber-400/60 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                    <Plus size={13} />
                                </button>
                            </div>
                        </div>
                        <div className="relative h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full cursor-pointer select-none" onClick={handleSliderClick}>
                            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-100 pointer-events-none" style={{ width: `${sliderPct}%` }} />
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-amber-400 shadow-lg shadow-amber-400/30 transition-all duration-100 pointer-events-none z-10" style={{ left: `${sliderPct}%` }}>
                                <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-amber-400" />
                            </div>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">{sliderMin}</span>
                            <span className="text-xs font-bold text-amber-500 dark:text-amber-400">{currentScale.emoji} {currentScale.label} · {teamSize}</span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">{sliderMax === 50 ? "50+" : sliderMax}</span>
                        </div>
                    </div>
                </div>

                {/* STEP 3 */}
                <div>
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-1.5">
                        <StepLabel n={3} label="What roles do you need?" inline />
                        {suggestions && suggestions.roles.length > 0 && <SuggestedBadge />}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {ROLES.filter((r) => r.value !== "all").map((role) => {
                            const active = selectedRoles.includes(role.value)
                            const isSuggested = suggestions?.roles.includes(role.value)
                            return (
                                <button key={role.value} onClick={() => toggleRole(role.value)}
                                    className={cn(
                                        "flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all",
                                        active
                                            ? "bg-amber-400/10 border-amber-400/40 text-amber-600 dark:text-amber-400"
                                            : isSuggested
                                                ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20 text-amber-600/60 dark:text-amber-400/60 hover:border-amber-400/40"
                                                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300"
                                    )}>
                                    {active && <CheckCircle size={10} />}
                                    {isSuggested && !active && <span className="text-amber-400 text-[10px]">✦</span>}
                                    {role.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* STEP 4 */}
                <div>
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-1.5">
                        <StepLabel n={4} label="Tech stack" optional inline />
                        {suggestions && suggestions.stack.length > 0 && <SuggestedBadge />}
                    </div>
                    <div className="border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                        {STACK_GROUPS.map((group, gi) => {
                            const groupSelected = selectedStack.filter((s) => (group.items as readonly string[]).includes(s)).length
                            const groupSuggested = suggestions?.stack.filter((s) => (group.items as readonly string[]).includes(s)).length ?? 0
                            const isOpen = expandedStack === group.group
                            return (
                                <div key={group.group} className={cn(gi > 0 && "border-t border-zinc-100 dark:border-white/5")}>
                                    <button onClick={() => setExpandedStack(isOpen ? null : group.group)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Code2 size={13} className="text-zinc-400" />
                                            {group.group}
                                            {groupSelected > 0 && <span className="px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">{groupSelected}</span>}
                                            {groupSuggested > 0 && groupSelected === 0 && <span className="px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-400/10 text-amber-500/70 dark:text-amber-400/60 text-[10px] font-bold">✦ {groupSuggested}</span>}
                                        </div>
                                        <ChevronRight size={14} className={cn("text-zinc-400 transition-transform duration-200", isOpen && "rotate-90")} />
                                    </button>
                                    {isOpen && (
                                        <div className="px-4 pb-4 pt-1 flex flex-wrap gap-1.5 bg-zinc-50/50 dark:bg-zinc-800/30">
                                            {group.items.map((item) => {
                                                const active = selectedStack.includes(item)
                                                const isSuggested = suggestions?.stack.includes(item)
                                                return (
                                                    <button key={item} onClick={() => toggleStack(item)}
                                                        className={cn(
                                                            "px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all",
                                                            active
                                                                ? "bg-amber-400/10 border-amber-400/40 text-amber-600 dark:text-amber-400"
                                                                : isSuggested
                                                                    ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20 text-amber-600/60 dark:text-amber-400/60 hover:border-amber-400/40"
                                                                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300"
                                                        )}>
                                                        {isSuggested && !active && <span className="mr-1 text-amber-400">✦</span>}
                                                        {item}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Summary */}
                <div className={cn("rounded-2xl border p-4 transition-all duration-300",
                    hasConfig ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20" : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10")}>
                    <div className="flex items-start gap-3">
                        <Sparkles size={14} className={cn("shrink-0 mt-0.5", hasConfig ? "text-amber-500 dark:text-amber-400" : "text-zinc-400")} />
                        <div>
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                                {hasConfig ? "Your team brief" : "Start configuring above to see your summary"}
                            </p>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400 space-y-1">
                                {projectType && <p>🏗️ <span className="font-semibold text-zinc-700 dark:text-zinc-300">{PROJECT_TYPE_VALUES.find((p) => p.value === projectType)?.label}</span></p>}
                                <p>{currentScale.emoji} <span className="font-semibold text-amber-600 dark:text-amber-400">{teamSize} {teamSize === 1 ? "person" : "people"}</span> ({currentScale.label})</p>
                                {selectedRoles.length > 0 && <p>👥 <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedRoles.join(", ")}</span></p>}
                                {selectedStack.length > 0 && <p>⚙️ <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedStack.slice(0, 3).join(", ")}{selectedStack.length > 3 ? ` +${selectedStack.length - 3}` : ""}</span></p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <Link href={`/contact?${contactParams}`}>
                    <Button className="w-full h-12 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 shadow-lg shadow-amber-500/20">
                        <MessageCircle size={16} /> Get a Team Proposal
                    </Button>
                </Link>
                <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 -mt-4">Free consultation · No commitment · 24h response</p>
            </div>
        </div>
    )
}

// ─── Guided Experience ────────────────────────────────────────────────────────

function GuidedExperience({ onDone }: { onDone: (roles: string[]) => void }) {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const current = GUIDED_QUESTIONS[step]
    const isLast = step === GUIDED_QUESTIONS.length - 1

    const handleAnswer = (value: string) => {
        const next = { ...answers, [current.id]: value }
        setAnswers(next)
        if (isLast) {
            const goal = GUIDED_QUESTIONS[0].options.find((o) => o.value === next["goal"])
            onDone([...(goal?.roles ?? [])])
        } else {
            setStep((s) => s + 1)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 md:p-8">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                    <HelpCircle size={16} className="text-amber-500 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm md:text-base">Find Your Match</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                            <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${(step / GUIDED_QUESTIONS.length) * 100}%` }} />
                        </div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-600 shrink-0">{step + 1}/{GUIDED_QUESTIONS.length}</span>
                    </div>
                </div>
            </div>
            <h4 className="text-base md:text-lg font-bold text-zinc-900 dark:text-white mb-4">{current.question}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {current.options.map((opt) => (
                    <button key={opt.value} onClick={() => handleAnswer(opt.value)}
                        className="flex items-center gap-3 p-3 md:p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-400/5 text-left transition-all group">
                        <span className="text-xl shrink-0">{opt.icon}</span>
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">{opt.label}</span>
                    </button>
                ))}
            </div>
            {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="mt-4 text-xs text-zinc-400 hover:text-zinc-600 transition-colors">← Back</button>}
        </div>
    )
}

// ─── Banners ──────────────────────────────────────────────────────────────────

function NotSureBanner() {
    return (
        <div className="relative bg-zinc-900 rounded-3xl p-5 md:p-8 overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-amber-400" />
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Free Consultation</span>
                </div>
                <h3 className="text-white font-bold text-lg md:text-xl mb-1.5">Still not sure who you need?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    Tell us about your project. We'll recommend the right talent — for free.
                </p>
                <Link href="/contact?type=consultation">
                    <Button className="rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-10 gap-2 text-sm">
                        Talk to Our Team <ArrowRight size={14} />
                    </Button>
                </Link>
            </div>
        </div>
    )
}

function JoinTeamBanner() {
    return (
        <div className="border-t border-zinc-200 dark:border-white/5 py-8 md:py-10">
            <div className="container mx-auto px-4 md:px-12">
                <div className="relative bg-zinc-900 dark:bg-zinc-800 rounded-3xl px-5 py-6 md:px-12 md:py-8 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="relative text-center md:text-left">
                        <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1.5">We're Hiring</p>
                        <h3 className="text-white font-bold text-lg md:text-2xl mb-1">Are you a skilled professional?</h3>
                        <p className="text-zinc-400 text-sm max-w-md">Join our growing network of vetted developers, VAs, designers, and more.</p>
                    </div>
                    <Link href="/application-form?type=join" className="relative w-full md:w-auto shrink-0">
                        <Button className="w-full md:w-auto rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 px-6 gap-2 shadow-lg shadow-amber-500/20 whitespace-nowrap">
                            Apply to Join <ArrowRight size={15} />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

// ─── Talent Card ──────────────────────────────────────────────────────────────

function TalentCard({ talent, onClick }: { talent: Talent; onClick: () => void }) {
    return (
        <div onClick={onClick}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4 md:p-5 cursor-pointer hover:border-amber-400/40 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-zinc-100 dark:hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br ${talent.gradient} flex items-center justify-center text-white font-bold text-base md:text-lg shadow-md shrink-0`}>
                    {talent.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", talent.status === "available" ? "bg-green-500" : "bg-yellow-500")} />
                    <span className="text-xs text-zinc-400 dark:text-zinc-600 capitalize">{talent.status}</span>
                </div>
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm mb-0.5 truncate">{talent.name}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1 truncate">{talent.title}</p>
            <p className="text-amber-500 dark:text-amber-400 text-sm font-bold mb-2.5">${talent.hourlyRate}/hr</p>
            <div className="flex items-center gap-1.5 mb-3">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{talent.rating}</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-600">· {talent.projectsCompleted} projects</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
                {(talent.skills ?? []).slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-500 text-[11px]">{skill}</span>
                ))}
                {(talent.skills ?? []).length > 3 && (
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-600 text-[11px]">+{(talent.skills ?? []).length - 3}</span>
                )}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400 dark:text-zinc-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                View Profile <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
        </div>
    )
}

function StepLabel({ n, label, optional, inline }: { n: number; label: string; optional?: boolean; inline?: boolean }) {
    return (
        <div className={cn("flex items-center gap-2", inline ? "" : "mb-3")}>
            <span className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-zinc-950 text-[10px] font-black shrink-0">{n}</span>
            <p className="text-sm font-bold text-zinc-900 dark:text-white">
                {label}
                {optional && <span className="ml-1.5 font-normal text-zinc-400 dark:text-zinc-600">(optional)</span>}
            </p>
        </div>
    )
}

function SuggestedBadge() {
    return <span className="text-[10px] font-semibold text-amber-500 dark:text-amber-400 uppercase tracking-widest">✦ Suggested</span>
}

export default function TalentClient() {
    const [mode, setMode] = useState<"browse" | "guided" | "team">("browse")
    const [selectedRole, setSelectedRole] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [sortBy, setSortBy] = useState<TalentSortOption>("rating")
    const [showFilters, setShowFilters] = useState(false)
    const [page, setPage] = useState(1)
    const [guidedDone, setGuidedDone] = useState(false)
    const [loading, setLoading] = useState(false)
    const [talentList, setTalentList] = useState<Talent[]>(PLACEHOLDER_TALENT as Talent[])
    const [talentLoading, setTalentLoading] = useState(true)
    const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)

    useEffect(() => {
        publicFetch.get<Talent[]>("/talent")
            .then(setTalentList)
            .catch((err) => console.error("Failed to load talent:", err))
            .finally(() => setTalentLoading(false))
    }, [])

    useEffect(() => {
        const locked = !!selectedTalent || showFilters
        document.body.style.overflow = locked ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [selectedTalent, showFilters])

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "Escape") { setSelectedTalent(null); setShowFilters(false) }
        }
        window.addEventListener("keydown", h)
        return () => window.removeEventListener("keydown", h)
    }, [])

    const filtered = useMemo(() =>
        talentList
            .filter((t) => t.isVisible)
            .filter((t) => selectedRole === "all" || t.role === selectedRole)
            .filter((t) => selectedStatus === "all" || t.status === selectedStatus)
            .sort((a, b) => {
                if (sortBy === "rating") return parseFloat(b.rating ?? "0") - parseFloat(a.rating ?? "0")
                if (sortBy === "rate_asc") return parseFloat(a.hourlyRate ?? "0") - parseFloat(b.hourlyRate ?? "0")
                if (sortBy === "rate_desc") return parseFloat(b.hourlyRate ?? "0") - parseFloat(a.hourlyRate ?? "0")
                return 0
            }),
        [talentList, selectedRole, selectedStatus, sortBy]
    )

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleFilterChange = (fn: () => void) => {
        setLoading(true); fn(); setPage(1)
        setTimeout(() => setLoading(false), 350)
    }
    const resetFilters = () => handleFilterChange(() => { setSelectedRole("all"); setSelectedStatus("all"); setSortBy("rating") })
    const isFiltered = selectedRole !== "all" || selectedStatus !== "all" || sortBy !== "rating"
    const activeFilterCount = [selectedRole !== "all", selectedStatus !== "all", sortBy !== "rating"].filter(Boolean).length

    const handleGuidedDone = (suggestedRoles: string[]) => {
        if (suggestedRoles.length > 0) setSelectedRole(suggestedRoles[0])
        setGuidedDone(true)
        setMode("browse")
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">

            {/* ── Hero ── */}
            <section className="relative py-10 md:py-20 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />
                <div className="relative container mx-auto px-4 md:px-12 text-center">
                    <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">— Our Talent</p>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white leading-[0.95] tracking-tight mb-3 md:mb-4">
                        Find Your Perfect<br />
                        <span className="text-zinc-400 dark:text-zinc-500">Team Member</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-lg max-w-xs sm:max-w-sm md:max-w-lg mx-auto mb-6 md:mb-10">
                        Browse vetted professionals, get guided to the right match, or design your entire team.
                    </p>

                    {/* Mode switcher */}
                    <div className="inline-flex items-center gap-0.5 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm">
                        {(Object.entries(TALENT_MODE_CONFIG) as [keyof typeof TALENT_MODE_CONFIG, typeof TALENT_MODE_CONFIG[keyof typeof TALENT_MODE_CONFIG]][]).map(([key, cfg]) => {
                            const Icon = TALENT_MODE_ICONS[key]
                            return (
                                <button key={key} onClick={() => { setMode(key); setGuidedDone(false) }}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200",
                                        mode === key ? "bg-amber-400 text-zinc-950 shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5"
                                    )}>
                                    <Icon size={14} />
                                    {cfg.label}
                                </button>
                            )
                        })}
                    </div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2.5">{TALENT_MODE_CONFIG[mode].desc}</p>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-12 py-6 md:py-10">

                {/* ── TEAM MODE ── */}
                {mode === "team" && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 md:gap-8">
                        <div className="lg:col-span-3"><TeamBuilder /></div>
                        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-5">
                            <NotSureBanner />
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: "48h", desc: "Avg. matching" },
                                    { label: "100%", desc: "Pre-vetted" },
                                    { label: "12+", desc: "Roles available" },
                                ].map((s) => (
                                    <div key={s.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-3 text-center">
                                        <p className="text-lg font-bold text-amber-500 dark:text-amber-400">{s.label}</p>
                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-4 md:p-5">
                                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">How it works</p>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { step: "01", title: "Configure your team", icon: Users },
                                        { step: "02", title: "We match within 48h", icon: Zap },
                                        { step: "03", title: "Interview & choose", icon: CheckCircle },
                                    ].map((item) => (
                                        <div key={item.step} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                                                <item.icon size={14} className="text-amber-500 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-amber-400/60 uppercase tracking-widest">{item.step}</span>
                                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{item.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── GUIDED MODE ── */}
                {mode === "guided" && !guidedDone && (
                    <div className="max-w-2xl mx-auto flex flex-col gap-5">
                        <GuidedExperience onDone={handleGuidedDone} />
                        <NotSureBanner />
                    </div>
                )}

                {/* ── BROWSE MODE ── */}
                {(mode === "browse" || guidedDone) && (
                    <>
                        {guidedDone && (
                            <div className="flex items-center gap-3 mb-5 p-3 md:p-4 bg-amber-50 dark:bg-amber-400/5 border border-amber-200 dark:border-amber-400/20 rounded-2xl">
                                <CheckCircle size={15} className="text-amber-500 dark:text-amber-400 shrink-0" />
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                    Filtered to your best matches.
                                    <button onClick={() => { resetFilters(); setGuidedDone(false) }} className="ml-2 text-amber-500 font-semibold hover:underline">Clear</button>
                                </p>
                            </div>
                        )}

                        <div className="flex gap-6 lg:gap-8">

                            {/* Desktop Sidebar */}
                            {loading ? <SidebarSkeleton /> : (
                                <aside className="hidden lg:flex flex-col w-52 shrink-0 gap-5 sticky top-24 self-start">
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2.5">Role</p>
                                        <div className="flex flex-col gap-0.5">
                                            {ROLES.map((role) => (
                                                <button key={role.value} onClick={() => handleFilterChange(() => setSelectedRole(role.value))}
                                                    className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                                        selectedRole === role.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                                                    )}>{role.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2.5">Availability</p>
                                        <div className="flex flex-col gap-0.5">
                                            {TALENT_STATUSES.map((s) => (
                                                <button key={s.value} onClick={() => handleFilterChange(() => setSelectedStatus(s.value))}
                                                    className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                                        selectedStatus === s.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                                                    )}>{s.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2.5">Sort By</p>
                                        <div className="flex flex-col gap-0.5">
                                            {([
                                                { value: "rating", label: "Top Rated" },
                                                { value: "rate_asc", label: "Rate: Low → High" },
                                                { value: "rate_desc", label: "Rate: High → Low" },
                                            ] as { value: TalentSortOption; label: string }[]).map((o) => (
                                                <button key={o.value} onClick={() => handleFilterChange(() => setSortBy(o.value))}
                                                    className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                                        sortBy === o.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                                                    )}>{o.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {isFiltered && <button onClick={resetFilters} className="text-xs text-zinc-400 dark:text-zinc-600 hover:text-red-500 transition-colors text-left px-3">✕ Reset filters</button>}
                                    <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl">
                                        <p className="text-white text-xs font-bold mb-1">Need a full team?</p>
                                        <p className="text-zinc-500 text-xs leading-relaxed mb-3">Use our Team Builder to design your setup.</p>
                                        <button onClick={() => setMode("team")} className="flex items-center gap-1.5 text-amber-400 text-xs font-bold hover:text-amber-300 transition-colors">
                                            Open builder <ArrowRight size={11} />
                                        </button>
                                    </div>
                                </aside>
                            )}

                            {/* Grid area */}
                            <div className="flex-1 min-w-0">

                                {/* Mobile toolbar */}
                                <div className="flex items-center justify-between mb-4 lg:hidden">
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        <span className="font-semibold text-zinc-900 dark:text-white">{filtered.length}</span> professionals
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {isFiltered && (
                                            <button onClick={resetFilters}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 text-xs font-semibold border border-red-200 dark:border-red-500/20">
                                                <X size={10} /> Reset
                                            </button>
                                        )}
                                        <button onClick={() => setShowFilters(true)}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium",
                                                isFiltered
                                                    ? "border-amber-400/60 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/5"
                                                    : "border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900"
                                            )}>
                                            <SlidersHorizontal size={13} />
                                            Filters
                                            {activeFilterCount > 0 && (
                                                <span className="w-4 h-4 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-black flex items-center justify-center">
                                                    {activeFilterCount}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Desktop count */}
                                {!loading && (
                                    <div className="hidden lg:flex items-center justify-between mb-5">
                                        <p className="text-sm text-zinc-400 dark:text-zinc-600">{filtered.length} professionals found</p>
                                        {totalPages > 1 && <p className="text-sm text-zinc-400 dark:text-zinc-600">Page {page} of {totalPages}</p>}
                                    </div>
                                )}

                                {/* Talent grid */}
                                {(loading || talentLoading) ? <TalentGridSkeleton /> : paginated.length === 0 ? (
                                    <div className="text-center py-20">
                                        <p className="text-zinc-400 text-lg mb-2">No talent found</p>
                                        <p className="text-zinc-300 dark:text-zinc-700 text-sm mb-4">Try adjusting your filters</p>
                                        <Link href="/contact"><Button className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold">Contact Us Instead</Button></Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                                        {paginated.map((talent) => (
                                            <TalentCard key={talent.id} talent={talent} onClick={() => setSelectedTalent(talent)} />
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {!loading && totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-1.5 mt-8 md:mt-10 flex-wrap">
                                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-amber-400/40 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                            <ChevronLeft size={16} />
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <button key={p} onClick={() => setPage(p)}
                                                className={cn("w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium border transition-all",
                                                    p === page ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 border-transparent" : "border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-amber-400/40 hover:text-amber-500"
                                                )}>{p}</button>
                                        ))}
                                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-amber-400/40 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}

                                <div className="mt-8 md:mt-10"><NotSureBanner /></div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <JoinTeamBanner />

            {/* ── Mobile Filter Bottom Sheet ── */}
            {showFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
                    <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-zinc-950 rounded-t-3xl border-t border-zinc-200 dark:border-white/5 shadow-2xl flex flex-col"
                        style={{ maxHeight: "85dvh" }}>
                        <div className="flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                        </div>
                        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-white/5 shrink-0">
                            <h3 className="font-bold text-zinc-900 dark:text-white">Filters</h3>
                            <button onClick={() => setShowFilters(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-6
                            [&::-webkit-scrollbar]:w-1
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:bg-zinc-200
                            [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                            [&::-webkit-scrollbar-thumb]:rounded-full">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Role</p>
                                    <div className="flex flex-col gap-0.5">
                                        {ROLES.map((role) => (
                                            <button key={role.value}
                                                onClick={() => { handleFilterChange(() => setSelectedRole(role.value)); setShowFilters(false) }}
                                                className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                                    selectedRole === role.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                                                )}>{role.label}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Availability</p>
                                        <div className="flex flex-col gap-0.5">
                                            {TALENT_STATUSES.map((s) => (
                                                <button key={s.value}
                                                    onClick={() => { handleFilterChange(() => setSelectedStatus(s.value)); setShowFilters(false) }}
                                                    className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                                        selectedStatus === s.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                                                    )}>{s.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Sort By</p>
                                        <div className="flex flex-col gap-0.5">
                                            {([
                                                { value: "rating", label: "Top Rated" },
                                                { value: "rate_asc", label: "Low → High" },
                                                { value: "rate_desc", label: "High → Low" },
                                            ] as { value: TalentSortOption; label: string }[]).map((o) => (
                                                <button key={o.value}
                                                    onClick={() => { handleFilterChange(() => setSortBy(o.value)); setShowFilters(false) }}
                                                    className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                                        sortBy === o.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                                                    )}>{o.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 px-5 py-4 border-t border-zinc-100 dark:border-white/5 shrink-0">
                            {isFiltered && (
                                <button onClick={() => { resetFilters(); setShowFilters(false) }}
                                    className="flex-1 h-11 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                                    Reset
                                </button>
                            )}
                            <Button className={cn("h-11 rounded-xl bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 font-bold", isFiltered ? "flex-1" : "w-full")}
                                onClick={() => setShowFilters(false)}>
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Talent Detail ── */}
            {selectedTalent && (
                <>
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTalent(null)} />

                    {/* Mobile bottom sheet */}
                    <div className="fixed inset-x-0 bottom-0 z-50 sm:hidden flex flex-col bg-white dark:bg-zinc-900 rounded-t-3xl border-t border-zinc-100 dark:border-white/10 shadow-2xl"
                        style={{ maxHeight: "90dvh" }}>
                        <div className="flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                        </div>
                        <TalentModalContent talent={selectedTalent} onClose={() => setSelectedTalent(null)} />
                    </div>

                    {/* Desktop centered modal */}
                    <div className="fixed inset-0 z-50 hidden sm:flex items-center justify-center p-4 pointer-events-none">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto">
                            <TalentModalContent talent={selectedTalent} onClose={() => setSelectedTalent(null)} />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

// ─── Talent Modal Content ─────────────────────────────────────────────────────

function TalentModalContent({ talent, onClose }: { talent: Talent; onClose: () => void }) {
    return (
        <>
            <div className="flex items-start justify-between px-5 pt-4 pb-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
                <div className="flex items-start gap-3">
                    <div className={`rounded-2xl bg-gradient-to-br ${talent.gradient} flex items-center justify-center text-white font-bold shadow-lg shrink-0`}
                        style={{ width: 52, height: 52, fontSize: 22 }}>
                        {talent.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base md:text-xl leading-tight">{talent.name}</h2>
                            <div className={cn("w-2 h-2 rounded-full shrink-0", talent.status === "available" ? "bg-green-500" : "bg-yellow-500")} />
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm">{talent.title}</p>
                        <p className="text-amber-500 dark:text-amber-400 font-bold text-sm mt-0.5">${talent.hourlyRate}/hr</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors shrink-0">
                    <X size={18} />
                </button>
            </div>

            <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-zinc-200
                [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-3.5">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <Star size={13} className="text-amber-400 fill-amber-400" />
                            <span className="font-bold text-zinc-900 dark:text-white">{talent.rating}</span>
                        </div>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600">Rating</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-3.5">
                        <div className="font-bold text-zinc-900 dark:text-white mb-0.5">{talent.projectsCompleted}</div>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600">Projects Completed</p>
                    </div>
                </div>
                {talent.bio && <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{talent.bio}</p>}
                {(talent.skills ?? []).length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                            {(talent.skills ?? []).map((skill) => (
                                <span key={skill} className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-medium">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="px-5 py-4 border-t border-zinc-100 dark:border-white/5 flex gap-3 shrink-0">
                <Link href={`/contact?hire=${talent.id}&name=${encodeURIComponent(talent.name)}`} className="flex-1">
                    <Button className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11">
                        Hire {talent.name.split(" ")[0]}
                    </Button>
                </Link>
                <Button variant="outline" className="rounded-xl border-zinc-200 dark:border-white/10 h-11 px-4" onClick={onClose}>
                    Close
                </Button>
            </div>
        </>
    )
}