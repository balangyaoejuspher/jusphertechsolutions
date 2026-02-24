import { Suspense } from "react"
import MeetingsList, { MeetingsPageSkeleton } from "@/components/portal/meetings/meeting-list"
import { requireActiveClient } from "@/lib/client-auth"
import { redirect } from "next/dist/client/components/navigation"

export default async function Page() {
    const client = await requireActiveClient()
    if (!client) redirect("/unauthorized")
    return (
        <Suspense fallback={<MeetingsPageSkeleton />}>
            <MeetingsList />
        </Suspense>
    )
}