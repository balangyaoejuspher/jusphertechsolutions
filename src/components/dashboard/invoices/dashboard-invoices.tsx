"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/helpers/format"
import { INVOICE_STATUS_CONFIG } from "@/lib/helpers/constants"
import type { Invoice, InvoiceStatus, Currency, LineItem } from "@/types"
import {
    Plus, Search, Send, Edit2, Trash2, Eye, CheckCircle,
    Clock, AlertTriangle, FileText, X, ChevronRight,
    Download, MoreHorizontal, Calendar, DollarSign,
    Briefcase, User, Mail, ArrowLeft, Save, Copy
} from "lucide-react"
import { useMemo, useState } from "react"

interface InvoiceWithClient extends Invoice {
    client: string
    clientEmail: string
}

// Mock data for admin view
const mockInvoices: InvoiceWithClient[] = [
    {
        id: "1", number: "INV-2026-001", project: "E-Commerce Web App",
        issued: "Jan 10, 2026", due: "Jan 25, 2026", amount: 3500, paid: 3500, status: "paid",
        client: "TechCorp Inc.",
        clientEmail: "billing@techcorp.com",
        items: [
            { description: "Frontend Development — Sprint 1", qty: 40, rate: 45, amount: 1800 },
            { description: "UI/UX Design", qty: 20, rate: 55, amount: 1100 },
            { description: "Project Management", qty: 12, rate: 50, amount: 600 },
        ],
        notes: "Thank you for your business!",
    },
    {
        id: "2", number: "INV-2026-002", project: "E-Commerce Web App",
        issued: "Feb 1, 2026", due: "Feb 15, 2026", amount: 2800, paid: 1400, status: "partial",
        client: "TechCorp Inc.",
        clientEmail: "billing@techcorp.com",
        items: [
            { description: "Backend API Development — Sprint 2", qty: 38, rate: 45, amount: 1710 },
            { description: "Database Architecture", qty: 10, rate: 55, amount: 550 },
            { description: "Project Management", qty: 11, rate: 50, amount: 540 },
        ],
        notes: "Partial payment received.",
    },
    {
        id: "3", number: "INV-2026-003", project: "Mobile App (iOS/Android)",
        issued: "Feb 5, 2026", due: "Feb 20, 2026", amount: 4200, paid: 0, status: "overdue",
        client: "StartupXYZ",
        clientEmail: "finance@startupxyz.io",
        items: [
            { description: "Mobile Development — Sprint 1", qty: 60, rate: 50, amount: 3000 },
            { description: "QA Testing", qty: 16, rate: 45, amount: 720 },
            { description: "Project Management", qty: 9.6, rate: 50, amount: 480 },
        ],
    },
    {
        id: "4", number: "INV-2026-004", project: "Dashboard Redesign",
        issued: "Feb 18, 2026", due: "Mar 5, 2026", amount: 1950, paid: 0, status: "unpaid",
        client: "DesignStudio Co.",
        clientEmail: "accounts@designstudio.co",
        items: [
            { description: "UI/UX Design — Final Deliverables", qty: 24, rate: 55, amount: 1320 },
            { description: "Component Library Documentation", qty: 9, rate: 45, amount: 405 },
            { description: "Client Review Session", qty: 3, rate: 75, amount: 225 },
        ],
    },
    {
        id: "5", number: "INV-2026-005", project: "Mobile App (iOS/Android)",
        issued: "Feb 23, 2026", due: "Mar 10, 2026", amount: 3800, paid: 0, status: "draft",
        client: "StartupXYZ",
        clientEmail: "finance@startupxyz.io",
        items: [
            { description: "Mobile Development — Sprint 2", qty: 56, rate: 50, amount: 2800 },
            { description: "Offline Sync Implementation", qty: 14, rate: 55, amount: 770 },
            { description: "Project Management", qty: 4.6, rate: 50, amount: 230 },
        ],
        notes: "Draft — pending review before sending.",
    },
]

