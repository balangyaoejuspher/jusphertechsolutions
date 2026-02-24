import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardSettings from "@/components/dashboard/settings/dashboard-settings"

export default async function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardSettings />
        </Suspense>
    )
}