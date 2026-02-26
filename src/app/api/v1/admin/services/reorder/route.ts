import { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api/version"
import { serviceService } from "@/server/services"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"

export async function POST(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admins only", 403)

    const { orderedIds } = await req.json()
    if (!Array.isArray(orderedIds)) return apiError("Bad Request", "orderedIds must be an array", 400)

    await serviceService.reorder(orderedIds, result.admin.id, result.admin.name)

    return apiResponse({ reordered: true })
}