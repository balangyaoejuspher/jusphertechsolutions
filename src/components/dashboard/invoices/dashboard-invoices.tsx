"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CustomSelect } from "@/components/ui/custom-select"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/helpers/format"
import { INVOICE_STATUS_CONFIG } from "@/lib/helpers/constants"
import type { Invoice, InvoiceStatus, Currency, LineItem } from "@/types"
import {
    Plus, Search, Send, Edit2, Trash2, Eye, CheckCircle,
    Clock, AlertTriangle, FileText, X, ChevronRight,
    Download, Calendar, DollarSign, Briefcase, User,
    Mail, Save, RefreshCw, CreditCard, MoreHorizontal,
    ArrowUpRight, Banknote, CircleDot,
} from "lucide-react"
import { useMemo, useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { portalFetch } from "@/lib/api/private-fetcher"
import { DatePicker } from "@/components/ui/date-picker"
import { ClientRow } from "@/server/db/schema"
interface ProjectRow {
    id: string
    title: string
}
interface InvoiceWithClient {
    id: string
    number: string
    projectId: string | null
    project: string
    clientId: string
    clientName: string | null
    clientEmail: string | null
    issued: string
    due: string
    amount: string
    paid: string
    status: InvoiceStatus
    items: LineItem[]
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
}

interface InvoiceStats {
    totalBilled: number
    totalPaid: number
    totalOutstanding: number
    totalOverdue: number
    totalDraft: number
    countByStatus: Record<string, number>
}

interface PaginatedResponse {
    data: InvoiceWithClient[]
    total: number
    page: number
    pageSize: number
    stats: InvoiceStats
}

const STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "unpaid", label: "Unpaid" },
    { value: "partial", label: "Partial" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
    { value: "disputed", label: "Disputed" },
] as const

const INVOICE_TABS = [
    { label: "All", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Unpaid", value: "unpaid" },
    { label: "Partial", value: "partial" },
    { label: "Paid", value: "paid" },
    { label: "Overdue", value: "overdue" },
]

type StatusOption = typeof STATUS_OPTIONS[number]["value"]

export function DashboardInvoicesSkeleton() {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-background overflow-hidden">
            <div className="px-6 md:px-8 pt-6 pb-5 border-b border-border shrink-0">
                <div className="flex items-start justify-between mb-5">
                    <div><Skeleton className="h-7 w-40 mb-2" /><Skeleton className="h-4 w-56" /></div>
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-4">
                            <Skeleton className="h-3 w-20 mb-3" /><Skeleton className="h-6 w-28" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-3"><Skeleton className="h-10 w-80 rounded-xl" /><Skeleton className="h-10 w-48 rounded-xl" /></div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 px-5 py-4 border-b border-border">
                            <Skeleton className="w-2 h-2 rounded-full mt-2 shrink-0" />
                            <div className="flex-1">
                                <div className="flex justify-between mb-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-16" /></div>
                                <Skeleton className="h-3 w-48 mb-2" /><Skeleton className="h-5 w-20 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                {label}
            </label>
            {children}
        </div>
    )
}

function InputWithIcon({
    icon: Icon, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType }) {
    return (
        <div className="relative">
            {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />}
            <input
                {...props}
                className={cn(
                    "w-full py-2.5 rounded-xl border border-input text-sm bg-background text-foreground outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-muted-foreground/50",
                    Icon ? "pl-9 pr-4" : "px-4",
                    props.className
                )}
            />
        </div>
    )
}

