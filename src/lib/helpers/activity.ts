import { db } from "@/server/db/client"
import { activityLogs } from "@/server/db/schema"
import type { NewActivityLog } from "@/server/db/schema"

export async function logActivity(entry: Omit<NewActivityLog, "id" | "createdAt">) {
    await db.insert(activityLogs).values(entry)
}