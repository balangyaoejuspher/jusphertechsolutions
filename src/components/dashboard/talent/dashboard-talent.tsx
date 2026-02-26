"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import {
    Plus, Search, Star, MoreHorizontal, X, Check,
    ChevronLeft, ChevronRight, Pencil, Save,
    Briefcase, DollarSign, Activity, Eye, EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { ROLES, TALENT_AVATAR_GRADIENTS } from "@/lib/helpers/constants"
import { portalFetch } from "@/lib/api/private-fetcher"
import { toast } from "sonner"
import { Talent, TalentFormState } from "@/types"
import { CustomSelect } from "@/components/ui/custom-select"

const PAGE_SIZE = 8

const emptyForm: TalentFormState = {
    name: "",
    email: "",
    password: "",
    title: "",
    role: "developer",
    hourlyRate: "",
    skills: "",
    status: "available",
    rating: "0",
    projectsCompleted: 0,
    bio: "",
    gradient: "from-blue-500 to-cyan-400",
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

const ROLE_OPTIONS = [
    { value: "all", label: "All Roles" },
    ...ROLES.map((r) => ({ value: r.value, label: r.label })),
] as const

const STATUS_FILTER_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "available", label: "Available" },
    { value: "busy", label: "Busy" },
    { value: "unavailable", label: "Unavailable" },
] as const

const TALENT_STATUS_OPTIONS = [
    { value: "available", label: "Available" },
    { value: "busy", label: "Busy" },
    { value: "unavailable", label: "Unavailable" },
] as const

const cycleStatus = (status: Talent["status"]): Talent["status"] => {
    if (status === "available") return "busy"
    if (status === "busy") return "unavailable"
    return "available"
}

const statusClass = (status: Talent["status"]) =>
    status === "available"
        ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
        : status === "busy"
            ? "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
            : "bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400"