function InvoiceFormModal({
    invoice, onClose, onSave, currency,
}: {
    invoice: InvoiceWithClient | null
    onClose: () => void
    onSave: (invoice: InvoiceWithClient) => void
    currency: Currency
}) {
    const isEditing = !!invoice
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<Partial<InvoiceWithClient>>(
        invoice || {
            number: "",
            project: "", clientId: "", clientName: "", clientEmail: "",
            issued: new Date().toISOString().split("T")[0],
            due: "", amount: "0", paid: "0", status: "draft" as InvoiceStatus,
            items: [{ description: "", qty: 1, rate: 0, amount: 0 }],
            notes: "",
        }
    )
    const [items, setItems] = useState<LineItem[]>(
        invoice?.items || [{ description: "", qty: 1, rate: 0, amount: 0 }]
    )
    const [clients, setClients] = useState<ClientRow[]>([])
    const [clientsLoading, setClientsLoading] = useState(true)

    const [projects, setProjects] = useState<ProjectRow[]>([])
    const [projectsLoading, setProjectsLoading] = useState(false)

    const handleClientChange = (clientId: string) => {
        const client = clients.find(c => c.id === clientId)
        if (!client) return

        setFormData(prev => ({
            ...prev,
            clientId: client.id,
            clientName: client.name,
            clientEmail: client.email,
            projectId: "",
            project: "",
        }))

        if (!clientId) return

        setProjectsLoading(true)

        portalFetch.get<ProjectRow[]>(`/admin/clients/${clientId}/projects`)
            .then(setProjects)
            .catch(() => toast.error("Failed to load projects"))
            .finally(() => setProjectsLoading(false))
    }

    useEffect(() => {
        portalFetch.get<ClientRow[]>("/admin/clients")
            .then(setClients)
            .catch(() => toast.error("Failed to load clients"))
            .finally(() => setClientsLoading(false))
    }, [])

    useEffect(() => {
        const draft = sessionStorage.getItem("invoice_draft")
        if (draft) {
            try {
                const { formData: savedForm, items: savedItems } = JSON.parse(draft)
                setFormData(savedForm)
                setItems(savedItems)
                sessionStorage.removeItem("invoice_draft")

                if (savedForm.clientId) {
                    setProjectsLoading(true)
                    portalFetch.get<ProjectRow[]>(`/admin/clients/${savedForm.clientId}/projects`)
                        .then(setProjects)
                        .catch(() => toast.error("Failed to load projects"))
                        .finally(() => setProjectsLoading(false))
                }
            } catch {
                sessionStorage.removeItem("invoice_draft")
            }
        }
    }, [])

    const clientOptions = clients.map(c => ({
        value: c.id,
        label: c.company ? `${c.name} · ${c.company}` : c.name,
    }))

    const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        if (field === "qty" || field === "rate") {
            newItems[index].amount = Number(newItems[index].qty) * Number(newItems[index].rate)
        }
        setItems(newItems)
        setFormData(prev => ({ ...prev, amount: String(newItems.reduce((s, i) => s + i.amount, 0)) }))
    }

    const addItem = () => setItems([...items, { description: "", qty: 1, rate: 0, amount: 0 }])
    const removeItem = (i: number) => {
        if (items.length > 1) {
            const next = items.filter((_, idx) => idx !== i)
            setItems(next)
            setFormData(prev => ({ ...prev, amount: String(next.reduce((s, i) => s + i.amount, 0)) }))
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const payload = {
                ...formData,
                items,
                amount: items.reduce((s, i) => s + i.amount, 0),
            }
            let saved: InvoiceWithClient
            if (isEditing && invoice?.id) {
                saved = await portalFetch.patch<InvoiceWithClient>(`/admin/invoices/${invoice.id}`, payload)
            } else {
                saved = await portalFetch.post<InvoiceWithClient>("/admin/invoices", payload)
            }
            onSave(saved)
            onClose()
            toast.success(isEditing ? "Invoice updated" : "Invoice created")
        } catch {
            toast.error("Failed to save invoice")
        } finally {
            setSaving(false)
        }
    }

    const fmt = (n: number) => formatCurrency(n, currency)
    const total = items.reduce((s, i) => s + i.amount, 0)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            {isEditing ? <Edit2 size={15} className="text-amber-500 dark:text-amber-400" /> : <Plus size={15} className="text-amber-500 dark:text-amber-400" />}
                        </div>
                        <div>
                            <h2 className="font-bold text-foreground text-base">{isEditing ? "Edit Invoice" : "New Invoice"}</h2>
                            <p className="text-xs text-muted-foreground">{formData.number || "Auto-generated"}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <X size={15} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">

                    {/* Client */}
                    <Field label="Client">
                        {clientsLoading ? (
                            <div className="h-10 bg-muted animate-pulse rounded-xl" />
                        ) : (
                            <CustomSelect
                                value={formData.clientId ?? ""}
                                options={clientOptions}
                                onChange={handleClientChange}
                                placeholder="Select a client..."
                            />
                        )}
                    </Field>

                    {/* Auto-populated client info — read only */}
                    {formData.clientId && (
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Client Name">
                                <InputWithIcon icon={User}
                                    value={formData.clientName ?? ""}
                                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                    placeholder="Client name"
                                />
                            </Field>
                            <Field label="Client Email">
                                <InputWithIcon icon={Mail} type="email"
                                    value={formData.clientEmail ?? ""}
                                    onChange={e => setFormData({ ...formData, clientEmail: e.target.value })}
                                    placeholder="client@example.com"
                                />
                            </Field>
                        </div>
                    )}

                    {/* Project + Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Project">
                            {projectsLoading ? (
                                <div className="h-10 bg-muted animate-pulse rounded-xl" />
                            ) : formData.clientId && projects.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border p-4 flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                                        <Briefcase size={14} className="text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground">No projects yet</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 mb-3">
                                            This client has no projects. Create one first, then come back to finish the invoice.
                                        </p>
                                        <button
                                            onClick={() => {
                                                sessionStorage.setItem("invoice_draft", JSON.stringify({ formData, items }))
                                                window.location.href = `/dashboard/projects/new?clientId=${formData.clientId}&returnTo=invoice`
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all"
                                        >
                                            <Plus size={12} /> Create a Project
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <CustomSelect
                                    value={formData.projectId ?? ""}
                                    options={projects.map(p => ({ value: p.id, label: p.title }))}
                                    onChange={val => {
                                        const project = projects.find(p => p.id === val)
                                        if (!project) return
                                        setFormData(prev => ({
                                            ...prev,
                                            projectId: project.id,
                                            project: project.title,
                                        }))
                                    }}
                                    placeholder={formData.clientId ? "Select a project..." : "Select a client first"}
                                    disabled={!formData.clientId || projectsLoading}
                                />
                            )}
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Issued">
                                <DatePicker
                                    value={formData.issued ?? ""}
                                    onChange={val => setFormData({ ...formData, issued: val })}
                                    placeholder="Issued date"
                                />
                            </Field>
                            <Field label="Due">
                                <DatePicker
                                    value={formData.due ?? ""}
                                    onChange={val => setFormData({ ...formData, due: val })}
                                    placeholder="Due date"
                                    minDate={formData.issued ? new Date(formData.issued) : undefined}
                                    dropdownAlign="right"
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Line Items</label>
                            <button onClick={addItem} className="text-xs font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1 transition-colors">
                                <Plus size={12} /> Add Item
                            </button>
                        </div>
                        <div className="border border-border rounded-xl overflow-hidden">
                            <div className="grid grid-cols-[1fr_64px_88px_88px_32px] gap-2 px-4 py-2.5 bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <span>Description</span>
                                <span className="text-right">Qty</span>
                                <span className="text-right">Rate</span>
                                <span className="text-right">Amount</span>
                                <span />
                            </div>
                            {items.map((item, i) => (
                                <div key={i} className={cn("grid grid-cols-[1fr_64px_88px_88px_32px] gap-2 px-4 py-2 items-center", i > 0 && "border-t border-border")}>
                                    <input
                                        value={item.description}
                                        onChange={e => updateItem(i, "description", e.target.value)}
                                        placeholder="Description"
                                        className="px-3 py-2 rounded-lg border border-input text-xs bg-background text-foreground outline-none focus:border-amber-400 transition-all placeholder:text-muted-foreground/50"
                                    />
                                    <input type="number" value={item.qty}
                                        onChange={e => updateItem(i, "qty", parseFloat(e.target.value) || 0)}
                                        className="px-2 py-2 rounded-lg border border-input text-xs bg-background text-foreground outline-none focus:border-amber-400 transition-all text-right"
                                    />
                                    <input type="number" value={item.rate}
                                        onChange={e => updateItem(i, "rate", parseFloat(e.target.value) || 0)}
                                        className="px-2 py-2 rounded-lg border border-input text-xs bg-background text-foreground outline-none focus:border-amber-400 transition-all text-right"
                                    />
                                    <span className="text-xs font-semibold text-foreground text-right tabular-nums">{fmt(item.amount)}</span>
                                    <button onClick={() => removeItem(i)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                                        <X size={13} />
                                    </button>
                                </div>
                            ))}
                            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
                                <span className="text-xs font-bold text-foreground">Total</span>
                                <span className="text-sm font-black text-foreground tabular-nums">{fmt(total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <Field label="Notes">
                        <textarea rows={3}
                            value={formData.notes ?? ""}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional notes for the client..."
                            className="w-full px-4 py-3 rounded-xl border border-input text-sm text-foreground bg-background outline-none focus:border-amber-400 transition-all resize-none placeholder:text-muted-foreground/50"
                        />
                    </Field>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
                    <Button onClick={handleSave} disabled={saving}
                        className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2">
                        {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                        {isEditing ? "Save Changes" : "Save as Draft"}
                    </Button>
                    <Button variant="outline" onClick={onClose}
                        className="rounded-xl border-border h-11 px-6">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}

function SendInvoiceModal({ invoice, onClose, onSent }: {
    invoice: InvoiceWithClient
    onClose: () => void
    onSent: (updated: InvoiceWithClient) => void
}) {
    const [email, setEmail] = useState(invoice.clientEmail)
    const [subject, setSubject] = useState(`Invoice ${invoice.number}`)
    const [message, setMessage] = useState(`Hi ${invoice.clientName},\n\nPlease find attached invoice ${invoice.number} for ${invoice.project}.\n\nTotal: $${Number(invoice.amount).toLocaleString()}\nDue: ${invoice.due}\n\nThank you!`)
    const [sending, setSending] = useState(false)

    const handleSend = async () => {
        setSending(true)
        try {
            const updated = await portalFetch.post<InvoiceWithClient>(`/admin/invoices/${invoice.id}/actions`, {
                action: "send", email, subject, message,
            })
            onSent(updated)
            onClose()
            toast.success("Invoice sent successfully")
        } catch {
            toast.error("Failed to send invoice")
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border shadow-2xl w-full max-w-lg flex flex-col rounded-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Send size={15} className="text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-foreground text-base">Send Invoice</h2>
                            <p className="text-xs text-muted-foreground">{invoice.number} · {invoice.clientName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                        <X size={15} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border">
                        <span className="text-xs text-muted-foreground">Amount due</span>
                        <span className="text-sm font-black text-foreground">${Number(invoice.amount).toLocaleString()}</span>
                    </div>
                    <Field label="To">
                        <InputWithIcon icon={Mail} type="email" value={email ?? ""} onChange={e => setEmail(e.target.value)} />
                    </Field>
                    <Field label="Subject">
                        <InputWithIcon value={subject} onChange={e => setSubject(e.target.value)} />
                    </Field>
                    <Field label="Message">
                        <textarea rows={6} value={message} onChange={e => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-input text-sm text-foreground bg-background outline-none focus:border-emerald-400 transition-all resize-none"
                        />
                    </Field>
                </div>

                <div className="px-6 py-4 border-t border-border flex gap-3">
                    <Button onClick={handleSend} disabled={sending}
                        className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-11 gap-2">
                        {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                        {sending ? "Sending..." : "Send Invoice"}
                    </Button>
                    <Button variant="outline" onClick={onClose} className="rounded-xl border-border h-11 px-6">Cancel</Button>
                </div>
            </div>
        </div>
    )
}

function DeleteModal({ invoice, onClose, onDeleted }: {
    invoice: InvoiceWithClient
    onClose: () => void
    onDeleted: () => void
}) {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await portalFetch.delete(`/admin/invoices/${invoice.id}`)
            onDeleted()
            onClose()
            toast.success("Invoice deleted")
        } catch {
            toast.error("Failed to delete invoice")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border shadow-2xl w-full max-w-sm p-6 rounded-2xl">
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
                        <Trash2 size={22} className="text-destructive" />
                    </div>
                    <h2 className="font-bold text-foreground text-lg mb-1">Delete Invoice?</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Delete <span className="font-semibold text-foreground">{invoice.number}</span>? This cannot be undone.
                    </p>
                    <div className="flex gap-3 w-full">
                        <Button onClick={handleDelete} disabled={deleting}
                            className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold h-11">
                            {deleting ? <RefreshCw size={14} className="animate-spin" /> : "Delete"}
                        </Button>
                        <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl border-border h-11">Cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function RecordPaymentModal({ invoice, onClose, onUpdated, currency }: {
    invoice: InvoiceWithClient
    onClose: () => void
    onUpdated: (updated: InvoiceWithClient) => void
    currency: Currency
}) {
    const balance = Number(invoice.amount) - Number(invoice.paid)
    const [amount, setAmount] = useState(String(balance))
    const [saving, setSaving] = useState(false)
    const fmt = (n: number) => formatCurrency(n, currency)

    const handleSave = async () => {
        const num = parseFloat(amount)
        if (isNaN(num) || num <= 0) { toast.error("Enter a valid amount"); return }
        setSaving(true)
        try {
            const updated = await portalFetch.post<InvoiceWithClient>(`/admin/invoices/${invoice.id}/actions`, {
                action: "record_payment", amount: num,
            })
            onUpdated(updated)
            onClose()
            toast.success("Payment recorded")
        } catch {
            toast.error("Failed to record payment")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border shadow-2xl w-full max-w-sm rounded-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Banknote size={15} className="text-amber-500 dark:text-amber-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-foreground text-base">Record Payment</h2>
                            <p className="text-xs text-muted-foreground">Balance: {fmt(balance)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                        <X size={15} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <Field label={`Amount (${currency})`}>
                        <InputWithIcon icon={DollarSign} type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </Field>
                    <div className="flex gap-2">
                        {[25, 50, 75, 100].map(pct => (
                            <button key={pct} onClick={() => setAmount(String((balance * pct / 100).toFixed(2)))}
                                className="flex-1 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all">
                                {pct}%
                            </button>
                        ))}
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-border flex gap-3">
                    <Button onClick={handleSave} disabled={saving}
                        className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2">
                        {saving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        Record Payment
                    </Button>
                    <Button variant="outline" onClick={onClose} className="rounded-xl border-border h-11 px-6">Cancel</Button>
                </div>
            </div>
        </div>
    )
}

function InvoiceDetail({ invoice, onClose, onEdit, onSend, onDelete, onMarkPaid, onRecordPayment, fmt }: {
    invoice: InvoiceWithClient
    onClose: () => void
    onEdit: () => void
    onSend: () => void
    onDelete: () => void
    onMarkPaid: () => void
    onRecordPayment: () => void
    fmt: (n: number) => string
}) {
    const cfg = INVOICE_STATUS_CONFIG[invoice.status as InvoiceStatus]
    const StatusIcon = cfg.icon
    const balance = Number(invoice.amount) - Number(invoice.paid)
    const paidPct = Number(invoice.amount) > 0 ? (Number(invoice.paid) / Number(invoice.amount)) * 100 : 0

    const canSend = invoice.status === "draft"
    const canEdit = ["draft", "unpaid"].includes(invoice.status)
    const canMarkPaid = !["paid", "draft"].includes(invoice.status)
    const canRecordPayment = !["paid", "draft"].includes(invoice.status)
    const canDelete = invoice.status === "draft"

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground mb-0.5">{invoice.number}</p>
                        <h2 className="font-bold text-foreground text-lg leading-tight">{invoice.project}</h2>
                        <div className="flex items-center gap-1.5 mt-1">
                            <User size={11} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{invoice.clientName}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold", cfg.color)}>
                            <StatusIcon size={11} />{cfg.label}
                        </span>
                        <button onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Amount cards */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                        { label: "Total", value: fmt(Number(invoice.amount)), highlight: false },
                        { label: "Paid", value: fmt(Number(invoice.paid)), highlight: false },
                        { label: "Balance", value: fmt(balance), highlight: balance > 0 },
                    ].map(s => (
                        <div key={s.label} className={cn(
                            "p-3 rounded-xl text-center border",
                            s.highlight
                                ? "bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20"
                                : "bg-muted/30 border-border"
                        )}>
                            <p className={cn("text-sm font-black tabular-nums", s.highlight ? "text-amber-600 dark:text-amber-400" : "text-foreground")}>
                                {s.value}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                {Number(invoice.amount) > 0 && (
                    <div className="space-y-1">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-400 rounded-full transition-all duration-700"
                                style={{ width: `${Math.min(100, paidPct)}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-right">{Math.round(paidPct)}% paid</p>
                    </div>
                )}
            </div>

            {/* Meta */}
            <div className="px-6 py-4 border-b border-border space-y-2">
                {[
                    { label: "Email", value: invoice.clientEmail, icon: Mail },
                    { label: "Issued", value: invoice.issued, icon: Calendar },
                    { label: "Due", value: invoice.due, icon: Clock },
                ].map(row => (
                    <div key={row.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <row.icon size={12} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{row.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-foreground">{row.value}</span>
                    </div>
                ))}
            </div>

            {/* Line items */}
            <div className="px-6 py-4 flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Line Items</p>
                <div className="border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2.5 bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>Description</span>
                        <span className="text-right">Qty</span>
                        <span className="text-right">Rate</span>
                        <span className="text-right">Amount</span>
                    </div>
                    {invoice.items?.map((item, i) => (
                        <div key={i} className={cn("grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-3 text-xs", i > 0 && "border-t border-border")}>
                            <span className="text-foreground font-medium leading-snug">{item.description}</span>
                            <span className="text-muted-foreground text-right tabular-nums">{item.qty}</span>
                            <span className="text-muted-foreground text-right tabular-nums">{fmt(item.rate)}</span>
                            <span className="text-foreground font-semibold text-right tabular-nums">{fmt(item.amount)}</span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
                        <span className="text-xs font-bold text-foreground">Total</span>
                        <span className="text-sm font-black text-foreground tabular-nums">{fmt(Number(invoice.amount))}</span>
                    </div>
                </div>

                {invoice.notes && (
                    <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Notes</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{invoice.notes}</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-border space-y-2">
                {canSend && (
                    <Button onClick={onSend} className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-10 gap-2 text-sm">
                        <Send size={14} /> Send to Client
                    </Button>
                )}
                {canMarkPaid && (
                    <Button onClick={onMarkPaid} className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-10 gap-2 text-sm">
                        <CheckCircle size={14} /> Mark as Fully Paid
                    </Button>
                )}
                {canRecordPayment && (
                    <Button onClick={onRecordPayment} variant="outline" className="w-full rounded-xl border-border h-10 gap-2 text-sm">
                        <Banknote size={14} /> Record Payment
                    </Button>
                )}
                <div className="flex gap-2">
                    {canEdit && (
                        <Button onClick={onEdit} variant="outline" className="flex-1 rounded-xl border-border h-9 gap-1.5 text-xs">
                            <Edit2 size={12} /> Edit
                        </Button>
                    )}
                    <Button variant="outline" className="flex-1 rounded-xl border-border h-9 gap-1.5 text-xs text-muted-foreground">
                        <Download size={12} /> PDF
                    </Button>
                    {canDelete && (
                        <Button onClick={onDelete} variant="outline"
                            className="flex-1 rounded-xl border-border h-9 gap-1.5 text-xs text-destructive hover:border-destructive/30 hover:bg-destructive/10">
                            <Trash2 size={12} /> Delete
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

const PAGE_SIZE = 20

export default function DashboardInvoices() {
    const [invoices, setInvoices] = useState<InvoiceWithClient[]>([])
    const [stats, setStats] = useState<InvoiceStats | null>(null)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [currency] = useState<Currency>("USD")

    const [search, setSearch] = useState("")
    const [debSearch, setDebSearch] = useState("")
    const [status, setStatus] = useState<StatusOption>("all")
    const [activeTab, setActiveTab] = useState("all")
    const [selected, setSelected] = useState<InvoiceWithClient | null>(null)

    const [showForm, setShowForm] = useState(false)
    const [editInvoice, setEditInvoice] = useState<InvoiceWithClient | null>(null)
    const [showSend, setShowSend] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showPayment, setShowPayment] = useState(false)

    const fmt = (n: number) => formatCurrency(n, currency)

    useEffect(() => {
        const t = setTimeout(() => setDebSearch(search), 350)
        return () => clearTimeout(t)
    }, [search])

    useEffect(() => { setPage(1) }, [debSearch, activeTab])

    const fetchInvoices = useCallback(() => {
        setLoading(true)
        const params = new URLSearchParams({
            page: String(page), pageSize: String(PAGE_SIZE),
            ...(debSearch && { search: debSearch }),
            ...(activeTab !== "all" && { status: activeTab }),
        })

        portalFetch.get<PaginatedResponse>(`/admin/invoices?${params}`)
            .then(res => {
                setInvoices(res.data)
                setTotal(res.total)
                setStats(res.stats)
            })
            .catch(() => toast.error("Failed to load invoices"))
            .finally(() => setLoading(false))
    }, [page, debSearch, activeTab])

    useEffect(() => { fetchInvoices() }, [fetchInvoices])

    useEffect(() => {
        const draft = sessionStorage.getItem("invoice_draft")
        if (draft) {
            setEditInvoice(null)
            setShowForm(true)
        }
    }, [])

    const handleMarkPaid = async () => {
        if (!selected) return
        try {
            const updated = await portalFetch.post<InvoiceWithClient>(`/admin/invoices/${selected.id}/actions`, { action: "mark_paid" })
            setSelected(updated)
            setInvoices(prev => prev.map(inv => inv.id === updated.id ? updated : inv))
            toast.success("Marked as paid")
        } catch {
            toast.error("Failed to update invoice")
        }
    }

    const handleSaved = (updated: InvoiceWithClient) => {
        setInvoices(prev => {
            const exists = prev.find(i => i.id === updated.id)
            return exists ? prev.map(i => i.id === updated.id ? updated : i) : [updated, ...prev]
        })
        if (selected?.id === updated.id) setSelected(updated)
    }

    const handleDeleted = () => {
        if (!selected) return
        setInvoices(prev => prev.filter(i => i.id !== selected.id))
        setSelected(null)
    }

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { all: total }
        if (stats) {
            Object.entries(stats.countByStatus).forEach(([k, v]) => { counts[k] = v })
        }
        return counts
    }, [stats, total])

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-background overflow-hidden">

            {/* Header */}
            <div className="px-6 md:px-8 pt-6 pb-5 bg-background border-b border-border shrink-0">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-0.5">Invoices</h1>
                        <p className="text-muted-foreground text-sm">Create, send, and manage client invoices.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={fetchInvoices}
                            className="h-10 px-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center gap-2 text-xs font-medium">
                            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                        </button>
                        <Button onClick={() => { setEditInvoice(null); setShowForm(true) }}
                            className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-10 gap-2 text-sm">
                            <Plus size={14} /> New Invoice
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                {stats ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                        {[
                            { label: "Total Billed", value: fmt(stats.totalBilled), icon: FileText, color: "text-muted-foreground" },
                            { label: "Total Paid", value: fmt(stats.totalPaid), icon: CheckCircle, color: "text-emerald-500 dark:text-emerald-400" },
                            { label: "Outstanding", value: fmt(stats.totalOutstanding), icon: Clock, color: "text-amber-500 dark:text-amber-400" },
                            { label: "Overdue", value: fmt(stats.totalOverdue), icon: AlertTriangle, color: "text-destructive" },
                            { label: "Draft", value: fmt(stats.totalDraft), icon: Edit2, color: "text-muted-foreground" },
                        ].map(s => (
                            <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <s.icon size={12} className={s.color} />
                                    <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
                                </div>
                                <p className="text-lg font-black text-foreground tabular-nums">{s.value}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-card border border-border rounded-2xl p-4">
                                <Skeleton className="h-3 w-20 mb-3" /><Skeleton className="h-6 w-24" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs + Search */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-1 p-1 bg-muted/50 border border-border rounded-xl overflow-x-auto">
                        {INVOICE_TABS.map(tab => (
                            <button key={tab.value}
                                onClick={() => { setActiveTab(tab.value); setSelected(null) }}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                                    activeTab === tab.value
                                        ? "bg-background text-foreground shadow-sm border border-border"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab.label}
                                {tabCounts[tab.value] > 0 && (
                                    <span className={cn(
                                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                        activeTab === tab.value
                                            ? "bg-amber-400/20 text-amber-600 dark:text-amber-400"
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        {tabCounts[tab.value]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search invoices..."
                            className="w-full pl-9 pr-4 h-10 rounded-xl border border-input text-sm bg-background text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-amber-400 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Split panel */}
            <div className="flex flex-1 overflow-hidden">

                {/* List */}
                <div className={cn(
                    "flex flex-col overflow-y-auto border-r border-border shrink-0 bg-background",
                    selected ? "hidden md:flex md:w-80 lg:w-96" : "w-full"
                )}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-4 px-5 py-4 border-b border-border">
                                <Skeleton className="w-2 h-2 rounded-full mt-2 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between"><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-16" /></div>
                                    <Skeleton className="h-3 w-40" /><Skeleton className="h-5 w-20 rounded-md" />
                                </div>
                            </div>
                        ))
                    ) : invoices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 py-20 text-center">
                            <FileText size={32} className="text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground text-sm">No invoices found</p>
                        </div>
                    ) : (
                        invoices.map(inv => {
                            const cfg = INVOICE_STATUS_CONFIG[inv.status as InvoiceStatus]
                            const isSelected = selected?.id === inv.id
                            const balance = Number(inv.amount) - Number(inv.paid)
                            return (
                                <button key={inv.id} onClick={() => setSelected(inv)}
                                    className={cn(
                                        "flex items-start gap-4 px-5 py-4 border-b border-border text-left transition-all hover:bg-muted/30",
                                        isSelected && "bg-card border-l-2 border-l-amber-400"
                                    )}
                                >
                                    <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", cfg.dot)} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-0.5">
                                            <p className="text-sm font-bold text-foreground truncate">{inv.number}</p>
                                            <p className="text-sm font-black text-foreground shrink-0 tabular-nums">{fmt(Number(inv.amount))}</p>
                                        </div>
                                        <p className="text-xs text-foreground/80 truncate">{inv.project}</p>
                                        <p className="text-[10px] text-muted-foreground truncate mb-2">{inv.clientName}</p>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold", cfg.color)}>
                                                <cfg.icon size={9} />{cfg.label}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Due {inv.due}</span>
                                        </div>
                                        {balance > 0 && inv.status !== "draft" && (
                                            <p className="text-[10px] text-amber-500 dark:text-amber-400 font-semibold mt-1">
                                                {fmt(balance)} remaining
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight size={14} className="text-muted-foreground/40 shrink-0 mt-1" />
                                </button>
                            )
                        })
                    )}
                </div>

                {/* Detail panel */}
                {selected ? (
                    <div className="flex-1 overflow-hidden flex flex-col bg-card">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-border md:hidden">
                            <button onClick={() => setSelected(null)}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold hover:text-foreground transition-colors">
                                <ChevronRight size={12} className="rotate-180" /> Back
                            </button>
                        </div>
                        <InvoiceDetail
                            invoice={selected}
                            onClose={() => setSelected(null)}
                            onEdit={() => { setEditInvoice(selected); setShowForm(true) }}
                            onSend={() => setShowSend(true)}
                            onDelete={() => setShowDelete(true)}
                            onMarkPaid={handleMarkPaid}
                            onRecordPayment={() => setShowPayment(true)}
                            fmt={fmt}
                        />
                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center bg-card">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                                <Eye size={22} className="text-muted-foreground/50" />
                            </div>
                            <p className="text-sm font-semibold text-muted-foreground">Select an invoice to view details</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showForm && (
                <InvoiceFormModal
                    invoice={editInvoice}
                    onClose={() => setShowForm(false)}
                    onSave={handleSaved}
                    currency={currency}
                />
            )}
            {showSend && selected && (
                <SendInvoiceModal
                    invoice={selected}
                    onClose={() => setShowSend(false)}
                    onSent={inv => { setSelected(inv); handleSaved(inv) }}
                />
            )}
            {showDelete && selected && (
                <DeleteModal
                    invoice={selected}
                    onClose={() => setShowDelete(false)}
                    onDeleted={handleDeleted}
                />
            )}
            {showPayment && selected && (
                <RecordPaymentModal
                    invoice={selected}
                    onClose={() => setShowPayment(false)}
                    onUpdated={inv => { setSelected(inv); handleSaved(inv) }}
                    currency={currency}
                />
            )}
        </div>
    )
}