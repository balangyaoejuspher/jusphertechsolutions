"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    Search,
    X,
    Mail,
    Building2,
    Calendar,
    MessageSquare,
    ChevronDown,
} from "lucide-react"

const initialInquiries = [
    {
        id: "1",
        name: "David Thompson",
        email: "david@acmecorp.com",
        company: "Acme Corp",
        message:
            "We're looking for a senior full-stack developer to join our team for a 6-month project. Must have experience with React and Node.js.",
        date: "2026-02-21",
        status: "new",
    },
    {
        id: "2",
        name: "Sarah Kim",
        email: "sarah@techstartup.io",
        company: "TechStartup Inc.",
        message:
            "Need a virtual assistant for executive support — calendar management, inbox handling, and research tasks. Part-time, 20hrs/week.",
        date: "2026-02-20",
        status: "in_progress",
    },
    {
        id: "3",
        name: "Marco Rossi",
        email: "marco@designco.com",
        company: "DesignCo",
        message:
            "Looking for a project manager to oversee our product launch. We're a team of 8 and need someone who knows Agile and Jira well.",
        date: "2026-02-18",
        status: "resolved",
    },
    {
        id: "4",
        name: "Emily Nguyen",
        email: "emily@fintech.com",
        company: "FinTech Solutions",
        message:
            "We need a mobile developer with React Native experience for a 3-month contract. App is already in development, need extra hands.",
        date: "2026-02-17",
        status: "new",
    },
    {
        id: "5",
        name: "James Patel",
        email: "james@agency.co",
        company: "Agency Co.",
        message:
            "Looking for a VA to handle social media scheduling and client communications. Full-time preferred, must be available GMT+8.",
        date: "2026-02-15",
        status: "in_progress",
    },
]

