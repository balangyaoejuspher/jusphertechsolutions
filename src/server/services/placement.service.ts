import { eq, desc, and, ilike, or } from "drizzle-orm"
import { placements, talent, clients, projects } from "@/server/db/schema"
import type { NewPlacement, Placement } from "@/server/db/schema"
import { BaseService } from "./base.service"
import { activityService } from "./activity.service"

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlacementRow = Placement & {
    talentName: string
    clientName: string
    projectTitle: string | null
    contractStatus: string | null
    contractUrl: string | null
    contractSignedAt: Date | null
}

export type CreatePlacementInput = {
    talentId: string
    clientId: string
    projectId?: string
    inquiryId?: string
    role: string
    description?: string
    hourlyRate?: string
    hoursPerWeek?: number
    startDate: string
    endDate?: string
    notes?: string
    status?: Placement["status"]
}

export type UpdatePlacementInput = Partial<Omit<CreatePlacementInput, "talentId" | "clientId">> & {
    status?: Placement["status"]
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class PlacementService extends BaseService {

    // ── Private: base query with all joins ───────────────────────────────────

    private async queryAll(): Promise<PlacementRow[]> {
        const rows = await this.db
            .select({
                // all placement columns
                id: placements.id,
                talentId: placements.talentId,
                clientId: placements.clientId,
                projectId: placements.projectId,
                inquiryId: placements.inquiryId,
                role: placements.role,
                description: placements.description,
                status: placements.status,
                startDate: placements.startDate,
                endDate: placements.endDate,
                hourlyRate: placements.hourlyRate,
                hoursPerWeek: placements.hoursPerWeek,
                notes: placements.notes,
                createdAt: placements.createdAt,
                updatedAt: placements.updatedAt,
                // joined columns
                talentName: talent.name,
                clientName: clients.name,
                projectTitle: projects.title,
                contractStatus: projects.contractStatus,
                contractUrl: projects.contractUrl,
                contractSignedAt: projects.contractSignedAt,
            })
            .from(placements)
            .innerJoin(talent, eq(placements.talentId, talent.id))
            .innerJoin(clients, eq(placements.clientId, clients.id))
            .leftJoin(projects, eq(placements.projectId, projects.id))
            .orderBy(desc(placements.createdAt))

        return rows as PlacementRow[]
    }

    // ── List all ─────────────────────────────────────────────────────────────

    async getAll(): Promise<PlacementRow[]> {
        return this.queryAll()
    }

    // ── Get by ID ─────────────────────────────────────────────────────────────

    async getById(id: string): Promise<PlacementRow | null> {
        const rows = await this.db
            .select({
                id: placements.id,
                talentId: placements.talentId,
                clientId: placements.clientId,
                projectId: placements.projectId,
                inquiryId: placements.inquiryId,
                role: placements.role,
                description: placements.description,
                status: placements.status,
                startDate: placements.startDate,
                endDate: placements.endDate,
                hourlyRate: placements.hourlyRate,
                hoursPerWeek: placements.hoursPerWeek,
                notes: placements.notes,
                createdAt: placements.createdAt,
                updatedAt: placements.updatedAt,
                talentName: talent.name,
                clientName: clients.name,
                projectTitle: projects.title,
                contractStatus: projects.contractStatus,
                contractUrl: projects.contractUrl,
                contractSignedAt: projects.contractSignedAt,
            })
            .from(placements)
            .innerJoin(talent, eq(placements.talentId, talent.id))
            .innerJoin(clients, eq(placements.clientId, clients.id))
            .leftJoin(projects, eq(placements.projectId, projects.id))
            .where(eq(placements.id, id))
            .limit(1)

        return (rows[0] as PlacementRow) ?? null
    }

    // ── Get by client ─────────────────────────────────────────────────────────

    async getByClient(clientId: string): Promise<PlacementRow[]> {
        const all = await this.queryAll()
        return all.filter((p) => p.clientId === clientId)
    }

    // ── Get by talent ─────────────────────────────────────────────────────────

    async getByTalent(talentId: string): Promise<PlacementRow[]> {
        const all = await this.queryAll()
        return all.filter((p) => p.talentId === talentId)
    }

    // ── Get by project ────────────────────────────────────────────────────────

    async getByProject(projectId: string): Promise<PlacementRow[]> {
        const all = await this.queryAll()
        return all.filter((p) => p.projectId === projectId)
    }

    // ── Create ────────────────────────────────────────────────────────────────

    async create(
        input: CreatePlacementInput,
        actorId: string,
        actorName: string,
    ): Promise<PlacementRow> {
        const [inserted] = await this.db
            .insert(placements)
            .values({
                talentId: input.talentId,
                clientId: input.clientId,
                projectId: input.projectId ?? null,
                inquiryId: input.inquiryId ?? null,
                role: input.role,
                description: input.description ?? null,
                hourlyRate: input.hourlyRate ?? null,
                hoursPerWeek: input.hoursPerWeek ?? 40,
                startDate: new Date(input.startDate),
                endDate: input.endDate ? new Date(input.endDate) : null,
                notes: input.notes ?? null,
                status: input.status ?? "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "placement_created",
            summary: `Placement created: ${input.role}`,
            entityType: "placement",
            entityId: inserted.id,
            entityLabel: input.role,
            metadata: {
                talentId: input.talentId,
                clientId: input.clientId,
                projectId: input.projectId ?? null,
                inquiryId: input.inquiryId ?? null,
            },
        })

        const row = await this.getById(inserted.id)
        return row!
    }

    // ── Update ────────────────────────────────────────────────────────────────

    async update(
        id: string,
        input: UpdatePlacementInput,
        actorId: string,
        actorName: string,
    ): Promise<PlacementRow> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Placement not found")

        const patch = this.sanitize({
            role: input.role,
            description: input.description,
            status: input.status,
            hourlyRate: input.hourlyRate,
            hoursPerWeek: input.hoursPerWeek,
            startDate: input.startDate ? new Date(input.startDate) : undefined,
            endDate: input.endDate ? new Date(input.endDate) : undefined,
            projectId: input.projectId,
            inquiryId: input.inquiryId,
            notes: input.notes,
            updatedAt: new Date(),
        })

        await this.db
            .update(placements)
            .set(patch)
            .where(eq(placements.id, id))

        // Log status changes specifically for better activity trail
        if (input.status && input.status !== existing.status) {
            await activityService.log({
                actorType: "admin",
                actorId,
                actorName,
                type: `placement_${input.status}` as any,
                summary: `Placement for ${existing.talentName} moved to ${input.status}`,
                entityType: "placement",
                entityId: id,
                entityLabel: existing.role,
                metadata: {
                    from: existing.status,
                    to: input.status,
                },
            })
        }

        const row = await this.getById(id)
        return row!
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    async delete(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<void> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Placement not found")

        await this.db
            .delete(placements)
            .where(eq(placements.id, id))

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "placement_deleted",
            summary: `Placement deleted: ${existing.role} for ${existing.talentName}`,
            entityType: "placement",
            entityId: id,
            entityLabel: existing.role,
            metadata: {
                talentId: existing.talentId,
                clientId: existing.clientId,
            },
        })
    }
}

export const placementService = new PlacementService()