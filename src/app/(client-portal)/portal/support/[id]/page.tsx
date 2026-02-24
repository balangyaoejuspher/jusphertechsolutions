import { TicketDetail } from "@/components/portal/support/ticket-detail"
import { requireActiveClient } from "@/lib/client-auth"
import { redirect } from "next/dist/client/components/navigation"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const client = await requireActiveClient()
    if (!client) redirect("/unauthorized")
    const { id } = await params
    return <TicketDetail id={id} />
}