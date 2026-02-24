"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
    Search,
    X,
    Mail,
    Linkedin,
    Github,
    Globe,
    Check,
    CheckCircle,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Experience, FormData, AdminNote } from "@/types/applicant"
import { APPLICANTS_STATUS_CONFIG } from "@/lib/helpers/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const initialApplicants: FormData[] = [
    // NEW
    {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@example.com",
        phone: "+1 555 1234",
        role: "Frontend Developer",
        customRole: "",
        experienceLevel: "Senior",
        availability: "Immediate",
        rateMin: "30",
        rateMax: "50",
        bio: "Passionate front-end developer with 5+ years in React and Tailwind.",
        skills: ["React", "TypeScript", "Tailwind"],
        experiences: [
            {
                id: "exp1",
                company: "Acme Corp",
                role: "Frontend Developer",
                duration: "Jan 2020 - Dec 2022",
                description: "Built React apps and maintained company website.",
            },
        ],
        status: "new",
        resumeFile: new File(["Dummy resume content"], "Alice_Johnson_Resume.pdf", { type: "application/pdf" }),
        certificateFiles: [
            new File(["Dummy certificate content"], "React_Certificate.pdf", { type: "application/pdf" }),
            new File(["Dummy certificate content"], "Tailwind_Certificate.pdf", { type: "application/pdf" }),
        ],
        portfolioUrl: "https://alice-portfolio.com",
        githubUrl: "https://github.com/alice",
        linkedinUrl: "https://linkedin.com/in/alice",
        country: "USA",
        city: "New York",
        notes: [
            { id: "note1", text: "Great portfolio", date: "2026-02-24" },
            { id: "note2", text: "Strong React skills", date: "2026-02-25" },
        ],
    },

    // SCREENING
    {
        firstName: "Charlie",
        lastName: "Davis",
        email: "charlie@example.com",
        phone: "+1 555 9876",
        role: "UI/UX Designer",
        customRole: "",
        experienceLevel: "Mid-level",
        availability: "1 Month",
        rateMin: "20",
        rateMax: "35",
        bio: "Creative UI/UX designer focused on modern and responsive designs.",
        skills: ["Figma", "Adobe XD", "Sketch"],
        experiences: [
            {
                id: "exp3",
                company: "DesignStudio",
                role: "UI/UX Designer",
                duration: "Feb 2019 - Present",
                description: "Designed mobile and web interfaces for clients.",
            },
        ],
        status: "screening",
        resumeFile: new File(["Dummy resume content"], "Charlie_Davis_Resume.pdf", { type: "application/pdf" }),
        certificateFiles: [
            new File(["Dummy certificate content"], "UX_Certificate.pdf", { type: "application/pdf" }),
        ],
        portfolioUrl: "https://charlie-ux.com",
        githubUrl: "",
        linkedinUrl: "https://linkedin.com/in/charlie",
        country: "USA",
        city: "Los Angeles",
        notes: [],
    },

    // INTERVIEWING
    {
        firstName: "Bob",
        lastName: "Smith",
        email: "bob@example.com",
        phone: "+1 555 5678",
        role: "Backend Developer",
        customRole: "",
        experienceLevel: "Mid-level",
        availability: "2 Weeks",
        rateMin: "25",
        rateMax: "40",
        bio: "Backend engineer specializing in Node.js and PostgreSQL.",
        skills: ["Node.js", "PostgreSQL", "Docker"],
        experiences: [
            {
                id: "exp2",
                company: "TechStartup",
                role: "Backend Developer",
                duration: "Mar 2021 - Present",
                description: "Built scalable APIs and managed cloud deployments.",
            },
        ],
        status: "interviewing",
        resumeFile: new File(["Dummy resume content"], "Bob_Smith_Resume.pdf", { type: "application/pdf" }),
        certificateFiles: [
            new File(["Dummy certificate content"], "NodeJS_Certificate.pdf", { type: "application/pdf" }),
        ],
        portfolioUrl: "",
        githubUrl: "https://github.com/bob",
        linkedinUrl: "https://linkedin.com/in/bob",
        country: "USA",
        city: "San Francisco",
        notes: [],
    },

    // REVIEWING
    {
        firstName: "Dana",
        lastName: "Lee",
        email: "dana@example.com",
        phone: "+1 555 4321",
        role: "Fullstack Developer",
        customRole: "",
        experienceLevel: "Senior",
        availability: "Immediate",
        rateMin: "35",
        rateMax: "60",
        bio: "Fullstack developer with expertise in MERN stack.",
        skills: ["MongoDB", "Express", "React", "Node.js"],
        experiences: [
            {
                id: "exp4",
                company: "Innovatech",
                role: "Fullstack Developer",
                duration: "Jan 2018 - Present",
                description: "Developed fullstack applications for SaaS platforms.",
            },
        ],
        status: "reviewing",
        resumeFile: new File(["Dummy resume content"], "Dana_Lee_Resume.pdf", { type: "application/pdf" }),
        certificateFiles: [
            new File(["Dummy certificate content"], "MERN_Certificate.pdf", { type: "application/pdf" }),
        ],
        portfolioUrl: "https://dana-portfolio.com",
        githubUrl: "https://github.com/dana",
        linkedinUrl: "https://linkedin.com/in/dana",
        country: "USA",
        city: "Chicago",
        notes: [],
    },

    // APPROVED
    {
        firstName: "Ethan",
        lastName: "Wright",
        email: "ethan@example.com",
        phone: "+1 555 8765",
        role: "DevOps Engineer",
        customRole: "",
        experienceLevel: "Mid-level",
        availability: "Immediate",
        rateMin: "30",
        rateMax: "50",
        bio: "DevOps engineer with experience in CI/CD pipelines and AWS.",
        skills: ["AWS", "Docker", "Kubernetes"],
        experiences: [
            {
                id: "exp5",
                company: "CloudOps",
                role: "DevOps Engineer",
                duration: "Jun 2019 - Present",
                description: "Managed cloud infrastructure and automated deployments.",
            },
        ],
        status: "approved",
        resumeFile: new File(["Dummy resume content"], "Ethan_Wright_Resume.pdf", { type: "application/pdf" }),
        certificateFiles: [
            new File(["Dummy certificate content"], "AWS_Certificate.pdf", { type: "application/pdf" }),
        ],
        portfolioUrl: "",
        githubUrl: "https://github.com/ethan",
        linkedinUrl: "https://linkedin.com/in/ethan",
        country: "USA",
        city: "Seattle",
        notes: [],
    },

    // REJECTED
    {
        firstName: "Fiona",
        lastName: "Nguyen",
        email: "fiona@example.com",
        phone: "+1 555 6543",
        role: "QA Engineer",
        customRole: "",
        experienceLevel: "Junior",
        availability: "2 Weeks",
        rateMin: "20",
        rateMax: "35",
        bio: "QA engineer with experience in manual and automated testing.",
        skills: ["Selenium", "Cypress", "Jest"],
        experiences: [
            {
                id: "exp6",
                company: "QualityWorks",
                role: "QA Engineer",
                duration: "Jan 2020 - Present",
                description: "Performed automated and manual tests for web apps.",
            },
        ],
        status: "rejected",
        resumeFile: new File(["Dummy resume content"], "Fiona_Nguyen_Resume.pdf", { type: "application/pdf" }),
        certificateFiles: [
            new File(["Dummy certificate content"], "QA_Certificate.pdf", { type: "application/pdf" }),
        ],
        portfolioUrl: "",
        githubUrl: "https://github.com/fiona",
        linkedinUrl: "https://linkedin.com/in/fiona",
        country: "USA",
        city: "Boston",
        notes: [],
    },
]

