"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check, Bell, Shield, Globe, Palette, ChevronRight } from "lucide-react"

const sections = [
    { id: "profile", label: "Profile", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
]

export default function DashboardSettingsPage() {
    const [activeSection, setActiveSection] = useState("profile")
    const [saved, setSaved] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [profile, setProfile] = useState({
        agencyName: "Portfolio Agency",
        email: "hello@portfolioagency.com",
        phone: "",
        website: "https://portfolioagency.com",
        bio: "We connect businesses with top-tier developers, virtual assistants, and project managers.",
        timezone: "Asia/Manila",
    })
    const [notifications, setNotifications] = useState({
        newInquiry: true,
        talentUpdate: true,
        weeklyReport: false,
        marketing: false,
    })

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const activeSectionData = sections.find((s) => s.id === activeSection)

    return (
        <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-zinc-900 mb-1">Settings</h1>
                <p className="text-zinc-500 text-sm">Manage your agency preferences and account settings.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Mobile Section Selector */}
                <div className="md:hidden">
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900"
                    >
                        <div className="flex items-center gap-2">
                            {activeSectionData && <activeSectionData.icon size={16} className="text-zinc-400" />}
                            <span>{activeSectionData?.label}</span>
                        </div>
                        <ChevronRight
                            size={16}
                            className={cn(
                                "text-zinc-400 transition-transform duration-200",
                                showMobileMenu ? "rotate-90" : ""
                            )}
                        />
                    </button>

                    {showMobileMenu && (
                        <div className="mt-2 bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-lg">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        setActiveSection(section.id)
                                        setShowMobileMenu(false)
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left border-b border-zinc-100 last:border-0",
                                        activeSection === section.id
                                            ? "bg-zinc-900 text-white"
                                            : "text-zinc-600 hover:bg-zinc-50"
                                    )}
                                >
                                    <section.icon
                                        size={16}
                                        className={activeSection === section.id ? "text-white" : "text-zinc-400"}
                                    />
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Sidebar Nav */}
                <aside className="hidden md:flex flex-col w-44 shrink-0 gap-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                                activeSection === section.id
                                    ? "bg-zinc-900 text-white"
                                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                            )}
                        >
                            <section.icon
                                size={16}
                                className={activeSection === section.id ? "text-white" : "text-zinc-400"}
                            />
                            {section.label}
                        </button>
                    ))}
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0">

                    {/* Profile */}
                    {activeSection === "profile" && (
                        <div className="bg-white border border-zinc-100 rounded-2xl p-5 md:p-8">
                            <h2 className="font-bold text-zinc-900 text-base md:text-lg mb-1">Agency Profile</h2>
                            <p className="text-zinc-400 text-sm mb-6">Update your agency's public information.</p>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Agency Name</label>
                                    <input
                                        type="text"
                                        value={profile.agencyName}
                                        onChange={(e) => setProfile({ ...profile, agencyName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            placeholder="+63 900 000 0000"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Website</label>
                                    <input
                                        type="url"
                                        value={profile.website}
                                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Timezone</label>
                                    <select
                                        value={profile.timezone}
                                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                    >
                                        <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                                        <option value="America/New_York">America/New_York (GMT-5)</option>
                                        <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
                                        <option value="Europe/London">Europe/London (GMT+0)</option>
                                        <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                                        <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                                        <option value="Australia/Sydney">Australia/Sydney (GMT+11)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Agency Description</label>
                                    <textarea
                                        rows={4}
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    {activeSection === "notifications" && (
                        <div className="bg-white border border-zinc-100 rounded-2xl p-5 md:p-8">
                            <h2 className="font-bold text-zinc-900 text-base md:text-lg mb-1">Notifications</h2>
                            <p className="text-zinc-400 text-sm mb-6">Choose what you want to be notified about.</p>

                            <div className="flex flex-col gap-3">
                                {[
                                    { key: "newInquiry", label: "New Inquiries", desc: "Get notified when a client submits a new inquiry" },
                                    { key: "talentUpdate", label: "Talent Updates", desc: "Get notified when a talent profile is updated" },
                                    { key: "weeklyReport", label: "Weekly Report", desc: "Receive a weekly summary of your agency activity" },
                                    { key: "marketing", label: "Marketing Emails", desc: "Tips, updates, and news from Portfolio Agency" },
                                ].map((item) => (
                                    <div
                                        key={item.key}
                                        className="flex items-center justify-between gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-semibold text-zinc-900 text-sm mb-0.5">{item.label}</p>
                                            <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setNotifications({
                                                    ...notifications,
                                                    [item.key]: !notifications[item.key as keyof typeof notifications],
                                                })
                                            }
                                            className={cn(
                                                "w-11 h-6 rounded-full transition-all duration-200 shrink-0 relative",
                                                notifications[item.key as keyof typeof notifications] ? "bg-amber-400" : "bg-zinc-200"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200",
                                                    notifications[item.key as keyof typeof notifications] ? "left-6" : "left-1"
                                                )}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security */}
                    {activeSection === "security" && (
                        <div className="bg-white border border-zinc-100 rounded-2xl p-5 md:p-8">
                            <h2 className="font-bold text-zinc-900 text-base md:text-lg mb-1">Security</h2>
                            <p className="text-zinc-400 text-sm mb-6">Manage your account security settings.</p>

                            <div className="flex flex-col gap-3">
                                {[
                                    { label: "Password", sub: "Last changed 30 days ago", btnLabel: "Change", btnClass: "border-zinc-200 text-zinc-600" },
                                    { label: "Two-Factor Authentication", sub: "Add an extra layer of security", btnLabel: "Enable", btnClass: "border-zinc-200 text-zinc-600" },
                                    { label: "Active Sessions", sub: "1 active session on Windows · Chrome", btnLabel: "Revoke All", btnClass: "border-red-200 text-red-500 hover:bg-red-50" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100"
                                    >
                                        <div>
                                            <p className="font-semibold text-zinc-900 text-sm mb-0.5">{item.label}</p>
                                            <p className="text-zinc-400 text-xs">{item.sub}</p>
                                        </div>
                                        <Button variant="outline" size="sm" className={`rounded-xl shrink-0 ${item.btnClass}`}>
                                            {item.btnLabel}
                                        </Button>
                                    </div>
                                ))}

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 mt-2">
                                    <div>
                                        <p className="font-semibold text-red-700 text-sm mb-0.5">Delete Account</p>
                                        <p className="text-red-400 text-xs">Permanently delete your account and all data</p>
                                    </div>
                                    <Button size="sm" className="rounded-xl bg-red-500 hover:bg-red-600 text-white shrink-0">
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance */}
                    {activeSection === "appearance" && (
                        <div className="bg-white border border-zinc-100 rounded-2xl p-5 md:p-8">
                            <h2 className="font-bold text-zinc-900 text-base md:text-lg mb-1">Appearance</h2>
                            <p className="text-zinc-400 text-sm mb-6">Customize how the dashboard looks.</p>

                            <div className="flex flex-col gap-6">
                                <div>
                                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Theme</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: "light", label: "Light", bg: "bg-white", border: "border-zinc-200" },
                                            { value: "dark", label: "Dark", bg: "bg-zinc-950", border: "border-zinc-800" },
                                            { value: "system", label: "System", bg: "bg-gradient-to-br from-white to-zinc-900", border: "border-zinc-300" },
                                        ].map((theme) => (
                                            <div
                                                key={theme.value}
                                                className={cn("rounded-2xl border-2 p-3 md:p-4 cursor-pointer transition-all", theme.border, theme.bg)}
                                            >
                                                <div className="h-10 md:h-16 rounded-xl mb-2 md:mb-3 bg-zinc-100 dark:bg-zinc-800" />
                                                <p className={cn("text-xs font-semibold text-center", theme.value === "dark" ? "text-white" : "text-zinc-700")}>
                                                    {theme.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-3">Theme is controlled by the toggle in the navbar.</p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Accent Color</p>
                                    <div className="flex gap-3 flex-wrap">
                                        {[
                                            { color: "bg-amber-400", active: true },
                                            { color: "bg-blue-500", active: false },
                                            { color: "bg-emerald-500", active: false },
                                            { color: "bg-violet-500", active: false },
                                            { color: "bg-rose-500", active: false },
                                        ].map((item, i) => (
                                            <button
                                                key={i}
                                                className={cn(
                                                    `w-9 h-9 rounded-xl ${item.color} transition-all`,
                                                    item.active ? "ring-2 ring-offset-2 ring-amber-400 scale-110" : "hover:scale-105"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-3">Accent color customization coming soon.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    {activeSection !== "security" && activeSection !== "appearance" && (
                        <div className="mt-4 flex justify-end">
                            <Button
                                onClick={handleSave}
                                className={cn(
                                    "rounded-xl h-11 px-8 font-bold transition-all w-full sm:w-auto",
                                    saved
                                        ? "bg-green-500 hover:bg-green-500 text-white"
                                        : "bg-amber-400 hover:bg-amber-300 text-zinc-950"
                                )}
                            >
                                {saved ? (
                                    <span className="flex items-center gap-2">
                                        <Check size={16} />
                                        Saved!
                                    </span>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}