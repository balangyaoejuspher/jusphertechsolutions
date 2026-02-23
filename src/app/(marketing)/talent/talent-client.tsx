"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import {
    Star, ArrowUpRight, SlidersHorizontal, X, ChevronLeft, ChevronRight,
    Users, Sparkles, MessageCircle, ArrowRight, CheckCircle, Zap,
    HelpCircle, Building2, Minus, Plus, Globe, Smartphone, Blocks,
    ShoppingCart, GraduationCap, Briefcase, Cpu, Code2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { talents } from "@/lib/talents"
import { roles } from "@/lib/roles"

// ============================================================
// TYPES & CONSTANTS
// ============================================================

const statuses = [
    { value: "all", label: "Any Status" },
    { value: "available", label: "Available" },
    { value: "busy", label: "Busy" },
]

type SortOption = "rating" | "rate_asc" | "rate_desc"
const PAGE_SIZE = 9

const scales = [
    { value: "solo", label: "Solo", range: "1 person", desc: "One focused specialist", emoji: "🎯", min: 1, max: 1 },
    { value: "small", label: "Small", range: "2–4 people", desc: "Tight, agile team", emoji: "⚡", min: 2, max: 4 },
    { value: "medium", label: "Medium", range: "5–10 people", desc: "Cross-functional squad", emoji: "🚀", min: 5, max: 10 },
    { value: "large", label: "Large", range: "11–25 people", desc: "Full department", emoji: "🏢", min: 11, max: 25 },
    { value: "enterprise", label: "Enterprise", range: "25+ people", desc: "Organization-scale", emoji: "🌐", min: 25, max: 50 },
]

const projectTypes = [
    { value: "web-app", label: "Web Application", icon: Globe, color: "blue" },
    { value: "mobile-app", label: "Mobile App", icon: Smartphone, color: "violet" },
    { value: "ecommerce", label: "E-Commerce", icon: ShoppingCart, color: "emerald" },
    { value: "saas", label: "SaaS Platform", icon: Building2, color: "sky" },
    { value: "blockchain", label: "Blockchain / Web3", icon: Blocks, color: "amber" },
    { value: "ai", label: "AI / Automation", icon: Cpu, color: "rose" },
    { value: "enterprise", label: "Enterprise System", icon: Building2, color: "zinc" },
    { value: "edu", label: "Education Platform", icon: GraduationCap, color: "violet" },
    { value: "custom", label: "Custom / Other", icon: Briefcase, color: "zinc" },
]

