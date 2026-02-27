import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyClient, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { getSignedUrl } from "@/lib/supabase/storage"
import { db } from "@/server/db/client"
import { projects } from "@/server/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req)
    if (isVerifyError(verified)) return verified.error

    const { searchParams } = new URL(req.url)
    const path = searchParams.get("path")
    const projectId = searchParams.get("projectId")

    if (!path) return apiError("Bad Request", "Missing storage path", 400)

    if (isVerifyClient(verified)) {
        if (!projectId) {
            return apiError("Bad Request", "Missing projectId", 400)
        }

        const project = await db.query.projects.findFirst({
            where: eq(projects.id, projectId),
        })

        if (!project) {
            return apiError("Not Found", "Project not found", 404)
        }

        if (project.clientId !== verified.client.id) {
            return apiError("Forbidden", "You do not have access to this contract", 403)
        }
    }

    if (!isVerifyAdmin(verified) && !isVerifyClient(verified)) {
        return apiError("Forbidden", "No matching account", 403)
    }

    const signedUrl = await getSignedUrl("contracts", path)
    return apiResponse({ url: signedUrl, expiresIn: "24 hours" })
}