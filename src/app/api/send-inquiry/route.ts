import { resend } from "@/lib/resend"
import { InquiryEmail } from "@/emails/inquiry-email"
import { NextResponse } from "next/server"
import { z } from "zod"

const inquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, company, message } = inquirySchema.parse(body)

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_FROM_EMAIL!,
      subject: `New Inquiry from ${name}`,
      react: InquiryEmail({ name, email, company, message }),
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}