import { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api/version"
import { serviceService } from "@/server/services"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admins only", 403)

    const data = await serviceService.toggleStatus(params.id, result.admin.id, result.admin.name)

    return apiResponse(data)
}