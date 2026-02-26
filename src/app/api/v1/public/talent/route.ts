import { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api/version"
import { talentService } from "@/server/services"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const data = await talentService.getAll({
        search: searchParams.get("search") ?? undefined,
        status: (searchParams.get("status") ?? "all") as any,
        role: (searchParams.get("role") ?? "all") as any,
        visible: true,
    })

    return apiResponse(data)
}