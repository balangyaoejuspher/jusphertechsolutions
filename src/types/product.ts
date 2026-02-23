import { LucideIcon } from "lucide-react"

export type ProductFeature = {
    title: string
    description: string
}

export type ProductPricing = {
    label: string
    price: string
    note?: string
    highlight?: boolean
    features: string[]
}

export type Product = {
    slug: string
    label: string
    tagline: string
    description: string
    icon: LucideIcon
    accentColor: string
    bgColor: string
    borderColor: string
    textColor: string
    category: string
    features: ProductFeature[]
    pricing: ProductPricing[]
    useCases: string[]
    techHighlights: string[]
}