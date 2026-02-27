import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyClient, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { announcementService } from "@/server/services"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req)
    if (isVerifyError(verified)) return verified.error

    let announcements

    if (isVerifyClient(verified)) {
        announcements = await announcementService.getForAudience("client")
    } else if (isVerifyAdmin(verified)) {
        announcements = await announcementService.getForAudience("client")
    } else {
        return apiError("Forbidden", "No matching account", 403)
    }

    return apiResponse(announcements)
}