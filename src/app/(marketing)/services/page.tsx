import { Button } from "@/components/ui/button"
import { developmentServices, outsourcingServices, process } from "@/lib/services"
import {
  ArrowRight,
  CheckCircle
} from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

function ServiceCard({ service }: { service: (typeof developmentServices)[0] }) {
  const isFeatured = service.featured

  return (
    <div
      id={service.id}
      className={`group relative border rounded-3xl p-10 md:p-14 hover:shadow-lg transition-all duration-300 ${isFeatured
        ? "bg-zinc-900 dark:bg-zinc-900 border-amber-400/30 hover:border-amber-400/60 hover:shadow-amber-500/10"
        : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/5 hover:border-amber-400/40 dark:hover:border-amber-500/15 hover:shadow-amber-500/5"
        }`}
    >
      {/* Featured badge */}
      {isFeatured && "badge" in service && (
        <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 text-xs font-semibold">
          {service.badge}
        </div>
      )}

      {/* Number watermark */}
      <div className={`absolute top-8 right-10 text-8xl font-bold select-none pointer-events-none ${isFeatured
          ? "text-white/5"
          : "text-zinc-900/5 dark:text-white/5"
        }`}>
        {service.number}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${isFeatured
              ? "bg-amber-400/10 border-amber-400/30 group-hover:bg-amber-400/20"
              : "border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 group-hover:border-amber-400/50 dark:group-hover:border-amber-500/30 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/5"
              }`}>
              <service.icon
                size={22}
                className={`transition-colors duration-300 ${isFeatured ? "text-amber-400" : "text-zinc-400 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400"}`}
              />
            </div>
            <div>
              <p className="text-amber-500 dark:text-amber-400 text-xs font-medium tracking-widest uppercase mb-0.5">
                Service {service.number}
              </p>
              <h2 className={`text-3xl font-bold ${isFeatured ? "text-white" : "text-zinc-900 dark:text-white"}`}>
                {service.title}
              </h2>
            </div>
          </div>

          <p className={`text-xl font-light italic mb-4 ${isFeatured ? "text-amber-300/80" : "text-zinc-500 dark:text-zinc-300"}`}>
            "{service.tagline}"
          </p>

          <p className={`leading-relaxed mb-8 ${isFeatured ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-500"}`}>
            {service.description}
          </p>

          <Link href="/contact">
            <Button className="rounded-2xl font-bold h-12 px-7 shadow-md group/btn bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-amber-500/20">
              Get Started
              <ArrowRight size={15} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Right */}
        <div>
          <div className="mb-8">
            <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${isFeatured ? "text-zinc-500" : "text-zinc-400 dark:text-zinc-600"}`}>
              What's Included
            </p>
            <ul className="flex flex-col gap-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className={`text-sm leading-relaxed ${isFeatured ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${isFeatured ? "text-zinc-500" : "text-zinc-400 dark:text-zinc-600"}`}>
              Tools & Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {service.stack.map((tool) => (
                <span
                  key={tool}
                  className={`px-3 py-1.5 rounded-xl border text-xs transition-all cursor-default ${isFeatured
                    ? "bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-amber-400/30"
                    : "bg-white dark:bg-white/5 border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:border-amber-400/40 dark:hover:border-amber-500/20"
                    }`}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-stack development, blockchain & Web3, mobile apps, AI automation, outsourcing and more. Hire vetted talent or get a custom solution from Juspher & Co. Tech Solutions.",
}

export default function ServicesPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">

      {/* Hero */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />
        <div className="container relative mx-auto px-6 md:px-12 text-center">
          <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            — Our Services
          </p>
          <h1 className="text-6xl md:text-8xl font-bold text-zinc-900 dark:text-white leading-[0.95] tracking-tight mb-6">
            Everything You Need
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">To Scale Fast</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            12 specialized services across development and outsourcing —
            one mission, connecting you with talent that moves your business forward.
          </p>

          {/* Quick jump links */}
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {[...developmentServices, ...outsourcingServices].map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-xs font-medium hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400 transition-all"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Development Services */}
      <section className="py-8 md:py-12 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-zinc-100 dark:bg-white/5" />
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] whitespace-nowrap">
              Development Services
            </p>
            <div className="h-px flex-1 bg-zinc-100 dark:bg-white/5" />
          </div>
          <div className="flex flex-col gap-6">
            {developmentServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Outsourcing Services */}
      <section className="py-8 md:py-12 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-zinc-100 dark:bg-white/5" />
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] whitespace-nowrap">
              Outsourcing Services
            </p>
            <div className="h-px flex-1 bg-zinc-100 dark:bg-white/5" />
          </div>
          <div className="flex flex-col gap-6">
            {outsourcingServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-28 md:py-36 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              — How It Works
            </p>
            <h2 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Simple. Fast.
              <br />
              <span className="text-zinc-400 dark:text-zinc-500">No Guesswork.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 dark:bg-white/5 rounded-3xl overflow-hidden">
            {process.map((item) => (
              <div
                key={item.step}
                className="bg-white dark:bg-zinc-950 p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200"
              >
                <div className="text-5xl font-bold text-amber-400/30 dark:text-amber-400/20 mb-6">
                  {item.step}
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-3">{item.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-500 mb-8 max-w-md mx-auto">
            Tell us about your project and we'll recommend the right service for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-lg shadow-amber-500/20">
                Get a Free Consultation
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link href="/talent">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                Browse All Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}