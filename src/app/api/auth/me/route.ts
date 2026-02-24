import { auth } from "@clerk/nextjs/server"
import { getAdminSession } from "@/lib/admin-auth"
import { getClientSession } from "@/lib/client-auth"
import { NextResponse } from "next/server"

export async function GET() {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ loggedIn: false, data: null })
    }

    const admin = await getAdminSession()
    if (admin) {
        return NextResponse.json({ loggedIn: true, data: admin })
    }

    const client = await getClientSession()
    if (client) {
        return NextResponse.json({ loggedIn: true, data: client })
    }

    return NextResponse.json({ loggedIn: false, data: null })
}