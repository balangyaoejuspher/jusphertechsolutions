
import { services } from "@/server/db/schema"
import type { Service, NewService } from "@/server/db/schema"
import { eq, ilike, and, asc } from "drizzle-orm"
import { BaseService } from "./base.service"
import { activityService } from "./activity.service"

type ListServicesOptions = {
    search?: string
    status?: "active" | "inactive" | "all"
    visible?: boolean
    limit?: number
    offset?: number
}

type CreateServiceInput = Omit<NewService, "id" | "createdAt" | "updatedAt">
type UpdateServiceInput = Partial<Omit<NewService, "id" | "createdAt" | "updatedAt">>

export class ServiceService extends BaseService {

    async getAll(options: ListServicesOptions = {}): Promise<Service[]> {
        const { search, status, visible, limit, offset } = options

        let query = this.db.select().from(services).$dynamic()

        const conditions = []

        if (status && status !== "all") {
            conditions.push(eq(services.status, status))
        }

        if (visible === true) {
            conditions.push(eq(services.status, "active"))
        }

        if (search) {
            conditions.push(ilike(services.title, `%${search}%`))
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions))
        }

        query = query.orderBy(asc(services.order), asc(services.createdAt))

        if (limit !== undefined) query = query.limit(limit)
        if (offset !== undefined) query = query.offset(offset)

        return query
    }

    async getById(id: string): Promise<Service | null> {
        const [row] = await this.db
            .select()
            .from(services)
            .where(eq(services.id, id))
            .limit(1)

        return row ?? null
    }

    async getBySlug(slug: string): Promise<Service | null> {
        const [row] = await this.db
            .select()
            .from(services)
            .where(eq(services.slug, slug))
            .limit(1)

        return row ?? null
    }

    async create(
        input: CreateServiceInput,
        actorId: string,
        actorName: string,
    ): Promise<Service> {
        const [created] = await this.db
            .insert(services)
            .values({
                ...input,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "service_created",
            summary: `Created service: ${created.title}`,
            entityType: "service",
            entityId: created.id,
            entityLabel: created.title,
            metadata: { status: created.status },
        })

        return created
    }

    async update(
        id: string,
        input: UpdateServiceInput,
        actorId: string,
        actorName: string,
    ): Promise<Service> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Service not found")

        const [updated] = await this.db
            .update(services)
            .set({ ...this.sanitize(input), updatedAt: new Date() })
            .where(eq(services.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "service_updated",
            summary: `Updated service: ${existing.title}`,
            entityType: "service",
            entityId: updated.id,
            entityLabel: updated.title,
            metadata: { changes: Object.keys(this.sanitize(input)) },
        })

        return updated
    }

    async toggleStatus(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<Service> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Service not found")

        const newStatus = existing.status === "active" ? "inactive" : "active"

        const [updated] = await this.db
            .update(services)
            .set({ status: newStatus, updatedAt: new Date() })
            .where(eq(services.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "service_updated",
            summary: `${newStatus === "active" ? "Activated" : "Deactivated"} service: ${existing.title}`,
            entityType: "service",
            entityId: updated.id,
            entityLabel: updated.title,
            metadata: { status: newStatus },
        })

        return updated
    }
    async reorder(
        orderedIds: string[],
        actorId: string,
        actorName: string,
    ): Promise<void> {
        await Promise.all(
            orderedIds.map((id, index) =>
                this.db
                    .update(services)
                    .set({ order: index, updatedAt: new Date() })
                    .where(eq(services.id, id))
            )
        )

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "service_updated",
            summary: `Reordered ${orderedIds.length} services`,
            entityType: "service",
            entityId: "bulk",
            entityLabel: "Services",
            metadata: { orderedIds },
        })
    }

    async delete(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<void> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Service not found")

        await this.db.delete(services).where(eq(services.id, id))

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "service_deleted",
            summary: `Deleted service: ${existing.title}`,
            entityType: "service",
            entityId: existing.id,
            entityLabel: existing.title,
            metadata: { stack: existing.stack },
        })
    }

    async getStats() {
        const all = await this.db.select().from(services)
        return {
            total: all.length,
            active: all.filter((s) => s.status === "active").length,
            inactive: all.filter((s) => s.status === "inactive").length,
        }
    }
}

export const serviceService = new ServiceService()