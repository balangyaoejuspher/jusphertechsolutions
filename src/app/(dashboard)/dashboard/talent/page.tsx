"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    Plus,
    Search,
    Star,
    MoreHorizontal,
    X,
    Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialTalent = [
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
        gradient: "from-emerald-500 to-teal-400",
    },
]

const roles = [
    { value: "all", label: "All Roles" },
    { value: "developer", label: "Developer" },
    { value: "va", label: "Virtual Assistant" },
    { value: "project_manager", label: "Project Manager" },
    { value: "designer", label: "Designer" },
    { value: "ui_ux", label: "UI/UX Designer" },
    { value: "data_analyst", label: "Data Analyst" },
    { value: "content_writer", label: "Content Writer" },
    { value: "marketing", label: "Marketing" },
    { value: "customer_support", label: "Customer Support" },
    { value: "accountant", label: "Accountant" },
    { value: "video_editor", label: "Video Editor" },
    { value: "seo_specialist", label: "SEO Specialist" },
]

const gradients = [
    "from-blue-500 to-cyan-400",
    "from-rose-500 to-pink-400",
    "from-violet-500 to-purple-400",
    "from-emerald-500 to-teal-400",
    "from-amber-500 to-orange-400",
    "from-fuchsia-500 to-pink-400",
]

const emptyForm = {
    name: "",
    title: "",
    role: "developer",
    rate: "",
    skills: "",
    status: "available",
    rating: "",
    projects: "",
    gradient: gradients[0],
}

export default function DashboardTalentPage() {
    const [talent, setTalent] = useState(initialTalent)
    const [search, setSearch] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [menuOpen, setMenuOpen] = useState<string | null>(null)

    const filtered = talent
        .filter((t) => filterRole === "all" || t.role === filterRole)
        .filter(
            (t) =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.title.toLowerCase().includes(search.toLowerCase())
        )

    const handleAdd = () => {
        if (!form.name || !form.title || !form.rate) return
        const newTalent = {
            id: Date.now().toString(),
            name: form.name,
            title: form.title,
            role: form.role,
            rate: Number(form.rate),
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
            status: form.status,
            rating: Number(form.rating) || 5.0,
            projects: Number(form.projects) || 0,
            gradient: form.gradient,
        }
        setTalent([...talent, newTalent])
        setForm(emptyForm)
        setShowModal(false)
    }

    const handleDelete = (id: string) => {
        setTalent(talent.filter((t) => t.id !== id))
        setMenuOpen(null)
    }

    const handleToggleStatus = (id: string) => {
        setTalent(talent.map((t) =>
            t.id === id
                ? { ...t, status: t.status === "available" ? "busy" : "available" }
                : t
        ))
        setMenuOpen(null)
    }

    return (
        <div className="p-8 md:p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 mb-1">Talent</h1>
                    <p className="text-zinc-500 text-sm">{talent.length} professionals in your network</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 shadow-sm"
                >
                    <Plus size={16} />
                    Add Talent
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by name or title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder:text-zinc-300 outline-none focus:border-amber-400 transition-all"
                    />
                </div>

                {/* Role Filter */}
                <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full sm:w-52 rounded-xl border-zinc-200 text-sm text-zinc-700">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {roles.map((role) => (
                            <SelectItem
                                key={role.value}
                                value={role.value}
                                className="text-sm"
                            >
                                {role.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-zinc-100 bg-zinc-50">
                    {["Professional", "Role", "Rate", "Status", "Rating", ""].map((h) => (
                        <div key={h} className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                            {h}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-zinc-400 text-sm">
                        No talent found. Try adjusting your filters.
                    </div>
                ) : (
                    filtered.map((t) => (
                        <div
                            key={t.id}
                            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors items-center"
                        >
                            {/* Name */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                    {t.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-zinc-900 text-sm truncate">{t.name}</p>
                                    <p className="text-zinc-400 text-xs truncate">{t.title}</p>
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-medium capitalize">
                                    {t.role === "va" ? "VA" : t.role === "project_manager" ? "PM" : "Dev"}
                                </span>
                            </div>

                            {/* Rate */}
                            <div className="text-sm font-semibold text-zinc-900">
                                ${t.rate}<span className="text-zinc-400 font-normal">/hr</span>
                            </div>

                            {/* Status */}
                            <div>
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
                                    t.status === "available"
                                        ? "bg-green-50 text-green-700"
                                        : "bg-yellow-50 text-yellow-700"
                                )}>
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        t.status === "available" ? "bg-green-500" : "bg-yellow-500"
                                    )} />
                                    {t.status === "available" ? "Available" : "Busy"}
                                </span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                <span className="text-sm font-semibold text-zinc-700">{t.rating}</span>
                            </div>

                            {/* Actions */}
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(menuOpen === t.id ? null : t.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                {menuOpen === t.id && (
                                    <div className="absolute right-0 top-9 z-10 bg-white border border-zinc-200 rounded-xl shadow-lg shadow-zinc-100 py-1 w-44">
                                        <button
                                            onClick={() => handleToggleStatus(t.id)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 flex items-center gap-2"
                                        >
                                            <Check size={14} className="text-zinc-400" />
                                            Toggle Status
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <X size={14} />
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Talent Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-zinc-900 text-xl">Add New Talent</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Name */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Smith"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Full-Stack Developer"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                />
                            </div>

                            {/* Role + Rate */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                        Role *
                                    </label>
                                    <select
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                    >
                                        <option value="developer">Developer</option>
                                        <option value="va">Virtual Assistant</option>
                                        <option value="project_manager">Project Manager</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                        Hourly Rate ($) *
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="45"
                                        value={form.rate}
                                        onChange={(e) => setForm({ ...form, rate: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                    Skills (comma separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="React, Node.js, TypeScript"
                                    value={form.skills}
                                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                />
                            </div>

                            {/* Status + Rating */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                    >
                                        <option value="available">Available</option>
                                        <option value="busy">Busy</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                        Rating (1-5)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="5.0"
                                        min="1"
                                        max="5"
                                        step="0.1"
                                        value={form.rating}
                                        onChange={(e) => setForm({ ...form, rating: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Avatar Color */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                    Avatar Color
                                </label>
                                <div className="flex gap-2">
                                    {gradients.map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setForm({ ...form, gradient: g })}
                                            className={cn(
                                                `w-8 h-8 rounded-lg bg-gradient-to-br ${g} transition-all`,
                                                form.gradient === g ? "ring-2 ring-offset-2 ring-amber-400 scale-110" : ""
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <Button
                                onClick={handleAdd}
                                className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11"
                            >
                                Add Talent
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowModal(false)}
                                className="rounded-xl border-zinc-200 h-11 px-5"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}