export const siteConfig = {
  name: "Portfolio Agency",
  description:
    "We connect businesses with top-tier developers, virtual assistants, and project managers.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Talent", href: "/talent" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const

export type SiteConfig = typeof siteConfig