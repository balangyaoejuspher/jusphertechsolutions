"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import {
    FileText, Download, CreditCard, AlertTriangle, CheckCircle,
    Clock, ChevronRight, Search, X, Send, CircleDot,
    Banknote, Eye, Calendar, ArrowLeftRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ── Types ─────────────────────────────────────────────────────

type InvoiceStatus = "paid" | "unpaid" | "overdue" | "partial" | "draft"
type Currency = "USD" | "PHP"

type LineItem = { description: string; qty: number; rate: number; amount: number }

type Invoice = {
    id: string; number: string; project: string
    issued: string; due: string
    amount: number; paid: number
    status: InvoiceStatus; items: LineItem[]; notes?: string
}

// ── Constants ─────────────────────────────────────────────────

const PHP_RATE = 57.5 // 1 USD → PHP (update as needed)

const mockInvoices: Invoice[] = [
    {
        id: "1", number: "INV-2026-001", project: "E-Commerce Web App",
        issued: "Jan 10, 2026", due: "Jan 25, 2026", amount: 3500, paid: 3500, status: "paid",
        items: [
            { description: "Frontend Development — Sprint 1", qty: 40, rate: 45, amount: 1800 },
            { description: "UI/UX Design", qty: 20, rate: 55, amount: 1100 },
            { description: "Project Management", qty: 12, rate: 50, amount: 600 },
        ],
        notes: "Thank you for your payment!",
    },
    {
        id: "2", number: "INV-2026-002", project: "E-Commerce Web App",
        issued: "Feb 1, 2026", due: "Feb 15, 2026", amount: 2800, paid: 1400, status: "partial",
        items: [
            { description: "Backend API Development — Sprint 2", qty: 38, rate: 45, amount: 1710 },
            { description: "Database Architecture", qty: 10, rate: 55, amount: 550 },
            { description: "Project Management", qty: 11, rate: 50, amount: 540 },
        ],
        notes: "Partial payment of $1,400 received on Feb 10.",
    },
    {
        id: "3", number: "INV-2026-003", project: "Mobile App (iOS/Android)",
        issued: "Feb 5, 2026", due: "Feb 20, 2026", amount: 4200, paid: 0, status: "overdue",
        items: [
            { description: "Mobile Development — Sprint 1", qty: 60, rate: 50, amount: 3000 },
            { description: "QA Testing", qty: 16, rate: 45, amount: 720 },
            { description: "Project Management", qty: 9.6, rate: 50, amount: 480 },
        ],
    },
    {
        id: "4", number: "INV-2026-004", project: "Dashboard Redesign",
        issued: "Feb 18, 2026", due: "Mar 5, 2026", amount: 1950, paid: 0, status: "unpaid",
        items: [
            { description: "UI/UX Design — Final Deliverables", qty: 24, rate: 55, amount: 1320 },
            { description: "Component Library Documentation", qty: 9, rate: 45, amount: 405 },
            { description: "Client Review Session", qty: 3, rate: 75, amount: 225 },
        ],
    },
    {
        id: "5", number: "INV-2026-005", project: "Mobile App (iOS/Android)",
        issued: "Feb 23, 2026", due: "Mar 10, 2026", amount: 3800, paid: 0, status: "draft",
        items: [
            { description: "Mobile Development — Sprint 2", qty: 56, rate: 50, amount: 2800 },
            { description: "Offline Sync Implementation", qty: 14, rate: 55, amount: 770 },
            { description: "Project Management", qty: 4.6, rate: 50, amount: 230 },
        ],
        notes: "Draft — pending your review before sending.",
    },
    {
        id: "6", number: "INV-2025-018", project: "SEO & Content Strategy",
        issued: "Jan 31, 2026", due: "Feb 10, 2026", amount: 1200, paid: 1200, status: "paid",
        items: [{ description: "SEO Campaign — Month 6 Final", qty: 1, rate: 1200, amount: 1200 }],
        notes: "Final invoice for completed SEO campaign.",
    },
]

