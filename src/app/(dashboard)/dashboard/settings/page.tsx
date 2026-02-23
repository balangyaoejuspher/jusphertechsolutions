"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
    const [isDirty, setIsDirty] = useState(false)

    const [profile, setProfile] = useState({
        agencyName: "Portfolio Agency",
        email: "support@jusphertechsolution.com",
        phone: "",
        website: "https://jusphertechsolution.com",
        bio: "We connect businesses with top-tier developers, virtual assistants, and project managers.",
        timezone: "Asia/Manila",
    })

    const [notifications, setNotifications] = useState({
        newInquiry: true,
        talentUpdate: true,
        weeklyReport: false,
        marketing: false,
    })

    const handleProfileChange = (field: string, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }))
        setIsDirty(true)
    }

    const handleNotificationChange = (field: string, value: boolean) => {
        setNotifications((prev) => ({ ...prev, [field]: value }))
        setIsDirty(true)
    }

    const handleSave = () => {
        setSaved(true)
        setIsDirty(false)
        setTimeout(() => setSaved(false), 2500)
    }

    const activeSectionData = sections.find((s) => s.id === activeSection)

    return (
        <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto">

            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-1">Settings</h1>
                <p className="text-zinc-500 text-sm">Manage your agency preferences and account settings.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Mobile Section Selector */}
                <div className="md:hidden">
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl text-sm font-medium text-zinc-900 dark:text-white"
                    >
                        <div className="flex items-center gap-2">
                            {activeSectionData && <activeSectionData.icon size={16} className="text-zinc-400" />}
                            <span>{activeSectionData?.label}</span>
                        </div>
                        <ChevronRight
                            size={16}
                            className={cn("text-zinc-400 transition-transform duration-200", showMobileMenu ? "rotate-90" : "")}
                        />
                    </button>

                    {showMobileMenu && (
                        <div className="mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden shadow-lg">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => { setActiveSection(section.id); setShowMobileMenu(false) }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left border-b border-zinc-100 dark:border-white/5 last:border-0",
                                        activeSection === section.id
                                            ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5"
                                    )}
                                >
                                    <section.icon size={16} className={activeSection === section.id ? "text-white dark:text-zinc-950" : "text-zinc-400"} />
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
                                    ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                            )}
                        >
                            <section.icon size={16} className={activeSection === section.id ? "text-white dark:text-zinc-950" : "text-zinc-400"} />
                            {section.label}
                        </button>
                    ))}
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0">

                    {/* ── Profile ── */}
                    {activeSection === "profile" && (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-8">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base md:text-lg mb-1">Agency Profile</h2>
                            <p className="text-zinc-400 text-sm mb-6">Update your agency's public information.</p>

                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="agencyName" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                        Agency Name
                                    </Label>
                                    <Input
                                        id="agencyName"
                                        value={profile.agencyName}
                                        onChange={(e) => handleProfileChange("agencyName", e.target.value)}
                                        className="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus-visible:ring-amber-400"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => handleProfileChange("email", e.target.value)}
                                            className="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus-visible:ring-amber-400"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="phone" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                            Phone
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+63 900 000 0000"
                                            value={profile.phone}
                                            onChange={(e) => handleProfileChange("phone", e.target.value)}
                                            className="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus-visible:ring-amber-400"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="website" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                        Website
                                    </Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={profile.website}
                                        onChange={(e) => handleProfileChange("website", e.target.value)}
                                        className="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus-visible:ring-amber-400"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="timezone" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                        Timezone
                                    </Label>
                                    <Select
                                        value={profile.timezone}
                                        onValueChange={(value) => handleProfileChange("timezone", value)}
                                    >
                                        <SelectTrigger id="timezone" className="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus:ring-amber-400">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Asia/Manila">Asia/Manila (GMT+8)</SelectItem>
                                            <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                                            <SelectItem value="America/Los_Angeles">America/Los_Angeles (GMT-8)</SelectItem>
                                            <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                                            <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                                            <SelectItem value="Asia/Singapore">Asia/Singapore (GMT+8)</SelectItem>
                                            <SelectItem value="Australia/Sydney">Australia/Sydney (GMT+11)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="bio" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                        Agency Description
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        rows={4}
                                        value={profile.bio}
                                        onChange={(e) => handleProfileChange("bio", e.target.value)}
                                        className="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus-visible:ring-amber-400 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Notifications ── */}
                    {activeSection === "notifications" && (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-8">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base md:text-lg mb-1">Notifications</h2>
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
                                        className="flex items-center justify-between gap-4 p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-semibold text-zinc-900 dark:text-white text-sm mb-0.5">{item.label}</p>
                                            <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationChange(item.key, !notifications[item.key as keyof typeof notifications])}
                                            className={cn(
                                                "w-11 h-6 rounded-full transition-all duration-200 shrink-0 relative",
                                                notifications[item.key as keyof typeof notifications] ? "bg-amber-400" : "bg-zinc-200 dark:bg-zinc-700"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200",
                                                notifications[item.key as keyof typeof notifications] ? "left-6" : "left-1"
                                            )} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Security ── */}
                    {activeSection === "security" && (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-8">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base md:text-lg mb-1">Security</h2>
                            <p className="text-zinc-400 text-sm mb-6">Manage your account security settings.</p>

                            <div className="flex flex-col gap-3">
                                {[
                                    { label: "Password", sub: "Last changed 30 days ago", btnLabel: "Change", btnClass: "border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400" },
                                    { label: "Two-Factor Authentication", sub: "Add an extra layer of security", btnLabel: "Enable", btnClass: "border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400" },
                                    { label: "Active Sessions", sub: "1 active session on Windows · Chrome", btnLabel: "Revoke All", btnClass: "border-red-200 text-red-500 hover:bg-red-50" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5"
                                    >
                                        <div>
                                            <p className="font-semibold text-zinc-900 dark:text-white text-sm mb-0.5">{item.label}</p>
                                            <p className="text-zinc-400 text-xs">{item.sub}</p>
                                        </div>
                                        <Button variant="outline" size="sm" className={`rounded-xl shrink-0 ${item.btnClass}`}>
                                            {item.btnLabel}
                                        </Button>
                                    </div>
                                ))}

                                <Separator className="my-1 dark:bg-white/5" />

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20">
                                    <div>
                                        <p className="font-semibold text-red-700 dark:text-red-400 text-sm mb-0.5">Delete Account</p>
                                        <p className="text-red-400 text-xs">Permanently delete your account and all data</p>
                                    </div>
                                    <Button size="sm" className="rounded-xl bg-red-500 hover:bg-red-600 text-white shrink-0">
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Appearance ── */}
                    {activeSection === "appearance" && (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-8">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-base md:text-lg mb-1">Appearance</h2>
                            <p className="text-zinc-400 text-sm mb-6">Customize how the dashboard looks.</p>

                            <div className="flex flex-col gap-8">
                                <div>
                                    <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 block">Theme</Label>
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

                                <Separator className="dark:bg-white/5" />

                                <div>
                                    <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 block">Accent Color</Label>
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

                    {/* ── Save Button ── */}
                    {activeSection !== "security" && activeSection !== "appearance" && isDirty && (
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