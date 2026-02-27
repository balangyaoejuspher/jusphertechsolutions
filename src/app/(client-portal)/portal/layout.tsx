import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { ClientPortalSidebar } from "@/components/layout/client-portal-sidebar"
import { getClientSession } from "@/lib/client-auth"

export default async function ClientPortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()

    if (!userId) redirect("/sign-in")

    const client = await getClientSession()

    if (!client) redirect("/dashboard")

    return (
        <div className="flex min-h-screen">
            <ClientPortalSidebar client={client} />
            <main className="flex-1 overflow-auto">
                <div className="lg:hidden h-14" />
                {children}
            </main>
        </div>
    )
}