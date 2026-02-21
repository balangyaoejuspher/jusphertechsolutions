import { Hero } from "@/components/sections/hero"
import { Services } from "@/components/sections/services"
import { TalentPreview } from "@/components/sections/talent-preview"
import { CTABanner } from "@/components/sections/cta-banner"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <TalentPreview />
      <CTABanner />
    </>
  )
}