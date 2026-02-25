import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { projectService } from "@/server/services"

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error

    const { id } = await params

    try {
        const project = await projectService.getById(id)
        if (!project) return apiError("Not Found", "Project not found", 404)

        return apiResponse(project)
    } catch (err) {
        console.error("GET /admin/projects/[id] error:", err)
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
        const updateData: any = {}

        if (body.title !== undefined) updateData.title = body.title
        if (body.description !== undefined) updateData.description = body.description
        if (body.status !== undefined) updateData.status = body.status
        if (body.priority !== undefined) updateData.priority = body.priority
        if (body.progress !== undefined) updateData.progress = body.progress
        if (body.contractStatus !== undefined) updateData.contractStatus = body.contractStatus
        if (body.contractUrl !== undefined) updateData.contractUrl = body.contractUrl
        if (body.contractSignedAt !== undefined) {
            updateData.contractSignedAt = body.contractSignedAt ? new Date(body.contractSignedAt) : null
        }
        if (body.startDate !== undefined) {
            updateData.startDate = body.startDate ? new Date(body.startDate) : null
        }
        if (body.dueDate !== undefined) {
            updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null
        }
        if (body.budget !== undefined) updateData.budget = body.budget
        if (body.spent !== undefined) updateData.spent = body.spent
        if (body.tags !== undefined) updateData.tags = body.tags
        if (body.milestones !== undefined) updateData.milestones = body.milestones
        if (body.notes !== undefined) updateData.notes = body.notes

        const updated = await projectService.update(
            id,
            updateData,
            result.admin.id,
            result.admin.name,
        )

        return apiResponse(updated)
    } catch (err: any) {
        if (err.message === "Project not found") {
            return apiError("Not Found", err.message, 404)
        }
        console.error("PATCH /admin/projects/[id] error:", err)
        throw err
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params

    try {
        await projectService.delete(id, result.admin.id, result.admin.name)
        return apiResponse({ message: "Project deleted successfully" })
    } catch (err: any) {
        if (err.message === "Project not found") {
            return apiError("Not Found", err.message, 404)
        }
        console.error("DELETE /admin/projects/[id] error:", err)
        throw err
    }
}
