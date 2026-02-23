import { Suspense } from "react"
import MeetingsPage, { MeetingsPageSkeleton } from "@/components/portal/meetings/MeetingsPage"

export default function Page() {
    return (
        <Suspense fallback={<MeetingsPageSkeleton />}>
            <MeetingsPage />
        </Suspense>
    )
}