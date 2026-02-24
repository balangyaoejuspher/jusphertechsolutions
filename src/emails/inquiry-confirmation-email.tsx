import {
    Body, Container, Head, Heading,
    Hr, Html, Preview, Section, Text,
} from "@react-email/components"
import { inquiryConfirmationEmailStyles as s } from "@/styles/emails/inquiry-confirmation-email.styles"

interface InquiryConfirmationEmailProps {
    name: string
    company?: string
}

export function InquiryConfirmationEmail({ name, company }: InquiryConfirmationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>We received your message, {name}! We'll be in touch shortly.</Preview>
            <Body style={s.body}>
                <Container style={s.container}>

                    <Section style={s.header}>
                        <Text style={s.headerLabel}>● MESSAGE RECEIVED</Text>
                        <Heading style={s.headerTitle}>Thanks for reaching out{company ? `, ${company}` : ""}!</Heading>
                        <Text style={s.headerSub}>
                            Hi {name}, we've received your inquiry and will get back to you as soon as possible.
                        </Text>
                    </Section>

                    <Section style={s.card}>
                        <Text style={s.sectionLabel}>WHAT HAPPENS NEXT</Text>
                        <Hr style={s.divider} />

                        {[
                            { step: "1", title: "Message Review", desc: "Our team will read through your inquiry and prepare a thoughtful response." },
                            { step: "2", title: "We'll Reach Out", desc: "Expect a reply from us within 1–2 business days to your email address." },
                            { step: "3", title: "Let's Get Started", desc: "If it's a good fit, we'll schedule a call to discuss your needs in more detail." },
                        ].map((item) => (
                            <div key={item.step} style={s.stepItem}>
                                <div style={s.stepBadge}>{item.step}</div>
                                <div style={s.stepContent}>
                                    <Text style={s.stepTitle}>{item.title}</Text>
                                    <Text style={s.stepDesc}>{item.desc}</Text>
                                </div>
                            </div>
                        ))}
                    </Section>

                    {/* Response time */}
                    <Section style={s.ctaSection}>
                        <Text style={s.ctaTitle}>⏱ Response Time</Text>
                        <Text style={s.ctaText}>
                            We typically respond within <strong>1–2 business hours</strong> during
                            business days (Mon–Sat, 8AM–6PM PHT). For urgent matters, feel free
                            to reply directly to this email.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={s.footer}>
                        <Hr style={s.divider} />
                        <Text style={s.footerText}>
                            You're receiving this because you submitted an inquiry on our website.
                            If this wasn't you, please ignore this email.
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    )
}
