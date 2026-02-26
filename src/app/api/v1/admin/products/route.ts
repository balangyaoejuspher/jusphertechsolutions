import { NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { productService } from "@/server/services"


export async function GET(req: NextRequest) {
    const auth = await verifyApiRequest(req, "admin")
    if (isVerifyError(auth)) return auth.error
    if (!isVerifyAdmin(auth)) return apiError("Forbidden", "Admin access required", 403)

    const { searchParams } = new URL(req.url)

    const data = await productService.getAll({
        search: searchParams.get("search") ?? undefined,
        status: (searchParams.get("status") ?? "all") as any,
        category: (searchParams.get("category") ?? "all") as any,
    })

    return apiResponse(data)
}

export async function POST(req: NextRequest) {
    const auth = await verifyApiRequest(req, "admin")
    if (isVerifyError(auth)) return auth.error
    if (!isVerifyAdmin(auth)) return apiError("Forbidden", "Admin access required", 403)

    const body = await req.json()

    if (!body.slug || !body.label || !body.tagline || !body.description) {
        return apiError("Validation error", "slug, label, tagline and description are required", 400)
    }

    const data = await productService.create(body, auth.admin.id, auth.admin.name)
    return apiResponse(data, 201)
}