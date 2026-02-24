import { resend } from "@/lib/resend"
import { InquiryEmail } from "@/emails/inquiry-email"
import { InquiryConfirmationEmail } from "@/emails/inquiry-confirmation-email"
import { NextResponse } from "next/server"
import { z } from "zod"

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = inquirySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const { name, email, company, message } = parsed.data

    const { error: adminError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      replyTo: email,
      subject: `New Inquiry from ${name}${company ? ` · ${company}` : ""}`,
      react: InquiryEmail({ name, email, company, message }),
    })

    if (adminError) {
      console.error("[inquiry] Admin email error:", adminError)
      return NextResponse.json(
        { error: "Failed to send inquiry. Please try again." },
        { status: 400 }
      )
    }

    const { error: confirmError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `We received your message, ${name}!`,
      react: InquiryConfirmationEmail({ name, company }),
    })

    if (confirmError) {
      console.error("[inquiry] Confirmation email error:", confirmError)
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error("[inquiry] Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}