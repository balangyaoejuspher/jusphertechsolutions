import { apiError, apiResponse } from "@/lib/api/version"
import { postService } from "@/server/services/blog.service"
import { NextRequest } from "next/server"

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params
        const post = await postService.getBySlug(slug)

        if (!post || post.status !== "published") {
            return apiError("Not found", "Post not found", 404)
        }

        return apiResponse(post)
    } catch (err) {
        console.error("[GET /api/v1/public/blog/[slug]]", err)
        return apiError("Internal server error", undefined, 500)
    }
}