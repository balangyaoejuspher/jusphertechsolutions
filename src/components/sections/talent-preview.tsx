"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, MapPin, Clock, Sparkles } from "lucide-react"
import { publicFetch } from "@/lib/api/public-fetcher"
import { cn } from "@/lib/utils"
import type { TalentRow } from "@/server/db/schema"

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-600",
  "from-cyan-500 to-sky-600",
]

function getGradient(name: string) {
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length]
}

const STATUS_CONFIG = {
  available: {
    label: "Available",
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    ping: true,
  },
  busy: {
    label: "On Project",
    dot: "bg-amber-500",
    ring: "ring-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    ping: false,
  },
  unavailable: {
    label: "Unavailable",
    dot: "bg-zinc-400",
    ring: "ring-zinc-400/20",
    text: "text-zinc-500 dark:text-zinc-400",
    bg: "bg-zinc-100 dark:bg-zinc-800",
    ping: false,
  },
}

function TalentCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        <div className="w-20 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
        <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
        <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3].map(i => <div key={i} className="h-6 w-14 bg-zinc-100 dark:bg-zinc-800 rounded-full" />)}
      </div>
    </div>
  )
}

export function TalentPreview() {
  const [talents, setTalents] = useState<TalentRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicFetch.get<TalentRow[]>("/talent?limit=4")
      .then(setTalents)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative py-24 md:py-36 bg-white dark:bg-zinc-950 overflow-hidden">

      {/* Subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888806_1px,transparent_1px),linear-gradient(to_bottom,#88888806_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-white/5 to-transparent" />

      <div className="relative container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-5">
              <Sparkles size={11} className="text-amber-400" />
              Our Talent
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-[1.05]">
              Meet Some of Our
              <br />
              <span className="text-zinc-400 dark:text-zinc-600">Top Professionals</span>
            </h2>
          </div>
          <Link href="/talent" className="shrink-0">
            <Button
              variant="outline"
              className="rounded-xl border-zinc-200 dark:border-white/10 hover:border-amber-400/60 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/5 transition-all gap-2"
            >
              View All Talent
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <TalentCardSkeleton key={i} />)
            : talents.map((talent) => {
              const statusKey = (talent.status as keyof typeof STATUS_CONFIG) ?? "unavailable"
              const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.unavailable
              const skills = (talent.skills ?? []).slice(0, 3) as string[]

              return (
                <div
                  key={talent.id}
                  className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-6 hover:border-zinc-200 dark:hover:border-white/10 hover:shadow-xl hover:shadow-zinc-100/80 dark:hover:shadow-zinc-950/50 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-400/0 group-hover:from-amber-400/3 group-hover:to-transparent transition-all duration-500 pointer-events-none rounded-2xl" />

                  {/* Top row */}
                  <div className="flex items-start justify-between mb-5">
                    {/* Avatar */}
                    <div className="relative">
                      <div className={cn(
                        "w-13 h-13 w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-lg shadow-lg",
                        getGradient(talent.name)
                      )}>
                        {talent.name.charAt(0)}
                      </div>
                      {/* Online indicator */}
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 ring-2",
                        status.dot, status.ring
                      )}>
                        {status.ping && (
                          <span className={cn("absolute inset-0 rounded-full animate-ping opacity-75", status.dot)} />
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border",
                      status.bg, status.text,
                      statusKey === "available"
                        ? "border-emerald-200 dark:border-emerald-500/20"
                        : statusKey === "busy"
                          ? "border-amber-200 dark:border-amber-500/20"
                          : "border-zinc-200 dark:border-white/10"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                      {status.label}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="mb-4">
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm leading-tight mb-1">
                      {talent.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2.5 leading-snug">
                      {talent.title}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {talent.hourlyRate && (
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          ${talent.hourlyRate}
                          <span className="font-normal text-zinc-400">/hr</span>
                        </span>
                      )}
                      {talent.projectsCompleted != null && (
                        <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                          <Star size={9} className="text-amber-400 fill-amber-400" />
                          {talent.projectsCompleted} projects
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-zinc-100 dark:bg-white/5 mb-4" />

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/8 text-zinc-600 dark:text-zinc-400 text-[10px] font-medium hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })
          }
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-32 bg-zinc-100 dark:bg-white/5" />
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            {loading ? "..." : `Showing ${talents.length} of many professionals`}
          </p>
          <div className="h-px flex-1 max-w-32 bg-zinc-100 dark:bg-white/5" />
        </div>
      </div>
    </section>
  )
}