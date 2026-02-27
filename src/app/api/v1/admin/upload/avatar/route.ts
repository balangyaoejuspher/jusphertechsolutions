import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyClient, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { uploadService } from "@/server/services/upload.service"

export async function POST(req: NextRequest) {
    const verified = await verifyApiRequest(req)
    if (isVerifyError(verified)) return verified.error

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const clientId = formData.get("clientId") as string | null

    if (!file) return apiError("Bad Request", "No file provided", 400)

    try {
        let url: string

        if (clientId) {
            if (!isVerifyAdmin(verified)) {
                return apiError("Forbidden", "Only admins can upload client avatars", 403)
            }
            url = await uploadService.uploadClientAvatar(clientId, file)
        } else if (isVerifyAdmin(verified)) {
            url = await uploadService.uploadAdminAvatar(verified.admin.clerkUserId, file)
        } else if (isVerifyClient(verified)) {
            url = await uploadService.uploadClientAvatar(verified.client.id, file)
        } else {
            return apiError("Forbidden", "No matching account", 403)
        }

        return apiResponse({ url })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed"
        return apiError("Upload Failed", message, 400)
    }
}