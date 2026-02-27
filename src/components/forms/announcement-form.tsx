"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Send, Save, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { RichTextEditor } from "@/components/shared/rich-text-editor"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Announcement } from "@/server/db/schema"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"

type AnnouncementFormData = {
    title: string
    content: string
    type: string
    audience: string
    scheduledAt: string
}

type AnnouncementFormProps = {
    announcement?: Announcement
    mode: "create" | "edit"
}

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
    draft: { label: "Draft", class: "bg-zinc-100 dark:bg-white/5 text-zinc-500" },
    scheduled: { label: "Scheduled", class: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    published: { label: "Published", class: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" },
    archived: { label: "Archived", class: "bg-zinc-100 dark:bg-white/5 text-zinc-400" },
}

export function AnnouncementForm({ announcement, mode }: AnnouncementFormProps) {
    const router = useRouter()
    const isEdit = mode === "edit"
    const isPublished = announcement?.status === "published"
    const isArchived = announcement?.status === "archived"
    const isReadOnly = isPublished || isArchived

    const [form, setForm] = useState<AnnouncementFormData>({
        title: announcement?.title ?? "",
        content: announcement?.content ?? "",
        type: announcement?.type ?? "general",
        audience: announcement?.audience ?? "all",
        scheduledAt: announcement?.scheduledAt
            ? new Date(announcement.scheduledAt).toISOString().slice(0, 16)
            : "",
    })

    const [saving, setSaving] = useState(false)
    const [publishing, setPublishing] = useState(false)

    function handleChange<K extends keyof AnnouncementFormData>(
        field: K,
        value: AnnouncementFormData[K]
    ) {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    async function save(publishNow = false): Promise<Announcement | null> {
        if (!form.title.trim()) {
            toast.error("Title is required")
            return null
        }
        if (!form.content.trim() || form.content === "<p></p>") {
            toast.error("Content is required")
            return null
        }

        const body = {
            title: form.title.trim(),
            content: form.content,
            type: form.type,
            audience: form.audience,
            scheduledAt: form.scheduledAt || undefined,
            ...(publishNow ? { status: "published" } : {}),
        }

        const url = isEdit
            ? `/api/v1/admin/announcements/${announcement!.id}`
            : "/api/v1/admin/announcements"

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const json = await res.json()
            throw new Error(json?.error ?? "Request failed")
        }

        const json = await res.json()
        return json?.data ?? json
    }

    async function handleSaveDraft() {
        setSaving(true)
        try {
            await save()
            toast.success(isEdit ? "Announcement updated" : "Draft saved")
            router.push("/dashboard/announcements")
        } catch (err) {
            toast.error("Failed to save", {
                description: err instanceof Error ? err.message : "Please try again.",
            })
        } finally {
            setSaving(false)
        }
    }

    async function handlePublish() {
        setPublishing(true)
        try {
            if (isEdit) {
                // Save first, then publish
                await save()
                const res = await fetch(`/api/v1/admin/announcements/${announcement!.id}/publish`, {
                    method: "PATCH",
                    credentials: "include",
                })
                if (!res.ok) throw new Error("Failed to publish")
            } else {
                // Create and publish in one step
                await save(true)
            }
            toast.success("Announcement published successfully")
            router.push("/dashboard/announcements")
        } catch (err) {
            toast.error("Failed to publish", {
                description: err instanceof Error ? err.message : "Please try again.",
            })
        } finally {
            setPublishing(false)
        }
    }

    return (
        <div className="p-5 md:p-8 lg:p-10 max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 md:mb-8">
                <button
                    onClick={() => router.push("/dashboard/announcements")}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors shrink-0"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
                            {isEdit ? "Edit Announcement" : "New Announcement"}
                        </h1>
                        {isEdit && announcement?.status && (
                            <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold",
                                STATUS_BADGE[announcement.status]?.class
                            )}>
                                {STATUS_BADGE[announcement.status]?.label}
                            </span>
                        )}
                    </div>
                    <p className="text-zinc-500 text-sm mt-0.5">
                        {isEdit
                            ? "Update the announcement details below."
                            : "Fill in the details and publish or save as draft."}
                    </p>
                </div>
            </div>

            {/* Read-only notice */}
            {isReadOnly && (
                <div className="mb-5 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
                    <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                        {isPublished
                            ? "This announcement is published and cannot be edited. Archive it first to make changes."
                            : "Archived announcements cannot be edited."}
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-5">

                {/* Title */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-6">
                    <Label htmlFor="title" className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                        Title
                    </Label>
                    <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Announcement title..."
                        disabled={isReadOnly}
                        className="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 focus-visible:ring-amber-400 text-base font-semibold"
                    />
                </div>

                {/* Meta */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-6">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                Type
                            </Label>
                            <CustomSelect
                                value={form.type}
                                onChange={(v) => handleChange("type", v)}
                                disabled={isReadOnly}
                                options={[
                                    { value: "general", label: "General" },
                                    { value: "maintenance", label: "Maintenance" },
                                    { value: "new_feature", label: "New Feature" },
                                    { value: "urgent", label: "Urgent" },
                                    { value: "event", label: "Event" },
                                ]}
                                buttonClassName="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                Audience
                            </Label>
                            <CustomSelect
                                value={form.audience}
                                onChange={(v) => handleChange("audience", v)}
                                disabled={isReadOnly}
                                options={[
                                    { value: "all", label: "Everyone" },
                                    { value: "clients", label: "Clients only" },
                                    { value: "talents", label: "Talents only" },
                                ]}
                                buttonClassName="rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                Date
                            </Label>
                            <DatePicker
                                value={form.scheduledAt ? form.scheduledAt.split("T")[0] : ""}
                                onChange={(date) => {
                                    const time = form.scheduledAt?.split("T")[1] ?? "09:00"
                                    handleChange("scheduledAt", date ? `${date}T${time}` : "")
                                }}
                                placeholder="Pick a date"
                                minDate={new Date()}
                                disabled={isReadOnly}
                                className="w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                Time
                            </Label>
                            <TimePicker
                                value={form.scheduledAt ? form.scheduledAt.split("T")[1] : ""}
                                onChange={(time) => {
                                    const date = form.scheduledAt?.split("T")[0] ?? ""
                                    if (date) handleChange("scheduledAt", `${date}T${time}`)
                                }}
                                placeholder="Pick a time"
                                disabled={isReadOnly || !form.scheduledAt}
                                className="w-full"
                            />
                        </div>

                    </div>
                    <p className="text-[11px] text-zinc-400 mt-3">
                        Schedule is optional — leave date empty to save as draft. Time is disabled until a date is selected.
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-5 md:p-6">
                    <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">
                        Content
                    </Label>
                    <RichTextEditor
                        value={form.content}
                        onChange={(html) => handleChange("content", html)}
                        placeholder="Write your announcement here..."
                        disabled={isReadOnly}
                        maxCharacters={5000}
                    />
                </div>

                {/* Actions */}
                {!isReadOnly && (
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard/announcements")}
                            className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            disabled={saving || publishing}
                            className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 w-full sm:w-auto"
                        >
                            {saving ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save size={14} />
                                    {form.scheduledAt ? "Save Scheduled" : "Save Draft"}
                                </span>
                            )}
                        </Button>
                        <Button
                            onClick={handlePublish}
                            disabled={saving || publishing}
                            className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold w-full sm:w-auto"
                        >
                            {publishing ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin" />
                                    Publishing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Send size={14} />
                                    Publish Now
                                </span>
                            )}
                        </Button>
                    </div>
                )}

            </div>
        </div>
    )
}