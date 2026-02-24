
export type MeetingStatus = "scheduled" | "completed" | "cancelled" | "pending" | "rescheduled"

export type MeetingType = "video" | "call" | "in_person"

export type Attendee = {
    name: string
    initials: string
    role: string
}

export type Meeting = {
    id: string
    title: string
    project: string
    date: string          // "Feb 25, 2026"
    dateISO: string       // "2026-02-25" for calendar
    time: string          // "10:00 AM"
    duration: number      // minutes
    status: MeetingStatus
    host: Attendee
    type: MeetingType
    attendees: Attendee[]
    joinUrl?: string
    location?: string
    agenda?: string
    notes?: string
    cancelReason?: string
}
