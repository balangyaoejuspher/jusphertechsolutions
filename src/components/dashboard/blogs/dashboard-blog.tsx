"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Plus, X, Search, Calendar, Clock, Tag,
    Pencil, Trash2, Eye, EyeOff, NotebookPen, MoreHorizontal, Loader2,
} from "lucide-react"
import { BLOG_CATEGORIES, BLOG_CATEGORY_COLORS } from "@/lib/helpers/constants"
import { type BlogPost, BlogPostModal } from "./create-blog-modal"
import { portalFetch } from "@/lib/api/private-fetcher"
import { toast } from "sonner"
import type { Post, PostStatus, PostCategory } from "@/server/db/schema"

type DashboardPost = Post

const BASE = "/admin/blog"

export default function DashboardBlog() {
    const [posts, setPosts] = useState<DashboardPost[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterCategory, setFilterCategory] = useState("All")
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")
    const [selected, setSelected] = useState<DashboardPost | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [editPost, setEditPost] = useState<DashboardPost | null>(null)
    const [menuOpen, setMenuOpen] = useState<string | null>(null)
    const [togglingId, setTogglingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const fetchPosts = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.set("search", search)
            if (filterStatus !== "all") params.set("status", filterStatus)
            if (filterCategory !== "All") params.set("category", filterCategory)
            params.set("limit", "100")

            const result = await portalFetch.get<{ items: DashboardPost[]; total: number }>(
                `${BASE}?${params.toString()}`
            )
            setPosts(result.items)
            setTotal(result.total)
        } catch {
            toast.error("Failed to load posts")
        } finally {
            setLoading(false)
        }
    }, [search, filterStatus, filterCategory])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const counts = {
        all: total,
        published: posts.filter((p) => p.status === "published").length,
        draft: posts.filter((p) => p.status === "draft").length,
    }

    const openAdd = () => {
        setEditPost(null)
        setShowModal(true)
    }

    const openEdit = (post: DashboardPost) => {
        setEditPost(post)
        setMenuOpen(null)
        setShowModal(true)
    }

    const handleSave = async (form: BlogPost) => {
        if (editPost) {
            const updated = await portalFetch.patch<DashboardPost>(`${BASE}/${editPost.id}`, form)
            setPosts((prev) => prev.map((p) => p.id === editPost.id ? updated : p))
            if (selected?.id === editPost.id) setSelected(updated)
            toast.success("Post updated")
        } else {
            const created = await portalFetch.post<DashboardPost>(BASE, form)
            setPosts((prev) => [created, ...prev])
            setTotal((t) => t + 1)
            toast.success("Post created")
        }

        setShowModal(false)
        setEditPost(null)
    }
    const handleDelete = async (id: string) => {
        setDeletingId(id)
        setMenuOpen(null)
        try {
            await portalFetch.delete(`${BASE}/${id}`)
            setPosts((prev) => prev.filter((p) => p.id !== id))
            setTotal((t) => t - 1)
            if (selected?.id === id) setSelected(null)
            toast.success("Post deleted")
        } catch (err: any) {
            toast.error(err.message ?? "Failed to delete post")
        } finally {
            setDeletingId(null)
        }
    }

    const toggleStatus = async (id: string) => {
        const post = posts.find((p) => p.id === id)
        if (!post) return

        const newStatus: PostStatus = post.status === "published" ? "draft" : "published"
        setTogglingId(id)
        setMenuOpen(null)
        try {
            const updated = await portalFetch.patch<DashboardPost>(`${BASE}/${id}`, { status: newStatus })
            setPosts((prev) => prev.map((p) => p.id === id ? updated : p))
            if (selected?.id === id) setSelected(updated)
            toast.success(newStatus === "published" ? "Post published" : "Post unpublished")
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update status")
        } finally {
            setTogglingId(null)
        }
    }

    return (
        <div className="p-8 md:p-10 h-full">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Blog</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        {counts.published} published · {counts.draft} drafts
                    </p>
                </div>
                <Button
                    onClick={openAdd}
                    className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 shadow-sm"
                >
                    <Plus size={16} />
                    New Post
                </Button>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap mb-4">
                {(["all", "published", "draft"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize",
                            filterStatus === s
                                ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        )}
                    >
                        {s === "all" ? "All Posts" : s.charAt(0).toUpperCase() + s.slice(1)}
                        <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded-md font-semibold",
                            filterStatus === s
                                ? "bg-white/20 text-white dark:text-zinc-950"
                                : "bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400"
                        )}>
                            {counts[s]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Category filter + Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex gap-2 flex-wrap">
                    {BLOG_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                filterCategory === cat
                                    ? "bg-zinc-900 dark:bg-white/10 text-white border-transparent"
                                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                            )}
                        >
                            {cat}
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
                        className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all"
                    />
                </div>
            </div>

            {/* Split Panel */}
            <div className="flex gap-6">

                {/* Post List */}
                <div className={cn(
                    "flex flex-col gap-3 transition-all duration-300",
                    selected ? "w-full lg:w-2/5" : "w-full"
                )}>
                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-zinc-400 text-sm gap-2">
                            <Loader2 size={16} className="animate-spin" /> Loading posts...
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16 text-zinc-400 dark:text-zinc-600 text-sm bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl">
                            No posts found.
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => setSelected(post)}
                                className={cn(
                                    "bg-white dark:bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-all duration-150 hover:shadow-sm relative",
                                    selected?.id === post.id
                                        ? "border-amber-400 shadow-sm shadow-amber-100 dark:shadow-amber-500/10"
                                        : "border-zinc-100 dark:border-white/5 hover:border-zinc-200 dark:hover:border-white/10"
                                )}
                            >
                                {/* Menu */}
                                <div
                                    className="absolute top-4 right-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <MoreHorizontal size={14} />
                                    </button>
                                    {menuOpen === post.id && (
                                        <div className="absolute right-0 top-8 z-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg py-1 w-40">
                                            <button
                                                onClick={() => openEdit(post)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2"
                                            >
                                                <Pencil size={13} className="text-zinc-400" /> Edit
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(post.id)}
                                                disabled={togglingId === post.id}
                                                className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {togglingId === post.id
                                                    ? <><Loader2 size={13} className="animate-spin" /> Updating...</>
                                                    : post.status === "published"
                                                        ? <><EyeOff size={13} className="text-zinc-400" /> Unpublish</>
                                                        : <><Eye size={13} className="text-zinc-400" /> Publish</>
                                                }
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                disabled={deletingId === post.id}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {deletingId === post.id
                                                    ? <><Loader2 size={13} className="animate-spin" /> Deleting...</>
                                                    : <><Trash2 size={13} /> Delete</>
                                                }
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex items-center gap-2 mb-2 pr-8">
                                    <span className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-semibold",
                                        BLOG_CATEGORY_COLORS[post.category] ?? "bg-zinc-100 dark:bg-white/5 text-zinc-500 border-zinc-200"
                                    )}>
                                        <Tag size={9} />
                                        {post.category}
                                    </span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-xs font-semibold",
                                        post.status === "published"
                                            ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                                            : "bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500"
                                    )}>
                                        {post.status === "published" ? "Published" : "Draft"}
                                    </span>
                                </div>

                                <h3 className="font-bold text-zinc-900 dark:text-white text-sm leading-snug mb-1.5 pr-6">
                                    {post.title}
                                </h3>
                                <p className="text-zinc-400 dark:text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-3">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-3 text-zinc-300 dark:text-zinc-600 text-xs">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={10} /> {post.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={10} /> {post.readTime}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Detail Panel */}
                {selected && (
                    <div className="hidden lg:flex flex-col flex-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl overflow-hidden">

                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                            <h3 className="font-bold text-zinc-900 dark:text-white">Post Details</h3>
                            <button
                                onClick={() => setSelected(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-6">

                            {/* Title + Category */}
                            <div className="flex items-start gap-3 mb-5">
                                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                                    <NotebookPen size={20} className="text-amber-500" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-zinc-900 dark:text-white text-base leading-snug mb-1">
                                        {selected.title}
                                    </h2>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-semibold",
                                            BLOG_CATEGORY_COLORS[selected.category] ?? "bg-zinc-100 dark:bg-white/5 text-zinc-500 border-zinc-200"
                                        )}>
                                            <Tag size={9} /> {selected.category}
                                        </span>
                                        {selected.tag && (
                                            <span className="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-500 text-xs font-semibold">
                                                ★ {selected.tag}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Slug */}
                            {selected.slug && (
                                <div className="mb-4 px-3 py-2 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-0.5">URL</p>
                                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                                        /blog/{selected.slug}
                                    </p>
                                </div>
                            )}

                            {/* Meta */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                {[
                                    { label: "Author", value: selected.author },
                                    { label: "Role", value: selected.role ?? "—" },
                                    { label: "Read Time", value: selected.readTime },
                                    { label: "Date", value: selected.date },
                                    { label: "Status", value: selected.status === "published" ? "Published" : "Draft" },
                                ].map((item) => (
                                    <div key={item.label} className="bg-zinc-50 dark:bg-white/5 rounded-xl p-3">
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">{item.label}</p>
                                        <p className={cn(
                                            "text-sm font-semibold",
                                            item.label === "Status"
                                                ? selected.status === "published"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-zinc-400 dark:text-zinc-500"
                                                : "text-zinc-900 dark:text-white"
                                        )}>
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Excerpt */}
                            <div className="mb-5">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Excerpt</p>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed bg-zinc-50 dark:bg-white/5 rounded-xl p-4">
                                    {selected.excerpt}
                                </p>
                            </div>

                            {/* Content preview */}
                            {selected.content && (
                                <div className="mb-6">
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Content Preview</p>
                                    <p className="text-zinc-500 dark:text-zinc-500 text-xs leading-relaxed bg-zinc-50 dark:bg-white/5 rounded-xl p-4 line-clamp-4 font-mono">
                                        {selected.content}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={() => openEdit(selected)}
                                    className="h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2"
                                >
                                    <Pencil size={14} /> Edit Post
                                </Button>
                                <Button
                                    onClick={() => toggleStatus(selected.id)}
                                    disabled={togglingId === selected.id}
                                    variant="outline"
                                    className="h-11 rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 gap-2 disabled:opacity-50"
                                >
                                    {togglingId === selected.id
                                        ? <><Loader2 size={14} className="animate-spin" /> Updating...</>
                                        : selected.status === "published"
                                            ? <><EyeOff size={14} /> Unpublish</>
                                            : <><Eye size={14} /> Publish</>
                                    }
                                </Button>
                                <Button
                                    onClick={() => handleDelete(selected.id)}
                                    disabled={deletingId === selected.id}
                                    className="h-11 rounded-xl border border-zinc-200 dark:border-white/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20 gap-2 bg-transparent disabled:opacity-50"
                                >
                                    {deletingId === selected.id
                                        ? <><Loader2 size={14} className="animate-spin" /> Deleting...</>
                                        : <><Trash2 size={14} /> Delete Post</>
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <BlogPostModal
                open={showModal}
                editPost={editPost}
                onClose={() => {
                    setShowModal(false)
                    setEditPost(null)
                }}
                onSave={handleSave}
                BLOG_CATEGORIES={BLOG_CATEGORIES}
            />
        </div>
    )
}