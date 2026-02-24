import {
    Body, Container, Head, Heading, Hr,
    Html, Preview, Row, Column, Section, Text,
} from "@react-email/components"
import { joinEmailStyles as s } from "@/styles/emails/join-application-email.styles"

interface Experience {
    company: string
    role: string
    duration: string
    description: string
}

interface JoinApplicationEmailProps {
    firstName: string
    lastName: string
    email: string
    phone?: string
    finalRole: string
    experienceLevel: string
    availability: string
    rateMin?: string
    rateMax?: string
    bio: string
    skills: string[]
    experiences?: Experience[]
    portfolioUrl?: string
    githubUrl?: string
    linkedinUrl?: string
    country: string
    city?: string
}

export function JoinApplicationEmail({
    firstName, lastName, email, phone,
    finalRole, experienceLevel, availability, rateMin, rateMax,
    bio, skills, experiences, portfolioUrl, githubUrl, linkedinUrl,
    country, city,
}: JoinApplicationEmailProps) {

    const receivedAt = new Date().toLocaleString("en-US", {
        weekday: "long", year: "numeric", month: "long",
        day: "numeric", hour: "2-digit", minute: "2-digit",
    })

    const rate = rateMin && rateMax ? `$${rateMin} – $${rateMax}/hr`
        : rateMin ? `From $${rateMin}/hr`
            : null

    const location = [city, country].filter(Boolean).join(", ")

    const filledExperiences = experiences?.filter((e) => e.company) ?? []

    return (
        <Html>
            <Head />
            <Preview>New application from {firstName} {lastName} · {finalRole}</Preview>
            <Body style={s.body}>
                <Container style={s.container}>

                    <Section style={s.header}>
                        <Text style={s.headerLabel}>● NEW APPLICATION</Text>
                        <Heading style={s.headerTitle}>
                            {firstName} {lastName}
                        </Heading>
                        <Text style={s.headerSub}>submitted a job application via your website.</Text>
                        <Text style={s.roleBadge}>{finalRole}</Text>
                    </Section>

                    <Section style={s.card}>
                        <Text style={s.sectionLabel}>PERSONAL INFORMATION</Text>
                        <Hr style={s.divider} />

                        <Row style={{ marginBottom: "12px" }}>
                            <Column style={s.labelCol}><Text style={s.label}>Full Name</Text></Column>
                            <Column><Text style={s.value}>{firstName} {lastName}</Text></Column>
                        </Row>
                        <Row style={{ marginBottom: "12px" }}>
                            <Column style={s.labelCol}><Text style={s.label}>Email</Text></Column>
                            <Column><Text style={s.valueAccent}>{email}</Text></Column>
                        </Row>
                        {phone && (
                            <Row style={{ marginBottom: "12px" }}>
                                <Column style={s.labelCol}><Text style={s.label}>Phone</Text></Column>
                                <Column><Text style={s.value}>{phone}</Text></Column>
                            </Row>
                        )}
                        <Row style={{ marginBottom: "12px" }}>
                            <Column style={s.labelCol}><Text style={s.label}>Location</Text></Column>
                            <Column><Text style={s.value}>{location}</Text></Column>
                        </Row>
                        <Row>
                            <Column style={s.labelCol}><Text style={s.label}>Received</Text></Column>
                            <Column><Text style={s.value}>{receivedAt}</Text></Column>
                        </Row>
                    </Section>

                    <Section style={s.card}>
                        <Text style={s.sectionLabel}>PROFESSIONAL PROFILE</Text>
                        <Hr style={s.divider} />

                        <Row style={{ marginBottom: "12px" }}>
                            <Column style={s.labelCol}><Text style={s.label}>Role</Text></Column>
                            <Column><Text style={s.valueAccent}>{finalRole}</Text></Column>
                        </Row>
                        <Row style={{ marginBottom: "12px" }}>
                            <Column style={s.labelCol}><Text style={s.label}>Experience</Text></Column>
                            <Column><Text style={s.value}>{experienceLevel}</Text></Column>
                        </Row>
                        <Row style={{ marginBottom: "12px" }}>
                            <Column style={s.labelCol}><Text style={s.label}>Availability</Text></Column>
                            <Column><Text style={s.value}>{availability}</Text></Column>
                        </Row>
                        {rate && (
                            <Row style={{ marginBottom: "12px" }}>
                                <Column style={s.labelCol}><Text style={s.label}>Rate</Text></Column>
                                <Column><Text style={s.value}>{rate}</Text></Column>
                            </Row>
                        )}
                        <Row>
                            <Column style={s.labelCol}><Text style={s.label}>Bio</Text></Column>
                            <Column><Text style={s.bio}>{bio}</Text></Column>
                        </Row>
                    </Section>

                    {skills.length > 0 && (
                        <Section style={s.card}>
                            <Text style={s.sectionLabel}>SKILLS ({skills.length})</Text>
                            <Hr style={s.divider} />
                            <div style={s.skillsWrap}>
                                {skills.map((skill) => (
                                    <Text key={skill} style={s.skillBadge}>{skill}</Text>
                                ))}
                            </div>
                        </Section>
                    )}

                    {filledExperiences.length > 0 && (
                        <Section style={s.card}>
                            <Text style={s.sectionLabel}>EXPERIENCE</Text>
                            <Hr style={s.divider} />
                            {filledExperiences.map((exp, i) => (
                                <div key={i} style={s.experienceItem}>
                                    <Text style={s.experienceRole}>
                                        {exp.role} at {exp.company}
                                    </Text>
                                    {exp.duration && (
                                        <Text style={s.experienceDuration}>{exp.duration}</Text>
                                    )}
                                    {exp.description && (
                                        <Text style={s.experienceDesc}>{exp.description}</Text>
                                    )}
                                </div>
                            ))}
                        </Section>
                    )}

                    {/* Portfolio & Links */}
                    {(portfolioUrl || githubUrl || linkedinUrl) && (
                        <Section style={s.card}>
                            <Text style={s.sectionLabel}>PORTFOLIO & LINKS</Text>
                            <Hr style={s.divider} />
                            {portfolioUrl && (
                                <Row style={{ marginBottom: "10px" }}>
                                    <Column style={s.labelCol}><Text style={s.label}>Portfolio</Text></Column>
                                    <Column><Text style={s.linkItem}>{portfolioUrl}</Text></Column>
                                </Row>
                            )}
                            {githubUrl && (
                                <Row style={{ marginBottom: "10px" }}>
                                    <Column style={s.labelCol}><Text style={s.label}>GitHub</Text></Column>
                                    <Column><Text style={s.linkItem}>{githubUrl}</Text></Column>
                                </Row>
                            )}
                            {linkedinUrl && (
                                <Row>
                                    <Column style={s.labelCol}><Text style={s.label}>LinkedIn</Text></Column>
                                    <Column><Text style={s.linkItem}>{linkedinUrl}</Text></Column>
                                </Row>
                            )}
                        </Section>
                    )}

                    {/* CTA */}
                    <Section style={s.ctaSection}>
                        <Text style={s.ctaText}>
                            Reply directly to this email to get in touch with {firstName}.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={s.footer}>
                        <Hr style={s.divider} />
                        <Text style={s.footerText}>
                            This application was submitted via the Join Our Team form on your website.
                            If this looks suspicious, please ignore it.
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    )
}