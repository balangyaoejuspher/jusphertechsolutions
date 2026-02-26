import { Talent } from "@/types";

export const TALENT_AVATAR_GRADIENTS = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-pink-500",
    "from-indigo-500 to-blue-600",
    "from-fuchsia-500 to-purple-500",
    "from-sky-500 to-blue-500",
] as const


export const FEATURED_TALENT_IDS: string[] = [
]

export const ROLE_DISPLAY: Record<string, { label: string; color: string; emoji: string }> = {
    developer: { label: "Developer", color: "blue", emoji: "💻" },
    va: { label: "Virtual Assistant", color: "violet", emoji: "🗂️" },
    project_manager: { label: "Project Manager", color: "amber", emoji: "📋" },
    designer: { label: "Designer", color: "pink", emoji: "🎨" },
    ui_ux: { label: "UI/UX Designer", color: "purple", emoji: "🖼️" },
    data_analyst: { label: "Data Analyst", color: "cyan", emoji: "📊" },
    content_writer: { label: "Content Writer", color: "emerald", emoji: "✍️" },
    marketing: { label: "Marketing", color: "orange", emoji: "📣" },
    customer_support: { label: "Customer Support", color: "green", emoji: "🎧" },
    accountant: { label: "Accountant", color: "teal", emoji: "🧾" },
    video_editor: { label: "Video Editor", color: "red", emoji: "🎬" },
    seo_specialist: { label: "SEO Specialist", color: "lime", emoji: "🔍" },
}

export const PLACEHOLDER_TALENT: Partial<Talent>[] = [
    {
        id: "placeholder-1",
        name: "Alex Rivera",
        title: "Senior Full-Stack Developer",
        role: "developer",
        status: "available",
        gradient: "from-blue-500 to-cyan-500",
        skills: ["React", "Next.js", "Node.js", "PostgreSQL"],
        hourlyRate: "85.00",
        rating: "4.9",
        projectsCompleted: 47,
        isVisible: true,
        bio: "Full-stack specialist with 6+ years building scalable web applications.",
    },
    {
        id: "placeholder-2",
        name: "Maya Chen",
        title: "UI/UX Designer",
        role: "ui_ux",
        status: "available",
        gradient: "from-fuchsia-500 to-purple-500",
        skills: ["Figma", "Tailwind CSS", "Framer", "Prototyping"],
        hourlyRate: "70.00",
        rating: "4.8",
        projectsCompleted: 31,
        isVisible: true,
        bio: "Product designer focused on clean, conversion-driven interfaces.",
    },
    {
        id: "placeholder-3",
        name: "Jordan Kim",
        title: "Virtual Assistant",
        role: "va",
        status: "available",
        gradient: "from-emerald-500 to-teal-500",
        skills: ["Calendar Management", "Email", "Research", "CRM"],
        hourlyRate: "35.00",
        rating: "4.9",
        projectsCompleted: 89,
        isVisible: true,
        bio: "Executive VA helping founders reclaim their time for 5+ years.",
    },
    {
        id: "placeholder-4",
        name: "Sam Torres",
        title: "Digital Marketing Specialist",
        role: "marketing",
        status: "busy",
        gradient: "from-amber-500 to-orange-500",
        skills: ["Facebook Ads", "Google Ads", "SEO", "Analytics"],
        hourlyRate: "65.00",
        rating: "4.7",
        projectsCompleted: 28,
        isVisible: true,
        bio: "Performance marketer with proven ROAS across e-commerce and SaaS.",
    },
    {
        id: "placeholder-5",
        name: "Priya Nair",
        title: "Project Manager",
        role: "project_manager",
        status: "available",
        gradient: "from-violet-500 to-purple-600",
        skills: ["Agile", "Jira", "Scrum", "Stakeholder Management"],
        hourlyRate: "75.00",
        rating: "4.8",
        projectsCompleted: 52,
        isVisible: true,
        bio: "PMP-certified PM delivering complex software projects on time.",
    },
    {
        id: "placeholder-6",
        name: "Leo Santos",
        title: "Data Analyst",
        role: "data_analyst",
        status: "available",
        gradient: "from-sky-500 to-blue-500",
        skills: ["Python", "Tableau", "SQL", "Power BI"],
        hourlyRate: "80.00",
        rating: "4.9",
        projectsCompleted: 19,
        isVisible: true,
        bio: "Turning raw data into clear business decisions since 2018.",
    },
]

export const TALENT_STATUSES = [
    { value: "all", label: "Any Status" },
    { value: "available", label: "Available" },
    { value: "busy", label: "Busy" },
] as const

export const STATUS_DISPLAY: Record<string, { label: string; dot: string }> = {
    available: { label: "Available", dot: "bg-green-500" },
    busy: { label: "Busy", dot: "bg-yellow-500" },
    unavailable: { label: "Unavailable", dot: "bg-zinc-400" },
}

export type TalentSortOption = "rating" | "rate_asc" | "rate_desc"

export const TALENT_SORT_OPTIONS: { value: TalentSortOption; label: string }[] = [
    { value: "rating", label: "Top Rated" },
    { value: "rate_asc", label: "Rate: Low → High" },
    { value: "rate_desc", label: "Rate: High → Low" },
]

