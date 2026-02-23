export type Talent = {
    id: string
    name: string
    role:
    | "developer"
    | "va"
    | "project_manager"
    | "designer"
    | "ui_ux"
    | "data_analyst"
    | "content_writer"
    | "marketing"
    | "customer_support"
    | "accountant"
    | "video_editor"
    | "seo_specialist"
    | "qa"
    | "devops"
    title: string
    rate: number
    skills: string[]
    status: "available" | "busy" | "resigned" | "unavailable"
    rating: number
    projects: number
    bio: string
    gradient: string
    companyId?: number
    companyName?: string
    isResigned?: boolean
}