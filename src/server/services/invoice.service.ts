import { invoices, clients } from "@/server/db/schema"
import type { NewInvoice } from "@/server/db/schema"
import { eq, desc, and, sql, count, sum, ilike, or } from "drizzle-orm"
import { BaseService } from "./base.service"

export type InvoiceStatus = "draft" | "unpaid" | "partial" | "paid" | "overdue"

export type CreateInvoiceInput = Omit<NewInvoice, "id" | "createdAt" | "updatedAt">
export type UpdateInvoiceInput = Partial<CreateInvoiceInput>

export interface InvoiceQuery {
    page?: number
    pageSize?: number
    search?: string
    status?: InvoiceStatus | "all"
    clientId?: string
}

export interface InvoiceWithClient {
    id: string
    number: string
    projectId: string | null
    project: string
    clientId: string
    clientName: string | null
    clientEmail: string | null
    issued: string
    due: string
    amount: string
    paid: string
    status: InvoiceStatus
    items: import("@/types").LineItem[]
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
}

export interface PaginatedInvoiceResult {
    data: InvoiceWithClient[]
    total: number
    page: number
    pageSize: number
}

export interface InvoiceStats {
    totalBilled: number
    totalPaid: number
    totalOutstanding: number
    totalOverdue: number
    totalDraft: number
    countByStatus: Record<InvoiceStatus, number>
}

export class InvoiceService extends BaseService {

    async getPaginated({
        page = 1,
        pageSize = 20,
        search = "",
        status = "all",
        clientId,
    }: InvoiceQuery = {}): Promise<PaginatedInvoiceResult> {
        const conditions = []

        if (status && status !== "all") {
            conditions.push(eq(invoices.status, status))
        }

        if (clientId) {
            conditions.push(eq(invoices.clientId, clientId))
        }

        if (search) {
            conditions.push(
                or(
                    ilike(invoices.number, `%${search}%`),
                    ilike(invoices.project, `%${search}%`),
                )
            )
        }

        const where = conditions.length > 0 ? and(...conditions) : undefined

        const [data, [{ total }]] = await Promise.all([
            this.db
                .select({
                    id: invoices.id,
                    number: invoices.number,
                    projectId: invoices.projectId,
                    project: invoices.project,
                    clientId: invoices.clientId,
                    clientName: clients.name,
                    clientEmail: clients.email,
                    issued: invoices.issued,
                    due: invoices.due,
                    amount: invoices.amount,
                    paid: invoices.paid,
                    status: invoices.status,
                    items: invoices.items,
                    notes: invoices.notes,
                    createdAt: invoices.createdAt,
                    updatedAt: invoices.updatedAt,
                })
                .from(invoices)
                .leftJoin(clients, eq(invoices.clientId, clients.id))
                .where(where)
                .orderBy(desc(invoices.createdAt))
                .limit(pageSize)
                .offset((page - 1) * pageSize),

            this.db
                .select({ total: count() })
                .from(invoices)
                .where(where),
        ])

        return { data: data as InvoiceWithClient[], total, page, pageSize }
    }

    async getById(id: string): Promise<InvoiceWithClient | null> {
        const [row] = await this.db
            .select({
                id: invoices.id,
                number: invoices.number,
                projectId: invoices.projectId,
                project: invoices.project,
                clientId: invoices.clientId,
                clientName: clients.name,
                clientEmail: clients.email,
                issued: invoices.issued,
                due: invoices.due,
                amount: invoices.amount,
                paid: invoices.paid,
                status: invoices.status,
                items: invoices.items,
                notes: invoices.notes,
                createdAt: invoices.createdAt,
                updatedAt: invoices.updatedAt,
            })
            .from(invoices)
            .leftJoin(clients, eq(invoices.clientId, clients.id))
            .where(eq(invoices.id, id))

        return row ? (row as InvoiceWithClient) : null
    }

    async create(input: CreateInvoiceInput) {
        const [row] = await this.db
            .insert(invoices)
            .values(input)
            .returning()
        return row
    }

    async update(id: string, input: UpdateInvoiceInput) {
        const [row] = await this.db
            .update(invoices)
            .set({ ...input, updatedAt: new Date() })
            .where(eq(invoices.id, id))
            .returning()
        return row ?? null
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.db
            .delete(invoices)
            .where(and(eq(invoices.id, id), eq(invoices.status, "draft")))
            .returning({ id: invoices.id })
        return result.length > 0
    }

    async markSent(id: string) {
        return this.update(id, { status: "unpaid" })
    }

    async markPaid(id: string) {
        const [invoice] = await this.db
            .select({ amount: invoices.amount })
            .from(invoices)
            .where(eq(invoices.id, id))

        if (!invoice) return null
        return this.update(id, { status: "paid", paid: invoice.amount })
    }

    async recordPayment(id: string, amount: number) {
        const [invoice] = await this.db
            .select({ amount: invoices.amount, paid: invoices.paid })
            .from(invoices)
            .where(eq(invoices.id, id))

        if (!invoice) return null

        const newPaid = Number(invoice.paid) + amount
        const total = Number(invoice.amount)
        const newStatus: InvoiceStatus =
            newPaid >= total ? "paid"
                : newPaid > 0 ? "partial"
                    : "unpaid"

        return this.update(id, { paid: String(newPaid), status: newStatus })
    }

    async getStats(): Promise<InvoiceStats> {
        const rows = await this.db
            .select({
                status: invoices.status,
                totalAmount: sum(invoices.amount),
                totalPaid: sum(invoices.paid),
                cnt: count(),
            })
            .from(invoices)
            .groupBy(invoices.status)

        const stats: InvoiceStats = {
            totalBilled: 0,
            totalPaid: 0,
            totalOutstanding: 0,
            totalOverdue: 0,
            totalDraft: 0,
            countByStatus: { draft: 0, unpaid: 0, partial: 0, paid: 0, overdue: 0 },
        }

        for (const row of rows) {
            const status = row.status as InvoiceStatus
            const amount = Number(row.totalAmount ?? 0)
            const paid = Number(row.totalPaid ?? 0)

            stats.totalBilled += amount
            stats.countByStatus[status] = Number(row.cnt ?? 0)

            if (status === "paid") stats.totalPaid += paid
            if (status === "overdue") stats.totalOverdue += (amount - paid)
            if (status === "draft") stats.totalDraft += amount
            if (["unpaid", "partial", "overdue"].includes(status)) {
                stats.totalOutstanding += (amount - paid)
            }
        }

        return stats
    }

    async generateNumber(): Promise<string> {
        const year = new Date().getFullYear()
        const [{ total }] = await this.db
            .select({ total: count() })
            .from(invoices)
            .where(sql`EXTRACT(YEAR FROM ${invoices.createdAt}) = ${year}`)

        const seq = String(Number(total) + 1).padStart(3, "0")
        return `INV-${year}-${seq}`
    }
}

export const invoiceService = new InvoiceService()