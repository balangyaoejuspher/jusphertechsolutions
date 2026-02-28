import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { invoiceService } from "@/server/services/invoice.service"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    try {
        const invoice = await invoiceService.getById(params.id)
        if (!invoice) return apiError("Not Found", "Invoice not found", 404)
        return apiResponse(invoice)
    } catch (err) {
        console.error("[invoices/:id] GET error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    try {
        const body = await req.json()
        const invoice = await invoiceService.update(params.id, body)
        if (!invoice) return apiError("Not Found", "Invoice not found", 404)
        return apiResponse(invoice)
    } catch (err) {
        console.error("[invoices/:id] PATCH error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    try {
        const deleted = await invoiceService.delete(params.id)
        if (!deleted) return apiError("Bad Request", "Only draft invoices can be deleted", 400)
        return apiResponse({ deleted: true })
    } catch (err) {
        console.error("[invoices/:id] DELETE error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}