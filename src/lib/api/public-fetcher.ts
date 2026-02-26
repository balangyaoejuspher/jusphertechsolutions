const BASE = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

const PUBLIC_BASE = `${BASE}/api/v1/public`

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(PUBLIC_BASE + path)
    if (params) {
        Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v))
    }

    const res = await fetch(url.toString(), { cache: "no-store" })

    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? `Request failed: ${res.status}`)
    }

    const json = await res.json()
    return (json?.data !== undefined ? json.data : json) as T
}

async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(PUBLIC_BASE + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? `Request failed: ${res.status}`)
    }

    const json = await res.json()
    return (json?.data !== undefined ? json.data : json) as T
}

export const publicFetch = { get, post }