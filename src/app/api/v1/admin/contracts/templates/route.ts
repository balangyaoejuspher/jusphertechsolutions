import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { contractService } from "@/server/services/contract.service"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    try {
        return apiResponse(await contractService.getTemplates())
    } catch (err) {
        console.error("[contracts/templates] GET error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}