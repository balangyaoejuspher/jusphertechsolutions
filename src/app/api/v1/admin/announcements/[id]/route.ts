import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { announcementService } from "@/server/services"

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error

    const { id } = await params
    const announcement = await announcementService.getById(id)
    if (!announcement) return apiError("Not Found", "Announcement not found", 404)

    const readCount = await announcementService.getReadCount(id)
    return apiResponse({ ...announcement, readCount })
}

export async function PUT(req: NextRequest, { params }: Params) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const { id } = await params
    const existing = await announcementService.getById(id)
    if (!existing) return apiError("Not Found", "Announcement not found", 404)

    if (
        verified.admin.role === "editor" &&
        existing.createdBy !== verified.admin.id
    ) {
        return apiError("Forbidden", "You can only edit your own announcements", 403)
    }

    if (existing.status === "archived") {
        return apiError("Bad Request", "Archived announcements cannot be edited", 400)
    }

    const body = await req.json()
    const { title, content, type, audience, status, scheduledAt } = body

    const updated = await announcementService.update(id, {
        title,
        content,
        type,
        audience,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    })

    return apiResponse(updated)
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const { id } = await params
    const existing = await announcementService.getById(id)
    if (!existing) return apiError("Not Found", "Announcement not found", 404)

    if (verified.admin.role === "editor") {
        return apiError("Forbidden", "Insufficient permissions", 403)
    }

    await announcementService.delete(id)
    return apiResponse({ deleted: true })
}