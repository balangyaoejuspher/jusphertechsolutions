import type { Metadata } from "next"
import ServicesPage from "./service-page"

export const metadata: Metadata = {
    title: "Services",
    description:
        "Full-stack development, blockchain & Web3, mobile apps, AI automation, outsourcing and more. Hire vetted talent or get a custom solution from Juspher & Co. Tech Solutions.",
}

export default function TalentPage() {
    return <ServicesPage />
}
