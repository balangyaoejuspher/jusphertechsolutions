import { apiError, apiResponse } from "@/lib/api/version"
import { parseQuery } from "@/lib/helpers/api-helpers"
import { relatedQuerySchema } from "@/lib/validations"
import { postService } from "@/server/services/blog.service"
import { NextRequest } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { data: query, error } = parseQuery(req.url, relatedQuerySchema)
    if (error) return error

    try {
        const { slug } = await params
        const post = await postService.getBySlug(slug)

        if (!post || post.status !== "published") {
            return apiError("Not found", "Post not found", 404)
        }

        const related = await postService.getRelated(slug, post.category, query.limit)
        return apiResponse(related)
    } catch (err) {
        console.error("[GET /api/v1/public/blog/[slug]/related]", err)
        return apiError("Internal server error", undefined, 500)
    }
}