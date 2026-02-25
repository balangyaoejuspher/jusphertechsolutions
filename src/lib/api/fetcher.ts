const API_BASE = "/api/v1"

async function baseFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`

    const res = await fetch(url, {
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

export const portalFetch = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        baseFetch<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        baseFetch<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        baseFetch<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }),

    patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        baseFetch<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: JSON.stringify(body),
        }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
        baseFetch<T>(endpoint, { ...options, method: "DELETE" }),
}