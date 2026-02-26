import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { parseQuery, parseBody } from "@/lib/helpers/api-helpers"
import { adminPostsQuerySchema, createPostSchema } from "@/lib/validations"
import { postService } from "@/server/services/blog.service"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error

    const { data: query, error } = parseQuery(req.url, adminPostsQuerySchema)
    if (error) return error

    try {
        const result = await postService.getAll({
            category: query.category,
            status: query.status,
            search: query.search,
            page: query.page,
            limit: query.limit,
        })
        return apiResponse(result)
    } catch (err) {
        console.error("[GET /api/v1/admin/blog]", err)
        return apiError("Internal server error", undefined, 500)
    }
}

export async function POST(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admin access required", 403)

    const { data: input, error } = await parseBody(req, createPostSchema)
    if (error) return error

    try {
        const slugTaken = await postService.slugExists(input.slug)
        if (slugTaken) {
            return apiError("Conflict", `Slug "${input.slug}" is already taken`, 409)
        }

        const post = await postService.create(
            input,
            verified.admin.id,
            verified.admin.name,
        )
        return apiResponse(post, 201)
    } catch (err) {
        console.error("[POST /api/v1/admin/blog]", err)
        return apiError("Internal server error", undefined, 500)
    }
}