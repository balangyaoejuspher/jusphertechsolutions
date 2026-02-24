import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardOverview from "@/components/dashboard/dashboard-overview"

export default function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardOverview />
        </Suspense>
    )
}