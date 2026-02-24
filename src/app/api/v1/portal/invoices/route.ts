
import { NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiError, apiResponse } from "@/lib/api/version"
import { db } from "@/server/db/client"
import { invoices } from "@/server/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {
    const result = await verifyApiRequest(req, "client")
    if (isVerifyError(result)) return result.error
    if (isVerifyAdmin(result)) return apiError("Forbidden", "Admins cannot access client routes", 403)

    const data = await db
        .select()
        .from(invoices)
        .where(eq(invoices.clientId, result.client.id))

    return apiResponse(data)
}