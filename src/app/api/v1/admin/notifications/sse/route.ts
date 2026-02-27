// ─────────────────────────────────────────────────────────────────────────────
// Server-Sent Events endpoint for real-time notifications
// Client connects once and keeps the connection open
// Server pushes new notifications as they arrive via sseManager
// ─────────────────────────────────────────────────────────────────────────────
import { type NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { sseManager } from "@/server/services/notification.service"
import { randomUUID } from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    const verified = await verifyApiRequest(req, "admin")
    if (isVerifyError(verified)) return verified.error
    if (!isVerifyAdmin(verified)) {
        return new Response("Forbidden", { status: 403 })
    }

    const adminId = verified.admin.id
    const connectionId = randomUUID()

    const stream = new ReadableStream({
        start(controller) {
            sseManager.add(connectionId, adminId, controller)

            controller.enqueue(
                new TextEncoder().encode(
                    `event: connected\ndata: ${JSON.stringify({ connectionId })}\n\n`
                )
            )

            // Heartbeat every 30 seconds to keep connection alive
            const heartbeat = setInterval(() => {
                sseManager.ping(connectionId)
            }, 30_000)

            // Clean up when client disconnects
            req.signal.addEventListener("abort", () => {
                clearInterval(heartbeat)
                sseManager.remove(connectionId)
            })
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no", // disable nginx buffering on Vercel
        },
    })
}