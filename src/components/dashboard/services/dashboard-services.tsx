"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
    Code2, BriefcaseBusiness, Headphones, Globe, Smartphone,
    Database, Shield, Layers, Cpu, PenTool, BarChart, Cloud,
    GitBranch, Mail, ShoppingCart, Users, Settings, Zap,
    Check, MoreHorizontal, Pencil, Plus, X, ChevronLeft,
    ChevronRight, Loader2, Trash2, GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { portalFetch } from "@/lib/api/private-fetcher"
import { toast } from "sonner"
import type { Service } from "@/server/db/schema"
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    useSortable,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CustomSelect } from "@/components/ui/custom-select"


const iconMap: Record<string, React.ElementType> = {
    Code2, BriefcaseBusiness, Headphones, Globe, Smartphone,
    Database, Shield, Layers, Cpu, PenTool, BarChart, Cloud,
    GitBranch, Mail, ShoppingCart, Users, Settings, Zap,
}

const BASE = "/admin/services"
const PAGE_SIZE_OPTIONS = [3, 6, 9, 12]

type ServiceStatus = "active" | "inactive"

const emptyForm = {
    title: "",
    tagline: "",
    description: "",
    stack: "",
    icon: "Code2",
    status: "active" as ServiceStatus,
    category: "development" as "development" | "outsourcing",
}

function SortableServiceCard({
    service, menuOpen, setMenuOpen, togglingId, deletingId, onEdit, onToggle, onDelete,
}: {
    service: Service
    menuOpen: string | null
    setMenuOpen: (id: string | null) => void
    togglingId: string | null
    deletingId: string | null
    onEdit: (s: Service) => void
    onToggle: (id: string) => void
    onDelete: (id: string) => void
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id })
    const Icon = iconMap[service.icon] ?? Code2
    const isActive = service.status === "active"

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={cn(
                "group bg-white dark:bg-zinc-900 border rounded-2xl p-6 transition-all duration-200 relative",
                isDragging ? "opacity-50 shadow-2xl scale-105 z-50" : "",
                isActive
                    ? "border-zinc-100 dark:border-white/5 hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-md"
                    : "border-zinc-100 dark:border-white/5 opacity-60"
            )}
        >
            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-4 left-4 w-6 h-6 flex items-center justify-center text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-400 cursor-grab active:cursor-grabbing transition-colors"
            >
                <GripVertical size={14} />
            </div>

            {/* Status Badge */}
            <div className="absolute top-5 right-12">
                <span className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium",
                    isActive
                        ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                        : "bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400"
                )}>
                    {isActive ? "Active" : "Inactive"}
                </span>
            </div>

            {/* Menu */}
            <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => setMenuOpen(menuOpen === service.id ? null : service.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                >
                    <MoreHorizontal size={16} />
                </button>
                {menuOpen === service.id && (
                    <div className="absolute right-0 top-9 z-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg py-1 w-40">
                        <button onClick={() => onEdit(service)} className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2">
                            <Pencil size={13} className="text-zinc-400" /> Edit
                        </button>
                        <button
                            onClick={() => onToggle(service.id)}
                            disabled={togglingId === service.id}
                            className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2 disabled:opacity-50"
                        >
                            {togglingId === service.id
                                ? <><Loader2 size={13} className="animate-spin" /> Updating...</>
                                : <><Check size={13} className="text-zinc-400" /> {isActive ? "Deactivate" : "Activate"}</>
                            }
                        </button>
                        <button
                            onClick={() => onDelete(service.id)}
                            disabled={deletingId === service.id}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 disabled:opacity-50"
                        >
                            {deletingId === service.id
                                ? <><Loader2 size={13} className="animate-spin" /> Deleting...</>
                                : <><Trash2 size={13} /> Delete</>
                            }
                        </button>
                    </div>
                )}
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-5 mt-2 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10 transition-colors">
                <Icon size={20} className="text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
            </div>

            <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-1">{service.title}</h3>
            {service.tagline && <p className="text-xs font-medium text-amber-500 mb-2">{service.tagline}</p>}
            <p className="text-zinc-400 dark:text-zinc-500 text-sm leading-relaxed mb-5 line-clamp-2">{service.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
                {(service.stack ?? []).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-xs font-medium">{tag}</span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-white/5">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 capitalize">{service.category}</span>
                {service.featured && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-400/10 text-amber-500">★ Featured</span>
                )}
            </div>
        </div>
    )
}