export const TEAM_SCALES = [
    { value: "solo", label: "Solo", range: "1 person", desc: "One focused specialist", emoji: "🎯", min: 1, max: 1 },
    { value: "small", label: "Small", range: "2–4 people", desc: "Tight, agile team", emoji: "⚡", min: 2, max: 4 },
    { value: "medium", label: "Medium", range: "5–10 people", desc: "Cross-functional squad", emoji: "🚀", min: 5, max: 10 },
    { value: "large", label: "Large", range: "11–25 people", desc: "Full department", emoji: "🏢", min: 11, max: 25 },
    { value: "enterprise", label: "Enterprise", range: "25+ people", desc: "Organization-scale", emoji: "🌐", min: 25, max: 50 },
] as const

export const PROJECT_TYPE_VALUES = [
    { value: "web-app", label: "Web Application", color: "blue" },
    { value: "mobile-app", label: "Mobile App", color: "violet" },
    { value: "ecommerce", label: "E-Commerce", color: "emerald" },
    { value: "saas", label: "SaaS Platform", color: "sky" },
    { value: "blockchain", label: "Blockchain / Web3", color: "amber" },
    { value: "ai", label: "AI / Automation", color: "rose" },
    { value: "enterprise", label: "Enterprise System", color: "zinc" },
    { value: "edu", label: "Education Platform", color: "violet" },
    { value: "custom", label: "Custom / Other", color: "zinc" },
] as const

// ── Color variants for project type badges ────────────────────

export const PROJECT_TYPE_COLOR_VARIANTS: Record<string, string> = {
    blue: "bg-blue-50   dark:bg-blue-500/10   border-blue-200   dark:border-blue-500/20   text-blue-600   dark:text-blue-400",
    violet: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    sky: "bg-sky-50    dark:bg-sky-500/10    border-sky-200    dark:border-sky-500/20    text-sky-600    dark:text-sky-400",
    amber: "bg-amber-50  dark:bg-amber-500/10  border-amber-200  dark:border-amber-500/20  text-amber-600  dark:text-amber-400",
    rose: "bg-rose-50   dark:bg-rose-500/10   border-rose-200   dark:border-rose-500/20   text-rose-600   dark:text-rose-400",
    zinc: "bg-zinc-100  dark:bg-zinc-800      border-zinc-200   dark:border-white/10      text-zinc-600   dark:text-zinc-400",
}

export const STACK_GROUPS = [
    { group: "Frontend", items: ["React", "Next.js", "Vue", "Angular", "Svelte", "Tailwind CSS"] },
    { group: "Mobile", items: ["React Native", "Flutter", "Swift", "Kotlin", "Expo"] },
    { group: "Backend", items: ["Node.js", "Python", "Go", "Laravel", "Django", "FastAPI"] },
    { group: "Database", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase", "Firebase"] },
    { group: "Cloud/DevOps", items: ["AWS", "Docker", "Kubernetes", "Vercel", "GCP", "CI/CD"] },
    { group: "Web3", items: ["Solidity", "Ethereum", "Hardhat", "IPFS", "Web3.js", "OpenZeppelin"] },
] as const

export const PROJECT_SUGGESTIONS: Record<string, { roles: string[]; stack: string[] }> = {
    "web-app": { roles: ["developer", "ui_ux", "project_manager"], stack: ["React", "Next.js", "Node.js", "PostgreSQL", "Vercel"] },
    "mobile-app": { roles: ["developer", "ui_ux"], stack: ["React Native", "Flutter", "Firebase", "Expo"] },
    "ecommerce": { roles: ["developer", "marketing", "va", "customer_support"], stack: ["Next.js", "Shopify", "PostgreSQL", "Vercel"] },
    "saas": { roles: ["developer", "ui_ux", "project_manager", "data_analyst"], stack: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"] },
    "blockchain": { roles: ["developer"], stack: ["Solidity", "Ethereum", "Hardhat", "Web3.js", "IPFS", "OpenZeppelin"] },
    "ai": { roles: ["developer", "data_analyst"], stack: ["Python", "FastAPI", "PostgreSQL", "AWS", "Docker"] },
    "enterprise": { roles: ["developer", "project_manager", "data_analyst"], stack: ["Node.js", "PostgreSQL", "Docker", "Kubernetes", "AWS", "CI/CD"] },
    "edu": { roles: ["developer", "ui_ux", "va"], stack: ["React", "Next.js", "PostgreSQL", "Supabase"] },
    "custom": { roles: [], stack: [] },
}

export const TALENT_MODE_CONFIG = {
    browse: { label: "Browse Talent", desc: "I know what I need" },
    guided: { label: "Help Me Choose", desc: "Not sure where to start" },
    team: { label: "Build a Team", desc: "I need multiple people" },
} as const

export type TalentMode = keyof typeof TALENT_MODE_CONFIG

export const GUIDED_QUESTIONS = [
    {
        id: "goal",
        question: "What's your main goal right now?",
        options: [
            { value: "build", label: "Build a product or app", icon: "💻", roles: ["developer"] },
            { value: "grow", label: "Grow my business online", icon: "📈", roles: ["marketing", "designer", "va"] },
            { value: "scale", label: "Scale my operations", icon: "⚙️", roles: ["va", "customer_support", "data_analyst"] },
            { value: "secure", label: "Protect or innovate with tech", icon: "🔐", roles: ["developer"] },
        ],
    },
    {
        id: "timeline",
        question: "How soon do you need someone?",
        options: [
            { value: "asap", label: "ASAP — this week", icon: "🔥", roles: [] },
            { value: "soon", label: "Within 2 weeks", icon: "📅", roles: [] },
            { value: "planning", label: "Planning ahead (1 month+)", icon: "🗓️", roles: [] },
            { value: "exploring", label: "Just exploring options", icon: "👀", roles: [] },
        ],
    },
] as const