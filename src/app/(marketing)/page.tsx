import type { Metadata } from "next"
import { Hero } from "@/components/sections/hero"
import { Services } from "@/components/sections/services"
import { TalentPreview } from "@/components/sections/talent-preview"
import { CTABanner } from "@/components/sections/cta-banner"
import { Partners } from "@/components/sections/partners"
import { JoinTeamSection } from "@/components/sections/join-team"

export const metadata: Metadata = {
  title: "Home",
  description: "We connect businesses with top-tier developers, virtual assistants, and project managers. Fast, reliable, and vetted talent.",
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <TalentPreview />
      <Partners />
      <JoinTeamSection />
      <CTABanner />
    </>
  )
}