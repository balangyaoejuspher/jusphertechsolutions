import { inquiries, admins, talent, clients, projects, placements } from "@/server/db/schema"
import type { Inquiry, NewInquiry, Project } from "@/server/db/schema"
import { eq, and, ilike, or, desc, } from "drizzle-orm"
import { BaseService } from "./base.service"
import { activityService, LogInput } from "./activity.service"
import { clerkClient } from "@clerk/nextjs/server"
import { parseBudget } from "@/lib/helpers/format"

type CreateInquiryInput = Omit<NewInquiry, "id" | "createdAt" | "updatedAt" | "resolvedAt">
type UpdateInquiryInput = Partial<Omit<NewInquiry, "id" | "createdAt" | "updatedAt">>

type ListInquiriesOptions = {
    search?: string
    status?: Inquiry["status"] | "all"
    priority?: Inquiry["priority"] | "all"
    source?: Inquiry["source"] | "all"
}

export type ConvertInput = {
    clientName?: string
    clientType?: "company" | "individual"
    clientPhone?: string
    clientPosition?: string
    clientWebsite?: string
    clientLocation?: string
    clientServices?: string[]
    tempPassword: string
    projectTitle: string
    projectDescription?: string
    projectBudget?: string
    projectStartDate?: string
    projectDueDate?: string
    projectNotes?: string
    placementTalentId?: string
    placementRole?: string
    placementHourlyRate?: string
    placementHoursPerWeek?: number
    placementStartDate?: string
    placementEndDate?: string
    placementNotes?: string
}


export class InquiryService extends BaseService {