const statusConfig: Record<InvoiceStatus, { label: string; icon: React.ElementType; color: string; dot: string }> = {
    paid: { label: "Paid", icon: CheckCircle, color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", dot: "bg-emerald-500" },
    unpaid: { label: "Unpaid", icon: Clock, color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", dot: "bg-amber-500" },
    overdue: { label: "Overdue", icon: AlertTriangle, color: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20", dot: "bg-red-500" },
    partial: { label: "Partially Paid", icon: CircleDot, color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", dot: "bg-blue-500" },
    draft: { label: "Draft", icon: FileText, color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10", dot: "bg-zinc-400" },
}

const tabs = [
    { value: "all", label: "All" },
    { value: "unpaid", label: "Unpaid" },
    { value: "overdue", label: "Overdue" },
    { value: "partial", label: "Partial" },
    { value: "paid", label: "Paid" },
    { value: "draft", label: "Draft" },
]

// ── Currency helpers ──────────────────────────────────────────

function useFmt(currency: Currency) {
    return (usd: number) => {
        if (currency === "PHP") {
            return `₱${(usd * PHP_RATE).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
        }
        return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    }
}

// ── Skeletons ─────────────────────────────────────────────────

function Sk({ className }: { className?: string }) {
    return <div className={cn("animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800", className)} />
}

export function InvoicesPageSkeleton() {
    return (
        <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Header */}
            <div className="px-6 md:px-8 pt-8 pb-6 border-b border-zinc-200 dark:border-white/5 shrink-0">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <Sk className="h-7 w-28 mb-2" />
                        <Sk className="h-4 w-52" />
                    </div>
                    <Sk className="h-9 w-28 rounded-xl" />
                </div>
                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-4">
                            <Sk className="h-3 w-20 mb-3" />
                            <Sk className="h-6 w-28" />
                        </div>
                    ))}
                </div>
                {/* Tabs */}
                <div className="flex gap-3">
                    <Sk className="h-9 w-64 rounded-xl" />
                    <Sk className="h-9 w-48 rounded-xl" />
                </div>
            </div>
            {/* Split panel */}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-full md:w-80 lg:w-96 border-r border-zinc-200 dark:border-white/5 flex flex-col gap-0">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 px-5 py-4 border-b border-zinc-100 dark:border-white/5">
                            <Sk className="w-2 h-2 rounded-full mt-2 shrink-0" />
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <Sk className="h-4 w-28" />
                                    <Sk className="h-4 w-16" />
                                </div>
                                <Sk className="h-3 w-40 mb-2" />
                                <Sk className="h-5 w-20 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden md:flex flex-1 items-center justify-center bg-white dark:bg-zinc-900">
                    <div className="text-center">
                        <Sk className="w-14 h-14 rounded-2xl mx-auto mb-3" />
                        <Sk className="h-4 w-48 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function InvoiceDetailSkeleton() {
    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-zinc-100 dark:border-white/5">
                <div className="flex justify-between mb-3">
                    <div><Sk className="h-3 w-24 mb-2" /><Sk className="h-6 w-48" /></div>
                    <Sk className="h-6 w-20 rounded-lg" />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                    {Array.from({ length: 3 }).map((_, i) => <Sk key={i} className="h-14 rounded-xl" />)}
                </div>
            </div>
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5 flex flex-col gap-3">
                <div className="flex justify-between"><Sk className="h-3 w-12" /><Sk className="h-3 w-24" /></div>
                <div className="flex justify-between"><Sk className="h-3 w-12" /><Sk className="h-3 w-24" /></div>
            </div>
            <div className="px-6 py-4 flex-1">
                <Sk className="h-3 w-20 mb-4" />
                <div className="border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                    <Sk className="h-9 rounded-none" />
                    {Array.from({ length: 3 }).map((_, i) => <Sk key={i} className="h-12 rounded-none mt-px" />)}
                    <Sk className="h-10 rounded-none mt-px" />
                </div>
            </div>
            <div className="p-6 border-t border-zinc-100 dark:border-white/5 flex flex-col gap-2">
                <Sk className="h-11 rounded-xl" />
                <div className="flex gap-2"><Sk className="flex-1 h-10 rounded-xl" /><Sk className="flex-1 h-10 rounded-xl" /></div>
            </div>
        </div>
    )
}

// ── Dispute Modal ─────────────────────────────────────────────

function DisputeModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
    const [reason, setReason] = useState("")
    const [details, setDetails] = useState("")
    const [sent, setSent] = useState(false)

    const reasons = ["Incorrect amount", "Work not completed", "Duplicate invoice", "Services not received", "Other"]

    const handleSubmit = () => {
        if (!reason) return
        setSent(true)
        setTimeout(() => { setSent(false); onClose() }, 1800)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center">
                            <AlertTriangle size={15} className="text-red-500" />
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base">Dispute Invoice</h2>
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">{invoice.number}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                        <X size={16} />
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col gap-1.5">
                            {reasons.map((r) => (
                                <button key={r} onClick={() => setReason(r)} className={cn(
                                    "text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all",
                                    reason === r
                                        ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
                                        : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                )}>
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">Additional Details</label>
                        <textarea rows={3} value={details} onChange={(e) => setDetails(e.target.value)}
                            placeholder="Describe the issue..."
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-white/5 outline-none focus:border-red-400 transition-all resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600" />
                    </div>
                    <div className="flex gap-3 pt-1">
                        <Button onClick={handleSubmit} disabled={!reason} className={cn(
                            "flex-1 rounded-xl font-bold h-11 gap-2 transition-all",
                            sent ? "bg-emerald-400 text-zinc-950" : "bg-red-500 hover:bg-red-400 text-white disabled:opacity-40"
                        )}>
                            {sent ? <><CheckCircle size={14} /> Submitted</> : <><Send size={14} /> Submit Dispute</>}
                        </Button>
                        <Button variant="outline" onClick={onClose} className="rounded-xl border-zinc-200 dark:border-white/10 h-11 px-5">Cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Pay Modal ─────────────────────────────────────────────────

function PayModal({ invoice, onClose, currency, fmt }: {
    invoice: Invoice; onClose: () => void; currency: Currency; fmt: (n: number) => string
}) {
    const balance = invoice.amount - invoice.paid
    const [method, setMethod] = useState<"card" | "bank">("card")

    const methods = [
        { value: "card", label: "Credit / Debit Card", icon: CreditCard },
        { value: "bank", label: "Bank Transfer", icon: Banknote },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            <CreditCard size={15} className="text-amber-500 dark:text-amber-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base">Pay Invoice</h2>
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">{invoice.number}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                        <X size={16} />
                    </button>
                </div>
                <div className="p-5 bg-amber-50 dark:bg-amber-400/5 border border-amber-200 dark:border-amber-400/20 rounded-2xl mb-5 text-center">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-widest mb-1">Amount Due</p>
                    <p className="text-4xl font-black text-zinc-900 dark:text-white">{fmt(balance)}</p>
                    {currency === "PHP" && (
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">≈ ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</p>
                    )}
                    <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{invoice.project}</p>
                </div>
                <div className="flex flex-col gap-2 mb-5">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Payment Method</p>
                    {methods.map((m) => (
                        <button key={m.value} onClick={() => setMethod(m.value as "card" | "bank")} className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left",
                            method === m.value
                                ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20"
                                : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"
                        )}>
                            <m.icon size={16} className={method === m.value ? "text-amber-500 dark:text-amber-400" : "text-zinc-400"} />
                            <span className={cn("text-sm font-semibold", method === m.value ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400")}>
                                {m.label}
                            </span>
                        </button>
                    ))}
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-4 text-center">You'll be redirected to our secure payment gateway.</p>
                <div className="flex gap-3">
                    <Button className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2">
                        <CreditCard size={14} /> Proceed to Pay
                    </Button>
                    <Button variant="outline" onClick={onClose} className="rounded-xl border-zinc-200 dark:border-white/10 h-11 px-5">Cancel</Button>
                </div>
            </div>
        </div>
    )
}

// ── Invoice Detail Panel ──────────────────────────────────────

function InvoiceDetail({ invoice, onClose, onPay, onDispute, fmt, currency }: {
    invoice: Invoice
    onClose: () => void
    onPay: () => void
    onDispute: () => void
    fmt: (n: number) => string
    currency: Currency
}) {
    const cfg = statusConfig[invoice.status]
    const StatusIcon = cfg.icon
    const balance = invoice.amount - invoice.paid
    const canPay = invoice.status === "unpaid" || invoice.status === "overdue" || invoice.status === "partial"
    const canDispute = invoice.status !== "draft" && invoice.status !== "paid"

    return (
        <div className="flex flex-col h-full overflow-y-auto">

            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-1">{invoice.number}</p>
                        <h2 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight">{invoice.project}</h2>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold", cfg.color)}>
                            <StatusIcon size={11} />{cfg.label}
                        </span>
                        {/* ── Close button ── */}
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Amount summary */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                        { label: "Total", value: fmt(invoice.amount), highlight: false },
                        { label: "Paid", value: fmt(invoice.paid), highlight: false },
                        { label: "Balance", value: fmt(balance), highlight: balance > 0 },
                    ].map((s) => (
                        <div key={s.label} className={cn("p-3 rounded-xl text-center border", s.highlight
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

                {/* Currency note */}
                {currency === "PHP" && (
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-2 text-right">
                        Converted at ₱{PHP_RATE}/USD · for reference only
                    </p>
                )}
            </div>

            {/* Meta */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5 flex flex-col gap-2">
                {[
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
                {canPay && (
                    <Button onClick={onPay} className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 gap-2">
                        <CreditCard size={14} /> Pay {fmt(balance)}
                    </Button>
                )}
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 h-10 gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                        <Download size={13} /> Download PDF
                    </Button>
                    {canDispute && (
                        <Button onClick={onDispute} variant="outline"
                            className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 h-10 gap-1.5 text-sm text-red-500 dark:text-red-400 hover:border-red-200 dark:hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10">
                            <AlertTriangle size={13} /> Dispute
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────

export default function InvoicesPage() {
    const [activeTab, setActiveTab] = useState("all")
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState<Invoice | null>(null)
    const [showPay, setShowPay] = useState(false)
    const [showDispute, setShowDispute] = useState(false)
    const [currency, setCurrency] = useState<Currency>("USD")

    const fmt = useFmt(currency)

    const filtered = useMemo(() => mockInvoices
        .filter((inv) => activeTab === "all" || inv.status === activeTab)
        .filter((inv) =>
            inv.number.toLowerCase().includes(search.toLowerCase()) ||
            inv.project.toLowerCase().includes(search.toLowerCase())
        ), [activeTab, search])

    const stats = useMemo(() => {
        const total = mockInvoices.reduce((s, i) => s + i.amount, 0)
        const paid = mockInvoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.paid, 0)
        const outstanding = mockInvoices.filter((i) => i.status !== "paid" && i.status !== "draft").reduce((s, i) => s + (i.amount - i.paid), 0)
        const overdue = mockInvoices.filter((i) => i.status === "overdue").reduce((s, i) => s + (i.amount - i.paid), 0)
        return { total, paid, outstanding, overdue }
    }, [])

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { all: mockInvoices.length }
        mockInvoices.forEach((inv) => { counts[inv.status] = (counts[inv.status] ?? 0) + 1 })
        return counts
    }, [])

    return (
        <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">

            {/* Top header */}
            <div className="px-6 md:px-8 pt-8 pb-6 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/5 shrink-0">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Invoices</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">View, pay, and manage your invoices.</p>
                    </div>

                    {/* ── Currency toggle ── */}
                    <button
                        onClick={() => setCurrency((c) => c === "USD" ? "PHP" : "USD")}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:border-amber-400/40 hover:text-amber-500 dark:hover:text-amber-400 transition-all"
                    >
                        <ArrowLeftRight size={13} />
                        {currency === "USD" ? "USD → PHP" : "PHP → USD"}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total Billed", value: fmt(stats.total), icon: FileText, color: "text-zinc-400 dark:text-zinc-600" },
                        { label: "Total Paid", value: fmt(stats.paid), icon: CheckCircle, color: "text-emerald-500 dark:text-emerald-400" },
                        { label: "Outstanding", value: fmt(stats.outstanding), icon: Clock, color: "text-amber-500 dark:text-amber-400" },
                        { label: "Overdue", value: fmt(stats.overdue), icon: AlertTriangle, color: "text-red-500 dark:text-red-400" },
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
                        {tabs.map((tab) => (
                            <button key={tab.value} onClick={() => { setActiveTab(tab.value); setSelected(null) }}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                                    activeTab === tab.value
                                        ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                )}>
                                {tab.label}
                                {tabCounts[tab.value] > 0 && (
                                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                        activeTab === tab.value ? "bg-white/20 text-inherit" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                                    )}>
                                        {tabCounts[tab.value]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search invoices..."
                            className="w-full pl-8 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-amber-400 transition-all" />
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
                            const cfg = statusConfig[inv.status]
                            const isSelected = selected?.id === inv.id
                            const balance = inv.amount - inv.paid
                            return (
                                <button key={inv.id} onClick={() => setSelected(inv)}
                                    className={cn(
                                        "flex items-start gap-4 px-5 py-4 border-b border-zinc-100 dark:border-white/5 text-left transition-all hover:bg-white dark:hover:bg-zinc-900/50",
                                        isSelected && "bg-white dark:bg-zinc-900 border-l-2 border-l-amber-400"
                                    )}>
                                    <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", cfg.dot)} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-0.5">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{inv.number}</p>
                                            <p className="text-sm font-black text-zinc-900 dark:text-white shrink-0">{fmt(inv.amount)}</p>
                                        </div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mb-1.5">{inv.project}</p>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold", cfg.color)}>
                                                <cfg.icon size={9} />{cfg.label}
                                            </span>
                                            <span className="text-[10px] text-zinc-400 dark:text-zinc-600">Due {inv.due}</span>
                                        </div>
                                        {balance > 0 && inv.status !== "draft" && (
                                            <p className="text-[10px] text-amber-500 dark:text-amber-400 font-semibold mt-1">{fmt(balance)} remaining</p>
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
                        {/* Mobile back */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-white/5 md:hidden">
                            <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                                <ChevronRight size={12} className="rotate-180" /> Back
                            </button>
                        </div>
                        <InvoiceDetail
                            invoice={selected}
                            onClose={() => setSelected(null)}
                            onPay={() => setShowPay(true)}
                            onDispute={() => setShowDispute(true)}
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
            {showPay && selected && <PayModal invoice={selected} onClose={() => setShowPay(false)} currency={currency} fmt={fmt} />}
            {showDispute && selected && <DisputeModal invoice={selected} onClose={() => setShowDispute(false)} />}
        </div>
    )
}