const stackGroups = [
    { group: "Frontend", items: ["React", "Next.js", "Vue", "Angular", "Svelte", "Tailwind CSS"] },
    { group: "Mobile", items: ["React Native", "Flutter", "Swift", "Kotlin", "Expo"] },
    { group: "Backend", items: ["Node.js", "Python", "Go", "Laravel", "Django", "FastAPI"] },
    { group: "Database", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase", "Firebase"] },
    { group: "Cloud/DevOps", items: ["AWS", "Docker", "Kubernetes", "Vercel", "GCP", "CI/CD"] },
    { group: "Web3", items: ["Solidity", "Ethereum", "Hardhat", "IPFS", "Web3.js", "OpenZeppelin"] },
]

const colorVariants: Record<string, string> = {
    blue: "bg-blue-50   dark:bg-blue-500/10   border-blue-200   dark:border-blue-500/20   text-blue-600   dark:text-blue-400",
    violet: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    sky: "bg-sky-50    dark:bg-sky-500/10    border-sky-200    dark:border-sky-500/20    text-sky-600    dark:text-sky-400",
    amber: "bg-amber-50  dark:bg-amber-500/10  border-amber-200  dark:border-amber-500/20  text-amber-600  dark:text-amber-400",
    rose: "bg-rose-50   dark:bg-rose-500/10   border-rose-200   dark:border-rose-500/20   text-rose-600   dark:text-rose-400",
    zinc: "bg-zinc-100  dark:bg-zinc-800      border-zinc-200   dark:border-white/10      text-zinc-600   dark:text-zinc-400",
}

const modeConfig = {
    browse: { label: "Browse Talent", icon: Users, desc: "I know what I need" },
    guided: { label: "Help Me Choose", icon: HelpCircle, desc: "Not sure where to start" },
    team: { label: "Build a Team", icon: Building2, desc: "I need multiple people" },
}

const guidedQuestions = [
    {
        id: "goal",
        question: "What's your main goal right now?",
        options: [
            { value: "build", label: "Build a product or app", icon: "💻", roles: ["developer"] },
            { value: "grow", label: "Grow my business online", icon: "📈", roles: ["marketing", "designer", "va"] },
            { value: "scale", label: "Scale my operations", icon: "⚙️", roles: ["va", "customer_support", "data_analyst"] },
            { value: "secure", label: "Protect or innovate with tech", icon: "🔐", roles: ["developer"] },
        ],
    },
    {
        id: "timeline",
        question: "How soon do you need someone?",
        options: [
            { value: "asap", label: "ASAP — this week", icon: "🔥", roles: [] },
            { value: "soon", label: "Within 2 weeks", icon: "📅", roles: [] },
            { value: "planning", label: "Planning ahead (1 month+)", icon: "🗓️", roles: [] },
            { value: "exploring", label: "Just exploring options", icon: "👀", roles: [] },
        ],
    },
]

// ============================================================
// SKELETONS
// ============================================================

function TalentCardSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-16 h-4 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
            </div>
            <div className="w-32 h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-2" />
            <div className="w-24 h-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-1" />
            <div className="w-16 h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-4" />
            <div className="flex gap-1.5 mb-4">
                {[60, 80, 50].map((w, i) => <div key={i} className="h-5 rounded-lg bg-zinc-100 dark:bg-zinc-800" style={{ width: w }} />)}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
                {[60, 80, 50].map((w, i) => <div key={i} className="h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800" style={{ width: w }} />)}
            </div>
            <div className="w-20 h-4 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
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
        <div className="hidden lg:flex flex-col w-56 shrink-0 gap-6 sticky top-24 self-start animate-pulse">
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

// ============================================================
// TEAM BUILDER
// ============================================================

const projectSuggestions: Record<string, { roles: string[]; stack: string[] }> = {
    "web-app": {
        roles: ["developer", "ui_ux", "project_manager"],
        stack: ["React", "Next.js", "Node.js", "PostgreSQL", "Vercel"],
    },
    "mobile-app": {
        roles: ["developer", "ui_ux"],
        stack: ["React Native", "Flutter", "Firebase", "Expo"],
    },
    "ecommerce": {
        roles: ["developer", "marketing", "va", "customer_support"],
        stack: ["Next.js", "Shopify", "PostgreSQL", "Vercel"],
    },
    "saas": {
        roles: ["developer", "ui_ux", "project_manager", "data_analyst"],
        stack: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
    },
    "blockchain": {
        roles: ["developer"],
        stack: ["Solidity", "Ethereum", "Hardhat", "Web3.js", "IPFS", "OpenZeppelin"],
    },
    "ai": {
        roles: ["developer", "data_analyst"],
        stack: ["Python", "FastAPI", "PostgreSQL", "AWS", "Docker"],
    },
    "enterprise": {
        roles: ["developer", "project_manager", "data_analyst", "devops"],
        stack: ["Node.js", "PostgreSQL", "Docker", "Kubernetes", "AWS", "CI/CD"],
    },
    "edu": {
        roles: ["developer", "ui_ux", "va"],
        stack: ["React", "Next.js", "PostgreSQL", "Supabase"],
    },
    "custom": {
        roles: [],
        stack: [],
    },
}

function TeamBuilder() {
    const [teamSize, setTeamSize] = useState(3)
    const [scale, setScale] = useState("small")
    const [projectType, setProjectType] = useState<string | null>(null)
    const [selectedStack, setSelectedStack] = useState<string[]>([])
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [expandedStack, setExpandedStack] = useState<string | null>("Frontend")

    const currentScale = scales.find((s) => s.value === scale)!
    const suggestions = projectType ? projectSuggestions[projectType] : null

    // Auto-apply suggestions when project changes
    const handleProjectChange = (value: string | null) => {
        setProjectType(value)
        if (value && projectSuggestions[value]) {
            setSelectedRoles(projectSuggestions[value].roles)
            setSelectedStack(projectSuggestions[value].stack)
        } else {
            setSelectedRoles([])
            setSelectedStack([])
        }
    }

    const handleScaleChange = (s: typeof scales[0]) => {
        setScale(s.value)
        const clamped = Math.max(s.min, Math.min(s.max, teamSize))
        setTeamSize(clamped)
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
            <div className="px-8 pt-8 pb-5 border-b border-zinc-100 dark:border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                    <Building2 size={18} className="text-amber-500 dark:text-amber-400" />
                </div>
                <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight">Team Builder</h3>
                    <p className="text-zinc-400 dark:text-zinc-500 text-sm">Design your ideal team, step by step</p>
                </div>
            </div>

            <div className="p-8 flex flex-col gap-8">

                {/* STEP 1 — Project type */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-zinc-950 text-[10px] font-black shrink-0">1</span>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">What are you building?</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {projectTypes.map((pt) => {
                            const active = projectType === pt.value
                            return (
                                <button
                                    key={pt.value}
                                    onClick={() => handleProjectChange(active ? null : pt.value)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all duration-150",
                                        active
                                            ? "bg-amber-400/10 border-amber-400/40 shadow-sm"
                                            : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl border flex items-center justify-center",
                                        active ? colorVariants[pt.color] : "bg-white dark:bg-zinc-700 border-zinc-200 dark:border-white/10"
                                    )}>
                                        <pt.icon size={15} className={active ? "" : "text-zinc-400 dark:text-zinc-500"} />
                                    </div>
                                    <span className={cn("text-[11px] font-semibold leading-tight", active ? "text-amber-600 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-400")}>
                                        {pt.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* STEP 2 — Scale + Slider */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-zinc-950 text-[10px] font-black shrink-0">2</span>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">What's your team scale?</p>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 mb-5">
                        {scales.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => handleScaleChange(s)}
                                className={cn(
                                    "flex flex-col items-center gap-1 py-3 px-1 rounded-2xl border text-center transition-all duration-150",
                                    scale === s.value
                                        ? "bg-amber-400/10 border-amber-400/40"
                                        : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"
                                )}
                            >
                                <span className="text-xl leading-none">{s.emoji}</span>
                                <span className={cn("text-[11px] font-bold mt-1", scale === s.value ? "text-amber-600 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-400")}>
                                    {s.label}
                                </span>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-600 leading-tight">{s.range}</span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Headcount</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{currentScale.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setTeamSize((n) => Math.max(sliderMin, n - 1))}
                                    disabled={teamSize <= sliderMin}
                                    className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:border-amber-400/60 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <Minus size={13} />
                                </button>
                                <div className="text-center min-w-[64px]">
                                    <span className="text-3xl font-black text-zinc-900 dark:text-white tabular-nums">{teamSize}</span>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-600">{teamSize === 1 ? "person" : "people"}</p>
                                </div>
                                <button
                                    onClick={() => setTeamSize((n) => Math.min(sliderMax, n + 1))}
                                    disabled={teamSize >= sliderMax}
                                    className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:border-amber-400/60 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <Plus size={13} />
                                </button>
                            </div>
                        </div>

                        <div
                            className="relative h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full cursor-pointer select-none"
                            onClick={handleSliderClick}
                        >
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-100 pointer-events-none"
                                style={{ width: `${sliderPct}%` }}
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-amber-400 shadow-lg shadow-amber-400/30 transition-all duration-100 pointer-events-none z-10"
                                style={{ left: `${sliderPct}%` }}
                            >
                                <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-amber-400" />
                            </div>
                        </div>

                        <div className="flex justify-between mt-2.5">
                            <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">{sliderMin}</span>
                            <span className="text-xs font-bold text-amber-500 dark:text-amber-400">
                                {currentScale.emoji} {currentScale.label} · {teamSize} {teamSize === 1 ? "person" : "people"}
                            </span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">{sliderMax === 50 ? "50+" : sliderMax}</span>
                        </div>
                    </div>
                </div>

                {/* STEP 3 — Roles */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-zinc-950 text-[10px] font-black shrink-0">3</span>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">What roles do you need?</p>
                        </div>
                        {suggestions && suggestions.roles.length > 0 && (
                            <span className="text-[10px] font-semibold text-amber-500 dark:text-amber-400 uppercase tracking-widest">
                                ✦ Suggested for your project
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {roles.filter((r) => r.value !== "all").map((role) => {
                            const active = selectedRoles.includes(role.value)
                            const isSuggested = suggestions?.roles.includes(role.value)
                            return (
                                <button
                                    key={role.value}
                                    onClick={() => toggleRole(role.value)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                                        active
                                            ? "bg-amber-400/10 border-amber-400/40 text-amber-600 dark:text-amber-400"
                                            : isSuggested
                                                ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20 text-amber-600/60 dark:text-amber-400/60 hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400"
                                                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                    )}
                                >
                                    {active && <CheckCircle size={11} />}
                                    {isSuggested && !active && <span className="text-amber-400">✦</span>}
                                    {role.label}
                                </button>
                            )
                        })}
                    </div>
                    {suggestions && suggestions.roles.length > 0 && (
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-2.5">
                            ✦ Suggested · You can still add any other role you need.
                        </p>
                    )}
                </div>

                {/* STEP 4 — Tech Stack accordion */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-zinc-950 text-[10px] font-black shrink-0">4</span>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">What's your tech stack?</p>
                            <span className="text-xs text-zinc-400 dark:text-zinc-600">(optional)</span>
                        </div>
                        {suggestions && suggestions.stack.length > 0 && (
                            <span className="text-[10px] font-semibold text-amber-500 dark:text-amber-400 uppercase tracking-widest">
                                ✦ Suggested for your project
                            </span>
                        )}
                    </div>
                    <div className="border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                        {stackGroups.map((group, gi) => {
                            const groupSelected = selectedStack.filter((s) => group.items.includes(s)).length
                            const groupSuggested = suggestions?.stack.filter((s) => group.items.includes(s)).length ?? 0
                            const isOpen = expandedStack === group.group
                            return (
                                <div key={group.group} className={cn(gi > 0 && "border-t border-zinc-100 dark:border-white/5")}>
                                    <button
                                        onClick={() => setExpandedStack(isOpen ? null : group.group)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Code2 size={13} className="text-zinc-400" />
                                            {group.group}
                                            {groupSelected > 0 && (
                                                <span className="px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                                                    {groupSelected}
                                                </span>
                                            )}
                                            {groupSuggested > 0 && groupSelected === 0 && (
                                                <span className="px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-400/10 text-amber-500/70 dark:text-amber-400/60 text-[10px] font-bold">
                                                    ✦ {groupSuggested}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronRight size={14} className={cn("text-zinc-400 transition-transform duration-200", isOpen && "rotate-90")} />
                                    </button>
                                    {isOpen && (
                                        <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2 bg-zinc-50/50 dark:bg-zinc-800/30">
                                            {group.items.map((item) => {
                                                const active = selectedStack.includes(item)
                                                const isSuggested = suggestions?.stack.includes(item)
                                                return (
                                                    <button
                                                        key={item}
                                                        onClick={() => toggleStack(item)}
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                                                            active
                                                                ? "bg-amber-400/10 border-amber-400/40 text-amber-600 dark:text-amber-400"
                                                                : isSuggested
                                                                    ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20 text-amber-600/60 dark:text-amber-400/60 hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400"
                                                                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                                        )}
                                                    >
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
                    {suggestions && suggestions.stack.length > 0 && (
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-2.5">
                            ✦ Suggested · You can still pick any other technology.
                        </p>
                    )}
                </div>

                {/* Summary card */}
                <div className={cn(
                    "rounded-2xl border p-5 transition-all duration-300",
                    hasConfig
                        ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20"
                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10"
                )}>
                    <div className="flex items-start gap-3">
                        <Sparkles size={16} className={cn("shrink-0 mt-0.5", hasConfig ? "text-amber-500 dark:text-amber-400" : "text-zinc-400")} />
                        <div>
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                                {hasConfig ? "Your team brief" : "Start configuring above to see your summary"}
                            </p>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400 space-y-1">
                                {projectType && (
                                    <p>🏗️ <span className="font-semibold text-zinc-700 dark:text-zinc-300">{projectTypes.find((p) => p.value === projectType)?.label}</span></p>
                                )}
                                <p>
                                    {currentScale.emoji}{" "}
                                    <span className="font-semibold text-amber-600 dark:text-amber-400">{teamSize} {teamSize === 1 ? "person" : "people"}</span>
                                    {" "}({currentScale.label} team)
                                </p>
                                {selectedRoles.length > 0 && (
                                    <p>👥 <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedRoles.join(", ")}</span></p>
                                )}
                                {selectedStack.length > 0 && (
                                    <p>⚙️ <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                        {selectedStack.slice(0, 4).join(", ")}{selectedStack.length > 4 ? ` +${selectedStack.length - 4} more` : ""}
                                    </span></p>
                                )}
                            </div>
                            {hasConfig && (
                                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2">We'll match you with the right talent within 48 hours.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div>
                    <Link href={`/contact?${contactParams}`}>
                        <Button className="w-full h-13 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 text-base shadow-lg shadow-amber-500/20">
                            <MessageCircle size={17} />
                            Get a Team Proposal
                        </Button>
                    </Link>
                    <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-3">
                        Free consultation · No commitment · Response within 24h
                    </p>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// GUIDED
// ============================================================

function GuidedExperience({ onDone }: { onDone: (roles: string[]) => void }) {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const current = guidedQuestions[step]
    const isLast = step === guidedQuestions.length - 1

    const handleAnswer = (value: string) => {
        const next = { ...answers, [current.id]: value }
        setAnswers(next)
        if (isLast) {
            const goal = guidedQuestions[0].options.find((o) => o.value === next["goal"])
            onDone(goal?.roles ?? [])
        } else {
            setStep((s) => s + 1)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <HelpCircle size={18} className="text-amber-500 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 dark:text-white">Find Your Match</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                            <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${(step / guidedQuestions.length) * 100}%` }} />
                        </div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-600">{step + 1}/{guidedQuestions.length}</span>
                    </div>
                </div>
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-5">{current.question}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.options.map((opt) => (
                    <button key={opt.value} onClick={() => handleAnswer(opt.value)} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-400/5 text-left transition-all group">
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">{opt.label}</span>
                    </button>
                ))}
            </div>
            {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="mt-5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors">← Back</button>}
        </div>
    )
}

// ============================================================
// NOT SURE BANNER
// ============================================================

function NotSureBanner() {
    return (
        <div className="relative bg-zinc-900 rounded-3xl p-8 overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Free Consultation</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Still not sure who you need?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                    Tell us about your project. We'll analyse your needs and recommend the right talent — for free, no strings attached.
                </p>
                <Link href="/contact?type=consultation">
                    <Button className="rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2">
                        Talk to Our Team <ArrowRight size={15} />
                    </Button>
                </Link>
            </div>
        </div>
    )
}

function JoinTeamBanner() {
    return (
        < div className="border-t border-zinc-200 dark:border-white/5 py-10" >
            <div className="container mx-auto px-6 md:px-12">
                <div className="relative bg-zinc-900 dark:bg-zinc-800 rounded-3xl px-8 py-8 md:px-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative text-center md:text-left">
                        <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">We're Hiring</p>
                        <h3 className="text-white font-bold text-xl md:text-2xl mb-1">
                            Are you a skilled professional?
                        </h3>
                        <p className="text-zinc-400 text-sm max-w-md">
                            Join our growing network of vetted developers, VAs, designers, and more. Work with global clients on exciting projects.
                        </p>
                    </div>

                    <Link href="/application-form?type=join" className="relative shrink-0">
                        <Button className="rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-12 px-8 gap-2 shadow-lg shadow-amber-500/20 whitespace-nowrap">
                            Apply to Join <ArrowRight size={15} />
                        </Button>
                    </Link>
                </div>
            </div>
        </div >
    )
}

export default function TalentClient() {
    const [mode, setMode] = useState<"browse" | "guided" | "team">("browse")
    const [selectedRole, setSelectedRole] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [sortBy, setSortBy] = useState<SortOption>("rating")
    const [selectedTalent, setSelectedTalent] = useState<typeof talents[0] | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [page, setPage] = useState(1)
    const [guidedDone, setGuidedDone] = useState(false)
    const [loading, setLoading] = useState(false)

    const filtered = useMemo(() => {
        return talents
            .filter((t) => !t.isResigned)
            .filter((t) => selectedRole === "all" || t.role === selectedRole)
            .filter((t) => selectedStatus === "all" || t.status === selectedStatus)
            .sort((a, b) => {
                if (sortBy === "rating") return b.rating - a.rating
                if (sortBy === "rate_asc") return a.rate - b.rate
                if (sortBy === "rate_desc") return b.rate - a.rate
                return 0
            })
    }, [selectedRole, selectedStatus, sortBy])

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleFilterChange = (fn: () => void) => {
        setLoading(true)
        fn()
        setPage(1)
        setTimeout(() => setLoading(false), 350)
    }

    const resetFilters = () => handleFilterChange(() => { setSelectedRole("all"); setSelectedStatus("all"); setSortBy("rating") })
    const isFiltered = selectedRole !== "all" || selectedStatus !== "all" || sortBy !== "rating"

    const handleGuidedDone = (suggestedRoles: string[]) => {
        if (suggestedRoles.length > 0) setSelectedRole(suggestedRoles[0])
        setGuidedDone(true)
        setMode("browse")
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">

            {/* Hero */}
            <section className="relative py-14 md:py-20 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />
                <div className="relative container mx-auto px-6 md:px-12 text-center">
                    <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">— Our Talent</p>
                    <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white leading-[0.95] tracking-tight mb-4">
                        Find Your Perfect<br />
                        <span className="text-zinc-400 dark:text-zinc-500">Team Member</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-lg mx-auto mb-10">
                        Browse vetted professionals, get guided to the right match, or design your entire team from scratch.
                    </p>

                    {/* Mode switcher */}
                    <div className="inline-flex items-center gap-1 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm">
                        {(Object.entries(modeConfig) as [keyof typeof modeConfig, typeof modeConfig[keyof typeof modeConfig]][]).map(([key, cfg]) => (
                            <button
                                key={key}
                                onClick={() => { setMode(key); setGuidedDone(false) }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                                    mode === key
                                        ? "bg-amber-400 text-zinc-950 shadow-sm"
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5"
                                )}
                            >
                                <cfg.icon size={15} />
                                <span className="hidden sm:inline">{cfg.label}</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-3">{modeConfig[mode].desc}</p>
                </div>
            </section>

            <div className="container mx-auto px-6 md:px-12 py-10">

                {/* ── TEAM MODE ── */}
                {mode === "team" && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3"><TeamBuilder /></div>
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <NotSureBanner />
                            <JoinTeamBanner />
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "48h", desc: "Avg. matching" },
                                    { label: "100%", desc: "Pre-vetted" },
                                    { label: "12+", desc: "Roles available" },
                                ].map((s) => (
                                    <div key={s.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4 text-center">
                                        <p className="text-xl font-bold text-amber-500 dark:text-amber-400">{s.label}</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-6">
                                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">How it works</p>
                                <div className="flex flex-col gap-4">
                                    {[
                                        { step: "01", title: "Configure your team", icon: Users },
                                        { step: "02", title: "We match within 48h", icon: Zap },
                                        { step: "03", title: "Interview & choose", icon: CheckCircle },
                                    ].map((item) => (
                                        <div key={item.step} className="flex items-center gap-4">
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
                    <div className="max-w-2xl mx-auto flex flex-col gap-6">
                        <GuidedExperience onDone={handleGuidedDone} />
                        <NotSureBanner />
                        <JoinTeamBanner />
                    </div>
                )}

                {/* ── BROWSE MODE ── */}
                {(mode === "browse" || guidedDone) && (
                    <>
                        {guidedDone && (
                            <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 dark:bg-amber-400/5 border border-amber-200 dark:border-amber-400/20 rounded-2xl">
                                <CheckCircle size={16} className="text-amber-500 dark:text-amber-400 shrink-0" />
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                    Filtered to your best matches.
                                    <button onClick={() => { resetFilters(); setGuidedDone(false) }} className="ml-2 text-amber-500 font-semibold hover:underline">Clear</button>
                                </p>
                            </div>
                        )}

                        <div className="flex gap-8">
                            {/* Sidebar */}
                            {loading ? <SidebarSkeleton /> : (
                                <aside className="hidden lg:flex flex-col w-56 shrink-0 gap-6 sticky top-24 self-start">
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Role</p>
                                        <div className="flex flex-col gap-0.5">
                                            {roles.map((role) => (
                                                <button key={role.value} onClick={() => handleFilterChange(() => setSelectedRole(role.value))} className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all", selectedRole === role.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white")}>
                                                    {role.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Availability</p>
                                        <div className="flex flex-col gap-0.5">
                                            {statuses.map((s) => (
                                                <button key={s.value} onClick={() => handleFilterChange(() => setSelectedStatus(s.value))} className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all", selectedStatus === s.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white")}>
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Sort By</p>
                                        <div className="flex flex-col gap-0.5">
                                            {([{ value: "rating", label: "Top Rated" }, { value: "rate_asc", label: "Rate: Low → High" }, { value: "rate_desc", label: "Rate: High → Low" }] as { value: SortOption; label: string }[]).map((o) => (
                                                <button key={o.value} onClick={() => handleFilterChange(() => setSortBy(o.value))} className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all", sortBy === o.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white")}>
                                                    {o.label}
                                                </button>
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

                            {/* Grid */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-6 lg:hidden">
                                    <p className="text-sm text-zinc-500">{filtered.length} professionals</p>
                                    <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="rounded-xl border-zinc-200 dark:border-white/10 gap-2">
                                        <SlidersHorizontal size={14} /> Filters
                                    </Button>
                                </div>
                                {!loading && (
                                    <div className="hidden lg:flex items-center justify-between mb-6">
                                        <p className="text-sm text-zinc-400 dark:text-zinc-600">{filtered.length} professionals found</p>
                                        {totalPages > 1 && <p className="text-sm text-zinc-400 dark:text-zinc-600">Page {page} of {totalPages}</p>}
                                    </div>
                                )}

                                {loading ? <TalentGridSkeleton /> : paginated.length === 0 ? (
                                    <div className="text-center py-24">
                                        <p className="text-zinc-400 text-lg mb-2">No talent found</p>
                                        <p className="text-zinc-300 dark:text-zinc-700 text-sm mb-4">Try adjusting your filters</p>
                                        <Link href="/contact"><Button className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold">Contact Us Instead</Button></Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {paginated.map((talent) => (
                                            <div key={talent.id} onClick={() => setSelectedTalent(talent)} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 cursor-pointer hover:border-amber-400/40 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-zinc-100 dark:hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all duration-200">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${talent.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                                        {talent.name.charAt(0)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={cn("w-2 h-2 rounded-full", talent.status === "available" ? "bg-green-500" : "bg-yellow-500")} />
                                                        <span className="text-xs text-zinc-400 dark:text-zinc-600 capitalize">{talent.status}</span>
                                                    </div>
                                                </div>
                                                <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-0.5">{talent.name}</h3>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">{talent.title}</p>
                                                <p className="text-amber-500 dark:text-amber-400 text-sm font-bold mb-4">${talent.rate}/hr</p>
                                                <div className="flex items-center gap-1.5 mb-4">
                                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{talent.rating}</span>
                                                    <span className="text-xs text-zinc-400 dark:text-zinc-600">· {talent.projects} projects</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {talent.skills.slice(0, 3).map((skill) => (
                                                        <span key={skill} className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-500 text-xs">{skill}</span>
                                                    ))}
                                                    {talent.skills.length > 3 && <span className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-600 text-xs">+{talent.skills.length - 3}</span>}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400 dark:text-zinc-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                                                    View Profile <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!loading && totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-amber-400/40 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft size={16} /></button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <button key={p} onClick={() => setPage(p)} className={cn("w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium border transition-all", p === page ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 border-transparent" : "border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-amber-400/40 hover:text-amber-500")}>{p}</button>
                                        ))}
                                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-amber-400/40 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight size={16} /></button>
                                    </div>
                                )}

                                <div className="mt-10"><NotSureBanner /></div>
                                <div className="mt-10"><JoinTeamBanner /></div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Mobile Filter Drawer */}
            {showFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 rounded-t-3xl border-t border-zinc-200 dark:border-white/5 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-zinc-900 dark:text-white">Filters</h3>
                            <button onClick={() => setShowFilters(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"><X size={18} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Role</p>
                                <div className="flex flex-col gap-1">
                                    {roles.map((role) => (
                                        <button key={role.value} onClick={() => handleFilterChange(() => setSelectedRole(role.value))} className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all", selectedRole === role.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900")}>{role.label}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Availability</p>
                                <div className="flex flex-col gap-1">
                                    {statuses.map((s) => (
                                        <button key={s.value} onClick={() => handleFilterChange(() => setSelectedStatus(s.value))} className={cn("text-left px-3 py-2 rounded-lg text-sm font-medium transition-all", selectedStatus === s.value ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900")}>{s.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Button className="w-full mt-6 rounded-xl bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950" onClick={() => setShowFilters(false)}>Apply Filters</Button>
                    </div>
                </div>
            )}

            {/* Talent Modal */}
            {selectedTalent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTalent(null)} />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-lg p-8">
                        <button onClick={() => setSelectedTalent(null)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"><X size={18} /></button>
                        <div className="flex items-start gap-5 mb-6">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTalent.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0`}>
                                {selectedTalent.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h2 className="font-bold text-zinc-900 dark:text-white text-xl">{selectedTalent.name}</h2>
                                    <div className={cn("w-2 h-2 rounded-full", selectedTalent.status === "available" ? "bg-green-500" : "bg-yellow-500")} />
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">{selectedTalent.title}</p>
                                <p className="text-amber-500 dark:text-amber-400 font-bold mt-1">${selectedTalent.rate}/hr</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-1.5 mb-1"><Star size={13} className="text-amber-400 fill-amber-400" /><span className="font-bold text-zinc-900 dark:text-white">{selectedTalent.rating}</span></div>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600">Rating</p>
                            </div>
                            <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4">
                                <div className="font-bold text-zinc-900 dark:text-white mb-1">{selectedTalent.projects}</div>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600">Projects Completed</p>
                            </div>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">{selectedTalent.bio}</p>
                        <div className="mb-8">
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedTalent.skills.map((skill) => (
                                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-medium">{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/contact?hire=${selectedTalent.id}&name=${encodeURIComponent(selectedTalent.name)}`} className="flex-1">
                                <Button className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-12">
                                    Hire {selectedTalent.name.split(" ")[0]}
                                </Button>
                            </Link>
                            <Button variant="outline" className="rounded-xl border-zinc-200 dark:border-white/10 h-12 px-5" onClick={() => setSelectedTalent(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}