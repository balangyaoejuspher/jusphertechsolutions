import {
    Body, Container, Head, Heading,
    Hr, Html, Preview, Section, Text,
} from "@react-email/components"
import { joinConfirmationStyles as s } from "@/styles/emails/join-confirmation-email.styles"

interface JoinConfirmationEmailProps {
    firstName: string
    role: string
}

export function JoinConfirmationEmail({ firstName, role }: JoinConfirmationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>We received your application, {firstName}!</Preview>
            <Body style={s.body}>
                <Container style={s.container}>

                    {/* Header */}
                    <Section style={s.header}>
                        <Text style={s.headerLabel}>● APPLICATION RECEIVED</Text>
                        <Heading style={s.headerTitle}>Thanks, {firstName}!</Heading>
                        <Text style={s.headerSub}>
                            We've received your application and we're excited to review it.
                        </Text>
                    </Section>

                    {/* What happens next */}
                    <Section style={s.card}>
                        <Text style={s.sectionLabel}>YOUR APPLICATION</Text>
                        <Hr style={s.divider} />
                        <Text style={s.bodyText}>
                            You applied for the <Text style={s.accent}>{role}</Text> position.
                            Here's what happens next:
                        </Text>

                        {[
                            { step: "1", title: "Application Review", desc: "Our team will carefully review your profile, skills, and experience." },
                            { step: "2", title: "Initial Assessment", desc: "If your profile matches our needs, we'll reach out for a quick intro call." },
                            { step: "3", title: "Onboarding", desc: "Once approved, we'll get you set up and matched with your first client." },
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

                    {/* Timeline */}
                    <Section style={s.ctaSection}>
                        <Text style={s.ctaTitle}>⏱ What to expect</Text>
                        <Text style={s.ctaText}>
                            We typically review applications within <strong>48 hours</strong> on business days.
                            Keep an eye on your inbox — we'll reach out if your profile is a great fit.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={s.footer}>
                        <Hr style={s.divider} />
                        <Text style={s.footerText}>
                            You're receiving this because you submitted an application on our website.
                            If this wasn't you, please ignore this email.
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    )
}

