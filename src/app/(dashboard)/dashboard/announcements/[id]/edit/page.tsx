"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Announcement } from "@/server/db/schema"
import { AnnouncementForm } from "@/components/forms/announcement-form"

export default function EditAnnouncementPage() {
    const { id } = useParams<{ id: string }>()
    const [announcement, setAnnouncement] = useState<Announcement | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/v1/admin/announcements/${id}`, {
                    credentials: "include",
                })
                if (!res.ok) throw new Error("Not found")
                const json = await res.json()
                setAnnouncement(json?.data ?? json)
            } catch {
                toast.error("Failed to load announcement")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={24} className="animate-spin text-zinc-400" />
            </div>
        )
    }

    if (!announcement) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-2">
                <p className="font-semibold text-zinc-900 dark:text-white">Announcement not found</p>
                <p className="text-sm text-zinc-400">It may have been deleted.</p>
            </div>
        )
    }

    return <AnnouncementForm mode="edit" announcement={announcement} />
}