import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { inquiryService } from "@/server/services"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params
    const body = await req.json()

    if (!body.projectTitle) {
        return apiError("Bad Request", "projectTitle is required", 400)
    }

    if (!body.tempPassword) {
        return apiError("Bad Request", "tempPassword is required to create client portal access", 400)
    }

    if (body.placementTalentId && !body.placementRole) {
        return apiError("Bad Request", "placementRole is required when assigning talent", 400)
    }

    try {
        const converted = await inquiryService.convert(
            id,
            body,
            result.admin.id,
            result.admin.name,
        )

        return apiResponse(converted, 201)
    } catch (err: any) {
        if (err.message === "Inquiry not found") return apiError("Not Found", err.message, 404)
        if (err.message === "Inquiry already converted") return apiError("Conflict", err.message, 409)

        if (err?.errors?.[0]?.code === "form_identifier_exists") {
            return apiError("Conflict", "A Clerk account with this email already exists", 409)
        }

        console.error("Convert error:", err)
        throw err
    }
}