const INVOICE_TABS = [
    { label: "All", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Unpaid", value: "unpaid" },
    { label: "Partial", value: "partial" },
    { label: "Paid", value: "paid" },
    { label: "Overdue", value: "overdue" },
]

export function DashboardInvoicesSkeleton() {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <div className="px-6 md:px-8 pt-6 pb-5 border-b border-zinc-200 dark:border-white/5 shrink-0">
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <Skeleton className="h-7 w-40 mb-2" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4">
                            <Skeleton className="h-3 w-20 mb-3" />
                            <Skeleton className="h-6 w-28" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-80 rounded-xl" />
                    <Skeleton className="h-10 w-48 rounded-xl" />
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-full md:w-80 lg:w-96 border-r border-zinc-200 dark:border-white/5 flex flex-col">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 px-5 py-4 border-b border-zinc-100 dark:border-white/5">
                            <Skeleton className="w-2 h-2 rounded-full mt-2 shrink-0" />
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-3 w-48 mb-2" />
                                <Skeleton className="h-5 w-20 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function InvoiceFormModal({
    invoice,
    onClose,
    onSave,
    currency
}: {
    invoice: InvoiceWithClient | null
    onClose: () => void
    onSave: (invoice: InvoiceWithClient) => void
    currency: Currency
}) {
    const isEditing = !!invoice
    const [formData, setFormData] = useState<Partial<InvoiceWithClient>>(
        invoice || {
            number: `INV-${new Date().getFullYear()}-${String(mockInvoices.length + 1).padStart(3, "0")}`,
            project: "",
            client: "",
            clientEmail: "",
            issued: new Date().toISOString().split("T")[0],
            due: "",
            amount: 0,
            paid: 0,
            status: "draft" as InvoiceStatus,
            items: [{ description: "", qty: 1, rate: 0, amount: 0 }],
            notes: "",
        }
    )
    const [items, setItems] = useState<LineItem[]>(
        invoice?.items || [{ description: "", qty: 1, rate: 0, amount: 0 }]
    )

    const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        if (field === "qty" || field === "rate") {
            newItems[index].amount = newItems[index].qty * newItems[index].rate
        }
        setItems(newItems)
        updateTotal(newItems)
    }

    const updateTotal = (newItems: LineItem[]) => {
        const total = newItems.reduce((sum, item) => sum + item.amount, 0)
        setFormData(prev => ({ ...prev, amount: total }))
    }

    const addItem = () => {
        setItems([...items, { description: "", qty: 1, rate: 0, amount: 0 }])
    }

    const removeItem = (index: number) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index)
            setItems(newItems)
            updateTotal(newItems)
        }
    }

    const handleSave = () => {
        const savedInvoice: InvoiceWithClient = {
            id: invoice?.id || String(Date.now()),
            number: formData.number || "",
            project: formData.project || "",
            client: formData.client || "",
            clientEmail: formData.clientEmail || "",
            issued: formData.issued || "",
            due: formData.due || "",
            amount: formData.amount || 0,
            paid: formData.paid || 0,
            status: (formData.status as InvoiceStatus) || "draft",
            items,
            notes: formData.notes,
        }
        onSave(savedInvoice)
        onClose()
    }

    const fmt = (n: number) => formatCurrency(n, currency)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            {isEditing ? <Edit2 size={16} className="text-amber-500" /> : <Plus size={16} className="text-amber-500" />}
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base">
                                {isEditing ? "Edit Invoice" : "Create Invoice"}
                            </h2>
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">{formData.number}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col gap-5">
                        {/* Client Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    Client Name
                                </label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="text"
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        placeholder="Client name"
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm bg-white dark:bg-white/5 text-zinc-900 dark:text-white outline-none focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    Client Email
                                </label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="email"
                                        value={formData.clientEmail}
                                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                        placeholder="client@example.com"
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm bg-white dark:bg-white/5 text-zinc-900 dark:text-white outline-none focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project & Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    Project
                                </label>
                                <div className="relative">
                                    <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="text"
                                        value={formData.project}
                                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                        placeholder="Project name"
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm bg-white dark:bg-white/5 text-zinc-900 dark:text-white outline-none focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                        Issued
                                    </label>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            type="date"
                                            value={formData.issued}
                                            onChange={(e) => setFormData({ ...formData, issued: e.target.value })}
                                            className="w-full pl-9 pr-2 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm bg-white dark:bg-white/5 text-zinc-900 dark:text-white outline-none focus:border-amber-400 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                        Due
                                    </label>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            type="date"
                                            value={formData.due}
                                            onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                                            className="w-full pl-9 pr-2 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm bg-white dark:bg-white/5 text-zinc-900 dark:text-white outline-none focus:border-amber-400 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Line Items */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                                    Line Items
                                </label>
                                <button
                                    onClick={addItem}
                                    className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1"
                                >
                                    <Plus size={12} /> Add Item
                                </button>
                            </div>
                            <div className="border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                                <div className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 px-4 py-2.5 bg-zinc-50 dark:bg-white/5 text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                                    <span>Description</span>
                                    <span className="text-right">Qty</span>
                                    <span className="text-right">Rate ({currency})</span>
                                    <span className="text-right">Amount</span>
                                    <span></span>
                                </div>
                                {items.map((item, i) => (
                                    <div key={i} className={cn(
                                        "grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 px-4 py-2 items-center",
                                        i > 0 && "border-t border-zinc-100 dark:border-white/5"
                                    )}>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateItem(i, "description", e.target.value)}
                                            placeholder="Item description"
                                            className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 text-xs bg-white dark:bg-white/5 text-zinc-900 dark:text-white outline-none focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                        />
                                        <input
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => updateItem(i, "qty", parseFloat(e.target.value) || 0)}
                                            className="px-2 py-2 rounded-lg border border-zinc-200 dark:border-white/10 text-xs bg-white dark:bg-white/5 text-zinc-900 dark:text-white outline-none focus:border-amber-400 transition-all text-right"
                                        />
                                        <input
                                            type="number"
                                            value={item.rate}
                                            onChange={(e) => updateItem(i, "rate", parseFloat(e.target.value) || 0)}
                                            className="px-2 py-2 rounded-lg border border-zinc-200 dark:border-white/10 text-xs bg-white dark:bg-white/5 text-zinc-900 dark:text-white outline-none focus:border-amber-400 transition-all text-right"
                                        />
                                        <span className="text-xs font-semibold text-zinc-900 dark:text-white text-right tabular-nums">
                                            {fmt(item.amount)}
                                        </span>
                                        <button
                                            onClick={() => removeItem(i)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5">
                                    <span className="text-xs font-bold text-zinc-900 dark:text-white">Total</span>
                                    <span className="text-sm font-black text-zinc-900 dark:text-white tabular-nums">
                                        {fmt(formData.amount || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                Notes
                            </label>
                            <textarea
                                rows={3}
                                value={formData.notes || ""}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Additional notes for the client..."
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-white/5 outline-none focus:border-amber-400 transition-all resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/5 flex gap-3 shrink-0">
                    <Button
                        onClick={handleSave}
                        className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2"
                    >
                        <Save size={14} /> Save as Draft
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl border-zinc-200 dark:border-white/10 h-11 px-6"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}

function SendInvoiceModal({
    invoice,
    onClose,
    onSend
}: {
    invoice: InvoiceWithClient
    onClose: () => void
    onSend: () => void
}) {
    const [email, setEmail] = useState(invoice.clientEmail)
    const [subject, setSubject] = useState(`Invoice ${invoice.number} from Your Company`)
    const [message, setMessage] = useState(`Hi ${invoice.client},\n\nPlease find attached invoice ${invoice.number} for ${invoice.project}.\n\nTotal amount: $${invoice.amount.toLocaleString()}\nDue date: ${invoice.due}\n\nThank you for your business!\n\nBest regards`)
    const [sending, setSending] = useState(false)

    const handleSend = () => {
        setSending(true)
        setTimeout(() => {
            setSending(false)
            onSend()
            onClose()
        }, 1500)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-lg flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                            <Send size={16} className="text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base">Send Invoice</h2>
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">{invoice.number}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                        <X size={16} />
                    </button>
                </div>

                {/* Preview */}
                <div className="px-6 py-4 bg-zinc-50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-400 dark:text-zinc-600">To</span>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{invoice.client}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400 dark:text-zinc-600">Amount</span>
                        <span className="text-sm font-black text-zinc-900 dark:text-white">${invoice.amount.toLocaleString()}</span>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                            Recipient Email
                        </label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm bg-white dark:bg-white/5 text-zinc-900 dark:text-white outline-none focus:border-emerald-400 transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm bg-white dark:bg-white/5 text-zinc-900 dark:text-white outline-none focus:border-emerald-400 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                            Message
                        </label>
                        <textarea
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-white/5 outline-none focus:border-emerald-400 transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/5 flex gap-3">
                    <Button
                        onClick={handleSend}
                        disabled={sending}
                        className={cn(
                            "flex-1 rounded-xl font-bold h-11 gap-2 transition-all",
                            sending
                                ? "bg-emerald-400 text-zinc-950"
                                : "bg-emerald-500 hover:bg-emerald-400 text-white"
                        )}
                    >
                        {sending ? <><CheckCircle size={14} /> Sent!</> : <><Send size={14} /> Send Invoice</>}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl border-zinc-200 dark:border-white/10 h-11 px-6"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}

function DeleteConfirmModal({
    invoice,
    onClose,
    onConfirm
}: {
    invoice: InvoiceWithClient
    onClose: () => void
    onConfirm: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-sm p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center mb-4">
                        <Trash2 size={22} className="text-red-500" />
                    </div>
                    <h2 className="font-bold text-zinc-900 dark:text-white text-lg mb-1">Delete Invoice?</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                        Are you sure you want to delete <span className="font-semibold text-zinc-700 dark:text-zinc-300">{invoice.number}</span>? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 w-full">
                        <Button
                            onClick={onConfirm}
                            className="flex-1 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold h-11"
                        >
                            Delete
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 h-11"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InvoiceDetail({
    invoice,
    onClose,
    onEdit,
    onSend,
    onDelete,
    onMarkPaid,
    fmt,
    currency
}: {
    invoice: InvoiceWithClient
    onClose: () => void
    onEdit: () => void
    onSend: () => void
    onDelete: () => void
    onMarkPaid: () => void
    fmt: (n: number) => string
    currency: Currency
}) {
    const cfg = INVOICE_STATUS_CONFIG[invoice.status]
    const StatusIcon = cfg.icon
    const balance = invoice.amount - invoice.paid

    const canSend = invoice.status === "draft"
    const canEdit = invoice.status === "draft" || invoice.status === "unpaid"
    const canMarkPaid = invoice.status !== "paid" && invoice.status !== "draft"
    const canDelete = invoice.status === "draft"

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-1">{invoice.number}</p>
                        <h2 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight">{invoice.project}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <User size={11} className="text-zinc-400" />
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">{invoice.client}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold", cfg.color)}>
                            <StatusIcon size={11} />{cfg.label}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Amount summary */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Total", value: fmt(invoice.amount), highlight: false },
                        { label: "Paid", value: fmt(invoice.paid), highlight: false },
                        { label: "Balance", value: fmt(balance), highlight: balance > 0 },
                    ].map((s) => (
                        <div key={s.label} className={cn(
                            "p-3 rounded-xl text-center border",
                            s.highlight
                                ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20"
                                : "bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/5"
                        )}>
                            <p className={cn("text-sm font-black", s.highlight ? "text-amber-600 dark:text-amber-400" : "text-zinc-900 dark:text-white")}>
                                {s.value}
                            </p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Meta */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5 flex flex-col gap-2">
                {[
                    { label: "Client Email", value: invoice.clientEmail, icon: Mail },
                    { label: "Issued", value: invoice.issued, icon: Calendar },
                    { label: "Due", value: invoice.due, icon: Clock },
                ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <row.icon size={12} className="text-zinc-400 dark:text-zinc-600" />
                            <span className="text-xs text-zinc-400 dark:text-zinc-600">{row.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{row.value}</span>
                    </div>
                ))}
            </div>

            {/* Line items */}
            <div className="px-6 py-4 flex-1">
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Line Items</p>
                <div className="border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2.5 bg-zinc-50 dark:bg-white/5 text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                        <span>Description</span>
                        <span className="text-right">Qty</span>
                        <span className="text-right">Rate</span>
                        <span className="text-right">Amount</span>
                    </div>
                    {invoice.items.map((item, i) => (
                        <div key={i} className={cn("grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-3 text-xs", i > 0 && "border-t border-zinc-100 dark:border-white/5")}>
                            <span className="text-zinc-700 dark:text-zinc-300 font-medium leading-snug">{item.description}</span>
                            <span className="text-zinc-400 dark:text-zinc-600 text-right tabular-nums">{item.qty}</span>
                            <span className="text-zinc-400 dark:text-zinc-600 text-right tabular-nums">{fmt(item.rate)}</span>
                            <span className="text-zinc-900 dark:text-white font-semibold text-right tabular-nums">{fmt(item.amount)}</span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">Total</span>
                        <span className="text-sm font-black text-zinc-900 dark:text-white tabular-nums">{fmt(invoice.amount)}</span>
                    </div>
                </div>

                {invoice.notes && (
                    <div className="mt-4 p-4 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl">
                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Notes</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{invoice.notes}</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-zinc-100 dark:border-white/5 flex flex-col gap-2">
                {canSend && (
                    <Button onClick={onSend} className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-11 gap-2">
                        <Send size={14} /> Send to Client
                    </Button>
                )}
                {canMarkPaid && (
                    <Button onClick={onMarkPaid} className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2">
                        <CheckCircle size={14} /> Mark as Paid
                    </Button>
                )}
                <div className="flex gap-2">
                    {canEdit && (
                        <Button onClick={onEdit} variant="outline" className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 h-10 gap-1.5 text-sm">
                            <Edit2 size={13} /> Edit
                        </Button>
                    )}
                    <Button variant="outline" className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 h-10 gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                        <Download size={13} /> PDF
                    </Button>
                    {canDelete && (
                        <Button onClick={onDelete} variant="outline" className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 h-10 gap-1.5 text-sm text-red-500 hover:border-red-200 dark:hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10">
                            <Trash2 size={13} /> Delete
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function DashboardInvoices() {
    const [activeTab, setActiveTab] = useState("all")
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState<InvoiceWithClient | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [editingInvoice, setEditingInvoice] = useState<InvoiceWithClient | null>(null)
    const [showSend, setShowSend] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [currency] = useState<Currency>("USD")
    const [invoices, setInvoices] = useState<InvoiceWithClient[]>(mockInvoices)

    const fmt = (usd: number) => formatCurrency(usd, currency)

    const filtered = useMemo(() => invoices
        .filter((inv) => activeTab === "all" || inv.status === activeTab)
        .filter((inv) =>
            inv.number.toLowerCase().includes(search.toLowerCase()) ||
            inv.project.toLowerCase().includes(search.toLowerCase()) ||
            inv.client.toLowerCase().includes(search.toLowerCase())
        ), [activeTab, search, invoices])

    const stats = useMemo(() => {
        const total = invoices.reduce((s, i) => s + i.amount, 0)
        const paid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.paid, 0)
        const outstanding = invoices.filter((i) => i.status !== "paid" && i.status !== "draft").reduce((s, i) => s + (i.amount - i.paid), 0)
        const overdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + (i.amount - i.paid), 0)
        const draft = invoices.filter((i) => i.status === "draft").reduce((s, i) => s + i.amount, 0)
        return { total, paid, outstanding, overdue, draft }
    }, [invoices])

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { all: invoices.length }
        invoices.forEach((inv) => { counts[inv.status] = (counts[inv.status] ?? 0) + 1 })
        return counts
    }, [invoices])

    const handleCreate = () => {
        setEditingInvoice(null)
        setShowForm(true)
    }

    const handleEdit = () => {
        if (selected) {
            setEditingInvoice(selected)
            setShowForm(true)
        }
    }

    const handleSave = (invoice: InvoiceWithClient) => {
        if (editingInvoice) {
            setInvoices(prev => prev.map(inv => inv.id === invoice.id ? invoice : inv))
        } else {
            setInvoices(prev => [invoice, ...prev])
        }
        if (selected?.id === invoice.id) {
            setSelected(invoice)
        }
    }

    const handleSend = () => {
        if (selected) {
            const updated = { ...selected, status: "unpaid" as InvoiceStatus }
            setInvoices(prev => prev.map(inv => inv.id === selected.id ? updated : inv))
            setSelected(updated)
        }
    }

    const handleDelete = () => {
        if (selected) {
            setInvoices(prev => prev.filter(inv => inv.id !== selected.id))
            setSelected(null)
            setShowDelete(false)
        }
    }

    const handleMarkPaid = () => {
        if (selected) {
            const updated = { ...selected, status: "paid" as InvoiceStatus, paid: selected.amount }
            setInvoices(prev => prev.map(inv => inv.id === selected.id ? updated : inv))
            setSelected(updated)
        }
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Header */}
            <div className="px-6 md:px-8 pt-6 pb-5 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/5 shrink-0">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Invoices</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Create, send, and manage client invoices.</p>
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-10 gap-2"
                    >
                        <Plus size={14} /> Create Invoice
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                    {[
                        { label: "Total Billed", value: fmt(stats.total), icon: FileText, color: "text-zinc-400 dark:text-zinc-600" },
                        { label: "Total Paid", value: fmt(stats.paid), icon: CheckCircle, color: "text-emerald-500 dark:text-emerald-400" },
                        { label: "Outstanding", value: fmt(stats.outstanding), icon: Clock, color: "text-amber-500 dark:text-amber-400" },
                        { label: "Overdue", value: fmt(stats.overdue), icon: AlertTriangle, color: "text-red-500 dark:text-red-400" },
                        { label: "Draft", value: fmt(stats.draft), icon: Edit2, color: "text-zinc-500 dark:text-zinc-400" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4">
                            <div className="flex items-center gap-1.5 mb-2">
                                <s.icon size={12} className={s.color} />
                                <p className="text-[11px] text-zinc-400 dark:text-zinc-600 font-medium">{s.label}</p>
                            </div>
                            <p className="text-lg font-black text-zinc-900 dark:text-white">{s.value}</p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5">{currency}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs + Search */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-1 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl overflow-x-auto">
                        {INVOICE_TABS.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => { setActiveTab(tab.value); setSelected(null) }}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                                    activeTab === tab.value
                                        ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                )}
                            >
                                {tab.label}
                                {tabCounts[tab.value] > 0 && (
                                    <span className={cn(
                                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                        activeTab === tab.value
                                            ? "bg-white/20 text-inherit"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                                    )}>
                                        {tabCounts[tab.value]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search invoices..."
                            className="w-full pl-8 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-amber-400 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Split panel */}
            <div className="flex flex-1 overflow-hidden">
                {/* List */}
                <div className={cn(
                    "flex flex-col overflow-y-auto border-r border-zinc-200 dark:border-white/5 shrink-0 bg-zinc-50 dark:bg-zinc-950",
                    selected ? "hidden md:flex md:w-80 lg:w-96" : "w-full"
                )}>
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 py-20 text-center">
                            <FileText size={32} className="text-zinc-300 dark:text-zinc-700 mb-3" />
                            <p className="text-zinc-400 dark:text-zinc-600 text-sm">No invoices found</p>
                        </div>
                    ) : (
                        filtered.map((inv) => {
                            const cfg = INVOICE_STATUS_CONFIG[inv.status]
                            const isSelected = selected?.id === inv.id
                            const balance = inv.amount - inv.paid
                            return (
                                <button
                                    key={inv.id}
                                    onClick={() => setSelected(inv)}
                                    className={cn(
                                        "flex items-start gap-4 px-5 py-4 border-b border-zinc-100 dark:border-white/5 text-left transition-all hover:bg-white dark:hover:bg-zinc-900/50",
                                        isSelected && "bg-white dark:bg-zinc-900 border-l-2 border-l-amber-400"
                                    )}
                                >
                                    <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", cfg.dot)} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-0.5">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{inv.number}</p>
                                            <p className="text-sm font-black text-zinc-900 dark:text-white shrink-0">{fmt(inv.amount)}</p>
                                        </div>
                                        <p className="text-xs text-zinc-700 dark:text-zinc-300 truncate">{inv.project}</p>
                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mb-1.5">{inv.client}</p>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold", cfg.color)}>
                                                <cfg.icon size={9} />{cfg.label}
                                            </span>
                                            <span className="text-[10px] text-zinc-400 dark:text-zinc-600">Due {inv.due}</span>
                                        </div>
                                        {balance > 0 && inv.status !== "draft" && (
                                            <p className="text-[10px] text-amber-500 dark:text-amber-400 font-semibold mt-1">
                                                {fmt(balance)} remaining
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700 shrink-0 mt-1" />
                                </button>
                            )
                        })
                    )}
                </div>

                {/* Detail */}
                {selected ? (
                    <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-white/5 md:hidden">
                            <button
                                onClick={() => setSelected(null)}
                                className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                                <ChevronRight size={12} className="rotate-180" /> Back
                            </button>
                        </div>
                        <InvoiceDetail
                            invoice={selected}
                            onClose={() => setSelected(null)}
                            onEdit={handleEdit}
                            onSend={() => setShowSend(true)}
                            onDelete={() => setShowDelete(true)}
                            onMarkPaid={handleMarkPaid}
                            fmt={fmt}
                            currency={currency}
                        />
                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center bg-white dark:bg-zinc-900">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                                <Eye size={22} className="text-zinc-400 dark:text-zinc-600" />
                            </div>
                            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Select an invoice to view details</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showForm && (
                <InvoiceFormModal
                    invoice={editingInvoice}
                    onClose={() => setShowForm(false)}
                    onSave={handleSave}
                    currency={currency}
                />
            )}
            {showSend && selected && (
                <SendInvoiceModal
                    invoice={selected}
                    onClose={() => setShowSend(false)}
                    onSend={handleSend}
                />
            )}
            {showDelete && selected && (
                <DeleteConfirmModal
                    invoice={selected}
                    onClose={() => setShowDelete(false)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    )
}