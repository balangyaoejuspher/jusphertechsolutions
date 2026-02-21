import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden bg-zinc-900 dark:bg-white rounded-3xl px-8 py-16 md:px-16 text-center">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 dark:bg-zinc-900/5 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-black text-white dark:text-zinc-900 tracking-tight mb-4">
              Ready to Build Your
              <br />
              Dream Team?
            </h2>
            <p className="text-zinc-400 dark:text-zinc-600 text-lg max-w-xl mx-auto mb-10">
              Start hiring top remote talent today. No long-term contracts,
              no hassle — just great work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/talent">
                <Button
                  size="lg"
                  className="rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold px-8 h-12"
                >
                  Browse Talent
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-xl dark:bg-amber-400 text-white dark:text-zinc-950 hover:bg-zinc-700 dark:hover:bg-amber-300 h-12 px-8"
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