import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { clientService } from "@/server/services"

export async function GET(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error

    const { searchParams } = new URL(req.url)

    const data = await clientService.getAll({
        search: searchParams.get("search") ?? undefined,
        status: (searchParams.get("status") ?? "all") as any,
        type: (searchParams.get("type") ?? "all") as any,
    })

    return apiResponse(data)
}

export async function POST(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const body = await req.json()

    if (!body.name || !body.email || !body.type) {
        return apiError("Bad Request", "name, email and type are required", 400)
    }

    try {
        const created = await clientService.create(
            {
                clerkUserId: body.clerkUserId ?? null,
                type: body.type,
                name: body.name,
                email: body.email,
                phone: body.phone ?? null,
                website: body.website ?? null,
                location: body.location ?? null,
                company: body.company ?? null,
                position: body.position ?? null,
                status: body.status ?? "prospect",
                services: body.services ?? [],
                notes: body.notes ?? null,
            },
            result.admin.id,
            result.admin.name,
        )

        return apiResponse(created, 201)
    } catch (err: any) {
        if (err.message.includes("already exists")) {
            return apiError("Conflict", err.message, 409)
        }
        throw err
    }
}