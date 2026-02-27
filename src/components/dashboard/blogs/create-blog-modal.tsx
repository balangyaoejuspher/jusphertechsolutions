"use client"

import { useState, useEffect, useRef } from "react"
import {
    X, Eye, Pencil, Clock, Tag,
    ArrowRight, ArrowLeft, Sparkles, Calendar,
    AlignLeft,
    FileText, LayoutGrid, Loader2,
    PenLine,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomSelect } from "@/components/ui/custom-select"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/shared/rich-text-editor"

export interface BlogPost {
    id?: string
    slug: string
    title: string
    category: string
    excerpt: string
    author: string
    role?: string | null
    date: string
    readTime: string
    tag?: string | null
    content: string
    status: "published" | "draft"
}

interface BlogPostModalProps {
    open: boolean
    editPost: BlogPost | null
    onClose: () => void
    onSave: (form: BlogPost) => Promise<void>
    BLOG_CATEGORIES: string[]
}

const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"

const labelCls =
    "text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2"

const categoryColors: Record<string, string> = {
    "Outsourcing": "bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-400/20",
    "Blockchain & Web3": "bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-400/20",
    "Development": "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20",
    "Products": "bg-violet-50 dark:bg-violet-400/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-400/20",
}

function CategoryBadge({ category }: { category: string }) {
    const color =
        categoryColors[category] ??
        "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/10"
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${color}`}>
            <Tag size={10} />
            {category || "Category"}
        </span>
    )
}

function PostBody({ content }: { content: string }) {
    if (!content.trim() || content === "<p></p>") {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                <FileText size={28} className="text-zinc-300 dark:text-zinc-700" />
                <p className="text-xs text-zinc-400 dark:text-zinc-600 italic">
                    Your article content will render here.
                </p>
            </div>
        )
    }

    return (
        <div
            className="prose prose-sm dark:prose-invert max-w-none 
                prose-p:text-zinc-600 dark:prose-p:text-zinc-400
                prose-headings:text-zinc-900 dark:prose-headings:text-white
                prose-strong:text-zinc-900 dark:prose-strong:text-white
                prose-li:text-zinc-600 dark:prose-li:text-zinc-400
                prose-blockquote:border-amber-400 prose-blockquote:text-zinc-500"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    )
}

function GridCardPreview({ form, index = 0 }: { form: BlogPost; index?: number }) {
    const hasTitle = form.title.trim().length > 0
    const hasExcerpt = form.excerpt.trim().length > 0
    const date = form.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

    return (
        <div className="flex flex-col bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden">
            <div className={cn(
                "h-1 w-full",
                index % 2 === 0
                    ? "bg-gradient-to-r from-amber-400/60 to-amber-300/20"
                    : "bg-gradient-to-r from-zinc-300/40 dark:from-zinc-700/40 to-transparent"
            )} />
            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between mb-4">
                    <CategoryBadge category={form.category} />
                    <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-600">
                        <Clock size={11} />
                        {form.readTime || "— min read"}
                    </span>
                </div>
                <h3 className={cn(
                    "text-base font-bold leading-snug mb-3 flex-1 line-clamp-2",
                    hasTitle ? "text-zinc-900 dark:text-white" : "text-zinc-300 dark:text-zinc-700 italic"
                )}>
                    {hasTitle ? form.title : "Your post title will appear here..."}
                </h3>
                <p className={cn(
                    "text-sm leading-relaxed mb-5 line-clamp-3",
                    hasExcerpt ? "text-zinc-500 dark:text-zinc-500" : "text-zinc-300 dark:text-zinc-700 italic"
                )}>
                    {hasExcerpt ? form.excerpt : "Your excerpt will appear here..."}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                            <span className="text-zinc-600 dark:text-zinc-400 text-[10px] font-black">
                                {(form.author || "A").charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-600">{date}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 dark:text-amber-400">
                        Read more <ArrowRight size={11} />
                    </span>
                </div>
            </div>
        </div>
    )
}

function FeaturedCardPreview({ form }: { form: BlogPost }) {
    const hasTitle = form.title.trim().length > 0
    const hasExcerpt = form.excerpt.trim().length > 0
    return (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-white/10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative p-6 flex gap-5 items-start">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-400 text-[10px] font-bold">★ Featured</span>
                        <CategoryBadge category={form.category} />
                    </div>
                    <h2 className={cn("text-lg font-bold leading-tight mb-3 line-clamp-2", hasTitle ? "text-white" : "text-zinc-600 italic")}>
                        {hasTitle ? form.title : "Your featured title here..."}
                    </h2>
                    <p className={cn("text-sm leading-relaxed mb-5 line-clamp-2", hasExcerpt ? "text-zinc-400" : "text-zinc-700 italic")}>
                        {hasExcerpt ? form.excerpt : "Your excerpt will appear here..."}
                    </p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                                <span className="text-amber-400 text-[10px] font-black">
                                    {(form.author || "A").charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-white text-xs font-semibold leading-none">{form.author || "Author Name"}</p>
                                {form.role && <p className="text-zinc-500 text-[10px] mt-0.5">{form.role}</p>}
                            </div>
                        </div>
                        <span className="flex items-center gap-1.5 text-zinc-500 text-xs">
                            <Clock size={11} /> {form.readTime || "— min read"}
                        </span>
                    </div>
                </div>
                <div className="shrink-0 self-center">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                        <ArrowRight size={16} className="text-amber-400" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ArticleHeaderPreview({ form }: { form: BlogPost }) {
    const hasTitle = form.title.trim().length > 0
    const hasExcerpt = form.excerpt.trim().length > 0
    const date = form.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

    return (
        <div className="relative rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-white/5">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-zinc-950" />
            <div className="relative px-5 pt-5 pb-6">
                <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 mb-5">
                    <ArrowLeft size={11} /> Back to Blog
                </div>
                <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                    <CategoryBadge category={form.category} />
                    {form.tag && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-500 dark:text-amber-400 text-[10px] font-bold">
                            ★ {form.tag}
                        </span>
                    )}
                </div>
                <h1 className={cn("text-xl font-bold leading-tight mb-4", hasTitle ? "text-zinc-900 dark:text-white" : "text-zinc-300 dark:text-zinc-700 italic")}>
                    {hasTitle ? form.title : "Your post title will appear here..."}
                </h1>
                <p className={cn("text-sm leading-relaxed mb-5", hasExcerpt ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-300 dark:text-zinc-700 italic")}>
                    {hasExcerpt ? form.excerpt : "Your excerpt will appear here..."}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 pt-5 border-t border-zinc-100 dark:border-white/5">
                    <span className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                            <span className="text-amber-500 text-[9px] font-black">
                                {(form.author || "A").charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span>
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{form.author || "Author"}</span>
                            {form.role && <span className="text-zinc-400 dark:text-zinc-600"> · {form.role}</span>}
                        </span>
                    </span>
                    <span className="flex items-center gap-1.5"><Calendar size={11} /> {date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={11} /> {form.readTime || "— min read"}</span>
                </div>
            </div>
        </div>
    )
}

function ContentEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <RichTextEditor
            value={value}
            onChange={onChange}
            placeholder="Write your article here..."
            maxCharacters={20000}
            editorClassName="min-h-[280px]"
        />
    )
}

type PreviewTab = "card" | "article" | "content"

function PreviewPanel({ form }: { form: BlogPost }) {
    const [tab, setTab] = useState<PreviewTab>("card")

    const tabs: { key: PreviewTab; label: string; icon: React.ReactNode }[] = [
        { key: "card", label: "Cards", icon: <LayoutGrid size={10} /> },
        { key: "article", label: "Header", icon: <FileText size={10} /> },
        { key: "content", label: "Content", icon: <PenLine size={10} /> },
    ]

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between shrink-0">
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                    <Eye size={10} /> Live Preview
                </p>
                <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                    form.status === "published"
                        ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-600"
                )}>
                    {form.status === "published" ? "● Published" : "○ Draft"}
                </span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-white/5 rounded-xl shrink-0">
                {tabs.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => setTab(key)} className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1",
                        tab === key
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                    )}>
                        {icon}{label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-5 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:dark:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                {tab === "card" && (
                    <>
                        <div>
                            <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">Blog grid card</p>
                            <GridCardPreview form={form} index={0} />
                        </div>
                        {form.tag ? (
                            <div>
                                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">As featured post</p>
                                <FeaturedCardPreview form={form} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                                    ✦ Add a <span className="font-semibold">Tag</span> (e.g. "Featured") to unlock the featured post preview
                                </span>
                            </div>
                        )}
                    </>
                )}
                {tab === "article" && (
                    <div>
                        <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">/blog/[slug] page header</p>
                        <ArticleHeaderPreview form={form} />
                    </div>
                )}
                {tab === "content" && (
                    <div>
                        <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">Article body render</p>
                        <div className="rounded-2xl border border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900 p-5">
                            <PostBody content={form.content} />
                        </div>
                    </div>
                )}
                <p className="text-[10px] text-zinc-400 dark:text-zinc-600 text-center mt-auto pt-2 shrink-0">
                    Updates in real time as you type
                </p>
            </div>
        </div>
    )
}

type FormStep = "meta" | "content"

export function BlogPostModal({ open, editPost, onClose, onSave, BLOG_CATEGORIES }: BlogPostModalProps) {
    const today = new Date().toISOString().slice(0, 10)

    const defaultForm = (): BlogPost => ({
        slug: "",
        title: "",
        category: BLOG_CATEGORIES.filter((c) => c !== "All")[0] ?? "",
        excerpt: "",
        author: "",
        role: "",
        date: today,
        readTime: "",
        tag: "",
        content: "",
        status: "published",
    })

    const [form, setForm] = useState<BlogPost>(defaultForm)
    const [step, setStep] = useState<FormStep>("meta")
    const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (open) {
            setForm(editPost ?? defaultForm())
            setStep("meta")
            setMobileTab("edit")
            setSaving(false)
        }
    }, [open, editPost])

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === "Escape" && !saving) onClose() }
        window.addEventListener("keydown", h)
        return () => window.removeEventListener("keydown", h)
    }, [onClose, saving])

    if (!open) return null

    const categoryOptions = BLOG_CATEGORIES.filter((c) => c !== "All").map((c) => ({ value: c, label: c }))
    const metaComplete = form.title.trim() && form.excerpt.trim()
    const canSave = metaComplete && !saving

    const set = <K extends keyof BlogPost>(key: K, value: BlogPost[K]) =>
        setForm((f) => ({ ...f, [key]: value }))

    function handleTitleChange(title: string) {
        set("title", title)
        if (!editPost) {
            const slug = title.toLowerCase().trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
            set("slug", slug)
        }
    }

    async function handleSave() {
        if (!canSave) return
        setSaving(true)
        try {
            await onSave(form)
        } catch {
            // parent shows toast; modal stays open
        } finally {
            setSaving(false)
        }
    }

    const saveLabel = saving
        ? <><Loader2 size={14} className="animate-spin" /> {editPost ? "Saving..." : "Publishing..."}</>
        : editPost ? "Save Changes" : "Publish Post"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={saving ? undefined : onClose} />

            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl w-full max-w-5xl max-h-[92dvh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            {editPost
                                ? <Pencil size={14} className="text-amber-500" />
                                : <Sparkles size={14} className="text-amber-500" />
                            }
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white text-lg leading-none">
                                {editPost ? "Edit Post" : "New Post"}
                            </h2>
                            {form.slug && (
                                <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5 font-mono">
                                    /blog/{form.slug}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-1 p-1 bg-zinc-100 dark:bg-white/5 rounded-xl">
                            {(["meta", "content"] as FormStep[]).map((s) => (
                                <button key={s} onClick={() => setStep(s)} className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                                    step === s
                                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300",
                                    s === "content" && !metaComplete && "opacity-40 pointer-events-none"
                                )}>
                                    {s === "meta" ? <Tag size={11} /> : <AlignLeft size={11} />}
                                    {s === "meta" ? "Details" : "Content"}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-0.5 p-1 bg-zinc-100 dark:bg-white/5 rounded-xl md:hidden">
                            {(["edit", "preview"] as const).map((tab) => (
                                <button key={tab} onClick={() => setMobileTab(tab)} className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                                    mobileTab === tab
                                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                                        : "text-zinc-500 dark:text-zinc-400"
                                )}>
                                    {tab === "edit" ? <Pencil size={11} /> : <Eye size={11} />}
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={saving ? undefined : onClose}
                            disabled={saving}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden min-h-0">

                    {/* Left — Form */}
                    <div className={cn(
                        "flex flex-col flex-1 overflow-y-auto px-6 py-5 gap-4",
                        "md:border-r md:border-zinc-100 md:dark:border-white/5",
                        "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:dark:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full",
                        mobileTab === "preview" ? "hidden md:flex" : "flex"
                    )}>
                        {step === "meta" && (
                            <>
                                <div>
                                    <label className={labelCls}>Title *</label>
                                    <input type="text" placeholder="Post title..." value={form.title}
                                        onChange={(e) => handleTitleChange(e.target.value)} className={inputCls} />
                                </div>

                                <div>
                                    <label className={labelCls}>
                                        Slug <span className="ml-1.5 normal-case font-normal tracking-normal text-zinc-400 dark:text-zinc-600">(auto-generated)</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 dark:text-zinc-600 select-none pointer-events-none">/blog/</span>
                                        <input type="text" placeholder="my-post-slug" value={form.slug}
                                            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                                            className={cn(inputCls, "pl-[3.25rem] font-mono text-xs")} />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Category</label>
                                    <CustomSelect value={form.category} options={categoryOptions}
                                        onChange={(v) => set("category", v)} placeholder="Select category" />
                                </div>

                                <div>
                                    <label className={labelCls}>Excerpt *</label>
                                    <textarea rows={3} placeholder="Shown on the blog grid card and at the top of the article page..."
                                        value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)}
                                        className={cn(inputCls, "resize-none")} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Author</label>
                                        <input type="text" placeholder="Jane Doe" value={form.author}
                                            onChange={(e) => set("author", e.target.value)} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>
                                            Role <span className="ml-1 normal-case font-normal tracking-normal text-zinc-400 dark:text-zinc-600">(optional)</span>
                                        </label>
                                        <input type="text" placeholder="CTO" value={form.role ?? ""}
                                            onChange={(e) => set("role", e.target.value)} className={inputCls} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Date</label>
                                        <input type="date" value={form.date}
                                            onChange={(e) => set("date", e.target.value)}
                                            className={cn(inputCls, "cursor-pointer")} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Read Time</label>
                                        <input type="text" placeholder="5 min read" value={form.readTime}
                                            onChange={(e) => set("readTime", e.target.value)} className={inputCls} />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>
                                        Tag <span className="ml-1.5 normal-case font-normal tracking-normal text-zinc-400 dark:text-zinc-600">(optional — e.g. Featured)</span>
                                    </label>
                                    <input type="text" placeholder="Featured" value={form.tag ?? ""}
                                        onChange={(e) => set("tag", e.target.value)} className={inputCls} />
                                    {form.tag && (
                                        <p className="text-[10px] text-amber-500 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                                            ★ Tag is set — "As featured post" preview is now unlocked
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5">
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Publish immediately</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Toggle off to save as draft</p>
                                    </div>
                                    <button
                                        onClick={() => set("status", form.status === "published" ? "draft" : "published")}
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
                            </>
                        )}

                        {step === "content" && (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <label className={labelCls}>Article Content</label>
                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                                        Supports <code className="bg-zinc-100 dark:bg-white/5 px-1 rounded">## heading</code> and <code className="bg-zinc-100 dark:bg-white/5 px-1 rounded">**bold**</code>
                                    </span>
                                </div>
                                <ContentEditor value={form.content} onChange={(v) => set("content", v)} />
                            </div>
                        )}
                    </div>

                    {/* Right — Preview */}
                    <div className={cn(
                        "w-full md:w-96 lg:w-[480px] shrink-0 overflow-y-auto px-5 py-5",
                        "bg-zinc-50/60 dark:bg-zinc-950/40",
                        "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:dark:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full",
                        mobileTab === "edit" ? "hidden md:block" : "block"
                    )}>
                        <PreviewPanel form={form} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 py-4 border-t border-zinc-100 dark:border-white/5 shrink-0">
                    {step === "meta" ? (
                        <>
                            <Button
                                onClick={() => setStep("content")}
                                disabled={!metaComplete}
                                className="flex-1 rounded-xl bg-zinc-900 dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold h-11 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Next: Write Content <ArrowRight size={14} />
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!canSave}
                                variant="outline"
                                className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving
                                    ? <><Loader2 size={13} className="animate-spin" /> Saving...</>
                                    : "Save without content"
                                }
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={handleSave}
                                disabled={!canSave}
                                className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                            >
                                {saveLabel}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setStep("meta")}
                                disabled={saving}
                                className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-5 flex items-center gap-2"
                            >
                                <ArrowLeft size={14} /> Back
                            </Button>
                        </>
                    )}
                    <Button
                        variant="outline"
                        onClick={saving ? undefined : onClose}
                        disabled={saving}
                        className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-5 disabled:opacity-40"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}