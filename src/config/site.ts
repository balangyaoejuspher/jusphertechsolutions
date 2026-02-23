export const siteConfig = {
  name: "Juspher",
  fullName: "Juspher Tech Solutions",
  slogan: "Tech Solutions",
  tagline: "Outsourcing & Software, Done Right.",
  description:
    "We connect businesses with top-tier developers, virtual assistants, and project managers — while delivering ready-made software products built for growth.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  nav: [
    { label: "Talent", href: "/talent" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const

export type SiteConfig = typeof siteConfig