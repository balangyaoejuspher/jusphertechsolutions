import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { placementService } from "@/server/services"

export async function GET(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    try {
        const placements = await placementService.getAll()
        return apiResponse(placements)
    } catch (err) {
        console.error("GET /admin/placements error:", err)
        throw err
    }
}

export async function POST(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const body = await req.json()

    if (!body.talentId) return apiError("Bad Request", "talentId is required", 400)
    if (!body.clientId) return apiError("Bad Request", "clientId is required", 400)
    if (!body.role) return apiError("Bad Request", "role is required", 400)
    if (!body.startDate) return apiError("Bad Request", "startDate is required", 400)

    try {
        const placement = await placementService.create(
            body,
            result.admin.id,
            result.admin.name,
        )
        return apiResponse(placement, 201)
    } catch (err: any) {
        console.error("POST /admin/placements error:", err)
        throw err
    }
}