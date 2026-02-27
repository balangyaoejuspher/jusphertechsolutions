"use client"

import { useEffect, useRef, useState } from "react"
import { Mail, Clock, MessageSquare, ChevronDown, Send, CheckCircle, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EMAIL_REGEX, NAME_REGEX } from "@/lib/helpers/validators"
import { publicFetch } from "@/lib/api/public-fetcher"

const faqs = [
    {
        question: "How long does it take to find a match?",
        answer: "Our average match time is 48 hours. For specialized roles or larger teams, it may take up to 5 business days. We'll always keep you updated throughout the process.",
    },
    {
        question: "How do you vet your talent?",
        answer: "Every professional goes through a multi-step vetting process — technical assessment, portfolio review, live interview, and reference checks. Only the top 5% make it into our network.",
    },
    {
        question: "Are there long-term contracts?",
        answer: "No long-term contracts required. We offer flexible arrangements — hourly, part-time, or full-time. You can scale up or down based on your needs at any time.",
    },
    {
        question: "What if I'm not satisfied with my match?",
        answer: "We offer a satisfaction guarantee. If your match isn't working out within the first 2 weeks, we'll find you a replacement at no additional cost.",
    },
    {
        question: "Do you support different time zones?",
        answer: "Absolutely. Our talent network spans 30+ countries so we can match you with professionals who work in your preferred time zone or overlap hours.",
    },
]

const contactInfo = [
    { icon: Mail, label: "Email Us", value: "support@juspherandco.com", sub: "We reply within 24 hours" },
    { icon: Clock, label: "Working Hours", value: "Mon – Fri, 9am – 6pm", sub: "GMT+8 / Philippine Standard Time" },
    { icon: MessageSquare, label: "Response Time", value: "Under 24 hours", sub: "For all inquiries" },
]

function FaqItem({ faq, index, isOpen, onToggle }: {
    faq: typeof faqs[0]
    index: number
    isOpen: boolean
    onToggle: () => void
}) {
    const contentRef = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState(0)

    useEffect(() => {
        if (contentRef.current) {
            setHeight(isOpen ? contentRef.current.scrollHeight : 0)
        }
    }, [isOpen])

    return (
        <div className={cn(
            "border rounded-2xl overflow-hidden transition-all duration-300",
            isOpen
                ? "border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5"
                : "border-border bg-card hover:border-amber-200/60 dark:hover:border-amber-500/10"
        )}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-5 text-left group"
            >
                <div className="flex items-center gap-4 pr-4">
                    <span className={cn(
                        "text-[10px] font-black tabular-nums shrink-0 transition-colors duration-200",
                        isOpen ? "text-amber-400" : "text-muted-foreground/30"
                    )}>
                        0{index + 1}
                    </span>
                    <span className={cn(
                        "text-sm font-semibold leading-snug transition-colors duration-200",
                        isOpen ? "text-foreground" : "text-foreground/80"
                    )}>
                        {faq.question}
                    </span>
                </div>
                <div className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300",
                    isOpen
                        ? "border-amber-400/50 bg-amber-400/10 rotate-45"
                        : "border-border bg-muted"
                )}>
                    <Plus size={12} className={cn(
                        "transition-colors duration-200",
                        isOpen ? "text-amber-500" : "text-muted-foreground"
                    )} />
                </div>
            </button>

            <div
                style={{ height, overflow: "hidden", transition: "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
                <div ref={contentRef} className="px-6 pb-5 pl-16">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    )
}

function FieldWrapper({ label, required, optional, error, children }: {
    label: string
    required?: boolean
    optional?: boolean
    error?: string
    children: React.ReactNode
}) {
    return (
        <div>
            <label className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                {label}
                {required && <span className="text-red-400 normal-case font-normal text-xs">*</span>}
                {optional && <span className="text-muted-foreground/40 normal-case font-normal tracking-normal">— optional</span>}
            </label>
            {children}
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
        </div>
    )
}

