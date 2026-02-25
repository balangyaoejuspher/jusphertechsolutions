import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardPlacements from "@/components/dashboard/placements/dashboard-placements"

export default async function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardPlacements />
        </Suspense>
    )
}