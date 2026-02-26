import { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api/version"
import { productService } from "@/server/services"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await productService.getBySlug(slug)

  if (!data || !data.isVisible) return apiError("Not found", "Product not found", 404)

  return apiResponse(data)
}