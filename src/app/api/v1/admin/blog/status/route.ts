import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiError, apiResponse } from "@/lib/api/version"
import { postService } from "@/server/services/blog.service"
import { NextRequest } from "next/server"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admin access required", 403)

    try {
        const { id } = await params
        const post = await postService.toggleStatus(
            id,
            verified.admin.id,
            verified.admin.name,
        )
        return apiResponse(post)
    } catch (err) {
        if (err instanceof Error && err.message === "Post not found") {
            return apiError("Not found", "Post not found", 404)
        }
        console.error("[POST /api/v1/admin/blog/[id]/status]", err)
        return apiError("Internal server error", undefined, 500)
    }
}