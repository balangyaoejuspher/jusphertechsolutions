import { eq, desc, and, ilike, or, InferInsertModel } from "drizzle-orm"
import { placements, talent, clients, projects } from "@/server/db/schema"
import type { Placement } from "@/server/db/schema"
import { BaseService } from "./base.service"
import { activityService } from "./activity.service"

export type PlacementRow = Placement & {
    talentName: string
    clientName: string
    projectTitle: string | null
    contractStatus: string | null
    contractUrl: string | null
    contractSignedAt: Date | null
    inquiryStatus: string
    contractGeneratedAt: Date | null
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

type UpdatePlacementInput = Partial<Omit<InferInsertModel<typeof placements>, "id" | "createdAt">>
export class PlacementService extends BaseService {

    private async queryAll(): Promise<PlacementRow[]> {
        const rows = await this.db
            .select({
                id: placements.id,
                talentId: placements.talentId,
                clientId: placements.clientId,
                projectId: placements.projectId,
                inquiryId: placements.inquiryId,
                inquiryStatus: placements.inquiryStatus,
                contractGeneratedAt: placements.contractGeneratedAt,
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
            .orderBy(desc(placements.createdAt))

        return rows as PlacementRow[]
    }

    async getAll(): Promise<PlacementRow[]> {
        return this.queryAll()
    }

    async getById(id: string): Promise<PlacementRow | null> {
        const rows = await this.db
            .select({
                id: placements.id,
                talentId: placements.talentId,
                clientId: placements.clientId,
                projectId: placements.projectId,
                inquiryId: placements.inquiryId,
                inquiryStatus: placements.inquiryStatus,
                contractGeneratedAt: placements.contractGeneratedAt,
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

    async getByClient(clientId: string): Promise<PlacementRow[]> {
        const all = await this.queryAll()
        return all.filter((p) => p.clientId === clientId)
    }

    async getByTalent(talentId: string): Promise<PlacementRow[]> {
        const all = await this.queryAll()
        return all.filter((p) => p.talentId === talentId)
    }

    async getByProject(projectId: string): Promise<PlacementRow[]> {
        const all = await this.queryAll()
        return all.filter((p) => p.projectId === projectId)
    }

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
            inquiryStatus: input.inquiryStatus,
            contractGeneratedAt: input.contractGeneratedAt,
            updatedAt: new Date(),
        })

        await this.db
            .update(placements)
            .set(patch)
            .where(eq(placements.id, id))

        if (input.status && input.status !== existing.status) {
            await activityService.log({
                actorType: "admin",
                actorId,
                actorName,
                type: "placement_updated",
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