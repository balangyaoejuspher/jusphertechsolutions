import {
    Code2, Smartphone, Globe, Blocks, Shield, Cpu,
    Users, BarChart2, Headphones, PenTool, TrendingUp, Video,
    Building2, CreditCard, Package, GraduationCap, ShoppingCart, Briefcase,
    type LucideIcon,
} from "lucide-react"

// ============================================================
// TYPES
// ============================================================

export type NavItem = {
    label: string
    href: string
}

export type MenuSubItem = {
    label: string
    desc: string
    href: string
    icon: LucideIcon
}

export type MenuCategory = {
    category: string
    items: MenuSubItem[]
}

// ============================================================
// MAIN NAV (simple links — no mega menu)
// ============================================================

export const mainNav: NavItem[] = [
    { label: "Talent", href: "/talent" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
]

// ============================================================
// FOOTER NAV
// ============================================================

export const footerCompanyLinks: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Our Talent", href: "/talent" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
]

// ============================================================
// SERVICES MEGA MENU
// ============================================================

export const servicesMenu: MenuCategory[] = [
    {
        category: "Development",
        items: [
            {
                label: "Frontend Development",
                desc: "React, Next.js, Vue",
                href: "/services/frontend",
                icon: Code2,
            },
            {
                label: "Mobile Development",
                desc: "iOS, Android, React Native",
                href: "/services/mobile",
                icon: Smartphone,
            },
            {
                label: "Web Development",
                desc: "Full-stack web applications",
                href: "/services/web",
                icon: Globe,
            },
            {
                label: "Blockchain & Web3",
                desc: "Smart contracts, DeFi, NFTs",
                href: "/services/blockchain",
                icon: Blocks,
            },
            {
                label: "AI & Automation",
                desc: "ML models, bots, workflows",
                href: "/services/ai",
                icon: Cpu,
            },
            {
                label: "Cybersecurity",
                desc: "Audits, pen testing, DevSecOps",
                href: "/services/security",
                icon: Shield,
            },
        ],
    },
    {
        category: "Outsourcing",
        items: [
            {
                label: "Virtual Assistants",
                desc: "Admin, scheduling, support",
                href: "/services/va",
                icon: Users,
            },
            {
                label: "Data Analysts",
                desc: "BI, dashboards, reporting",
                href: "/services/data",
                icon: BarChart2,
            },
            {
                label: "Customer Support",
                desc: "Live chat, email, voice",
                href: "/services/support",
                icon: Headphones,
            },
            {
                label: "UI/UX Designers",
                desc: "Figma, prototypes, research",
                href: "/services/design",
                icon: PenTool,
            },
            {
                label: "Marketing & SEO",
                desc: "Growth, content, ads",
                href: "/services/marketing",
                icon: TrendingUp,
            },
            {
                label: "Video Editors",
                desc: "Reels, YouTube, motion",
                href: "/services/video",
                icon: Video,
            },
        ],
    },
]

// ============================================================
// PRODUCTS MEGA MENU
// ============================================================

export const productsMenu: MenuCategory[] = [
    {
        category: "Business Software",
        items: [
            {
                label: "HRIS",
                desc: "HR & payroll management",
                href: "/products/hris",
                icon: Building2,
            },
            {
                label: "Loan Management",
                desc: "Lending & repayment system",
                href: "/products/loan",
                icon: CreditCard,
            },
            {
                label: "Inventory System",
                desc: "Stock tracking & orders",
                href: "/products/inventory",
                icon: Package,
            },
            {
                label: "School Management",
                desc: "Enrollment, grades, LMS",
                href: "/products/school",
                icon: GraduationCap,
            },
            {
                label: "POS System",
                desc: "Point of sale & billing",
                href: "/products/pos",
                icon: ShoppingCart,
            },
            {
                label: "Project Management",
                desc: "Tasks, sprints, teams",
                href: "/products/pm",
                icon: Briefcase,
            },
        ],
    },
]

// ============================================================
// FOOTER SERVICES LINKS (flat list for footer column)
// ============================================================

export const footerServiceLinks: NavItem[] = [
    { label: "Frontend Development", href: "/services/frontend" },
    { label: "Mobile Development", href: "/services/mobile" },
    { label: "Blockchain & Web3", href: "/services/blockchain" },
    { label: "Web Development", href: "/services/web" },
    { label: "AI & Automation", href: "/services/ai" },
    { label: "Cybersecurity", href: "/services/security" },
    { label: "Virtual Assistants", href: "/services/va" },
    { label: "UI/UX Designers", href: "/services/design" },
    { label: "Data Analysts", href: "/services/data" },
    { label: "Customer Support", href: "/services/support" },
    { label: "Marketing & SEO", href: "/services/marketing" },
    { label: "Video Editors", href: "/services/video" },
]

// ============================================================
// FOOTER PRODUCTS LINKS (flat list for footer column)
// ============================================================

export const footerProductLinks: NavItem[] = [
    { label: "HRIS", href: "/products/hris" },
    { label: "Loan Management", href: "/products/loan" },
    { label: "Inventory System", href: "/products/inventory" },
    { label: "School Management", href: "/products/school" },
    { label: "POS System", href: "/products/pos" },
    { label: "Project Management", href: "/products/pm" },
]