    async getAll(options: ListInquiriesOptions = {}) {
        const { search, status, priority, source } = options

        let query = this.db
            .select({
                inquiry: inquiries,
                talentName: talent.name,
                adminName: admins.name,
            })
            .from(inquiries)
            .leftJoin(talent, eq(inquiries.talentId, talent.id))
            .leftJoin(admins, eq(inquiries.assignedTo, admins.id))
            .$dynamic()

        const conditions = []

        if (status && status !== "all") {
            conditions.push(eq(inquiries.status, status))
        }

        if (priority && priority !== "all") {
            conditions.push(eq(inquiries.priority, priority))
        }

        if (source && source !== "all") {
            conditions.push(eq(inquiries.source, source))
        }

        if (search) {
            conditions.push(
                or(
                    ilike(inquiries.name, `%${search}%`),
                    ilike(inquiries.email, `%${search}%`),
                    ilike(inquiries.company, `%${search}%`),
                    ilike(inquiries.message, `%${search}%`),
                )
            )
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions))
        }

        const rows = await query.orderBy(desc(inquiries.createdAt))

        return rows.map((r) => ({
            ...r.inquiry,
            talentName: r.talentName ?? null,
            adminName: r.adminName ?? null,
        }))
    }

    async getById(id: string) {
        const [row] = await this.db
            .select({
                inquiry: inquiries,
                talentName: talent.name,
                adminName: admins.name,
            })
            .from(inquiries)
            .leftJoin(talent, eq(inquiries.talentId, talent.id))
            .leftJoin(admins, eq(inquiries.assignedTo, admins.id))
            .where(eq(inquiries.id, id))
            .limit(1)

        if (!row) return null

        return {
            ...row.inquiry,
            talentName: row.talentName ?? null,
            adminName: row.adminName ?? null,
        }
    }

    async create(input: CreateInquiryInput): Promise<Inquiry> {
        const [created] = await this.db
            .insert(inquiries)
            .values({
                ...input,
                status: "new",
                priority: input.priority ?? "medium",
                source: input.source ?? "contact_form",
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning()

        await activityService.log({
            actorType: "system",
            actorId: "system",
            actorName: "System",
            type: "inquiry_received",
            summary: `New inquiry from ${created.name}${created.company ? ` (${created.company})` : ""}`,
            entityType: "inquiry",
            entityId: created.id,
            entityLabel: created.name,
            metadata: { email: created.email, source: created.source },
        })

        return created
    }

    async update(
        id: string,
        input: UpdateInquiryInput,
        actorId: string,
        actorName: string,
    ): Promise<Inquiry> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Inquiry not found")

        const resolvedAt =
            input.status === "resolved" && existing.status !== "resolved"
                ? new Date()
                : input.status !== "resolved"
                    ? null
                    : existing.resolvedAt

        const [updated] = await this.db
            .update(inquiries)
            .set({ ...this.sanitize(input), resolvedAt, updatedAt: new Date() })
            .where(eq(inquiries.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "inquiry_status_changed",
            summary: `Updated inquiry from ${existing.name}`,
            entityType: "inquiry",
            entityId: updated.id,
            entityLabel: updated.name,
            metadata: { changes: Object.keys(this.sanitize(input)) },
        })

        return updated
    }

    async assignTalent(
        id: string,
        talentId: string,
        actorId: string,
        actorName: string,
    ): Promise<Inquiry> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Inquiry not found")

        const [talentMember] = await this.db
            .select({ name: talent.name })
            .from(talent)
            .where(eq(talent.id, talentId))
            .limit(1)

        if (!talentMember) throw new Error("Talent not found")

        const [updated] = await this.db
            .update(inquiries)
            .set({ talentId, updatedAt: new Date() })
            .where(eq(inquiries.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "inquiry_assigned",
            summary: `Assigned ${talentMember.name} to inquiry from ${existing.name}`,
            entityType: "inquiry",
            entityId: updated.id,
            entityLabel: updated.name,
            metadata: { talentId, talentName: talentMember.name },
        })

        return updated
    }

    async assignAdmin(
        id: string,
        adminId: string,
        actorId: string,
        actorName: string,
    ): Promise<Inquiry> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Inquiry not found")

        const [admin] = await this.db
            .select({ name: admins.name })
            .from(admins)
            .where(eq(admins.id, adminId))
            .limit(1)

        if (!admin) throw new Error("Admin not found")

        const [updated] = await this.db
            .update(inquiries)
            .set({ assignedTo: adminId, updatedAt: new Date() })
            .where(eq(inquiries.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "inquiry_assigned",
            summary: `Assigned ${admin.name} to inquiry from ${existing.name}`,
            entityType: "inquiry",
            entityId: updated.id,
            entityLabel: updated.name,
            metadata: { adminId, adminName: admin.name },
        })

        return updated
    }

    async resolve(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<Inquiry> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Inquiry not found")

        const [updated] = await this.db
            .update(inquiries)
            .set({ status: "resolved", resolvedAt: new Date(), updatedAt: new Date() })
            .where(eq(inquiries.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "inquiry_resolved",
            summary: `Resolved inquiry from ${existing.name}`,
            entityType: "inquiry",
            entityId: updated.id,
            entityLabel: updated.name,
            metadata: { resolvedAt: updated.resolvedAt },
        })

        return updated
    }

    async delete(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<void> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Inquiry not found")

        await this.db.delete(inquiries).where(eq(inquiries.id, id))

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "inquiry_status_changed",
            summary: `Deleted inquiry from ${existing.name}`,
            entityType: "inquiry",
            entityId: existing.id,
            entityLabel: existing.name,
            metadata: { email: existing.email },
        })
    }

    async getStats() {
        const all = await this.db.select().from(inquiries)
        return {
            total: all.length,
            new: all.filter((i) => i.status === "new").length,
            inProgress: all.filter((i) => i.status === "in_progress").length,
            resolved: all.filter((i) => i.status === "resolved").length,
            urgent: all.filter((i) => i.priority === "urgent").length,
            high: all.filter((i) => i.priority === "high").length,
            unassigned: all.filter((i) => !i.assignedTo).length,
        }
    }

    async convert(
        inquiryId: string,
        input: ConvertInput,
        actorId: string,
        actorName: string,
    ) {
        const inquiry = await this.getById(inquiryId)
        if (!inquiry) throw new Error("Inquiry not found")
        if (inquiry.clientId) throw new Error("Inquiry already converted")

        const [firstName, ...rest] = inquiry.name.trim().split(" ")
        const lastName = rest.join(" ") || ""

        const clerk = await clerkClient()
        const clerkUser = await clerk.users.createUser({
            firstName,
            lastName,
            emailAddress: [inquiry.email],
            password: input.tempPassword,
        })

        const [newClient] = await this.db
            .insert(clients)
            .values({
                clerkUserId: clerkUser.id,
                type: input.clientType ?? (inquiry.company ? "company" : "individual"),
                name: input.clientName ?? inquiry.name,
                email: inquiry.email,
                phone: input.clientPhone ?? inquiry.phone ?? null,
                company: inquiry.company ?? null,
                position: input.clientPosition ?? null,
                website: input.clientWebsite ?? null,
                location: input.clientLocation ?? null,
                services: input.clientServices ?? [],
                status: "active",
                notes: null,
                joinedDate: new Date(),
                updatedAt: new Date(),
            })
            .returning()

        const [newProject] = await this.db
            .insert(projects)
            .values({
                clientId: newClient.id,
                inquiryId: inquiryId,
                title: input.projectTitle,
                description: input.projectDescription ?? null,
                status: "draft",
                priority: "medium",
                budget: parseBudget(input.projectBudget),
                startDate: input.projectStartDate ? new Date(input.projectStartDate) : null,
                dueDate: input.projectDueDate ? new Date(input.projectDueDate) : null,
                notes: input.projectNotes ?? null,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning()

        let newPlacement = null
        if (input.placementTalentId && input.placementRole) {
            const [inserted] = await this.db
                .insert(placements)
                .values({
                    talentId: input.placementTalentId,
                    clientId: newClient.id,
                    projectId: newProject.id,
                    inquiryId: inquiryId,
                    role: input.placementRole,
                    hourlyRate: input.placementHourlyRate ?? null,
                    hoursPerWeek: input.placementHoursPerWeek ?? 40,
                    startDate: input.placementStartDate
                        ? new Date(input.placementStartDate)
                        : (input.projectStartDate ? new Date(input.projectStartDate) : new Date()),
                    endDate: input.placementEndDate ? new Date(input.placementEndDate) : null,
                    notes: input.placementNotes ?? null,
                    status: "active",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning()
            newPlacement = inserted
        }

        const [updatedInquiry] = await this.db
            .update(inquiries)
            .set({
                clientId: newClient.id,
                status: "in_progress",
                updatedAt: new Date(),
            })
            .where(eq(inquiries.id, inquiryId))
            .returning()

        const activityEntries: LogInput[] = [
            {
                actorType: "admin",
                actorId,
                actorName,
                type: "client_created",
                summary: `Converted inquiry from ${inquiry.name} → new client`,
                entityType: "client",
                entityId: newClient.id,
                entityLabel: newClient.name,
                metadata: { inquiryId, fromEmail: inquiry.email },
            },
            {
                actorType: "admin",
                actorId,
                actorName,
                type: "inquiry_status_changed",
                summary: `Inquiry from ${inquiry.name} converted to project: ${input.projectTitle}`,
                entityType: "inquiry",
                entityId: inquiryId,
                entityLabel: inquiry.name,
                metadata: { clientId: newClient.id, projectId: newProject.id },
            },
        ]

        if (newPlacement) {
            activityEntries.push({
                actorType: "admin" as const,
                actorId,
                actorName,
                type: "placement_created",
                summary: `Placement created for ${inquiry.name} as ${input.placementRole}`,
                entityType: "placement",
                entityId: newPlacement.id,
                entityLabel: input.placementRole ?? null,
                metadata: {
                    talentId: input.placementTalentId,
                    clientId: newClient.id,
                    projectId: newProject.id,
                    inquiryId,
                },
            })
        }

        await activityService.logMany(activityEntries)

        return {
            client: newClient,
            project: newProject,
            inquiry: updatedInquiry,
            placement: newPlacement,
            clerkId: clerkUser.id,
        }
    }
}
export const inquiryService = new InquiryService()

