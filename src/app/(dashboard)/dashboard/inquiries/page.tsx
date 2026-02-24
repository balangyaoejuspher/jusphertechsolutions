import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardInquiries from "@/components/dashboard/inquiries/dashboard-inquiries"

export default async function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardInquiries />
        </Suspense>
    )
}