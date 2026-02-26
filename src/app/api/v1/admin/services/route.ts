import { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api/version"
import { serviceService } from "@/server/services"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"

export async function GET(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error

    const { searchParams } = new URL(req.url)

    const data = await serviceService.getAll({
        search: searchParams.get("search") ?? undefined,
        status: (searchParams.get("status") ?? "all") as any,
        limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
        offset: searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined,
    })

    return apiResponse(data)
}

export async function POST(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admins only", 403)

    const body = await req.json()

    const data = await serviceService.create(body, result.admin.id, result.admin.name)

    return apiResponse(data, 201)
}