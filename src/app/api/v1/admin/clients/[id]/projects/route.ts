import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { projectService } from "@/server/services/project.service"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    if (!id) return apiError("Bad Request", "Client ID is required", 400)

    try {
        const projects = await projectService.getByClientId(id)
        return apiResponse(projects)
    } catch (err) {
        console.error("[clients/:id/projects] GET error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}