export default function DashboardApplicants() {
    const [applicants, setApplicants] = useState(initialApplicants)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [selected, setSelected] = useState<FormData | null>(null)
    const [approved, setApproved] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [applicantToDelete, setApplicantToDelete] = useState<FormData | null>(null);
    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
    const [actionReason, setActionReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    const PAGE_SIZE = 5

    const filtered = useMemo(() => {
        return applicants.filter(
            (a) =>
                (filterStatus === "all" || a.status === filterStatus) &&
                (a.firstName.toLowerCase().includes(search.toLowerCase()) ||
                    a.lastName.toLowerCase().includes(search.toLowerCase()) ||
                    a.email.toLowerCase().includes(search.toLowerCase()))
        )
    }, [applicants, search, filterStatus])

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    const handleReject = (reason: string) => {
        if (!selected) return;

        const newNote: AdminNote = {
            id: Date.now().toString(),
            text: `Rejected: ${reason}`,
            date: new Date().toLocaleString(),
        };

        setApplicants((prev) =>
            prev.map((a) =>
                a.email === selected.email
                    ? { ...a, status: "rejected", notes: [newNote, ...(a.notes || [])] }
                    : a
            )
        );

        setSelected((prev) =>
            prev ? { ...prev, status: "rejected", notes: [newNote, ...(prev.notes || [])] } : null
        );

    };

    const handleApprove = (reason: string) => {
        if (!selected) return;

        const newNote: AdminNote = {
            id: Date.now().toString(),
            text: `Approved: ${reason}`,
            date: new Date().toLocaleString(),
        };

        setApplicants((prev) =>
            prev.map((a) =>
                a.email === selected.email
                    ? { ...a, status: "approved", notes: [newNote, ...(a.notes || [])] }
                    : a
            )
        );

        setSelected((prev) =>
            prev ? { ...prev, status: "approved", notes: [newNote, ...(prev.notes || [])] } : null
        );
    };

    const addNote = (text: string) => {
        if (!text.trim() || !selected) return;

        const newNote: AdminNote = {
            id: Date.now().toString(),
            text,
            date: new Date().toLocaleString(),
        };

        setApplicants((prev) =>
            prev.map((a) =>
                a.email === selected.email
                    ? { ...a, notes: [newNote, ...(a.notes || [])] }
                    : a
            )
        );

        setSelected((prev) =>
            prev ? { ...prev, notes: [newNote, ...(prev.notes || [])] } : null
        );
    };

    const deleteApplicant = (email: string) => {
        setApplicants(applicants.filter((a) => a.email !== email))
        if (selected?.email === email) setSelected(null)
    }

    const deleteNote = (id: string) => {
        if (!selected) return;

        setApplicants((prev) =>
            prev.map((a) =>
                a.email === selected.email
                    ? { ...a, notes: (a.notes || []).filter((n) => n.id !== id) }
                    : a
            )
        );

        setSelected((prev) =>
            prev ? { ...prev, notes: (prev.notes || []).filter((n) => n.id !== id) } : null
        );
    };

    return (
        <div className="p-8 md:p-10 h-full flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Applicants</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">{applicants.length} total applicants</p>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap">
                <Button
                    onClick={() => { setFilterStatus("all"); setCurrentPage(1) }}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        filterStatus === "all"
                            ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                            : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                    )}
                >
                    All
                </Button>
                {Object.entries(APPLICANTS_STATUS_CONFIG).map(([key, { label }]) => (
                    <Button
                        key={key}
                        onClick={() => { setFilterStatus(key); setCurrentPage(1) }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                            filterStatus === key
                                ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                        )}
                    >
                        {label}
                    </Button>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all"
                />
            </div>

            {/* Panels */}
            <div className="flex gap-6 flex-1 h-full">
                {/* Applicant List */}
                <div className={cn("flex flex-col gap-3 transition-all duration-300", selected ? "w-full lg:w-2/5" : "w-full")}>
                    {paginated.length === 0 ? (
                        <div className="text-center py-16 text-zinc-400 dark:text-zinc-600 text-sm bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl">
                            No applicants found.
                        </div>
                    ) : (
                        paginated.map((a) => (
                            <div
                                key={a.email}
                                onClick={() => {
                                    setSelected(a)
                                    setApproved(false)
                                }}
                                className={cn(
                                    "bg-white dark:bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-all duration-150 hover:shadow-sm",
                                    selected?.email === a.email
                                        ? "border-amber-400 shadow-sm shadow-amber-100 dark:shadow-amber-500/10"
                                        : "border-zinc-100 dark:border-white/5 hover:border-zinc-200 dark:hover:border-white/10"
                                )}
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{a.firstName} {a.lastName}</p>
                                        <p className="text-zinc-400 dark:text-zinc-500 text-xs truncate">{a.role} · {a.experienceLevel}</p>
                                    </div>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-xs font-medium shrink-0",
                                        APPLICANTS_STATUS_CONFIG[a.status]?.className || "bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300"
                                    )}>
                                        {APPLICANTS_STATUS_CONFIG[a.status]?.label || a.status}
                                    </span>
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2">{a.bio}</p>
                            </div>
                        ))
                    )}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={15} />
                                </button>

                                {(() => {
                                    const pages: (number | string)[] = []
                                    if (totalPages <= 5) {
                                        for (let i = 1; i <= totalPages; i++) pages.push(i)
                                    } else {
                                        pages.push(1)
                                        if (currentPage > 3) pages.push('...')
                                        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                                            pages.push(i)
                                        }
                                        if (currentPage < totalPages - 2) pages.push('...')
                                        pages.push(totalPages)
                                    }

                                    return pages.map((page, idx) =>
                                        page === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-zinc-400 text-sm">
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page as number)}
                                                className={cn(
                                                    "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                                                    currentPage === page
                                                        ? "bg-amber-400 text-zinc-950"
                                                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                                )}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )
                                })()}

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {selected && (
                    <div className="hidden lg:flex flex-col flex-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {selected.firstName.charAt(0)}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold text-zinc-900 dark:text-white text-lg">
                                        {selected.firstName} {selected.lastName}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-zinc-400 dark:text-zinc-500 text-sm">{selected.role}</span>
                                        {/* Status Badge */}
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-lg text-xs font-medium",
                                            APPLICANTS_STATUS_CONFIG[selected.status]?.className || "bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300"
                                        )}>
                                            {APPLICANTS_STATUS_CONFIG[selected.status]?.label || selected.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => setSelected(null)}
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                            >
                                <X size={16} />
                            </Button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                            {/* Contact & Links */}
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-white/5 rounded-2xl p-4">
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <Mail size={14} className="text-zinc-400 shrink-0" />
                                        <a href={`mailto:${selected.email}`} className="text-amber-500 hover:underline truncate">{selected.email}</a>
                                    </div>
                                    {selected.phone && (
                                        <div className="flex items-center gap-2.5 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-400">{selected.phone}</span>
                                        </div>
                                    )}
                                    {selected.linkedinUrl && (
                                        <div className="flex items-center gap-2.5 text-sm">
                                            <Linkedin size={14} className="text-zinc-400 shrink-0" />
                                            <a href={selected.linkedinUrl} className="text-amber-500 hover:underline truncate">{selected.linkedinUrl}</a>
                                        </div>
                                    )}
                                    {selected.githubUrl && (
                                        <div className="flex items-center gap-2.5 text-sm">
                                            <Github size={14} className="text-zinc-400 shrink-0" />
                                            <a href={selected.githubUrl} className="text-amber-500 hover:underline truncate">{selected.githubUrl}</a>
                                        </div>
                                    )}
                                    {selected.portfolioUrl && (
                                        <div className="flex items-center gap-2.5 text-sm">
                                            <Globe size={14} className="text-zinc-400 shrink-0" />
                                            <a href={selected.portfolioUrl} className="text-amber-500 hover:underline truncate">{selected.portfolioUrl}</a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Bio</p>
                                <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4">
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{selected.bio}</p>
                                </div>
                            </div>

                            {/* Rate & Skills */}
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Rate</p>
                                <p className="text-sm text-zinc-900 dark:text-white">${selected.rateMin} - ${selected.rateMax} / hr</p>

                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mt-2">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {selected.skills.map((skill) => (
                                        <span key={skill} className="bg-amber-100 dark:bg-amber-700/20 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-md text-xs font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Resume & Certificates */}
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Resume & Certificates</p>

                                {/* Resume */}
                                {selected.resumeFile && (
                                    <div className="flex items-center justify-between text-sm bg-zinc-50 dark:bg-white/5 p-2 rounded">
                                        <span className="truncate">{selected.resumeFile.name} (Resume)</span>
                                        <div className="flex gap-2">
                                            <a
                                                href={URL.createObjectURL(selected.resumeFile)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-2 py-1 text-amber-500 bg-amber-100 dark:bg-amber-700/20 rounded hover:bg-amber-200 dark:hover:bg-amber-600 transition-all text-xs font-medium"
                                            >
                                                <Eye size={12} /> View
                                            </a>
                                            <a
                                                href={URL.createObjectURL(selected.resumeFile)}
                                                download={selected.resumeFile.name}
                                                className="flex items-center gap-1 px-2 py-1 text-white bg-amber-500 rounded hover:bg-amber-400 transition-all text-xs font-medium"
                                            >
                                                <Download size={12} /> Download
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Certificates */}
                                {selected.certificateFiles.length > 0 && selected.certificateFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm bg-zinc-50 dark:bg-white/5 p-2 rounded">
                                        <span className="truncate">{file.name}</span>
                                        <div className="flex gap-2">
                                            <a
                                                href={URL.createObjectURL(file)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-2 py-1 text-amber-500 bg-amber-100 dark:bg-amber-700/20 rounded hover:bg-amber-200 dark:hover:bg-amber-600 transition-all text-xs font-medium"
                                            >
                                                <Eye size={12} /> View
                                            </a>
                                            <a
                                                href={URL.createObjectURL(file)}
                                                download={file.name}
                                                className="flex items-center gap-1 px-2 py-1 text-white bg-amber-500 rounded hover:bg-amber-400 transition-all text-xs font-medium"
                                            >
                                                <Download size={12} /> Download
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Experiences */}
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Experiences</p>
                                {selected.experiences.map((exp: Experience) => (
                                    <div key={exp.id} className="bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-xl p-3">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{exp.role} @ {exp.company}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{exp.duration}</p>
                                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{exp.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Admin Notes */}
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Admin Notes</p>
                                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                                    {selected.notes.map((note) => (
                                        <div
                                            key={note.id}
                                            className="flex justify-between items-center bg-zinc-50 dark:bg-white/5 p-2 rounded-xl text-xs text-zinc-600 dark:text-zinc-400"
                                        >
                                            <div className="flex flex-col">
                                                <p className="text-sm">{note.text}</p>
                                                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{note.date}</span>
                                            </div>
                                            <button
                                                onClick={() => deleteNote(note.id)}
                                                className="ml-2 text-red-500 hover:text-red-600 transition-colors"
                                                aria-label="Delete note"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="text"
                                        placeholder="Add a note..."
                                        className="flex-1 text-xs rounded-xl border border-zinc-200 dark:border-white/10 px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                                                addNote(e.currentTarget.value.trim());
                                                e.currentTarget.value = "";
                                            }
                                        }}
                                    />
                                    <Button
                                        onClick={(e) => {
                                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                            if (input.value.trim() === "") return;
                                            addNote(input.value.trim());
                                            input.value = "";
                                        }}
                                        size="sm"
                                        className="h-10"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 mt-2">
                                {/* Approve Button */}
                                {["new", "screening", "interviewing", "reviewing"].includes(selected.status) && (
                                    <Button
                                        onClick={() => {
                                            setActionType("approve");
                                            setActionReason("");
                                            setCustomReason("");
                                            setActionModalOpen(true);
                                        }}
                                        className={cn(
                                            "w-full rounded-xl font-bold h-11 gap-2 transition-all",
                                            approved
                                                ? "bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                : "bg-emerald-500 hover:bg-emerald-400 text-white"
                                        )}
                                    >
                                        {approved ? (
                                            <>
                                                <CheckCircle size={14} className="animate-scale-in" />
                                                Approved!
                                            </>
                                        ) : (
                                            <>
                                                <Check size={14} />
                                                Approve Applicant
                                            </>
                                        )}
                                    </Button>
                                )}

                                {/* Reject Button */}
                                {!["rejected", "approved"].includes(selected.status) && (
                                    <Button
                                        onClick={() => {
                                            setActionType("reject");
                                            setActionReason("");
                                            setCustomReason("");
                                            setActionModalOpen(true);
                                        }}
                                        className="w-full rounded-xl font-bold h-11 gap-2 bg-red-500 hover:bg-red-400 text-white"
                                    >
                                        <XCircle size={14} />
                                        Reject Applicant
                                    </Button>
                                )}

                                {/* Delete Button */}
                                <Button
                                    onClick={() => {
                                        setApplicantToDelete(selected);
                                        setDeleteModalOpen(true);
                                    }}
                                    className={cn(
                                        "flex items-center justify-center gap-2 h-11 rounded-xl border font-medium text-sm transition-colors",
                                        "bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-500 text-red-600",
                                        "hover:bg-red-100 dark:hover:bg-red-600/20 hover:border-red-400 dark:hover:border-red-400"
                                    )}
                                >
                                    <Trash2 size={15} />
                                    Delete Applicant
                                </Button>
                            </div>

                            {/* Action Confirmation Modal */}
                            {actionModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col gap-4">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                                            {actionType === "approve" ? "Approve Applicant" : "Reject Applicant"}
                                        </h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Please enter a reason:</p>

                                        <Select
                                            value={actionReason}
                                            onValueChange={(value) => setActionReason(value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a reason" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {actionType === "approve" ? (
                                                    <>
                                                        <SelectItem value="Excellent skills">Excellent skills</SelectItem>
                                                        <SelectItem value="Strong portfolio">Strong portfolio</SelectItem>
                                                        <SelectItem value="Good interview performance">Good interview performance</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </>
                                                ) : (
                                                    <>
                                                        <SelectItem value="Not a fit for role">Not a fit for role</SelectItem>
                                                        <SelectItem value="Missing requirements">Missing requirements</SelectItem>
                                                        <SelectItem value="Poor interview performance">Poor interview performance</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>

                                        {actionReason === "Other" && (
                                            <input
                                                type="text"
                                                placeholder="Enter custom reason..."
                                                value={customReason}
                                                onChange={(e) => setCustomReason(e.target.value)}
                                                className="w-full rounded-xl border border-zinc-200 dark:border-white/10 px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-all"
                                            />
                                        )}

                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setActionModalOpen(false)}
                                                className="h-10"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    const reason = actionReason === "Other" ? customReason : actionReason;
                                                    if (!reason) return;

                                                    const reasonText = reason || "No reason provided";

                                                    if (actionType === "approve") {
                                                        handleApprove(reason);

                                                        toast(
                                                            <div className="flex items-center gap-2">
                                                                <span>Applicant Approved</span>
                                                            </div>,
                                                            {
                                                                unstyled: true,
                                                                classNames: {
                                                                    toast: "bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2",
                                                                    title: "font-semibold",
                                                                    description: "text-sm text-white/80",
                                                                    closeButton: "text-white hover:text-white/80",
                                                                },
                                                                description: `Reason: ${reasonText}`,
                                                                duration: 5000,
                                                                position: "top-right",
                                                            }
                                                        );
                                                    }

                                                    if (actionType === "reject") {
                                                        handleReject(reason);

                                                        toast(
                                                            <div className="flex items-center gap-2">
                                                                <span>Applicant Rejected</span>
                                                            </div>,
                                                            {
                                                                unstyled: true,
                                                                classNames: {
                                                                    toast: "bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2",
                                                                    title: "font-semibold",
                                                                    description: "text-sm text-white/80",
                                                                    closeButton: "text-white hover:text-white/80",
                                                                },
                                                                description: `Reason: ${reasonText}`,
                                                                duration: 5000,
                                                                position: "top-right",
                                                            }
                                                        );
                                                    }

                                                    setActionModalOpen(false);
                                                }}
                                                className="h-10"
                                            >
                                                Confirm
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Delete Confirmation Modal */}
                            {deleteModalOpen && applicantToDelete && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-md p-6">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Trash2 size={18} /> Confirm Delete
                                        </h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                                            Are you sure you want to delete <strong>{applicantToDelete.firstName} {applicantToDelete.lastName}</strong>?
                                            This action cannot be undone and all progress, statuses, and notes will be removed.
                                        </p>
                                        <div className="flex justify-end gap-3">
                                            <Button
                                                onClick={() => setDeleteModalOpen(false)}
                                                variant="outline"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    deleteApplicant(applicantToDelete.email);
                                                    setDeleteModalOpen(false);
                                                    setSelected(null);
                                                }}
                                                variant="destructive"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}