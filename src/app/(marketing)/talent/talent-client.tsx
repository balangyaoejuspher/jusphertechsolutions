"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Star, ArrowUpRight, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const talents = [
    {
        id: "1",
        name: "Alex Rivera",
        role: "developer",
        title: "Full-Stack Developer",
        rate: 45,
        skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
        status: "available",
        rating: 4.9,
        projects: 42,
        bio: "8 years building scalable web applications for startups and enterprises. Specialist in React ecosystems and cloud-native architecture.",
        gradient: "from-blue-500 to-cyan-400",
    },
    {
        id: "2",
        name: "Maria Santos",
        role: "va",
        title: "Virtual Assistant",
        rate: 20,
        skills: ["Admin", "CRM", "Support", "Scheduling"],
        status: "available",
        rating: 5.0,
        projects: 78,
        bio: "Detail-oriented VA with 5 years of executive support experience. Expert in automating workflows and managing high-volume inboxes.",
        gradient: "from-rose-500 to-pink-400",
    },
    {
        id: "3",
        name: "James Kwon",
        role: "project_manager",
        title: "Project Manager",
        rate: 55,
        skills: ["Agile", "Scrum", "Jira", "Risk Management"],
        status: "busy",
        rating: 4.8,
        projects: 31,
        bio: "PMP-certified PM with a track record of delivering complex projects on time. Experienced in managing distributed teams across time zones.",
        gradient: "from-violet-500 to-purple-400",
    },
    {
        id: "4",
        name: "Priya Mehta",
        role: "developer",
        title: "Frontend Developer",
        rate: 40,
        skills: ["Next.js", "Tailwind", "TypeScript", "Figma"],
        status: "available",
        rating: 4.9,
        projects: 56,
        bio: "Pixel-perfect frontend developer who bridges design and engineering. Passionate about performance, accessibility, and great UX.",
        gradient: "from-emerald-500 to-teal-400",
    },
    {
        id: "5",
        name: "Carlos Mendez",
        role: "developer",
        title: "Backend Developer",
        rate: 50,
        skills: ["Python", "Django", "AWS", "Docker"],
        status: "available",
        rating: 4.7,
        projects: 38,
        bio: "Backend specialist focused on building robust APIs and cloud infrastructure. Experienced with high-traffic systems and microservices.",
        gradient: "from-orange-500 to-amber-400",
    },
    {
        id: "6",
        name: "Sophie Chen",
        role: "va",
        title: "Executive Assistant",
        rate: 25,
        skills: ["Notion", "Slack", "Research", "Social Media"],
        status: "available",
        rating: 4.9,
        projects: 63,
        bio: "Proactive EA with a background in operations. Highly organized, discreet, and experienced working with C-suite executives.",
        gradient: "from-fuchsia-500 to-pink-400",
    },
    {
        id: "7",
        name: "Daniel Osei",
        role: "project_manager",
        title: "Scrum Master",
        rate: 60,
        skills: ["Scrum", "Kanban", "Confluence", "Leadership"],
        status: "available",
        rating: 5.0,
        projects: 24,
        bio: "Certified Scrum Master who coaches teams to peak performance. Focused on removing blockers and building high-trust team cultures.",
        gradient: "from-sky-500 to-blue-400",
    },
    {
        id: "8",
        name: "Aisha Patel",
        role: "developer",
        title: "Mobile Developer",
        rate: 48,
        skills: ["React Native", "iOS", "Android", "Expo"],
        status: "busy",
        rating: 4.8,
        projects: 29,
        bio: "Mobile-first developer with 6 years shipping apps on both iOS and Android. Expert in React Native and cross-platform performance.",
        gradient: "from-lime-500 to-green-400",
    },
]

const roles = [
    { value: "all", label: "All Roles" },
    { value: "developer", label: "Developers" },
    { value: "va", label: "Virtual Assistants" },
    { value: "project_manager", label: "Project Managers" },
]

const statuses = [
    { value: "all", label: "Any Status" },
    { value: "available", label: "Available" },
    { value: "busy", label: "Busy" },
]

type SortOption = "rating" | "rate_asc" | "rate_desc"

