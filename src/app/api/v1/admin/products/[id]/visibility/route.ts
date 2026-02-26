import { NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { productService } from "@/server/services"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyApiRequest(req, "admin")
  if (isVerifyError(auth)) return auth.error
  if (!isVerifyAdmin(auth)) return apiError("Forbidden", "Admin access required", 403)

  const { id } = await params
  const data = await productService.toggleVisibility(id, auth.admin.id, auth.admin.name)
  return apiResponse(data)
}