export default function DashboardServices() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [reordering, setReordering] = useState(false)
    const [saving, setSaving] = useState(false)
    const [togglingId, setTogglingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [editService, setEditService] = useState<Service | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [menuOpen, setMenuOpen] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(6)

    const totalPages = Math.ceil(services.length / perPage)
    const paginatedServices = services.slice((currentPage - 1) * perPage, currentPage * perPage)

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

    // Fetch
    const fetchServices = useCallback(async () => {
        setLoading(true)
        try {
            setServices(await portalFetch.get<Service[]>(BASE))
        } catch {
            toast.error("Failed to load services")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchServices() }, [fetchServices])
    useEffect(() => { setCurrentPage(1) }, [perPage])

    // Drag & drop reorder
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = services.findIndex((s) => s.id === active.id)
        const newIndex = services.findIndex((s) => s.id === over.id)
        const reordered = arrayMove(services, oldIndex, newIndex)
        const previous = services

        setServices(reordered)
        setReordering(true)
        try {
            await portalFetch.post(`${BASE}/reorder`, { orderedIds: reordered.map((s) => s.id) })
            toast.success("Order saved")
        } catch {
            toast.error("Failed to save order")
            setServices(previous)
        } finally {
            setReordering(false)
        }
    }

    // CRUD
    const openAdd = () => { setEditService(null); setForm(emptyForm); setShowModal(true) }
    const openEdit = (service: Service) => {
        setEditService(service)
        setForm({
            title: service.title,
            tagline: service.tagline,
            description: service.description,
            stack: (service.stack ?? []).join(", "),
            icon: service.icon,
            status: service.status as ServiceStatus,
            category: service.category as "development" | "outsourcing",
        })
        setMenuOpen(null)
        setShowModal(true)
    }

    const handleSave = async () => {
        if (!form.title || !form.description) return
        setSaving(true)
        try {
            const body = {
                title: form.title, tagline: form.tagline, description: form.description,
                stack: form.stack.split(",").map((t) => t.trim()).filter(Boolean),
                icon: form.icon, status: form.status, category: form.category,
            }
            if (editService) {
                const updated = await portalFetch.patch<Service>(`${BASE}/${editService.id}`, body)
                setServices((prev) => prev.map((s) => s.id === editService.id ? updated : s))
                toast.success("Service updated")
            } else {
                const created = await portalFetch.post<Service>(BASE, body)
                setServices((prev) => [created, ...prev])
                toast.success("Service created")
            }
            setShowModal(false); setForm(emptyForm); setEditService(null)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to save service")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id); setMenuOpen(null)
        try {
            await portalFetch.delete(`${BASE}/${id}`)
            setServices((prev) => prev.filter((s) => s.id !== id))
            toast.success("Service deleted")
        } catch (err: any) {
            toast.error(err.message ?? "Failed to delete service")
        } finally {
            setDeletingId(null)
        }
    }

    const toggleStatus = async (id: string) => {
        setTogglingId(id); setMenuOpen(null)
        try {
            const updated = await portalFetch.post<Service>(`${BASE}/${id}/toggle`, {})
            setServices((prev) => prev.map((s) => s.id === id ? updated : s))
            toast.success(updated.status === "active" ? "Service activated" : "Service deactivated")
        } catch (err: any) {
            toast.error(err.message ?? "Failed to toggle status")
        } finally {
            setTogglingId(null)
        }
    }

    const stats = { total: services.length, active: services.filter((s) => s.status === "active").length }

    return (
        <div className="p-8 md:p-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Services</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center gap-2">
                        {stats.total} services · {stats.active} active
                        {reordering && <span className="text-amber-500 inline-flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> Saving order...</span>}
                    </p>
                </div>
                <Button onClick={openAdd} className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 shadow-sm">
                    <Plus size={16} /> Add Service
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                    { label: "Total Services", value: stats.total, color: "text-zinc-900 dark:text-white" },
                    { label: "Active Services", value: stats.active, color: "text-green-600 dark:text-green-400" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-6">
                        <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                        <div className="text-sm text-zinc-400 dark:text-zinc-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-zinc-400 gap-2">
                    <Loader2 size={16} className="animate-spin" /> Loading services...
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={paginatedServices.map((s) => s.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {paginatedServices.map((service) => (
                                <SortableServiceCard
                                    key={service.id}
                                    service={service}
                                    menuOpen={menuOpen}
                                    setMenuOpen={setMenuOpen}
                                    togglingId={togglingId}
                                    deletingId={deletingId}
                                    onEdit={openEdit}
                                    onToggle={toggleStatus}
                                    onDelete={handleDelete}
                                />
                            ))}
                            <button
                                onClick={openAdd}
                                className="bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-zinc-400 dark:text-zinc-600 hover:border-amber-300 dark:hover:border-amber-500/30 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/5 transition-all duration-200 min-h-[200px]"
                            >
                                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center"><Plus size={20} /></div>
                                <span className="text-sm font-medium">Add New Service</span>
                            </button>
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Pagination + per-page */}
            {services.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">Rows per page:</span>
                        <CustomSelect
                            value={String(perPage)}
                            options={PAGE_SIZE_OPTIONS.map((n) => ({ value: String(n), label: String(n) }))}
                            onChange={(v) => setPerPage(Number(v))}
                            className="w-20"
                        />
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, services.length)} of {services.length}
                        </span>
                    </div>

                    {/* Page buttons */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                <ChevronLeft size={15} />
                            </button>
                            {(() => {
                                const pages: (number | string)[] = []
                                if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
                                else {
                                    pages.push(1)
                                    if (currentPage > 3) pages.push("...")
                                    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
                                    if (currentPage < totalPages - 2) pages.push("...")
                                    pages.push(totalPages)
                                }
                                return pages.map((page, idx) =>
                                    page === "..." ? (
                                        <span key={`e-${idx}`} className="w-8 h-8 flex items-center justify-center text-zinc-400 text-sm">…</span>
                                    ) : (
                                        <button key={page} onClick={() => setCurrentPage(page as number)} className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors", currentPage === page ? "bg-amber-400 text-zinc-950" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5")}>
                                            {page}
                                        </button>
                                    )
                                )
                            })()}
                            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !saving && setShowModal(false)} />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl w-full max-w-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-xl">{editService ? "Edit Service" : "Add New Service"}</h2>
                            <button onClick={() => !saving && setShowModal(false)} disabled={saving} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-40">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:dark:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">

                            {/* Icon Picker */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-3">Icon</label>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 mb-3">
                                    {(() => { const I = iconMap[form.icon] ?? Code2; return <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0"><I size={16} className="text-amber-500" /></div> })()}
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{form.icon}</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500">Selected icon</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 p-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:dark:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {Object.entries(iconMap).map(([key, Icon]) => (
                                        <button key={key} title={key} onClick={() => setForm({ ...form, icon: key })} className={cn("w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-150 relative group", form.icon === key ? "bg-amber-400/15 border border-amber-400/40 text-amber-500" : "border border-transparent text-zinc-400 dark:text-zinc-500 hover:bg-white dark:hover:bg-white/10 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-200 dark:hover:border-white/10")}>
                                            <Icon size={16} />
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-900 dark:bg-zinc-700 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">{key}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {[
                                { label: "Title *", key: "title", placeholder: "e.g. Web Development" },
                                { label: "Tagline", key: "tagline", placeholder: "e.g. Fast, scalable, modern" },
                            ].map(({ label, key, placeholder }) => (
                                <div key={key}>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">{label}</label>
                                    <input type="text" placeholder={placeholder} value={form[key as keyof typeof form] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600" />
                                </div>
                            ))}

                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Description *</label>
                                <textarea rows={3} placeholder="Describe what this service offers..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Stack (comma separated)</label>
                                <input type="text" placeholder="React, Node.js, Python" value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Category</label>
                                <div className="flex gap-2">
                                    {(["development", "outsourcing"] as const).map((cat) => (
                                        <button key={cat} onClick={() => setForm({ ...form, category: cat })} className={cn("flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize", form.category === cat ? "bg-amber-400/15 border-amber-400/40 text-amber-500" : "border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20")}>{cat}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Active</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Show this service publicly</p>
                                </div>
                                <button onClick={() => setForm({ ...form, status: form.status === "active" ? "inactive" : "active" })} className={cn("w-11 h-6 rounded-full transition-all duration-200 relative", form.status === "active" ? "bg-amber-400" : "bg-zinc-200 dark:bg-zinc-700")}>
                                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200", form.status === "active" ? "left-6" : "left-1")} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button onClick={handleSave} disabled={saving || !form.title || !form.description} className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 disabled:opacity-40 flex items-center gap-2 justify-center">
                                {saving ? <><Loader2 size={14} className="animate-spin" /> {editService ? "Saving..." : "Creating..."}</> : editService ? "Save Changes" : "Add Service"}
                            </Button>
                            <Button variant="outline" onClick={() => !saving && setShowModal(false)} disabled={saving} className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 h-11 px-5 disabled:opacity-40">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}