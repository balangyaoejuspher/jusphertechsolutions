import { activityLogs } from "@/server/db/schema"
import type { NewActivityLog } from "@/server/db/schema"
import { desc, eq, and, gte } from "drizzle-orm"
import { BaseService } from "./base.service"

export type LogInput = Omit<NewActivityLog, "id" | "createdAt">

export class ActivityService extends BaseService {

    async log(input: LogInput) {
        const [entry] = await this.db
            .insert(activityLogs)
            .values(input)
            .returning()
        return entry
    }

    async logMany(inputs: LogInput[]) {
        if (inputs.length === 0) return []
        return this.db
            .insert(activityLogs)
            .values(inputs)
            .returning()
    }

    async getRecent(limit = 20) {
        return this.db
            .select()
            .from(activityLogs)
            .orderBy(desc(activityLogs.createdAt))
            .limit(limit)
    }

    async getByEntity(entityType: string, entityId: string) {
        return this.db
            .select()
            .from(activityLogs)
            .where(
                and(
                    eq(activityLogs.entityType, entityType),
                    eq(activityLogs.entityId, entityId)
                )
            )
            .orderBy(desc(activityLogs.createdAt))
    }

    async getByActor(actorId: string) {
        return this.db
            .select()
            .from(activityLogs)
            .where(eq(activityLogs.actorId, actorId))
            .orderBy(desc(activityLogs.createdAt))
    }

    async getSince(date: Date, limit = 50) {
        return this.db
            .select()
            .from(activityLogs)
            .where(gte(activityLogs.createdAt, date))
            .orderBy(desc(activityLogs.createdAt))
            .limit(limit)
    }
}

export const activityService = new ActivityService()