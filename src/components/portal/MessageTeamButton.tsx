"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, MessageSquare, Send, X } from "lucide-react"
import { useState } from "react"

type TeamMember = {
    name: string
    role: string
    email: string
    initials: string
}

type Props = {
    team: TeamMember[]
    projectName?: string
}

export function MessageTeamButton({ team, projectName }: Props) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<string[]>(team.map((m) => m.email))
    const [subject, setSubject] = useState(projectName ? `Re: ${projectName}` : "")
    const [message, setMessage] = useState("")
    const [sent, setSent] = useState(false)

    const toggle = (email: string) => {
        setSelected((prev) =>
            prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
        )
    }

    const handleSend = () => {
        if (!message.trim() || selected.length === 0) return
        const to = selected.join(",")
        const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
        window.open(mailto)
        setSent(true)
        setTimeout(() => {
            setSent(false)
            setOpen(false)
            setMessage("")
        }, 1500)
    }

    const canSend = message.trim().length > 0 && selected.length > 0

    return (
        <>
            {/* Trigger */}
            <button
                onClick={() => setOpen(true)}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-400/20"
            >
                <MessageSquare size={14} />
                Message Team
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-2xl w-full max-w-lg overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                                    <MessageSquare size={15} className="text-amber-500 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-zinc-900 dark:text-white text-base leading-tight">Message Team</h2>
                                    {projectName && <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{projectName}</p>}
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-4">

                            {/* Recipients */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2.5">
                                    Recipients <span className="text-amber-500">*</span>
                                </label>
                                <div className="flex flex-col gap-1.5">
                                    {team.map((member) => {
                                        const active = selected.includes(member.email)
                                        return (
                                            <button
                                                key={member.email}
                                                onClick={() => toggle(member.email)}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left",
                                                    active
                                                        ? "bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20"
                                                        : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"
                                                )}
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-xs font-black text-zinc-950 shrink-0">
                                                    {member.initials}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn("text-sm font-semibold truncate", active ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400")}>
                                                        {member.name}
                                                    </p>
                                                    <p className="text-xs text-zinc-400 dark:text-zinc-600 truncate">{member.role} · {member.email}</p>
                                                </div>
                                                <div className={cn(
                                                    "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all",
                                                    active
                                                        ? "bg-amber-400 border-amber-400"
                                                        : "border-zinc-300 dark:border-white/20"
                                                )}>
                                                    {active && <Check size={11} className="text-zinc-950" />}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                                {selected.length === 0 && (
                                    <p className="text-xs text-red-400 mt-1.5">Select at least one recipient.</p>
                                )}
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="What's this about?"
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                                    Message <span className="text-amber-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write your message here..."
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <Button
                                    onClick={handleSend}
                                    disabled={!canSend}
                                    className={cn(
                                        "flex-1 rounded-xl font-bold h-11 gap-2 transition-all",
                                        sent
                                            ? "bg-emerald-400 hover:bg-emerald-400 text-zinc-950"
                                            : "bg-amber-400 hover:bg-amber-300 text-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {sent ? (
                                        <><Check size={15} /> Sent!</>
                                    ) : (
                                        <><Send size={14} /> Send Message</>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-5"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}