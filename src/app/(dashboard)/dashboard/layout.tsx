import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in")
    }

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <main className="flex-1 bg-zinc-50 overflow-auto">
                {children}
            </main>
        </div>
    )
}