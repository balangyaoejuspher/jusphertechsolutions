import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardClients from "@/components/dashboard/clients/dashboard-clients"

export default async function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardClients />
        </Suspense>
    )
}