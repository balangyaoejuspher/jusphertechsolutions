import { auth } from "@clerk/nextjs/server"
import { getAdminSession } from "@/lib/admin-auth"
import { getClientSession } from "@/lib/client-auth"
import { NextResponse } from "next/server"

export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ role: null })

    const admin = await getAdminSession()
    if (admin) return NextResponse.json({ role: "admin" })

    const client = await getClientSession()
    if (client) return NextResponse.json({ role: "client" })

    return NextResponse.json({ role: null })
}