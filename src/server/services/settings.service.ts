import { companySettings, adminNotificationPreferences, admins } from "@/server/db/schema"
import type { CompanySettings, NewCompanySettings, AdminNotificationPreferences } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { BaseService } from "./base.service"

export type UpdateCompanyInput = Partial<Omit<NewCompanySettings, "id" | "updatedAt">>

export type UpdateNotificationInput = {
    newInquiry?: boolean
    talentUpdate?: boolean
    weeklyReport?: boolean
    marketing?: boolean
}

export class SettingsService extends BaseService {

    async getCompany(): Promise<CompanySettings | null> {
        const result = await this.db.query.companySettings.findFirst()
        return result ?? null
    }

    async upsertCompany(input: UpdateCompanyInput): Promise<CompanySettings> {
        const existing = await this.getCompany()

        if (existing) {
            const [updated] = await this.db
                .update(companySettings)
                .set({ ...input, updatedAt: new Date() })
                .where(eq(companySettings.id, existing.id))
                .returning()
            return updated
        }

        const [created] = await this.db
            .insert(companySettings)
            .values(input as NewCompanySettings)
            .returning()
        return created
    }

    async updateLogo(logoUrl: string | null): Promise<CompanySettings> {
        return this.upsertCompany({ logoUrl })
    }

    async getNotifications(clerkUserId: string): Promise<AdminNotificationPreferences | null> {
        const result = await this.db.query.adminNotificationPreferences.findFirst({
            where: eq(adminNotificationPreferences.clerkUserId, clerkUserId),
        })
        return result ?? null
    }

    async upsertNotifications(
        clerkUserId: string,
        input: UpdateNotificationInput
    ): Promise<AdminNotificationPreferences> {
        const existing = await this.getNotifications(clerkUserId)

        if (existing) {
            const [updated] = await this.db
                .update(adminNotificationPreferences)
                .set({ ...input, updatedAt: new Date() })
                .where(eq(adminNotificationPreferences.clerkUserId, clerkUserId))
                .returning()
            return updated
        }

        const [created] = await this.db
            .insert(adminNotificationPreferences)
            .values({ clerkUserId, ...input })
            .returning()
        return created
    }
}

export const settingsService = new SettingsService()