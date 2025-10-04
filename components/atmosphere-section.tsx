"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Thermometer, Wind, Zap, Radio } from "lucide-react"

export function AtmosphereSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
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

  const atmosphereData = [
    {
      name: "Exosphere",
      range: "600-10,000 km",
      description: "Merges with space",
      icon: Radio,
      color: "bg-purple-500/10 border-purple-500/50 hover:bg-purple-500/20",
      textColor: "text-purple-400",
      features: ["Satellite orbits", "Very thin air", "Atomic oxygen"],
      temperature: "1,000°C+",
    },
    {
      name: "Thermosphere",
      range: "80-600 km",
      description: "Our farm location",
      icon: Zap,
      color: "bg-primary/20 border-primary/50 hover:bg-primary/30",
      textColor: "text-primary",
      features: ["ISS altitude", "Aurora displays", "High energy particles"],
      temperature: "500-2,000°C",
      isHighlighted: true,
    },
    {
      name: "Mesosphere",
      range: "50-80 km",
      description: "Meteor burn zone",
      icon: Wind,
      color: "bg-teal-500/10 border-teal-500/50 hover:bg-teal-500/20",
      textColor: "text-teal-400",
      features: ["Meteor destruction", "Noctilucent clouds", "Coldest layer"],
      temperature: "-90°C",
    },
    {
      name: "Stratosphere",
      range: "12-50 km",
      description: "Ozone layer protection",
      icon: Thermometer,
      color: "bg-cyan-500/10 border-cyan-500/50 hover:bg-cyan-500/20",
      textColor: "text-cyan-400",
      features: ["Ozone layer", "UV protection", "Commercial flights"],
      temperature: "-50 to 0°C",
    },
  ]

  return (
    <section id="atmosphere" ref={sectionRef} className="relative py-20 px-4 bg-secondary/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent">Orbital Environment</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Earth's Atmospheric <span className="text-primary">Layers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Understanding the atmospheric layers is crucial for space agriculture. Our LEO farm operates in the thermosphere, 
            where unique conditions enable revolutionary farming techniques.
          </p>
        </div>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Atmospheric layers */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap size={16} className="text-primary" />
              </div>
              Atmospheric Structure
            </h3>
            
            {atmosphereData.map((layer, index) => {
              const Icon = layer.icon
              return (
                <Card
                  key={layer.name}
                  className={`${layer.color} backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-lg ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  } ${layer.isHighlighted ? 'ring-2 ring-primary/30' : ''}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${layer.color}`}>
                          <Icon className={layer.textColor} size={20} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold flex items-center gap-2">
                            {layer.name}
                            {layer.isHighlighted && (
                              <Badge className="bg-primary/20 text-primary border-primary text-xs">
                                LEO ZONE
                              </Badge>
                            )}
                          </h4>
                          <p className={`text-sm font-mono ${layer.textColor}`}>{layer.range}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Temperature</p>
                        <p className={`text-sm font-mono ${layer.textColor}`}>{layer.temperature}</p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {layer.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {layer.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-background/50 text-muted-foreground border border-border/50"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* LEO Farming Benefits */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Radio size={16} className="text-primary" />
              </div>
              LEO Advantages
            </h3>

            <Card className={`p-6 border-2 border-primary/20 bg-primary/5 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h4 className="text-xl font-bold mb-4 text-primary">Why 400km Altitude?</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium mb-1">Microgravity Environment</p>
                    <p className="text-sm text-muted-foreground">
                      Perfect conditions for unique plant growth patterns and root development
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium mb-1">Stable Orbit</p>
                    <p className="text-sm text-muted-foreground">
                      Minimal atmospheric drag allows for long-term operations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium mb-1">Solar Energy Access</p>
                    <p className="text-sm text-muted-foreground">
                      Continuous solar exposure for 24/7 energy generation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium mb-1">No Weather Interference</p>
                    <p className="text-sm text-muted-foreground">
                      Protected from atmospheric weather patterns and natural disasters
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Research Applications */}
            <Card className={`p-6 border-2 border-accent/20 bg-accent/5 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '200ms' }}>
              <h4 className="text-xl font-bold mb-4 text-accent">Research Applications</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">24/7</div>
                  <div className="text-xs text-muted-foreground">Controlled Environment</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">0.001g</div>
                  <div className="text-xs text-muted-foreground">Gravity Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">15.5x</div>
                  <div className="text-xs text-muted-foreground">Daily Orbits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">90min</div>
                  <div className="text-xs text-muted-foreground">Orbit Period</div>
                </div>
              </div>
            </Card>

            {/* Call to Action */}
            <Card className={`p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '400ms' }}>
              <h4 className="text-lg font-bold mb-2">Ready to Explore?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Learn more about how we utilize these unique atmospheric conditions for space agriculture.
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                  View Research
                </button>
                <button className="px-4 py-2 border border-primary/30 text-primary rounded-lg text-sm hover:bg-primary/10 transition-colors">
                  Learn More
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom section with additional info */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '600ms' }}>
          <Card className="p-6 text-center hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Thermometer className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Temperature Control</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advanced thermal management systems maintain optimal growing conditions in extreme space temperatures.
            </p>
          </Card>

          <Card className="p-6 text-center hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Wind className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Atmosphere Simulation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Closed-loop systems recreate Earth-like atmospheric conditions within our growing modules.
            </p>
          </Card>

          <Card className="p-6 text-center hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Zap className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Energy Harvesting</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Solar panels capture unfiltered sunlight, providing abundant clean energy for our operations.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
