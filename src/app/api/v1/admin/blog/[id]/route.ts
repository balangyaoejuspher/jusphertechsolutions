import { NextRequest } from "next/server"
import { apiError, apiResponse } from "@/lib/api/version"
import { postService } from "@/server/services/blog.service"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error

    try {
        const { id } = await params
        const post = await postService.getById(id)
        if (!post) return apiError("Not found", "Post not found", 404)
        return apiResponse(post)
    } catch (err) {
        console.error(err)
        return apiError("Internal server error", undefined, 500)
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admin access required", 403)

    try {
        const { id } = await params
        const existing = await postService.getById(id)
        if (!existing) return apiError("Not found", "Post not found", 404)

        const body = await req.json()
        const updated = await postService.update(id, body, verified.admin.id, verified.admin.name)
        return apiResponse(updated)
    } catch (err) {
        console.error(err)
        return apiError("Internal server error", undefined, 500)
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admin access required", 403)

    try {
        const { id } = await params
        await postService.delete(id, verified.admin.id, verified.admin.name)
        return apiResponse({ deleted: true })
    } catch (err) {
        console.error(err)
        return apiError("Internal server error", undefined, 500)
    }
}