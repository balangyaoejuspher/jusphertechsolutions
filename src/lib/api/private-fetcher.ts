import { initToken } from "@/components/shared/token-manager"

const BASE = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

const PORTAL_BASE = `${BASE}/api/v1`

async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    isRetry = false,
): Promise<T> {
    const res = await fetch(PORTAL_BASE + path, {
        method,
        credentials: "include",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    })

    if ((res.status === 401 || res.status === 403) && !isRetry) {
        console.warn(`[portalFetch] ${res.status} on ${path}, refreshing token...`)
        await initToken()
        return request<T>(method, path, body, true)
    }

    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? data?.message ?? `Request failed: ${res.status}`)
    }

    const json = await res.json()
    return (json?.data !== undefined ? json.data : json) as T
}

export const portalFetch = {
    get: <T>(path: string) => request<T>("GET", path),
    post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
    patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
    put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
    delete: <T>(path: string) => request<T>("DELETE", path),
}