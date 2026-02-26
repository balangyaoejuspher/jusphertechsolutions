"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, Clock, Tag, Search } from "lucide-react"
import type { Post } from "@/server/db/schema"
import { Metadata } from "next"

const categoryColors: Record<string, string> = {
  "Outsourcing": "bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-400/20",
  "Blockchain & Web3": "bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-400/20",
  "Development": "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20",
  "Products": "bg-violet-50 dark:bg-violet-400/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-400/20",
}

function CategoryBadge({ category }: { category: string }) {
  const color = categoryColors[category] ?? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/10"
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${color}`}>
      <Tag size={10} />
      {category}
    </span>
  )
}

export const metadata: Metadata = {
    title: "Blog",
    description: "Insights on outsourcing, blockchain, software development, and building remote teams — from the Juspher & Co. Tech Solutions team.",
}

export default function BlogPageClient({ posts }: { posts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")

  const featuredPost = useMemo(() => posts.find((p) => p.tag) ?? posts[0] ?? null, [posts])

  const categories = useMemo(() => {
    const map: Record<string, number> = {}
    for (const p of posts) {
      map[p.category] = (map[p.category] ?? 0) + 1
    }
    return [
      { label: "All", count: posts.length },
      ...Object.entries(map).map(([label, count]) => ({ label, count })),
    ]
  }, [posts])

  const filtered = useMemo(() => {
    return posts
      .filter((p) => p.slug !== featuredPost?.slug)
      .filter((p) => activeCategory === "All" || p.category === activeCategory)
      .filter((p) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
        )
      })
  }, [posts, featuredPost, activeCategory, search])

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-zinc-950" />
        <div className="container relative mx-auto px-6 md:px-12 text-center">
          <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            — Insights & Stories
          </p>
          <h1 className="text-6xl md:text-8xl font-bold text-zinc-900 dark:text-white leading-[0.95] tracking-tight mb-6">
            The Juspher & Co
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">Blog</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed font-light">
            Practical insights on outsourcing, blockchain, software, and building
            world-class remote teams — written by practitioners, not theorists.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 py-12">

        {/* Category filter + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${activeCategory === cat.label
                  ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 border-transparent"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400"
                  }`}
              >
                {cat.label}
                <span className="ml-2 text-xs opacity-50">{cat.count}</span>
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-amber-400 transition-all"
            />
          </div>
        </div>

        {/* Featured post */}
        {featuredPost && activeCategory === "All" && !search && (
          <div className="mb-10">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group relative block rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-white/10 hover:border-amber-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative p-10 md:p-14 flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-400 text-xs font-bold">
                      ★ {featuredPost.tag ?? "Featured"}
                    </span>
                    <CategoryBadge category={featuredPost.category} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 group-hover:text-amber-50 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed mb-8 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                        <span className="text-amber-400 text-xs font-black">
                          {featuredPost.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold leading-none">{featuredPost.author}</p>
                        {featuredPost.role && <p className="text-zinc-500 text-xs mt-0.5">{featuredPost.role}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-500 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} /> {featuredPost.readTime}
                      </span>
                      <span>{featuredPost.date}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 self-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center group-hover:bg-amber-400 group-hover:border-amber-400 transition-all duration-300">
                    <ArrowRight size={20} className="text-amber-400 group-hover:text-zinc-950 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Posts grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 dark:text-zinc-600 text-sm">
            No posts found{search ? ` for "${search}"` : ""}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filtered.map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-amber-400/40 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300"
              >
                <div className={`h-1 w-full ${i % 2 === 0 ? "bg-gradient-to-r from-amber-400/60 to-amber-300/20" : "bg-gradient-to-r from-zinc-300/40 dark:from-zinc-700/40 to-transparent"}`} />
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CategoryBadge category={post.category} />
                    <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-600">
                      <Clock size={11} /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-snug mb-3 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors flex-1">
                    {post.title}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                        <span className="text-zinc-600 dark:text-zinc-400 text-[10px] font-black">
                          {post.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400 dark:text-zinc-600">{post.date}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                      Read more <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="relative rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 overflow-hidden p-10 md:p-14 text-center mb-12">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/5 rounded-full blur-[40px] pointer-events-none" />
          <div className="relative">
            <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Stay in the loop
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
              Get New Posts in Your Inbox
            </h2>
            <p className="text-zinc-500 dark:text-zinc-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              No spam. Just practical insights on outsourcing, Web3, and building great software — delivered when we publish.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-12 px-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-colors"
              />
              <button className="h-12 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}