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

    if (body.progress === undefined || body.progress === null) {
        return apiError("Bad Request", "progress is required", 400)
    }

    const progress = Number(body.progress)
    if (isNaN(progress)) {
        return apiError("Bad Request", "progress must be a number", 400)
    }

    try {
        const updated = await projectService.updateProgress(
            id,
            progress,
            result.admin.id,
            result.admin.name,
        )
        return apiResponse(updated)
    } catch (err: any) {
        if (err.message === "Project not found") {
            return apiError("Not Found", err.message, 404)
        }
        if (err.message.includes("Progress must be between")) {
            return apiError("Bad Request", err.message, 400)
        }
        console.error("PATCH /admin/projects/[id]/progress error:", err)
        throw err
    }
}
