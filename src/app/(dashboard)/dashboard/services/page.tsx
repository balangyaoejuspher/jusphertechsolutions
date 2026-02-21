"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    Plus,
    Code2,
    BriefcaseBusiness,
    Headphones,
    MoreHorizontal,
    X,
    Check,
    Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const iconMap: Record<string, React.ElementType> = {
    Code2,
    BriefcaseBusiness,
    Headphones,
}

const initialServices = [
    {
        id: "1",
        icon: "Code2",
        title: "Developers",
        description:
            "Full-stack, frontend, backend, mobile — hire experienced engineers who ship quality code fast.",
        tags: ["React", "Node.js", "Python", "Mobile"],
        active: true,
        inquiries: 42,
    },
    {
        id: "2",
        icon: "Headphones",
        title: "Virtual Assistants",
        description:
            "Skilled VAs who handle admin, scheduling, customer support, and more so you can focus on growth.",
        tags: ["Admin", "Support", "Scheduling", "Research"],
        active: true,
        inquiries: 38,
    },
    {
        id: "3",
        icon: "BriefcaseBusiness",
        title: "Project Managers",
        description:
            "Certified PMs who keep your projects on track, on time, and within budget.",
        tags: ["Agile", "Scrum", "Jira", "Delivery"],
        active: true,
        inquiries: 21,
    },
]

const emptyForm = {
    title: "",
    description: "",
    tags: "",
    icon: "Code2",
    active: true,
}

type Service = typeof initialServices[0]

export default function DashboardServicesPage() {
    const [services, setServices] = useState(initialServices)
    const [showModal, setShowModal] = useState(false)
    const [editService, setEditService] = useState<Service | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [menuOpen, setMenuOpen] = useState<string | null>(null)

    const openAdd = () => {
        setEditService(null)
        setForm(emptyForm)
        setShowModal(true)
    }

    const openEdit = (service: Service) => {
        setEditService(service)
        setForm({
            title: service.title,
            description: service.description,
            tags: service.tags.join(", "),
            icon: service.icon,
            active: service.active,
        })
        setMenuOpen(null)
        setShowModal(true)
    }

    const handleSave = () => {
        if (!form.title || !form.description) return
        if (editService) {
            setServices(services.map((s) =>
                s.id === editService.id
                    ? {
                        ...s,
                        title: form.title,
                        description: form.description,
                        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
                        icon: form.icon,
                        active: form.active,
                    }
                    : s
            ))
        } else {
            setServices([
                ...services,
                {
                    id: Date.now().toString(),
                    title: form.title,
                    description: form.description,
                    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
                    icon: form.icon,
                    active: form.active,
                    inquiries: 0,
                },
            ])
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
        setServices(services.map((s) =>
            s.id === id ? { ...s, active: !s.active } : s
        ))
        setMenuOpen(null)
    }

    return (
        <div className="p-8 md:p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 mb-1">Services</h1>
                    <p className="text-zinc-500 text-sm">{services.length} services · {services.filter(s => s.active).length} active</p>
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
                    { label: "Total Services", value: services.length, color: "text-zinc-900" },
                    { label: "Active Services", value: services.filter(s => s.active).length, color: "text-green-600" },
                    { label: "Total Inquiries", value: services.reduce((acc, s) => acc + s.inquiries, 0), color: "text-amber-500" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white border border-zinc-100 rounded-2xl p-6">
                        <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                        <div className="text-sm text-zinc-400">{stat.label}</div>
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
                                "group bg-white border rounded-2xl p-6 transition-all duration-200 relative",
                                service.active
                                    ? "border-zinc-100 hover:border-amber-200 hover:shadow-md hover:shadow-amber-50"
                                    : "border-zinc-100 opacity-60"
                            )}
                        >
                            {/* Status Badge */}
                            <div className="absolute top-5 right-12">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-lg text-xs font-medium",
                                    service.active
                                        ? "bg-green-50 text-green-700"
                                        : "bg-zinc-100 text-zinc-500"
                                )}>
                                    {service.active ? "Active" : "Inactive"}
                                </span>
                            </div>

                            {/* Menu */}
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setMenuOpen(menuOpen === service.id ? null : service.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                {menuOpen === service.id && (
                                    <div className="absolute right-0 top-9 z-10 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 w-40">
                                        <button
                                            onClick={() => openEdit(service)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 flex items-center gap-2"
                                        >
                                            <Pencil size={13} className="text-zinc-400" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => toggleActive(service.id)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 flex items-center gap-2"
                                        >
                                            <Check size={13} className="text-zinc-400" />
                                            {service.active ? "Deactivate" : "Activate"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <X size={13} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-5 group-hover:bg-amber-50 transition-colors">
                                <Icon size={20} className="text-zinc-500 group-hover:text-amber-500 transition-colors" />
                            </div>

                            {/* Title + Desc */}
                            <h3 className="font-bold text-zinc-900 text-base mb-2">{service.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-5 line-clamp-2">
                                {service.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {service.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-500 text-xs font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Inquiries */}
                            <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                                <span className="text-xs text-zinc-400">Total Inquiries</span>
                                <span className="text-sm font-bold text-amber-500">{service.inquiries}</span>
                            </div>
                        </div>
                    )
                })}

                {/* Add New Card */}
                <button
                    onClick={openAdd}
                    className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-zinc-400 hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50 transition-all duration-200 min-h-[200px]"
                >
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                        <Plus size={20} />
                    </div>
                    <span className="text-sm font-medium">Add New Service</span>
                </button>
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-md p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-zinc-900 text-xl">
                                {editService ? "Edit Service" : "Add New Service"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Icon */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                    Icon
                                </label>
                                <div className="flex gap-3">
                                    {Object.entries(iconMap).map(([key, Icon]) => (
                                        <button
                                            key={key}
                                            onClick={() => setForm({ ...form, icon: key })}
                                            className={cn(
                                                "w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all",
                                                form.icon === key
                                                    ? "border-amber-400 bg-amber-50 text-amber-500"
                                                    : "border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-zinc-300"
                                            )}
                                        >
                                            <Icon size={18} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Developers"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                    Description *
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Describe what this service offers..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all resize-none"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="React, Node.js, Python"
                                    value={form.tags}
                                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-amber-400 transition-all"
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-700">Active</p>
                                    <p className="text-xs text-zinc-400">Show this service publicly</p>
                                </div>
                                <button
                                    onClick={() => setForm({ ...form, active: !form.active })}
                                    className={cn(
                                        "w-11 h-6 rounded-full transition-all duration-200 relative",
                                        form.active ? "bg-amber-400" : "bg-zinc-200"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200",
                                            form.active ? "left-6" : "left-1"
                                        )}
                                    />
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
                                className="rounded-xl border-zinc-200 h-11 px-5"
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