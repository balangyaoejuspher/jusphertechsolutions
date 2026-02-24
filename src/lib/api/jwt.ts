import { SignJWT, jwtVerify } from "jose"

const API_KEY = process.env.API_KEY!
const API_SECRET = new TextEncoder().encode(process.env.API_SECRET!)

export async function generateDailyToken() {
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD UTC

    return new SignJWT({
        apiKey: API_KEY,
        date: today,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(API_SECRET)
}

export type VerifyResult =
    | { valid: true }
    | { valid: false; reason: string }

export async function verifyDailyToken(token: string): Promise<VerifyResult> {
    try {
        const { payload } = await jwtVerify(token, API_SECRET, {
            algorithms: ["HS256"],
        })

        if (payload.apiKey !== API_KEY) {
            return { valid: false, reason: "Invalid API key" }
        }

        const today = new Date().toISOString().split("T")[0]
        const tokenDate = payload.date as string

        if (!tokenDate) {
            return { valid: false, reason: "Missing date in token" }
        }

        if (tokenDate !== today) {
            const isPast = tokenDate < today
            const isFuture = tokenDate > today
            if (isPast) return { valid: false, reason: "Token date is in the past" }
            if (isFuture) return { valid: false, reason: "Token date is in the future" }
        }

        return { valid: true }

    } catch (err: any) {
        if (err?.code === "ERR_JWT_EXPIRED") {
            return { valid: false, reason: "Token has expired" }
        }
        return { valid: false, reason: "Invalid token" }
    }
}