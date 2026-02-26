// src/app/api/v1/admin/products/[id]/route.ts

import { NextRequest } from "next/server"
import { isVerifyAdmin, isVerifyError, verifyApiRequest } from "@/lib/api/verify-request"
import { apiResponse, apiError } from "@/lib/api/version"
import { productService } from "@/server/services"

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await verifyApiRequest(req, "admin")
    if (isVerifyError(auth)) return auth.error
    if (!isVerifyAdmin(auth)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params
    const data = await productService.getById(id)
    if (!data) return apiError("Not found", "Product not found", 404)

    return apiResponse(data)
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const auth = await verifyApiRequest(req, "admin")
    if (isVerifyError(auth)) return auth.error
    if (!isVerifyAdmin(auth)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params
    const body = await req.json()
    const data = await productService.update(id, body, auth.admin.id, auth.admin.name)
    return apiResponse(data)
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await verifyApiRequest(req, "admin")
    if (isVerifyError(auth)) return auth.error
    if (!isVerifyAdmin(auth)) return apiError("Forbidden", "Admin access required", 403)

    const { id } = await params
    await productService.delete(id, auth.admin.id, auth.admin.name)
    return apiResponse({ success: true })
}