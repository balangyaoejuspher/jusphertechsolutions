import { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api/version"
import { serviceService } from "@/server/services"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error

    const { id } = await params
    const data = await serviceService.getById(id)
    if (!data) return apiError("Not Found", "Service not found", 404)

    return apiResponse(data)
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admins only", 403)

    const { id } = await params
    const body = await req.json()
    const data = await serviceService.update(id, body, result.admin.id, result.admin.name)

    return apiResponse(data)
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admins only", 403)

    const { id } = await params
    await serviceService.delete(id, result.admin.id, result.admin.name)

    return apiResponse({ deleted: true })
}