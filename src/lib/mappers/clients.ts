import type { ClientRow } from "@/server/db/schema"
import type { Client } from "@/types"

export function toClient(row: ClientRow): Client {
    return {
        id: row.id,
        type: row.type,
        name: row.name,
        email: row.email,
        phone: row.phone ?? undefined,
        website: row.website ?? undefined,
        location: row.location ?? undefined,
        company: row.company ?? undefined,
        position: row.position ?? undefined,
        status: row.status,
        services: row.services ?? [],
        notes: row.notes ?? undefined,
        joinedDate: row.joinedDate.toISOString(),
    }
}