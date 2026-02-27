import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { announcementService } from "@/server/services"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error

    const announcements = await announcementService.getAll()
    return apiResponse(announcements)
}

export async function POST(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const body = await req.json()
    const { title, content, type, audience, status, scheduledAt } = body

    if (!title || !content || !type || !audience) {
        return apiError("Bad Request", "title, content, type and audience are required", 400)
    }

    const announcement = await announcementService.create({
        title,
        content,
        type,
        audience,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        createdBy: verified.admin.id,
    })

    return apiResponse(announcement, 201)
}