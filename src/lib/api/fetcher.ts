
const API_BASE = "/api/v1"

export async function portalFetch<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        credentials: "include",
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
        throw new Error(json.reason ?? json.error ?? "Request failed")
    }

    return json.data as T
}