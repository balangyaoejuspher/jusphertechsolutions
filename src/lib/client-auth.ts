import { auth } from "@clerk/nextjs/server"
import { db } from "@/server/db/client"
import { clients } from "@/server/db/schema"
import { eq } from "drizzle-orm"


export async function getClientSession() {
    const { userId } = await auth()
    if (!userId) return null

    const result = await db
        .select()
        .from(clients)
        .where(eq(clients.clerkUserId, userId))
        .limit(1)

    return result[0] ?? null
}

export async function requireActiveClient() {
    const client = await getClientSession()

    if (!client) return null

    if (client.status !== "active") return null

    return client
}