export default function TalentClient() {
    const [selectedRole, setSelectedRole] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [sortBy, setSortBy] = useState<SortOption>("rating")
    const [selectedTalent, setSelectedTalent] = useState<typeof talents[0] | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [cart, setCart] = useState<string[]>([])

    const filtered = talents
        .filter((t) => selectedRole === "all" || t.role === selectedRole)
        .filter((t) => selectedStatus === "all" || t.status === selectedStatus)
        .sort((a, b) => {
            if (sortBy === "rating") return b.rating - a.rating
            if (sortBy === "rate_asc") return a.rate - b.rate
            if (sortBy === "rate_desc") return b.rate - a.rate
            return 0
        })

    const toggleTalent = (id: string) => {
        setCart(prev =>
            prev.includes(id)
                ? prev.filter(t => t !== id)
                : [...prev, id]
        )
    }

    const clearCart = () => setCart([])

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">

            {/* Hero */}
            <section className="relative py-14 md:py-20 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />

                <div className="relative container mx-auto px-6 md:px-12 text-center">
                    <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                        — Our Talent
                    </p>

                    <h1 className="font-display text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white leading-[0.95] tracking-tight mb-4">
                        Find Your Perfect
                        <br />
                        <span className="text-zinc-400 dark:text-zinc-500">Team Member</span>
                    </h1>

                    <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-lg mx-auto">
                        Browse our vetted professionals and hire with confidence.
                    </p>
                </div>
            </section>

            {/* Content */}
            <div className="container mx-auto px-6 md:px-12 py-10">
                <div className="flex gap-8">

                    {/* Sidebar Filters — Desktop */}
                    <aside className="hidden lg:flex flex-col w-56 shrink-0 gap-8 sticky top-24 self-start">

                        {/* Role Filter */}
                        <div>
                            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">
                                Role
                            </p>
                            <div className="flex flex-col gap-1">
                                {roles.map((role) => (
                                    <button
                                        key={role.value}
                                        onClick={() => setSelectedRole(role.value)}
                                        className={cn(
                                            "text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                            selectedRole === role.value
                                                ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                                        )}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">
                                Availability
                            </p>
                            <div className="flex flex-col gap-1">
                                {statuses.map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => setSelectedStatus(status.value)}
                                        className={cn(
                                            "text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                            selectedStatus === status.value
                                                ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                                        )}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">
                                Sort By
                            </p>
                            <div className="flex flex-col gap-1">
                                {[
                                    { value: "rating", label: "Top Rated" },
                                    { value: "rate_asc", label: "Rate: Low to High" },
                                    { value: "rate_desc", label: "Rate: High to Low" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSortBy(option.value as SortOption)}
                                        className={cn(
                                            "text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                            sortBy === option.value
                                                ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reset */}
                        {(selectedRole !== "all" || selectedStatus !== "all" || sortBy !== "rating") && (
                            <button
                                onClick={() => { setSelectedRole("all"); setSelectedStatus("all"); setSortBy("rating") }}
                                className="text-xs text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors text-left px-3"
                            >
                                Reset filters
                            </button>
                        )}
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">

                        {/* Mobile Filter Bar */}
                        <div className="flex items-center justify-between mb-6 lg:hidden">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {filtered.length} professionals
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(true)}
                                className="rounded-xl border-zinc-200 dark:border-white/10 gap-2"
                            >
                                <SlidersHorizontal size={14} />
                                Filters
                            </Button>
                        </div>

                        {/* Desktop results count */}
                        <p className="hidden lg:block text-sm text-zinc-400 dark:text-zinc-600 mb-6">
                            {filtered.length} professionals found
                        </p>

                        {/* Talent Grid */}
                        {filtered.length === 0 ? (
                            <div className="text-center py-24">
                                <p className="text-zinc-400 dark:text-zinc-600 text-lg mb-2">No talent found</p>
                                <p className="text-zinc-300 dark:text-zinc-700 text-sm">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filtered.map((talent) => (
                                    <div
                                        key={talent.id}
                                        onClick={() => setSelectedTalent(talent)}
                                        className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 cursor-pointer hover:border-amber-400/40 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-zinc-100 dark:hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        {/* Top row */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${talent.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                                {talent.name.charAt(0)}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    talent.status === "available" ? "bg-green-500" : "bg-yellow-500"
                                                )} />
                                                <span className="text-xs text-zinc-400 dark:text-zinc-600 capitalize">
                                                    {talent.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-0.5">
                                            {talent.name}
                                        </h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">{talent.title}</p>
                                        <p className="text-amber-500 dark:text-amber-400 text-sm font-bold mb-4">
                                            ${talent.rate}/hr
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1.5 mb-4">
                                            <Star size={12} className="text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                                {talent.rating}
                                            </span>
                                            <span className="text-xs text-zinc-400 dark:text-zinc-600">
                                                · {talent.projects} projects
                                            </span>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {talent.skills.slice(0, 3).map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-500 text-xs"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {talent.skills.length > 3 && (
                                                <span className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-600 text-xs">
                                                    +{talent.skills.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        {/* CTA */}
                                        <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400 dark:text-zinc-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                                            View Profile
                                            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {showFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 rounded-t-3xl border-t border-zinc-200 dark:border-white/5 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-zinc-900 dark:text-white">Filters</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Role */}
                            <div>
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Role</p>
                                <div className="flex flex-col gap-1">
                                    {roles.map((role) => (
                                        <button
                                            key={role.value}
                                            onClick={() => setSelectedRole(role.value)}
                                            className={cn(
                                                "text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                                selectedRole === role.value
                                                    ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                            )}
                                        >
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Availability</p>
                                <div className="flex flex-col gap-1">
                                    {statuses.map((status) => (
                                        <button
                                            key={status.value}
                                            onClick={() => setSelectedStatus(status.value)}
                                            className={cn(
                                                "text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                                selectedStatus === status.value
                                                    ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                            )}
                                        >
                                            {status.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6 rounded-xl bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                            onClick={() => setShowFilters(false)}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}

            {/* Talent Detail Modal */}
            {selectedTalent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedTalent(null)}
                    />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-lg p-8">
                        {/* Close */}
                        <button
                            onClick={() => setSelectedTalent(null)}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        {/* Avatar + Status */}
                        <div className="flex items-start gap-5 mb-6">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTalent.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0`}>
                                {selectedTalent.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h2 className="font-bold text-zinc-900 dark:text-white text-xl">
                                        {selectedTalent.name}
                                    </h2>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        selectedTalent.status === "available" ? "bg-green-500" : "bg-yellow-500"
                                    )} />
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">{selectedTalent.title}</p>
                                <p className="text-amber-500 dark:text-amber-400 font-bold mt-1">${selectedTalent.rate}/hr</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Star size={13} className="text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-zinc-900 dark:text-white">{selectedTalent.rating}</span>
                                </div>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600">Rating</p>
                            </div>
                            <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4">
                                <div className="font-bold text-zinc-900 dark:text-white mb-1">
                                    {selectedTalent.projects}
                                </div>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600">Projects Completed</p>
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                            {selectedTalent.bio}
                        </p>

                        {/* Skills */}
                        <div className="mb-8">
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedTalent.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-3">
                            <Button className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-12">
                                Hire {selectedTalent.name.split(" ")[0]}
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl border-zinc-200 dark:border-white/10 h-12 px-5"
                                onClick={() => setSelectedTalent(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}