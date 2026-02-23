"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    Code2,
    BriefcaseBusiness,
    Headphones,
    Globe,
    Smartphone,
    Database,
    Shield,
    Layers,
    Cpu,
    PenTool,
    BarChart,
    Cloud,
    GitBranch,
    Mail,
    ShoppingCart,
    Users,
    Settings,
    Zap,
    Check,
    MoreHorizontal,
    Pencil,
    Plus,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { allServices } from "@/lib/services"

const iconMap: Record<string, React.ElementType> = {
    Code2,
    BriefcaseBusiness,
    Headphones,
    Globe,
    Smartphone,
    Database,
    Shield,
    Layers,
    Cpu,
    PenTool,
    BarChart,
    Cloud,
    GitBranch,
    Mail,
    ShoppingCart,
    Users,
    Settings,
    Zap,
}

const emptyForm = {
    title: "",
    tagline: "",
    description: "",
    stack: "",
    icon: "Code2",
    active: true,
    category: "Development" as "Development" | "Outsourcing",
}

type ServiceVM = Omit<typeof allServices[0], "icon"> & { icon: string }

function normalise(services: typeof allServices): ServiceVM[] {
    return services.map((s) => ({
        ...s,
        icon: Object.entries(iconMap).find(([, v]) => v === s.icon)?.[0] ?? "Code2",
    }))
}

