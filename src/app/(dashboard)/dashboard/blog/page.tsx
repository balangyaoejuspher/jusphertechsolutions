"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Plus, X, Search, Calendar, Clock, Tag,
    Pencil, Trash2, Eye, EyeOff, NotebookPen, MoreHorizontal,
} from "lucide-react"
import { allPosts } from "@/lib/posts"

type Post = {
    slug: string
    title: string
    category: string
    excerpt: string
    author: string
    date: string
    readTime: string
    status: "published" | "draft"
    tag?: string
}

const initialPosts: Post[] = allPosts.map((p) => ({
    ...p,
    status: "published" as const,
}))

const categories = ["All", "Outsourcing", "Blockchain & Web3", "Development", "Products"]

const categoryColors: Record<string, string> = {
    "Outsourcing": "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-400/20",
    "Blockchain & Web3": "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-400/20",
    "Development": "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20",
    "Products": "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-400/20",
}

const emptyForm = {
    title: "",
    category: "Outsourcing",
    excerpt: "",
    author: "Juspher Balangyao",
    readTime: "5 min read",
    status: "draft" as "published" | "draft",
    tag: "",
}

export default function DashboardBlogPage() {
    const [posts, setPosts] = useState<Post[]>(initialPosts)
    const [search, setSearch] = useState("")
    const [filterCategory, setFilterCategory] = useState("All")
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")
    const [selected, setSelected] = useState<Post | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [editPost, setEditPost] = useState<Post | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [menuOpen, setMenuOpen] = useState<string | null>(null)

    // ── Filtering ──

    const filtered = posts
        .filter((p) => filterCategory === "All" || p.category === filterCategory)
        .filter((p) => filterStatus === "all" || p.status === filterStatus)
        .filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase()) ||
            p.author.toLowerCase().includes(search.toLowerCase())
        )

    const counts = {
        all: posts.length,
        published: posts.filter((p) => p.status === "published").length,
        draft: posts.filter((p) => p.status === "draft").length,
    }

    // ── Handlers ──

    const openAdd = () => {
        setEditPost(null)
        setForm(emptyForm)
        setShowModal(true)
    }

    const openEdit = (post: Post) => {
        setEditPost(post)
        setForm({
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            author: post.author,
            readTime: post.readTime,
            status: post.status,
            tag: post.tag ?? "",
        })
        setMenuOpen(null)
        setShowModal(true)
    }

    const handleSave = () => {
        if (!form.title || !form.excerpt) return
        const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

        if (editPost) {
            const updated = posts.map((p) =>
                p.slug === editPost.slug
                    ? { ...p, ...form, tag: form.tag || undefined }
                    : p
            )
            setPosts(updated)
            if (selected?.slug === editPost.slug) {
                setSelected(updated.find((p) => p.slug === editPost.slug) ?? null)
            }
        } else {
            const newPost: Post = {
                slug: form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                title: form.title,
                category: form.category,
                excerpt: form.excerpt,
                author: form.author,
                date: today,
                readTime: form.readTime,
                status: form.status,
                tag: form.tag || undefined,
            }
            setPosts([newPost, ...posts])
        }

        setShowModal(false)
        setEditPost(null)
        setForm(emptyForm)
    }

    const handleDelete = (slug: string) => {
        setPosts(posts.filter((p) => p.slug !== slug))
        if (selected?.slug === slug) setSelected(null)
        setMenuOpen(null)
    }

    const toggleStatus = (slug: string) => {
        const updated = posts.map((p) =>
            p.slug === slug
                ? { ...p, status: p.status === "published" ? "draft" as const : "published" as const }
                : p
        )
        setPosts(updated)
        if (selected?.slug === slug) {
            setSelected(updated.find((p) => p.slug === slug) ?? null)
        }
        setMenuOpen(null)
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
                    {categories.map((cat) => (
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
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-zinc-400 dark:text-zinc-600 text-sm bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl">
                            No posts found.
                        </div>
                    ) : (
                        filtered.map((post) => (
                            <div
                                key={post.slug}
                                onClick={() => setSelected(post)}
                                className={cn(
                                    "bg-white dark:bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-all duration-150 hover:shadow-sm relative",
                                    selected?.slug === post.slug
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
                                        onClick={() => setMenuOpen(menuOpen === post.slug ? null : post.slug)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <MoreHorizontal size={14} />
                                    </button>
                                    {menuOpen === post.slug && (
                                        <div className="absolute right-0 top-8 z-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg py-1 w-40">
                                            <button
                                                onClick={() => openEdit(post)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2"
                                            >
                                                <Pencil size={13} className="text-zinc-400" /> Edit
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(post.slug)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2"
                                            >
                                                {post.status === "published"
                                                    ? <><EyeOff size={13} className="text-zinc-400" /> Unpublish</>
                                                    : <><Eye size={13} className="text-zinc-400" /> Publish</>
                                                }
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.slug)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                                            >
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex items-center gap-2 mb-2 pr-8">
                                    <span className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-semibold",
                                        categoryColors[post.category] ?? "bg-zinc-100 dark:bg-white/5 text-zinc-500 border-zinc-200"
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
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-semibold",
                                            categoryColors[selected.category] ?? "bg-zinc-100 dark:bg-white/5 text-zinc-500 border-zinc-200"
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

                            {/* Meta */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                {[
                                    { label: "Author", value: selected.author },
                                    { label: "Read Time", value: selected.readTime },
                                    { label: "Published", value: selected.date },
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
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Excerpt</p>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed bg-zinc-50 dark:bg-white/5 rounded-xl p-4">
                                    {selected.excerpt}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={() => openEdit(selected)}
                                    className="h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2"
                                >
                                    <Pencil size={14} /> Edit Post
                                </Button>
                                <Button
                                    onClick={() => toggleStatus(selected.slug)}
                                    variant="outline"
                                    className="h-11 rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 gap-2"
                                >
                                    {selected.status === "published"
                                        ? <><EyeOff size={14} /> Unpublish</>
                                        : <><Eye size={14} /> Publish</>
                                    }
                                </Button>
                                <Button
                                    onClick={() => handleDelete(selected.slug)}
                                    className="h-11 rounded-xl border border-zinc-200 dark:border-white/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20 gap-2 bg-transparent"
                                >
                                    <Trash2 size={14} /> Delete Post
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-xl">
                                {editPost ? "Edit Post" : "New Post"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Title */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Title *</label>
                                <input
                                    type="text"
                                    placeholder="Post title..."
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all"
                                >
                                    {categories.filter((c) => c !== "All").map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Excerpt *</label>
                                <textarea
                                    rows={3}
                                    placeholder="Brief summary of the post..."
                                    value={form.excerpt}
                                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Author + Read Time */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Author</label>
                                    <input
                                        type="text"
                                        value={form.author}
                                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Read Time</label>
                                    <input
                                        type="text"
                                        placeholder="5 min read"
                                        value={form.readTime}
                                        onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Tag */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                    Tag <span className="normal-case text-zinc-400 font-normal">(optional, e.g. Featured)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Featured"
                                    value={form.tag}
                                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Status Toggle */}
                            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Publish immediately</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Toggle off to save as draft</p>
                                </div>
                                <button
                                    onClick={() => setForm({ ...form, status: form.status === "published" ? "draft" : "published" })}
                                    className={cn(
                                        "w-11 h-6 rounded-full transition-all duration-200 relative shrink-0",
                                        form.status === "published" ? "bg-amber-400" : "bg-zinc-200 dark:bg-zinc-700"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200",
                                        form.status === "published" ? "left-6" : "left-1"
                                    )} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                onClick={handleSave}
                                className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11"
                            >
                                {editPost ? "Save Changes" : "Create Post"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowModal(false)}
                                className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-5"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}