import {
    Body, Container, Head, Heading, Hr, Html,
    Link, Preview, Section, Text,
} from "@react-email/components"
import { announcementEmailStyles as s, getTypeBadge } from "@/styles/emails/announcement-email.styles"

interface AnnouncementEmailProps {
    recipientName: string
    title: string
    content: string
    type: string
    publishedAt?: Date | null
}

export function AnnouncementEmail({
    recipientName,
    title,
    content,
    type,
    publishedAt,
}: AnnouncementEmailProps) {
    const badge = getTypeBadge(type)

    const publishedDate = publishedAt
        ? new Date(publishedAt).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : ""

    return (
        <Html>
            <Head />
            <Preview>{badge.label} · {title}</Preview>
            <Body style={s.body}>
                <Container style={s.container}>

                    {/* Header */}
                    <Section style={s.header}>
                        <Text style={s.headerLabel}>● ANNOUNCEMENT</Text>
                        <Heading style={s.headerTitle}>Juspher & Co.</Heading>
                        <Text style={s.headerSub}>Tech Solutions</Text>
                    </Section>

                    {/* Announcement card */}
                    <Section style={s.card}>
                        <Text style={s.sectionLabel}>ANNOUNCEMENT</Text>
                        <Hr style={s.divider} />

                        {/* Type badge */}
                        <Text style={{
                            ...s.badge,
                            backgroundColor: badge.bg,
                            border: `1px solid ${badge.border}`,
                            color: badge.color,
                        }}>
                            {badge.label}
                        </Text>

                        {/* Title */}
                        <Heading style={s.announcementTitle}>{title}</Heading>

                        {/* Date */}
                        {publishedDate && (
                            <Text style={s.date}>{publishedDate}</Text>
                        )}

                        <Hr style={s.divider} />

                        {/* Greeting */}
                        <Text style={{ ...s.content, marginBottom: "16px" }}>
                            Hi {recipientName},
                        </Text>

                        {/* Content */}
                        <Text style={s.content}>{content}</Text>
                    </Section>

                    {/* CTA */}
                    <Section style={s.ctaSection}>
                        <Text style={s.ctaText}>
                            View this announcement and all updates in your portal.
                        </Text>
                        <Link
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/portal`}
                            style={s.ctaButton}
                        >
                            View in Portal
                        </Link>
                    </Section>

                    {/* Footer */}
                    <Section style={s.footer}>
                        <Hr style={s.divider} />
                        <Text style={s.footerText}>
                            You received this email because you are a client or talent of Juspher & Co.
                            Tech Solutions. If this looks unexpected, please ignore it.
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    )
}