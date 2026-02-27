import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { announcementService } from "@/server/services"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const { id } = await params
    const existing = await announcementService.getById(id)
    if (!existing) return apiError("Not Found", "Announcement not found", 404)

    if (existing.status === "published") {
        return apiError("Bad Request", "Announcement is already published", 400)
    }

    if (existing.status === "archived") {
        return apiError("Bad Request", "Archived announcements cannot be published", 400)
    }

    const published = await announcementService.publish(id)
    return apiResponse(published)
}