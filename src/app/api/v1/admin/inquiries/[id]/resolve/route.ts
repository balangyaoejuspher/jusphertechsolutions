import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { inquiryService } from "@/server/services"

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params

    try {
        const updated = await inquiryService.resolve(
            id,
            result.admin.id,
            result.admin.name,
        )
        return apiResponse(updated)
    } catch (err: any) {
        if (err.message === "Inquiry not found") return apiError("Not Found", err.message, 404)
        throw err
    }
}