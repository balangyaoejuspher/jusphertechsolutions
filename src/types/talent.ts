import type { TalentRow } from "@/server/db/schema"
export type Talent = TalentRow
export type TalentStatus = Talent["status"]
export type TalentFormState = {
    name: string
    email: string
    password?: string
    title: string
    role: Talent["role"]
    hourlyRate: string
    skills: string
    status: TalentStatus
    rating: string
    projectsCompleted: number
    bio: string
    gradient: string
}