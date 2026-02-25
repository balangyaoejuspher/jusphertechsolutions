import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { placementService } from "@/server/services"

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params

    try {
        const placement = await placementService.getById(id)
        if (!placement) return apiError("Not Found", "Placement not found", 404)
        return apiResponse(placement)
    } catch (err) {
        console.error("GET /admin/placements/:id error:", err)
        throw err
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params
    const body = await req.json()

    try {
        const updated = await placementService.update(
            id,
            body,
            result.admin.id,
            result.admin.name,
        )
        return apiResponse(updated)
    } catch (err: any) {
        if (err.message === "Placement not found") return apiError("Not Found", err.message, 404)
        console.error("PATCH /admin/placements/:id error:", err)
        throw err
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params

    try {
        await placementService.delete(id, result.admin.id, result.admin.name)
        return apiResponse({ success: true })
    } catch (err: any) {
        if (err.message === "Placement not found") return apiError("Not Found", err.message, 404)
        console.error("DELETE /admin/placements/:id error:", err)
        throw err
    }
}