const statuses = [
    { value: "all", label: "All" },
    { value: "new", label: "New" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
]

const statusStyles: Record<string, string> = {
    new: "bg-blue-50 text-blue-700",
    in_progress: "bg-amber-50 text-amber-700",
    resolved: "bg-green-50 text-green-700",
}

const statusLabels: Record<string, string> = {
    new: "New",
    in_progress: "In Progress",
    resolved: "Resolved",
}

type Inquiry = typeof initialInquiries[0]

export default function DashboardInquiriesPage() {
    const [inquiries, setInquiries] = useState(initialInquiries)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [selected, setSelected] = useState<Inquiry | null>(null)
    const [statusDropdown, setStatusDropdown] = useState<string | null>(null)

    const filtered = inquiries
        .filter((i) => filterStatus === "all" || i.status === filterStatus)
        .filter(
            (i) =>
                i.name.toLowerCase().includes(search.toLowerCase()) ||
                i.company.toLowerCase().includes(search.toLowerCase()) ||
                i.email.toLowerCase().includes(search.toLowerCase())
        )

    const updateStatus = (id: string, status: string) => {
        setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)))
        setStatusDropdown(null)
        if (selected?.id === id) {
            setSelected({ ...selected, status })
        }
    }

    const deleteInquiry = (id: string) => {
        setInquiries(inquiries.filter((i) => i.id !== id))
        if (selected?.id === id) setSelected(null)
    }

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })

    const counts = {
        all: inquiries.length,
        new: inquiries.filter((i) => i.status === "new").length,
        in_progress: inquiries.filter((i) => i.status === "in_progress").length,
        resolved: inquiries.filter((i) => i.status === "resolved").length,
    }

    return (
        <div className="p-8 md:p-10 h-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 mb-1">Inquiries</h1>
                <p className="text-zinc-500 text-sm">{inquiries.length} total client inquiries</p>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
                {statuses.map((s) => (
                    <button
                        key={s.value}
                        onClick={() => setFilterStatus(s.value)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                            filterStatus === s.value
                                ? "bg-zinc-900 text-white"
                                : "bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300"
                        )}
                    >
                        {s.label}
                        <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded-md font-semibold",
                            filterStatus === s.value
                                ? "bg-white/20 text-white"
                                : "bg-zinc-100 text-zinc-500"
                        )}>
                            {counts[s.value as keyof typeof counts]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm mb-6">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search by name, company or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder:text-zinc-300 outline-none focus:border-amber-400 transition-all"
                />
            </div>

            {/* Content */}
            <div className="flex gap-6 h-full">

                {/* Inquiries List */}
                <div className={cn(
                    "flex flex-col gap-3 transition-all duration-300",
                    selected ? "w-full lg:w-2/5" : "w-full"
                )}>
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-zinc-400 text-sm bg-white border border-zinc-100 rounded-2xl">
                            No inquiries found.
                        </div>
                    ) : (
                        filtered.map((inquiry) => (
                            <div
                                key={inquiry.id}
                                onClick={() => setSelected(inquiry)}
                                className={cn(
                                    "bg-white border rounded-2xl p-5 cursor-pointer transition-all duration-150 hover:shadow-sm",
                                    selected?.id === inquiry.id
                                        ? "border-amber-400 shadow-sm shadow-amber-100"
                                        : "border-zinc-100 hover:border-zinc-200"
                                )}
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-zinc-900 text-sm truncate">{inquiry.name}</p>
                                        <p className="text-zinc-400 text-xs truncate">{inquiry.company}</p>
                                    </div>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-xs font-medium shrink-0",
                                        statusStyles[inquiry.status]
                                    )}>
                                        {statusLabels[inquiry.status]}
                                    </span>
                                </div>
                                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-3">
                                    {inquiry.message}
                                </p>
                                <div className="flex items-center gap-1.5 text-zinc-300 text-xs">
                                    <Calendar size={11} />
                                    {formatDate(inquiry.date)}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Detail Panel */}
                {selected && (
                    <div className="hidden lg:flex flex-col flex-1 bg-white border border-zinc-100 rounded-2xl overflow-hidden">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                            <h3 className="font-bold text-zinc-900">Inquiry Details</h3>
                            <button
                                onClick={() => setSelected(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Contact Info */}
                            <div className="flex flex-col gap-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                        {selected.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">{selected.name}</p>
                                        <p className="text-zinc-400 text-xs">{selected.company}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 bg-zinc-50 rounded-2xl p-4">
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <Mail size={14} className="text-zinc-400 shrink-0" />
                                        <a
                                            href={`mailto:${selected.email}`}
                                            className="text-amber-500 hover:underline truncate"
                                        >
                                            {selected.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <Building2 size={14} className="text-zinc-400 shrink-0" />
                                        <span className="text-zinc-600">{selected.company}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <Calendar size={14} className="text-zinc-400 shrink-0" />
                                        <span className="text-zinc-600">{formatDate(selected.date)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare size={14} className="text-zinc-400" />
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                                        Message
                                    </p>
                                </div>
                                <p className="text-zinc-600 text-sm leading-relaxed bg-zinc-50 rounded-2xl p-4">
                                    {selected.message}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                                    Status
                                </p>
                                <div className="relative">
                                    <button
                                        onClick={() => setStatusDropdown(statusDropdown === selected.id ? null : selected.id)}
                                        className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:border-zinc-300 transition-all"
                                    >
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-lg text-xs font-medium",
                                            statusStyles[selected.status]
                                        )}>
                                            {statusLabels[selected.status]}
                                        </span>
                                        <ChevronDown size={15} className="text-zinc-400" />
                                    </button>
                                    {statusDropdown === selected.id && (
                                        <div className="absolute top-12 left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-10">
                                            {["new", "in_progress", "resolved"].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateStatus(selected.id, s)}
                                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-50 flex items-center gap-2"
                                                >
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-lg text-xs font-medium",
                                                        statusStyles[s]
                                                    )}>
                                                        {statusLabels[s]}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <a
                                    href={`mailto:${selected.email}`}
                                    className="flex items-center justify-center gap-2 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all"
                                >
                                    <Mail size={15} />
                                    Reply via Email
                                </a>
                                <button
                                    onClick={() => deleteInquiry(selected.id)}
                                    className="flex items-center justify-center gap-2 h-11 rounded-xl border border-zinc-200 text-red-500 hover:bg-red-50 hover:border-red-200 font-medium text-sm transition-all"
                                >
                                    <X size={15} />
                                    Delete Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}