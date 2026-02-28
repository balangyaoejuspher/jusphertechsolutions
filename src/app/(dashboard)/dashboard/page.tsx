import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardOverviewClient } from "@/components/dashboard/dashboard-overview"
import { DashboardStats } from "@/types/dashboard"

export default async function Page() {
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")

    const user = await currentUser()

    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardOverviewClient
                firstName={user?.firstName ?? null}
            />
        </Suspense>
    )
}