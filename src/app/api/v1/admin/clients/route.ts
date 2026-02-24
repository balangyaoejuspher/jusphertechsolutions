import { NextRequest } from "next/server"
import { verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse } from "@/lib/api/version"
import { db } from "@/server/db/client"
import { clients } from "@/server/db/schema"

export async function GET(req: NextRequest) {
    const { admin, error } = await verifyApiRequest(req, "admin")
    if (error) return error

    const data = await db.select().from(clients)
    return apiResponse(data)
}

export async function POST(req: NextRequest) {
    const { admin, error } = await verifyApiRequest(req, "admin")
    if (error) return error

    const body = await req.json()
    return apiResponse({ created: true }, 201)
}