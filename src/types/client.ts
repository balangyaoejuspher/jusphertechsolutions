export type ClientType = "company" | "individual"
export type ClientStatus = "active" | "inactive" | "prospect"

export type Client = {
    id: string
    type: ClientType
    name: string
    email: string
    phone?: string
    website?: string
    location?: string
    company?: string
    position?: string
    status: ClientStatus
    services: string[]
    notes?: string
    joinedDate: string
}