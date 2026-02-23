import { LucideIcon } from "lucide-react"

export type Service = {
    id: string
    icon: LucideIcon
    number: string
    title: string
    tagline: string
    description: string
    longDescription?: string
    features: string[]
    stack: string[]
    category: "Development" | "Outsourcing"
    featured?: boolean
    badge?: string
    active: boolean
    inquiries: number
}