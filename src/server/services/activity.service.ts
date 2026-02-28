import { activityLogs } from "@/server/db/schema"
import type { NewActivityLog } from "@/server/db/schema"
import { desc, eq, and, gte, ilike, inArray, count, SQL } from "drizzle-orm"
import { BaseService } from "./base.service"

export type LogInput = Omit<NewActivityLog, "id" | "createdAt">

export interface ActivityQuery {
    page?: number
    pageSize?: number
    search?: string
    group?: string
    actor?: string
}

export interface PaginatedActivityResult {
    data: typeof activityLogs.$inferSelect[]
    total: number
    page: number
    pageSize: number
}

const TYPE_GROUPS: Record<string, string[]> = {
    admin: ["admin_created", "admin_updated", "admin_deleted"],
    talent: ["talent_created", "talent_updated", "talent_deleted"],
    inquiry: ["inquiry_received", "inquiry_status_changed", "inquiry_assigned", "inquiry_resolved"],
    client: ["client_created", "client_updated", "client_deleted", "client_status_changed"],
    invoice: ["invoice_created", "invoice_sent", "invoice_paid", "invoice_overdue", "invoice_disputed"],
    ticket: ["ticket_opened", "ticket_replied", "ticket_resolved", "ticket_status_changed"],
    portal: ["portal_login", "portal_invoice_viewed", "portal_project_viewed"],
    auth: ["auth_sign_in", "auth_sign_out"],
    service: ["service_created", "service_updated", "service_deleted"],
    placement: ["placement_created", "placement_updated", "placement_completed", "placement_terminated", "placement_on_hold", "placement_deleted"],
    product: ["product_created", "product_updated", "product_deleted"],
    post: ["post_created", "post_updated", "post_deleted", "post_published", "post_unpublished"],
}

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

    async getPaginated({
        page = 1,
        pageSize = 20,
        search = "",
        group = "",
        actor = "",
    }: ActivityQuery = {}): Promise<PaginatedActivityResult> {
        const conditions: SQL[] = []

        if (search) {
            conditions.push(ilike(activityLogs.summary, `%${search}%`))
        }

        if (group && TYPE_GROUPS[group]) {
            conditions.push(inArray(activityLogs.type, TYPE_GROUPS[group] as any))
        }

        if (actor && ["admin", "client", "system"].includes(actor)) {
            conditions.push(eq(activityLogs.actorType, actor as any))
        }

        const where = conditions.length > 0 ? and(...conditions) : undefined

        const [data, [{ total }]] = await Promise.all([
            this.db
                .select()
                .from(activityLogs)
                .where(where)
                .orderBy(desc(activityLogs.createdAt))
                .limit(pageSize)
                .offset((page - 1) * pageSize),

            this.db
                .select({ total: count() })
                .from(activityLogs)
                .where(where),
        ])

        return { data, total, page, pageSize }
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