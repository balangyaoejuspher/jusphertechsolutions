import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import JoinTeam from "@/components/forms/join-team"

export default async function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <JoinTeam />
        </Suspense>
    )
}