export default function DashboardServicesPage() {
    const [services, setServices] = useState<ServiceVM[]>(() => normalise(allServices))
    const [showModal, setShowModal] = useState(false)
    const [editService, setEditService] = useState<ServiceVM | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [menuOpen, setMenuOpen] = useState<string | null>(null)

    const openAdd = () => {
        setEditService(null)
        setForm(emptyForm)
        setShowModal(true)
    }

    const openEdit = (service: ServiceVM) => {
        setEditService(service)
        setForm({
            title: service.title,
            tagline: service.tagline,
            description: service.description,
            stack: service.stack.join(", "),
            icon: service.icon,
            active: service.active,
            category: service.category,
        })
        setMenuOpen(null)
        setShowModal(true)
    }

    const handleSave = () => {
        if (!form.title || !form.description) return
        const stackArray = form.stack.split(",").map((t) => t.trim()).filter(Boolean)
        if (editService) {
            setServices(services.map((s) =>
                s.id === editService.id
                    ? {
                        ...s,
                        title: form.title,
                        tagline: form.tagline,
                        description: form.description,
                        stack: stackArray,
                        icon: form.icon,
                        active: form.active,
                        category: form.category,
                    }
                    : s
            ))
        } else {
            const newService: ServiceVM = {
                id: Date.now().toString(),
                number: String(services.length + 1).padStart(2, "0"),
                title: form.title,
                tagline: form.tagline,
                description: form.description,
                stack: stackArray,
                icon: form.icon,
                active: form.active,
                category: form.category,
                features: [],
                inquiries: 0,
            }
            setServices([...services, newService])
        }
        setShowModal(false)
        setForm(emptyForm)
        setEditService(null)
    }

    const handleDelete = (id: string) => {
        setServices(services.filter((s) => s.id !== id))
        setMenuOpen(null)
    }

    const toggleActive = (id: string) => {
        setServices(services.map((s) => s.id === id ? { ...s, active: !s.active } : s))
        setMenuOpen(null)
    }

    return (
        <div className="p-8 md:p-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Services</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        {services.length} services · {services.filter(s => s.active).length} active
                    </p>
                </div>
                <Button
                    onClick={openAdd}
                    className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 shadow-sm"
                >
                    <Plus size={16} />
                    Add Service
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Total Services", value: services.length, color: "text-zinc-900 dark:text-white" },
                    { label: "Active Services", value: services.filter(s => s.active).length, color: "text-green-600 dark:text-green-400" },
                    { label: "Total Inquiries", value: services.reduce((acc, s) => acc + s.inquiries, 0), color: "text-amber-500" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-6">
                        <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                        <div className="text-sm text-zinc-400 dark:text-zinc-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {services.map((service) => {
                    const Icon = iconMap[service.icon] ?? Code2
                    return (
                        <div
                            key={service.id}
                            className={cn(
                                "group bg-white dark:bg-zinc-900 border rounded-2xl p-6 transition-all duration-200 relative",
                                service.active
                                    ? "border-zinc-100 dark:border-white/5 hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-md hover:shadow-amber-50 dark:hover:shadow-amber-500/5"
                                    : "border-zinc-100 dark:border-white/5 opacity-60"
                            )}
                        >
                            {/* Status Badge */}
                            <div className="absolute top-5 right-12">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-lg text-xs font-medium",
                                    service.active
                                        ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                                        : "bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400"
                                )}>
                                    {service.active ? "Active" : "Inactive"}
                                </span>
                            </div>

                            {/* Menu */}
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setMenuOpen(menuOpen === service.id ? null : service.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                {menuOpen === service.id && (
                                    <div className="absolute right-0 top-9 z-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg py-1 w-40">
                                        <button
                                            onClick={() => openEdit(service)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2"
                                        >
                                            <Pencil size={13} className="text-zinc-400" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => toggleActive(service.id)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center gap-2"
                                        >
                                            <Check size={13} className="text-zinc-400" />
                                            {service.active ? "Deactivate" : "Activate"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                                        >
                                            <X size={13} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-5 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10 transition-colors">
                                <Icon size={20} className="text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                            </div>

                            {/* Title + Tagline + Desc */}
                            <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-1">{service.title}</h3>
                            {service.tagline && (
                                <p className="text-xs font-medium text-amber-500 mb-2">{service.tagline}</p>
                            )}
                            <p className="text-zinc-400 dark:text-zinc-500 text-sm leading-relaxed mb-5 line-clamp-2">
                                {service.description}
                            </p>

                            {/* Stack Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {service.stack.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-xs font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Inquiries */}
                            <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-white/5">
                                <span className="text-xs text-zinc-400 dark:text-zinc-500">Total Inquiries</span>
                                <span className="text-sm font-bold text-amber-500">{service.inquiries}</span>
                            </div>
                        </div>
                    )
                })}

                {/* Add New Card */}
                <button
                    onClick={openAdd}
                    className="bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-zinc-400 dark:text-zinc-600 hover:border-amber-300 dark:hover:border-amber-500/30 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/5 transition-all duration-200 min-h-[200px]"
                >
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                        <Plus size={20} />
                    </div>
                    <span className="text-sm font-medium">Add New Service</span>
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl w-full max-w-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-zinc-900 dark:text-white text-xl">
                                {editService ? "Edit Service" : "Add New Service"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1
                            [&::-webkit-scrollbar]:w-1.5
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:bg-zinc-200
                            [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                            [&::-webkit-scrollbar-thumb]:rounded-full">

                            {/* Icon Picker */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-3">
                                    Icon
                                </label>

                                {/* Selected preview */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 mb-3">
                                    {(() => {
                                        const SelectedIcon = iconMap[form.icon] ?? Code2
                                        return (
                                            <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                                                <SelectedIcon size={16} className="text-amber-500" />
                                            </div>
                                        )
                                    })()}
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{form.icon}</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500">Selected icon</p>
                                    </div>
                                </div>

                                {/* Icon grid */}
                                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 p-2.5
                                    [&::-webkit-scrollbar]:w-1.5
                                    [&::-webkit-scrollbar-track]:bg-transparent
                                    [&::-webkit-scrollbar-thumb]:bg-zinc-200
                                    [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                                    [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {Object.entries(iconMap).map(([key, Icon]) => (
                                        <button
                                            key={key}
                                            title={key}
                                            onClick={() => setForm({ ...form, icon: key })}
                                            className={cn(
                                                "w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-150 relative group",
                                                form.icon === key
                                                    ? "bg-amber-400/15 border border-amber-400/40 text-amber-500"
                                                    : "border border-transparent text-zinc-400 dark:text-zinc-500 hover:bg-white dark:hover:bg-white/10 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-200 dark:hover:border-white/10"
                                            )}
                                        >
                                            <Icon size={16} />
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-900 dark:bg-zinc-700 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                {key}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Title *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Web Development"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Tagline */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Tagline</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Fast, scalable, modern"
                                    value={form.tagline}
                                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Description *</label>
                                <textarea
                                    rows={3}
                                    placeholder="Describe what this service offers..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Stack */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Stack (comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="React, Node.js, Python"
                                    value={form.stack}
                                    onChange={(e) => setForm({ ...form, stack: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Category</label>
                                <div className="flex gap-2">
                                    {(["Development", "Outsourcing"] as const).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setForm({ ...form, category: cat })}
                                            className={cn(
                                                "flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all",
                                                form.category === cat
                                                    ? "bg-amber-400/15 border-amber-400/40 text-amber-500"
                                                    : "border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Active</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Show this service publicly</p>
                                </div>
                                <button
                                    onClick={() => setForm({ ...form, active: !form.active })}
                                    className={cn(
                                        "w-11 h-6 rounded-full transition-all duration-200 relative",
                                        form.active ? "bg-amber-400" : "bg-zinc-200 dark:bg-zinc-700"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200",
                                        form.active ? "left-6" : "left-1"
                                    )} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                onClick={handleSave}
                                className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11"
                            >
                                {editService ? "Save Changes" : "Add Service"}
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