"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Rocket,
  Satellite,
  Database,
  PackageCheck,
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react"

const phases = [
  {
    id: 1,
    title: "Experiment Configuration",
    subtitle: "Design & Proposal",
    icon: Settings,
    color: "from-cyan-500 to-blue-500",
    borderColor: "border-cyan-500/50",
    bgColor: "bg-cyan-500/10",
    description: "Design your experiment with precision",
    features: [
      "Select hardware modules & sensors",
      "Define protocol & timeline",
      "Run simulation & validation",
      "Submit proposal for review",
    ],
    duration: "1-2 weeks",
  },
  {
    id: 2,
    title: "Logistics & Launch",
    subtitle: "Scheduling",
    icon: Rocket,
    color: "from-blue-500 to-indigo-500",
    borderColor: "border-blue-500/50",
    bgColor: "bg-blue-500/10",
    description: "Prepare and schedule your payload",
    features: [
      "Payload preparation & shipping",
      "Manifest integration lock",
      "Reserve launch slot",
      "Finalize contract & payment",
    ],
    duration: "2-4 weeks",
  },
  {
    id: 3,
    title: "Orbital Experimentation",
    subtitle: "Active Research",
    icon: Satellite,
    color: "from-indigo-500 to-purple-500",
    borderColor: "border-indigo-500/50",
    bgColor: "bg-indigo-500/10",
    description: "Conduct research in Low Earth Orbit",
    features: [
      "Real-time telemetry dashboard",
      "Remote control console",
      "Automated alert system",
      "Live data stream viewer",
    ],
    duration: "30-90 days",
  },
  {
    id: 4,
    title: "Data Collection",
    subtitle: "Downlink",
    icon: Database,
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/50",
    bgColor: "bg-purple-500/10",
    description: "Retrieve your research data",
    features: ["Prioritize data downlink", "High-bandwidth transfers", "Complete mission log", "Secure cloud storage"],
    duration: "1-2 weeks",
  },
  {
    id: 5,
    title: "Decommissioning",
    subtitle: "Retrieval & Review",
    icon: PackageCheck,
    color: "from-pink-500 to-rose-500",
    borderColor: "border-pink-500/50",
    bgColor: "bg-pink-500/10",
    description: "Complete your mission cycle",
    features: ["Sample return scheduling", "Safe shutdown & removal", "Final mission report", "Post-flight review"],
    duration: "2-3 weeks",
  },
]

export function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activePhase, setActivePhase] = useState<number | null>(null)
  const [visiblePhases, setVisiblePhases] = useState<Set<number>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate phases in sequence
            phases.forEach((phase, index) => {
              setTimeout(() => {
                setVisiblePhases((prev) => new Set([...prev, phase.id]))
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="relative min-h-screen py-20 px-4 bg-gradient-to-b from-background via-secondary/20 to-background"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary text-sm px-4 py-1">Research Workflow</Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            From Concept to <span className="text-primary">Discovery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Our streamlined 5-phase workflow guides you through every step of conducting cutting-edge research in Low
            Earth Orbit
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative mb-20">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500 opacity-20" />

          {/* Phases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {phases.map((phase, index) => {
              const Icon = phase.icon
              const isVisible = visiblePhases.has(phase.id)
              const isActive = activePhase === phase.id

              return (
                <div
                  key={phase.id}
                  className={`relative transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setActivePhase(phase.id)}
                  onMouseLeave={() => setActivePhase(null)}
                >
                  {/* Phase Number Badge */}
                  <div className="absolute -top-3 -left-3 z-10">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center text-white font-bold shadow-lg`}
                    >
                      {phase.id}
                    </div>
                  </div>

                  {/* Phase Card */}
                  <Card
                    className={`relative p-6 h-full border-2 transition-all duration-300 ${
                      isActive
                        ? `${phase.borderColor} shadow-xl shadow-primary/20 scale-105`
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${phase.bgColor} mb-4 transition-transform duration-300 ${
                        isActive ? "scale-110" : ""
                      }`}
                    >
                      <Icon
                        className={`text-transparent bg-gradient-to-br ${phase.color} bg-clip-text`}
                        size={28}
                        strokeWidth={2.5}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-1 text-balance">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{phase.subtitle}</p>

                    {/* Duration Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <Clock size={14} className="text-primary" />
                      <span className="text-xs text-muted-foreground">{phase.duration}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{phase.description}</p>

                    {/* Features - Show on hover */}
                    <div
                      className={`space-y-2 transition-all duration-300 ${
                        isActive ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
                      }`}
                    >
                      {phase.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Arrow Connector */}
                  {index < phases.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-20">
                      <ChevronRight className="text-primary animate-pulse" size={20} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Streamlined Process",
              description: "From proposal to results in as little as 6 weeks",
            },
            {
              icon: CheckCircle2,
              title: "End-to-End Support",
              description: "Guided assistance through every phase of your research",
            },
            {
              icon: Satellite,
              title: "Real-Time Access",
              description: "Monitor and control your experiments from anywhere",
            },
          ].map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card
                key={index}
                className="p-6 text-center border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
