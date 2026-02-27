import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { generateDailyToken } from "@/lib/api/jwt"
import { admins } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/server/db/client"

export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.redirect(new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL!))
    }

    let destination = "/portal"

    const admin = await db.query.admins.findFirst({
        where: eq(admins.clerkUserId, userId),
    })

    if (admin) destination = "/dashboard"
    const token = await generateDailyToken()

    const res = NextResponse.redirect(new URL(destination, process.env.NEXT_PUBLIC_APP_URL!))

    res.cookies.set("api_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
    })

    return res
}