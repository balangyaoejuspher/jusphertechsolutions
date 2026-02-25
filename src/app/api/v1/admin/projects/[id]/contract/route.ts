import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { projectService } from "@/server/services"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params
    const body = await req.json()

    if (!body.contractStatus) {
        return apiError("Bad Request", "contractStatus is required", 400)
    }

    const validStatuses = ["pending", "sent", "signed", "rejected"]
    if (!validStatuses.includes(body.contractStatus)) {
        return apiError("Bad Request", `contractStatus must be one of: ${validStatuses.join(", ")}`, 400)
    }

    try {
        const contractSignedAt = body.contractSignedAt ? new Date(body.contractSignedAt) : undefined

        const updated = await projectService.updateContractStatus(
            id,
            body.contractStatus,
            body.contractUrl,
            contractSignedAt,
            result.admin.id,
            result.admin.name,
        )
        return apiResponse(updated)
    } catch (err: any) {
        if (err.message === "Project not found") {
            return apiError("Not Found", err.message, 404)
        }
        console.error("PATCH /admin/projects/[id]/contract error:", err)
        throw err
    }
}
