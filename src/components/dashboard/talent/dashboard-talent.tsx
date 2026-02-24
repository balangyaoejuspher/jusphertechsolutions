"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
    Plus,
    Search,
    Star,
    MoreHorizontal,
    X,
    Check,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Save,
    Briefcase,
    DollarSign,
    Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { talents } from "@/lib/talents"
import { ROLES, TALENT_AVATAR_GRADIENTS } from "@/lib/helpers/constants"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Talent } from "@/types"

const emptyForm = {
    name: "",
    title: "",
    role: "developer",
    rate: "",
    skills: "",
    status: "available",
    rating: "",
    projects: "",
    bio: "",
    gradient: TALENT_AVATAR_GRADIENTS[0],
}

const roleLabel = (role: string) =>
    ROLES.find((r) => r.value === role)?.label ?? role

const roleShort = (role: string) => {
    const label = ROLES.find((r) => r.value === role)?.label ?? role
    const shorts: Record<string, string> = {
        "Virtual Assistant": "VA",
        "Project Manager": "PM",
        "UI/UX Designer": "UI/UX",
        "Data Analyst": "Analyst",
        "Content Writer": "Writer",
        "Customer Support": "Support",
        "Video Editor": "Editor",
        "SEO Specialist": "SEO",
    }
    return shorts[label] ?? label
}

