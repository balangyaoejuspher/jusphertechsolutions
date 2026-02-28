"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Heart, Shield, Zap, Globe, Users, Trophy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedNumber } from "@/components/shared/animated-number"

type PublicStats = {
  talent: number
  clients: number
  placements: number
  projects: number
  vetted: number
}

const values = [
  {
    icon: Shield,
    title: "Quality First",
    description:
      "Every professional in our network goes through a rigorous vetting process. We only work with the best so you don't have to guess.",
  },
  {
    icon: Zap,
    title: "Speed & Efficiency",
    description:
      "We know time is money. Our goal is to get you matched fast — so you can start building without delay.",
  },
  {
    icon: Heart,
    title: "People Centered",
    description:
      "We genuinely care about both our clients and our talent. Long-term relationships built on trust are what drive us forward.",
  },
  {
    icon: Globe,
    title: "Built to Scale",
    description:
      "We're starting small and intentional — rooted in the Philippines, with a clear vision to grow our network globally.",
  },
]

const team = [
  {
    name: "Juspher Balangyao",
    role: "Founder, CEO",
    bio: "Built Juspher & Co to solve a real problem — finding reliable, skilled remote talent. Started in 2026 with a small curated network of people he personally trusts.",
    gradient: "from-amber-500 to-orange-400",
  },
]

