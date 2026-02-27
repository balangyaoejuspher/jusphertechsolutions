import type { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { getAdminSession } from "@/lib/admin-auth"
import { NotificationBell } from "@/components/shared/notification-bell"

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
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-14 shrink-0 border-b border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-950 flex items-center justify-end px-6 h-16 gap-3">
                    <NotificationBell />
                </header>
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}