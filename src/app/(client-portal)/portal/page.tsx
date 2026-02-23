import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import PortalPage from "@/components/portal/PortalPage"

export default function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <PortalPage />
        </Suspense>
    )
}