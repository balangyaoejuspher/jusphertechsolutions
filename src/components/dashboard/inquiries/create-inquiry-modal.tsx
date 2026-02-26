"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    X, Loader2, Phone, Mail, Building2, DollarSign,
    MessageSquare, Tag, User, FileText, AlertTriangle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { portalFetch } from "@/lib/api/private-fetcher"
import { toast } from "sonner"
import type { Inquiry } from "@/server/db/schema"
import { CustomSelect } from "@/components/ui/custom-select"

type Props = {
    onClose: () => void
    onCreated: (inquiry: Inquiry) => void
}

const PRIORITY_OPTIONS = [
    { value: "low", label: "Low", dot: "bg-zinc-400" },
    { value: "medium", label: "Medium", dot: "bg-blue-400" },
    { value: "high", label: "High", dot: "bg-orange-400" },
    { value: "urgent", label: "Urgent", dot: "bg-red-500" },
] as const

const SOURCE_OPTIONS = [
    { value: "contact_form", label: "Contact Form" },
    { value: "referral", label: "Referral" },
    { value: "social_media", label: "Social Media" },
    { value: "direct", label: "Direct / Phone Call" },
    { value: "other", label: "Other" },
] as const

const STATUS_OPTIONS = [
    { value: "new", label: "New" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
] as const

export default function CreateInquiryModal({ onClose, onCreated }: Props) {
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        budget: "",
        priority: "medium" as Inquiry["priority"],
        status: "new" as Inquiry["status"],
        source: "direct" as Inquiry["source"],
        notes: "",
    })

    const inputCls = "w-full rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-sm focus:border-amber-400 dark:focus:border-amber-400 focus:ring-0"

    const set = (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((f) => ({ ...f, [key]: e.target.value }))

    const isValid = form.name.trim() && form.email.trim() && form.message.trim()

    const handleSubmit = async () => {
        if (!isValid) return
        setSaving(true)
        try {
            const created = await portalFetch.post<Inquiry>("/admin/inquiries", {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || undefined,
                company: form.company.trim() || undefined,
                message: form.message.trim(),
                budget: form.budget.trim() || undefined,
                priority: form.priority,
                status: form.status,
                source: form.source,
                notes: form.notes.trim() || undefined,
            })
            toast.success(`Inquiry from ${created.name} created.`)
            onCreated(created)
            onClose()
        } catch (err: any) {
            toast.error(err.message ?? "Failed to create inquiry")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl w-full max-w-xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-white/5">
                    <div>
                        <h2 className="font-bold text-zinc-900 dark:text-white text-lg">New Inquiry</h2>
                        <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5">
                            Manually add an inquiry from a phone call or walk-in
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 flex flex-col gap-4 max-h-[65vh] overflow-y-auto
                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-zinc-200
                    [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                    [&::-webkit-scrollbar-thumb]:rounded-full">

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                <User size={12} /> Full Name *
                            </Label>
                            <Input
                                className={inputCls}
                                placeholder="Jane Smith"
                                value={form.name}
                                onChange={set("name")}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                <Mail size={12} /> Email *
                            </Label>
                            <Input
                                className={inputCls}
                                type="email"
                                placeholder="jane@company.com"
                                value={form.email}
                                onChange={set("email")}
                            />
                        </div>
                    </div>

                    {/* Phone + Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                <Phone size={12} /> Phone
                            </Label>
                            <Input
                                className={inputCls}
                                placeholder="+1 555 000 0000"
                                value={form.phone}
                                onChange={set("phone")}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                <Building2 size={12} /> Company
                            </Label>
                            <Input
                                className={inputCls}
                                placeholder="Acme Inc."
                                value={form.company}
                                onChange={set("company")}
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            <MessageSquare size={12} /> Message / Request *
                        </Label>
                        <Textarea
                            className={cn(inputCls, "resize-none")}
                            rows={3}
                            placeholder="What are they looking for? Describe the inquiry..."
                            value={form.message}
                            onChange={set("message")}
                        />
                    </div>

                    {/* Budget */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            <DollarSign size={12} /> Budget
                        </Label>
                        <Input
                            className={inputCls}
                            placeholder="e.g. $5,000 / month or $50k project"
                            value={form.budget}
                            onChange={set("budget")}
                        />
                    </div>

                    {/* Source + Status + Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                <Tag size={12} /> Source
                            </Label>
                            <CustomSelect
                                value={form.source}
                                options={SOURCE_OPTIONS}
                                onChange={(v) => setForm((f) => ({ ...f, source: v as Inquiry["source"] }))}
                                buttonClassName={inputCls}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                <FileText size={12} /> Status
                            </Label>
                            <CustomSelect
                                value={form.status}
                                options={STATUS_OPTIONS}
                                onChange={(v) => setForm((f) => ({ ...f, status: v as Inquiry["status"] }))}
                                buttonClassName={inputCls}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                <AlertTriangle size={12} /> Priority
                            </Label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {PRIORITY_OPTIONS.map((p) => (
                                    <button
                                        key={p.value}
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, priority: p.value as Inquiry["priority"] }))}
                                        className={cn(
                                            "flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-all",
                                            form.priority === p.value
                                                ? "bg-amber-400 border-amber-400 text-zinc-950"
                                                : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                        )}
                                    >
                                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", p.dot)} />
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            <FileText size={12} /> Internal Notes
                            <span className="text-zinc-300 dark:text-zinc-600 font-normal">(optional)</span>
                        </Label>
                        <Textarea
                            className={cn(inputCls, "resize-none")}
                            rows={2}
                            placeholder="Any context about this inquiry for the team..."
                            value={form.notes}
                            onChange={set("notes")}
                        />
                    </div>
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
                        disabled={saving || !isValid}
                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-bold text-sm transition-all"
                    >
                        {saving
                            ? <><Loader2 size={15} className="animate-spin" /> Creating...</>
                            : "Create Inquiry"
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}