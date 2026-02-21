import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Code2, BriefcaseBusiness, Headphones, MapPin, Mail, Clock } from "lucide-react"

const services = [
  { label: "Developers", href: "/services#developers", icon: Code2 },
  { label: "Virtual Assistants", href: "/services#va", icon: Headphones },
  { label: "Project Managers", href: "/services#pm", icon: BriefcaseBusiness },
]

const company = [
  { label: "About Us", href: "/about" },
  { label: "Our Talent", href: "/talent" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
]

export function Footer() {
  return (
    <footer className="relative bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/5 overflow-hidden">

      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="relative container mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">

          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-5 w-fit">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-amber-400 flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white dark:text-zinc-950 text-sm font-black">PA</span>
              </div>
              <span className="font-bold text-zinc-900 dark:text-white tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed max-w-xs mb-6">
              {siteConfig.description}
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-600">
                <MapPin size={14} className="shrink-0" />
                Cebu City, Philippines
              </span>
              <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-600">
                <Mail size={14} className="shrink-0" />
                hello@portfolioagency.com
              </span>
              <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-600">
                <Clock size={14} className="shrink-0" />
                Mon–Fri, 9am–6pm PHT
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-5">
              Services
            </p>
            <ul className="flex flex-col gap-3">
              {services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2.5 text-sm text-zinc-500 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors group"
                  >
                    <item.icon
                      size={14}
                      className="text-zinc-400 dark:text-zinc-700 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-5">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-500 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-zinc-300 dark:text-zinc-800">
              Built with Next.js & ❤️
            </span>
            <Link
              href="/sign-in"
              className="text-xs text-zinc-200 dark:text-zinc-900 hover:text-zinc-400 dark:hover:text-zinc-700 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}