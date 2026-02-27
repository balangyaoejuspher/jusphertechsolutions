import { type NextRequest } from "next/server"
import { isVerifyClient, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { announcementService } from "@/server/services"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    const verified = await verifyApiRequest(req)
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyClient(verified)) return apiError("Forbidden", "Clients only", 403)

    const { id } = await params
    const announcement = await announcementService.getById(id)
    if (!announcement) return apiError("Not Found", "Announcement not found", 404)

    if (announcement.status !== "published") {
        return apiError("Bad Request", "Announcement is not published", 400)
    }

    await announcementService.markAsRead(
        id,
        verified.client.clerkUserId!,
        "client"
    )

    return apiResponse({ read: true })
}