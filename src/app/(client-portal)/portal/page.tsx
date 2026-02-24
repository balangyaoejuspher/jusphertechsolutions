import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import PortalOverview from "@/components/portal/portal-overview"

export default function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <PortalOverview />
        </Suspense>
    )
}