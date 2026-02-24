
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { generateDailyToken } from "@/lib/api/jwt"

export async function POST() {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = await generateDailyToken()

    const res = NextResponse.json({ success: true })

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