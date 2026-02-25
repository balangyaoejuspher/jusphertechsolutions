import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { projectService } from "@/server/services"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params
    const body = await req.json()

    if (!body.status) {
        return apiError("Bad Request", "status is required", 400)
    }

    const validStatuses = ["draft", "active", "paused", "completed", "cancelled"]
    if (!validStatuses.includes(body.status)) {
        return apiError("Bad Request", `status must be one of: ${validStatuses.join(", ")}`, 400)
    }

    try {
        const updated = await projectService.updateStatus(
            id,
            body.status,
            result.admin.id,
            result.admin.name,
        )
        return apiResponse(updated)
    } catch (err: any) {
        if (err.message === "Project not found") {
            return apiError("Not Found", err.message, 404)
        }
        console.error("PATCH /admin/projects/[id]/status error:", err)
        throw err
    }
}
