import { NextRequest } from "next/server"
import { eq } from "drizzle-orm"
import { announcementService } from "@/server/services/announcement.service"
import { emailService } from "@/server/services/email.service"
import { db } from "@/server/db/client"
import { clients, talent } from "@/server/db/schema"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    const secret = req.headers.get("x-cron-secret")
        ?? req.nextUrl.searchParams.get("secret")

    if (secret !== process.env.CRON_SECRET) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const published = await announcementService.publishDue()

        const pendingEmail = await announcementService.getPendingEmailSend()

        const toEmail = [
            ...published,
            ...pendingEmail.filter((p) => !published.find((pub) => pub.id === p.id)),
        ]

        let totalSent = 0
        let totalFailed = 0

        for (const announcement of toEmail) {
            const recipients: { email: string; name: string }[] = []

            if (announcement.audience === "all" || announcement.audience === "clients") {
                const activeClients = await db
                    .select({ email: clients.email, name: clients.name })
                    .from(clients)
                    .where(eq(clients.status, "active"))
                recipients.push(...activeClients)
            }

            if (announcement.audience === "all" || announcement.audience === "talents") {
                const allTalent = await db
                    .select({ email: talent.email, name: talent.name })
                    .from(talent)
                recipients.push(...allTalent)
            }

            const { sent, failed } = await emailService.sendAnnouncement(
                announcement,
                recipients
            )

            totalSent += sent
            totalFailed += failed

            await announcementService.markEmailSent(announcement.id)
        }

        return Response.json({
            success: true,
            published: published.length,
            emailsSent: totalSent,
            emailsFailed: totalFailed,
            timestamp: new Date().toISOString(),
        })
    } catch (err) {
        console.error("[Cron] publish-announcements failed:", err)
        return Response.json(
            {
                success: false,
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        )
    }
}