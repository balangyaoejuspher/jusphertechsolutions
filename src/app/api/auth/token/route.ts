import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { generateDailyToken, verifyDailyToken } from "@/lib/api/jwt"

export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = req.headers.get("cookie")
        ?.split(";")
        .find((c) => c.trim().startsWith("api_token="))
        ?.split("=")[1]

    if (existing) {
        const check = await verifyDailyToken(existing)
        if (check.valid) {
            return NextResponse.json({ success: true, reused: true })
        }
    }

    const token = await generateDailyToken()

    const res = NextResponse.json({ success: true, reused: false })

    res.cookies.set("api_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
    })

    return res
}

export async function DELETE() {
    const res = NextResponse.json({ success: true })
    res.cookies.delete("api_token")
    return res
}