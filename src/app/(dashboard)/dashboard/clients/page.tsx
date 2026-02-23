"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Client, ClientStatus, ClientType, seedClients } from "@/lib/clients"
import { cn } from "@/lib/utils"
import {
    Building2,
    Check,
    Globe,
    Mail,
    MapPin,
    MoreHorizontal,
    Pencil,
    Phone,
    Plus,
    Search,
    Trash2,
    User,
    X
} from "lucide-react"
import { useState } from "react"

const statusConfig: Record<ClientStatus, { label: string; className: string; dot: string }> = {
    active: {
        label: "Active",
        className: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
        dot: "bg-emerald-400",
    },
    prospect: {
        label: "Prospect",
        className: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
        dot: "bg-amber-400",
    },
    inactive: {
        label: "Inactive",
        className: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10",
        dot: "bg-zinc-400",
    },
}

const availableServices = [
    "Frontend Development", "Mobile Development", "Web Development",
    "Blockchain & Web3", "AI & Automation", "Cybersecurity",
    "Virtual Assistants", "Data Analysts", "Customer Support",
    "UI/UX Designers", "Marketing & SEO", "Video Editors",
]

function ClientModal({
    client,
    onClose,
    onSave,
}: {
    client?: Client
    onClose: () => void
    onSave: (c: Client) => void
}) {
    const [form, setForm] = useState<Partial<Client>>(
        client ?? { type: "company", status: "prospect", services: [] }
    )

    const set = (key: keyof Client, value: unknown) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const toggleService = (s: string) => {
        const current = form.services ?? []
        set("services", current.includes(s) ? current.filter((x) => x !== s) : [...current, s])
    }

    const handleSave = () => {
        if (!form.name || !form.email) return
        onSave({
            id: client?.id ?? Date.now().toString(),
            type: form.type ?? "company",
            name: form.name,
            email: form.email,
            phone: form.phone,
            website: form.website,
            location: form.location,
            company: form.company,
            position: form.position,
            status: form.status ?? "prospect",
            services: form.services ?? [],
            notes: form.notes,
            joinedDate: client?.joinedDate ?? new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        })
        onClose()
    }

    const inputClass = "w-full h-10 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-colors"
    const labelClass = "text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5 block"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                        {client ? "Edit Client" : "Add New Client"}
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <div className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">

                    {/* Type toggle */}
                    <div>
                        <label className={labelClass}>Client Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(["company", "individual"] as ClientType[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => set("type", t)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                                        form.type === t
                                            ? "bg-amber-400 border-amber-400 text-zinc-950"
                                            : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                    )}
                                >
                                    {t === "company" ? <Building2 size={15} /> : <User size={15} />}
                                    {t === "company" ? "Company" : "Individual"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className={labelClass}>{form.type === "company" ? "Company Name" : "Full Name"} *</label>
                        <input className={inputClass} placeholder={form.type === "company" ? "Acme Corp" : "John Doe"} value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
                    </div>

                    {/* Individual extras */}
                    {form.type === "individual" && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Company</label>
                                <input className={inputClass} placeholder="Company name" value={form.company ?? ""} onChange={(e) => set("company", e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Position</label>
                                <input className={inputClass} placeholder="CEO, CTO..." value={form.position ?? ""} onChange={(e) => set("position", e.target.value)} />
                            </div>
                        </div>
                    )}

                    {/* Email + Phone */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Email *</label>
                            <input className={inputClass} type="email" placeholder="hello@company.com" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input className={inputClass} placeholder="+1 555 000 0000" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
                        </div>
                    </div>

                    {/* Website + Location */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Website</label>
                            <input className={inputClass} placeholder="company.com" value={form.website ?? ""} onChange={(e) => set("website", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Location</label>
                            <input className={inputClass} placeholder="City, Country" value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className={labelClass}>Status</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["active", "prospect", "inactive"] as ClientStatus[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => set("status", s)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold capitalize transition-all",
                                        form.status === s
                                            ? statusConfig[s].className
                                            : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-600 hover:border-zinc-300 dark:hover:border-white/20"
                                    )}
                                >
                                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", form.status === s ? statusConfig[s].dot : "bg-zinc-300 dark:bg-zinc-600")} />
                                    {statusConfig[s].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <label className={labelClass}>Services Used</label>
                        <div className="flex flex-wrap gap-2">
                            {availableServices.map((s) => {
                                const selected = (form.services ?? []).includes(s)
                                return (
                                    <button
                                        key={s}
                                        onClick={() => toggleService(s)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                                            selected
                                                ? "bg-amber-400/10 border-amber-400/30 text-amber-600 dark:text-amber-400"
                                                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-600 hover:border-zinc-300 dark:hover:border-white/20"
                                        )}
                                    >
                                        {selected && <Check size={11} />}
                                        {s}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className={labelClass}>Notes</label>
                        <textarea
                            className={cn(inputClass, "h-20 py-2.5 resize-none")}
                            placeholder="Any relevant notes about this client..."
                            value={form.notes ?? ""}
                            onChange={(e) => set("notes", e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!form.name || !form.email}
                        className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {client ? "Save Changes" : "Add Client"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// CLIENT CARD
// ============================================================

function ClientCard({ client, onEdit, onDelete }: {
    client: Client
    onEdit: () => void
    onDelete: () => void
}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const status = statusConfig[client.status]

    return (
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-white/10 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold",
                        client.type === "company"
                            ? "bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400"
                            : "bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400"
                    )}>
                        {client.type === "company" ? <Building2 size={18} /> : <User size={18} />}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{client.name}</p>
                        {client.type === "individual" && client.company && (
                            <p className="text-xs text-zinc-400 dark:text-zinc-600 truncate">
                                {client.position ? `${client.position} @ ` : ""}{client.company}
                            </p>
                        )}
                    </div>
                </div>

                {/* Status + Menu */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold", status.className)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                        {status.label}
                    </span>

                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <MoreHorizontal size={15} />
                        </button>
                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 top-8 z-20 w-36 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden">
                                    <button
                                        onClick={() => { onEdit(); setMenuOpen(false) }}
                                        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <Pencil size={13} /> Edit
                                    </button>
                                    <button
                                        onClick={() => { onDelete(); setMenuOpen(false) }}
                                        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/5 transition-colors"
                                    >
                                        <Trash2 size={13} /> Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-1.5 mb-4">
                <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                    <Mail size={12} className="shrink-0" /> {client.email}
                </a>
                {client.phone && (
                    <span className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                        <Phone size={12} className="shrink-0" /> {client.phone}
                    </span>
                )}
                {client.website && (
                    <a href={`https://${client.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                        <Globe size={12} className="shrink-0" /> {client.website}
                    </a>
                )}
                {client.location && (
                    <span className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                        <MapPin size={12} className="shrink-0" /> {client.location}
                    </span>
                )}
            </div>

            {/* Services */}
            {client.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {client.services.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs text-zinc-500 dark:text-zinc-400">
                            {s}
                        </span>
                    ))}
                </div>
            )}

            {/* Notes */}
            {client.notes && (
                <p className="text-xs text-zinc-400 dark:text-zinc-600 italic border-t border-zinc-100 dark:border-white/5 pt-3 line-clamp-2">
                    {client.notes}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-white/5">
                <span className="text-xs text-zinc-300 dark:text-zinc-700">
                    {client.type === "company" ? "Company" : "Individual"}
                </span>
                <span className="text-xs text-zinc-300 dark:text-zinc-700">Since {client.joinedDate}</span>
            </div>
        </div>
    )
}

export default function DashboardClientsPage() {
    const [clients, setClients] = useState<Client[]>(seedClients)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<ClientStatus | "all">("all")
    const [filterType, setFilterType] = useState<ClientType | "all">("all")
    const [modalOpen, setModalOpen] = useState(false)
    const [editingClient, setEditingClient] = useState<Client | undefined>()

    const filtered = clients.filter((c) => {
        const matchSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company ?? "").toLowerCase().includes(search.toLowerCase()) ||
            c.services.some((s) => s.toLowerCase().includes(search.toLowerCase()))
        const matchStatus = filterStatus === "all" || c.status === filterStatus
        const matchType = filterType === "all" || c.type === filterType
        return matchSearch && matchStatus && matchType
    })

    const counts = {
        total: clients.length,
        active: clients.filter((c) => c.status === "active").length,
        prospect: clients.filter((c) => c.status === "prospect").length,
        companies: clients.filter((c) => c.type === "company").length,
        individuals: clients.filter((c) => c.type === "individual").length,
    }

    const handleSave = (client: Client) => {
        setClients((prev) =>
            prev.find((c) => c.id === client.id)
                ? prev.map((c) => (c.id === client.id ? client : c))
                : [...prev, client]
        )
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this client?")) {
            setClients((prev) => prev.filter((c) => c.id !== id))
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 md:p-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Clients</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage your individual and company clients
                    </p>
                </div>
                <button
                    onClick={() => { setEditingClient(undefined); setModalOpen(true) }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-sm font-bold transition-colors shrink-0"
                >
                    <Plus size={16} />
                    Add Client
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                    { label: "Total", value: counts.total, color: "text-zinc-900 dark:text-white" },
                    { label: "Active", value: counts.active, color: "text-emerald-500 dark:text-emerald-400" },
                    { label: "Prospects", value: counts.prospect, color: "text-amber-500 dark:text-amber-400" },
                    { label: "Companies", value: counts.companies, color: "text-zinc-700 dark:text-zinc-300" },
                    { label: "Individuals", value: counts.individuals, color: "text-blue-500 dark:text-blue-400" },
                ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4 text-center">
                        <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, company, or service..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 h-11 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                </div>

                {/* Status filter */}
                <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as ClientStatus | "all")}>
                    <SelectTrigger className="h-11 w-[140px] rounded-xl border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="prospect">Prospect</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>

                {/* Type filter */}
                <Select value={filterType} onValueChange={(v) => setFilterType(v as ClientType | "all")}>
                    <SelectTrigger className="h-11 w-[140px] rounded-xl border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results count */}
            <p className="text-xs text-zinc-400 dark:text-zinc-600 -mt-2">
                Showing {filtered.length} of {clients.length} clients
            </p>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                        <Building2 size={24} className="text-zinc-300 dark:text-zinc-600" />
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">No clients found</p>
                    <p className="text-zinc-400 dark:text-zinc-600 text-sm">
                        {search ? `No results for "${search}"` : "Add your first client to get started"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onEdit={() => { setEditingClient(client); setModalOpen(true) }}
                            onDelete={() => handleDelete(client.id)}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <ClientModal
                    client={editingClient}
                    onClose={() => { setModalOpen(false); setEditingClient(undefined) }}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}