import { requireActiveClient } from "@/lib/client-auth"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/portal/settings/settings-form"

export default async function Page() {
    const client = await requireActiveClient()
    if (!client) redirect("/unauthorized")
    return <SettingsForm client={client} />
}