import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiError, apiResponse } from "@/lib/api/version"
import { parseBody } from "@/lib/helpers/api-helpers"
import { updatePostSchema } from "@/lib/validations"
import { postService } from "@/server/services/blog.service"
import { NextRequest } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error

    try {
        const { id } = await params
        const post = await postService.getById(id)
        if (!post) return apiError("Not found", "Post not found", 404)
        return apiResponse(post)
    } catch (err) {
        console.error("[GET /api/v1/admin/blog/[id]]", err)
        return apiError("Internal server error", undefined, 500)
    }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admin access required", 403)

    const { data: input, error } = await parseBody(req, updatePostSchema)
    if (error) return error

    try {
        const { id } = await params
        const existing = await postService.getById(id)
        if (!existing) return apiError("Not found", "Post not found", 404)

        if (input.slug && input.slug !== existing.slug) {
            const slugTaken = await postService.slugExists(input.slug, id)
            if (slugTaken) {
                return apiError("Conflict", `Slug "${input.slug}" is already taken`, 409)
            }
        }

        const updated = await postService.update(
            id,
            input,
            verified.admin.id,
            verified.admin.name,
        )
        return apiResponse(updated)
    } catch (err) {
        console.error("[PATCH /api/v1/admin/blog/[id]]", err)
        return apiError("Internal server error", undefined, 500)
    }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admin access required", 403)

    try {
        const { id } = await params
        await postService.delete(id, verified.admin.id, verified.admin.name)
        return apiResponse({ deleted: true })
    } catch (err) {
        if (err instanceof Error && err.message === "Post not found") {
            return apiError("Not found", "Post not found", 404)
        }
        console.error("[DELETE /api/v1/admin/blog/[id]]", err)
        return apiError("Internal server error", undefined, 500)
    }
}