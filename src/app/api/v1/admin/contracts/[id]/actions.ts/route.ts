
import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { contractService } from "@/server/services/contract.service"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const { id } = await params
    const { action } = await req.json()

    try {
        if (action === "mark_sent")   return apiResponse(await contractService.markSent(id))
        if (action === "mark_signed") return apiResponse(await contractService.markSigned(id))
        if (action === "regenerate")  return apiResponse(await contractService.regeneratePDF(id))
        return apiError("Bad Request", `Unknown action: ${action}`, 400)
    } catch (err) {
        console.error("[contracts/:id/actions] POST error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}