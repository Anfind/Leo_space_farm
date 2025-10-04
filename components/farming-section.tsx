"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplet, Sprout, Brain } from "lucide-react"

export function FarmingSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".fade-in-card").forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("opacity-100", "translate-y-0")
              }, index * 150)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="farming" ref={sectionRef} className="relative py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary">Space Agriculture</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Growing in <span className="text-primary">Microgravity</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Advanced hydroponic systems enable year-round cultivation in Low Earth Orbit
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <Card className="fade-in-card opacity-0 translate-y-8 transition-all duration-700 overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jay-wong-space-farm-on-moon-accomplished-dSPNUwlUJ2KkBA89rokgmOSjrBgmoy.jpg"
                alt="Space farm greenhouse module"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">Lunar Greenhouse</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Advanced modules with precise climate control and LED grow lights for optimal space agriculture
              </p>
            </div>
          </Card>

          <Card className="fade-in-card opacity-0 translate-y-8 transition-all duration-700 overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.%20Space%20Farming%20Device%201-BoVYY53rJniQlBkL8CuuM0jL8WUIwo.jpg"
                alt="Space station farming interior"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">Orbital Systems</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Multi-level hydroponics maximize efficiency while providing fresh produce for long missions
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Sprout,
              title: "Zero Gravity Growth",
              description: "Innovative cultivation techniques in microgravity without traditional soil",
            },
            {
              icon: Droplet,
              title: "Water Recycling",
              description: "Closed-loop systems recycle 98% of water for sustainable operations",
            },
            {
              icon: Brain,
              title: "AI Monitoring",
              description: "24/7 monitoring of plant health, nutrients, and environmental conditions",
            },
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="fade-in-card opacity-0 translate-y-8 transition-all duration-700 p-5 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
