
import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { notificationService } from "@/server/services"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const { id } = await params
    const updated = await notificationService.markAsRead(id, verified.admin.id)

    if (!updated) return apiError("Not Found", "Notification not found", 404)
    return apiResponse(updated)
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const { id } = await params
    await notificationService.delete(id, verified.admin.id)
    return apiResponse({ deleted: true })
}