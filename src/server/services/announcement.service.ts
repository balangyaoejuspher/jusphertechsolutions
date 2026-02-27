import { announcements, announcementReads } from "@/server/db/schema"
import type {
    NewAnnouncement,
    Announcement,
    AnnouncementStatus,
} from "@/server/db/schema"
import { eq, lte, and, desc, count, inArray } from "drizzle-orm"
import { BaseService } from "./base.service"

export type CreateAnnouncementInput = Omit<
    NewAnnouncement,
    "id" | "createdAt" | "updatedAt" | "publishedAt" | "emailSent" | "emailSentAt"
>
export type UpdateAnnouncementInput = Partial<CreateAnnouncementInput>

export class AnnouncementService extends BaseService {

    async getAll() {
        return this.db
            .select()
            .from(announcements)
            .orderBy(desc(announcements.createdAt))
    }

    async getById(id: string): Promise<Announcement | null> {
        const result = await this.db.query.announcements.findFirst({
            where: eq(announcements.id, id),
            with: { reads: true },
        })
        return result ?? null
    }

    async create(input: CreateAnnouncementInput): Promise<Announcement> {
        const isScheduled =
            input.scheduledAt && new Date(input.scheduledAt) > new Date()

        const [created] = await this.db
            .insert(announcements)
            .values({
                ...input,
                status: isScheduled ? "scheduled" : input.status ?? "draft",
            })
            .returning()
        return created
    }

    async update(id: string, input: UpdateAnnouncementInput): Promise<Announcement> {
        const isScheduled =
            input.scheduledAt && new Date(input.scheduledAt) > new Date()

        const [updated] = await this.db
            .update(announcements)
            .set({
                ...input,
                ...(isScheduled ? { status: "scheduled" as AnnouncementStatus } : {}),
                updatedAt: new Date(),
            })
            .where(eq(announcements.id, id))
            .returning()
        return updated
    }

    async delete(id: string): Promise<void> {
        await this.db.delete(announcements).where(eq(announcements.id, id))
    }

    async publish(id: string): Promise<Announcement> {
        const [updated] = await this.db
            .update(announcements)
            .set({
                status: "published",
                publishedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(announcements.id, id))
            .returning()
        return updated
    }

    async archive(id: string): Promise<Announcement> {
        const [updated] = await this.db
            .update(announcements)
            .set({ status: "archived", updatedAt: new Date() })
            .where(eq(announcements.id, id))
            .returning()
        return updated
    }

    async publishDue(): Promise<Announcement[]> {
        const due = await this.db
            .select()
            .from(announcements)
            .where(
                and(
                    eq(announcements.status, "scheduled"),
                    lte(announcements.scheduledAt, new Date())
                )
            )

        if (due.length === 0) return []

        const ids = due.map((a) => a.id)

        await this.db
            .update(announcements)
            .set({
                status: "published",
                publishedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(inArray(announcements.id, ids))

        return this.db
            .select()
            .from(announcements)
            .where(inArray(announcements.id, ids))
    }

    async markAsRead(
        announcementId: string,
        recipientId: string,
        recipientType: "client" | "talent"
    ): Promise<void> {
        await this.db
            .insert(announcementReads)
            .values({ announcementId, recipientId, recipientType })
            .onConflictDoNothing()
    }

    async getReadCount(announcementId: string): Promise<number> {
        const [result] = await this.db
            .select({ count: count() })
            .from(announcementReads)
            .where(eq(announcementReads.announcementId, announcementId))
        return result?.count ?? 0
    }

    async hasRead(announcementId: string, recipientId: string): Promise<boolean> {
        const result = await this.db.query.announcementReads.findFirst({
            where: and(
                eq(announcementReads.announcementId, announcementId),
                eq(announcementReads.recipientId, recipientId)
            ),
        })
        return !!result
    }

    async getForAudience(audience: "client" | "talent") {
        const audienceValues =
            audience === "client"
                ? (["all", "clients"] as const)
                : (["all", "talents"] as const)

        return this.db
            .select()
            .from(announcements)
            .where(
                and(
                    eq(announcements.status, "published"),
                    inArray(announcements.audience, audienceValues)
                )
            )
            .orderBy(desc(announcements.publishedAt))
    }

    async markEmailSent(id: string): Promise<void> {
        await this.db
            .update(announcements)
            .set({ emailSent: true, emailSentAt: new Date() })
            .where(eq(announcements.id, id))
    }

    async getPendingEmailSend(): Promise<Announcement[]> {
        return this.db
            .select()
            .from(announcements)
            .where(
                and(
                    eq(announcements.status, "published"),
                    eq(announcements.emailSent, false)
                )
            )
    }
}

export const announcementService = new AnnouncementService()