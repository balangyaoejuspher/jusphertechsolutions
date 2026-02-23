import { getAdminSession } from "@/lib/admin-auth"
import { getClientSession } from "@/lib/client-auth"
import { redirect } from "next/navigation"

export default async function AuthRedirectPage() {
    const admin = await getAdminSession()
    if (admin) redirect("/dashboard")

    const client = await getClientSession()
    if (client) redirect("/portal")

    redirect("/unauthorized")
}