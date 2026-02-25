import { NextRequest } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"

export async function POST(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { firstName, lastName, email, password } = await req.json()

    if (!email || !password) {
        return apiError("Bad Request", "email and password are required", 400)
    }

    try {
        const clerk = await clerkClient()

        const user = await clerk.users.createUser({
            firstName,
            lastName,
            emailAddress: [email],
            password,
        })

        return apiResponse({ userId: user.id }, 201)

    } catch (err: any) {
        console.error("Clerk error:", err)
        const message = err?.errors?.[0]?.message ?? err.message ?? "Failed to create user"
        return apiError("Clerk Error", message, 400)
    }
}