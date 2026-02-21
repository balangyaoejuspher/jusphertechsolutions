import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-zinc-950 py-20 md:py-32">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />

      <div className="container relative mx-auto px-4 md:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 mb-8 shadow-sm">
          <Star size={13} className="text-yellow-500 fill-yellow-500" />
          Trusted by 200+ businesses worldwide
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.05]">
          Hire World-Class
          <br />
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
              Remote Talent
            </span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-yellow-300/40 dark:bg-yellow-500/20 -skew-x-2 z-0" />
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          We connect businesses with top-tier developers, virtual assistants,
          and project managers — ready to work from day one.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/talent">
            <Button
              size="lg"
              className="rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 font-semibold px-8 h-12"
            >
              Browse Talent
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link href="/services">
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-zinc-200 dark:border-zinc-700 h-12 px-8 font-semibold"
            >
              Our Services
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-400 dark:text-zinc-600">
          {["Developers", "Virtual Assistants", "Project Managers"].map((role) => (
            <div key={role} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {role} Available Now
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}