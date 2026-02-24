import { SupportList, SupportPageSkeleton } from "@/components/portal/support/support-list"
import { Suspense } from "react"

export default async function Page() {
    return (
        <Suspense fallback={<SupportPageSkeleton />}>
            <SupportList />
        </Suspense>
    )
}