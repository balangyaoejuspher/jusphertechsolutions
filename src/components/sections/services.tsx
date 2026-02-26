"use client"

import { useEffect, useState } from "react"
import { Code2 } from "lucide-react"
import { publicFetch } from "@/lib/api/public-fetcher"
import { SERVICE_ICONS } from "@/lib/helpers/service-icons"
import type { Service } from "@/server/db/schema"

export function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    publicFetch.get<Service[]>("/services?limit=3")
      .then(setServices)
      .catch(console.error)
  }, [])

  return (
    <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
            What We Offer
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
            Services Built for
            <br />
            Modern Businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.icon] ?? Code2
            const tags = (service.stack ?? []) as string[]

            return (
              <div
                key={service.id}
                className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-zinc-900 dark:group-hover:bg-white transition-colors duration-300">
                  <Icon
                    size={22}
                    className="text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}