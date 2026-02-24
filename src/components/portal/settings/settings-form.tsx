"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { SETTINGS_TABS, type SettingsTab } from "@/lib/helpers/constants"
import { cn } from "@/lib/utils"
import type { ClientRow } from "@/server/db/schema"
import {
    AlertTriangle,
    Check,
    Eye, EyeOff,
    Save,
    Settings,
    X
} from "lucide-react"
import { useState } from "react"

export function SettingsSkeleton() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">
            <div className="mb-8">
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-8 w-36 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2 mb-6">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-28 rounded-xl" />)}
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                <Skeleton className="h-5 w-32 mb-6" />
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-3 w-20 mb-2" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
                <Skeleton className="h-11 w-32 rounded-xl mt-6" />
            </div>
        </div>
    )
}

// ── Input ─────────────────────────────────────────────────────
function Field({
    label, value, onChange, type = "text", placeholder, disabled, hint,
}: {
    label: string; value: string; onChange?: (v: string) => void
    type?: string; placeholder?: string; disabled?: boolean; hint?: string
}) {
    const [show, setShow] = useState(false)
    const isPassword = type === "password"

    return (
        <div>
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1.5 block">
                {label}
            </label>
            <div className="relative">
                <input
                    type={isPassword && !show ? "password" : "text"}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                        "w-full h-11 px-4 rounded-xl border text-sm transition-colors focus:outline-none focus:border-amber-400",
                        "bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
                        "border-zinc-200 dark:border-white/10",
                        disabled && "opacity-50 cursor-not-allowed",
                        isPassword && "pr-11"
                    )}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                )}
            </div>
            {hint && <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-1.5">{hint}</p>}
        </div>
    )
}

// ── Toggle ────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={cn(
                "relative w-10 h-6 rounded-full transition-all duration-200 shrink-0",
                checked ? "bg-amber-400" : "bg-zinc-200 dark:bg-zinc-700"
            )}
        >
            <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
                checked ? "left-5" : "left-1"
            )} />
        </button>
    )
}

// ── Save button ───────────────────────────────────────────────
function SaveButton({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-400/20"
        >
            {saving ? (
                <><div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />Saving...</>
            ) : saved ? (
                <><Check size={15} />Saved!</>
            ) : (
                <><Save size={15} />Save Changes</>
            )}
        </button>
    )
}

