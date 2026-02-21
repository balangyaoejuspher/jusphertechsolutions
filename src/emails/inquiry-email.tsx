import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface InquiryEmailProps {
  name: string
  email: string
  company?: string
  message: string
}

export function InquiryEmail({
  name,
  email,
  company,
  message,
}: InquiryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New inquiry from {name}</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
        <Container style={{ margin: "0 auto", padding: "20px" }}>
          <Heading>New Client Inquiry</Heading>
          <Hr />
          <Section>
            <Text><strong>Name:</strong> {name}</Text>
            <Text><strong>Email:</strong> {email}</Text>
            {company && <Text><strong>Company:</strong> {company}</Text>}
            <Hr />
            <Text><strong>Message:</strong></Text>
            <Text>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}