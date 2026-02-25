"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { X, Loader2, Plus, User, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { portalFetch } from "@/lib/api/fetcher"
import { toast } from "sonner"
import type { TalentRow, ClientRow, Project } from "@/server/db/schema"

type Props = {
    onClose: () => void
    onCreated: (placement: any) => void
}

const inputCls = "w-full rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-sm focus:border-amber-400 dark:focus:border-amber-400"

export default function CreatePlacementModal({ onClose, onCreated }: Props) {
    const [saving, setSaving] = useState(false)
    const [talents, setTalents] = useState<TalentRow[]>([])
    const [clients, setClients] = useState<ClientRow[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [loadingData, setLoadingData] = useState(true)

    const [form, setForm] = useState({
        talentId: "",
        clientId: "",
        projectId: "",
        role: "",
        description: "",
        hourlyRate: "",
        hoursPerWeek: "40",
        startDate: "",
        endDate: "",
        notes: "",
    })

    useEffect(() => {
        Promise.all([
            portalFetch.get<TalentRow[]>("/admin/talent"),
            portalFetch.get<ClientRow[]>("/admin/clients"),
            portalFetch.get<Project[]>("/admin/projects"),
        ])
            .then(([talentsData, clientsData, projectsData]) => {
                setTalents(talentsData)
                setClients(clientsData)
                setProjects(projectsData)
            })
            .catch(() => toast.error("Failed to load data"))
            .finally(() => setLoadingData(false))
    }, [])

    useEffect(() => {
        if (form.talentId) {
            const selectedTalent = talents.find((t) => t.id === form.talentId)
            if (selectedTalent) {
                setForm((f) => ({
                    ...f,
                    role: f.role || selectedTalent.title,
                    hourlyRate: f.hourlyRate || (selectedTalent.hourlyRate ?? ""),
                }))
            }
        }
    }, [form.talentId, talents])

    const filteredProjects = form.clientId
        ? projects.filter((p) => p.clientId === form.clientId)
        : []

    const handleSubmit = async () => {
        if (!form.talentId || !form.clientId || !form.role || !form.startDate) {
            toast.error("Please fill in all required fields")
            return
        }

        setSaving(true)
        try {
            const body = {
                talentId: form.talentId,
                clientId: form.clientId,
                projectId: form.projectId || undefined,
                role: form.role,
                description: form.description || undefined,
                hourlyRate: form.hourlyRate || undefined,
                hoursPerWeek: form.hoursPerWeek ? parseInt(form.hoursPerWeek) : undefined,
                startDate: form.startDate,
                endDate: form.endDate || undefined,
                notes: form.notes || undefined,
            }

            const created = await portalFetch.post("/admin/placements", body)
            toast.success("Placement created successfully")
            onCreated(created)
            onClose()
        } catch (err: any) {
            toast.error(err.message ?? "Failed to create placement")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-white/5">
                    <div>
                        <h2 className="font-bold text-zinc-900 dark:text-white text-lg flex items-center gap-2">
                            <Plus size={20} /> Create Placement
                        </h2>
                        <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5">
                            Assign a talent to a client or project
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto flex flex-col gap-4
                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-zinc-200
                    [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                    [&::-webkit-scrollbar-thumb]:rounded-full">

                    {loadingData ? (
                        <div className="flex items-center justify-center py-8 text-zinc-400 text-sm">
                            <Loader2 size={16} className="animate-spin mr-2" /> Loading...
                        </div>
                    ) : (
                        <>
                            {/* Talent & Client */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label className="flex items-center gap-1.5">
                                        <User size={13} /> Talent *
                                    </Label>
                                    <Select
                                        value={form.talentId}
                                        onValueChange={(v) => setForm({ ...form, talentId: v })}
                                    >
                                        <SelectTrigger className={inputCls}>
                                            <SelectValue placeholder="Select talent..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl dark:bg-zinc-900 dark:border-white/10">
                                            {talents.length === 0 && (
                                                <SelectItem value="__none" disabled>No talents available</SelectItem>
                                            )}
                                            {talents.map((t) => (
                                                <SelectItem key={t.id} value={t.id}>
                                                    {t.name} - {t.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="flex items-center gap-1.5">
                                        <Building2 size={13} /> Client *
                                    </Label>
                                    <Select
                                        value={form.clientId}
                                        onValueChange={(v) => setForm({ ...form, clientId: v, projectId: "" })}
                                    >
                                        <SelectTrigger className={inputCls}>
                                            <SelectValue placeholder="Select client..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl dark:bg-zinc-900 dark:border-white/10">
                                            {clients.length === 0 && (
                                                <SelectItem value="__none" disabled>No clients available</SelectItem>
                                            )}
                                            {clients.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Project (optional) */}
                            <div className="flex flex-col gap-2">
                                <Label>Project (Optional)</Label>
                                <Select
                                    value={form.projectId}
                                    onValueChange={(v) => setForm({ ...form, projectId: v })}
                                    disabled={!form.clientId}
                                >
                                    <SelectTrigger className={inputCls}>
                                        <SelectValue placeholder={form.clientId ? "Select project..." : "Select client first"} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl dark:bg-zinc-900 dark:border-white/10">
                                        {filteredProjects.length === 0 && (
                                            <SelectItem value="__none" disabled>No projects for this client</SelectItem>
                                        )}
                                        {filteredProjects.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Role */}
                            <div className="flex flex-col gap-2">
                                <Label>Role *</Label>
                                <Input
                                    className={inputCls}
                                    placeholder="e.g. Frontend Developer"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <Label>Description</Label>
                                <Textarea
                                    className={cn(inputCls, "resize-none")}
                                    rows={2}
                                    placeholder="Brief description of this placement..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            {/* Rate & Hours */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Hourly Rate (USD)</Label>
                                    <Input
                                        className={inputCls}
                                        placeholder="75.00"
                                        value={form.hourlyRate}
                                        onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Hours / Week</Label>
                                    <Input
                                        className={inputCls}
                                        type="number"
                                        min={1}
                                        max={80}
                                        value={form.hoursPerWeek}
                                        onChange={(e) => setForm({ ...form, hoursPerWeek: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Start Date *</Label>
                                    <DatePicker
                                        value={form.startDate}
                                        onChange={(val) => setForm({ ...form, startDate: val })}
                                        placeholder="Select start date"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>End Date</Label>
                                    <DatePicker
                                        value={form.endDate}
                                        onChange={(val) => setForm({ ...form, endDate: val })}
                                        placeholder="Leave blank if ongoing"
                                        minDate={form.startDate ? new Date(form.startDate) : undefined}
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="flex flex-col gap-2">
                                <Label>Internal Notes</Label>
                                <Textarea
                                    className={cn(inputCls, "resize-none")}
                                    rows={2}
                                    placeholder="Any notes about this placement..."
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-zinc-100 dark:border-white/5">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || loadingData || !form.talentId || !form.clientId || !form.role || !form.startDate}
                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-bold text-sm transition-all"
                    >
                        {saving ? (
                            <><Loader2 size={15} className="animate-spin" /> Creating...</>
                        ) : (
                            <><Plus size={15} /> Create Placement</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
