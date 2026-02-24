import {
    CheckCircle, Clock, AlertTriangle, CircleDot, FileText,
    CircleDot as CircleDotIcon, PauseCircle, AlertCircle,
    Shield,
    Bell,
    User,
    Briefcase,
    Code2,
    Star,
    Palette,
    Globe,
    Search,
    ClipboardList,
    Video,
    BarChart2,
    Calculator,
    Headphones,
    Megaphone,
    PenLine,
    PenTool,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ClientStatus, InvoiceStatus } from "@/types"

// ── Portal · Invoice ───────────────────────────────────────────────────

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { label: string; icon: LucideIcon; color: string; dot: string }> = {
    paid: { label: "Paid", icon: CheckCircle, color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", dot: "bg-emerald-500" },
    unpaid: { label: "Unpaid", icon: Clock, color: "bg-amber-50   dark:bg-amber-500/10   text-amber-600   dark:text-amber-400   border-amber-200   dark:border-amber-500/20", dot: "bg-amber-500" },
    overdue: { label: "Overdue", icon: AlertTriangle, color: "bg-red-50     dark:bg-red-500/10     text-red-600     dark:text-red-400     border-red-200     dark:border-red-500/20", dot: "bg-red-500" },
    partial: { label: "Partially Paid", icon: CircleDot, color: "bg-blue-50    dark:bg-blue-500/10    text-blue-600    dark:text-blue-400    border-blue-200    dark:border-blue-500/20", dot: "bg-blue-500" },
    draft: { label: "Draft", icon: FileText, color: "bg-zinc-100   dark:bg-zinc-800       text-zinc-500    dark:text-zinc-400    border-zinc-200    dark:border-white/10", dot: "bg-zinc-400" },
}

export const INVOICE_TABS = [
    { value: "all", label: "All" },
    { value: "unpaid", label: "Unpaid" },
    { value: "overdue", label: "Overdue" },
    { value: "partial", label: "Partial" },
    { value: "paid", label: "Paid" },
    { value: "draft", label: "Draft" },
]

// ── Portal · Projects ──────────────────────────────────────────────────

export const PROJECT_STATUS_CONFIG = {
    in_progress: { label: "In Progress", icon: CircleDotIcon, color: "bg-amber-50  dark:bg-amber-400/10  text-amber-600  dark:text-amber-400  border-amber-200  dark:border-amber-400/20" },
    review: { label: "In Review", icon: AlertCircle, color: "bg-blue-50   dark:bg-blue-400/10   text-blue-600   dark:text-blue-400   border-blue-200   dark:border-blue-400/20" },
    completed: { label: "Completed", icon: CheckCircle, color: "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20" },
    on_hold: { label: "On Hold", icon: PauseCircle, color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10" },
}

export const PROJECT_PRIORITY_CONFIG = {
    high: "text-red-500   dark:text-red-400   bg-red-50   dark:bg-red-400/10   border-red-200   dark:border-red-400/20",
    medium: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20",
    low: "text-zinc-500  dark:text-zinc-400  bg-zinc-100 dark:bg-zinc-800     border-zinc-200  dark:border-white/10",
}

export const PROJECT_ACTIVITY_COLORS: Record<string, string> = {
    emerald: "bg-emerald-50 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20 text-emerald-500 dark:text-emerald-400",
    blue: "bg-blue-50   dark:bg-blue-400/10   border-blue-200   dark:border-blue-400/20   text-blue-500   dark:text-blue-400",
    amber: "bg-amber-50  dark:bg-amber-400/10  border-amber-200  dark:border-amber-400/20  text-amber-500  dark:text-amber-400",
    zinc: "bg-zinc-100  dark:bg-zinc-800      border-zinc-200   dark:border-white/10      text-zinc-500   dark:text-zinc-400",
}

// ── Portal · Support ───────────────────────────────────────────────────

export const TICKET_STATUS_CONFIG = {
    open: { label: "Open", icon: CircleDotIcon, color: "bg-amber-50  dark:bg-amber-400/10  text-amber-600  dark:text-amber-400  border-amber-200  dark:border-amber-400/20" },
    in_progress: { label: "In Progress", icon: AlertCircle, color: "bg-blue-50   dark:bg-blue-400/10   text-blue-600   dark:text-blue-400   border-blue-200   dark:border-blue-400/20" },
    resolved: { label: "Resolved", icon: CheckCircle, color: "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20" },
}

export const TICKET_PRIORITY_CONFIG = {
    low: { value: "low", label: "Low", desc: "General question, no urgency", color: "text-blue-500   dark:text-blue-400   bg-blue-50   dark:bg-blue-400/10   border-blue-200   dark:border-blue-400/20", formColor: "border-blue-300   dark:border-blue-400/30   text-blue-500   dark:text-blue-400" },
    medium: { value: "medium", label: "Medium", desc: "Affects work but has a workaround", color: "text-amber-600  dark:text-amber-400  bg-amber-50  dark:bg-amber-400/10  border-amber-200  dark:border-amber-400/20", formColor: "border-amber-300  dark:border-amber-400/30  text-amber-600  dark:text-amber-400" },
    high: { value: "high", label: "High", desc: "Blocking progress on a task", color: "text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-400/10 border-orange-200 dark:border-orange-400/20", formColor: "border-orange-300 dark:border-orange-400/30 text-orange-600 dark:text-orange-400" },
    urgent: { value: "urgent", label: "Urgent", desc: "Critical issue, production is down", color: "text-red-500    dark:text-red-400    bg-red-50    dark:bg-red-400/10    border-red-200    dark:border-red-400/20", formColor: "border-red-300    dark:border-red-400/30    text-red-600    dark:text-red-400" },
}

export const TICKET_CATEGORIES = [
    "Bug Report",
    "Feature Request",
    "Billing / Invoice",
    "Project Question",
    "General Inquiry",
]

export const TICKET_CATEGORY_COLORS: Record<string, string> = {
    "Bug Report": "bg-red-50    dark:bg-red-400/10    text-red-500    dark:text-red-400    border-red-200    dark:border-red-400/20",
    "Feature Request": "bg-violet-50 dark:bg-violet-400/10 text-violet-500 dark:text-violet-400 border-violet-200 dark:border-violet-400/20",
    "Billing / Invoice": "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20",
    "Project Question": "bg-blue-50   dark:bg-blue-400/10   text-blue-500   dark:text-blue-400   border-blue-200   dark:border-blue-400/20",
    "General Inquiry": "bg-zinc-100  dark:bg-zinc-800      text-zinc-500   dark:text-zinc-400   border-zinc-200   dark:border-white/10",
}

export const TICKET_FILTERS = ["All", "Open", "In Progress", "Resolved"]

export const TICKET_RESPONSE_TIMES = [
    { priority: "Urgent", time: "< 1 hour", color: "text-red-500    dark:text-red-400" },
    { priority: "High", time: "< 2 hours", color: "text-orange-500 dark:text-orange-400" },
    { priority: "Medium", time: "< 4 hours", color: "text-amber-600  dark:text-amber-400" },
    { priority: "Low", time: "< 24 hours", color: "text-blue-500   dark:text-blue-400" },
]


// ── Portal · Setings ───────────────────────────────────────────────────

export const SETTINGS_TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
] as const

export type SettingsTab = typeof SETTINGS_TABS[number]["id"]

// ── Roles ───────────────────────────────────────────────────

export const ROLE_ALL = { value: "all", label: "All Roles", desc: "Browse all available talent", icon: Globe }
export const ROLE_DEVELOPER = { value: "developer", label: "Developer", desc: "Full-stack, frontend, backend & mobile engineers", icon: Code2 }
export const ROLE_VA = { value: "va", label: "Virtual Assistant", desc: "Admin support, scheduling & inbox management", icon: ClipboardList }
export const ROLE_PROJECT_MANAGER = { value: "project_manager", label: "Project Manager", desc: "Agile PMs who keep teams on track and on budget", icon: Briefcase }
export const ROLE_DESIGNER = { value: "designer", label: "Designer", desc: "Graphic, brand & visual communication designers", icon: Palette }
export const ROLE_UI_UX = { value: "ui_ux", label: "UI/UX Designer", desc: "User research, wireframing & interaction design", icon: PenTool }
export const ROLE_DATA_ANALYST = { value: "data_analyst", label: "Data Analyst", desc: "Insights, dashboards & data-driven decision making", icon: BarChart2 }
export const ROLE_CONTENT_WRITER = { value: "content_writer", label: "Content Writer", desc: "Blog posts, copywriting & long-form content", icon: PenLine }
export const ROLE_MARKETING = { value: "marketing", label: "Marketing", desc: "Growth, campaigns, paid ads & social strategy", icon: Megaphone }
export const ROLE_CUSTOMER_SUPPORT = { value: "customer_support", label: "Customer Support", desc: "Live chat, ticketing & client success specialists", icon: Headphones }
export const ROLE_ACCOUNTANT = { value: "accountant", label: "Accountant", desc: "Bookkeeping, payroll & financial reporting", icon: Calculator }
export const ROLE_VIDEO_EDITOR = { value: "video_editor", label: "Video Editor", desc: "Reels, YouTube, motion graphics & post-production", icon: Video }
export const ROLE_SEO_SPECIALIST = { value: "seo_specialist", label: "SEO Specialist", desc: "On-page, off-page, technical SEO & keyword strategy", icon: Search }

export const ROLES = [
    ROLE_ALL, ROLE_DEVELOPER, ROLE_VA, ROLE_PROJECT_MANAGER,
    ROLE_DESIGNER, ROLE_UI_UX, ROLE_DATA_ANALYST, ROLE_CONTENT_WRITER,
    ROLE_MARKETING, ROLE_CUSTOMER_SUPPORT, ROLE_ACCOUNTANT,
    ROLE_VIDEO_EDITOR, ROLE_SEO_SPECIALIST,
]

export type RoleValue = typeof ROLES[number]["value"]
export type Role = typeof ROLES[number]

// ── Portal · Join Team ─────────────────────────────────────────────────

export const JOIN_STEPS = [
    { id: 1, label: "Personal Info", icon: User },
    { id: 2, label: "Professional", icon: Briefcase },
    { id: 3, label: "Skills", icon: Code2 },
    { id: 4, label: "Experience", icon: Star },
    { id: 5, label: "Portfolio", icon: FileText },
    { id: 6, label: "Review", icon: CheckCircle },
]

export const JOIN_ROLES = [
    "Frontend Developer", "Backend Developer", "Full-Stack Developer",
    "Mobile Developer", "UI/UX Designer", "Virtual Assistant",
    "Project Manager", "Data Analyst", "DevOps Engineer",
    "QA Engineer", "Marketing Specialist", "Video Editor",
    "SEO Specialist", "Customer Support", "Content Writer",
]

export const JOIN_AVAILABILITY = [
    "Full-time", "Part-time", "Contract", "Freelance",
]

export const JOIN_EXPERIENCE_LEVELS = [
    "1–2 years", "3–5 years", "5–8 years", "8–10 years", "10+ years",
]

export const JOIN_SKILL_GROUPS = [
    { group: "Frontend", items: ["React", "Next.js", "Vue", "Angular", "Svelte", "Tailwind CSS", "TypeScript", "JavaScript", "HTML/CSS", "Vite", "Webpack", "Storybook", "Framer Motion", "Redux", "Zustand", "GraphQL", "REST API", "Webflow", "WordPress"] },
    { group: "Mobile", items: ["React Native", "Flutter", "Swift", "Kotlin", "Expo", "Capacitor", "Ionic", "Jetpack Compose", "SwiftUI", "Firebase", "App Store", "Google Play", "Push Notifications", "Offline Sync"] },
    { group: "Backend", items: ["Node.js", "Python", "Go", "Laravel", "Django", "FastAPI", "Ruby on Rails", "Express.js", "NestJS", "Spring Boot", "PHP", "Java", "C#", ".NET", "GraphQL", "REST API", "WebSockets", "gRPC", "Microservices", "Serverless"] },
    { group: "Database", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase", "Firebase", "SQLite", "DynamoDB", "Elasticsearch", "Prisma", "Drizzle", "TypeORM", "Sequelize", "PlanetScale", "Neon", "Turso"] },
    { group: "Cloud & DevOps", items: ["AWS", "Docker", "Kubernetes", "GCP", "Azure", "CI/CD", "Terraform", "GitHub Actions", "Vercel", "Netlify", "Railway", "Fly.io", "Nginx", "Linux", "Bash", "Ansible", "Prometheus", "Grafana", "Datadog", "Cloudflare"] },
    { group: "Design", items: ["Figma", "Adobe XD", "Framer", "Photoshop", "Illustrator", "After Effects", "Premiere Pro", "DaVinci Resolve", "Canva", "Sketch", "InVision", "Principle", "Lottie", "Blender", "CapCut", "Final Cut Pro"] },
    { group: "QA & Testing", items: ["Jest", "Vitest", "Cypress", "Playwright", "Selenium", "Postman", "k6", "Artillery", "TestRail", "BrowserStack", "Appium", "Detox", "Testing Library", "Storybook"] },
    { group: "Data & Analytics", items: ["Python", "Pandas", "NumPy", "Tableau", "Power BI", "Looker", "Google Analytics", "Metabase", "dbt", "Airflow", "Snowflake", "BigQuery", "Excel", "SQL", "R", "Jupyter", "TensorFlow", "PyTorch"] },
    { group: "Marketing & SEO", items: ["Google Analytics", "Google Ads", "Meta Ads", "SEMrush", "Ahrefs", "Screaming Frog", "Surfer SEO", "Klaviyo", "Mailchimp", "HubSpot", "ActiveCampaign", "Buffer", "Hootsuite", "Zapier", "Make (Integromat)", "TikTok Ads"] },
    { group: "Support & PM", items: ["Zendesk", "Intercom", "Freshdesk", "HubSpot", "Jira", "Linear", "Notion", "Asana", "ClickUp", "Monday.com", "Trello", "Slack", "Miro", "Confluence", "Loom", "Zoom", "Calendly"] },
    { group: "Tools", items: ["Git", "GitHub", "GitLab", "Bitbucket", "Figma", "Notion", "Slack", "Linear", "Asana", "HubSpot", "Zapier", "Make (Integromat)", "Airtable", "VS Code", "Postman", "ChatGPT", "Cursor", "Loom"] },
    { group: "Web3", items: ["Solidity", "Ethereum", "Hardhat", "Web3.js", "Ethers.js", "IPFS", "Foundry", "OpenZeppelin", "Chainlink", "Polygon", "Solana", "Rust", "Anchor", "Wagmi", "Viem", "MetaMask", "WalletConnect"] },
    { group: "AI & Automation", items: ["OpenAI API", "LangChain", "LlamaIndex", "Hugging Face", "TensorFlow", "PyTorch", "Zapier", "Make (Integromat)", "n8n", "Flowise", "Pinecone", "Weaviate", "Whisper", "Stable Diffusion", "Midjourney"] },
]

export const ROLE_SKILL_MAP: Record<string, string[]> = {
    "Frontend Developer": ["Frontend", "Tools", "QA & Testing"],
    "Backend Developer": ["Backend", "Database", "Cloud & DevOps", "Tools", "QA & Testing"],
    "Full-Stack Developer": ["Frontend", "Backend", "Database", "Cloud & DevOps", "Tools", "QA & Testing"],
    "Mobile Developer": ["Mobile", "Database", "Tools", "QA & Testing"],
    "UI/UX Designer": ["Design", "Tools"],
    "Virtual Assistant": ["Support & PM", "Tools"],
    "Project Manager": ["Support & PM", "Tools"],
    "Data Analyst": ["Data & Analytics", "Database", "Tools"],
    "DevOps Engineer": ["Cloud & DevOps", "Tools", "QA & Testing"],
    "QA Engineer": ["QA & Testing", "Tools"],
    "Marketing Specialist": ["Marketing & SEO", "Tools"],
    "Video Editor": ["Design", "Tools"],
    "SEO Specialist": ["Marketing & SEO", "Tools"],
    "Customer Support": ["Support & PM", "Tools"],
    "Content Writer": ["Marketing & SEO", "Tools"],
    "Other": [],
}

export const ROLE_SKILL_PLACEHOLDER: Record<string, string> = {
    "Frontend Developer": "e.g. Webflow, Storybook, Cypress...",
    "Backend Developer": "e.g. gRPC, RabbitMQ, Nginx...",
    "Full-Stack Developer": "e.g. tRPC, Prisma, Turborepo...",
    "Mobile Developer": "e.g. Capacitor, Realm, ARKit...",
    "UI/UX Designer": "e.g. Protopie, Zeroheight, Maze...",
    "Virtual Assistant": "e.g. Calendly, Trello, QuickBooks...",
    "Project Manager": "e.g. Monday.com, ClickUp, Miro...",
    "Data Analyst": "e.g. Tableau, Power BI, dbt...",
    "DevOps Engineer": "e.g. Helm, Prometheus, Vault...",
    "QA Engineer": "e.g. Selenium, Playwright, k6...",
    "Marketing Specialist": "e.g. Klaviyo, Semrush, Meta Ads...",
    "Video Editor": "e.g. DaVinci Resolve, Lottie, CapCut...",
    "SEO Specialist": "e.g. Ahrefs, Screaming Frog, GSC...",
    "Customer Support": "e.g. Zendesk, Intercom, Freshdesk...",
    "Content Writer": "e.g. Surfer SEO, Hemingway, Jasper...",
    "Other": "e.g. any tool or technology you use...",
}

export const JOIN_COUNTRIES = [
    "Philippines", "United States", "United Kingdom", "Australia",
    "Canada", "India", "Singapore", "Malaysia",
    "Indonesia", "Other",
]


// ── Portal · Meetings ──────────────────────────────────────────────────

export const MEETING_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export const MEETING_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

export const MEETING_TIME_SLOTS = [
    "08:00 AM", "08:30 AM",
    "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM",
]

export const MEETING_TIMEZONES = [
    { value: "Asia/Manila", label: "Philippines (PHT, UTC+8)" },
    { value: "America/New_York", label: "New York (ET, UTC-5/-4)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PT, UTC-8/-7)" },
    { value: "America/Chicago", label: "Chicago (CT, UTC-6/-5)" },
    { value: "Europe/London", label: "London (GMT/BST, UTC+0/+1)" },
    { value: "Europe/Paris", label: "Paris (CET, UTC+1/+2)" },
    { value: "Asia/Dubai", label: "Dubai (GST, UTC+4)" },
    { value: "Asia/Singapore", label: "Singapore (SGT, UTC+8)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST, UTC+9)" },
    { value: "Australia/Sydney", label: "Sydney (AEDT, UTC+11)" },
]

// ── Dashboard · Blog ─────────────────────────────────────────────────────

export const BLOG_CATEGORIES = ["All", "Outsourcing", "Blockchain & Web3", "Development", "Products"]

export const BLOG_CATEGORY_COLORS: Record<string, string> = {
    "Outsourcing": "bg-blue-50    dark:bg-blue-500/10    text-blue-600    dark:text-blue-400    border-blue-200    dark:border-blue-400/20",
    "Blockchain & Web3": "bg-amber-50   dark:bg-amber-500/10   text-amber-600   dark:text-amber-400   border-amber-200   dark:border-amber-400/20",
    "Development": "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20",
    "Products": "bg-violet-50  dark:bg-violet-500/10  text-violet-600  dark:text-violet-400  border-violet-200  dark:border-violet-400/20",
}


// ── Dashboard · Clients ───────────────────────────────────────

export const CLIENT_STATUS_CONFIG: Record<ClientStatus, { label: string; className: string; dot: string }> = {
    active: {
        label: "Active",
        className: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
        dot: "bg-emerald-400",
    },
    prospect: {
        label: "Prospect",
        className: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
        dot: "bg-amber-400",
    },
    inactive: {
        label: "Inactive",
        className: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10",
        dot: "bg-zinc-400",
    },
}

export const CLIENT_AVAILABLE_SERVICES = [
    "Frontend Development", "Mobile Development", "Web Development",
    "Blockchain & Web3", "AI & Automation", "Cybersecurity",
    "Virtual Assistants", "Data Analysts", "Customer Support",
    "UI/UX Designers", "Marketing & SEO", "Video Editors",
]

// ── Dashboard · Inquiries ─────────────────────────────────────

export const INQUIRY_STATUSES = [
    { value: "all", label: "All" },
    { value: "new", label: "New" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
]

export const INQUIRY_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    new: { label: "New", className: "bg-blue-50  text-blue-700" },
    in_progress: { label: "In Progress", className: "bg-amber-50 text-amber-700" },
    resolved: { label: "Resolved", className: "bg-green-50 text-green-700" },
}

// ── Dashboard · Products ──────────────────────────────────────

export const PRODUCT_ACCENT_MAP: Record<string, { badge: string; icon: string; ring: string; dot: string; bar: string }> = {
    amber: { badge: "bg-amber-50   dark:bg-amber-500/10   text-amber-600   dark:text-amber-400   border-amber-200   dark:border-amber-500/20", icon: "bg-amber-50   dark:bg-amber-500/10   border-amber-200   dark:border-amber-500/20   text-amber-500   dark:text-amber-400", ring: "hover:border-amber-300   dark:hover:border-amber-500/30", dot: "bg-amber-400", bar: "bg-amber-400" },
    emerald: { badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", icon: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-500 dark:text-emerald-400", ring: "hover:border-emerald-300 dark:hover:border-emerald-500/30", dot: "bg-emerald-400", bar: "bg-emerald-400" },
    blue: { badge: "bg-blue-50    dark:bg-blue-500/10    text-blue-600    dark:text-blue-400    border-blue-200    dark:border-blue-500/20", icon: "bg-blue-50    dark:bg-blue-500/10    border-blue-200    dark:border-blue-500/20    text-blue-500    dark:text-blue-400", ring: "hover:border-blue-300    dark:hover:border-blue-500/30", dot: "bg-blue-400", bar: "bg-blue-400" },
    violet: { badge: "bg-violet-50  dark:bg-violet-500/10  text-violet-600  dark:text-violet-400  border-violet-200  dark:border-violet-500/20", icon: "bg-violet-50  dark:bg-violet-500/10  border-violet-200  dark:border-violet-500/20  text-violet-500  dark:text-violet-400", ring: "hover:border-violet-300  dark:hover:border-violet-500/30", dot: "bg-violet-400", bar: "bg-violet-400" },
    rose: { badge: "bg-rose-50    dark:bg-rose-500/10    text-rose-600    dark:text-rose-400    border-rose-200    dark:border-rose-500/20", icon: "bg-rose-50    dark:bg-rose-500/10    border-rose-200    dark:border-rose-500/20    text-rose-500    dark:text-rose-400", ring: "hover:border-rose-300    dark:hover:border-rose-500/30", dot: "bg-rose-400", bar: "bg-rose-400" },
    sky: { badge: "bg-sky-50     dark:bg-sky-500/10     text-sky-600     dark:text-sky-400     border-sky-200     dark:border-sky-500/20", icon: "bg-sky-50     dark:bg-sky-500/10     border-sky-200     dark:border-sky-500/20     text-sky-500     dark:text-sky-400", ring: "hover:border-sky-300     dark:hover:border-sky-500/30", dot: "bg-sky-400", bar: "bg-sky-400" },
}

// ── Dashboard · Settings ──────────────────────────────────────

export const SETTINGS_SECTIONS = [
    { id: "profile", label: "Profile", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
]

export type SettingsSection = typeof SETTINGS_SECTIONS[number]["id"]

// ── Dashboard · Talent ────────────────────────────────────────────────────

export const TALENT_AVATAR_GRADIENTS = [
    "from-blue-500    to-cyan-400",
    "from-rose-500    to-pink-400",
    "from-violet-500  to-purple-400",
    "from-emerald-500 to-teal-400",
    "from-amber-500   to-orange-400",
    "from-fuchsia-500 to-pink-400",
]