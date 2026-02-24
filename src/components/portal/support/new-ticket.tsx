"use client"

import { TICKET_CATEGORIES, TICKET_RESPONSE_TIMES, TICKET_PRIORITY_CONFIG } from "@/lib/helpers/constants"
import { cn } from "@/lib/utils"

import { ChevronLeft, LifeBuoy, Paperclip, Send, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function NewTicket() {
    const router = useRouter()
    const [form, setForm] = useState({
        subject: "",
        category: "",
        priority: "medium",
        description: "",
    })
    const [files, setFiles] = useState<File[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const e: Record<string, string> = {}
        if (!form.subject.trim()) e.subject = "Subject is required"
        if (!form.category) e.category = "Please select a category"
        if (!form.description.trim()) e.description = "Please describe your issue"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setSubmitting(true)
        // TODO: wire to API route
        await new Promise((r) => setTimeout(r, 1200))
        router.push("/portal/support?success=true")
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }

    const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">

            {/* Back */}
            <Link href="/portal/support" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 font-semibold mb-6 transition-colors group">
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Support
            </Link>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <LifeBuoy size={14} className="text-amber-500 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">Support</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">Open a Ticket</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Our team typically responds within 2 hours on business days.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Form ── */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Subject */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <label className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 block">
                            Subject <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Brief summary of your issue..."
                            value={form.subject}
                            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                            className={cn(
                                "w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors",
                                errors.subject ? "border-red-400" : "border-zinc-200 dark:border-white/10"
                            )}
                        />
                        {errors.subject && <p className="text-xs text-red-400 mt-1.5">{errors.subject}</p>}
                    </div>

                    {/* Category + Priority */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 flex flex-col gap-5">
                        <div>
                            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 block">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {TICKET_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setForm((p) => ({ ...p, category: cat }))}
                                        className={cn(
                                            "px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all",
                                            form.category === cat
                                                ? "bg-amber-400 border-amber-400 text-zinc-950"
                                                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-amber-400/50 hover:text-amber-600 dark:hover:text-amber-400"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            {errors.category && <p className="text-xs text-red-400 mt-1.5">{errors.category}</p>}
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 block">
                                Priority
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.values(TICKET_PRIORITY_CONFIG).map((p) => (
                                    <button
                                        key={p.value}
                                        onClick={() => setForm((prev) => ({ ...prev, priority: p.value }))}
                                        className={cn(
                                            "px-4 py-3 rounded-xl border text-left transition-all",
                                            form.priority === p.value
                                                ? cn("bg-zinc-50 dark:bg-zinc-800", p.formColor, "border-2")
                                                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"
                                        )}
                                    >
                                        <p className={cn("text-xs font-bold", form.priority === p.value ? p.formColor : "text-zinc-700 dark:text-zinc-300")}>
                                            {p.label}
                                        </p>
                                        <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5">{p.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <label className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 block">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            placeholder="Please describe your issue in detail. Include steps to reproduce if it's a bug..."
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            rows={6}
                            className={cn(
                                "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none",
                                errors.description ? "border-red-400" : "border-zinc-200 dark:border-white/10"
                            )}
                        />
                        {errors.description && <p className="text-xs text-red-400 mt-1.5">{errors.description}</p>}
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-1.5 text-right">{form.description.length} characters</p>
                    </div>

                    {/* Attachments */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <label className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 block">
                            Attachments <span className="text-zinc-300 dark:text-zinc-700 font-normal normal-case tracking-normal">(optional)</span>
                        </label>

                        {/* Drop zone */}
                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-xl p-6 cursor-pointer hover:border-amber-400/50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-amber-50 dark:group-hover:bg-amber-400/10 transition-colors">
                                <Paperclip size={16} className="text-zinc-400 group-hover:text-amber-500 transition-colors" />
                            </div>
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Click to attach files</p>
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-600">PNG, JPG, PDF, ZIP up to 10MB</p>
                            <input type="file" multiple className="hidden" onChange={handleFile} />
                        </label>

                        {/* File list */}
                        {files.length > 0 && (
                            <div className="flex flex-col gap-2 mt-3">
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/5">
                                        <Paperclip size={13} className="text-zinc-400 shrink-0" />
                                        <span className="text-xs text-zinc-700 dark:text-zinc-300 flex-1 truncate">{file.name}</span>
                                        <span className="text-[11px] text-zinc-400 dark:text-zinc-600 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                                        <button onClick={() => removeFile(i)} className="text-zinc-400 hover:text-red-400 transition-colors shrink-0">
                                            <X size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-400/20"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={15} />
                                Submit Ticket
                            </>
                        )}
                    </button>
                </div>

                {/* ── Sidebar ── */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">Response Times</p>
                        <div className="flex flex-col gap-3">
                            {TICKET_RESPONSE_TIMES.map((row) => (
                                <div key={row.priority} className="flex items-center justify-between">
                                    <span className={cn("text-xs font-semibold", row.color)}>{row.priority}</span>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{row.time}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-4 leading-relaxed">
                            Response times are during business hours (Mon–Sat, 8AM–6PM PHT).
                        </p>
                    </div>

                    {/* Tips */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">Tips for faster resolution</p>
                        <ul className="flex flex-col gap-2.5">
                            {[
                                "Include screenshots or error messages",
                                "Describe the steps to reproduce the issue",
                                "Mention which browser or device you're using",
                                "Note if the issue is happening for all users or just you",
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Alternative contact */}
                    <div className="relative bg-zinc-900 rounded-2xl p-5 overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/10 rounded-full blur-[50px] pointer-events-none" />
                        <div className="relative">
                            <p className="text-white font-bold text-sm mb-1">Need urgent help?</p>
                            <p className="text-zinc-400 text-xs leading-relaxed mb-4">For critical production issues, you can also reach us directly.</p>
                            <a href="mailto:hello@juspherandco.com" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-all w-fit">
                                Email us directly
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}