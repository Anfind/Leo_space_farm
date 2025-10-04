"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".slide-in").forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("opacity-100", "translate-x-0")
              }, index * 200)
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
    <section id="technology" ref={sectionRef} className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Cutting-Edge <span className="text-primary">Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Our space farming systems integrate the latest innovations in agriculture, robotics, and life support
            systems.
          </p>
        </div>

        <div className="space-y-16">
          {/* Smart Growing System */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="slide-in opacity-0 -translate-x-8 transition-all duration-700">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary">Smart Agriculture</Badge>
              <h3 className="text-3xl font-bold mb-4">Automated Growing Systems</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our intelligent hydroponic systems feature app-controlled monitoring, automated nutrient delivery, and
                customizable growing programs for different plant species. Perfect for the demanding environment of
                space.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">WiFi-enabled remote monitoring and control</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Automated LED grow light scheduling</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Precision nutrient and water management</span>
                </li>
              </ul>
            </div>
            <Card className="slide-in opacity-0 translate-x-8 transition-all duration-700 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Device%202%20_%20Spider-farmer-smart-g12-Hydroponics-Growing-System-indoor-garden-light-xGwo5uB9wdjZO9u8phnOlz6qhXk3Z8.jpg"
                alt="Smart hydroponic growing system"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </Card>
          </div>

          {/* Laboratory Systems */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <Card className="slide-in opacity-0 -translate-x-8 transition-all duration-700 overflow-hidden order-2 lg:order-1">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Laboratory%20_%20Revolutionizing-Space-Research-Farmonauts-GRAVI-BOT-Centrifuge-Advances-Microgravity-Science-in-West-Lafayette_2-u4u66ijo7Osy9NB37spxzf29dkDZ2i.jpg"
                alt="Space farming laboratory"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </Card>
            <div className="slide-in opacity-0 translate-x-8 transition-all duration-700 order-1 lg:order-2">
              <Badge className="mb-4 bg-accent/20 text-accent border-accent">Research & Development</Badge>
              <h3 className="text-3xl font-bold mb-4">Advanced Research Labs</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                State-of-the-art laboratory facilities enable continuous research into plant genetics, growth
                optimization, and adaptation to space conditions. Our centrifuge systems simulate various gravity levels
                for comprehensive testing.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Variable gravity simulation chambers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Genetic modification and optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Real-time data collection and analysis</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Astronaut Farming */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="slide-in opacity-0 -translate-x-8 transition-all duration-700">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary">Human Integration</Badge>
              <h3 className="text-3xl font-bold mb-4">Astronaut-Friendly Design</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our farming modules are designed for easy operation by astronauts, with intuitive interfaces and minimal
                maintenance requirements. Fresh food production improves crew morale and nutrition on long missions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Ergonomic design for microgravity operation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Minimal crew time required for maintenance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Fresh produce improves crew health and morale</span>
                </li>
              </ul>
            </div>
            <Card className="slide-in opacity-0 translate-x-8 transition-all duration-700 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.%20Space%20Farming%20Device%203.png-w1CwpmXlc305KdtxU439Xd0Mldo5eT.jpeg"
                alt="Astronauts working with space farm"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
