import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardBlog from "@/components/dashboard/blogs/dashboard-blog"

export default function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardBlog />
        </Suspense>
    )
}