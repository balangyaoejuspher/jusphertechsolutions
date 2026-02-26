import { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api/version"
import { serviceService } from "@/server/services"


export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    if (!slug) return apiError("Bad Request", "Slug is required", 400)

    const service = await serviceService.getBySlug(slug)
    if (!service) return apiError("Not Found", "Service not found", 404)

    return apiResponse(service)
}