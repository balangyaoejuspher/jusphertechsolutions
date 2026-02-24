import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardServices from "@/components/dashboard/services/dashboard-services"

export default async function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardServices />
        </Suspense>
    )
}