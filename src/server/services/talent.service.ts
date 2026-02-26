import { NewTalentRow, talent } from "@/server/db/schema"
import { eq, ilike, or, and, desc } from "drizzle-orm"
import { BaseService } from "./base.service"
import { activityService } from "./activity.service"
import { Talent } from "@/types"

type CreateTalentInput = Omit<NewTalentRow, "id" | "createdAt" | "updatedAt">
type UpdateTalentInput = Partial<Omit<NewTalentRow, "id" | "createdAt" | "updatedAt">>

type ListTalentOptions = {
    search?: string
    status?: Talent["status"] | "all"
    role?: Talent["role"] | "all"
    visible?: boolean
}

export class TalentService extends BaseService {

    async getAll(options: ListTalentOptions = {}) {
        const { search, status, role, visible } = options

        let query = this.db.select().from(talent).$dynamic()

        const conditions = []

        if (status && status !== "all") {
            conditions.push(eq(talent.status, status))
        }

        if (role && role !== "all") {
            conditions.push(eq(talent.role, role))
        }

        if (visible !== undefined) {
            conditions.push(eq(talent.isVisible, visible))
        }

        if (options.visible === true) {
            conditions.push(eq(talent.isVisible, true))
        }

        if (search) {
            conditions.push(
                or(
                    ilike(talent.name, `%${search}%`),
                    ilike(talent.email, `%${search}%`),
                    ilike(talent.title, `%${search}%`),
                )
            )
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions))
        }

        return query.orderBy(desc(talent.createdAt))
    }

    async getById(id: string): Promise<Talent | null> {
        const [result] = await this.db
            .select()
            .from(talent)
            .where(eq(talent.id, id))
            .limit(1)

        return result ?? null
    }

    async getByEmail(email: string): Promise<Talent | null> {
        const [result] = await this.db
            .select()
            .from(talent)
            .where(eq(talent.email, email))
            .limit(1)

        return result ?? null
    }

    async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
        const conditions = [eq(talent.email, email)]
        if (excludeId) {
            const { ne } = await import("drizzle-orm")
            conditions.push(ne(talent.id, excludeId))
        }

        const [existing] = await this.db
            .select({ id: talent.id })
            .from(talent)
            .where(and(...conditions))
            .limit(1)

        return !!existing
    }

    async create(
        input: CreateTalentInput,
        actorId: string,
        actorName: string,
    ): Promise<Talent> {

        const emailTaken = await this.isEmailTaken(input.email)
        if (emailTaken) throw new Error("A talent with this email already exists")

        const [created] = await this.db
            .insert(talent)
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
            type: "talent_created",
            summary: `Added new talent: ${created.name}`,
            entityType: "talent",
            entityId: created.id,
            entityLabel: created.name,
            metadata: { role: created.role, status: created.status },
        })

        return created
    }

    async update(
        id: string,
        input: UpdateTalentInput,
        actorId: string,
        actorName: string,
    ): Promise<Talent> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Talent not found")

        if (input.email && input.email !== existing.email) {
            const emailTaken = await this.isEmailTaken(input.email, id)
            if (emailTaken) throw new Error("A talent with this email already exists")
        }

        const [updated] = await this.db
            .update(talent)
            .set({ ...this.sanitize(input), updatedAt: new Date() })
            .where(eq(talent.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "talent_updated",
            summary: `Updated talent: ${updated.name}`,
            entityType: "talent",
            entityId: updated.id,
            entityLabel: updated.name,
            metadata: { changes: Object.keys(this.sanitize(input)) },
        })

        return updated
    }

    async toggleVisibility(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<Talent> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Talent not found")

        const [updated] = await this.db
            .update(talent)
            .set({ isVisible: !existing.isVisible, updatedAt: new Date() })
            .where(eq(talent.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "talent_updated",
            summary: `${updated.isVisible ? "Shown" : "Hidden"} talent: ${updated.name}`,
            entityType: "talent",
            entityId: updated.id,
            entityLabel: updated.name,
            metadata: { isVisible: updated.isVisible },
        })

        return updated
    }

    async delete(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<void> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Talent not found")

        await this.db
            .delete(talent)
            .where(eq(talent.id, id))

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "talent_deleted",
            summary: `Deleted talent: ${existing.name}`,
            entityType: "talent",
            entityId: existing.id,
            entityLabel: existing.name,
            metadata: { role: existing.role, email: existing.email },
        })
    }

    async getStats() {
        const all = await this.db.select().from(talent)
        return {
            total: all.length,
            available: all.filter((t) => t.status === "available").length,
            busy: all.filter((t) => t.status === "busy").length,
            unavailable: all.filter((t) => t.status === "unavailable").length,
            visible: all.filter((t) => t.isVisible).length,
            byRole: Object.fromEntries(
                [...new Set(all.map((t) => t.role))].map((role) => [
                    role,
                    all.filter((t) => t.role === role).length,
                ])
            ),
        }
    }
}

export const talentService = new TalentService()