"use client"

import { TICKET_STATUS_CONFIG, TICKET_PRIORITY_CONFIG, TICKET_CATEGORY_COLORS } from "@/lib/helpers/constants"
import { cn } from "@/lib/utils"

import {
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    Clock,
    LifeBuoy,
    MessageSquare,
    Paperclip,
    Send,
    Tag,
    User,
    X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const mockTickets: Record<string, {
    id: string; subject: string; category: string; priority: string
    status: string; createdAt: string; updatedAt: string
    assignedTo: { name: string; role: string; initials: string }
    messages: { id: string; sender: "client" | "team"; name: string; initials: string; text: string; time: string; attachments?: string[] }[]
}> = {
    "TKT-001": {
        id: "TKT-001",
        subject: "Payment gateway not processing correctly",
        category: "Bug Report", priority: "urgent", status: "open",
        createdAt: "Feb 20, 2026", updatedAt: "2 hours ago",
        assignedTo: { name: "Rico Mendez", role: "Backend Dev", initials: "RM" },
        messages: [
            {
                id: "m1", sender: "client", name: "You", initials: "YO",
                text: "The Stripe webhook is returning a 400 error on production. I checked the logs and it started happening around 2PM today. The test environment works fine but production is broken.",
                time: "Feb 20, 2026 at 3:45 PM",
                attachments: ["stripe-error-log.txt"],
            },
            {
                id: "m2", sender: "team", name: "Rico Mendez", initials: "RM",
                text: "Thanks for the report. I've looked at the logs and it appears the webhook secret key may have been rotated. Can you check in your Stripe dashboard under Developers > Webhooks and confirm the signing secret matches what's in your environment variables?",
                time: "Feb 20, 2026 at 4:12 PM",
            },
            {
                id: "m3", sender: "client", name: "You", initials: "YO",
                text: "I checked and you're right — the signing secret was rotated last week. I've updated the env variable but I'll need a deployment to push it to production. Can you do that?",
                time: "Feb 20, 2026 at 5:00 PM",
            },
            {
                id: "m4", sender: "team", name: "Rico Mendez", initials: "RM",
                text: "On it. I've triggered a deployment to production — it should be live within 5–10 minutes. I'll monitor the webhook logs on my end and confirm once it's processing correctly.",
                time: "Feb 20, 2026 at 5:20 PM",
            },
            {
                id: "m5", sender: "client", name: "You", initials: "YO",
                text: "The deployment went through and I can see payments processing again. Really appreciate the fast turnaround on this one.",
                time: "Feb 20, 2026 at 5:38 PM",
            },
            {
                id: "m6", sender: "team", name: "Rico Mendez", initials: "RM",
                text: "Glad it's back up! I've added a monitoring alert so we get notified immediately if the webhook starts failing again. I'd also recommend setting a reminder to rotate the signing secret on a schedule to avoid this in the future.",
                time: "Feb 20, 2026 at 5:45 PM",
            },
        ],
    },
    "TKT-002": {
        id: "TKT-002",
        subject: "Add CSV export to the orders table",
        category: "Feature Request", priority: "medium", status: "in_progress",
        createdAt: "Feb 18, 2026", updatedAt: "Yesterday",
        assignedTo: { name: "Ana Kim", role: "Frontend Dev", initials: "AK" },
        messages: [
            {
                id: "m1", sender: "client", name: "You", initials: "YO",
                text: "It would be really helpful to have a CSV export button on the orders table so we can pull data into Excel for reporting.",
                time: "Feb 18, 2026 at 10:00 AM",
            },
            {
                id: "m2", sender: "team", name: "Ana Kim", initials: "AK",
                text: "Great suggestion! We've scoped this out and it will be included in the next sprint starting March 1. The export will include all visible columns and respect any active filters.",
                time: "Feb 19, 2026 at 9:30 AM",
            },
        ],
    },
    "TKT-003": {
        id: "TKT-003",
        subject: "Question about Invoice #INV-0041",
        category: "Billing / Invoice", priority: "low", status: "resolved",
        createdAt: "Feb 15, 2026", updatedAt: "Feb 16, 2026",
        assignedTo: { name: "Sara Lim", role: "Billing Support", initials: "SL" },
        messages: [
            {
                id: "m1", sender: "client", name: "You", initials: "YO",
                text: "Hi, I noticed Invoice #INV-0041 has a different amount than what we discussed. The total shows $3,200 but we agreed on $2,800. Can you review this?",
                time: "Feb 15, 2026 at 11:00 AM",
                attachments: ["INV-0041.pdf"],
            },
            {
                id: "m2", sender: "team", name: "Sara Lim", initials: "SL",
                text: "Thanks for flagging this! I reviewed the invoice and you're correct — there was an error in the line items. The additional $400 was a duplicate entry for the design phase. I've corrected it and will resend the updated invoice shortly.",
                time: "Feb 15, 2026 at 2:30 PM",
            },
            {
                id: "m3", sender: "client", name: "You", initials: "YO",
                text: "Perfect, thank you for the quick fix. I'll process the payment once I receive the updated invoice.",
                time: "Feb 15, 2026 at 3:00 PM",
            },
            {
                id: "m4", sender: "team", name: "Sara Lim", initials: "SL",
                text: "The invoice has been updated and resent to your email. Let us know if you need anything else.",
                time: "Feb 16, 2026 at 9:00 AM",
                attachments: ["INV-0041-revised.pdf"],
            },
        ],
    },
    "TKT-004": {
        id: "TKT-004",
        subject: "How do I add a new product category?",
        category: "Project Question", priority: "low", status: "resolved",
        createdAt: "Feb 10, 2026", updatedAt: "Feb 11, 2026",
        assignedTo: { name: "Ana Kim", role: "Frontend Dev", initials: "AK" },
        messages: [
            {
                id: "m1", sender: "client", name: "You", initials: "YO",
                text: "Hey, I've been trying to figure out how to add a new product category in the admin panel but I can't find the option. Is it hidden somewhere?",
                time: "Feb 10, 2026 at 2:00 PM",
            },
            {
                id: "m2", sender: "team", name: "Ana Kim", initials: "AK",
                text: "You can add categories from the admin panel under Products > Categories. There's an 'Add Category' button in the top right corner of that page. Happy to jump on a call if needed.",
                time: "Feb 11, 2026 at 9:15 AM",
            },
            {
                id: "m3", sender: "client", name: "You", initials: "YO",
                text: "Found it! I was looking in the wrong section. Thanks a lot.",
                time: "Feb 11, 2026 at 10:00 AM",
            },
        ],
    },
    "TKT-005": {
        id: "TKT-005",
        subject: "Mobile app crashing on Android 13",
        category: "Bug Report", priority: "high", status: "open",
        createdAt: "Feb 22, 2026", updatedAt: "1 hour ago",
        assignedTo: { name: "Rico Mendez", role: "Backend Dev", initials: "RM" },
        messages: [
            {
                id: "m1", sender: "client", name: "You", initials: "YO",
                text: "The mobile app keeps crashing on Android 13 devices whenever we try to use the offline sync feature. This is happening across three different devices. I've attached the crash logs from each.",
                time: "Feb 22, 2026 at 8:00 AM",
                attachments: ["crash-log-device1.txt", "crash-log-device2.txt", "crash-log-device3.txt"],
            },
        ],
    },
}

const VISIBLE_COUNT = 3

export function TicketDetail({ id }: { id: string }) {
    const ticket = mockTickets[id]
    const [reply, setReply] = useState("")
    const [sending, setSending] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [showAll, setShowAll] = useState(false)

    if (!ticket) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-zinc-400 dark:text-zinc-600 mb-4">Ticket not found.</p>
                    <Link href="/portal/support" className="text-amber-500 text-sm font-semibold hover:underline">Back to Support</Link>
                </div>
            </div>
        )
    }

    const status = TICKET_STATUS_CONFIG[ticket.status as keyof typeof TICKET_STATUS_CONFIG]
    const priority = TICKET_PRIORITY_CONFIG[ticket.priority as keyof typeof TICKET_PRIORITY_CONFIG]
    const StatusIcon = status.icon

    const hiddenCount = Math.max(0, ticket.messages.length - VISIBLE_COUNT)
    const visibleMessages = showAll ? ticket.messages : ticket.messages.slice(-VISIBLE_COUNT)

    const handleSend = async () => {
        if (!reply.trim()) return
        setSending(true)
        await new Promise((r) => setTimeout(r, 800))
        setReply("")
        setFiles([])
        setSending(false)
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">

            {/* Back */}
            <Link href="/portal/support" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 font-semibold mb-6 transition-colors group">
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Support
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-600">{ticket.id}</span>
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold", status.color)}>
                            <StatusIcon size={11} />{status.label}
                        </span>
                        <span className={cn("inline-flex px-2 py-0.5 rounded-lg border text-[11px] font-semibold capitalize", priority.color)}>
                            {priority.label}
                        </span>
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-semibold", TICKET_CATEGORY_COLORS[ticket.category])}>
                            <Tag size={9} />{ticket.category}
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">{ticket.subject}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Conversation ── */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Messages */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                            <LifeBuoy size={14} className="text-amber-500 dark:text-amber-400" />
                            <h2 className="font-bold text-zinc-900 dark:text-white text-sm">Conversation</h2>
                            <span className="text-xs text-zinc-400 dark:text-zinc-600 ml-auto">{ticket.messages.length} messages</span>
                        </div>

                        {/* Show / collapse older messages */}
                        {hiddenCount > 0 && (
                            <button
                                onClick={() => setShowAll((p) => !p)}
                                className="w-full flex items-center justify-center gap-2 py-3 border-b border-zinc-100 dark:border-white/5 text-xs font-semibold text-zinc-400 dark:text-zinc-600 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-all group"
                            >
                                <MessageSquare size={12} className="group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                                {showAll
                                    ? "Collapse conversation"
                                    : `Show ${hiddenCount} earlier ${hiddenCount === 1 ? "message" : "messages"}`
                                }
                                <ChevronDown size={12} className={cn("transition-transform group-hover:text-amber-500 dark:group-hover:text-amber-400", showAll && "rotate-180")} />
                            </button>
                        )}

                        <div className="divide-y divide-zinc-100 dark:divide-white/5">
                            {visibleMessages.map((msg) => {
                                const isClient = msg.sender === "client"
                                return (
                                    <div key={msg.id} className={cn("p-6", !isClient && "bg-zinc-50/50 dark:bg-white/[0.02]")}>
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className={cn(
                                                "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0",
                                                isClient
                                                    ? "bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950"
                                                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                                            )}>
                                                {msg.initials}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{msg.name}</span>
                                                    {!isClient && (
                                                        <span className="px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-200 dark:border-amber-400/20">
                                                            Team
                                                        </span>
                                                    )}
                                                    <span className="text-[11px] text-zinc-400 dark:text-zinc-600 ml-auto">{msg.time}</span>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{msg.text}</p>

                                                {/* Attachments */}
                                                {msg.attachments && msg.attachments.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {msg.attachments.map((file) => (
                                                            <div key={file} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-white/5 text-xs text-zinc-600 dark:text-zinc-400">
                                                                <Paperclip size={11} />
                                                                {file}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Reply box */}
                    {ticket.status !== "resolved" && (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Add a Reply</h3>
                            <textarea
                                placeholder="Write your reply here..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none mb-3"
                            />

                            {/* Attached files */}
                            {files.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {files.map((file, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-white/5 text-xs text-zinc-600 dark:text-zinc-400">
                                            <Paperclip size={11} />
                                            <span className="max-w-[120px] truncate">{file.name}</span>
                                            <button onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-red-400 transition-colors">
                                                <X size={11} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 cursor-pointer transition-all">
                                    <Paperclip size={13} /> Attach
                                    <input type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) setFiles((p) => [...p, ...Array.from(e.target.files!)]) }} />
                                </label>
                                <button
                                    onClick={handleSend}
                                    disabled={!reply.trim() || sending}
                                    className="flex items-center gap-2 ml-auto px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-bold text-sm transition-all"
                                >
                                    {sending ? (
                                        <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                                    ) : (
                                        <Send size={13} />
                                    )}
                                    {sending ? "Sending..." : "Send Reply"}
                                </button>
                            </div>
                        </div>
                    )}

                    {ticket.status === "resolved" && (
                        <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-5 flex items-center gap-3">
                            <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">This ticket is resolved</p>
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70 mt-0.5">If you need further help, <Link href="/portal/support/new" className="underline font-semibold">open a new ticket</Link>.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Sidebar ── */}
                <div className="flex flex-col gap-5">

                    {/* Ticket info */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">Ticket Info</p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Ticket ID", value: ticket.id },
                                { label: "Created", value: ticket.createdAt },
                                { label: "Updated", value: ticket.updatedAt },
                                { label: "Category", value: ticket.category },
                                { label: "Priority", value: priority.label },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-zinc-400 dark:text-zinc-600 shrink-0">{row.label}</span>
                                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 text-right truncate">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Assigned to */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">Assigned To</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-zinc-950 font-black text-sm shrink-0">
                                {ticket.assignedTo.initials}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{ticket.assignedTo.name}</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600">{ticket.assignedTo.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">Timeline</p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Ticket opened", time: ticket.createdAt, icon: LifeBuoy, color: "text-amber-500 dark:text-amber-400" },
                                { label: "Team assigned", time: ticket.createdAt, icon: User, color: "text-blue-500  dark:text-blue-400" },
                                { label: "Last activity", time: ticket.updatedAt, icon: Clock, color: "text-zinc-400  dark:text-zinc-600" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                        <item.icon size={11} className={item.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{item.label}</p>
                                        <p className="text-[11px] text-zinc-400 dark:text-zinc-600">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}