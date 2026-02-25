import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { talentService } from "@/server/services"

export async function GET(req: NextRequest) {
    try {
        const result = await verifyApiRequest(req, "admin")
        if (isVerifyError(result)) return result.error
        if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

        const { searchParams } = new URL(req.url)

        const data = await talentService.getAll({
            search: searchParams.get("search") ?? undefined,
            status: (searchParams.get("status") ?? "all") as any,
            role: (searchParams.get("role") ?? "all") as any,
            visible: searchParams.has("visible")
                ? searchParams.get("visible") === "true"
                : undefined,
        })

        return apiResponse(data)
    } catch (err) {
        console.error("GET /admin/talent error:", err)
        return apiError("Internal Server Error", "Unexpected error", 500)
    }
}

export async function POST(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const body = await req.json()

    if (!body.name || !body.email || !body.title || !body.role) {
        return apiError("Bad Request", "name, email, title and role are required", 400)
    }

    try {
        const created = await talentService.create(
            {
                name: body.name,
                email: body.email,
                clerkUserId: body.clerkUserId ?? null,
                title: body.title,
                role: body.role,
                status: body.status ?? "available",
                bio: body.bio ?? null,
                avatarUrl: body.avatarUrl ?? null,
                gradient: body.gradient ?? "from-blue-500 to-cyan-400",
                skills: body.skills ?? [],
                hourlyRate: body.hourlyRate ?? null,
                rating: body.rating ?? "5.0",
                projectsCompleted: body.projectsCompleted ?? 0,
                isVisible: body.isVisible ?? true,
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