import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { contractService } from "@/server/services/contract.service"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    const clientId = searchParams.get("clientId")

    try {
        if (projectId) return apiResponse(await contractService.getByProject(projectId))
        if (clientId) return apiResponse(await contractService.getByClient(clientId))
        return apiError("Bad Request", "projectId or clientId required", 400)
    } catch (err) {
        console.error("[contracts] GET error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}

export async function POST(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    try {
        const { templateId, projectId, clientId, expiresAt, overrides } = await req.json()

        if (!templateId || !projectId || !clientId) {
            return apiError("Bad Request", "templateId, projectId, clientId are required", 400)
        }

        const contract = await contractService.generate({
            templateId, projectId, clientId,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            overrides,
        })

        return apiResponse(contract, 201)
    } catch (err) {
        console.error("[contracts] POST error:", err)
        return apiError("Internal Server Error", String(err), 500)
    }
}
