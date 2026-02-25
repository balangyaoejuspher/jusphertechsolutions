import { clients } from "@/server/db/schema"
import type { ClientRow, NewClientRow } from "@/server/db/schema"
import { eq, and, ne, ilike, or, desc } from "drizzle-orm"
import { BaseService } from "./base.service"
import { activityService } from "./activity.service"

type CreateClientInput = Omit<NewClientRow, "id" | "joinedDate" | "updatedAt">

type UpdateClientInput = Partial<Omit<NewClientRow, "id" | "joinedDate" | "updatedAt">>

type ListClientsOptions = {
    search?: string
    status?: ClientRow["status"] | "all"
    type?: ClientRow["type"] | "all"
    page?: number
    pageSize?: number
}

export class ClientService extends BaseService {

    async getAll(options: ListClientsOptions = {}) {
        const { search, status, type } = options

        let query = this.db.select().from(clients).$dynamic()

        const conditions = []

        if (status && status !== "all") {
            conditions.push(eq(clients.status, status))
        }

        if (type && type !== "all") {
            conditions.push(eq(clients.type, type))
        }

        if (search) {
            conditions.push(
                or(
                    ilike(clients.name, `%${search}%`),
                    ilike(clients.email, `%${search}%`),
                    ilike(clients.company, `%${search}%`),
                )
            )
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions))
        }

        return query.orderBy(desc(clients.joinedDate))
    }

    async getById(id: string): Promise<ClientRow | null> {
        const [client] = await this.db
            .select()
            .from(clients)
            .where(eq(clients.id, id))
            .limit(1)

        return client ?? null
    }

    async getByClerkId(clerkUserId: string): Promise<ClientRow | null> {
        const [client] = await this.db
            .select()
            .from(clients)
            .where(eq(clients.clerkUserId, clerkUserId))
            .limit(1)

        return client ?? null
    }

    async getByEmail(email: string): Promise<ClientRow | null> {
        const [client] = await this.db
            .select()
            .from(clients)
            .where(eq(clients.email, email))
            .limit(1)

        return client ?? null
    }

    async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
        const conditions = [eq(clients.email, email)]
        if (excludeId) conditions.push(ne(clients.id, excludeId))

        const [existing] = await this.db
            .select({ id: clients.id })
            .from(clients)
            .where(and(...conditions))
            .limit(1)

        return !!existing
    }

    async create(
        input: CreateClientInput,
        actorId: string,
        actorName: string,
    ): Promise<ClientRow> {

        const emailTaken = await this.isEmailTaken(input.email)
        if (emailTaken) throw new Error("A client with this email already exists")

        const [created] = await this.db
            .insert(clients)
            .values({
                ...input,
                joinedDate: new Date(),
                updatedAt: new Date(),
            })
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "client_created",
            summary: `Created new client: ${created.name}`,
            entityType: "client",
            entityId: created.id,
            entityLabel: created.name,
            metadata: { type: created.type, status: created.status },
        })

        return created
    }

    async update(
        id: string,
        input: UpdateClientInput,
        actorId: string,
        actorName: string,
    ): Promise<ClientRow> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Client not found")

        if (input.email && input.email !== existing.email) {
            const emailTaken = await this.isEmailTaken(input.email, id)
            if (emailTaken) throw new Error("A client with this email already exists")
        }

        const [updated] = await this.db
            .update(clients)
            .set({ ...this.sanitize(input), updatedAt: new Date() })
            .where(eq(clients.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "client_updated",
            summary: `Updated client: ${updated.name}`,
            entityType: "client",
            entityId: updated.id,
            entityLabel: updated.name,
            metadata: { changes: Object.keys(this.sanitize(input)) },
        })

        return updated
    }

    async updateStatus(
        id: string,
        status: ClientRow["status"],
        actorId: string,
        actorName: string,
    ): Promise<ClientRow> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Client not found")

        const [updated] = await this.db
            .update(clients)
            .set({ status, updatedAt: new Date() })
            .where(eq(clients.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "client_status_changed",
            summary: `Changed ${existing.name} status: ${existing.status} → ${status}`,
            entityType: "client",
            entityId: updated.id,
            entityLabel: updated.name,
            metadata: { from: existing.status, to: status },
        })

        return updated
    }

    // ── Delete ────────────────────────────────────────────────
    async delete(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<void> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Client not found")

        await this.db
            .delete(clients)
            .where(eq(clients.id, id))

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "client_deleted",
            summary: `Deleted client: ${existing.name}`,
            entityType: "client",
            entityId: existing.id,
            entityLabel: existing.name,
            metadata: { email: existing.email, type: existing.type },
        })
    }

    async getStats() {
        const all = await this.db.select().from(clients)
        return {
            total: all.length,
            active: all.filter((c) => c.status === "active").length,
            prospect: all.filter((c) => c.status === "prospect").length,
            inactive: all.filter((c) => c.status === "inactive").length,
            companies: all.filter((c) => c.type === "company").length,
            individuals: all.filter((c) => c.type === "individual").length,
        }
    }
}

export const clientService = new ClientService()