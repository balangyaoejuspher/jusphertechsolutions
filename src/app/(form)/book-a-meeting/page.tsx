import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import BookMeetingPage from "@/components/forms/BookMeetingPage"

export default function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <BookMeetingPage />
        </Suspense>
    )
}