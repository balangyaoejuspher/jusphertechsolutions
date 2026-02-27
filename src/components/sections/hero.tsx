import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

function MeshGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950" />

      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-20 blur-[100px] animate-blob"
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

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 py-24 md:py-36">

      <MeshGradient />

      <div className="container relative mx-auto px-4 md:px-6 text-center">

        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <Star size={11} className="fill-amber-400 text-amber-400" />
          Trusted by 200+ businesses worldwide
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.02]">
          Hire World-Class
          <br />
          <span className="relative inline-block mt-1">
            <span className="absolute -bottom-1 left-0 right-0 h-4 bg-amber-300/40 dark:bg-amber-500/20 -skew-x-2 z-0 rounded" />
            <span className="relative z-10 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Remote Talent
            </span>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          We connect businesses with top-tier developers, virtual assistants,
          and project managers — ready to work from day one.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link href="/talent">
            <Button
              size="lg"
              className="rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 font-bold px-8 h-12 shadow-lg shadow-zinc-900/20 dark:shadow-white/10 gap-2"
            >
              Browse Talent
              <ArrowRight size={15} />
            </Button>
          </Link>
          <Link href="/services">
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm h-12 px-8 font-semibold hover:border-amber-400/60 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
            >
              Our Services
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400 dark:text-zinc-600">
          {["Developers", "Virtual Assistants", "Project Managers"].map((role) => (
            <div key={role} className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {role} Available Now
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-2 text-zinc-300 dark:text-zinc-700">
          <span className="text-[10px] font-semibold uppercase tracking-widest">Our Services</span>
          <div className="w-px h-10 bg-gradient-to-b from-zinc-300 to-transparent dark:from-zinc-700" />
        </div>

      </div>
    </section>
  )
}