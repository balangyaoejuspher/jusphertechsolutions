import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardNewProject from "@/components/dashboard/projects/dashboard-new-project"

export default async function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardNewProject />
        </Suspense>
    )
}