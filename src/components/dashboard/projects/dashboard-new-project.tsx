"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    ChevronLeft, Plus, X, Check, Loader2,
    FolderKanban, Building2, FileText, Tag,
    Calendar, DollarSign, Flag, Milestone,
    Hash, AlignLeft, Link, Sparkles, ChevronDown,
} from "lucide-react"
import { portalFetch } from "@/lib/api/private-fetcher"
import { formatDate } from "@/lib/helpers/format"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/date-picker"
import { CustomSelect } from "@/components/ui/custom-select"

type ClientOption = { id: string; name: string; email?: string }
type InquiryOption = { id: string; name: string; company?: string | null }
type MilestoneItem = { id: string; label: string; done: boolean }

const STATUS_OPTIONS = [
    { value: "draft", label: "Draft", color: "bg-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400" },
    { value: "active", label: "Active", color: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    { value: "paused", label: "Paused", color: "bg-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    { value: "completed", label: "Completed", color: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500", bg: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" },
] as const

const PRIORITY_OPTIONS = [
    { value: "low", label: "Low", color: "bg-zinc-400", icon: "▪" },
    { value: "medium", label: "Medium", color: "bg-blue-400", icon: "▪▪" },
    { value: "high", label: "High", color: "bg-orange-400", icon: "▪▪▪" },
    { value: "urgent", label: "Urgent", color: "bg-red-500", icon: "!!!" },
] as const

const CONTRACT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "sent", label: "Sent" },
    { value: "signed", label: "Signed" },
    { value: "expired", label: "Expired" },
    { value: "cancelled", label: "Cancelled" },
] as const

const STATUS_SELECT_OPTIONS = STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label }))

// ─── Primitives ───────────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            {children}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
    )
}

function FieldWrap({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("w-full", className)}>{children}</div>
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cn(
                "w-full h-10 px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/[0.08]",
                "text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
                "outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all",
                className
            )}
        />
    )
}

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cn(
                "w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/[0.08]",
                "text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
                "outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all resize-none",
                className
            )}
        />
    )
}

// ─── Client Select (searchable, custom) ──────────────────────────────────────

function ClientSelect({ value, onChange, clients }: {
    value: string
    onChange: (id: string, name: string) => void
    clients: ClientOption[]
}) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const selected = clients.find(c => c.id === value)

    const filtered = clients.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        (c.email ?? "").toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={cn(
                    "w-full h-10 px-3.5 rounded-xl border flex items-center justify-between gap-2 text-sm transition-all",
                    "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-white outline-none",
                    open ? "border-amber-400 ring-2 ring-amber-400/10" : "hover:border-zinc-300 dark:hover:border-white/20",
                    !value && "text-zinc-400 dark:text-zinc-600"
                )}
            >
                <div className="flex items-center gap-2 min-w-0">
                    <Building2 size={13} className="text-zinc-400 shrink-0" />
                    <span className="truncate">{selected?.name ?? "Select a client…"}</span>
                </div>
                <ChevronDown size={13} className={cn("text-zinc-400 shrink-0 transition-transform duration-200", open && "rotate-180")} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-2 border-b border-zinc-100 dark:border-white/5">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search clients..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="w-full h-8 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none border border-zinc-200 dark:border-white/10 focus:border-amber-400 transition-all"
                            />
                        </div>
                        <div className="max-h-48 overflow-y-auto py-1">
                            {filtered.length === 0 ? (
                                <p className="px-3.5 py-3 text-xs text-zinc-400 text-center">No clients found</p>
                            ) : filtered.map(c => (
                                <button key={c.id} type="button"
                                    onClick={() => { onChange(c.id, c.name); setOpen(false); setQuery("") }}
                                    className={cn(
                                        "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors",
                                        value === c.id ? "bg-amber-50 dark:bg-amber-500/10" : "hover:bg-zinc-50 dark:hover:bg-white/5"
                                    )}
                                >
                                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                        {c.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{c.name}</p>
                                        {c.email && <p className="text-[11px] text-zinc-400 truncate">{c.email}</p>}
                                    </div>
                                    {value === c.id && <Check size={12} className="ml-auto text-amber-500 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

// ─── Tag Input ────────────────────────────────────────────────────────────────

function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
    const [input, setInput] = useState("")
    const add = () => {
        const val = input.trim().toLowerCase()
        if (val && !tags.includes(val)) onChange([...tags, val])
        setInput("")
    }
    const remove = (tag: string) => onChange(tags.filter(t => t !== tag))

    return (
        <div className={cn(
            "min-h-10 w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/[0.08]",
            "flex flex-wrap gap-1.5 items-center focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/10 transition-all"
        )}>
            {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium">
                    <Hash size={9} />{tag}
                    <button type="button" onClick={() => remove(tag)} className="hover:text-red-500 transition-colors ml-0.5">
                        <X size={9} />
                    </button>
                </span>
            ))}
            <input
                type="text" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add() }
                    if (e.key === "Backspace" && !input && tags.length) remove(tags[tags.length - 1])
                }}
                placeholder={tags.length === 0 ? "Add tags… (press Enter)" : ""}
                className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
            />
        </div>
    )
}

