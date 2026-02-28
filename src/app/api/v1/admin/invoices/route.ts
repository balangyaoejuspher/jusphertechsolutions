import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { invoiceService } from "@/server/services/invoice.service"
import type { InvoiceStatus } from "@/server/services/invoice.service"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    try {
        const { searchParams } = req.nextUrl

        const [result, stats] = await Promise.all([
            invoiceService.getPaginated({
                page: Math.max(1, Number(searchParams.get("page") ?? 1)),
                pageSize: Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 20))),
                search: searchParams.get("search")?.trim() ?? "",
                status: (searchParams.get("status") ?? "all") as InvoiceStatus | "all",
                clientId: searchParams.get("clientId") ?? undefined,
            }),
            invoiceService.getStats(),
        ])

        return apiResponse({ ...result, stats })
    } catch (err) {
        console.error("[invoices] GET error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}

export async function POST(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    try {
        const body = await req.json()

        // Auto-generate invoice number if not provided
        if (!body.number) {
            body.number = await invoiceService.generateNumber()
        }

        const invoice = await invoiceService.create(body)
        return apiResponse(invoice, 201)
    } catch (err) {
        console.error("[invoices] POST error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}