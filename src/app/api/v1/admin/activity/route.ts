import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { activityService } from "@/server/services/activity.service"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    try {
        const { searchParams } = req.nextUrl

        const result = await activityService.getPaginated({
            page: Math.max(1, Number(searchParams.get("page") ?? 1)),
            pageSize: Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 20))),
            search: searchParams.get("search")?.trim() ?? "",
            group: searchParams.get("group")?.toLowerCase() ?? "",
            actor: searchParams.get("actor") ?? "",
        })

        return apiResponse(result)
    } catch (err) {
        console.error("[activity] error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}