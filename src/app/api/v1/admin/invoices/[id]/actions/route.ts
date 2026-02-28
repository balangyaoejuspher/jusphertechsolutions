import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { invoiceService } from "@/server/services/invoice.service"


export async function POST_ACTION(req: NextRequest, { params }: { params: { id: string } }) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    try {
        const { action, amount } = await req.json()

        let invoice = null

        switch (action) {
            case "send":
                invoice = await invoiceService.markSent(params.id)
                break
            case "mark_paid":
                invoice = await invoiceService.markPaid(params.id)
                break
            case "record_payment":
                if (!amount || isNaN(amount)) return apiError("Bad Request", "amount is required", 400)
                invoice = await invoiceService.recordPayment(params.id, Number(amount))
                break
            default:
                return apiError("Bad Request", `Unknown action: ${action}`, 400)
        }

        if (!invoice) return apiError("Not Found", "Invoice not found", 404)
        return apiResponse(invoice)
    } catch (err) {
        console.error("[invoices/:id/actions] POST error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}