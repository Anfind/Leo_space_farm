"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, Leaf, Globe, Users } from "lucide-react"

export function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".scale-in").forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("opacity-100", "scale-100")
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
    <section id="mission" ref={sectionRef} className="relative min-h-screen py-20 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Our <span className="text-primary">Mission</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Building a sustainable future for humanity beyond Earth through innovative agricultural technology and space
            exploration.
          </p>
        </div>

        {/* Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Rocket,
              title: "Space Exploration",
              description: "Enable long-duration missions with sustainable food production",
            },
            {
              icon: Leaf,
              title: "Sustainability",
              description: "Develop closed-loop systems for resource efficiency",
            },
            {
              icon: Globe,
              title: "Earth Benefits",
              description: "Apply space tech to solve Earth agricultural challenges",
            },
            {
              icon: Users,
              title: "Human Future",
              description: "Support human expansion throughout the solar system",
            },
          ].map((item, index) => (
            <Card
              key={index}
              className="scale-in opacity-0 scale-95 transition-all duration-500 p-6 text-center hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                <item.icon className="text-primary" size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>

        {/* Hero Image */}
        <div className="scale-in opacity-0 scale-95 transition-all duration-700 mb-16">
          <Card className="overflow-hidden">
            <div className="relative h-96 md:h-[500px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Astro%20Tractor%201-mj2Y9JGjVF9epnD7yVDpYBQe4WLwI2.webp"
                alt="Space farming vehicle on alien planet"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
                  The Future of Agriculture is in Space
                </h3>
                <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
                  From LEO stations to lunar bases and beyond, our technology paves the way for sustainable human
                  presence throughout the solar system.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: "400km", label: "Orbital Altitude" },
            { value: "98%", label: "Water Recycling" },
            { value: "24/7", label: "AI Monitoring" },
            { value: "50+", label: "Crop Varieties" },
          ].map((stat, index) => (
            <div
              key={index}
              className="scale-in opacity-0 scale-95 transition-all duration-500 text-center p-6 rounded-lg bg-card border border-border"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="scale-in opacity-0 scale-95 transition-all duration-700 text-center">
          <Card className="p-12 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/50">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Join Us in Building the Future</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Whether you're a researcher, investor, or space enthusiast, there's a place for you in the LEO farming
              revolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Involved
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