export default function DashboardTalent() {
    const [talent, setTalent] = useState(talents)
    const [search, setSearch] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [menuOpen, setMenuOpen] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [filterStatus, setFilterStatus] = useState("all")
    const PAGE_SIZE = 8

    // Detail / edit panel
    const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState<typeof emptyForm>(emptyForm)

    const filtered = talent
        .filter((t) => filterRole === "all" || t.role === filterRole)
        .filter((t) => filterStatus === "all" || t.status === filterStatus)
        .filter(
            (t) =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.title.toLowerCase().includes(search.toLowerCase())
        )

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    useEffect(() => setCurrentPage(1), [search, filterRole, filterStatus])

    // Sync editForm when selectedTalent changes
    useEffect(() => {
        if (selectedTalent) {
            setEditForm({
                name: selectedTalent.name,
                title: selectedTalent.title,
                role: selectedTalent.role,
                rate: String(selectedTalent.rate),
                skills: selectedTalent.skills.join(", "),
                status: selectedTalent.status,
                rating: String(selectedTalent.rating),
                projects: String(selectedTalent.projects),
                bio: selectedTalent.bio ?? "",
                gradient: selectedTalent.gradient,
            })
            setIsEditing(false)
        }
    }, [selectedTalent])

    const openDetail = (t: Talent) => {
        setMenuOpen(null)
        setSelectedTalent(t)
    }

    const closeDetail = () => {
        setSelectedTalent(null)
        setIsEditing(false)
    }

    const handleSaveEdit = () => {
        if (!selectedTalent || !editForm.name || !editForm.title || !editForm.rate) return
        const updated: Talent = {
            ...selectedTalent,
            name: editForm.name,
            title: editForm.title,
            role: editForm.role as Talent["role"],
            rate: Number(editForm.rate),
            skills: editForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
            status: editForm.status as Talent["status"],
            rating: Number(editForm.rating) || selectedTalent.rating,
            projects: Number(editForm.projects) || selectedTalent.projects,
            bio: editForm.bio,
            gradient: editForm.gradient,
        }
        setTalent(talent.map((t) => t.id === updated.id ? updated : t))
        setSelectedTalent(updated)
        setIsEditing(false)
    }

    const handleAdd = () => {
        if (!form.name || !form.title || !form.rate) return
        const newTalent: Talent = {
            id: Date.now().toString(),
            name: form.name,
            title: form.title,
            role: form.role as Talent["role"],
            rate: Number(form.rate),
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
            status: form.status as Talent["status"],
            rating: Number(form.rating) || 5.0,
            projects: Number(form.projects) || 0,
            bio: form.bio,
            gradient: form.gradient,
        }
        setTalent([...talent, newTalent])
        setForm(emptyForm)
        setShowModal(false)
    }

    const handleDelete = (id: string) => {
        setTalent(talent.filter((t) => t.id !== id))
        setMenuOpen(null)
        if (selectedTalent?.id === id) closeDetail()
    }

    const handleToggleStatus = (id: string) => {
        const cycle = (status: string) => {
            if (status === "available") return "busy" as const
            if (status === "busy") return "unavailable" as const
            return "available" as const
        }

        setTalent(talent.map((t) =>
            t.id === id ? { ...t, status: cycle(t.status) } : t
        ))
        if (selectedTalent?.id === id) {
            setSelectedTalent((prev) =>
                prev ? { ...prev, status: cycle(prev.status) } : prev
            )
        }
        setMenuOpen(null)
    }

    const inputCls = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
    const labelCls = "text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2"

    return (
        <div className="p-8 md:p-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Talent</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">{talent.length} professionals in your network</p>
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
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by name or title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all"
                    />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full sm:w-52 rounded-xl border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-sm text-zinc-700 dark:text-zinc-300">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl dark:bg-zinc-900 dark:border-white/10">
                        {ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value} className="text-sm">
                                {role.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-44 rounded-xl border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-sm text-zinc-700 dark:text-zinc-300">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl dark:bg-zinc-900 dark:border-white/10">
                        <SelectItem value="all" className="text-sm">All Statuses</SelectItem>
                        <SelectItem value="available" className="text-sm">Available</SelectItem>
                        <SelectItem value="busy" className="text-sm">Busy</SelectItem>
                        <SelectItem value="unavailable" className="text-sm">Unavailable</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-white/5">
                    {["Professional", "Role", "Rate", "Status", "Rating", ""].map((h) => (
                        <div key={h} className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                            {h}
                        </div>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-zinc-400 dark:text-zinc-600 text-sm">
                        No talent found. Try adjusting your filters.
                    </div>
                ) : (
                    paginated.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => openDetail(t)}
                            className={cn(
                                "grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-zinc-50 dark:border-white/5 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors items-center cursor-pointer",
                                selectedTalent?.id === t.id && "bg-amber-50/50 dark:bg-amber-500/5 border-l-2 border-l-amber-400"
                            )}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                    {t.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{t.name}</p>
                                    <p className="text-zinc-400 dark:text-zinc-500 text-xs truncate">{t.title}</p>
                                </div>
                            </div>

                            <div>
                                <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-medium capitalize">
                                    {roleShort(t.role)}
                                </span>
                            </div>

                            <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                                ${t.rate}<span className="text-zinc-400 dark:text-zinc-500 font-normal">/hr</span>
                            </div>

                            <div>
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
                                    t.status === "available"
                                        ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                                        : t.status === "busy"
                                            ? "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                            : "bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400"
                                )}>
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        t.status === "available" ? "bg-green-500"
                                            : t.status === "busy" ? "bg-yellow-500"
                                                : "bg-zinc-400"
                                    )} />
                                    {t.status === "available" ? "Available"
                                        : t.status === "busy" ? "Busy"
                                            : "Unavailable"}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t.rating}</span>
                            </div>

                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setMenuOpen(menuOpen === t.id ? null : t.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                {menuOpen === t.id && (
                                    <div className="absolute right-0 top-9 z-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg shadow-zinc-100 dark:shadow-none py-1 w-44">
                                        <button
                                            onClick={() => { openDetail(t); setIsEditing(true) }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2"
                                        >
                                            <Pencil size={14} className="text-zinc-400" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(t.id)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2"
                                        >
                                            <Check size={14} className="text-zinc-400" />
                                            {t.status === "available" ? "Set Busy"
                                                : t.status === "busy" ? "Set Unavailable"
                                                    : "Set Available"}
                                            Toggle Status
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={15} />
                        </button>

                        {(() => {
                            const pages: (number | string)[] = [];
                            if (totalPages <= 5) {
                                for (let i = 1; i <= totalPages; i++) pages.push(i);
                            } else {
                                pages.push(1);
                                if (currentPage > 3) pages.push('...');
                                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                                    pages.push(i);
                                }
                                if (currentPage < totalPages - 2) pages.push('...');
                                pages.push(totalPages);
                            }

                            return pages.map((page, idx) =>
                                page === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-zinc-400 text-sm">
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page as number)}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                                            currentPage === page
                                                ? "bg-amber-400 text-zinc-950"
                                                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                        )}
                                    >
                                        {page}
                                    </button>
                                )
                            );
                        })()}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Detail / Edit Slide-over ── */}
            {selectedTalent && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
                        onClick={closeDetail}
                    />

                    {/* Panel */}
                    <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden">

                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-white/5 shrink-0">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-lg">
                                {isEditing ? "Edit Talent" : "Talent Details"}
                            </h2>
                            <div className="flex items-center gap-2">
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 text-xs font-semibold transition-colors"
                                    >
                                        <Pencil size={12} />
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={closeDetail}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto px-6 py-6
                            [&::-webkit-scrollbar]:w-1.5
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:bg-zinc-200
                            [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                            [&::-webkit-scrollbar-thumb]:rounded-full">

                            {isEditing ? (
                                /* ── Edit Form ── */
                                <div className="flex flex-col gap-4">
                                    {/* Avatar gradient picker */}
                                    <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${editForm.gradient} flex items-center justify-center text-white font-bold text-xl shrink-0`}>
                                            {editForm.name.charAt(0) || "?"}
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {TALENT_AVATAR_GRADIENTS.map((g) => (
                                                <button
                                                    key={g}
                                                    onClick={() => setEditForm({ ...editForm, gradient: g })}
                                                    className={cn(
                                                        `w-7 h-7 rounded-lg bg-gradient-to-br ${g} transition-all`,
                                                        editForm.gradient === g ? "ring-2 ring-offset-2 ring-amber-400 scale-110" : "hover:scale-105"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Full Name *</Label>
                                        <Input
                                            placeholder="John Smith"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                    </div>
                                    {/* Job Title */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Job Title *</Label>
                                        <Input
                                            placeholder="Full-Stack Developer"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        />
                                    </div>

                                    {/* Role + Rate */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Role *</Label>
                                            <Select value={editForm.role} onValueChange={(v) => setEditForm({ ...editForm, role: v })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="developer">Developer</SelectItem>
                                                    <SelectItem value="va">Virtual Assistant</SelectItem>
                                                    <SelectItem value="project_manager">Project Manager</SelectItem>
                                                    <SelectItem value="designer">Designer</SelectItem>
                                                    <SelectItem value="qa">QA Engineer</SelectItem>
                                                    <SelectItem value="devops">DevOps / SRE</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>Hourly Rate ($) *</Label>
                                            <Input
                                                type="number"
                                                placeholder="45"
                                                value={editForm.rate}
                                                onChange={(e) => setEditForm({ ...editForm, rate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Bio</Label>
                                        <Textarea
                                            rows={3}
                                            placeholder="Brief professional background..."
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            className="resize-none"
                                        />
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Skills (comma separated)</Label>
                                        <Input
                                            placeholder="React, Node.js, TypeScript"
                                            value={editForm.skills}
                                            onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                                        />
                                    </div>

                                    {/* Status + Rating */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Status</Label>
                                            <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="available">Available</SelectItem>
                                                    <SelectItem value="busy">Busy</SelectItem>
                                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>Rating (1–5)</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="5"
                                                step="0.1"
                                                placeholder="5.0"
                                                value={editForm.rating}
                                                onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Projects Completed</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={editForm.projects}
                                            onChange={(e) => setEditForm({ ...editForm, projects: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                /* ── View Mode ── */
                                <div className="flex flex-col gap-6">
                                    {/* Profile card */}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTalent.gradient} flex items-center justify-center text-white font-bold text-2xl shrink-0`}>
                                            {selectedTalent.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-900 dark:text-white text-xl">{selectedTalent.name}</h3>
                                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{selectedTalent.title}</p>
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
                                                selectedTalent.status === "available"
                                                    ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                                                    : selectedTalent.status === "busy"
                                                        ? "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                                        : "bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400"
                                            )}>
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    selectedTalent.status === "available" ? "bg-green-500"
                                                        : selectedTalent.status === "busy" ? "bg-yellow-500"
                                                            : "bg-zinc-400"
                                                )} />
                                                {selectedTalent.status === "available" ? "Available"
                                                    : selectedTalent.status === "busy" ? "Busy"
                                                        : "Unavailable"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { icon: DollarSign, label: "Rate", value: `$${selectedTalent.rate}/hr` },
                                            { icon: Star, label: "Rating", value: String(selectedTalent.rating) },
                                            { icon: Briefcase, label: "Projects", value: String(selectedTalent.projects) },
                                        ].map(({ icon: Icon, label, value }) => (
                                            <div key={label} className="bg-zinc-50 dark:bg-white/5 rounded-xl p-3 text-center border border-zinc-100 dark:border-white/5">
                                                <Icon size={14} className="text-amber-500 mx-auto mb-1" />
                                                <p className="text-base font-bold text-zinc-900 dark:text-white">{value}</p>
                                                <p className="text-xs text-zinc-400 dark:text-zinc-500">{label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Role</p>
                                        <div className="flex items-center gap-2">
                                            <Activity size={14} className="text-zinc-400" />
                                            <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{roleLabel(selectedTalent.role)}</span>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    {selectedTalent.bio && (
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Bio</p>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{selectedTalent.bio}</p>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {selectedTalent.skills.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Skills</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedTalent.skills.map((skill) => (
                                                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Panel Footer */}
                        <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/5 shrink-0">
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleSaveEdit}
                                        className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2"
                                    >
                                        <Save size={15} />
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                        className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-5"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2"
                                    >
                                        <Pencil size={15} />
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleDelete(selectedTalent.id)}
                                        className="rounded-xl border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 h-11 px-5"
                                    >
                                        <X size={15} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Add Talent Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-xl">Add New Talent</h2>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className={labelCls}>Full Name *</label>
                                <input type="text" placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Job Title *</label>
                                <input type="text" placeholder="Full-Stack Developer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Role *</label>
                                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
                                        <option value="developer">Developer</option>
                                        <option value="va">Virtual Assistant</option>
                                        <option value="project_manager">Project Manager</option>
                                        <option value="designer">Designer</option>
                                        <option value="qa">QA Engineer</option>
                                        <option value="devops">DevOps / SRE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Hourly Rate ($) *</label>
                                    <input type="number" placeholder="45" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} className={inputCls} />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Bio</label>
                                <textarea rows={3} placeholder="Brief professional background..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={inputCls + " resize-none"} />
                            </div>
                            <div>
                                <label className={labelCls}>Skills (comma separated)</label>
                                <input type="text" placeholder="React, Node.js, TypeScript" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className={inputCls} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Status</label>
                                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-sm text-zinc-900 dark:text-white h-10">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl dark:bg-zinc-900 dark:border-white/10">
                                            <SelectItem value="available" className="text-sm">Available</SelectItem>
                                            <SelectItem value="busy" className="text-sm">Busy</SelectItem>
                                            <SelectItem value="unavailable" className="text-sm">Unavailable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className={labelCls}>Rating (1–5)</label>
                                    <input type="number" placeholder="5.0" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className={inputCls} />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Avatar Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {TALENT_AVATAR_GRADIENTS.map((g) => (
                                        <button key={g} onClick={() => setForm({ ...form, gradient: g })}
                                            className={cn(`w-8 h-8 rounded-lg bg-gradient-to-br ${g} transition-all`, form.gradient === g ? "ring-2 ring-offset-2 ring-amber-400 scale-110" : "hover:scale-105")}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <Button onClick={handleAdd} className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11">
                                Add Talent
                            </Button>
                            <Button variant="outline" onClick={() => setShowModal(false)} className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-5">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}