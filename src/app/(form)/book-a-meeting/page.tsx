import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import BookMeeting from "@/components/forms/book-meeting"

export default function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <BookMeeting />
        </Suspense>
    )
}