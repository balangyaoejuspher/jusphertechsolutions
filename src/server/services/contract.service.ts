import { contracts, contractTemplates, clients, projects } from "@/server/db/schema"
import type { NewContract } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { BaseService } from "./base.service"
import { generateContractPDF } from "./contract-pdf.service"
import { COMPANY } from "@/lib/contracts/variables"
import { uploadFile, getSignedUrl, deleteFile } from "@/lib/supabase/storage"

const BUCKET = "contracts" as const


export interface GenerateContractInput {
    templateId: string
    projectId: string
    clientId: string
    expiresAt?: Date
    overrides?: Record<string, string>
}

export interface ContractVariables {
    company_name: string
    company_email: string
    company_address: string
    company_phone: string
    company_website: string
    client_name: string
    client_email: string
    client_company: string
    client_phone: string
    client_address: string
    project_title: string
    project_description: string
    project_budget: string
    project_start_date: string
    project_due_date: string
    project_milestones: string
    contract_date: string
    contract_expiry: string
    effective_date: string
    [key: string]: string
}

export class ContractService extends BaseService {

    async resolveVariables(
        clientId: string,
        projectId: string,
        overrides: Record<string, string> = {},
        expiresAt?: Date,
    ): Promise<ContractVariables> {

        const [client] = await this.db
            .select()
            .from(clients)
            .where(eq(clients.id, clientId))

        if (!client) throw new Error("Client not found")

        const [project] = await this.db
            .select()
            .from(projects)
            .where(eq(projects.id, projectId))

        if (!project) throw new Error("Project not found")

        const fmt = (d: Date | string | null | undefined) => {
            if (!d) return "TBD"
            return new Date(d).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
            })
        }

        const fmtMoney = (n: string | null | undefined) => {
            if (!n) return "TBD"
            return `$${parseFloat(n).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        }

        const fmtMilestones = (ms: { label: string; done: boolean }[] | null) => {
            if (!ms || ms.length === 0) return "No milestones defined"
            return ms.map((m, i) => `${i + 1}. ${m.label}`).join("\n")
        }

        const today = new Date()
        const expiry = expiresAt ?? new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())

        return {
            company_name: COMPANY.name,
            company_email: COMPANY.email,
            company_address: COMPANY.address,
            company_phone: COMPANY.phone,
            company_website: COMPANY.website,

            client_name: client.name,
            client_email: client.email,
            client_company: client.company ?? client.name,
            client_phone: client.phone ?? "N/A",
            client_address: client.location ?? "N/A",

            project_title: project.title,
            project_description: project.description ?? "As discussed and agreed upon.",
            project_budget: fmtMoney(project.budget),
            project_start_date: fmt(project.startDate),
            project_due_date: fmt(project.dueDate),
            project_milestones: fmtMilestones(project.milestones),

            contract_date: fmt(today),
            effective_date: fmt(today),
            contract_expiry: fmt(expiry),

            ...overrides,
        }
    }

    renderBody(templateBody: string, vars: ContractVariables): string {
        return templateBody.replace(/\{\{(\w+)\}\}/g, (_, key) => {
            return vars[key] ?? `{{${key}}}`
        })
    }

    async generateAndUpload(
        contractId: string,
        title: string,
        body: string,
        vars: ContractVariables,
        signerName?: string,
        signerEmail?: string,
    ): Promise<{ storagePath: string }> {

        const pdfBytes = await generateContractPDF({
            title,
            body,
            clientName: vars.client_name,
            projectTitle: vars.project_title,
            contractDate: vars.contract_date,
            signerName,
            signerEmail,
        })

        const storagePath = `${contractId}.pdf`

        await uploadFile(
            BUCKET,
            storagePath,
            Buffer.from(pdfBytes),
            "application/pdf",
        )

        return { storagePath }
    }

    async getDownloadUrl(contractId: string, expiresInSeconds = 60 * 60 * 24): Promise<string> {
        const [contract] = await this.db
            .select({ storagePath: contracts.storagePath })
            .from(contracts)
            .where(eq(contracts.id, contractId))

        if (!contract?.storagePath) throw new Error("Contract PDF not found")

        return getSignedUrl(BUCKET, contract.storagePath, expiresInSeconds)
    }

    // ── Main: generate contract from template + project ───────────────────────
    async generate(input: GenerateContractInput) {
        const { templateId, projectId, clientId, expiresAt, overrides = {} } = input

        const [template] = await this.db
            .select()
            .from(contractTemplates)
            .where(eq(contractTemplates.id, templateId))

        if (!template) throw new Error("Template not found")

        const vars = await this.resolveVariables(clientId, projectId, overrides, expiresAt)
        const renderedBody = this.renderBody(template.body, vars)
        const title = `${template.title} — ${vars.client_company}`

        const [contract] = await this.db
            .insert(contracts)
            .values({
                templateId,
                projectId,
                clientId,
                title,
                type: template.type,
                status: "draft",
                body: renderedBody,
                signerName: vars.client_name,
                signerEmail: vars.client_email,
                expiresAt: expiresAt ?? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                variables: vars,
            } satisfies Partial<NewContract> as any)
            .returning()

        const { storagePath } = await this.generateAndUpload(
            contract.id,
            title,
            renderedBody,
            vars,
            vars.client_name,
            vars.client_email,
        )

        const [updated] = await this.db
            .update(contracts)
            .set({ storagePath, updatedAt: new Date() })
            .where(eq(contracts.id, contract.id))
            .returning()

        return updated
    }

    async regeneratePDF(contractId: string) {
        const [contract] = await this.db
            .select()
            .from(contracts)
            .where(eq(contracts.id, contractId))

        if (!contract) throw new Error("Contract not found")

        const { storagePath } = await this.generateAndUpload(
            contract.id,
            contract.title,
            contract.body,
            contract.variables as ContractVariables,
            contract.signerName ?? undefined,
            contract.signerEmail ?? undefined,
        )

        const [updated] = await this.db
            .update(contracts)
            .set({ storagePath, updatedAt: new Date() })
            .where(eq(contracts.id, contractId))
            .returning()

        return updated
    }

    async markSent(contractId: string) {
        const [updated] = await this.db
            .update(contracts)
            .set({ status: "sent", sentAt: new Date(), updatedAt: new Date() })
            .where(eq(contracts.id, contractId))
            .returning()
        return updated
    }

    async markSigned(contractId: string) {
        const [updated] = await this.db
            .update(contracts)
            .set({ status: "signed", signedAt: new Date(), updatedAt: new Date() })
            .where(eq(contracts.id, contractId))
            .returning()
        return updated
    }

    async getByProject(projectId: string) {
        return this.db.select().from(contracts).where(eq(contracts.projectId, projectId))
    }

    async getByClient(clientId: string) {
        return this.db.select().from(contracts).where(eq(contracts.clientId, clientId))
    }

    async getTemplates() {
        return this.db.select().from(contractTemplates)
    }

    async delete(contractId: string) {
        const [contract] = await this.db
            .select()
            .from(contracts)
            .where(eq(contracts.id, contractId))

        if (!contract) throw new Error("Contract not found")

        if (contract.storagePath) {
            await deleteFile(BUCKET, contract.storagePath)
        }

        await this.db.delete(contracts).where(eq(contracts.id, contractId))
    }
}

export const contractService = new ContractService()