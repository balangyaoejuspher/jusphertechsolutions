import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Tag, Calendar, ArrowRight, Sparkles } from "lucide-react"
import { postService } from "@/server/services/blog.service"
import type { Metadata } from "next"

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

function TagBadge({ tag }: { tag: string }) {
    const isFeatured = tag.toLowerCase() === "featured"

    if (isFeatured) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-amber-300/10 border border-amber-400/40 text-amber-500 dark:text-amber-400 text-xs font-bold tracking-wide shadow-sm shadow-amber-400/10">
                <Sparkles size={10} className="shrink-0" />
                Featured
            </span>
        )
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
            {tag}
        </span>
    )
}

export function PostBody({ content }: { content: string }) {
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

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const post = await postService.getBySlug(slug)
    if (!post) return { title: "Post Not Found" }
    return {
        title: post.title,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const [post, allPublished] = await Promise.all([
        postService.getBySlug(slug),
        postService.getPublished({ limit: 100 }),
    ])

    if (!post || post.status !== "published") notFound()

    const isFeatured = post.tag?.toLowerCase() === "featured"

    const related = allPublished.items
        .filter((p) => p.slug !== post.slug && p.category === post.category)
        .slice(0, 2)

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">

            {/* ── Hero ── */}
            <section className={`relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden border-b ${isFeatured
                    ? "bg-zinc-900 border-white/5"
                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-white/5"
                }`}>
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />

                {/* Gradient fade */}
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${isFeatured ? "to-zinc-900" : "to-white dark:to-zinc-950"
                    }`} />

                {/* Featured ambient glow */}
                {isFeatured && (
                    <>
                        <div className="absolute top-0 right-1/4 w-96 h-64 bg-amber-400/8 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-1/4 w-64 h-48 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
                    </>
                )}

                <div className="container relative mx-auto px-6 md:px-12 max-w-3xl">

                    {/* Back link */}
                    <Link
                        href="/blog"
                        className={`inline-flex items-center gap-2 text-sm transition-colors mb-8 group ${isFeatured
                                ? "text-zinc-500 hover:text-amber-400"
                                : "text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400"
                            }`}
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to Blog
                    </Link>

                    {/* Badges */}
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <CategoryBadge category={post.category} />
                        {post.tag && <TagBadge tag={post.tag} />}
                    </div>

                    {/* Title */}
                    <h1 className={`text-4xl md:text-5xl font-bold leading-tight mb-6 ${isFeatured ? "text-white" : "text-zinc-900 dark:text-white"
                        }`}>
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    <p className={`text-lg leading-relaxed mb-8 ${isFeatured ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"
                        }`}>
                        {post.excerpt}
                    </p>

                    {/* Meta row */}
                    <div className={`flex flex-wrap items-center gap-6 text-sm pt-6 border-t ${isFeatured
                            ? "text-zinc-500 border-white/5"
                            : "text-zinc-400 dark:text-zinc-500 border-zinc-100 dark:border-white/5"
                        }`}>
                        <span className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${isFeatured
                                    ? "bg-amber-400/20 border-amber-400/30"
                                    : "bg-amber-400/20 border-amber-400/30"
                                }`}>
                                <span className="text-amber-500 text-xs font-black">
                                    {post.author.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span>
                                <span className={`font-semibold ${isFeatured ? "text-zinc-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                                    {post.author}
                                </span>
                                {post.role && (
                                    <span className={isFeatured ? "text-zinc-600" : "text-zinc-400 dark:text-zinc-600"}>
                                        {" "}· {post.role}
                                    </span>
                                )}
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

            {/* ── Body ── */}
            <section className="container mx-auto px-6 md:px-12 max-w-3xl py-14">
                <PostBody content={post.content} />
            </section>

            {/* ── Divider ── */}
            <div className="container mx-auto px-6 md:px-12 max-w-3xl">
                <div className="border-t border-zinc-100 dark:border-white/5" />
            </div>

            {/* ── Related posts ── */}
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
                                <div className="flex items-center justify-between">
                                    <CategoryBadge category={rp.category} />
                                    {rp.tag && <TagBadge tag={rp.tag} />}
                                </div>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                                    {rp.title}
                                </h3>
                                <div className="flex items-center justify-between mt-auto pt-1">
                                    <span className="flex items-center gap-1 text-xs text-zinc-400">
                                        <Clock size={11} /> {rp.readTime}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read <ArrowRight size={11} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Back button ── */}
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