import { NextResponse } from "next/server"
import { ZodError } from "zod"

export type ApiSuccess<T> = {
    success: true
    data: T
}

export type ApiError = {
    success: false
    error: string
    details?: Record<string, string[]>
}

export type PaginatedData<T> = {
    items: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

export function ok<T>(data: T, status = 200) {
    return NextResponse.json<ApiSuccess<T>>(
        { success: true, data },
        { status }
    )
}

export function created<T>(data: T) {
    return ok(data, 201)
}

export function noContent() {
    return new NextResponse(null, { status: 204 })
}

export function badRequest(error: string, details?: Record<string, string[]>) {
    return NextResponse.json<ApiError>(
        { success: false, error, details },
        { status: 400 }
    )
}

export function notFound(resource = "Resource") {
    return NextResponse.json<ApiError>(
        { success: false, error: `${resource} not found` },
        { status: 404 }
    )
}

export function conflict(error: string) {
    return NextResponse.json<ApiError>(
        { success: false, error },
        { status: 409 }
    )
}

export function unauthorized() {
    return NextResponse.json<ApiError>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
    )
}

export function forbidden() {
    return NextResponse.json<ApiError>(
        { success: false, error: "Forbidden" },
        { status: 403 }
    )
}

export function serverError(error: unknown) {
    console.error("[API Error]", error)
    return NextResponse.json<ApiError>(
        { success: false, error: "Internal server error" },
        { status: 500 }
    )
}

export function fromZodError(err: ZodError) {
    const details: Record<string, string[]> = {}
    for (const issue of err.issues) {
        const key = issue.path.join(".") || "_"
        details[key] = [...(details[key] ?? []), issue.message]
    }
    return badRequest("Validation failed", details)
}

import { z } from "zod"

export async function parseBody<T extends z.ZodTypeAny>(
    req: Request,
    schema: T
): Promise<{ data: z.infer<T>; error: null } | { data: null; error: NextResponse }> {
    try {
        const json = await req.json()
        const data = schema.parse(json)
        return { data, error: null }
    } catch (err) {
        if (err instanceof z.ZodError) return { data: null, error: fromZodError(err) }
        return { data: null, error: badRequest("Invalid JSON body") }
    }
}

export function parseQuery<T extends z.ZodTypeAny>(
    url: string,
    schema: T
): { data: z.infer<T>; error: null } | { data: null; error: NextResponse } {
    try {
        const params = Object.fromEntries(new URL(url).searchParams)
        const data = schema.parse(params)
        return { data, error: null }
    } catch (err) {
        if (err instanceof z.ZodError) return { data: null, error: fromZodError(err) }
        return { data: null, error: badRequest("Invalid query parameters") }
    }
}

export function paginate<T>(
    items: T[],
    total: number,
    page: number,
    limit: number
): PaginatedData<T> {
    const totalPages = Math.ceil(total / limit)
    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    }
}