import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Row, Column,
} from "@react-email/components"
import { inquiryEmailStyles as s } from "@/styles/emails/inquiry-email.styles"

interface InquiryEmailProps {
  name: string
  email: string
  company?: string
  message: string
}

export function InquiryEmail({ name, email, company, message }: InquiryEmailProps) {
  const receivedAt = new Date().toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
  })

  return (
    <Html>
      <Head />
      <Preview>New inquiry from {name}{company ? ` · ${company}` : ""}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>

          <Section style={s.header}>
            <Text style={s.headerLabel}>● NEW INQUIRY</Text>
            <Heading style={s.headerTitle}>You've got a new message</Heading>
            <Text style={s.headerSub}>Someone reached out through your website contact form.</Text>
          </Section>

          <Section style={s.card}>
            <Text style={s.sectionLabel}>SENDER DETAILS</Text>
            <Hr style={s.divider} />

            <Row style={{ marginBottom: "12px" }}>
              <Column style={s.labelCol}>
                <Text style={s.label}>Full Name</Text>
              </Column>
              <Column>
                <Text style={s.value}>{name}</Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: "12px" }}>
              <Column style={s.labelCol}>
                <Text style={s.label}>Email</Text>
              </Column>
              <Column>
                <Text style={{ ...s.value, color: "#f59e0b" }}>{email}</Text>
              </Column>
            </Row>

            {company && (
              <Row style={{ marginBottom: "12px" }}>
                <Column style={s.labelCol}>
                  <Text style={s.label}>Company</Text>
                </Column>
                <Column>
                  <Text style={s.value}>{company}</Text>
                </Column>
              </Row>
            )}

            <Row>
              <Column style={s.labelCol}>
                <Text style={s.label}>Received</Text>
              </Column>
              <Column>
                <Text style={s.value}>{receivedAt}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={s.card}>
            <Text style={s.sectionLabel}>MESSAGE</Text>
            <Hr style={s.divider} />
            <Text style={s.message}>{message}</Text>
          </Section>

          {/* CTA */}
          <Section style={s.ctaSection}>
            <Text style={s.ctaText}>
              Reply directly to this email to respond to {name}.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={s.footer}>
            <Hr style={s.divider} />
            <Text style={s.footerText}>
              This message was sent via the contact form on your website.
              If this looks suspicious, please ignore it.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
