"use client"

import { useState } from "react"
import { Mail, Clock, MessageSquare, ChevronDown, Send, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const faqs = [
    {
        question: "How long does it take to find a match?",
        answer:
            "Our average match time is 48 hours. For specialized roles or larger teams, it may take up to 5 business days. We'll always keep you updated throughout the process.",
    },
    {
        question: "How do you vet your talent?",
        answer:
            "Every professional goes through a multi-step vetting process — technical assessment, portfolio review, live interview, and reference checks. Only the top 5% make it into our network.",
    },
    {
        question: "Are there long-term contracts?",
        answer:
            "No long-term contracts required. We offer flexible arrangements — hourly, part-time, or full-time. You can scale up or down based on your needs at any time.",
    },
    {
        question: "What if I'm not satisfied with my match?",
        answer:
            "We offer a satisfaction guarantee. If your match isn't working out within the first 2 weeks, we'll find you a replacement at no additional cost.",
    },
    {
        question: "Do you support different time zones?",
        answer:
            "Absolutely. Our talent network spans 30+ countries so we can match you with professionals who work in your preferred time zone or overlap hours.",
    },
]

const contactInfo = [
    {
        icon: Mail,
        label: "Email Us",
        value: "support@jusphertechsolution.com",
        sub: "We reply within 24 hours",
    },
    {
        icon: Clock,
        label: "Working Hours",
        value: "Mon – Fri, 9am – 6pm",
        sub: "GMT+8 / Philippine Standard Time",
    },
    {
        icon: MessageSquare,
        label: "Response Time",
        value: "Under 24 hours",
        sub: "For all inquiries",
    },
]

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        company: "",
        message: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!form.name.trim()) newErrors.name = "Name is required"
        if (!form.email.trim()) newErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            newErrors.email = "Enter a valid email"
        if (!form.message.trim()) newErrors.message = "Message is required"
        else if (form.message.trim().length < 10)
            newErrors.message = "Message must be at least 10 characters"
        return newErrors
    }

    const handleSubmit = async () => {
        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        setErrors({})
        setLoading(true)

        try {
            const res = await fetch("/api/send-inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (res.ok) {
                setSubmitted(true)
                setForm({ name: "", email: "", company: "", message: "" })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">

            {/* Hero */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />
                <div className="container relative mx-auto px-6 md:px-12 text-center">
                    <p className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                        — Contact Us
                    </p>
                    <h1 className="font-display text-6xl md:text-8xl font-bold text-zinc-900 dark:text-white leading-[0.95] tracking-tight mb-6">
                        Let's Start a
                        <br />
                        <span className="text-zinc-400 dark:text-zinc-500">Conversation</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-lg mx-auto leading-relaxed font-light">
                        Tell us what you need and we'll get back to you within 24 hours
                        with the right talent options for your business.
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-white/5">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {contactInfo.map((info) => (
                            <div
                                key={info.label}
                                className="flex items-start gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6"
                            >
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center shrink-0">
                                    <info.icon size={18} className="text-amber-500 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">
                                        {info.label}
                                    </p>
                                    <p className="text-zinc-900 dark:text-white font-semibold text-sm mb-0.5">
                                        {info.value}
                                    </p>
                                    <p className="text-zinc-400 dark:text-zinc-600 text-xs">{info.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form + FAQ */}
            <section className="py-20 md:py-28 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Contact Form */}
                        <div>
                            <h2 className="font-display text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                                Send Us a Message
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
                                Fill out the form and our team will be in touch shortly.
                            </p>

                            {submitted ? (
                                <div className="flex flex-col items-center justify-center text-center py-16 px-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl">
                                    <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex items-center justify-center mb-5">
                                        <CheckCircle size={28} className="text-green-500" />
                                    </div>
                                    <h3 className="font-bold text-zinc-900 dark:text-white text-xl mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs">
                                        Thanks for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 text-sm text-amber-500 dark:text-amber-400 hover:underline font-medium"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {/* Name + Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2">
                                                Full Name <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="John Smith"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-xl border text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none transition-all",
                                                    errors.name
                                                        ? "border-red-400 dark:border-red-500 focus:border-red-400"
                                                        : "border-zinc-200 dark:border-white/10 focus:border-amber-400 dark:focus:border-amber-500"
                                                )}
                                            />
                                            {errors.name && (
                                                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2">
                                                Email <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="john@company.com"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-xl border text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none transition-all",
                                                    errors.email
                                                        ? "border-red-400 dark:border-red-500 focus:border-red-400"
                                                        : "border-zinc-200 dark:border-white/10 focus:border-amber-400 dark:focus:border-amber-500"
                                                )}
                                            />
                                            {errors.email && (
                                                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2">
                                            Company <span className="text-zinc-300 dark:text-zinc-600 font-normal normal-case tracking-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Acme Corp"
                                            value={form.company}
                                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-amber-400 dark:focus:border-amber-500 transition-all"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2">
                                            Message <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            rows={5}
                                            placeholder="Tell us about your project, what kind of talent you need, and your timeline..."
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className={cn(
                                                "w-full px-4 py-3 rounded-xl border text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none transition-all resize-none",
                                                errors.message
                                                    ? "border-red-400 dark:border-red-500 focus:border-red-400"
                                                    : "border-zinc-200 dark:border-white/10 focus:border-amber-400 dark:focus:border-amber-500"
                                            )}
                                        />
                                        {errors.message && (
                                            <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-md shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
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
                                                <Send size={16} />
                                                Send Message
                                            </span>
                                        )}
                                    </Button>

                                    <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center">
                                        We'll never share your information with third parties.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ */}
                        <div>
                            <h2 className="font-display text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                                Common Questions
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
                                Can't find the answer? Send us a message instead.
                            </p>

                            <div className="flex flex-col gap-3">
                                {faqs.map((faq, i) => (
                                    <div
                                        key={i}
                                        className="border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between px-6 py-4 text-left bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <span className="text-sm font-semibold text-zinc-900 dark:text-white pr-4">
                                                {faq.question}
                                            </span>
                                            <ChevronDown
                                                size={16}
                                                className={cn(
                                                    "shrink-0 text-zinc-400 dark:text-zinc-600 transition-transform duration-200",
                                                    openFaq === i ? "rotate-180" : ""
                                                )}
                                            />
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-6 py-4 bg-white dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-white/5">
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    )
}