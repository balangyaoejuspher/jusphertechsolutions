import { NextRequest } from "next/server"
import { apiResponse } from "@/lib/api/version"
import { serviceService } from "@/server/services"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const data = await serviceService.getAll({
        search: searchParams.get("search") ?? undefined,
        visible: true,
        limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
        offset: searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined,
    })

    return apiResponse(data)
}