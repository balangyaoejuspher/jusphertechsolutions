import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { uploadService } from "@/server/services/upload.service"

export async function POST(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    if (verified.admin.role === "editor") {
        return apiError("Forbidden", "Insufficient permissions", 403)
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) return apiError("Bad Request", "No file provided", 400)

    try {
        const url = await uploadService.uploadCompanyLogo(file)
        return apiResponse({ url })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed"
        return apiError("Upload Failed", message, 400)
    }
}