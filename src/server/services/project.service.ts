import { projects } from "@/server/db/schema"
import type { Project, NewProject } from "@/server/db/schema"
import { eq, and, ilike, or, desc } from "drizzle-orm"
import { BaseService } from "./base.service"
import { activityService } from "./activity.service"

type CreateProjectInput = Omit<NewProject, "id" | "createdAt" | "updatedAt">

type UpdateProjectInput = Partial<Omit<NewProject, "id" | "createdAt" | "updatedAt">>

type ListProjectsOptions = {
    search?: string
    status?: Project["status"] | "all"
    priority?: Project["priority"] | "all"
    clientId?: string
    page?: number
    pageSize?: number
}

export class ProjectService extends BaseService {

    async getAll(options: ListProjectsOptions = {}) {
        const { search, status, priority, clientId } = options

        let query = this.db.select().from(projects).$dynamic()

        const conditions = []

        if (status && status !== "all") {
            conditions.push(eq(projects.status, status))
        }

        if (priority && priority !== "all") {
            conditions.push(eq(projects.priority, priority))
        }

        if (clientId) {
            conditions.push(eq(projects.clientId, clientId))
        }

        if (search) {
            conditions.push(
                or(
                    ilike(projects.title, `%${search}%`),
                    ilike(projects.description, `%${search}%`),
                )
            )
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions))
        }

        return query.orderBy(desc(projects.createdAt))
    }

    async getById(id: string): Promise<Project | null> {
        const [project] = await this.db
            .select()
            .from(projects)
            .where(eq(projects.id, id))
            .limit(1)

        return project ?? null
    }

    async getByClientId(clientId: string): Promise<Project[]> {
        return this.db
            .select()
            .from(projects)
            .where(eq(projects.clientId, clientId))
            .orderBy(desc(projects.createdAt))
    }

    async create(
        input: CreateProjectInput,
        actorId: string,
        actorName: string,
    ): Promise<Project> {

        const [created] = await this.db
            .insert(projects)
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
            type: "client_created",
            summary: `Created new project: ${created.title}`,
            entityType: "project",
            entityId: created.id,
            entityLabel: created.title,
            metadata: { status: created.status, priority: created.priority },
        })

        return created
    }

    async update(
        id: string,
        input: UpdateProjectInput,
        actorId: string,
        actorName: string,
    ): Promise<Project> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Project not found")

        const [updated] = await this.db
            .update(projects)
            .set({ ...this.sanitize(input), updatedAt: new Date() })
            .where(eq(projects.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "client_updated",
            summary: `Updated project: ${updated.title}`,
            entityType: "project",
            entityId: updated.id,
            entityLabel: updated.title,
            metadata: { changes: Object.keys(this.sanitize(input)) },
        })

        return updated
    }

    async updateStatus(
        id: string,
        status: Project["status"],
        actorId: string,
        actorName: string,
    ): Promise<Project> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Project not found")

        const [updated] = await this.db
            .update(projects)
            .set({ status, updatedAt: new Date() })
            .where(eq(projects.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "client_status_changed",
            summary: `Changed ${existing.title} status: ${existing.status} → ${status}`,
            entityType: "project",
            entityId: updated.id,
            entityLabel: updated.title,
            metadata: { from: existing.status, to: status },
        })

        return updated
    }

    async updateProgress(
        id: string,
        progress: number,
        actorId: string,
        actorName: string,
    ): Promise<Project> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Project not found")

        if (progress < 0 || progress > 100) {
            throw new Error("Progress must be between 0 and 100")
        }

        const [updated] = await this.db
            .update(projects)
            .set({ progress, updatedAt: new Date() })
            .where(eq(projects.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "client_updated",
            summary: `Updated ${existing.title} progress: ${existing.progress}% → ${progress}%`,
            entityType: "project",
            entityId: updated.id,
            entityLabel: updated.title,
            metadata: { from: existing.progress, to: progress },
        })

        return updated
    }

    async updateContractStatus(
        id: string,
        contractStatus: Project["contractStatus"],
        contractUrl?: string,
        contractSignedAt?: Date,
        actorId?: string,
        actorName?: string,
    ): Promise<Project> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Project not found")

        const updateData: any = { 
            contractStatus, 
            updatedAt: new Date() 
        }
        
        if (contractUrl !== undefined) updateData.contractUrl = contractUrl
        if (contractSignedAt !== undefined) updateData.contractSignedAt = contractSignedAt

        const [updated] = await this.db
            .update(projects)
            .set(updateData)
            .where(eq(projects.id, id))
            .returning()

        if (actorId && actorName) {
            await activityService.log({
                actorType: "admin",
                actorId,
                actorName,
                type: "client_updated",
                summary: `Updated ${existing.title} contract status: ${existing.contractStatus} → ${contractStatus}`,
                entityType: "project",
                entityId: updated.id,
                entityLabel: updated.title,
                metadata: { 
                    from: existing.contractStatus, 
                    to: contractStatus,
                    contractUrl: contractUrl || null,
                },
            })
        }

        return updated
    }

    async delete(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<void> {

        const existing = await this.getById(id)
        if (!existing) throw new Error("Project not found")

        await this.db.delete(projects).where(eq(projects.id, id))

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "client_deleted",
            summary: `Deleted project: ${existing.title}`,
            entityType: "project",
            entityId: id,
            entityLabel: existing.title,
            metadata: { status: existing.status },
        })
    }
}

export const projectService = new ProjectService()
