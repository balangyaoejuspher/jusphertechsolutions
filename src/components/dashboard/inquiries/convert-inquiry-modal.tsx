"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
    X, UserPlus, FolderPlus, KeyRound, Loader2,
    CheckCircle, Briefcase, SkipForward,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { portalFetch } from "@/lib/api/private-fetcher"
import { toast } from "sonner"
import type { Inquiry, ClientRow, Project, Placement, TalentRow } from "@/server/db/schema"
import { DatePicker } from "@/components/ui/date-picker"
import { CustomSelect } from "@/components/ui/custom-select"

type Props = {
    inquiry: Inquiry
    onClose: () => void
    onConverted: (result: { client: ClientRow; project: Project; placement: Placement | null }) => void
}

type Step = "client" | "project" | "placement" | "confirm"

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: "client", label: "Client Info", icon: UserPlus },
    { key: "project", label: "Project Details", icon: FolderPlus },
    { key: "placement", label: "Assign Talent", icon: Briefcase },
    { key: "confirm", label: "Confirm", icon: KeyRound },
]

const inputCls = "w-full rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-sm focus:border-amber-400 dark:focus:border-amber-400"


export default function ConvertInquiryModal({ inquiry, onClose, onConverted }: Props) {
    const [step, setStep] = useState<Step>("client")
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [talents, setTalents] = useState<TalentRow[]>([])

    useEffect(() => {
        if (step === "placement" && talents.length === 0) {
            portalFetch.get<TalentRow[]>("/admin/talent")
                .then(setTalents)
                .catch(() => toast.error("Failed to load talent list"))
        }
    }, [step])


    const [clientForm, setClientForm] = useState({
        clientName: inquiry.name,
        clientType: (inquiry.company ? "company" : "individual") as "company" | "individual",
        clientPhone: inquiry.phone ?? "",
        clientWebsite: "",
        clientLocation: "",
        clientPosition: "",
        clientServices: [] as string[],
        tempPassword: "",
    })

    const [projectForm, setProjectForm] = useState({
        projectTitle: inquiry.company ? `${inquiry.company} Project` : `${inquiry.name} Project`,
        projectDescription: inquiry.message,
        projectBudget: inquiry.budget ?? "",
        projectStartDate: "",
        projectDueDate: "",
        projectNotes: "",
    })

    const [placementForm, setPlacementForm] = useState({
        skip: false,   // if true, no placement fields are sent
        placementTalentId: "",
        placementRole: "",
        placementHourlyRate: "",
        placementHoursPerWeek: "40",
        placementStartDate: "",
        placementEndDate: "",
        placementNotes: "",
    })

    useEffect(() => {
        if (!placementForm.placementStartDate && projectForm.projectStartDate) {
            setPlacementForm((f) => ({ ...f, placementStartDate: projectForm.projectStartDate }))
        }
    }, [projectForm.projectStartDate])

    useEffect(() => {
        if (placementForm.placementTalentId) {
            const selectedTalent = talents.find((t) => t.id === placementForm.placementTalentId)
            if (selectedTalent) {
                setPlacementForm((f) => ({
                    ...f,
                    placementRole: f.placementRole || selectedTalent.title,
                    placementHourlyRate: f.placementHourlyRate || (selectedTalent.hourlyRate ?? ""),
                }))
            }
        }
    }, [placementForm.placementTalentId, talents])


    const stepIndex = STEPS.findIndex((s) => s.key === step)

    const canProceedFromPlacement =
        placementForm.skip ||
        (!!placementForm.placementTalentId && !!placementForm.placementRole)

    const handleNext = () => {
        if (step === "client") return setStep("project")
        if (step === "project") return setStep("placement")
        if (step === "placement") return setStep("confirm")
        handleConvert()
    }

    const handleBack = () => {
        if (step === "confirm") return setStep("placement")
        if (step === "placement") return setStep("project")
        if (step === "project") return setStep("client")
    }

    const handleConvert = async () => {
        if (!clientForm.tempPassword || !projectForm.projectTitle) return
        setSaving(true)
        try {
            const body = {
                ...clientForm,
                ...projectForm,
                ...(!placementForm.skip && placementForm.placementTalentId
                    ? {
                        placementTalentId: placementForm.placementTalentId,
                        placementRole: placementForm.placementRole,
                        placementHourlyRate: placementForm.placementHourlyRate || undefined,
                        placementHoursPerWeek: placementForm.placementHoursPerWeek
                            ? parseInt(placementForm.placementHoursPerWeek)
                            : undefined,
                        placementStartDate: placementForm.placementStartDate || undefined,
                        placementEndDate: placementForm.placementEndDate || undefined,
                        placementNotes: placementForm.placementNotes || undefined,
                    }
                    : {}
                ),
            }

            const result = await portalFetch.post<{
                client: ClientRow
                project: Project
                placement: Placement | null
            }>(`/admin/inquiries/${inquiry.id}/convert`, body)

            setSuccess(true)
            setTimeout(() => {
                onConverted(result)
                onClose()
            }, 1500)
        } catch (err: any) {
            toast.error(err.message ?? "Failed to convert inquiry")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-white/5">
                    <div>
                        <h2 className="font-bold text-zinc-900 dark:text-white text-lg">Accept & Convert</h2>
                        <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5">
                            Converting inquiry from{" "}
                            <span className="text-zinc-700 dark:text-zinc-300 font-medium">{inquiry.name}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Step indicators */}
                <div className="flex items-center gap-0 px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                    {STEPS.map((s, i) => (
                        <div key={s.key} className="flex items-center flex-1">
                            <button
                                onClick={() => i < stepIndex && setStep(s.key)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                    step === s.key
                                        ? "bg-amber-400 text-zinc-950"
                                        : i < stepIndex
                                            ? "text-emerald-600 dark:text-emerald-400 cursor-pointer"
                                            : "text-zinc-400 dark:text-zinc-600 cursor-default"
                                )}
                            >
                                {i < stepIndex
                                    ? <CheckCircle size={13} />
                                    : <s.icon size={13} />
                                }
                                <span className="hidden sm:inline">{s.label}</span>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-px mx-2",
                                    i < stepIndex ? "bg-emerald-400" : "bg-zinc-200 dark:bg-white/10"
                                )} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="px-6 py-5 max-h-[50vh] overflow-y-auto flex flex-col gap-4
                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-zinc-200
                    [&::-webkit-scrollbar-thumb]:dark:bg-white/10
                    [&::-webkit-scrollbar-thumb]:rounded-full">

                    {/* ── Step 1: Client ── */}
                    {step === "client" && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Full Name *</Label>
                                    <Input
                                        className={inputCls}
                                        value={clientForm.clientName}
                                        onChange={(e) => setClientForm({ ...clientForm, clientName: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Type</Label>
                                    <div className="flex gap-2">
                                        {(["company", "individual"] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setClientForm({ ...clientForm, clientType: t })}
                                                className={cn(
                                                    "flex-1 py-2 rounded-xl text-xs font-semibold border transition-all",
                                                    clientForm.clientType === t
                                                        ? "bg-amber-400 border-amber-400 text-zinc-950"
                                                        : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400"
                                                )}
                                            >
                                                {t === "company" ? "Company" : "Individual"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Email</Label>
                                <Input
                                    className={cn(inputCls, "opacity-60 cursor-not-allowed")}
                                    value={inquiry.email}
                                    readOnly
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Phone</Label>
                                    <Input
                                        className={inputCls}
                                        placeholder="+1 555 000 0000"
                                        value={clientForm.clientPhone}
                                        onChange={(e) => setClientForm({ ...clientForm, clientPhone: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Position</Label>
                                    <Input
                                        className={inputCls}
                                        placeholder="CEO, Manager..."
                                        value={clientForm.clientPosition}
                                        onChange={(e) => setClientForm({ ...clientForm, clientPosition: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Website</Label>
                                    <Input
                                        className={inputCls}
                                        placeholder="https://..."
                                        value={clientForm.clientWebsite}
                                        onChange={(e) => setClientForm({ ...clientForm, clientWebsite: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Location</Label>
                                    <Input
                                        className={inputCls}
                                        placeholder="City, Country"
                                        value={clientForm.clientLocation}
                                        onChange={(e) => setClientForm({ ...clientForm, clientLocation: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Step 2: Project ── */}
                    {step === "project" && (
                        <>
                            <div className="flex flex-col gap-2">
                                <Label>Project Title *</Label>
                                <Input
                                    className={inputCls}
                                    value={projectForm.projectTitle}
                                    onChange={(e) => setProjectForm({ ...projectForm, projectTitle: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Description</Label>
                                <Textarea
                                    className={cn(inputCls, "resize-none")}
                                    rows={3}
                                    value={projectForm.projectDescription}
                                    onChange={(e) => setProjectForm({ ...projectForm, projectDescription: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Budget (USD)</Label>
                                    <Input
                                        className={inputCls}
                                        placeholder="10000"
                                        value={projectForm.projectBudget}
                                        onChange={(e) => setProjectForm({ ...projectForm, projectBudget: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Start Date</Label>
                                    <DatePicker
                                        value={projectForm.projectStartDate}
                                        onChange={(val) => setProjectForm({ ...projectForm, projectStartDate: val })}
                                        placeholder="Select start date"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Due Date</Label>
                                    <DatePicker
                                        value={projectForm.projectDueDate}
                                        onChange={(val) => setProjectForm({ ...projectForm, projectDueDate: val })}
                                        placeholder="Select due date"
                                        minDate={projectForm.projectStartDate ? new Date(projectForm.projectStartDate) : undefined}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Internal Notes</Label>
                                <Textarea
                                    className={cn(inputCls, "resize-none")}
                                    rows={2}
                                    placeholder="Any internal notes about this project..."
                                    value={projectForm.projectNotes}
                                    onChange={(e) => setProjectForm({ ...projectForm, projectNotes: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {/* ── Step 3: Placement (optional) ── */}
                    {step === "placement" && (
                        <>
                            {/* Skip toggle */}
                            <div className={cn(
                                "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                placementForm.skip
                                    ? "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10"
                                    : "bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20"
                            )}>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        Assign Talent Now
                                    </p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                                        {placementForm.skip
                                            ? "You can create a placement later from the Placements page."
                                            : "Optionally assign a talent to this project right away."}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setPlacementForm((f) => ({ ...f, skip: !f.skip }))}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0",
                                        placementForm.skip
                                            ? "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400"
                                            : "bg-blue-500 border-blue-500 text-white"
                                    )}
                                >
                                    {placementForm.skip
                                        ? <><Briefcase size={12} /> Assign Talent</>
                                        : <><SkipForward size={12} /> Skip for now</>
                                    }
                                </button>
                            </div>

                            {/* Placement fields — hidden when skipped */}
                            {!placementForm.skip && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Talent *</Label>
                                            <CustomSelect
                                                value={placementForm.placementTalentId}
                                                options={
                                                    talents.length === 0
                                                        ? [{ value: "__loading", label: "Loading..." }]
                                                        : talents.map((t) => ({ value: t.id, label: t.name }))
                                                }
                                                onChange={(v) => {
                                                    if (v === "__loading") return
                                                    setPlacementForm((f) => ({ ...f, placementTalentId: v }))
                                                }}
                                                placeholder="Select talent..."
                                                buttonClassName={inputCls}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>Role *</Label>
                                            <Input
                                                className={inputCls}
                                                placeholder="e.g. Frontend Developer"
                                                value={placementForm.placementRole}
                                                onChange={(e) => setPlacementForm((f) => ({ ...f, placementRole: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Hourly Rate (USD)</Label>
                                            <Input
                                                className={inputCls}
                                                placeholder="75.00"
                                                value={placementForm.placementHourlyRate}
                                                onChange={(e) => setPlacementForm((f) => ({ ...f, placementHourlyRate: e.target.value }))}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>Hours / Week</Label>
                                            <Input
                                                className={inputCls}
                                                type="number"
                                                min={1}
                                                max={80}
                                                value={placementForm.placementHoursPerWeek}
                                                onChange={(e) => setPlacementForm((f) => ({ ...f, placementHoursPerWeek: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Placement Start</Label>
                                            <DatePicker
                                                value={placementForm.placementStartDate}
                                                onChange={(val) => setPlacementForm((f) => ({ ...f, placementStartDate: val }))}
                                                placeholder="Defaults to project start"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>Placement End</Label>
                                            <DatePicker
                                                value={placementForm.placementEndDate}
                                                onChange={(val) => setPlacementForm((f) => ({ ...f, placementEndDate: val }))}
                                                placeholder="Leave blank if ongoing"
                                                minDate={placementForm.placementStartDate ? new Date(placementForm.placementStartDate) : undefined}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Placement Notes</Label>
                                        <Textarea
                                            className={cn(inputCls, "resize-none")}
                                            rows={2}
                                            placeholder="Any notes about this placement..."
                                            value={placementForm.placementNotes}
                                            onChange={(e) => setPlacementForm((f) => ({ ...f, placementNotes: e.target.value }))}
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* ── Step 4: Confirm ── */}
                    {step === "confirm" && (
                        <>
                            {/* Summary */}
                            <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-3">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Summary</p>
                                <div className="flex flex-col gap-2 text-sm">
                                    {[
                                        { label: "Client", value: clientForm.clientName },
                                        { label: "Email", value: inquiry.email },
                                        { label: "Type", value: clientForm.clientType },
                                        { label: "Project", value: projectForm.projectTitle },
                                        { label: "Budget", value: projectForm.projectBudget || "—" },
                                        { label: "Start", value: projectForm.projectStartDate || "—" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex items-center justify-between">
                                            <span className="text-zinc-400 dark:text-zinc-500 text-xs">{label}</span>
                                            <span className="text-zinc-700 dark:text-zinc-300 text-xs font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Placement summary or skip notice */}
                            {placementForm.skip ? (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-500 text-xs">
                                    <SkipForward size={13} />
                                    No placement — you can assign talent later from the Placements page.
                                </div>
                            ) : placementForm.placementTalentId ? (
                                <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 flex flex-col gap-2">
                                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Briefcase size={11} /> Placement
                                    </p>
                                    {[
                                        { label: "Talent", value: talents.find((t) => t.id === placementForm.placementTalentId)?.name ?? placementForm.placementTalentId },
                                        { label: "Role", value: placementForm.placementRole },
                                        { label: "Rate", value: placementForm.placementHourlyRate ? `$${placementForm.placementHourlyRate}/hr` : "—" },
                                        { label: "Hours", value: `${placementForm.placementHoursPerWeek}h/wk` },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex items-center justify-between">
                                            <span className="text-zinc-400 dark:text-zinc-500 text-xs">{label}</span>
                                            <span className="text-zinc-700 dark:text-zinc-300 text-xs font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {/* Temp password */}
                            <div className="flex flex-col gap-2">
                                <Label>Temporary Password *</Label>
                                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                    This will be the client's initial portal login password. Share it with them securely.
                                </p>
                                <Input
                                    className={inputCls}
                                    type="text"
                                    placeholder="e.g. Client@Temp2026!"
                                    value={clientForm.tempPassword}
                                    onChange={(e) => setClientForm({ ...clientForm, tempPassword: e.target.value })}
                                />
                            </div>

                            {success && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                                    <CheckCircle size={16} /> Converted successfully! Redirecting...
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-zinc-100 dark:border-white/5">
                    {step !== "client" && (
                        <button
                            onClick={handleBack}
                            className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={
                            saving ||
                            success ||
                            (step === "confirm" && !clientForm.tempPassword) ||
                            (step === "placement" && !canProceedFromPlacement)
                        }
                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-bold text-sm transition-all"
                    >
                        {saving ? (
                            <><Loader2 size={15} className="animate-spin" /> Converting...</>
                        ) : step === "confirm" ? (
                            <><UserPlus size={15} /> Convert & Create Client</>
                        ) : step === "placement" && placementForm.skip ? (
                            <>Skip & Continue →</>
                        ) : (
                            <>Next →</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}