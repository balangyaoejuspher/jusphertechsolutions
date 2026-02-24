export type InvoiceStatus = "paid" | "unpaid" | "overdue" | "partial" | "draft"
export type Currency = "USD" | "PHP"

export type LineItem = {
    description: string
    qty: number
    rate: number
    amount: number
}

export type Invoice = {
    id: string
    number: string
    project: string
    issued: string
    due: string
    amount: number
    paid: number
    status: InvoiceStatus
    items: LineItem[]
    notes?: string
}