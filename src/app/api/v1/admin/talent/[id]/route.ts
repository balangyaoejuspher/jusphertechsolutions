import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { talentService } from "@/server/services"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params
    const talentMember = await talentService.getById(id)

    if (!talentMember) return apiError("Not Found", "Talent not found", 404)

    return apiResponse(talentMember)
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params
    const body = await req.json()

    try {
        const updated = await talentService.update(
            id,
            body,
            result.admin.id,
            result.admin.name,
        )
        return apiResponse(updated)
    } catch (err: any) {
        if (err.message === "Talent not found") return apiError("Not Found", err.message, 404)
        if (err.message.includes("already exists")) return apiError("Conflict", err.message, 409)
        throw err
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params

    try {
        await talentService.delete(id, result.admin.id, result.admin.name)
        return apiResponse({ deleted: true })
    } catch (err: any) {
        if (err.message === "Talent not found") return apiError("Not Found", err.message, 404)
        throw err
    }
}