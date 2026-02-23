import InvoicesPage, { InvoicesPageSkeleton } from "@/components/portal/invoices/InvoicesPage"
import { Suspense } from "react"

export default function Page() {
    return (
        <Suspense fallback={<InvoicesPageSkeleton />}>
            <InvoicesPage />
        </Suspense>
    )
}