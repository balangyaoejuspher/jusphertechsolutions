import { apiResponse, apiError } from "@/lib/api/version"
import { parseQuery } from "@/lib/helpers/api-helpers"
import { searchQuerySchema } from "@/lib/validations"
import { postService } from "@/server/services/blog.service"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    const { data: query, error } = parseQuery(req.url, searchQuerySchema)
    if (error) return error

    try {
        const result = await postService.search(query.q, {
            category: query.category,
            page: query.page,
            limit: query.limit,
        })
        return apiResponse(result)
    } catch (err) {
        console.error("[GET /api/v1/public/blog/search]", err)
        return apiError("Internal server error", undefined, 500)
    }
}