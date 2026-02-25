import { NextRequest } from "next/server"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { inquiryService } from "@/server/services"


export async function GET(req: NextRequest) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admin access required", 403)

    const { searchParams } = new URL(req.url)

    const data = await inquiryService.getAll({
        search: searchParams.get("search") ?? undefined,
        status: (searchParams.get("status") ?? "all") as any,
        priority: (searchParams.get("priority") ?? "all") as any,
        source: (searchParams.get("source") ?? "all") as any,
    })

    return apiResponse(data)
}

export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.name || !body.email || !body.message) {
        return apiError("Bad Request", "name, email and message are required", 400)
    }

    try {
        const created = await inquiryService.create({
            name: body.name,
            email: body.email,
            phone: body.phone ?? null,
            company: body.company ?? null,
            message: body.message,
            priority: body.priority ?? "medium",
            source: body.source ?? "contact_form",
            budget: body.budget ?? null,
            talentId: body.talentId ?? null,
            serviceId: body.serviceId ?? null,
            assignedTo: null,
            notes: null,
        })

        return apiResponse(created, 201)
    } catch (err: any) {
        throw err
    }
}