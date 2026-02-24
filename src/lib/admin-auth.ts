import { auth } from "@clerk/nextjs/server"
import { db } from "@/server/db/client"
import { admins } from "@/server/db/schema"
import { eq } from "drizzle-orm"

export type AdminRole = "super_admin" | "admin" | "editor"

export async function getAdminSession() {
    const { userId } = await auth()
    if (!userId) return null

    const result = await db
        .select()
        .from(admins)
        .where(eq(admins.clerkUserId, userId))
        .limit(1)

    if (!result[0]) return null

    return {
        ...result[0],
        company: "Juspher & Co. Tech Solutions",
    }
}

export async function requireAdmin(allowedRoles?: AdminRole[]) {
    const admin = await getAdminSession()

    if (!admin) return null

    if (allowedRoles && !allowedRoles.includes(admin.role as AdminRole)) {
        return null
    }

    return admin
}