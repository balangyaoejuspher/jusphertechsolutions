import { Resend } from "resend"
import { render } from "@react-email/render"
import { AnnouncementEmail } from "@/emails/announcement-email"
import type { Announcement } from "@/server/db/schema"

const FROM = "Juspher & Co. <noreply@juspherandco.com>"

function getResend() {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error("Missing RESEND_API_KEY environment variable")
    return new Resend(key)
}

export type Recipient = {
    email: string
    name: string
}

export class EmailService {

    async sendAnnouncement(
        announcement: Announcement,
        recipients: Recipient[]
    ): Promise<{ sent: number; failed: number }> {
        if (recipients.length === 0) return { sent: 0, failed: 0 }

        const resend = getResend()
        let sent = 0
        let failed = 0

        const BATCH_SIZE = 100

        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            const batch = recipients.slice(i, i + BATCH_SIZE)

            try {
                const emails = await Promise.all(
                    batch.map(async (recipient) => ({
                        from: FROM,
                        to: recipient.email,
                        subject: `[${announcement.type.replace("_", " ")}] ${announcement.title}`,
                        html: await render(
                            AnnouncementEmail({
                                recipientName: recipient.name,
                                title: announcement.title,
                                content: announcement.content,
                                type: announcement.type,
                                publishedAt: announcement.publishedAt,
                            })
                        ),
                    }))
                )

                await resend.batch.send(emails)
                sent += batch.length
            } catch (err) {
                console.error("[EmailService] Batch send failed:", err)
                failed += batch.length
            }
        }

        return { sent, failed }
    }
}

export const emailService = new EmailService()