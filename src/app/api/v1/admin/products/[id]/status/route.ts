import { NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { productService } from "@/server/services"
import type { Product } from "@/server/db/schema"

const VALID_STATUSES: Product["status"][] = [
  "available", "coming_soon", "beta", "deprecated", "maintenance",
]

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyApiRequest(req, "admin")
  if (isVerifyError(auth)) return auth.error
  if (!isVerifyAdmin(auth)) return apiError("Forbidden", "Admin access required", 403)

  const { id } = await params
  const { status } = await req.json()

  if (!status || !VALID_STATUSES.includes(status)) {
    return apiError("Validation error", `status must be one of: ${VALID_STATUSES.join(", ")}`, 400)
  }

  const data = await productService.updateStatus(id, status, auth.admin.id, auth.admin.name)
  return apiResponse(data)
}