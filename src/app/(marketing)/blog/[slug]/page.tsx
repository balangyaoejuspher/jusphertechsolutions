
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react"
import { createMetadata, createStaticParams } from "@/lib/metadata"
import { allPosts } from "@/lib/posts"

const categoryColors: Record<string, string> = {
    Outsourcing: "bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-400/20",
    "Blockchain & Web3": "bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-400/20",
    Development: "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20",
    Products: "bg-violet-50 dark:bg-violet-400/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-400/20",
}

function CategoryBadge({ category }: { category: string }) {
    const color =
        categoryColors[category] ??
        "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/10"
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${color}`}>
            <Tag size={10} />
            {category}
        </span>
    )
}

function PostBody({ content }: { content: string }) {
    const paragraphs = content.trim().split(/\n\n+/)

    return (
        <div className="space-y-6">
            {paragraphs.map((block, i) => {
                if (block.startsWith("## ")) {
                    return (
                        <h2
                            key={i}
                            className="text-2xl font-bold text-zinc-900 dark:text-white mt-10 mb-2 leading-snug"
                        >
                            {block.replace("## ", "")}
                        </h2>
                    )
                }

                const parts = block.split(/\*\*(.*?)\*\*/g)
                return (
                    <p key={i} className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[1.05rem]">
                        {parts.map((part, j) =>
                            j % 2 === 1 ? (
                                <strong key={j} className="font-semibold text-zinc-900 dark:text-zinc-100">
                                    {part}
                                </strong>
                            ) : (
                                part
                            )
                        )}
                    </p>
                )
            })}
        </div>
    )
}

export function generateStaticParams() {
    return createStaticParams({ items: allPosts })
}

export const generateMetadata = createMetadata({
    items: allPosts,
    notFoundTitle: "Post Not Found",
})

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = allPosts.find((p) => p.slug === slug)
    if (!post) notFound()

    const related = allPosts
        .filter((p) => p.slug !== post.slug && p.category === post.category)
        .slice(0, 2)

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">

            <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-zinc-950" />

                <div className="container relative mx-auto px-6 md:px-12 max-w-3xl">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors mb-8 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to Blog
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <CategoryBadge category={post.category} />
                        {post.tag && (
                            <span className="px-3 py-1 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-500 dark:text-amber-400 text-xs font-bold">
                                ★ {post.tag}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-tight mb-6">
                        {post.title}
                    </h1>

                    <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed mb-8">
                        {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 dark:text-zinc-500 pt-6 border-t border-zinc-100 dark:border-white/5">
                        <span className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                                <span className="text-amber-500 text-xs font-black">J</span>
                            </div>
                            <span>
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{post.author}</span>
                                {post.role && <span className="text-zinc-400 dark:text-zinc-600"> · {post.role}</span>}
                            </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar size={13} />
                            {post.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {post.readTime}
                        </span>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 md:px-12 max-w-3xl py-14">
                <PostBody content={post.content} />
            </section>

            <div className="container mx-auto px-6 md:px-12 max-w-3xl">
                <div className="border-t border-zinc-100 dark:border-white/5" />
            </div>

            {related.length > 0 && (
                <section className="container mx-auto px-6 md:px-12 max-w-3xl py-14">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-6">
                        More in {post.category}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {related.map((rp) => (
                            <Link
                                key={rp.slug}
                                href={`/blog/${rp.slug}`}
                                className="group flex flex-col gap-2 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-amber-400/40 dark:hover:border-amber-500/20 transition-all duration-300"
                            >
                                <CategoryBadge category={rp.category} />
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                                    {rp.title}
                                </h3>
                                <span className="flex items-center gap-1 text-xs text-zinc-400">
                                    <Clock size={11} /> {rp.readTime}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <div className="container mx-auto px-6 md:px-12 max-w-3xl pb-20">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:border-amber-400/40 hover:text-amber-500 dark:hover:text-amber-400 transition-all group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to all posts
                </Link>
            </div>

        </div>
    )
}