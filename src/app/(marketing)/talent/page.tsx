import type { Metadata } from "next"
import TalentClient from "./talent-page"

export const metadata: Metadata = {
  title: "Browse Talent",
  description:
    "Browse our network of 500+ vetted professionals. Filter by role, availability, and rating to find your perfect match.",
}

export default function TalentPage() {
  return <TalentClient />
}
