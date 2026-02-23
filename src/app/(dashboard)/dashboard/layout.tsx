import type { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { getAdminSession } from "@/lib/admin-auth"

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in")
    }

    const admin = await getAdminSession()

    if (!admin) {
        redirect("/unauthorized")
    }

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar admin={admin} />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}