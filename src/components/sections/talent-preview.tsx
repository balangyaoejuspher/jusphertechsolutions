import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const talents = [
  { name: "Alex R.", role: "Full-Stack Developer", rate: "$45/hr", skills: ["React", "Node.js", "PostgreSQL"], status: "available" },
  { name: "Maria S.", role: "Virtual Assistant", rate: "$20/hr", skills: ["Admin", "CRM", "Support"], status: "available" },
  { name: "James K.", role: "Project Manager", rate: "$55/hr", skills: ["Agile", "Scrum", "Jira"], status: "busy" },
  { name: "Priya M.", role: "Frontend Developer", rate: "$40/hr", skills: ["Next.js", "Tailwind", "TypeScript"], status: "available" },
]

export function TalentPreview() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
              Our Talent
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
              Meet Some of Our
              <br />
              Top Professionals
            </h2>
          </div>
          <Link href="/talent">
            <Button variant="outline" className="rounded-xl border-zinc-200 dark:border-zinc-700 shrink-0">
              View All Talent
              <ArrowRight size={15} className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Talent Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {talents.map((talent) => (
            <div
              key={talent.name}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-400 flex items-center justify-center text-white font-bold text-lg mb-4">
                {talent.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                    {talent.name}
                  </h3>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      talent.status === "available"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {talent.role}
                </p>
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-1">
                  {talent.rate}
                </p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {talent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}