export default function AboutPage() {
  const [stats, setStats] = useState<PublicStats | null>(null)

  useEffect(() => {
    fetch("/api/v1/public/stats")
      .then((r) => r.json())
      .then((json) => setStats(json?.data ?? json))
      .catch(console.error)
  }, [])

  const statCards = [
    {
      value: stats?.vetted ?? null,
      label: "Vetted Professionals",
      fallback: "—",
    },
    {
      value: stats?.clients ?? null,
      label: "Clients Served",
      fallback: "—",
    },
    {
      value: stats?.placements ?? null,
      label: "Placements Made",
      fallback: "—",
    },
    {
      value: "2026",
      label: "Year Founded",
      fallback: "2026",
      static: true,
    },
  ]

  const storyCards = [
    {
      icon: Users,
      label: "Talent Network",
      value: stats?.talent ?? null,
      suffix: "+",
      fallback: "—",
      bg: "bg-amber-50 dark:bg-amber-500/8",
      border: "border-amber-100 dark:border-amber-500/15",
      iconBg: "bg-amber-100 dark:bg-amber-500/15",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Globe,
      label: "Country",
      value: "PH",
      fallback: "PH",
      static: true,
      bg: "bg-sky-50 dark:bg-sky-500/8",
      border: "border-sky-100 dark:border-sky-500/15",
      iconBg: "bg-sky-100 dark:bg-sky-500/15",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      icon: Trophy,
      label: "Placements",
      value: stats?.placements ?? null,
      suffix: "+",
      fallback: "—",
      bg: "bg-emerald-50 dark:bg-emerald-500/8",
      border: "border-emerald-100 dark:border-emerald-500/15",
      iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Zap,
      label: "Projects",
      value: stats?.projects ?? null,
      suffix: "+",
      fallback: "—",
      bg: "bg-violet-50 dark:bg-violet-500/8",
      border: "border-violet-100 dark:border-violet-500/15",
      iconBg: "bg-violet-100 dark:bg-violet-500/15",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
  ]

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">

      {/* Hero */}
      <section className="relative pt-28 pb-24 md:pt-40 md:pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(251,191,36,0.08),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/G%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative mx-auto px-6 md:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-[0.15em] uppercase">About Us</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl lg:text-[7rem] font-bold text-zinc-900 dark:text-white leading-[0.92] tracking-tight mb-8">
            We Believe Great
            <br />
            <em className="not-italic text-zinc-300 dark:text-zinc-600">Work Starts with</em>
            <br />
            Great People
          </h1>

          <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Juspher & Co was built with one mission — make it effortless
            for businesses to find and work with exceptional remote talent.
          </p>

          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-zinc-400 dark:text-zinc-600">
            <span className="flex items-center gap-2">
              <span className="w-4 h-px bg-zinc-300 dark:bg-zinc-700" />
              Cebu, Philippines
              <span className="w-4 h-px bg-zinc-300 dark:bg-zinc-700" />
            </span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-zinc-100 dark:divide-white/5">
            {statCards.map((stat) => (
              <div key={stat.label} className="relative py-14 px-8 text-center group">
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-2 tabular-nums transition-all duration-300">
                  <AnimatedNumber value={stat.value ?? stat.fallback} />
                </div>
                <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-28 md:py-36 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-amber-400" />
                <p className="text-amber-500 dark:text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">Our Story</p>
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white leading-[0.95] tracking-tight mb-8">
                Born Out of
                <br />
                <span className="relative">
                  Frustration
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400/40" />
                </span>
              </h2>
              <div className="space-y-5 text-zinc-500 dark:text-zinc-400 leading-relaxed text-[15px]">
                <p>
                  Our founder Juspher kept running into the same problem — finding reliable remote talent
                  was slow, inconsistent, and exhausting. Freelance platforms were a gamble, and the good
                  people were always hard to find.
                </p>
                <p>
                  So he decided to build the solution himself. Juspher & Co started as a small,
                  handpicked network of professionals he personally vetted — people he'd work with himself.
                </p>
                <p>
                  We're early. We're small. But every person in our network is someone we genuinely stand behind,
                  and we're building this the right way — one trusted connection at a time.
                </p>
              </div>
              <Link href="/talent" className="inline-block mt-10">
                <Button className="rounded-2xl bg-zinc-900 dark:bg-amber-400 hover:bg-zinc-800 dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-bold h-12 px-8 gap-2 group">
                  Meet Our Talent
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {storyCards.map((item) => (
                <div
                  key={item.label}
                  className={`${item.bg} border ${item.border} rounded-3xl p-7 flex flex-col gap-5 hover:-translate-y-1 transition-transform duration-300`}
                >
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                    <item.icon size={18} className={item.iconColor} />
                  </div>
                  <div>
                    <div className="font-display text-3xl font-bold text-zinc-900 dark:text-white tabular-nums">
                      <AnimatedNumber value={item.value} suffix={item.suffix} fallback={item.fallback} />
                    </div>
                    <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-28 md:py-36 bg-zinc-50 dark:bg-zinc-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88880a_1px,transparent_1px),linear-gradient(to_bottom,#88880a_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.025]" />
        <div className="container mx-auto px-6 md:px-12 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-amber-400" />
                <p className="text-amber-500 dark:text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">Our Values</p>
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight leading-[0.95]">
                What Drives Us
                <br />
                <span className="text-zinc-400 dark:text-zinc-600">Every Single Day</span>
              </h2>
            </div>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm max-w-xs leading-relaxed md:text-right">
              These aren't just words on a wall. They're decisions we make every time we match a client with talent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 dark:bg-white/5 rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="group bg-white dark:bg-zinc-950 p-8 hover:bg-amber-50/50 dark:hover:bg-amber-500/5 transition-colors duration-300 relative"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400/60 transition-all duration-500" />
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/15 transition-colors duration-300">
                  <value.icon size={19} className="text-zinc-400 dark:text-zinc-500 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-300" />
                </div>
                <div className="text-xs font-bold text-zinc-300 dark:text-zinc-700 mb-3 tabular-nums">0{i + 1}</div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-3 leading-snug">{value.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-28 md:py-36 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-amber-400" />
                <p className="text-amber-500 dark:text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">Our Team</p>
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight leading-[0.95]">
                The People Behind
                <br />
                <span className="text-zinc-400 dark:text-zinc-600">The Platform</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-start gap-5">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative w-full sm:w-80 overflow-hidden rounded-3xl border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-white/10 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg shadow-amber-500/20`}>
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-1">{member.name}</h3>
                  <p className="text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">{member.role}</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="relative overflow-hidden bg-zinc-900 dark:bg-zinc-900 rounded-3xl border border-zinc-800 px-10 py-24 text-center isolate">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(251,191,36,0.15),transparent)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-amber-400/60 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase">Let's Build Together</span>
              </div>
              <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-5 tracking-tight leading-[0.92]">
                Be One of Our
                <br />
                <span className="text-zinc-500">First Clients.</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-md mx-auto mb-12 leading-relaxed">
                We're just getting started — and that means you get our full attention, care, and commitment.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/talent">
                  <Button size="lg" className="h-13 px-10 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 gap-2 group">
                    Browse Talent
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="ghost" className="h-13 px-10 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                    View Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}