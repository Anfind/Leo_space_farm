"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Settings,
  Rocket,
  Satellite,
  Database,
  PackageCheck,
  CheckCircle2,
  Clock,
  Zap,
  Activity,
  Signal,
  Cpu,
  Monitor,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Orbit,
  Globe,
  Radio,
  FileText,
  Shield,
  BarChart3,
  Cloud,
  Download,
  Archive,
  Star,
  Sparkles,
  Calendar,
  Timer,
  FastForward,
  SkipForward,
} from "lucide-react"

interface SubPhase {
  id: string
  title: string
  description: string
  icon: any
  status: 'pending' | 'active' | 'completed'
  details: string[]
  duration: number // seconds for simulation
}

interface PhaseData {
  id: number
  title: string
  subtitle: string
  icon: any
  color: string
  borderColor: string
  bgColor: string
  description: string
  detailedDescription: string
  keyFeatures: string[]
  subPhases: SubPhase[]
  duration: string
  status: 'upcoming' | 'active' | 'completed'
  progress: number
  totalDuration: number // total seconds for this phase
}

const initialPhases: PhaseData[] = [
  {
    id: 1,
    title: "Experiment Configuration",
    subtitle: "Design & Proposal",
    icon: Settings,
    color: "from-cyan-400 to-blue-600",
    borderColor: "border-cyan-400/50",
    bgColor: "bg-cyan-400/10",
    description: "Design your experiment with precision",
    detailedDescription: "This phase is where the research team designs and specifies the entire physical and operational profile of their experiment.",
    keyFeatures: [
      "Hardware & Module Selection",
      "Protocol & Telemetry Definition", 
      "Simulation & Validation",
      "Proposal Submission"
    ],
    subPhases: [
      {
        id: "hardware",
        title: "Select Hardware & Modules",
        description: "Choose from standardized experiment modules",
        icon: Cpu,
        status: "pending",
        duration: 3,
        details: [
          "Fluidics chambers selection",
          "Plant growth habitats configuration",
          "Micro-g centrifuges setup",
          "Microscopy arrays integration",
          "Power & thermal constraints analysis"
        ]
      },
      {
        id: "protocol",
        title: "Define Protocol & Telemetry",
        description: "Create step-by-step procedures and sensor configurations",
        icon: FileText,
        status: "pending",
        duration: 4,
        details: [
          "Timeline creation (Day-by-day procedures)",
          "Sensor data streams configuration",
          "Actuator control options setup",
          "Visual scripting interface",
          "Real-time monitoring parameters"
        ]
      },
      {
        id: "simulation",
        title: "Simulation & Validation",
        description: "Run high-fidelity simulation against satellite resources",
        icon: BarChart3,
        status: "pending",
        duration: 3,
        details: [
          "Resource budget analysis",
          "Mission Success Score generation",
          "Resource conflict detection",
          "Performance optimization",
          "Risk assessment"
        ]
      },
      {
        id: "proposal",
        title: "Proposal Submission",
        description: "Package and submit for internal review",
        icon: FileText,
        status: "pending",
        duration: 2,
        details: [
          "Complete protocol packaging",
          "Resource manifest compilation",
          "Team details submission",
          "Safety review preparation",
          "Feasibility assessment"
        ]
      }
    ],
    duration: "1-2 weeks",
    status: "upcoming",
    progress: 0,
    totalDuration: 12
  },
  {
    id: 2,
    title: "Logistics & Launch",
    subtitle: "Scheduling & Integration",
    icon: Rocket,
    color: "from-blue-400 to-indigo-600",
    borderColor: "border-blue-400/50",
    bgColor: "bg-blue-400/10",
    description: "Prepare and schedule your payload",
    detailedDescription: "Once approved, coordinate physical transport and secure time on the satellite cluster.",
    keyFeatures: [
      "Payload Preparation",
      "Manifest Integration", 
      "Launch Slot Reservation",
      "Contract Finalization"
    ],
    subPhases: [
      {
        id: "payload",
        title: "Payload Preparation",
        description: "Standardized packing and shipping to ground facility",
        icon: PackageCheck,
        status: "pending",
        duration: 4,
        details: [
          "Standardized packing manifest",
          "Shipping labels generation",
          "Seeds & samples preparation",
          "Specialized equipment packaging",
          "Ground facility coordination"
        ]
      },
      {
        id: "integration",
        title: "Manifest & Integration Lock",
        description: "Digital confirmation of payload integration",
        icon: Shield,
        status: "pending",
        duration: 3,
        details: [
          "Physical payload verification",
          "Digital protocol locking",
          "Content confirmation",
          "Integration checklist",
          "Quality assurance"
        ]
      },
      {
        id: "reservation",
        title: "Slot Reservation",
        description: "Interactive calendar for launch scheduling",
        icon: Calendar,
        status: "pending",
        duration: 2,
        details: [
          "Available slots visualization",
          "Launch date selection",
          "Experiment duration planning",
          "Resource allocation",
          "Timeline coordination"
        ]
      },
      {
        id: "contract",
        title: "Contract & Payment",
        description: "Finalize resource consumption and billing",
        icon: FileText,
        status: "pending",
        duration: 2,
        details: [
          "Resource consumption calculation",
          "Final contract generation",
          "Billing statement",
          "Payment processing",
          "Service agreement"
        ]
      }
    ],
    duration: "2-4 weeks",
    status: "upcoming",
    progress: 0,
    totalDuration: 11
  },
  {
    id: 3,
    title: "Orbital Experimentation",
    subtitle: "Active Research in LEO",
    icon: Satellite,
    color: "from-indigo-400 to-purple-600",
    borderColor: "border-indigo-400/50",
    bgColor: "bg-indigo-400/10",
    description: "Conduct research in Low Earth Orbit",
    detailedDescription: "Active phase where research is conducted in Low Earth Orbit with real-time monitoring and control.",
    keyFeatures: [
      "Real-time Dashboard",
      "Telemetry Monitoring", 
      "Remote Control Console",
      "Automated Alerts"
    ],
    subPhases: [
      {
        id: "dashboard",
        title: "Experiment Dashboard",
        description: "Central real-time mission control interface",
        icon: Monitor,
        status: "pending",
        duration: 2,
        details: [
          "Operational status indicators",
          "Mission timer display",
          "Satellite location tracking",
          "Real-time status updates",
          "Mission progress visualization"
        ]
      },
      {
        id: "telemetry",
        title: "Real-Time Telemetry",
        description: "Live sensor readings and data stream viewer",
        icon: Activity,
        status: "pending",
        duration: 8,
        details: [
          "Live sensor data graphs",
          "Temperature monitoring",
          "Light exposure tracking",
          "Latest image captures",
          "Communication window updates"
        ]
      },
      {
        id: "control",
        title: "Remote Control Console",
        description: "Asynchronous command interface for adjustments",
        icon: Radio,
        status: "pending",
        duration: 5,
        details: [
          "Light intensity adjustments",
          "Emergency flush commands",
          "Parameter override options",
          "Command logging system",
          "Time-stamped operations"
        ]
      },
      {
        id: "alerts",
        title: "Automated Alert System",
        description: "Configurable notifications for parameter monitoring",
        icon: Signal,
        status: "pending",
        duration: 3,
        details: [
          "Threshold configuration",
          "Email notifications",
          "App alerts",
          "Parameter monitoring",
          "Emergency response"
        ]
      }
    ],
    duration: "30-90 days",
    status: "upcoming",
    progress: 0,
    totalDuration: 18
  },
  {
    id: 4,
    title: "Data Collection",
    subtitle: "Downlink & Processing",
    icon: Database,
    color: "from-purple-400 to-pink-600",
    borderColor: "border-purple-400/50",
    bgColor: "bg-purple-400/10",
    description: "Retrieve your research data",
    detailedDescription: "Priority shifts to safely returning the large volume of generated research data.",
    keyFeatures: [
      "Data Curation Panel",
      "Tiered Downlink System", 
      "Mission Data Package",
      "Secure Cloud Access"
    ],
    subPhases: [
      {
        id: "curation",
        title: "Data Curation Panel",
        description: "Specify data priority for immediate downlink",
        icon: BarChart3,
        status: "pending",
        duration: 2,
        details: [
          "Priority data specification",
          "Immediate downlink queue",
          "Large file scheduling",
          "Bandwidth optimization",
          "Transfer planning"
        ]
      },
      {
        id: "downlink",
        title: "Tiered Downlink",
        description: "Smart data transfer based on priority and bandwidth",
        icon: Download,
        status: "pending",
        duration: 5,
        details: [
          "Daily sensor data transfer",
          "Key image downloads",
          "High-bandwidth video scheduling",
          "Microscopy image transfer",
          "Dedicated satellite passes"
        ]
      },
      {
        id: "package",
        title: "End-of-Mission Data Package",
        description: "Automated compilation of complete dataset",
        icon: Archive,
        status: "pending",
        duration: 3,
        details: [
          "Raw sensor data (CSV/JSON)",
          "Complete image/video library",
          "Time-stamped mission log",
          "Automated step records",
          "Command history"
        ]
      },
      {
        id: "access",
        title: "Secure Data Access",
        description: "Encrypted cloud storage with secure credentials",
        icon: Cloud,
        status: "pending",
        duration: 2,
        details: [
          "Secure cloud transfer",
          "Encrypted credentials",
          "Complete dataset access",
          "Download verification",
          "Data integrity checks"
        ]
      }
    ],
    duration: "1-2 weeks",
    status: "upcoming",
    progress: 0,
    totalDuration: 12
  },
  {
    id: 5,
    title: "Decommissioning",
    subtitle: "Retrieval & Review",
    icon: PackageCheck,
    color: "from-pink-400 to-rose-600",
    borderColor: "border-pink-400/50",
    bgColor: "bg-pink-400/10",
    description: "Complete your mission cycle",
    detailedDescription: "Final phase handling physical end-of-life for the experiment with optional sample return.",
    keyFeatures: [
      "Sample Return Scheduling",
      "Safe Decommissioning", 
      "Mission Reports",
      "Post-Flight Review"
    ],
    subPhases: [
      {
        id: "return",
        title: "Sample Return Scheduling",
        description: "Physical sample retrieval on re-entry vehicle",
        icon: Rocket,
        status: "pending",
        duration: 3,
        details: [
          "Harvested plant scheduling",
          "Crystallized protein return",
          "Re-entry vehicle coordination",
          "Sample preservation",
          "Return timeline planning"
        ]
      },
      {
        id: "shutdown",
        title: "Decommissioning Report",
        description: "Safe shutdown and removal confirmation",
        icon: Shield,
        status: "pending",
        duration: 2,
        details: [
          "Safe shutdown procedures",
          "Power-down confirmation",
          "Module removal/disposal",
          "Satellite cluster cleanup",
          "Final status report"
        ]
      },
      {
        id: "review",
        title: "Post-Flight Review",
        description: "Feedback submission for future improvements",
        icon: Star,
        status: "pending",
        duration: 2,
        details: [
          "Process feedback collection",
          "Hardware evaluation",
          "Software improvement suggestions",
          "Future iteration planning",
          "Research team testimonials"
        ]
      }
    ],
    duration: "2-3 weeks",
    status: "upcoming",
    progress: 0,
    totalDuration: 7
  },
]

