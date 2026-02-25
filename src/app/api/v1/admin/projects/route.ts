import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { projectService } from "@/server/services"

export async function GET(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error

    const { searchParams } = new URL(req.url)

    try {
        const data = await projectService.getAll({
            search: searchParams.get("search") ?? undefined,
            status: (searchParams.get("status") ?? "all") as any,
            priority: (searchParams.get("priority") ?? "all") as any,
            clientId: searchParams.get("clientId") ?? undefined,
        })

        return apiResponse(data)
    } catch (err) {
        console.error("GET /admin/projects error:", err)
        throw err
    }
}

export async function POST(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const body = await req.json()

    if (!body.clientId) return apiError("Bad Request", "clientId is required", 400)
    if (!body.title) return apiError("Bad Request", "title is required", 400)

    try {
        const project = await projectService.create(
            {
                clientId: body.clientId,
                inquiryId: body.inquiryId ?? null,
                title: body.title,
                description: body.description ?? null,
                status: body.status ?? "draft",
                priority: body.priority ?? "medium",
                progress: body.progress ?? 0,
                contractStatus: body.contractStatus ?? "pending",
                contractUrl: body.contractUrl ?? null,
                contractSignedAt: body.contractSignedAt ? new Date(body.contractSignedAt) : null,
                startDate: body.startDate ? new Date(body.startDate) : null,
                dueDate: body.dueDate ? new Date(body.dueDate) : null,
                budget: body.budget ?? null,
                spent: body.spent ?? "0",
                tags: body.tags ?? [],
                milestones: body.milestones ?? [],
                notes: body.notes ?? null,
            },
            result.admin.id,
            result.admin.name,
        )
        return apiResponse(project, 201)
    } catch (err: any) {
        console.error("POST /admin/projects error:", err)
        throw err
    }
}