const inputBase = "w-full px-4 py-3 rounded-xl border text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200 bg-background"
const inputIdle = "border-border focus:border-amber-400 dark:focus:border-amber-500 focus:ring-2 focus:ring-amber-400/10"
const inputLocked = "bg-muted cursor-not-allowed opacity-60 border-border"
const inputError = "border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/10"

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", company: "", message: "" })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(0)
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false)

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!form.name.trim()) newErrors.name = "Name is required"
        else if (!NAME_REGEX.test(form.name)) newErrors.name = "Enter a valid name"
        if (!form.email.trim()) newErrors.email = "Email is required"
        else if (!EMAIL_REGEX.test(form.email)) newErrors.email = "Enter a valid email"
        if (!form.message.trim()) newErrors.message = "Message is required"
        else if (form.message.trim().length < 10) newErrors.message = "Must be at least 10 characters"
        return newErrors
    }

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch("/api/auth/me")
                const { loggedIn, data } = await res.json()
                if (loggedIn && data) {
                    setUserIsLoggedIn(true)
                    setForm(prev => ({ ...prev, name: data.name ?? "", email: data.email ?? "", company: data.company ?? "" }))
                }
            } catch (err) {
                console.error(err)
            }
        }
        loadUser()
    }, [])

    const handleSubmit = async () => {
        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
        setErrors({})
        setLoading(true)
        try {
            await publicFetch.post("/send-inquiry", form)
            setSubmitted(true)
            setForm({ name: "", email: "", company: "", message: "" })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-background min-h-screen">

            {/* Hero */}
            <section className="relative pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden bg-background">
                <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-50" />
                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-10 blur-[120px]"
                    style={{ background: "radial-gradient(circle, #fbbf24 0%, #f59e0b 40%, transparent 70%)" }} />
                <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-10 dark:opacity-8 blur-[100px]"
                    style={{ background: "radial-gradient(circle, #a78bfa 0%, #8b5cf6 40%, transparent 70%)" }} />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />

                <div className="container relative mx-auto px-6 md:px-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                        Contact Us
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-foreground leading-[0.95] tracking-tight mb-6">
                        Let's Start a
                        <br />
                        <span className="text-muted-foreground/40">Conversation</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed font-light">
                        Tell us what you need and we'll get back to you within 24 hours
                        with the right talent options for your business.
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-10 border-y border-border bg-card/30">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {contactInfo.map((info) => (
                            <div key={info.label} className="flex items-start gap-4 bg-background border border-border rounded-2xl p-5 hover:border-amber-200 dark:hover:border-amber-500/20 transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center shrink-0 group-hover:border-amber-300 dark:group-hover:border-amber-500/40 transition-colors">
                                    <info.icon size={16} className="text-amber-500 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-1">{info.label}</p>
                                    <p className="text-foreground font-semibold text-sm mb-0.5">{info.value}</p>
                                    <p className="text-muted-foreground/50 text-xs">{info.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form + FAQ */}
            <section className="py-20 md:py-28 bg-background">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                        {/* Form */}
                        <div>
                            <p className="text-[10px] font-semibold text-amber-500 dark:text-amber-400 uppercase tracking-widest mb-3">— Get in touch</p>
                            <h2 className="text-4xl font-black text-foreground tracking-tight mb-2">Send Us a Message</h2>
                            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                Fill out the form and our team will be in touch shortly.
                            </p>

                            {submitted ? (
                                <div className="flex flex-col items-center justify-center text-center py-16 px-8 bg-card border border-border rounded-3xl">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center mb-5">
                                        <CheckCircle size={26} className="text-emerald-500" />
                                    </div>
                                    <h3 className="font-black text-foreground text-xl mb-2">Message Sent!</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                                        Thanks for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 text-sm text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 font-semibold transition-colors"
                                    >
                                        Send another message →
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FieldWrapper label="Full Name" required error={errors.name}>
                                            <input
                                                type="text"
                                                placeholder="John Smith"
                                                value={form.name}
                                                readOnly={userIsLoggedIn && !!form.name}
                                                onChange={(e) => {
                                                    const v = e.target.value
                                                    setForm({ ...form, name: v })
                                                    setErrors(prev => ({ ...prev, name: !v.trim() ? "" : !NAME_REGEX.test(v) ? "Only letters, spaces, hyphens, apostrophes" : "" }))
                                                }}
                                                className={cn(inputBase, userIsLoggedIn && form.name ? inputLocked : inputIdle, errors.name && inputError)}
                                            />
                                        </FieldWrapper>

                                        <FieldWrapper label="Email" required error={errors.email}>
                                            <input
                                                type="email"
                                                placeholder="john@company.com"
                                                value={form.email}
                                                readOnly={userIsLoggedIn && !!form.email}
                                                onChange={(e) => {
                                                    const v = e.target.value
                                                    setForm({ ...form, email: v })
                                                    setErrors(prev => ({ ...prev, email: !v.trim() ? "" : !EMAIL_REGEX.test(v) ? "Enter a valid email address" : "" }))
                                                }}
                                                className={cn(inputBase, userIsLoggedIn && form.email ? inputLocked : inputIdle, errors.email && inputError)}
                                            />
                                        </FieldWrapper>
                                    </div>

                                    <FieldWrapper label="Company" optional>
                                        <input
                                            type="text"
                                            placeholder="Juspher Tech Solution"
                                            value={form.company}
                                            readOnly={!!form.company}
                                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                                            className={cn(inputBase, form.company ? inputLocked : inputIdle)}
                                        />
                                    </FieldWrapper>

                                    <FieldWrapper label="Message" required error={errors.message}>
                                        <textarea
                                            rows={5}
                                            placeholder="Tell us about your project..."
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className={cn(inputBase, "resize-none", errors.message ? inputError : inputIdle)}
                                        />
                                    </FieldWrapper>

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send size={15} />
                                                Send Message
                                            </span>
                                        )}
                                    </Button>

                                    <p className="text-[11px] text-muted-foreground/40 text-center">
                                        We'll never share your information with third parties.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ */}
                        <div>
                            <p className="text-[10px] font-semibold text-amber-500 dark:text-amber-400 uppercase tracking-widest mb-3">— FAQ</p>
                            <h2 className="text-4xl font-black text-foreground tracking-tight mb-2">Common Questions</h2>
                            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                Can't find the answer? Send us a message instead.
                            </p>

                            <div className="flex flex-col gap-2">
                                {faqs.map((faq, i) => (
                                    <FaqItem
                                        key={i}
                                        faq={faq}
                                        index={i}
                                        isOpen={openFaq === i}
                                        onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}