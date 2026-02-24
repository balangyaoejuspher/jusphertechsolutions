import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import PortalOverview from "@/components/portal/portal-overview"
import { redirect } from "next/dist/client/components/navigation"
import { requireActiveClient } from "@/lib/client-auth"

export default async function Page() {
    const client = await requireActiveClient()
    if (!client) redirect("/unauthorized")
    return (
        <Suspense fallback={<PageSkeleton />}>
            <PortalOverview />
        </Suspense>
    )
}