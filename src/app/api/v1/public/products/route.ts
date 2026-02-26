import { NextRequest } from "next/server"
import { apiResponse } from "@/lib/api/version"
import { productService } from "@/server/services"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const data = await productService.getAll({
    search:   searchParams.get("search")    ?? undefined,
    category: (searchParams.get("category") ?? "all") as any,
    visible:  true,
  })

  return apiResponse(data)
}