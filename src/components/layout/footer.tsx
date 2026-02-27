import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { MapPin, Mail, Clock, ArrowUpRight } from "lucide-react"
import { footerServiceLinks, footerProductLinks, footerCompanyLinks } from "@/config/navigation"

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-border overflow-hidden">

      <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-[--chart-1] opacity-5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[--chart-1] to-transparent opacity-20" />

      <div className="relative container mx-auto px-6 md:px-12">

        <div className="pt-20 pb-14 border-b border-white/5">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

            <div className="max-w-xl">
              <Link href="/" className="flex items-center gap-3 group w-fit mb-8">
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                  <Image
                    src="/icon.svg"
                    alt={siteConfig.fullName}
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black text-foreground tracking-tight">
                    {siteConfig.name.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-semibold text-[--chart-1] tracking-widest uppercase mt-0.5 opacity-70">
                    {siteConfig.slogan}
                  </span>
                </div>
              </Link>

              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-[1.1]">
                <span className="text-foreground">The talent layer for</span>
                <br />
                <span className="text-muted-foreground">modern remote teams.</span>
              </h2>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
                {siteConfig.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 shrink-0 pb-1">
              <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1">
                Get in touch
              </p>
              {[
                { icon: MapPin, label: "Cebu City, Philippines" },
                { icon: Mail, label: "support@juspherandco.com" },
                { icon: Clock, label: "Mon–Fri, 9am–6pm PHT" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default"
                >
                  <Icon size={13} className="text-[--chart-1] shrink-0 opacity-60" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 py-14 border-b border-border">
          {[
            { title: "Services", links: footerServiceLinks },
            { title: "Products", links: footerProductLinks },
            { title: "Company", links: footerCompanyLinks },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-6">
                {title}
              </p>
              <ul className="flex flex-col gap-3.5">
                {links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {item.label}
                      <ArrowUpRight
                        size={11}
                        className="opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-40 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-150"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/40">
            © {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span className="text-xs text-muted-foreground/30">
              Built with Next.js & ♥
            </span>
            <div className="w-px h-3 bg-border" />
            <Link
              href="/sign-in"
              className="text-xs text-muted-foreground/30 hover:text-muted-foreground transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}