// ─── Milestone Builder ────────────────────────────────────────────────────────

function MilestoneBuilder({ milestones, onChange }: {
    milestones: MilestoneItem[]
    onChange: (m: MilestoneItem[]) => void
}) {
    const [input, setInput] = useState("")
    const add = () => {
        const label = input.trim()
        if (!label) return
        onChange([...milestones, { id: crypto.randomUUID(), label, done: false }])
        setInput("")
    }
    const remove = (id: string) => onChange(milestones.filter(m => m.id !== id))
    const toggle = (id: string) => onChange(milestones.map(m => m.id === id ? { ...m, done: !m.done } : m))

    return (
        <div className="space-y-2">
            {milestones.length > 0 && (
                <div className="space-y-1.5">
                    {milestones.map(m => (
                        <div key={m.id} className="flex items-center gap-2.5 group px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/[0.07]">
                            <button type="button" onClick={() => toggle(m.id)}
                                className={cn(
                                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                    m.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-zinc-300 dark:border-zinc-600 hover:border-emerald-400"
                                )}>
                                {m.done && <Check size={8} />}
                            </button>
                            <span className={cn("flex-1 text-sm", m.done ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-700 dark:text-zinc-300")}>
                                {m.label}
                            </span>
                            <button type="button" onClick={() => remove(m.id)}
                                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                <X size={11} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex gap-2">
                <input type="text" value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add() } }}
                    placeholder="Add a milestone…"
                    className="flex-1 h-9 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/[0.08] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all"
                />
                <button type="button" onClick={add}
                    className="h-9 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 border border-zinc-200 dark:border-white/[0.08] transition-all">
                    <Plus size={14} />
                </button>
            </div>
        </div>
    )
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ icon: Icon, title, description, children, className }: {
    icon: React.ElementType
    title: string
    description?: string
    children: React.ReactNode
    className?: string
}) {
    return (
        // NOTE: NO overflow-hidden here — dropdowns need to escape
        <div className={cn("bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/[0.07]", className)}>
            <div className="px-5 md:px-6 py-4 border-b border-zinc-100 dark:border-white/[0.06] rounded-t-2xl overflow-hidden">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <Icon size={13} className="text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{title}</p>
                        {description && <p className="text-[11px] text-zinc-400 mt-0.5">{description}</p>}
                    </div>
                </div>
            </div>
            <div className="px-5 md:px-6 py-5 space-y-4">
                {children}
            </div>
        </div>
    )
}

// ─── Progress Slider ──────────────────────────────────────────────────────────

function ProgressSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Initial progress</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white tabular-nums">{value}%</span>
            </div>
            <input
                type="range" min={0} max={100} step={5} value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full cursor-pointer accent-amber-400 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-200 dark:[&::-webkit-slider-runnable-track]:bg-zinc-700 appearance-none h-2"
            />
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardNewProject() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [clientId, setClientId] = useState("")
    const [clientName, setClientName] = useState("")
    const [inquiryId, setInquiryId] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]["value"]>("draft")
    const [priority, setPriority] = useState<typeof PRIORITY_OPTIONS[number]["value"]>("medium")
    const [progress, setProgress] = useState(0)
    const [contractStatus, setContractStatus] = useState<typeof CONTRACT_STATUS_OPTIONS[number]["value"]>("pending")
    const [contractUrl, setContractUrl] = useState("")
    const [startDate, setStartDate] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [budget, setBudget] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [milestones, setMilestones] = useState<MilestoneItem[]>([])
    const [notes, setNotes] = useState("")

    const [clients, setClients] = useState<ClientOption[]>([])
    const [inquiries, setInquiries] = useState<InquiryOption[]>([])
    const [loadingClients, setLoadingClients] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        portalFetch.get<ClientOption[]>("/admin/clients")
            .then(data => {
                setClients(data)
                const prefilledId = searchParams.get("clientId")
                if (prefilledId) {
                    const client = data.find(c => c.id === prefilledId)
                    if (client) { setClientId(client.id); setClientName(client.name) }
                }
            })
            .catch(() => toast.error("Failed to load clients"))
            .finally(() => setLoadingClients(false))
    }, [])

    useEffect(() => {
        if (!clientId) { setInquiries([]); setInquiryId(""); return }
        portalFetch.get<InquiryOption[]>(`/admin/inquiries?clientId=${clientId}`)
            .then(setInquiries)
            .catch(() => setInquiries([]))
    }, [clientId])

    const validate = () => {
        const e: Record<string, string> = {}
        if (!clientId) e.clientId = "Client is required"
        if (!title.trim()) e.title = "Project title is required"
        if (budget && isNaN(parseFloat(budget))) e.budget = "Must be a valid number"
        if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) e.dueDate = "Due date must be after start date"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        setSubmitting(true)
        try {
            const payload = {
                clientId, inquiryId: inquiryId || null,
                title: title.trim(), description: description.trim() || null,
                status, priority, progress, contractStatus,
                contractUrl: contractUrl.trim() || null,
                startDate: startDate || null, dueDate: dueDate || null,
                budget: budget ? parseFloat(budget) : null,
                tags, milestones: milestones.map(({ label, done }) => ({ label, done })),
                notes: notes.trim() || null,
            }
            await portalFetch.post("/admin/projects", payload)
            toast.success(`"${title}" project created!`)
            const returnTo = searchParams.get("returnTo")
            router.push(returnTo === "invoice" ? "/dashboard/invoices" : "/dashboard/projects")
        } catch (err: any) {
            toast.error(err.message ?? "Failed to create project")
        } finally {
            setSubmitting(false)
        }
    }

    const selectedStatus = STATUS_OPTIONS.find(s => s.value === status)
    const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === priority)

    const inquiryOptions = [
        { value: "", label: "None" },
        ...inquiries.map(i => ({ value: i.id, label: i.name + (i.company ? ` · ${i.company}` : "") })),
    ]

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 overflow-x-hidden">
            <form onSubmit={handleSubmit}>

                {/* Sticky top bar */}
                <div className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-100 dark:border-white/[0.07]">
                    <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <button type="button" onClick={() => router.back()}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all shrink-0">
                                <ChevronLeft size={16} />
                            </button>
                            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700 shrink-0" />
                            <div className="flex items-center gap-2 min-w-0">
                                <FolderKanban size={14} className="text-zinc-400 shrink-0" />
                                <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                    {title || "New Project"}
                                </span>
                                {title && clientName && (
                                    <span className="hidden sm:flex items-center gap-1 text-xs text-zinc-400">
                                        <span>·</span><Building2 size={10} />{clientName}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <div className="hidden md:flex items-center gap-1.5">
                                {selectedStatus && (
                                    <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold", selectedStatus.bg)}>
                                        <span className={cn("w-1.5 h-1.5 rounded-full", selectedStatus.color)} />{selectedStatus.label}
                                    </span>
                                )}
                                {selectedPriority && (
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                        {selectedPriority.icon} {selectedPriority.label}
                                    </span>
                                )}
                            </div>
                            <button type="button" onClick={() => router.back()}
                                className="h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting}
                                className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-[0.98] disabled:opacity-50 text-zinc-950 font-bold text-sm transition-all shadow-sm shadow-amber-200 dark:shadow-amber-500/20">
                                {submitting ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                <span className="hidden sm:inline">{submitting ? "Creating…" : "Create Project"}</span>
                                <span className="sm:hidden">{submitting ? "…" : "Create"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                        {/* ── Main column ── */}
                        <div className="lg:col-span-2 space-y-5 min-w-0">

                            {/* Basics */}
                            <Section icon={FolderKanban} title="Project Basics" description="Core information about the project">
                                <FieldWrap>
                                    <Label required>Client</Label>
                                    {loadingClients ? (
                                        <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                                    ) : (
                                        <ClientSelect
                                            value={clientId}
                                            onChange={(id, name) => { setClientId(id); setClientName(name); setErrors(e => ({ ...e, clientId: "" })) }}
                                            clients={clients}
                                        />
                                    )}
                                    {errors.clientId && <p className="text-xs text-red-500 mt-1.5">{errors.clientId}</p>}
                                </FieldWrap>

                                <FieldWrap>
                                    <Label required>Project Title</Label>
                                    <Input
                                        value={title}
                                        onChange={e => { setTitle(e.target.value); setErrors(v => ({ ...v, title: "" })) }}
                                        placeholder="e.g. Website Redesign, Mobile App MVP…"
                                        className={errors.title ? "border-red-400 focus:border-red-400" : ""}
                                    />
                                    {errors.title && <p className="text-xs text-red-500 mt-1.5">{errors.title}</p>}
                                </FieldWrap>

                                <FieldWrap>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Brief overview of the project scope and goals…"
                                        rows={3}
                                    />
                                </FieldWrap>

                                {inquiries.length > 0 && (
                                    <FieldWrap>
                                        <Label>Linked Inquiry</Label>
                                        <CustomSelect
                                            value={inquiryId}
                                            options={inquiryOptions}
                                            onChange={setInquiryId}
                                            placeholder="Link to an inquiry…"
                                        />
                                    </FieldWrap>
                                )}
                            </Section>

                            {/* Timeline & Budget */}
                            <Section icon={Calendar} title="Timeline & Budget" description="Project schedule and financial details">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FieldWrap>
                                        <Label>Start Date</Label>
                                        <DatePicker
                                            value={startDate}
                                            onChange={setStartDate}
                                            placeholder="Pick start date"
                                        />
                                    </FieldWrap>
                                    <FieldWrap>
                                        <Label>Due Date</Label>
                                        <DatePicker
                                            value={dueDate}
                                            onChange={val => { setDueDate(val); setErrors(v => ({ ...v, dueDate: "" })) }}
                                            placeholder="Pick due date"
                                            minDate={startDate ? new Date(startDate) : undefined}
                                            dropdownAlign="right"
                                        />
                                        {errors.dueDate && <p className="text-xs text-red-500 mt-1.5">{errors.dueDate}</p>}
                                    </FieldWrap>
                                </div>
                                <FieldWrap>
                                    <Label>Budget</Label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">$</span>
                                        <Input
                                            type="number" min="0" step="0.01"
                                            value={budget}
                                            onChange={e => { setBudget(e.target.value); setErrors(v => ({ ...v, budget: "" })) }}
                                            placeholder="0.00"
                                            className={cn("pl-7", errors.budget ? "border-red-400" : "")}
                                        />
                                    </div>
                                    {errors.budget && <p className="text-xs text-red-500 mt-1.5">{errors.budget}</p>}
                                </FieldWrap>
                            </Section>

                            {/* Contract */}
                            <Section icon={FileText} title="Contract" description="Contract status and reference link">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FieldWrap>
                                        <Label>Contract Status</Label>
                                        <CustomSelect
                                            value={contractStatus}
                                            options={CONTRACT_STATUS_OPTIONS as any}
                                            onChange={val => setContractStatus(val as typeof contractStatus)}
                                            placeholder="Select status..."
                                        />
                                    </FieldWrap>
                                    <FieldWrap>
                                        <Label>Contract URL</Label>
                                        <div className="relative">
                                            <Link size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                            <Input type="url" value={contractUrl}
                                                onChange={e => setContractUrl(e.target.value)}
                                                placeholder="https://…" className="pl-8"
                                            />
                                        </div>
                                    </FieldWrap>
                                </div>
                            </Section>

                            {/* Milestones */}
                            <Section icon={Milestone} title="Milestones" description="Key deliverables and checkpoints">
                                <MilestoneBuilder milestones={milestones} onChange={setMilestones} />
                                {milestones.length > 0 && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-400 rounded-full transition-all"
                                                style={{ width: `${(milestones.filter(m => m.done).length / milestones.length) * 100}%` }} />
                                        </div>
                                        <span className="text-xs text-zinc-400 tabular-nums shrink-0">
                                            {milestones.filter(m => m.done).length}/{milestones.length} done
                                        </span>
                                    </div>
                                )}
                            </Section>

                            {/* Notes */}
                            <Section icon={AlignLeft} title="Notes" description="Internal notes visible to admins only">
                                <Textarea
                                    value={notes} onChange={e => setNotes(e.target.value)}
                                    placeholder="Any internal context, special instructions, or reminders…"
                                    rows={4}
                                />
                            </Section>
                        </div>

                        {/* ── Sidebar ── */}
                        <div className="space-y-5 min-w-0">

                            {/* Status & Priority */}
                            <Section icon={Flag} title="Status & Priority">
                                <FieldWrap>
                                    <Label>Status</Label>
                                    <CustomSelect
                                        value={status}
                                        options={STATUS_SELECT_OPTIONS as any}
                                        onChange={val => setStatus(val as typeof status)}
                                    />
                                </FieldWrap>
                                <FieldWrap>
                                    <Label>Priority</Label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {PRIORITY_OPTIONS.map(opt => (
                                            <button key={opt.value} type="button" onClick={() => setPriority(opt.value)}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all",
                                                    priority === opt.value
                                                        ? opt.value === "urgent" ? "bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400"
                                                            : opt.value === "high" ? "bg-orange-50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/30 text-orange-600 dark:text-orange-400"
                                                                : opt.value === "medium" ? "bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-400"
                                                                    : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300"
                                                        : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/[0.08] text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-600 dark:hover:text-zinc-300"
                                                )}>
                                                <span className={cn("w-2 h-2 rounded-full shrink-0", opt.color)} />{opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </FieldWrap>
                            </Section>

                            {/* Progress */}
                            <Section icon={Milestone} title="Initial Progress">
                                <ProgressSlider value={progress} onChange={setProgress} />
                            </Section>

                            {/* Tags */}
                            <Section icon={Tag} title="Tags">
                                <TagInput tags={tags} onChange={setTags} />
                                {tags.length === 0 && (
                                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Press Enter or comma to add a tag</p>
                                )}
                            </Section>

                            {/* Summary */}
                            {(title || clientName) && (
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/5 rounded-2xl border border-amber-200/60 dark:border-amber-500/20 p-4 space-y-3">
                                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Summary</p>
                                    {title && <p className="text-sm font-bold text-zinc-900 dark:text-white">{title}</p>}
                                    {clientName && (
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                            <Building2 size={10} />{clientName}
                                        </div>
                                    )}
                                    {(startDate || dueDate) && (
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                            <Calendar size={10} />
                                            {startDate ? formatDate(new Date(startDate)) : "TBD"} → {dueDate ? formatDate(new Date(dueDate)) : "TBD"}
                                        </div>
                                    )}
                                    {budget && (
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                            <DollarSign size={10} />${parseFloat(budget).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </div>
                                    )}
                                    {milestones.length > 0 && (
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                            <Milestone size={10} />{milestones.length} milestone{milestones.length !== 1 ? "s" : ""}
                                        </div>
                                    )}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {tags.map(t => (
                                                <span key={t} className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-medium">#{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mobile submit */}
                            <button type="submit" disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] disabled:opacity-50 text-zinc-950 font-bold text-sm transition-all shadow-md shadow-amber-200 dark:shadow-amber-500/20 lg:hidden">
                                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                                {submitting ? "Creating…" : "Create Project"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}