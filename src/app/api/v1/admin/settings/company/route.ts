import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { settingsService } from "@/server/services/settings.service"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error

    const settings = await settingsService.getCompany()

    return apiResponse(settings ?? {
        companyName: "Juspher & Co.",
        email: "support@juspherandco.com",
        phone: null,
        website: null,
        description: null,
        address: null,
        logoUrl: null,
        timezone: "Asia/Manila",
    })
}

export async function PUT(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    if (verified.admin.role === "editor") {
        return apiError("Forbidden", "Insufficient permissions", 403)
    }

    const body = await req.json()
    const updated = await settingsService.upsertCompany(body)
    return apiResponse(updated)
}