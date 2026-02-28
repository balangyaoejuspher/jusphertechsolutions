import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { contractService } from "@/server/services/contract.service"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const { id } = await params
    const { searchParams } = new URL(req.url)
    const expiresIn = Number(searchParams.get("expiresIn")) || 60 * 60 * 24

    try {
        const url = await contractService.getDownloadUrl(id, expiresIn)
        return apiResponse({ url })
    } catch (err) {
        console.error("[contracts/:id/download] GET error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}
