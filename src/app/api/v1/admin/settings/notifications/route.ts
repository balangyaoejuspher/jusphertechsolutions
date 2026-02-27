import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { settingsService } from "@/server/services/settings.service"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const prefs = await settingsService.getNotifications(verified.admin.clerkUserId)

    return apiResponse(prefs ?? {
        newInquiry: true,
        talentUpdate: true,
        weeklyReport: false,
        marketing: false,
    })
}

export async function PUT(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const body = await req.json()
    const updated = await settingsService.upsertNotifications(verified.admin.clerkUserId, body)
    return apiResponse(updated)
}