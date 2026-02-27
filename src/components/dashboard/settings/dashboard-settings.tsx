"use client"

import { Button } from "@/components/ui/button"
import { CustomSelect } from "@/components/ui/custom-select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { SETTINGS_SECTIONS, type SettingsSection } from "@/lib/helpers/constants"
import { cn } from "@/lib/utils"
import { Check, ChevronRight, Upload, Loader2, X, ShieldCheck, KeyRound, MonitorSmartphone, Trash2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { portalFetch } from "@/lib/api/private-fetcher"
import { toast } from "sonner"
import { useUser, useClerk } from "@clerk/nextjs"
import { UserProfile } from "@clerk/nextjs"

type CompanyProfile = {
    companyName: string
    email: string
    phone: string
    website: string
    description: string
    address: string
    logoUrl: string | null
    timezone: string
}

type NotificationPrefs = {
    newInquiry: boolean
    talentUpdate: boolean
    weeklyReport: boolean
    marketing: boolean
}

type SecurityPage = "password" | "2fa" | "sessions" | null

function SecurityModal({
    page,
    onClose,
}: {
    page: SecurityPage
    onClose: () => void
}) {
    if (!page) return null

    const pageMap: Record<NonNullable<SecurityPage>, string> = {
        password: "user-profile/security",
        "2fa": "user-profile/security",
        sessions: "user-profile/security",
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-white/5">
                    <p className="font-bold text-zinc-900 dark:text-white text-sm">
                        {page === "password" && "Change Password"}
                        {page === "2fa" && "Two-Factor Authentication"}
                        {page === "sessions" && "Active Sessions"}
                    </p>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-2">
                    <UserProfile
                        routing="hash"
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-none border-0 bg-transparent w-full",
                                navbar: "hidden",
                                navbarMobileMenuRow: "hidden",
                                pageScrollBox: "p-4",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                avatarBox: "hidden",
                                formButtonPrimary:
                                    "bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl shadow-none",
                                formFieldInput:
                                    "rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10",
                                badge: "rounded-lg",
                                profileSectionPrimaryButton: "rounded-xl",
                                accordionTriggerButton: "rounded-xl",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

function DeleteConfirmModal({
    onConfirm,
    onClose,
    loading,
}: {
    onConfirm: () => void
    onClose: () => void
    loading: boolean
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 mx-auto mb-4">
                    <Trash2 size={20} className="text-red-500" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-center mb-1">Delete Account</h3>
                <p className="text-zinc-400 text-sm text-center mb-6">
                    This will permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 rounded-xl border-zinc-200 dark:border-white/10"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin" />
                                Deleting...
                            </span>
                        ) : (
                            "Yes, Delete"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function DashboardSettings() {
    const { user } = useUser()
    const { signOut } = useClerk()

    const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
    const [saved, setSaved] = useState(false)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [isDirty, setIsDirty] = useState(false)
    const [logoUploading, setLogoUploading] = useState(false)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [securityPage, setSecurityPage] = useState<SecurityPage>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const logoInputRef = useRef<HTMLInputElement>(null)
    const [isDefaultAdmin, setIsDefaultAdmin] = useState(false)

    const [profile, setProfile] = useState<CompanyProfile>({
        companyName: "",
        email: "",
        phone: "",
        website: "",
        description: "",
        address: "",
        logoUrl: null,
        timezone: "Asia/Manila",
    })

    const [notifications, setNotifications] = useState<NotificationPrefs>({
        newInquiry: true,
        talentUpdate: true,
        weeklyReport: false,
        marketing: false,
    })

    useEffect(() => {
        async function load() {
            setLoading(true)
            setIsDirty(false)
            try {
                if (activeSection === "profile") {
                    const data = await portalFetch.get<CompanyProfile>("/admin/settings/company")
                    setProfile({
                        companyName: data.companyName ?? "",
                        email: data.email ?? "",
                        phone: data.phone ?? "",
                        website: data.website ?? "",
                        description: data.description ?? "",
                        address: data.address ?? "",
                        logoUrl: data.logoUrl ?? null,
                        timezone: data.timezone ?? "Asia/Manila",
                    })
                    setLogoPreview(data.logoUrl ?? null)
                }

                if (activeSection === "notifications") {
                    const data = await portalFetch.get<NotificationPrefs>("/admin/settings/notifications")
                    setNotifications(data)
                }
            } catch (err) {
                console.error("[Settings] Failed to load:", err)
                toast.error("Failed to load settings", {
                    description: err instanceof Error ? err.message : "Please try again.",
                })
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [activeSection])

    useEffect(() => {
        fetch("/api/auth/me", { credentials: "include" })
            .then((res) => res.json())
            .then(({ data }) => setIsDefaultAdmin(data?.isDefault ?? false))
            .catch(() => setIsDefaultAdmin(false))
    }, [])

    const handleProfileChange = (field: keyof CompanyProfile, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }))
        setIsDirty(true)
    }

    const handleNotificationChange = (field: keyof NotificationPrefs, value: boolean) => {
        setNotifications((prev) => ({ ...prev, [field]: value }))
        setIsDirty(true)
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
        reader.readAsDataURL(file)

        setLogoUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch(`${window.location.origin}/api/v1/admin/upload/logo`, {
                method: "POST",
                credentials: "include",
                body: formData,
            })

            if (!res.ok) throw new Error("Upload failed")
            const json = await res.json()
            const url = json?.data?.url ?? json?.url

            setProfile((prev) => ({ ...prev, logoUrl: url }))
            setIsDirty(true)
            toast.success("Logo uploaded successfully")
        } catch (err) {
            setLogoPreview(profile.logoUrl)
            toast.error("Logo upload failed", {
                description: err instanceof Error ? err.message : "Please try again.",
            })
        } finally {
            setLogoUploading(false)
        }
    }

    const handleRemoveLogo = () => {
        setLogoPreview(null)
        setProfile((prev) => ({ ...prev, logoUrl: null }))
        setIsDirty(true)
        if (logoInputRef.current) logoInputRef.current.value = ""
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            if (activeSection === "profile") {
                await portalFetch.put("/admin/settings/company", profile)
            }
            if (activeSection === "notifications") {
                await portalFetch.put("/admin/settings/notifications", notifications)
            }
            setSaved(true)
            setIsDirty(false)
            setTimeout(() => setSaved(false), 2500)
            toast.success("Settings saved")
        } catch (err) {
            console.error("[Settings] Failed to save:", err)
            toast.error("Failed to save settings", {
                description: err instanceof Error ? err.message : "Please try again.",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteAccount = async () => {
        setDeleting(true)
        try {
            await user?.delete()
            await signOut()
        } catch (err) {
            console.error("[Settings] Failed to delete account:", err)
            toast.error("Failed to delete account", {
                description: err instanceof Error ? err.message : "Please try again.",
            })
            setDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    const activeSectionData = SETTINGS_SECTIONS.find((s) => s.id === activeSection)

    const securityItems = [
        {
            key: "password" as SecurityPage,
            icon: KeyRound,
            label: "Password",
            sub: "Update your account password",
            btnLabel: "Change",
        },
        {
            key: "2fa" as SecurityPage,
            icon: ShieldCheck,
            label: "Two-Factor Authentication",
            sub: "Add an extra layer of security to your account",
            btnLabel: "Manage",
        },
        {
            key: "sessions" as SecurityPage,
            icon: MonitorSmartphone,
            label: "Active Sessions",
            sub: "View and manage your active sessions across devices",
            btnLabel: "Manage",
        },
    ]

    return (
        <>
            {/* Security Modal */}
            {securityPage && (
                <SecurityModal page={securityPage} onClose={() => setSecurityPage(null)} />
            )}

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <DeleteConfirmModal
                    onConfirm={handleDeleteAccount}
                    onClose={() => setShowDeleteConfirm(false)}
                    loading={deleting}
                />
            )}

            <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-1">Settings</h1>
                    <p className="text-zinc-500 text-sm">Manage your company preferences and account settings.</p>
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
                                {SETTINGS_SECTIONS.map((section) => (
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
                        {SETTINGS_SECTIONS.map((section) => (
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

                        {/* Loading skeleton */}
                        {loading && (activeSection === "profile" || activeSection === "notifications") && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-8 animate-pulse">
                                <div className="h-5 w-40 bg-zinc-100 dark:bg-white/5 rounded-lg mb-2" />
                                <div className="h-3 w-60 bg-zinc-100 dark:bg-white/5 rounded-lg mb-8" />
                                <div className="flex flex-col gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-10 bg-zinc-100 dark:bg-white/5 rounded-xl" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Profile ── */}
                        {!loading && activeSection === "profile" && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-8">
                                <h2 className="font-bold text-zinc-900 dark:text-white text-base md:text-lg mb-1">Company Profile</h2>
                                <p className="text-zinc-400 text-sm mb-6">Update your company's public information.</p>

                                <div className="flex flex-col gap-5">

                                    {/* Logo Upload */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                            Company Logo
                                        </Label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10 flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-white/5 shrink-0">
                                                {logoPreview ? (
                                                    <Image
                                                        src={logoPreview}
                                                        alt="Company logo"
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <Upload size={20} className="text-zinc-300" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => logoInputRef.current?.click()}
                                                        disabled={logoUploading}
                                                        className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 text-xs"
                                                    >
                                                        {logoUploading ? (
                                                            <span className="flex items-center gap-1.5">
                                                                <Loader2 size={12} className="animate-spin" />
                                                                Uploading...
                                                            </span>
                                                        ) : (
                                                            "Upload Logo"
                                                        )}
                                                    </Button>
                                                    {logoPreview && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleRemoveLogo}
                                                            className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 text-xs"
                                                        >
                                                            <X size={12} />
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-zinc-400">PNG, JPG, WebP, or SVG. Max 5MB.</p>
                                            </div>
                                            <input
                                                ref={logoInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                                className="hidden"
                                                onChange={handleLogoUpload}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="companyName" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                            Company Name
                                        </Label>
                                        <Input
                                            id="companyName"
                                            value={profile.companyName}
                                            onChange={(e) => handleProfileChange("companyName", e.target.value)}
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

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="website" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                                Website
                                            </Label>
                                            <Input
                                                id="website"
                                                type="url"
                                                placeholder="https://yourcompany.com"
                                                value={profile.website}
                                                onChange={(e) => handleProfileChange("website", e.target.value)}
                                                className="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus-visible:ring-amber-400"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="address" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                                Address
                                            </Label>
                                            <Input
                                                id="address"
                                                placeholder="Cebu City, Philippines"
                                                value={profile.address}
                                                onChange={(e) => handleProfileChange("address", e.target.value)}
                                                className="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus-visible:ring-amber-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="timezone" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                            Timezone
                                        </Label>
                                        <CustomSelect
                                            value={profile.timezone}
                                            onChange={(value) => handleProfileChange("timezone", value)}
                                            options={[
                                                { value: "Asia/Manila", label: "Asia/Manila (GMT+8)" },
                                                { value: "America/New_York", label: "America/New_York (GMT-5)" },
                                                { value: "America/Los_Angeles", label: "America/Los_Angeles (GMT-8)" },
                                                { value: "Europe/London", label: "Europe/London (GMT+0)" },
                                                { value: "Europe/Paris", label: "Europe/Paris (GMT+1)" },
                                                { value: "Asia/Singapore", label: "Asia/Singapore (GMT+8)" },
                                                { value: "Australia/Sydney", label: "Australia/Sydney (GMT+11)" },
                                            ]}
                                            placeholder="Select timezone"
                                            className="w-full"
                                            buttonClassName="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus:ring-amber-400"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="description" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                            Company Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            rows={4}
                                            value={profile.description}
                                            onChange={(e) => handleProfileChange("description", e.target.value)}
                                            className="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus-visible:ring-amber-400 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Notifications ── */}
                        {!loading && activeSection === "notifications" && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-8">
                                <h2 className="font-bold text-zinc-900 dark:text-white text-base md:text-lg mb-1">Notifications</h2>
                                <p className="text-zinc-400 text-sm mb-6">Choose what you want to be notified about.</p>

                                <div className="flex flex-col gap-3">
                                    {[
                                        { key: "newInquiry" as const, label: "New Inquiries", desc: "Get notified when a client submits a new inquiry" },
                                        { key: "talentUpdate" as const, label: "Talent Updates", desc: "Get notified when a talent profile is updated" },
                                        { key: "weeklyReport" as const, label: "Weekly Report", desc: "Receive a weekly summary of your company activity" },
                                        { key: "marketing" as const, label: "Marketing Emails", desc: "Tips, updates, and news from Juspher & Co" },
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
                                                onClick={() => handleNotificationChange(item.key, !notifications[item.key])}
                                                className={cn(
                                                    "w-11 h-6 rounded-full transition-all duration-200 shrink-0 relative",
                                                    notifications[item.key] ? "bg-amber-400" : "bg-zinc-200 dark:bg-zinc-700"
                                                )}
                                            >
                                                <div className={cn(
                                                    "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200",
                                                    notifications[item.key] ? "left-6" : "left-1"
                                                )} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Security ── */}
                        {activeSection === "security" && (
                            <div className="flex flex-col gap-4">
                                <UserProfile
                                    routing="hash"
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full",
                                            card: "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl shadow-none w-full",
                                            navbar: "hidden",
                                            navbarMobileMenuRow: "hidden",
                                            pageScrollBox: "p-5 md:p-8",
                                            headerTitle: "hidden",
                                            headerSubtitle: "hidden",
                                            avatarBox: "hidden",
                                            profilePage: "w-full",
                                            formButtonPrimary: "bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl shadow-none",
                                            formFieldInput: "rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10",
                                            badge: "rounded-lg",
                                            profileSectionPrimaryButton: "rounded-xl",
                                            accordionTriggerButton: "rounded-xl",
                                        },
                                    }}
                                >
                                    <UserProfile.Page label="security" />
                                </UserProfile>

                                {/* Danger Zone */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-8">
                                    <h2 className="font-bold text-zinc-900 dark:text-white text-base md:text-lg mb-1">Danger Zone</h2>
                                    <p className="text-zinc-400 text-sm mb-6">Irreversible account actions.</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20">
                                        <div>
                                            <p className="font-semibold text-red-700 dark:text-red-400 text-sm mb-0.5">Delete Account</p>
                                            <p className="text-red-400 text-xs">
                                                {isDefaultAdmin
                                                    ? "Default admin account cannot be deleted"
                                                    : "Permanently delete your account and all associated data"}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            disabled={isDefaultAdmin}
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="rounded-xl bg-red-500 hover:bg-red-600 text-white shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 size={14} className="mr-1.5" />
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
                                <p className="text-zinc-400 text-sm mb-1">Customize how the dashboard looks.</p>
                                <p className="text-xs text-amber-500 dark:text-amber-400 mb-6">These settings only apply to your admin view.</p>

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
                                    disabled={saving}
                                    className={cn(
                                        "rounded-xl h-11 px-8 font-bold transition-all w-full sm:w-auto",
                                        saved
                                            ? "bg-green-500 hover:bg-green-500 text-white"
                                            : "bg-amber-400 hover:bg-amber-300 text-zinc-950"
                                    )}
                                >
                                    {saving ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            Saving...
                                        </span>
                                    ) : saved ? (
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
        </>
    )
}