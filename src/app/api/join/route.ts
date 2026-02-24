import { resend } from "@/lib/resend"
import { JoinApplicationEmail } from "@/emails/join-application-email"
import { NextResponse } from "next/server"
import { z } from "zod"
import { JoinConfirmationEmail } from "@/emails/join-confirmation-email"

const joinSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    role: z.string().min(1, "Role is required"),
    customRole: z.string().optional(),
    experienceLevel: z.string().min(1, "Experience level is required"),
    availability: z.string().min(1, "Availability is required"),
    rateMin: z.string().optional(),
    rateMax: z.string().optional(),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    experiences: z.array(z.object({
        company: z.string(),
        role: z.string(),
        duration: z.string(),
        description: z.string(),
    })).optional(),
    portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    country: z.string().min(1, "Country is required"),
    city: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = joinSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 422 }
            )
        }

        const data = parsed.data
        const finalRole = data.role === "Other" ? (data.customRole ?? "Other") : data.role

        const { error: adminError } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: process.env.RESEND_TO_EMAIL!,
            replyTo: data.email,
            subject: `New Application — ${data.firstName} ${data.lastName} · ${finalRole}`,
            react: JoinApplicationEmail({ ...data, finalRole }),
        })

        if (adminError) {
            console.error("[join] Admin email error:", adminError)
            return NextResponse.json(
                { error: "Failed to send application. Please try again." },
                { status: 400 }
            )
        }

        const { error: confirmError } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: data.email,
            subject: `We received your application, ${data.firstName}!`,
            react: JoinConfirmationEmail({
                firstName: data.firstName,
                role: finalRole,
            }),
        })

        if (confirmError) {
            console.error("[join] Confirmation email error:", confirmError)
        }

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        console.error("[join] Unexpected error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}