const statusDot = (status: Talent["status"]) =>
    status === "available" ? "bg-green-500"
        : status === "busy" ? "bg-yellow-500"
            : "bg-zinc-400"

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TalentSkeleton() {
    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between mb-8">
                <div><Skeleton className="h-7 w-20 mb-2" /><Skeleton className="h-4 w-40" /></div>
                <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
            <div className="flex gap-3 mb-6 flex-col sm:flex-row">
                <Skeleton className="h-11 flex-1 rounded-xl" />
                <Skeleton className="h-11 w-full sm:w-52 rounded-xl" />
                <Skeleton className="h-11 w-full sm:w-44 rounded-xl" />
            </div>
            {/* Mobile card skeletons */}
            <div className="flex flex-col gap-3 sm:hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                            <div className="flex-1"><Skeleton className="h-4 w-32 mb-1.5" /><Skeleton className="h-3 w-20" /></div>
                            <Skeleton className="h-6 w-20 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
            {/* Desktop table skeleton */}
            <div className="hidden sm:block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl overflow-hidden">
                <div className="h-11 bg-zinc-50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/5" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-zinc-50 dark:border-white/5 items-center">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                            <div><Skeleton className="h-4 w-28 mb-1" /><Skeleton className="h-3 w-20" /></div>
                        </div>
                        <Skeleton className="h-6 w-16 rounded-lg" />
                        <Skeleton className="h-4 w-14" />
                        <Skeleton className="h-6 w-20 rounded-lg" />
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function TalentDetailContent({
    talent,
    isEditing,
    editForm,
    setEditForm,
    saving,
    onSave,
    onCancelEdit,
    onEdit,
    onToggleVisibility,
    onDelete,
}: {
    talent: Talent
    isEditing: boolean
    editForm: TalentFormState
    setEditForm: (f: TalentFormState) => void
    saving: boolean
    onSave: () => void
    onCancelEdit: () => void
    onEdit: () => void
    onToggleVisibility: (id: string) => void
    onDelete: (id: string) => void
}) {
    return (
        <>
            <div className="flex-1 overflow-y-auto px-5 py-5
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-zinc-200
                [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full">

                {isEditing ? (
                    <div className="flex flex-col gap-4">
                        {/* Gradient picker */}
                        <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${editForm.gradient} flex items-center justify-center text-white font-bold text-xl shrink-0`}>
                                {editForm.name.charAt(0) || "?"}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {TALENT_AVATAR_GRADIENTS.map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setEditForm({ ...editForm, gradient: g })}
                                        className={cn(`w-7 h-7 rounded-lg bg-gradient-to-br ${g} transition-all`, editForm.gradient === g ? "ring-2 ring-offset-2 ring-amber-400 scale-110" : "hover:scale-105")}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>Full Name *</Label>
                            <Input placeholder="John Smith" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>Email *</Label>
                            <Input type="email" placeholder="john@email.com" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>Job Title *</Label>
                            <Input placeholder="Full-Stack Developer" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <Label>Role *</Label>
                                <CustomSelect
                                    value={editForm.role}
                                    options={ROLES.filter((r) => r.value !== "all")}
                                    onChange={(v) => setEditForm({ ...editForm, role: v as Talent["role"] })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Rate ($/hr) *</Label>
                                <Input type="number" placeholder="45" value={editForm.hourlyRate} onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>Bio</Label>
                            <Textarea rows={3} placeholder="Brief professional background..." value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} className="resize-none" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>Skills (comma separated)</Label>
                            <Input placeholder="React, Node.js, TypeScript" value={editForm.skills} onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <Label>Status</Label>
                                <CustomSelect
                                    value={editForm.status}
                                    options={TALENT_STATUS_OPTIONS}
                                    onChange={(v) => setEditForm({ ...editForm, status: v as Talent["status"] })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Rating (1–5)</Label>
                                <Input type="number" min="1" max="5" step="0.1" placeholder="5.0" value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>Projects Completed</Label>
                            <Input type="number" placeholder="0" value={editForm.projectsCompleted} onChange={(e) => setEditForm({ ...editForm, projectsCompleted: e.target.value as unknown as number })} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {/* Profile */}
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${talent.gradient} flex items-center justify-center text-white font-bold text-2xl shrink-0`}>
                                {talent.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-zinc-900 dark:text-white text-xl">{talent.name}</h3>
                                    {!talent.isVisible && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 text-zinc-400 text-xs">
                                            <EyeOff size={10} /> Hidden
                                        </span>
                                    )}
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">{talent.title}</p>
                                <span className={cn("inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-lg text-xs font-medium", statusClass(talent.status))}>
                                    <div className={cn("w-1.5 h-1.5 rounded-full", statusDot(talent.status))} />
                                    {talent.status === "available" ? "Available" : talent.status === "busy" ? "Busy" : "Unavailable"}
                                </span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { icon: DollarSign, label: "Rate", value: `$${talent.hourlyRate ?? "—"}/hr` },
                                { icon: Star, label: "Rating", value: talent.rating ?? "—" },
                                { icon: Briefcase, label: "Projects", value: String(talent.projectsCompleted ?? 0) },
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
                                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{roleLabel(talent.role)}</span>
                            </div>
                        </div>

                        {talent.bio && (
                            <div>
                                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Bio</p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{talent.bio}</p>
                            </div>
                        )}

                        {(talent.skills ?? []).length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Skills</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {(talent.skills ?? []).map((skill) => (
                                        <span key={skill} className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-medium">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-zinc-100 dark:border-white/5 shrink-0">
                {isEditing ? (
                    <div className="flex gap-3">
                        <Button
                            onClick={onSave}
                            disabled={saving}
                            className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2"
                        >
                            {saving
                                ? <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                                : <Save size={15} />
                            }
                            Save Changes
                        </Button>
                        <Button variant="outline" onClick={onCancelEdit} className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-5">
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Button
                            onClick={onEdit}
                            className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2"
                        >
                            <Pencil size={15} /> Edit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onToggleVisibility(talent.id)}
                            title={talent.isVisible ? "Hide from portal" : "Show in portal"}
                            className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-3.5"
                        >
                            {talent.isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onDelete(talent.id)}
                            className="rounded-xl border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 h-11 px-3.5"
                        >
                            <X size={15} />
                        </Button>
                    </div>
                )}
            </div>
        </>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardTalent() {
    const [talentList, setTalentList] = useState<Talent[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState<TalentFormState>(emptyForm)
    const [menuOpen, setMenuOpen] = useState<string | null>(null)
    const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState(emptyForm)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const inputCls = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
    const labelCls = "text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2"

    useEffect(() => {
        portalFetch.get<Talent[]>("/admin/talent")
            .then(setTalentList)
            .catch(() => toast.error("Failed to load talent"))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (selectedTalent) {
            setEditForm({
                name: selectedTalent.name,
                email: selectedTalent.email,
                title: selectedTalent.title,
                role: selectedTalent.role,
                hourlyRate: selectedTalent.hourlyRate ?? "",
                skills: (selectedTalent.skills ?? []).join(", "),
                status: selectedTalent.status,
                rating: selectedTalent.rating ?? "5.0",
                projectsCompleted: Number(selectedTalent.projectsCompleted ?? 0),
                bio: selectedTalent.bio ?? "",
                gradient: selectedTalent.gradient ?? "from-blue-500 to-cyan-400",
            })
            setIsEditing(false)
        }
    }, [selectedTalent])

    useEffect(() => setCurrentPage(1), [search, filterRole, filterStatus])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeDetail() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [])

    useEffect(() => {
        if (selectedTalent) document.body.style.overflow = "hidden"
        else document.body.style.overflow = ""
        return () => { document.body.style.overflow = "" }
    }, [selectedTalent])

    const filtered = useMemo(() =>
        talentList
            .filter((t) => filterRole === "all" || t.role === filterRole)
            .filter((t) => filterStatus === "all" || t.status === filterStatus)
            .filter((t) =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.title.toLowerCase().includes(search.toLowerCase())
            ),
        [talentList, filterRole, filterStatus, search]
    )

    const totalPages = useMemo(() => Math.ceil(filtered.length / PAGE_SIZE), [filtered])
    const paginated = useMemo(() =>
        filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filtered, currentPage]
    )

    const openDetail = (t: Talent) => { setMenuOpen(null); setSelectedTalent(t) }
    const closeDetail = () => { setSelectedTalent(null); setIsEditing(false) }

    const handleAdd = async () => {
        if (!form.name || !form.email || !form.title || !form.hourlyRate) return
        setSaving(true)
        try {
            const [firstName, ...rest] = form.name.trim().split(" ")
            const lastName = rest.join(" ") || ""
            const { userId } = await portalFetch.post<{ userId: string }>("/clerk/create-user", {
                firstName, lastName, email: form.email, password: form.password,
            })
            if (!userId) { toast.error("Failed to get userId from Clerk"); return }
            const created = await portalFetch.post<Talent>("/admin/talent", {
                name: form.name, email: form.email, clerkUserId: userId,
                title: form.title, role: form.role, status: form.status,
                bio: form.bio || null, gradient: form.gradient,
                skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
                hourlyRate: form.hourlyRate || null,
                rating: form.rating || "5.0",
                projectsCompleted: Number(form.projectsCompleted) || 0,
                isVisible: true,
            })
            setTalentList((prev) => [created, ...prev])
            setForm(emptyForm)
            setShowModal(false)
            toast.success(`${created.name} has been added!`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to add talent")
        } finally {
            setSaving(false)
        }
    }

    const handleSaveEdit = async () => {
        if (!selectedTalent || !editForm.name || !editForm.title || !editForm.hourlyRate) return
        setSaving(true)
        try {
            const updated = await portalFetch.patch<Talent>(`/admin/talent/${selectedTalent.id}`, {
                name: editForm.name, email: editForm.email, title: editForm.title,
                role: editForm.role, status: editForm.status, bio: editForm.bio || null,
                gradient: editForm.gradient,
                skills: editForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
                hourlyRate: editForm.hourlyRate || null,
                rating: editForm.rating || selectedTalent.rating,
                projectsCompleted: Number(editForm.projectsCompleted) || selectedTalent.projectsCompleted,
            })
            setTalentList((prev) => prev.map((t) => t.id === updated.id ? updated : t))
            setSelectedTalent(updated)
            setIsEditing(false)
            toast.success(`${updated.name} updated!`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update talent")
        } finally {
            setSaving(false)
        }
    }

    const confirmDelete = (id: string) => { setMenuOpen(null); setDeleteConfirm(id) }

    const handleDelete = async (id: string) => {
        const target = talentList.find((t) => t.id === id)
        try {
            await portalFetch.delete(`/admin/talent/${id}`)
            setTalentList((prev) => prev.filter((t) => t.id !== id))
            setDeleteConfirm(null)
            if (selectedTalent?.id === id) closeDetail()
            toast.success(`${target?.name ?? "Talent"} removed.`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to delete talent")
        }
    }

    const handleToggleStatus = async (id: string) => {
        const target = talentList.find((t) => t.id === id)
        if (!target) return
        const newStatus = cycleStatus(target.status)
        try {
            const updated = await portalFetch.patch<Talent>(`/admin/talent/${id}`, { status: newStatus })
            setTalentList((prev) => prev.map((t) => t.id === id ? updated : t))
            if (selectedTalent?.id === id) setSelectedTalent(updated)
            setMenuOpen(null)
            toast.success(`${updated.name} is now ${newStatus}.`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update status")
        }
    }

    const handleToggleVisibility = async (id: string) => {
        const target = talentList.find((t) => t.id === id)
        if (!target) return
        try {
            const { isVisible } = await portalFetch.patch<{ isVisible: boolean }>(`/admin/talent/${id}/visibility`, {})
            const updated = { ...target, isVisible }
            setTalentList((prev) => prev.map((t) => t.id === id ? updated : t))
            if (selectedTalent?.id === id) setSelectedTalent(updated)
            setMenuOpen(null)
            toast.success(`${target.name} is now ${isVisible ? "visible" : "hidden"}.`)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update visibility")
        }
    }

    const detailProps = selectedTalent ? {
        talent: selectedTalent,
        isEditing,
        editForm,
        setEditForm,
        saving,
        onSave: handleSaveEdit,
        onCancelEdit: () => setIsEditing(false),
        onEdit: () => setIsEditing(true),
        onToggleVisibility: handleToggleVisibility,
        onDelete: confirmDelete,
    } : null

    if (loading) return <TalentSkeleton />

    return (
        <div className="p-6 md:p-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Talent</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">{talentList.length} professionals in your network</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 shadow-sm shrink-0"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Add Talent</span>
                    <span className="sm:hidden">Add</span>
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
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-amber-400 transition-all"
                    />
                </div>
                <div className="flex gap-3">
                    <CustomSelect
                        value={filterRole}
                        options={ROLE_OPTIONS}
                        onChange={setFilterRole}
                        className="flex-1 sm:w-52"
                        buttonClassName="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                    />
                    <CustomSelect
                        value={filterStatus}
                        options={STATUS_FILTER_OPTIONS}
                        onChange={setFilterStatus}
                        className="flex-1 sm:w-44"
                        buttonClassName="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                    />
                </div>
            </div>

            {/* ── Mobile: Card list (< sm) ── */}
            <div className="flex flex-col gap-3 sm:hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-zinc-400 dark:text-zinc-600 text-sm bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                        No talent found.
                    </div>
                ) : paginated.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => openDetail(t)}
                        className={cn(
                            "bg-white dark:bg-zinc-900 border rounded-2xl p-4 cursor-pointer transition-all",
                            selectedTalent?.id === t.id
                                ? "border-amber-400 shadow-sm"
                                : "border-zinc-100 dark:border-white/5 hover:border-zinc-200 dark:hover:border-white/10",
                            !t.isVisible && "opacity-60"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                {t.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{t.name}</p>
                                    {!t.isVisible && <EyeOff size={10} className="text-zinc-400 shrink-0" />}
                                </div>
                                <p className="text-zinc-400 dark:text-zinc-500 text-xs truncate">{t.title}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium", statusClass(t.status))}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full", statusDot(t.status))} />
                                    {t.status === "available" ? "Available" : t.status === "busy" ? "Busy" : "N/A"}
                                </span>
                                {/* 3-dot menu */}
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => setMenuOpen(menuOpen === t.id ? null : t.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <MoreHorizontal size={15} />
                                    </button>
                                    {menuOpen === t.id && <RowMenu t={t} onEdit={() => { openDetail(t); setIsEditing(true) }} onToggleStatus={handleToggleStatus} onToggleVisibility={handleToggleVisibility} onDelete={confirmDelete} onClose={() => setMenuOpen(null)} />}
                                </div>
                            </div>
                        </div>
                        {/* Rate + rating row */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-50 dark:border-white/5">
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <DollarSign size={11} /> <span className="font-semibold text-zinc-700 dark:text-zinc-300">${t.hourlyRate ?? "—"}/hr</span>
                            </span>
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <Star size={11} className="text-amber-400 fill-amber-400" /> <span className="font-semibold text-zinc-700 dark:text-zinc-300">{t.rating}</span>
                            </span>
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <Briefcase size={11} /> <span className="font-semibold text-zinc-700 dark:text-zinc-300">{t.projectsCompleted ?? 0} projects</span>
                            </span>
                            <span className="ml-auto px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                                {roleShort(t.role)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Desktop: Table (sm+) ── */}
            <div className="hidden sm:block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl overflow-visible">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-white/5 rounded-t-2xl">
                    {["Professional", "Role", "Rate", "Status", "Rating", ""].map((h) => (
                        <div key={h} className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{h}</div>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-zinc-400 dark:text-zinc-600 text-sm">
                        No talent found. Try adjusting your filters.
                    </div>
                ) : paginated.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => openDetail(t)}
                        className={cn(
                            "grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-zinc-50 dark:border-white/5 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors items-center cursor-pointer",
                            selectedTalent?.id === t.id && "bg-amber-50/50 dark:bg-amber-500/5 border-l-2 border-l-amber-400",
                            !t.isVisible && "opacity-50"
                        )}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                {t.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{t.name}</p>
                                    {!t.isVisible && <EyeOff size={11} className="text-zinc-400 shrink-0" />}
                                </div>
                                <p className="text-zinc-400 dark:text-zinc-500 text-xs truncate">{t.title}</p>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-medium capitalize">
                            {roleShort(t.role)}
                        </span>
                        <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                            ${t.hourlyRate ?? "—"}<span className="text-zinc-400 font-normal">/hr</span>
                        </div>
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium", statusClass(t.status))}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", statusDot(t.status))} />
                            {t.status === "available" ? "Available" : t.status === "busy" ? "Busy" : "Unavailable"}
                        </span>
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
                            {menuOpen === t.id && <RowMenu t={t} onEdit={() => { openDetail(t); setIsEditing(true) }} onToggleStatus={handleToggleStatus} onToggleVisibility={handleToggleVisibility} onDelete={confirmDelete} onClose={() => setMenuOpen(null)} />}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                            <ChevronLeft size={15} />
                        </button>
                        {(() => {
                            const pages: (number | string)[] = []
                            if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
                            else {
                                pages.push(1)
                                if (currentPage > 3) pages.push("...")
                                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
                                if (currentPage < totalPages - 2) pages.push("...")
                                pages.push(totalPages)
                            }
                            return pages.map((page, idx) =>
                                page === "..." ? (
                                    <span key={`e-${idx}`} className="w-8 h-8 flex items-center justify-center text-zinc-400 text-sm">…</span>
                                ) : (
                                    <button key={page} onClick={() => setCurrentPage(page as number)}
                                        className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                                            currentPage === page ? "bg-amber-400 text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                        )}>{page}</button>
                                )
                            )
                        })()}
                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Desktop slide-over (sm+) ── */}
            {selectedTalent && detailProps && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] hidden sm:block" onClick={closeDetail} />
                    <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-white/10 shadow-2xl hidden sm:flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-lg">
                                {isEditing ? "Edit Talent" : "Talent Details"}
                            </h2>
                            <div className="flex items-center gap-2">
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 text-xs font-semibold transition-colors"
                                    >
                                        <Pencil size={12} /> Edit
                                    </button>
                                )}
                                <button onClick={closeDetail} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        <TalentDetailContent {...detailProps} />
                    </div>
                </>
            )}

            {/* ── Mobile bottom drawer (< sm) ── */}
            {selectedTalent && detailProps && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden" onClick={closeDetail} />
                    <div
                        className="fixed inset-x-0 bottom-0 z-50 sm:hidden flex flex-col bg-white dark:bg-zinc-900 rounded-t-3xl border-t border-zinc-100 dark:border-white/10 shadow-2xl"
                        style={{ maxHeight: "88dvh" }}
                    >
                        {/* Pull handle */}
                        <div className="flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                        </div>
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-white/5 shrink-0">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${selectedTalent.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                    {selectedTalent.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-zinc-900 dark:text-white text-sm leading-tight truncate">{selectedTalent.name}</p>
                                    <p className="text-xs text-zinc-400 leading-tight truncate">{selectedTalent.title}</p>
                                </div>
                            </div>
                            <button onClick={closeDetail} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors shrink-0">
                                <X size={16} />
                            </button>
                        </div>
                        <TalentDetailContent {...detailProps} />
                    </div>
                </>
            )}

            {/* Add Talent Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto
                        [&::-webkit-scrollbar]:w-1.5
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-zinc-200
                        [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                        [&::-webkit-scrollbar-thumb]:rounded-full">
                        <div className="sticky top-0 bg-white dark:bg-zinc-900 flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-white/5 z-10">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-xl">Add New Talent</h2>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="px-6 py-5 flex flex-col gap-4">
                            <div>
                                <label className={labelCls}>Full Name *</label>
                                <input type="text" placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Email *</label>
                                <input type="email" placeholder="john@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Password *</label>
                                <input type="password" placeholder="Enter a strong password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Job Title *</label>
                                <input type="text" placeholder="Full-Stack Developer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Role *</label>
                                    <CustomSelect
                                        value={form.role}
                                        options={ROLES.filter((r) => r.value !== "all")}
                                        onChange={(v) => setForm({ ...form, role: v as Talent["role"] })}
                                        placeholder="Select role"
                                        buttonClassName={inputCls}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Rate ($/hr) *</label>
                                    <input type="number" placeholder="45" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} className={inputCls} />
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
                                    <CustomSelect
                                        value={form.status}
                                        options={TALENT_STATUS_OPTIONS}
                                        onChange={(v) => setForm({ ...form, status: v as Talent["status"] })}
                                    />
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

                        <div className="flex gap-3 px-6 pb-6">
                            <Button
                                onClick={handleAdd}
                                disabled={!form.name || !form.email || !form.title || !form.hourlyRate || saving}
                                className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2"
                            >
                                {saving ? <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" /> : <Plus size={15} />}
                                Add Talent
                            </Button>
                            <Button variant="outline" onClick={() => setShowModal(false)} className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-5">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-zinc-100 dark:border-white/10">
                        <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-1">Remove Talent</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
                            Are you sure you want to remove{" "}
                            <span className="font-semibold text-zinc-900 dark:text-white">
                                {talentList.find((t) => t.id === deleteConfirm)?.name ?? "this talent"}
                            </span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold transition">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function RowMenu({
    t, onEdit, onToggleStatus, onToggleVisibility, onDelete, onClose,
}: {
    t: Talent
    onEdit: () => void
    onToggleStatus: (id: string) => void
    onToggleVisibility: (id: string) => void
    onDelete: (id: string) => void
    onClose: () => void
}) {
    return (
        <>
            <div className="fixed inset-0 z-10" onClick={onClose} />
            <div className="absolute right-0 top-9 z-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg py-1 w-44">
                <button onClick={onEdit}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2">
                    <Pencil size={12} className="text-zinc-400" /> Edit
                </button>
                <button onClick={() => onToggleStatus(t.id)}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2">
                    <Check size={12} className="text-zinc-400" />
                    {t.status === "available" ? "Set Busy" : t.status === "busy" ? "Set Unavailable" : "Set Available"}
                </button>
                <button onClick={() => onToggleVisibility(t.id)}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2">
                    {t.isVisible ? <EyeOff size={12} className="text-zinc-400" /> : <Eye size={12} className="text-zinc-400" />}
                    {t.isVisible ? "Hide" : "Show"}
                </button>
                <div className="border-t border-zinc-100 dark:border-white/5 my-1" />
                <button onClick={() => onDelete(t.id)}
                    className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                    <X size={12} /> Remove
                </button>
            </div>
        </>
    )
}