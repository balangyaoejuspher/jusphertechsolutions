import { statsService } from "@/server/services/stats.service"
import { apiResponse } from "@/lib/api/version"

export const dynamic = "force-dynamic"

export async function GET() {
    const stats = await statsService.getPublicStats()
    return apiResponse(stats)
}