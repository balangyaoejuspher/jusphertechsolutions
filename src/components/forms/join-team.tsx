"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JOIN_AVAILABILITY, JOIN_COUNTRIES, JOIN_EXPERIENCE_LEVELS, JOIN_ROLES, JOIN_SKILL_GROUPS, JOIN_STEPS, ROLE_SKILL_MAP, ROLE_SKILL_PLACEHOLDER } from "@/lib/helpers/constants"
import { cn } from "@/lib/utils"
import {
    ArrowLeft,
    ArrowRight,
    Award,
    CheckCircle,
    DollarSign,
    FileText,
    Github, Globe,
    Linkedin,
    Plus,
    Sparkles,
    Star,
    Upload,
    X
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Field } from "@/components/ui/field"
import { Input } from "../ui/input"
import { NAME_REGEX, EMAIL_REGEX, PHONE_REGEX } from "@/lib/helpers/validators"

type Experience = {
    id: string
    company: string
    role: string
    duration: string
    description: string
}

type FormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    customRole: string
    experienceLevel: string
    availability: string
    rateMin: string
    rateMax: string
    bio: string
    skills: string[]
    experiences: Experience[]
    resumeFile: File | null
    certificateFiles: File[]
    portfolioUrl: string
    githubUrl: string
    linkedinUrl: string
    country: string
    city: string
}

const emptyExperience = (): Experience => ({
    id: Date.now().toString(),
    company: "",
    role: "",
    duration: "",
    description: "",
})

const initialForm: FormData = {
    firstName: "", lastName: "", email: "", phone: "",
    role: "", customRole: "", experienceLevel: "", availability: "", rateMin: "", rateMax: "", bio: "",
    skills: [],
    experiences: [emptyExperience()],
    resumeFile: null, certificateFiles: [], portfolioUrl: "", githubUrl: "", linkedinUrl: "",
    country: "", city: "",
}

const inputCls = "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-white/5 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"

