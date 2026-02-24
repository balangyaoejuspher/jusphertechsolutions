import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { MapPin, Mail, Clock } from "lucide-react"
import { footerServiceLinks, footerProductLinks, footerCompanyLinks } from "@/config/navigation"

export function Footer() {
  return (
    <footer className="relative bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="relative container mx-auto px-6 md:px-12">

        {/* Main grid — 5 cols: brand(2) + services + products + company */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-5 w-fit">
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/icon.svg"
                  alt={siteConfig.fullName}
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">
                  {siteConfig.name.toUpperCase()}
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 dark:text-amber-400/70 tracking-widest uppercase mt-0.5">
                  {siteConfig.slogan}
                </span>
              </div>
            </Link>

            <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed max-w-xs mb-6">
              {siteConfig.description}
            </p>

            <div className="flex flex-col gap-2.5 text-sm">
              <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-600">
                <MapPin size={14} className="shrink-0 text-amber-500/60" />
                Cebu City, Philippines
              </span>
              <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-600">
                <Mail size={14} className="shrink-0 text-amber-500/60" />
                support@juspherandco.com
              </span>
              <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-600">
                <Clock size={14} className="shrink-0 text-amber-500/60" />
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
              {footerServiceLinks.map((item) => (
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

          {/* Products */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-5">
              Products
            </p>
            <ul className="flex flex-col gap-3">
              {footerProductLinks.map((item) => (
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

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-5">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {footerCompanyLinks.map((item) => (
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

        {/* Bottom bar */}
        <div className="border-t border-zinc-100 dark:border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-zinc-300 dark:text-zinc-700">
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