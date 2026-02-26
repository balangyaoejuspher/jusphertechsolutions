"use client"

import { useState } from "react"
import { X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { portalFetch } from "@/lib/api/private-fetcher"
import { toast } from "sonner"
import type { Product, } from "@/server/db/schema"
import type { ProductFeature, ProductPricing } from "@/types"
import { CustomSelect } from "@/components/ui/custom-select"

const CATEGORY_OPTIONS = [
    { value: "developer_tools", label: "Developer Tools" },
    { value: "productivity", label: "Productivity" },
    { value: "analytics", label: "Analytics" },
    { value: "communication", label: "Communication" },
    { value: "security", label: "Security" },
    { value: "other", label: "Other" },
] as const

const STATUS_OPTIONS = [
    { value: "available", label: "Available" },
    { value: "coming_soon", label: "Coming Soon" },
    { value: "beta", label: "Beta" },
    { value: "maintenance", label: "Maintenance" },
    { value: "deprecated", label: "Deprecated" },
] as const

const ICON_OPTIONS = [
    "Package", "Building2", "CreditCard", "GraduationCap",
    "ShoppingCart", "Briefcase", "Globe", "Cpu", "Shield",
    "BarChart2", "Code2", "Smartphone", "Database", "Cloud",
    "Lock", "Users", "Zap", "Star",
]

const ACCENT_OPTIONS = [
    { value: "amber", label: "Amber", dot: "bg-amber-400" },
    { value: "blue", label: "Blue", dot: "bg-blue-400" },
    { value: "violet", label: "Violet", dot: "bg-violet-400" },
    { value: "emerald", label: "Emerald", dot: "bg-emerald-400" },
    { value: "rose", label: "Rose", dot: "bg-rose-400" },
    { value: "cyan", label: "Cyan", dot: "bg-cyan-400" },
    { value: "orange", label: "Orange", dot: "bg-orange-400" },
]

type ProductFormState = {
    slug: string
    label: string
    tagline: string
    description: string
    icon: string
    accentColor: string
    bgColor: string
    borderColor: string
    textColor: string
    category: Product["category"]
    status: Product["status"]
    isVisible: boolean
    isFeatured: boolean
    isNew: boolean
    badge: string
    features: ProductFeature[]
    pricing: ProductPricing[]
    useCases: string[]
    techHighlights: string[]
}

const emptyForm: ProductFormState = {
    slug: "",
    label: "",
    tagline: "",
    description: "",
    icon: "Package",
    accentColor: "amber",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    borderColor: "border-amber-200 dark:border-amber-500/20",
    textColor: "text-amber-600 dark:text-amber-400",
    category: "other",
    status: "available",
    isVisible: true,
    isFeatured: false,
    isNew: false,
    badge: "",
    features: [],
    pricing: [],
    useCases: [],
    techHighlights: [],
}

const emptyFeature = (): ProductFeature => ({ title: "", description: "" })
const emptyPricing = (): ProductPricing => ({ label: "", price: "", note: "", highlight: false, features: [] })

const ACCENT_PRESETS: Record<string, Pick<ProductFormState, "accentColor" | "bgColor" | "borderColor" | "textColor">> = {
    amber: { accentColor: "amber", bgColor: "bg-amber-50 dark:bg-amber-500/10", borderColor: "border-amber-200 dark:border-amber-500/20", textColor: "text-amber-600 dark:text-amber-400" },
    blue: { accentColor: "blue", bgColor: "bg-blue-50 dark:bg-blue-500/10", borderColor: "border-blue-200 dark:border-blue-500/20", textColor: "text-blue-600 dark:text-blue-400" },
    violet: { accentColor: "violet", bgColor: "bg-violet-50 dark:bg-violet-500/10", borderColor: "border-violet-200 dark:border-violet-500/20", textColor: "text-violet-600 dark:text-violet-400" },
    emerald: { accentColor: "emerald", bgColor: "bg-emerald-50 dark:bg-emerald-500/10", borderColor: "border-emerald-200 dark:border-emerald-500/20", textColor: "text-emerald-600 dark:text-emerald-400" },
    rose: { accentColor: "rose", bgColor: "bg-rose-50 dark:bg-rose-500/10", borderColor: "border-rose-200 dark:border-rose-500/20", textColor: "text-rose-600 dark:text-rose-400" },
    cyan: { accentColor: "cyan", bgColor: "bg-cyan-50 dark:bg-cyan-500/10", borderColor: "border-cyan-200 dark:border-cyan-500/20", textColor: "text-cyan-600 dark:text-cyan-400" },
    orange: { accentColor: "orange", bgColor: "bg-orange-50 dark:bg-orange-500/10", borderColor: "border-orange-200 dark:border-orange-500/20", textColor: "text-orange-600 dark:text-orange-400" },
}

function Section({ title, children, defaultOpen = false }: {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-white/5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
            >
                {title}
                {open ? <ChevronUp size={14} className="text-zinc-400" /> : <ChevronDown size={14} className="text-zinc-400" />}
            </button>
            {open && <div className="p-4 flex flex-col gap-4">{children}</div>}
        </div>
    )
}

export function CreateProductModal({
    onClose,
    onCreated,
}: {
    onClose: () => void
    onCreated: (product: Product) => void
}) {
    const [form, setForm] = useState<ProductFormState>(emptyForm)
    const [saving, setSaving] = useState(false)
    const [step, setStep] = useState<"basic" | "content" | "pricing">("basic")

    const set = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const handleLabelChange = (label: string) => {
        set("label", label)
        set("slug", label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    }

    const addFeature = () => set("features", [...form.features, emptyFeature()])
    const updateFeature = (i: number, field: keyof ProductFeature, value: string) => {
        const updated = [...form.features]
        updated[i] = { ...updated[i], [field]: value }
        set("features", updated)
    }
    const removeFeature = (i: number) => set("features", form.features.filter((_, idx) => idx !== i))

    const addPricingTier = () => set("pricing", [...form.pricing, emptyPricing()])
    const updatePricing = <K extends keyof ProductPricing>(i: number, field: K, value: ProductPricing[K]) => {
        const updated = [...form.pricing]
        updated[i] = { ...updated[i], [field]: value }
        set("pricing", updated)
    }
    const addPricingFeature = (tierIdx: number) => {
        const updated = [...form.pricing]
        updated[tierIdx] = { ...updated[tierIdx], features: [...updated[tierIdx].features, ""] }
        set("pricing", updated)
    }
    const updatePricingFeature = (tierIdx: number, featIdx: number, value: string) => {
        const updated = [...form.pricing]
        const features = [...updated[tierIdx].features]
        features[featIdx] = value
        updated[tierIdx] = { ...updated[tierIdx], features }
        set("pricing", updated)
    }
    const removePricingFeature = (tierIdx: number, featIdx: number) => {
        const updated = [...form.pricing]
        updated[tierIdx] = { ...updated[tierIdx], features: updated[tierIdx].features.filter((_, i) => i !== featIdx) }
        set("pricing", updated)
    }
    const removePricingTier = (i: number) => set("pricing", form.pricing.filter((_, idx) => idx !== i))

    const addUseCase = () => set("useCases", [...form.useCases, ""])
    const updateUseCase = (i: number, value: string) => {
        const updated = [...form.useCases]
        updated[i] = value
        set("useCases", updated)
    }
    const removeUseCase = (i: number) => set("useCases", form.useCases.filter((_, idx) => idx !== i))

    const addTechHighlight = () => set("techHighlights", [...form.techHighlights, ""])
    const updateTechHighlight = (i: number, value: string) => {
        const updated = [...form.techHighlights]
        updated[i] = value
        set("techHighlights", updated)
    }
    const removeTechHighlight = (i: number) => set("techHighlights", form.techHighlights.filter((_, idx) => idx !== i))

    const handleCreate = async () => {
        if (!form.slug || !form.label || !form.tagline || !form.description) return
        setSaving(true)
        try {
            const created = await portalFetch.post<Product>("/admin/products", {
                slug: form.slug,
                label: form.label,
                tagline: form.tagline,
                description: form.description,
                icon: form.icon,
                accentColor: form.accentColor,
                bgColor: form.bgColor,
                borderColor: form.borderColor,
                textColor: form.textColor,
                category: form.category,
                status: form.status,
                isVisible: form.isVisible,
                isFeatured: form.isFeatured,
                isNew: form.isNew,
                badge: form.badge || null,
                features: form.features.filter((f) => f.title),
                pricing: form.pricing.filter((p) => p.label && p.price),
                useCases: form.useCases.filter(Boolean),
                techHighlights: form.techHighlights.filter(Boolean),
            })
            toast.success(`${created.label} has been added!`)
            onCreated(created)
            onClose()
        } catch (err: any) {
            toast.error(err.message ?? "Failed to create product")
        } finally {
            setSaving(false)
        }
    }

    const inputCls = "w-full h-10 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-colors"
    const labelCls = "text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5 block"
    const isValid = form.slug && form.label && form.tagline && form.description

    const STEPS = ["basic", "content", "pricing"] as const

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-zinc-900 dark:text-white">Add New Product</h2>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">Fill in the details to add a product to your catalog</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Step tabs */}
                <div className="flex border-b border-zinc-100 dark:border-white/5 shrink-0">
                    {STEPS.map((s, i) => (
                        <button
                            key={s}
                            onClick={() => setStep(s)}
                            className={cn(
                                "flex-1 py-3 text-xs font-semibold capitalize transition-colors border-b-2",
                                step === s
                                    ? "border-amber-400 text-amber-500 dark:text-amber-400"
                                    : "border-transparent text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400"
                            )}
                        >
                            {i + 1}. {s}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

                    {step === "basic" && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className={labelCls}>Product Name *</label>
                                    <input
                                        className={inputCls}
                                        placeholder="e.g. HRIS System"
                                        value={form.label}
                                        onChange={(e) => handleLabelChange(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelCls}>Slug *</label>
                                    <input
                                        className={inputCls}
                                        placeholder="e.g. hris-system"
                                        value={form.slug}
                                        onChange={(e) => set("slug", e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelCls}>Tagline *</label>
                                    <input
                                        className={inputCls}
                                        placeholder="One-liner pitch"
                                        value={form.tagline}
                                        onChange={(e) => set("tagline", e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelCls}>Description *</label>
                                    <textarea
                                        className={cn(inputCls, "h-20 py-2.5 resize-none")}
                                        placeholder="Full product description..."
                                        value={form.description}
                                        onChange={(e) => set("description", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Category</label>
                                    <CustomSelect
                                        value={form.category}
                                        options={CATEGORY_OPTIONS}
                                        onChange={(v) => set("category", v)}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Status</label>
                                    <CustomSelect
                                        value={form.status}
                                        options={STATUS_OPTIONS}
                                        onChange={(v) => set("status", v)}
                                    />
                                </div>
                            </div>

                            {/* Icon picker */}
                            <div>
                                <label className={labelCls}>Icon</label>
                                <div className="flex flex-wrap gap-2">
                                    {ICON_OPTIONS.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => set("icon", icon)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                                                form.icon === icon
                                                    ? "bg-amber-400/10 border-amber-400/40 text-amber-600 dark:text-amber-400"
                                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                            )}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Accent color */}
                            <div>
                                <label className={labelCls}>Accent Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {ACCENT_OPTIONS.map((a) => (
                                        <button
                                            key={a.value}
                                            type="button"
                                            onClick={() => setForm((prev) => ({ ...prev, ...ACCENT_PRESETS[a.value] }))}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                                                form.accentColor === a.value
                                                    ? "bg-zinc-100 dark:bg-white/10 border-zinc-400 dark:border-white/30 text-zinc-900 dark:text-white"
                                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300"
                                            )}
                                        >
                                            <span className={cn("w-3 h-3 rounded-full", a.dot)} />
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Flags */}
                            <div className="flex gap-3 flex-wrap">
                                {([
                                    { key: "isVisible" as const, label: "Visible on public page" },
                                    { key: "isFeatured" as const, label: "Featured" },
                                    { key: "isNew" as const, label: "Show 'New' badge" },
                                ]).map(({ key, label }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => set(key, !form[key])}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                                            form[key]
                                                ? "bg-amber-400/10 border-amber-400/40 text-amber-600 dark:text-amber-400"
                                                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-600"
                                        )}
                                    >
                                        <span className={cn("w-2 h-2 rounded-full", form[key] ? "bg-amber-400" : "bg-zinc-300 dark:bg-zinc-600")} />
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Badge */}
                            <div>
                                <label className={labelCls}>Custom Badge <span className="normal-case font-normal text-zinc-400">(optional)</span></label>
                                <input
                                    className={inputCls}
                                    placeholder="e.g. Popular, New, Beta"
                                    value={form.badge}
                                    onChange={(e) => set("badge", e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {step === "content" && (
                        <>
                            {/* Features */}
                            <Section title={`Features (${form.features.length})`} defaultOpen>
                                {form.features.map((f, i) => (
                                    <div key={i} className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600">Feature {i + 1}</span>
                                            <button type="button" onClick={() => removeFeature(i)} className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                        <input className={inputCls} placeholder="Feature title" value={f.title} onChange={(e) => updateFeature(i, "title", e.target.value)} />
                                        <textarea className={cn(inputCls, "h-16 py-2 resize-none")} placeholder="Feature description" value={f.description} onChange={(e) => updateFeature(i, "description", e.target.value)} />
                                    </div>
                                ))}
                                <button type="button" onClick={addFeature} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-zinc-300 dark:border-white/20 text-zinc-500 dark:text-zinc-400 text-sm hover:border-amber-400 hover:text-amber-500 transition-colors">
                                    <Plus size={14} /> Add Feature
                                </button>
                            </Section>

                            {/* Use Cases */}
                            <Section title={`Use Cases (${form.useCases.length})`}>
                                {form.useCases.map((uc, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input className={cn(inputCls, "flex-1")} placeholder="e.g. Small businesses" value={uc} onChange={(e) => updateUseCase(i, e.target.value)} />
                                        <button type="button" onClick={() => removeUseCase(i)} className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/20 transition-colors">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addUseCase} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-zinc-300 dark:border-white/20 text-zinc-500 dark:text-zinc-400 text-sm hover:border-amber-400 hover:text-amber-500 transition-colors">
                                    <Plus size={14} /> Add Use Case
                                </button>
                            </Section>

                            {/* Tech Highlights */}
                            <Section title={`Tech Highlights (${form.techHighlights.length})`}>
                                {form.techHighlights.map((t, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input className={cn(inputCls, "flex-1")} placeholder="e.g. Next.js, PostgreSQL" value={t} onChange={(e) => updateTechHighlight(i, e.target.value)} />
                                        <button type="button" onClick={() => removeTechHighlight(i)} className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/20 transition-colors">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addTechHighlight} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-zinc-300 dark:border-white/20 text-zinc-500 dark:text-zinc-400 text-sm hover:border-amber-400 hover:text-amber-500 transition-colors">
                                    <Plus size={14} /> Add Tech Stack
                                </button>
                            </Section>
                        </>
                    )}

                    {step === "pricing" && (
                        <>
                            {form.pricing.map((tier, i) => (
                                <div key={i} className="flex flex-col gap-3 p-4 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Tier {i + 1}</span>
                                        <button type="button" onClick={() => removePricingTier(i)} className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelCls}>Tier Name</label>
                                            <input className={inputCls} placeholder="e.g. Starter" value={tier.label} onChange={(e) => updatePricing(i, "label", e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Price</label>
                                            <input className={inputCls} placeholder="e.g. ₱900/mo" value={tier.price} onChange={(e) => updatePricing(i, "price", e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Note <span className="normal-case font-normal text-zinc-400">(optional)</span></label>
                                            <input className={inputCls} placeholder="e.g. Most Popular" value={tier.note ?? ""} onChange={(e) => updatePricing(i, "note", e.target.value)} />
                                        </div>
                                        <div className="flex items-end pb-0.5">
                                            <button
                                                type="button"
                                                onClick={() => updatePricing(i, "highlight", !tier.highlight)}
                                                className={cn(
                                                    "flex items-center gap-2 w-full h-10 px-3 rounded-xl border text-xs font-semibold transition-all",
                                                    tier.highlight
                                                        ? "bg-amber-400/10 border-amber-400/40 text-amber-600 dark:text-amber-400"
                                                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-600"
                                                )}
                                            >
                                                <span className={cn("w-2 h-2 rounded-full", tier.highlight ? "bg-amber-400" : "bg-zinc-300 dark:bg-zinc-600")} />
                                                Highlight this tier
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tier features */}
                                    <div>
                                        <label className={labelCls}>Included Features</label>
                                        <div className="flex flex-col gap-2">
                                            {tier.features.map((f, fi) => (
                                                <div key={fi} className="flex gap-2">
                                                    <input className={cn(inputCls, "flex-1")} placeholder="e.g. Up to 50 employees" value={f} onChange={(e) => updatePricingFeature(i, fi, e.target.value)} />
                                                    <button type="button" onClick={() => removePricingFeature(i, fi)} className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/20 transition-colors">
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addPricingFeature(i)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-zinc-300 dark:border-white/20 text-zinc-500 dark:text-zinc-400 text-xs hover:border-amber-400 hover:text-amber-500 transition-colors">
                                                <Plus size={12} /> Add feature
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addPricingTier}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-zinc-300 dark:border-white/20 text-zinc-500 dark:text-zinc-400 text-sm hover:border-amber-400 hover:text-amber-500 transition-colors"
                            >
                                <Plus size={14} /> Add Pricing Tier
                            </button>

                            {form.pricing.length === 0 && (
                                <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center py-4">
                                    No pricing tiers yet. Add at least one to display pricing on the product page.
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between gap-3 shrink-0">
                    <div className="flex gap-2">
                        {step !== "basic" && (
                            <button
                                type="button"
                                onClick={() => setStep(step === "pricing" ? "content" : "basic")}
                                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                            >
                                Back
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>

                        {step !== "pricing" ? (
                            <button
                                type="button"
                                onClick={() => setStep(step === "basic" ? "content" : "pricing")}
                                className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold transition-colors"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={!isValid || saving}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {saving && <div className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />}
                                <Plus size={14} />
                                Create Product
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}