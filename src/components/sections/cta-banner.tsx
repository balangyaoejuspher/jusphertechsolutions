import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden bg-zinc-900 dark:bg-zinc-900 rounded-3xl border border-zinc-800 px-8 py-20 md:px-16 text-center isolate">

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(251,191,36,0.12),transparent)]" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-amber-400/60 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-white/50 text-xs font-semibold tracking-[0.15em] uppercase">Start Today</span>
            </div>

            <h2 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight leading-[0.92] mb-5">
              Ready to Build Your
              <br />
              <span className="text-zinc-500">Dream Team?</span>
            </h2>

            <p className="text-zinc-400 text-lg max-w-md mx-auto mb-12 leading-relaxed">
              Start hiring top remote talent today. No long-term contracts,
              no hassle — just great work.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/talent">
                <Button
                  size="lg"
                  className="rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-10 h-12 gap-2 shadow-lg shadow-amber-500/20 group"
                >
                  Browse Talent
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 h-12 px-10 transition-all"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}