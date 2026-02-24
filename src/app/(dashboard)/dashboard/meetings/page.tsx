import { Suspense } from "react"
import DashboardMeetings, { DashboardMeetingsSkeleton } from "@/components/dashboard/meetings/dashboard-meetings"

export default async function Page() {
    return (
        <Suspense fallback={<DashboardMeetingsSkeleton />}>
            <DashboardMeetings />
        </Suspense>
    )
}