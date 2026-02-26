import { apiResponse, apiError } from "@/lib/api/version"
import { parseQuery } from "@/lib/helpers/api-helpers"
import { publicPostsQuerySchema } from "@/lib/validations"
import { postService } from "@/server/services/blog.service"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    const { data: query, error } = parseQuery(req.url, publicPostsQuerySchema)
    if (error) return error

    try {
        const result = await postService.getPublished({
            category: query.category,
            page: query.page,
            limit: query.limit,
        })
        return apiResponse(result)
    } catch (err) {
        console.error("[GET /api/v1/public/blog]", err)
        return apiError("Internal server error", undefined, 500)
    }
}