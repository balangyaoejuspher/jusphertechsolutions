import { Code2, BriefcaseBusiness, Headphones, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const services = [
  {
    id: "developers",
    icon: Code2,
    number: "01",
    title: "Developers",
    tagline: "Code that scales. Teams that deliver.",
    description:
      "Whether you need a single engineer or an entire development team, we match you with experienced professionals who understand modern architecture, clean code, and delivery timelines.",
    features: [
      "Full-stack, frontend & backend specialists",
      "Mobile developers (iOS, Android, React Native)",
      "DevOps & cloud infrastructure engineers",
      "Code review & technical leadership",
      "Short-term projects or long-term contracts",
    ],
    stack: ["React", "Next.js", "Node.js", "Python", "TypeScript", "Go", "AWS", "Docker"],
  },
  {
    id: "va",
    icon: Headphones,
    number: "02",
    title: "Virtual Assistants",
    tagline: "Delegate more. Achieve more.",
    description:
      "Our VAs are more than task handlers — they're proactive partners who understand your business and keep operations running smoothly so you can focus on growth.",
    features: [
      "Executive & administrative support",
      "Customer service & live chat support",
      "Calendar & inbox management",
      "Data entry, research & reporting",
      "Social media & content scheduling",
    ],
    stack: ["Notion", "Slack", "HubSpot", "Zoho", "Trello", "Asana", "Gmail", "Shopify"],
  },
  {
    id: "pm",
    icon: BriefcaseBusiness,
    number: "03",
    title: "Project Managers",
    tagline: "On time. On budget. Every time.",
    description:
      "Experienced PMs who bring proven methodologies, clear communication, and relentless focus to every project — keeping your team aligned and your stakeholders confident.",
    features: [
      "Agile & Scrum certified professionals",
      "Cross-functional team coordination",
      "Risk management & mitigation",
      "Stakeholder reporting & documentation",
      "Tool setup, onboarding & process design",
    ],
    stack: ["Jira", "Confluence", "Notion", "ClickUp", "Asana", "Monday.com", "Slack", "Linear"],
  },
]

const process = [
  {
    step: "01",
    title: "Tell Us What You Need",
    description: "Share your requirements, timeline, and budget. We'll identify the right talent profile for your goals.",
  },
  {
    step: "02",
    title: "We Match You",
    description: "Within 48 hours, we present you with pre-vetted candidates that fit your exact requirements.",
  },
  {
    step: "03",
    title: "Interview & Choose",
    description: "Meet the candidates, ask your questions, and choose the one you're most confident in.",
  },
  {
    step: "04",
    title: "Start Working",
    description: "Onboard your new team member and hit the ground running. We stay available for ongoing support.",
  },
]

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
          <h1 className="font-display text-6xl md:text-8xl font-bold text-zinc-900 dark:text-white leading-[0.95] tracking-tight mb-6">
            Everything You Need
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">To Scale Fast</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed font-light">
            Three core services. One mission — connecting you with talent
            that moves your business forward.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-8 md:py-12 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-12 flex flex-col gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              id={service.id}
              className="group relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-10 md:p-14 hover:border-amber-400/40 dark:hover:border-amber-500/15 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300"
            >
              {/* Number watermark */}
              <div className="absolute top-8 right-10 font-display text-8xl font-bold text-zinc-200 dark:text-white/3 select-none">
                {service.number}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left */}
                <div>
                  {/* Icon + Title */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center group-hover:border-amber-400/50 dark:group-hover:border-amber-500/30 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/5 transition-all duration-300">
                      <service.icon
                        size={22}
                        className="text-zinc-400 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <p className="text-amber-500 dark:text-amber-400 text-xs font-medium tracking-widest uppercase mb-0.5">
                        Service {service.number}
                      </p>
                      <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-xl text-zinc-500 dark:text-zinc-300 font-light italic mb-4">
                    "{service.tagline}"
                  </p>

                  <p className="text-zinc-500 dark:text-zinc-500 leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <Link href="/talent">
                    <Button className="group/btn rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-12 px-7 shadow-md shadow-amber-500/20">
                      Hire {service.title}
                      <ArrowRight size={15} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Right */}
                <div>
                  {/* Features */}
                  <div className="mb-8">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">
                      What's Included
                    </p>
                    <ul className="flex flex-col gap-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle size={16} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stack */}
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">
                      Tools & Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.stack.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-500 text-xs hover:text-zinc-900 dark:hover:text-zinc-300 hover:border-amber-400/40 dark:hover:border-amber-500/20 transition-all cursor-default"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-28 md:py-36 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              — How It Works
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
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
                <div className="font-display text-5xl font-bold text-amber-400/30 dark:text-amber-400/20 mb-6">
                  {item.step}
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-3">
                  {item.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-28 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-500 mb-8 max-w-md mx-auto">
            Tell us about your project and we'll recommend the right talent for your needs.
          </p>
          <Link href="/talent">
            <Button
              size="lg"
              className="h-14 px-10 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-lg shadow-amber-500/20"
            >
              Browse All Talent
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}