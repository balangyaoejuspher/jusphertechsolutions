import { Suspense } from "react"
import DashboardInvoices, { DashboardInvoicesSkeleton } from "@/components/dashboard/invoices/dashboard-invoices"

export default async function Page() {
    return (
        <Suspense fallback={<DashboardInvoicesSkeleton />}>
            <DashboardInvoices />
        </Suspense>
    )
}