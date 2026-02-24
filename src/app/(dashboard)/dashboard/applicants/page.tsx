import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardApplicants from "@/components/dashboard/applicants//dashboard-applicants"

export default async function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardApplicants />
        </Suspense>
    )
}