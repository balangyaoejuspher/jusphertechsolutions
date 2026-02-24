import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import DashboardProducts from "@/components/dashboard/products/dashboard-products"

export default async function Page() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardProducts />
        </Suspense>
    )
}