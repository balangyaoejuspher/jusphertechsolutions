import { auth } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"
import { verifyDailyToken } from "./jwt"
import { db } from "@/server/db/client"
import { clients, admins } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"
import { apiError } from "./version"

type Role = "admin" | "client"

type VerifyError = { error: Response }
type VerifyAdmin = { role: "admin"; admin: typeof admins.$inferSelect }
type VerifyClient = { role: "client"; client: typeof clients.$inferSelect }

type VerifyResult = VerifyError | VerifyAdmin | VerifyClient

export function isVerifyError(r: VerifyResult): r is VerifyError {
    return "error" in r
}
export function isVerifyAdmin(r: VerifyResult): r is VerifyAdmin {
    return "role" in r && r.role === "admin"
}
export function isVerifyClient(r: VerifyResult): r is VerifyClient {
    return "role" in r && r.role === "client"
}

export async function verifyApiRequest(
    req: NextRequest,
    requiredRole?: Role
): Promise<VerifyResult> {

    const { userId } = await auth()
    if (!userId) {
        return { error: apiError("Unauthorized", "No session", 401) }
    }

    const token = req.cookies.get("api_token")?.value
    if (!token) {
        return { error: apiError("Unauthorized", "Missing API token", 401) }
    }

    const jwt = await verifyDailyToken(token)
    if (!jwt.valid) {
        return { error: apiError("Unauthorized", jwt.reason, 401) }
    }

    const isAdminRoute = requiredRole === "admin"
    const isClientRoute = requiredRole === "client"
    const isAnyRole = requiredRole === undefined

    if (isAdminRoute || isAnyRole) {
        const [admin] = await db
            .select()
            .from(admins)
            .where(eq(admins.clerkUserId, userId))
            .limit(1)

        if (admin) return { role: "admin", admin }
    }

    if (isClientRoute || isAnyRole) {
        const [client] = await db
            .select()
            .from(clients)
            .where(
                and(
                    eq(clients.clerkUserId, userId),
                    eq(clients.status, "active")
                )
            )
            .limit(1)

        if (client) return { role: "client", client }
    }

    const reason = isAdminRoute ? "Client cannot access admin routes" :
        isClientRoute ? "Admin cannot access client routes" :
            "No matching account found"

    return { error: apiError("Forbidden", reason, 403) }
}