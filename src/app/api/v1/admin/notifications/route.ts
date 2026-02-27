import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { notificationService } from "@/server/services"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get("limit") ?? 30), 100)

    const [items, unreadCount] = await Promise.all([
        notificationService.getForAdmin(verified.admin.id, limit),
        notificationService.getUnreadCount(verified.admin.id),
    ])

    return apiResponse({ items, unreadCount })
}

export async function PATCH(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    await notificationService.markAllAsRead(verified.admin.id)
    return apiResponse({ success: true })
}

export async function DELETE(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) return apiError("Forbidden", "Admins only", 403)

    await notificationService.deleteAllRead(verified.admin.id)
    return apiResponse({ success: true })
}