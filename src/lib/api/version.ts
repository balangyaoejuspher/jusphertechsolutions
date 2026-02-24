export const API_VERSION = "v1" as const
export type ApiVersion = "v1"

export function apiResponse<T>(
    data: T,
    status: number = 200,
) {
    return Response.json(
        {
            version: API_VERSION,
            success: status < 400,
            data,
        },
        { status }
    )
}

export function apiError(
    error: string,
    reason?: string,
    status: number = 400,
) {
    return Response.json(
        {
            version: API_VERSION,
            success: false,
            error,
            reason,
        },
        { status }
    )
}