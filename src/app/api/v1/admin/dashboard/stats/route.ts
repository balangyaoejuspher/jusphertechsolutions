import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { dashboardService } from "@/server/services/dashboard.service"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    try {
        const stats = await dashboardService.getAdminStats()
        return apiResponse(stats)
    } catch (err) {
        console.error("[dashboard/stats] error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}