import type { Metadata } from "next"
import { ArrowRight, Heart, Shield, Zap, Globe, Users, Trophy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
      "We know time is money. Our average talent match time is 48 hours — so you can start building without delay.",
  },
  {
    icon: Heart,
    title: "People Centered",
    description:
      "We genuinely care about both our clients and our talent. Long-term relationships built on trust are what drive us forward.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Our talent network spans 30+ countries. Wherever you are, we have the right person in the right timezone for your team.",
  },
]

const team = [
  {
    name: "Juspher Balangyao",
    role: "Founder, CEO",
    bio: "10+ years in talent acquisition and tech startups. Built this agency to solve the hiring problem he kept running into.",
    gradient: "from-amber-500 to-orange-400",
  },
]

const stats = [
  { value: "200+", label: "Businesses Served" },
  { value: "500+", label: "Professionals Placed" },
  { value: "30+", label: "Countries Represented" },
  { value: "98%", label: "Client Satisfaction" },
]

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Juspher & Co — our story, our values, and the team behind the platform.",
}

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">

      {/* Hero */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />

        <div className="container relative mx-auto px-6 md:px-12 text-center">
          <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            — About Us
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-bold text-zinc-900 dark:text-white leading-[0.95] tracking-tight mb-6">
            We Believe Great
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">Work Starts with</span>
            <br />
            Great People
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed font-light">
            Juspher & Co was founded with one mission — make it effortless
            for businesses to find and work with exceptional remote talent.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-400 dark:text-zinc-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 md:py-32 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                — Our Story
              </p>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white leading-tight tracking-tight mb-6">
                Born Out of
                <br />
                Frustration
              </h2>
              <div className="space-y-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
                <p>
                  Our founder Juspher spent years struggling to find reliable remote talent for his startups.
                  Freelance platforms were a gamble, recruiters were slow, and the good people were always taken.
                </p>
                <p>
                  So he built the solution himself. Juspher & Co started as a small curated network of
                  developers he personally trusted — and grew into a full-service talent platform covering
                  developers, VAs, and project managers.
                </p>
                <p>
                  Today we serve 200+ businesses worldwide, and every professional in our network is someone
                  we'd hire ourselves.
                </p>
              </div>
              <Link href="/talent" className="inline-block mt-8">
                <Button className="rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-12 px-8 shadow-md shadow-amber-500/20">
                  Meet Our Talent
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>

            {/* Right — Visual */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: "Talent Network", value: "500+", color: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20", iconColor: "text-amber-500" },
                  { icon: Globe, label: "Countries", value: "30+", color: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20", iconColor: "text-blue-500" },
                  { icon: Trophy, label: "Satisfaction", value: "98%", color: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20", iconColor: "text-emerald-500" },
                  { icon: Zap, label: "Match Time", value: "48hr", color: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20", iconColor: "text-violet-500" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-3xl border p-8 flex flex-col gap-4 ${item.color}`}
                  >
                    <item.icon size={24} className={item.iconColor} />
                    <div>
                      <div className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
                        {item.value}
                      </div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              — Our Values
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
              What Drives Us
              <br />
              <span className="text-zinc-400 dark:text-zinc-500">Every Single Day</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-8 hover:border-amber-400/40 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-zinc-100 dark:hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10 group-hover:border group-hover:border-amber-200 dark:group-hover:border-amber-500/20 transition-all duration-300">
                  <value.icon size={20} className="text-zinc-400 dark:text-zinc-500 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-3">
                  {value.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-32 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              — Our Team
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
              The People Behind
              <br />
              <span className="text-zinc-400 dark:text-zinc-500">The Platform</span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative w-full sm:w-72 lg:w-64 overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900 hover:border-amber-400/40 dark:hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Diagonal streak */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  <div className="diagonal-streak" />
                </div>

                {/* Residual glow */}
                <div className="absolute bottom-0 right-0 w-28 h-28 bg-amber-400/5 dark:bg-amber-400/8 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity delay-300 duration-500 pointer-events-none" />

                {/* Content */}
                <div className="relative p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-xl mb-6 shadow-md group-hover:shadow-amber-500/20 transition-shadow duration-300`}>
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-0.5">
                    {member.name}
                  </h3>
                  <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="relative overflow-hidden bg-zinc-900 dark:bg-white/5 rounded-3xl border border-zinc-800 dark:border-white/10 px-10 py-20 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                Ready to Work
                <br />
                With the Best?
              </h2>
              <p className="text-zinc-400 text-lg max-w-md mx-auto mb-10">
                Join 200+ businesses that trust us to find their perfect team members.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/talent">
                  <Button
                    size="lg"
                    className="h-14 px-10 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-lg shadow-amber-500/20"
                  >
                    Browse Talent
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-14 px-10 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20"
                  >
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