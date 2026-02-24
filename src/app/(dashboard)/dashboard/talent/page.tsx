import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardTalent from "@/components/dashboard/talent/dashboard-talent"

export default function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardTalent />
        </Suspense>
    )
}