// ── Profile tab ───────────────────────────────────────────────
function ProfileTab({ client }: { client: ClientRow }) {
    const [form, setForm] = useState({
        name: client.name ?? "",
        email: client.email ?? "",
        phone: client.phone ?? "",
        company: client.company ?? "",
        position: client.position ?? "",
        website: client.website ?? "",
        location: client.location ?? "",
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const set = (key: string) => (v: string) => setForm((p) => ({ ...p, [key]: v }))

    const handleSave = async () => {
        setSaving(true)
        await new Promise((r) => setTimeout(r, 1000)) // TODO: wire to API
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Avatar */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Profile Picture</h3>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-zinc-950 font-black text-2xl shrink-0">
                        {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{client.name}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-2">{client.email}</p>
                        <span className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-[11px] font-semibold capitalize">
                            {client.type}
                        </span>
                    </div>
                </div>
            </div>

            {/* Basic info */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-5">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Field label="Full Name" value={form.name} onChange={set("name")} placeholder="Your full name" />
                    <Field label="Email" value={form.email} onChange={set("email")} placeholder="your@email.com" hint="Changing email requires re-verification" />
                    <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="+63 912 345 6789" />
                    <Field label="Location" value={form.location} onChange={set("location")} placeholder="City, Country" />
                    <Field label="Website" value={form.website} onChange={set("website")} placeholder="https://yoursite.com" />
                </div>

                {client.type === "individual" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pt-4 border-t border-zinc-100 dark:border-white/5">
                        <Field label="Company" value={form.company} onChange={set("company")} placeholder="Your company name" />
                        <Field label="Position" value={form.position} onChange={set("position")} placeholder="Your job title" />
                    </div>
                )}

                <SaveButton onClick={handleSave} saving={saving} saved={saved} />
            </div>

            {/* Subscribed services — read only */}
            {client.services.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Subscribed Services</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-4">Contact us to add or remove services.</p>
                    <div className="flex flex-wrap gap-2">
                        {client.services.map((s) => (
                            <span key={s} className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-semibold">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Notifications tab ─────────────────────────────────────────
function NotificationsTab() {
    const [prefs, setPrefs] = useState({
        invoiceAlerts: true,
        projectUpdates: true,
        meetingReminders: true,
        ticketReplies: true,
        weeklyDigest: false,
        marketingEmails: false,
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const toggle = (key: keyof typeof prefs) => (v: boolean) =>
        setPrefs((p) => ({ ...p, [key]: v }))

    const handleSave = async () => {
        setSaving(true)
        await new Promise((r) => setTimeout(r, 800))
        setSaving(false); setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const groups = [
        {
            title: "Project & Billing",
            items: [
                { key: "invoiceAlerts", label: "Invoice Alerts", desc: "Get notified when a new invoice is issued or due" },
                { key: "projectUpdates", label: "Project Updates", desc: "Milestone completions and status changes on your projects" },
            ],
        },
        {
            title: "Communication",
            items: [
                { key: "meetingReminders", label: "Meeting Reminders", desc: "Reminders 24h and 1h before scheduled meetings" },
                { key: "ticketReplies", label: "Ticket Replies", desc: "Notifications when our team replies to your support tickets" },
            ],
        },
        {
            title: "Other",
            items: [
                { key: "weeklyDigest", label: "Weekly Digest", desc: "A weekly summary of your projects and activity" },
                { key: "marketingEmails", label: "Marketing Emails", desc: "News, updates, and offers from Juspher & Co. Tech Solutions" },
            ],
        },
    ]

    return (
        <div className="flex flex-col gap-5">
            {groups.map((group) => (
                <div key={group.title} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{group.title}</h3>
                    </div>
                    <div className="divide-y divide-zinc-100 dark:divide-white/5">
                        {group.items.map((item) => (
                            <div key={item.key} className="flex items-center justify-between gap-4 px-6 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.label}</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{item.desc}</p>
                                </div>
                                <Toggle
                                    checked={prefs[item.key as keyof typeof prefs]}
                                    onChange={toggle(item.key as keyof typeof prefs)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div>
                <SaveButton onClick={handleSave} saving={saving} saved={saved} />
            </div>
        </div>
    )
}

// ── Security tab ──────────────────────────────────────────────
function SecurityTab() {
    const [form, setForm] = useState({ current: "", newPass: "", confirm: "" })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState("")

    const set = (key: string) => (v: string) => {
        setForm((p) => ({ ...p, [key]: v }))
        setError("")
    }

    const handleSave = async () => {
        if (!form.current) return setError("Current password is required")
        if (form.newPass.length < 8) return setError("New password must be at least 8 characters")
        if (form.newPass !== form.confirm) return setError("Passwords do not match")
        setSaving(true)
        await new Promise((r) => setTimeout(r, 1000))
        setSaving(false); setSaved(true)
        setForm({ current: "", newPass: "", confirm: "" })
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="flex flex-col gap-5">

            {/* Change password */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Change Password</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-5">Choose a strong password at least 8 characters long.</p>
                <div className="flex flex-col gap-4 mb-5">
                    <Field label="Current Password" value={form.current} onChange={set("current")} type="password" placeholder="Enter current password" />
                    <Field label="New Password" value={form.newPass} onChange={set("newPass")} type="password" placeholder="Enter new password" />
                    <Field label="Confirm Password" value={form.confirm} onChange={set("confirm")} type="password" placeholder="Confirm new password" />
                </div>
                {error && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20 text-red-500 dark:text-red-400 text-xs font-semibold mb-4">
                        <X size={13} /> {error}
                    </div>
                )}
                <SaveButton onClick={handleSave} saving={saving} saved={saved} />
            </div>

            {/* Connected accounts */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Connected Accounts</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-5">Manage your linked sign-in methods via Clerk.</p>
                <div className="flex flex-col gap-3">
                    {[
                        { label: "Google", connected: true },
                        { label: "GitHub", connected: false },
                    ].map((account) => (
                        <div key={account.label} className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/10">
                            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{account.label}</span>
                            {account.connected ? (
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <Check size={12} /> Connected
                                </span>
                            ) : (
                                <button className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">Connect</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Active sessions */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Active Sessions</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-5">Devices currently signed in to your account.</p>
                <div className="flex flex-col gap-3">
                    {[
                        { device: "Chrome on macOS", location: "Cebu City, PH", time: "Now — current session", current: true },
                        { device: "Safari on iPhone", location: "Cebu City, PH", time: "2 hours ago", current: false },
                    ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{session.device}</p>
                                    {session.current && (
                                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-400/20">
                                            You
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600">{session.location} · {session.time}</p>
                            </div>
                            {!session.current && (
                                <button className="text-xs font-semibold text-red-500 dark:text-red-400 hover:underline">Revoke</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ── Danger Zone tab ───────────────────────────────────────────
function DangerZoneTab({ client }: { client: ClientRow }) {
    const [confirm, setConfirm] = useState("")
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    const handleRequest = async () => {
        if (confirm !== client.name) return
        setSending(true)
        await new Promise((r) => setTimeout(r, 1000))
        setSending(false); setSent(true)
    }

    return (
        <div className="flex flex-col gap-5">

            {/* Export data */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Export Your Data</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-4">Download a copy of all your data including projects, invoices, and tickets.</p>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 transition-all">
                    Request Data Export
                </button>
            </div>

            {/* Delete account */}
            <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-400/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20 flex items-center justify-center shrink-0">
                        <AlertTriangle size={15} className="text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Request Account Deletion</h3>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5 leading-relaxed">
                            This will send a deletion request to our team. Active projects and unpaid invoices must be resolved first. This action cannot be undone.
                        </p>
                    </div>
                </div>

                {!sent ? (
                    <>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                            Type <span className="font-bold text-zinc-900 dark:text-white">{client.name}</span> to confirm:
                        </p>
                        <input
                            type="text"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder={client.name}
                            className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-red-400 transition-colors mb-4"
                        />
                        <button
                            onClick={handleRequest}
                            disabled={confirm !== client.name || sending}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all"
                        >
                            {sending ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                            ) : (
                                <><AlertTriangle size={14} />Request Deletion</>
                            )}
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-200 dark:border-emerald-400/20 rounded-xl">
                        <Check size={15} className="text-emerald-500 shrink-0" />
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            Request sent. Our team will contact you within 24 hours.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
// ── Main export ───────────────────────────────────────────────
export function SettingsForm({ client }: { client: ClientRow }) {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile")

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Settings size={14} className="text-amber-500 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">Client Portal</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage your profile, notifications, and account preferences.</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                {SETTINGS_TABS.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all",
                                isActive
                                    ? tab.id === "danger"
                                        ? "bg-red-500 border-red-500 text-white"
                                        : "bg-amber-400 border-amber-400 text-zinc-950"
                                    : tab.id === "danger"
                                        ? "bg-white dark:bg-zinc-900 border-red-200 dark:border-red-400/20 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/5"
                                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-amber-400/50 hover:text-amber-600 dark:hover:text-amber-400"
                            )}
                        >
                            <tab.icon size={13} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab content */}
            {activeTab === "profile" && <ProfileTab client={client} />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "danger" && <DangerZoneTab client={client} />}
        </div>
    )
}