export function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activePhase, setActivePhase] = useState<number>(1)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState<1 | 2 | 4>(2)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [visiblePhases, setVisiblePhases] = useState<Set<number>>(new Set())
  const [selectedSubPhase, setSelectedSubPhase] = useState<string | null>(null)
  const [phaseStates, setPhaseStates] = useState<{[key: number]: PhaseData}>(
    initialPhases.reduce((acc, phase) => ({ ...acc, [phase.id]: { ...phase } }), {})
  )
  const simulationRef = useRef<NodeJS.Timeout | null>(null)
  const [currentSubPhaseIndex, setCurrentSubPhaseIndex] = useState(0)

  // Calculate total simulation duration
  const totalSimulationDuration = initialPhases.reduce((sum, phase) => sum + phase.totalDuration, 0)

  const startSimulation = useCallback(() => {
    setIsSimulating(true)
    setSimulationProgress(0)
    setCurrentSubPhaseIndex(0)
    
    // Reset all phases to initial state
    const resetPhases = initialPhases.reduce((acc, phase, index) => ({
      ...acc,
      [phase.id]: {
        ...phase,
        status: index === 0 ? 'active' : 'upcoming',
        progress: 0,
        subPhases: phase.subPhases.map((sp, spIndex) => ({
          ...sp,
          status: index === 0 && spIndex === 0 ? 'active' : 'pending'
        }))
      }
    }), {})
    
    setPhaseStates(resetPhases)
    setActivePhase(1)
    
    // Start simulation
    let totalElapsed = 0
    let currentPhaseIndex = 0
    let currentSubPhase = 0
    
    const simulationInterval = setInterval(() => {
      totalElapsed += simulationSpeed
      
      setPhaseStates(prev => {
        const newStates = { ...prev }
        const currentPhase = initialPhases[currentPhaseIndex]
        
        if (currentPhase) {
          // Calculate elapsed time in current phase
          let phaseElapsed = totalElapsed
          for (let i = 0; i < currentPhaseIndex; i++) {
            phaseElapsed -= initialPhases[i].totalDuration
          }
          
          // Update phase progress
          const phaseProgress = Math.min((phaseElapsed / currentPhase.totalDuration) * 100, 100)
          newStates[currentPhase.id] = {
            ...newStates[currentPhase.id],
            progress: phaseProgress
          }
          
          // Update sub-phase status
          let subPhaseElapsed = 0
          let activeSubPhaseFound = false
          
          newStates[currentPhase.id].subPhases = currentPhase.subPhases.map((sp, index) => {
            const subPhaseStart = subPhaseElapsed
            const subPhaseEnd = subPhaseElapsed + sp.duration
            subPhaseElapsed += sp.duration
            
            if (phaseElapsed >= subPhaseEnd) {
              return { ...sp, status: 'completed' }
            } else if (phaseElapsed >= subPhaseStart && !activeSubPhaseFound) {
              activeSubPhaseFound = true
              setCurrentSubPhaseIndex(index)
              return { ...sp, status: 'active' }
            } else {
              return { ...sp, status: 'pending' }
            }
          })
          
          // Check if phase is complete
          if (phaseProgress >= 100) {
            newStates[currentPhase.id].status = 'completed'
            newStates[currentPhase.id].subPhases = currentPhase.subPhases.map(sp => ({
              ...sp,
              status: 'completed'
            }))
            
            currentPhaseIndex++
            currentSubPhase = 0
            
            // Start next phase
            if (currentPhaseIndex < initialPhases.length) {
              const nextPhase = initialPhases[currentPhaseIndex]
              newStates[nextPhase.id] = {
                ...newStates[nextPhase.id],
                status: 'active'
              }
              setActivePhase(nextPhase.id)
            } else {
              // Simulation complete
              setIsSimulating(false)
              clearInterval(simulationInterval)
            }
          }
        }
        
        return newStates
      })
      
      // Update overall progress
      const overallProgress = Math.min((totalElapsed / totalSimulationDuration) * 100, 100)
      setSimulationProgress(overallProgress)
      
      if (overallProgress >= 100) {
        setIsSimulating(false)
        clearInterval(simulationInterval)
      }
      
    }, 1000 / simulationSpeed)
    
    simulationRef.current = simulationInterval
  }, [simulationSpeed, totalSimulationDuration])

  const pauseSimulation = useCallback(() => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current)
      simulationRef.current = null
    }
  }, [])

  const resetSimulation = useCallback(() => {
    setIsSimulating(false)
    setSimulationProgress(0)
    setCurrentSubPhaseIndex(0)
    
    if (simulationRef.current) {
      clearInterval(simulationRef.current)
      simulationRef.current = null
    }
    
    // Reset to initial state
    const resetPhases = initialPhases.reduce((acc, phase) => ({
      ...acc,
      [phase.id]: { ...phase }
    }), {})
    
    setPhaseStates(resetPhases)
    setActivePhase(1)
  }, [])

  const jumpToPhase = useCallback((phaseId: number) => {
    if (!isSimulating) {
      setActivePhase(phaseId)
    }
  }, [isSimulating])

  // Cleanup simulation on unmount
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            initialPhases.forEach((phase, index) => {
              setTimeout(() => {
                setVisiblePhases((prev) => new Set([...prev, phase.id]))
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

  const currentPhase = phaseStates[activePhase] || initialPhases.find(p => p.id === activePhase)
  const currentSubPhase = currentPhase?.subPhases.find(sp => sp.id === selectedSubPhase)
  const isSimulationPaused = isSimulating && !simulationRef.current

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="relative min-h-screen py-20 px-4 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary text-sm px-4 py-1 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AeroLabs Research Workflow
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Interactive <span className="text-primary bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Mission Simulator</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Experience and simulate our complete 5-phase research workflow with real-time progress tracking, 
            interactive controls, and detailed phase visualization
          </p>
        </div>

        {/* Simulation Control Bar */}
        <div className="mb-8">
          <Card className="p-6 border-2 border-primary/20 backdrop-blur-sm bg-background/50">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Timer className="w-5 h-5 text-primary" />
                  Mission Control
                </h3>
                
                <div className="flex items-center gap-2">
                  {!isSimulating ? (
                    <Button
                      onClick={startSimulation}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start Simulation
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={isSimulationPaused ? startSimulation : pauseSimulation}
                        className="flex items-center gap-2"
                      >
                        {isSimulationPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        {isSimulationPaused ? 'Resume' : 'Pause'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetSimulation}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Speed Control */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Speed:</span>
                {[1, 2, 4].map((speed) => (
                  <Button
                    key={speed}
                    size="sm"
                    variant={simulationSpeed === speed ? "default" : "outline"}
                    onClick={() => setSimulationSpeed(speed as 1 | 2 | 4)}
                    className="w-10 h-8 p-0 text-xs"
                    disabled={isSimulating && !isSimulationPaused}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>

              {/* Overall Progress */}
              {isSimulating && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium">Mission Progress</span>
                    <span className="text-primary font-bold">{Math.round(simulationProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 relative overflow-hidden">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${simulationProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {isSimulationPaused ? 'Simulation paused' : 'Running simulation...'}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Mission Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Phase Selection Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-2 border-primary/20 backdrop-blur-sm bg-background/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Mission Phases
                </h3>
              </div>

              <div className="space-y-3">
                {initialPhases.map((phase) => {
                  const Icon = phase.icon
                  const isVisible = visiblePhases.has(phase.id)
                  const isActive = activePhase === phase.id
                  const currentPhaseState = phaseStates[phase.id] || phase

                  return (
                    <div
                      key={phase.id}
                      className={`relative cursor-pointer transition-all duration-300 ${
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      }`}
                      style={{ transitionDelay: `${phase.id * 100}ms` }}
                      onClick={() => jumpToPhase(phase.id)}
                    >
                      <Card
                        className={`p-4 border transition-all duration-300 ${
                          isActive
                            ? `${phase.borderColor} shadow-lg shadow-primary/20 bg-gradient-to-r ${phase.bgColor} border-2`
                            : "border-border hover:border-primary/30 bg-background/50"
                        } ${isSimulating && !isActive ? 'opacity-75' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Phase Status Indicator */}
                          <div className="relative">
                            <div
                              className={`w-10 h-10 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center text-white font-bold shadow-lg transition-transform duration-300 ${
                                currentPhaseState.status === 'active' ? 'scale-110' : ''
                              }`}
                            >
                              {currentPhaseState.status === 'completed' ? (
                                <CheckCircle2 className="w-6 h-6" />
                              ) : (
                                phase.id
                              )}
                            </div>
                            {currentPhaseState.status === 'active' && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-background" />
                            )}
                            {currentPhaseState.status === 'completed' && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-background" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{phase.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">{phase.subtitle}</p>
                            {(currentPhaseState.status === 'active' || currentPhaseState.progress > 0) && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="text-primary font-medium">{Math.round(currentPhaseState.progress)}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-1">
                                  <div 
                                    className={`h-1 rounded-full bg-gradient-to-r ${phase.color} transition-all duration-500`}
                                    style={{ width: `${currentPhaseState.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {isActive && (
                            <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
                          )}
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Phase Detail Panel */}
          <div className="lg:col-span-2">
            {currentPhase && (
              <Card className="p-8 border-2 border-primary/20 backdrop-blur-sm bg-background/50 h-full">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentPhase.color} flex items-center justify-center text-white shadow-lg transition-transform duration-300 ${
                        currentPhase.status === 'active' ? 'scale-110' : ''
                      }`}
                    >
                      <currentPhase.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{currentPhase.title}</h3>
                      <p className="text-muted-foreground">{currentPhase.subtitle}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground">{currentPhase.duration}</span>
                        </div>
                        <Badge 
                          variant={currentPhase.status === 'completed' ? 'default' : 
                                  currentPhase.status === 'active' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {currentPhase.status}
                        </Badge>
                        {currentPhase.status === 'active' && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <Activity className="w-3 h-3 animate-pulse" />
                            Live
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {currentPhase.detailedDescription}
                  </p>

                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {currentPhase.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-phases */}
                <div>
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Orbit className="w-5 h-5 text-primary" />
                    Phase Components
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentPhase.subPhases.map((subPhase, index) => {
                      const SubIcon = subPhase.icon
                      const isSelected = selectedSubPhase === subPhase.id

                      return (
                        <Card
                          key={subPhase.id}
                          className={`p-4 cursor-pointer transition-all duration-300 border ${
                            isSelected
                              ? `${currentPhase.borderColor} shadow-md border-2`
                              : "border-border hover:border-primary/30"
                          } ${subPhase.status === 'active' ? 'ring-2 ring-green-400/50' : ''}`}
                          onClick={() => setSelectedSubPhase(isSelected ? null : subPhase.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg ${currentPhase.bgColor} flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                                subPhase.status === 'active' ? 'scale-110' : ''
                              }`}
                            >
                              {subPhase.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : subPhase.status === 'active' ? (
                                <Activity className="w-4 h-4 text-green-600 animate-pulse" />
                              ) : (
                                <SubIcon className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-sm mb-1">{subPhase.title}</h5>
                              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                {subPhase.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={subPhase.status === 'completed' ? 'default' : 
                                          subPhase.status === 'active' ? 'secondary' : 'outline'}
                                  className="text-xs"
                                >
                                  {subPhase.status}
                                </Badge>
                                {isSimulating && (
                                  <span className="text-xs text-muted-foreground">
                                    ~{subPhase.duration}s
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isSelected && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="space-y-2">
                                {subPhase.details.map((detail, detailIndex) => (
                                  <div key={detailIndex} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span className="text-xs text-muted-foreground">{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Mission Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Rocket,
              title: "Active Missions",
              value: isSimulating ? "1" : "24",
              change: isSimulating ? "Simulating..." : "+3 this week",
              color: "text-blue-500"
            },
            {
              icon: Satellite,
              title: "Current Phase",
              value: `Phase ${activePhase}`,
              change: currentPhase?.title || "Configuration",
              color: "text-green-500"
            },
            {
              icon: Database,
              title: "Progress",
              value: `${Math.round(simulationProgress)}%`,
              change: isSimulating ? "Live tracking" : "Ready to start",
              color: "text-purple-500"
            },
            {
              icon: Timer,
              title: "Speed",
              value: `${simulationSpeed}x`,
              change: isSimulating ? (isSimulationPaused ? "Paused" : "Running") : "Standby",
              color: "text-cyan-500"
            },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="p-6 border-2 border-border hover:border-primary/30 transition-all duration-300 backdrop-blur-sm bg-background/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                </div>
                <h4 className="font-medium text-sm">{stat.title}</h4>
              </Card>
            )
          })}
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Interactive Simulation",
              description: "Experience the complete workflow with real-time progress tracking and control",
            },
            {
              icon: Monitor,
              title: "Mission Control Interface",
              description: "Professional dashboard for comprehensive workflow visualization and management",
            },
            {
              icon: Timer,
              title: "Customizable Speed",
              description: "Adjust simulation speed from 1x to 4x to explore workflow at your preferred pace",
            },
          ].map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card
                key={index}
                className="p-6 text-center border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 backdrop-blur-sm bg-background/50"
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