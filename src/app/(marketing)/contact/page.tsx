import type { Metadata } from "next"
import ContactClient from "./contact-client"

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Portfolio Agency. Tell us what you need and we'll match you with the right talent within 48 hours.",
}

export default function ContactPage() {
    return <ContactClient />
}
