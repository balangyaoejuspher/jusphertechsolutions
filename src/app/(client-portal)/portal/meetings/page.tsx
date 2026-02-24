import { Suspense } from "react"
import MeetingsList, { MeetingsPageSkeleton } from "@/components/portal/meetings/meeting-list"

export default function Page() {
    return (
        <Suspense fallback={<MeetingsPageSkeleton />}>
            <MeetingsList />
        </Suspense>
    )
}