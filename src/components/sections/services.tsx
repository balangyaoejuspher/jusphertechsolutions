"use client"

import { useEffect, useRef, useState } from "react"
import { Code2, ArrowRight } from "lucide-react"
import { publicFetch } from "@/lib/api/public-fetcher"
import { SERVICE_ICONS } from "@/lib/helpers/service-icons"
import type { Service } from "@/server/db/schema"
import Link from "next/link"
import { cn } from "@/lib/utils"

function MeshGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950" />

      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-20 blur-[100px] animate-blob"
        style={{ background: "radial-gradient(circle, #fbbf24 0%, #f59e0b 40%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-15 blur-[120px] animate-blob animation-delay-2000"
        style={{ background: "radial-gradient(circle, #a78bfa 0%, #8b5cf6 40%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-10 blur-[80px] animate-blob animation-delay-4000"
        style={{ background: "radial-gradient(circle, #34d399 0%, #10b981 40%, transparent 70%)" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888808_1px,transparent_1px),linear-gradient(to_bottom,#88888808_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/60 via-transparent to-zinc-50/60 dark:from-zinc-950/60 dark:via-transparent dark:to-zinc-950/60" />
    </div>
  )
}

function GlowCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        className="absolute pointer-events-none transition-opacity duration-300 rounded-full"
        style={{
          width: 300,
          height: 300,
          left: pos.x - 150,
          top: pos.y - 150,
          background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
          opacity: hovered ? 1 : 0,
        }}
      />
      {children}
    </div>
  )
}

function ServiceNumber({ number }: { number: string | number | null }) {
  if (!number) return null
  return (
    <span className="absolute top-6 right-6 text-6xl font-black text-zinc-100 dark:text-white/5 select-none leading-none tabular-nums">
      {String(number).padStart(2, "0")}
    </span>
  )
}

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicFetch.get<Service[]>("/services?limit=3")
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      <MeshGradient />

      <div className="relative container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            What We Offer
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight leading-[1.05] mb-4">
            Services Built for
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Modern Businesses
              </span>
              {/* Underline accent */}
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500/60 via-amber-400 to-transparent rounded-full" />
            </span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-xl mx-auto leading-relaxed mt-4">
            Specialized talent and end-to-end services that scale with your ambitions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 animate-pulse" />
            ))
            : services.map((service, idx) => {
              const Icon = SERVICE_ICONS[service.icon] ?? Code2
              const tags = (service.stack ?? []).slice(0, 4) as string[]
              const isFeatured = service.featured

              return (
                <GlowCard
                  key={service.id}
                  className={cn(
                    "group rounded-2xl border transition-all duration-300 hover:-translate-y-1.5",
                    isFeatured
                      ? "bg-zinc-900 dark:bg-zinc-900 border-zinc-700 dark:border-zinc-700 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10"
                      : "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-xl hover:shadow-zinc-200/60 dark:hover:shadow-zinc-900/60"
                  )}
                >
                  {/* Featured ribbon */}
                  {isFeatured && service.badge && (
                    <div className="absolute top-4 right-12 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                        {service.badge}
                      </span>
                    </div>
                  )}

                  <ServiceNumber number={service.number} />

                  <div className="relative p-8">
                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300",
                      isFeatured
                        ? "bg-amber-400/20 border border-amber-400/30 group-hover:bg-amber-400/30"
                        : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-900 dark:group-hover:bg-white"
                    )}>
                      <Icon
                        size={20}
                        className={cn(
                          "transition-colors duration-300",
                          isFeatured
                            ? "text-amber-400"
                            : "text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900"
                        )}
                      />
                    </div>

                    {/* Text */}
                    <h3 className={cn(
                      "text-xl font-bold mb-3 leading-tight",
                      isFeatured ? "text-white" : "text-zinc-900 dark:text-white"
                    )}>
                      {service.title}
                    </h3>
                    <p className={cn(
                      "text-sm leading-relaxed mb-6",
                      isFeatured ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"
                    )}>
                      {service.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                            isFeatured
                              ? "bg-white/10 text-zinc-300 border border-white/10"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA link */}
                    <Link
                      href={`/services/${service.slug}`}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-bold transition-all group/link",
                        isFeatured
                          ? "text-amber-400 hover:text-amber-300"
                          : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                      )}
                    >
                      Learn more
                      <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </GlowCard>
              )
            })
          }
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:border-amber-400/60 hover:text-amber-600 dark:hover:text-amber-400 hover:shadow-md transition-all duration-200"
          >
            View all services
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Blob animation styles */}
      <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%       { transform: translate(40px, -30px) scale(1.08); }
                    66%       { transform: translate(-20px, 20px) scale(0.95); }
                }
                .animate-blob {
                    animation: blob 10s ease-in-out infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
    </section>
  )
}