function StepPersonal({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

    const validate = (field: keyof FormData, value: string) => {
        let error = ""
        switch (field) {
            case "firstName":
            case "lastName":
                if (!value.trim()) error = "This field is required"
                else if (value.trim().length < 2) error = "Must be at least 2 characters"
                else if (!NAME_REGEX.test(value)) error = "Only letters, spaces, hyphens and apostrophes"
                break
            case "email":
                if (!value.trim()) error = "Email is required"
                else if (!EMAIL_REGEX.test(value)) error = "Enter a valid email address"
                break
            case "phone":
                if (value && !PHONE_REGEX.test(value)) error = "Enter a valid phone number"
                break
            case "city":
                if (value && !NAME_REGEX.test(value)) error = "Only letters, spaces and hyphens"
                break
        }
        setErrors((prev) => ({ ...prev, [field]: error }))
    }

    const handle = (field: keyof FormData, value: string) => {
        setForm({ ...form, [field]: value })
        validate(field, value)
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="First Name" required error={errors.firstName}>
                    <input
                        className={cn(inputCls, errors.firstName && "border-red-400 focus:border-red-400")}
                        placeholder="Juan"
                        value={form.firstName}
                        onChange={(e) => handle("firstName", e.target.value)}
                    />
                </Field>
                <Field label="Last Name" required error={errors.lastName}>
                    <input
                        className={cn(inputCls, errors.lastName && "border-red-400 focus:border-red-400")}
                        placeholder="Dela Cruz"
                        value={form.lastName}
                        onChange={(e) => handle("lastName", e.target.value)}
                    />
                </Field>
            </div>

            <Field label="Email Address" required error={errors.email}>
                <input
                    type="email"
                    className={cn(inputCls, errors.email && "border-red-400 focus:border-red-400")}
                    placeholder="juan@email.com"
                    value={form.email}
                    onChange={(e) => handle("email", e.target.value)}
                />
            </Field>

            <Field label="Phone Number" error={errors.phone} hint="Include country code e.g. +63 912 345 6789">
                <input
                    type="tel"
                    className={cn(inputCls, errors.phone && "border-red-400 focus:border-red-400")}
                    placeholder="+63 912 345 6789"
                    value={form.phone}
                    onChange={(e) => handle("phone", e.target.value)}
                />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Country" required>
                    <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
                        <SelectTrigger className="w-full h-10">
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                            {JOIN_COUNTRIES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="City" error={errors.city}>
                    <input
                        className={cn(inputCls, errors.city && "border-red-400 focus:border-red-400")}
                        placeholder="Cebu City"
                        value={form.city}
                        onChange={(e) => handle("city", e.target.value)}
                    />
                </Field>
            </div>
        </div>
    )
}

function StepProfessional({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
    return (
        <div className="flex flex-col gap-5">
            <Field label="Role Applying For" required>
                <div className="flex flex-col gap-3">
                    <Select
                        value={form.role}
                        onValueChange={(v) => setForm({ ...form, role: v, customRole: "" })}
                    >
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {JOIN_ROLES.map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>

                    {form.role === "Other" && (
                        <input
                            type="text"
                            placeholder="Please specify your role..."
                            value={form.customRole}
                            onChange={(e) => setForm({ ...form, customRole: e.target.value })}
                            className="w-1/2 h-10 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                        />
                    )}
                </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Experience Level" required>
                    <Select value={form.experienceLevel} onValueChange={(v) => setForm({ ...form, experienceLevel: v })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            {JOIN_EXPERIENCE_LEVELS.map((l) => (
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="Availability" required>
                    <Select value={form.availability} onValueChange={(v) => setForm({ ...form, availability: v })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {JOIN_AVAILABILITY.map((a) => (
                                <SelectItem key={a} value={a}>{a}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <Field label="Expected Hourly Rate (USD)">
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input className={`${inputCls} pl-8`} type="number" placeholder="Min (e.g. 15)" value={form.rateMin}
                            onChange={(e) => setForm({ ...form, rateMin: e.target.value })} />
                    </div>
                    <div className="relative">
                        <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input className={`${inputCls} pl-8`} type="number" placeholder="Max (e.g. 35)" value={form.rateMax}
                            onChange={(e) => setForm({ ...form, rateMax: e.target.value })} />
                    </div>
                </div>
            </Field>

            <Field label="Professional Bio" required>
                <textarea rows={4} className={inputCls} placeholder="Tell us about yourself, your expertise, and what makes you great at what you do..."
                    value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </Field>
        </div>
    )
}

function StepSkills({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
    const [customInput, setCustomInput] = useState("")

    const toggle = (skill: string) => {
        const next = form.skills.includes(skill)
            ? form.skills.filter((s) => s !== skill)
            : [...form.skills, skill]
        setForm({ ...form, skills: next })
    }

    const addCustom = () => {
        const trimmed = customInput.trim()
        if (!trimmed || form.skills.includes(trimmed)) return
        setForm({ ...form, skills: [...form.skills, trimmed] })
        setCustomInput("")
    }

    const selectedGroups = ROLE_SKILL_MAP[form.role] ?? []
    const filteredGroups = selectedGroups.length === 0
        ? JOIN_SKILL_GROUPS
        : JOIN_SKILL_GROUPS.filter((g) => selectedGroups.includes(g.group))

    // Primary group = first in the role map, rest are "nice to have"
    const primaryGroup = selectedGroups[0] ?? null
    const niceToHaveGroups = selectedGroups.slice(1)

    const allGroupItems = JOIN_SKILL_GROUPS.flatMap((g) => g.items)
    const customSkills = form.skills.filter((s) => !allGroupItems.includes(s))

    // Suggestions while typing
    const suggestions = customInput.trim().length > 0
        ? allGroupItems
            .filter((s) => !form.skills.includes(s))
            .filter((s) => s.toLowerCase().includes(customInput.toLowerCase()))
            .slice(0, 6)
        : []

    return (
        <div className="flex flex-col gap-6">

            {/* Selected skills */}
            {form.skills.length > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-400/5 border border-amber-200 dark:border-amber-400/20 rounded-2xl">
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3 uppercase tracking-widest">
                        Selected ({form.skills.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {form.skills.map((s) => (
                            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                                {s}
                                <button onClick={() => toggle(s)} className="hover:text-red-500 transition-colors">
                                    <X size={11} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Role-filtered skill groups */}
            <div className="flex flex-col gap-6">
                {filteredGroups.map((group) => {
                    const isPrimary = group.group === primaryGroup
                    const isNiceToHave = niceToHaveGroups.includes(group.group)

                    return (
                        <div key={group.group}>
                            {/* Group header */}
                            <div className="flex items-center gap-2 mb-2.5">
                                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                                    {group.group}
                                </p>
                                {isPrimary && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wide">
                                        <Star size={8} className="fill-amber-400" /> Core
                                    </span>
                                )}
                                {isNiceToHave && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-400/10 border border-blue-200 dark:border-blue-400/20 text-blue-500 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wide">
                                        <Sparkles size={8} /> Nice to have
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {group.items.map((item) => {
                                    const active = form.skills.includes(item)
                                    return (
                                        <button
                                            key={item}
                                            onClick={() => toggle(item)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                                                active
                                                    ? "bg-amber-400/10 border-amber-400/40 text-amber-600 dark:text-amber-400"
                                                    : isPrimary
                                                        ? "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/5"
                                                        : isNiceToHave
                                                            ? "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-blue-300 dark:hover:border-blue-400/30 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-400/5"
                                                            : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                            )}
                                        >
                                            {active && <CheckCircle size={10} className="inline mr-1" />}
                                            {item}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Custom skill input */}
            <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2.5">
                    Add Custom Skill
                </p>
                <div className="flex gap-2">
                    <Input
                        placeholder={ROLE_SKILL_PLACEHOLDER[form.role] ?? "e.g. any tool or technology you use..."}
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom() } }}
                        className="flex-1 rounded-xl"
                    />
                    <Button
                        type="button"
                        onClick={addCustom}
                        disabled={!customInput.trim()}
                        className="rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-zinc-950 font-bold"
                    >
                        <Plus size={14} /> Add
                    </Button>
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-600 self-center">Suggestions:</span>
                        {suggestions.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => { toggle(s); setCustomInput("") }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-[11px] font-medium hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/5 transition-all"
                            >
                                <Plus size={9} />{s}
                            </button>
                        ))}
                    </div>
                )}

                {customSkills.length > 0 && (
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-2">
                        Custom: {customSkills.join(", ")}
                    </p>
                )}
            </div>
        </div>
    )
}

function StepExperience({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
    const update = (id: string, field: keyof Experience, value: string) => {
        setForm({
            ...form,
            experiences: form.experiences.map((e) => e.id === id ? { ...e, [field]: value } : e),
        })
    }
    const remove = (id: string) => {
        if (form.experiences.length === 1) return
        setForm({ ...form, experiences: form.experiences.filter((e) => e.id !== id) })
    }
    const add = () => setForm({ ...form, experiences: [...form.experiences, emptyExperience()] })

    return (
        <div className="flex flex-col gap-5">
            {form.experiences.map((exp, i) => (
                <div key={exp.id} className="p-5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                            Experience {i + 1}
                        </p>
                        {form.experiences.length > 1 && (
                            <button onClick={() => remove(exp.id)} className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                <X size={13} />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input className={inputCls} placeholder="Company / Client" value={exp.company}
                                onChange={(e) => update(exp.id, "company", e.target.value)} />
                            <input className={inputCls} placeholder="Your Role / Title" value={exp.role}
                                onChange={(e) => update(exp.id, "role", e.target.value)} />
                        </div>
                        <input className={inputCls} placeholder="Duration (e.g. Jan 2022 – Mar 2024)" value={exp.duration}
                            onChange={(e) => update(exp.id, "duration", e.target.value)} />
                        <textarea rows={3} className={inputCls} placeholder="What did you build or accomplish?" value={exp.description}
                            onChange={(e) => update(exp.id, "description", e.target.value)} />
                    </div>
                </div>
            ))}
            <button onClick={add}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-dashed border-zinc-300 dark:border-white/10 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:border-amber-400/40 hover:text-amber-500 dark:hover:text-amber-400 transition-all">
                <Plus size={15} /> Add Another Experience
            </button>
        </div>
    )
}

function StepPortfolio({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
    const handleResumeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setForm({ ...form, resumeFile: file })
    }

    const handleCertificateFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const incoming = Array.from(e.target.files)
        const merged = [
            ...form.certificateFiles,
            ...incoming.filter((f) => !form.certificateFiles.some((c) => c.name === f.name)),
        ]
        setForm({ ...form, certificateFiles: merged })
    }

    const removeCertificate = (name: string) =>
        setForm({ ...form, certificateFiles: form.certificateFiles.filter((f) => f.name !== name) })

    return (
        <div className="flex flex-col gap-5">

            {/* Resume Upload */}
            <Field label="Resume / CV">
                <label className={cn(
                    "flex flex-col items-center justify-center gap-3 w-full py-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
                    form.resumeFile
                        ? "border-amber-400/40 bg-amber-50 dark:bg-amber-400/5"
                        : "border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-white/5 hover:border-amber-400/30 hover:bg-amber-50/50 dark:hover:bg-amber-400/5"
                )}>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeFile} />
                    {form.resumeFile ? (
                        <>
                            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                                <FileText size={18} className="text-amber-500 dark:text-amber-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{form.resumeFile.name}</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">Click to replace</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-white/10 flex items-center justify-center">
                                <Upload size={18} className="text-zinc-500 dark:text-zinc-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Drop your resume here</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">PDF, DOC, DOCX · Max 5MB</p>
                            </div>
                        </>
                    )}
                </label>
            </Field>

            {/* Certificates Upload */}
            <Field label="Certificates" hint="Upload any relevant certifications — Google, AWS, Meta, Coursera, etc.">
                <label className={cn(
                    "flex flex-col items-center justify-center gap-3 w-full py-7 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
                    form.certificateFiles.length > 0
                        ? "border-emerald-400/40 bg-emerald-50 dark:bg-emerald-400/5"
                        : "border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-white/5 hover:border-emerald-400/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-400/5"
                )}>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" onChange={handleCertificateFiles} />
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        form.certificateFiles.length > 0
                            ? "bg-emerald-400/15 border border-emerald-400/30"
                            : "bg-zinc-200 dark:bg-white/10"
                    )}>
                        <Award size={18} className={form.certificateFiles.length > 0 ? "text-emerald-500 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            {form.certificateFiles.length > 0 ? "Add more certificates" : "Upload certificates"}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">PDF, JPG, PNG · Multiple allowed</p>
                    </div>
                </label>

                {/* Certificate file list */}
                {form.certificateFiles.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                        {form.certificateFiles.map((file) => (
                            <div key={file.name} className="flex items-center gap-3 px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/5">
                                <Award size={13} className="text-emerald-500 shrink-0" />
                                <span className="text-xs text-zinc-700 dark:text-zinc-300 flex-1 truncate">{file.name}</span>
                                <span className="text-[11px] text-zinc-400 dark:text-zinc-600 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                                <button onClick={() => removeCertificate(file.name)} className="text-zinc-400 hover:text-red-400 transition-colors shrink-0">
                                    <X size={13} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Field>

            {/* Links */}
            <Field label="Portfolio / Website">
                <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input className={`${inputCls} pl-9`} placeholder="https://yourportfolio.com" value={form.portfolioUrl}
                        onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} />
                </div>
            </Field>
            <Field label="GitHub">
                <div className="relative">
                    <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input className={`${inputCls} pl-9`} placeholder="https://github.com/username" value={form.githubUrl}
                        onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
                </div>
            </Field>
            <Field label="LinkedIn">
                <div className="relative">
                    <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input className={`${inputCls} pl-9`} placeholder="https://linkedin.com/in/username" value={form.linkedinUrl}
                        onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
                </div>
            </Field>
        </div>
    )
}

function StepReview({ form }: { form: FormData }) {
    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="p-5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl">
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-4">{title}</p>
            {children}
        </div>
    )
    const Row = ({ label, value }: { label: string; value: string }) => value ? (
        <div className="flex items-start gap-3 py-1.5">
            <span className="text-xs text-zinc-400 dark:text-zinc-600 w-32 shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-zinc-900 dark:text-white font-medium">{value}</span>
        </div>
    ) : null

    const finalRole = form.role === "Other" ? form.customRole : form.role

    return (
        <div className="flex flex-col gap-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-400/5 border border-amber-200 dark:border-amber-400/20 rounded-2xl flex items-center gap-3">
                <CheckCircle size={16} className="text-amber-500 dark:text-amber-400 shrink-0" />
                <p className="text-sm text-zinc-700 dark:text-zinc-300">Please review your application before submitting.</p>
            </div>

            {/* Personal Info */}
            <Section title="Personal Information">
                <Row label="Name" value={`${form.firstName} ${form.lastName}`} />
                <Row label="Email" value={form.email} />
                <Row label="Phone" value={form.phone} />
                <Row label="Location" value={[form.city, form.country].filter(Boolean).join(", ")} />
            </Section>

            {/* Professional */}
            <Section title="Professional Profile">
                <Row label="Role" value={finalRole} />
                <Row label="Experience" value={form.experienceLevel} />
                <Row label="Availability" value={form.availability} />
                <Row label="Rate" value={
                    form.rateMin && form.rateMax ? `$${form.rateMin} – $${form.rateMax}/hr`
                        : form.rateMin ? `From $${form.rateMin}/hr`
                            : ""
                } />
                {form.bio && (
                    <div className="py-1.5">
                        <span className="text-xs text-zinc-400 dark:text-zinc-600 block mb-1">Bio</span>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{form.bio}</p>
                    </div>
                )}
            </Section>

            {/* Skills */}
            {form.skills.length > 0 && (
                <Section title={`Skills (${form.skills.length})`}>
                    <div className="flex flex-wrap gap-2">
                        {form.skills.map((s) => (
                            <span key={s} className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                                {s}
                            </span>
                        ))}
                    </div>
                </Section>
            )}

            {/* Experience */}
            {form.experiences.some((e) => e.company) && (
                <Section title="Experience">
                    <div className="flex flex-col gap-3">
                        {form.experiences.filter((e) => e.company).map((exp) => (
                            <div key={exp.id} className="border-l-2 border-amber-400/40 pl-4">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {exp.role} <span className="text-zinc-400 font-normal">at</span> {exp.company}
                                </p>
                                {exp.duration && <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{exp.duration}</p>}
                                {exp.description && <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1.5 leading-relaxed">{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Portfolio & Links */}
            <Section title="Portfolio & Links">
                {form.resumeFile && <Row label="Resume" value={form.resumeFile.name} />}
                {form.portfolioUrl && <Row label="Portfolio" value={form.portfolioUrl} />}
                {form.githubUrl && <Row label="GitHub" value={form.githubUrl} />}
                {form.linkedinUrl && <Row label="LinkedIn" value={form.linkedinUrl} />}

                {/* Certificates */}
                {form.certificateFiles.length > 0 && (
                    <div className="py-1.5">
                        <span className="text-xs text-zinc-400 dark:text-zinc-600 block mb-2">
                            Certificates ({form.certificateFiles.length})
                        </span>
                        <div className="flex flex-col gap-1.5">
                            {form.certificateFiles.map((file) => (
                                <div key={file.name} className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl">
                                    <Award size={12} className="text-emerald-500 shrink-0" />
                                    <span className="text-xs text-zinc-700 dark:text-zinc-300 flex-1 truncate">{file.name}</span>
                                    <span className="text-[11px] text-zinc-400 dark:text-zinc-600 shrink-0">
                                        {(file.size / 1024).toFixed(0)} KB
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Section>
        </div>
    )
}

export default function JoinTeam() {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState<FormData>(initialForm)
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const progress = ((step - 1) / (JOIN_STEPS.length - 1)) * 100

    const canNext = () => {
        if (step === 1) return form.firstName && form.lastName && form.email && form.country
        if (step === 2) return form.role && form.experienceLevel && form.availability && form.bio
        if (step === 3) return form.skills.length > 0
        return true
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        // TODO: wire to API route
        await new Promise((r) => setTimeout(r, 2000))
        setSubmitting(false)
        setSubmitted(true)
    }

    if (submitting) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-6">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-6">
                        <div className="w-8 h-8 border-[3px] border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Submitting your application...</h2>
                    <p className="text-zinc-400 dark:text-zinc-600 text-sm">Please wait, this will only take a moment.</p>
                </div>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={36} className="text-amber-500 dark:text-amber-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">Application Submitted!</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-2">
                        Thanks, <span className="font-semibold text-zinc-900 dark:text-white">{form.firstName}</span>!
                    </p>
                    <p className="text-zinc-400 dark:text-zinc-600 text-sm mb-10">
                        We'll review your application and reach out within 48 hours.
                    </p>
                    <Link href="/">
                        <Button className="rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-12 px-8 gap-2">
                            Back to Home <ArrowRight size={15} />
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">

            {/* Hero */}
            <section className="relative py-12 md:py-16 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950" />
                <div className="relative container mx-auto px-6 md:px-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">Join Our Network</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white leading-tight tracking-tight mb-3">
                        Apply to Join<br />
                        <span className="text-zinc-400 dark:text-zinc-500">Our Talent Network</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md mx-auto">
                        Complete your application in a few simple steps. Takes about 5 minutes.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6 md:px-12 py-10 max-w-3xl">

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                            Step {step} of {JOIN_STEPS.length} — <span className="text-amber-500 dark:text-amber-400">{JOIN_STEPS[step - 1].label}</span>
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600">{Math.round(progress)}% complete</p>
                    </div>
                    <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-between mb-8 overflow-x-auto pb-1">
                    {JOIN_STEPS.map((s, i) => {
                        const done = step > s.id
                        const active = step === s.id
                        return (
                            <div key={s.id} className="flex items-center gap-1 shrink-0">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className={cn(
                                        "w-9 h-9 rounded-2xl flex items-center justify-center border transition-all duration-300",
                                        done
                                            ? "bg-amber-400 border-amber-400 text-zinc-950"
                                            : active
                                                ? "bg-zinc-900 dark:bg-amber-400 border-zinc-900 dark:border-amber-400 text-white dark:text-zinc-950"
                                                : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-600"
                                    )}>
                                        {done ? <CheckCircle size={15} /> : <s.icon size={15} />}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-semibold hidden sm:block",
                                        active ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-600"
                                    )}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < JOIN_STEPS.length - 1 && (
                                    <div className={cn(
                                        "w-8 md:w-12 h-px mx-1 mb-4 transition-all",
                                        done ? "bg-amber-400" : "bg-zinc-200 dark:bg-white/10"
                                    )} />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Step card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-6 md:p-8 mb-6">
                    <div className="flex items-center gap-3 mb-7 pb-6 border-b border-zinc-100 dark:border-white/5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                            {(() => { const Icon = JOIN_STEPS[step - 1].icon; return <Icon size={17} className="text-amber-500 dark:text-amber-400" /> })()}
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight">{JOIN_STEPS[step - 1].label}</h2>
                            <p className="text-zinc-400 dark:text-zinc-600 text-xs mt-0.5">
                                {step === 1 && "Tell us who you are"}
                                {step === 2 && "Share your professional background"}
                                {step === 3 && "Select all the tools and technologies you know"}
                                {step === 4 && "Add your past work experience"}
                                {step === 5 && "Share your resume and online presence"}
                                {step === 6 && "One last look before you submit"}
                            </p>
                        </div>
                    </div>

                    {step === 1 && <StepPersonal form={form} setForm={setForm} />}
                    {step === 2 && <StepProfessional form={form} setForm={setForm} />}
                    {step === 3 && <StepSkills form={form} setForm={setForm} />}
                    {step === 4 && <StepExperience form={form} setForm={setForm} />}
                    {step === 5 && <StepPortfolio form={form} setForm={setForm} />}
                    {step === 6 && <StepReview form={form} />}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setStep((s) => Math.max(1, s - 1))}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ArrowLeft size={15} /> Back
                    </button>

                    {step < JOIN_STEPS.length ? (
                        <Button
                            onClick={() => setStep((s) => Math.min(JOIN_STEPS.length, s + 1))}
                            disabled={!canNext()}
                            className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 px-7 gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Continue <ArrowRight size={15} />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!canNext()}
                            className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold h-11 px-7 gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <CheckCircle size={15} />
                            Submit Application
                        </Button>
                    )}
                </div>

                <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-5">
                    Your information is kept private and never shared without your consent.
                </p>
            </div>
        </div>
    )
}