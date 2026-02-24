import InvoicesList, { InvoicesSkeleton } from "@/components/portal/invoices/invoices-list"
import { Suspense } from "react"

export default function Page() {
    return (
        <Suspense fallback={<InvoicesSkeleton />}>
            <InvoicesList />
        </Suspense>
    )
}