import { HeroSection } from "@/components/hero-section"
import { AtmosphereSection } from "@/components/atmosphere-section"
import { FarmingSection } from "@/components/farming-section"
import { WorkflowSection } from "@/components/workflow-section-simulation"
import { TechnologySection } from "@/components/technology-section"
import { MissionSection } from "@/components/mission-section"
import { Navigation } from "@/components/navigation"
import { StarField } from "@/components/star-field"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <StarField />
      <Navigation />
      <HeroSection />
      <AtmosphereSection />
      <FarmingSection />
      <WorkflowSection />
      <TechnologySection />
      <MissionSection />
    </main>
  )
}
