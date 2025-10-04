"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Sparkles } from "lucide-react"

interface AtmosphereLayer {
  name: string
  altitude: number
  color: number
  opacity: number
  description: string
}

declare global {
  interface Window {
    THREE: any
  }
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const [textOpacity, setTextOpacity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null)

  // Callback to handle interaction state changes
  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true)
  }, [])

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
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

  // Update text opacity based on interaction
  useEffect(() => {
    if (isInteracting) {
      setTextOpacity(0)  // Hide text when interacting (dragging)
    } else {
      setTextOpacity(1)  // Show text when not interacting
    }
  }, [isInteracting])

  useEffect(() => {
    if (!containerRef.current) return

    let animationFrameId: number
    let renderer: any

    const loadThreeJS = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (window.THREE) {
          resolve()
          return
        }

        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Failed to load Three.js"))
        document.head.appendChild(script)
      })
    }

    const initThreeJS = async () => {
      try {
        await loadThreeJS()

        if (!containerRef.current || !window.THREE) return

        const THREE = window.THREE

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
          45,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000,
        )
        camera.position.z = 15

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setClearColor(0x000000, 0)
        containerRef.current.appendChild(renderer.domElement)

        let isDragging = false
        let previousMousePosition = { x: 0, y: 0 }
        const cameraRotation = { x: 0, y: 0 }
        let autoRotate = true
        let targetZoom = 15
        let interactionTimer: NodeJS.Timeout

        const raycaster = new THREE.Raycaster()

        const onMouseDown = (event: MouseEvent) => {
          isDragging = true
          autoRotate = false
          handleInteractionStart()
          previousMousePosition = { x: event.clientX, y: event.clientY }
          
          // Clear any existing timer
          if (interactionTimer) clearTimeout(interactionTimer)
        }

        const onMouseMove = (event: MouseEvent) => {
          if (!containerRef.current) return
          const rect = containerRef.current.getBoundingClientRect()
          const mouse = {
            x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
            y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
          }

          raycaster.setFromCamera(mouse, camera)
          const intersects = raycaster.intersectObjects(layerMeshes)

          if (intersects.length > 0) {
            const layerName = intersects[0].object.userData.name
            setHoveredLayer(layerName)
            document.body.style.cursor = "pointer"
          } else {
            setHoveredLayer(null)
            document.body.style.cursor = isDragging ? "grabbing" : "grab"
          }

          if (isDragging) {
            const deltaX = event.clientX - previousMousePosition.x
            const deltaY = event.clientY - previousMousePosition.y

            cameraRotation.y += deltaX * 0.005
            cameraRotation.x += deltaY * 0.005

            cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.x))

            previousMousePosition = { x: event.clientX, y: event.clientY }
          }
        }

        const onMouseUp = () => {
          isDragging = false
          document.body.style.cursor = "grab"
          
          // Set timer to restore text after 2 seconds of no interaction
          interactionTimer = setTimeout(() => {
            handleInteractionEnd()
            autoRotate = true
          }, 1000)
        }

        const onWheel = (event: WheelEvent) => {
          event.preventDefault()
          handleInteractionStart()
          targetZoom += event.deltaY * 0.008  // Reduced zoom speed
          targetZoom = Math.max(10, Math.min(25, targetZoom))  // Tightened zoom range
          
          // Clear existing timer and set new one
          if (interactionTimer) clearTimeout(interactionTimer)
          interactionTimer = setTimeout(() => {
            handleInteractionEnd()
            autoRotate = true
          }, 1000)
        }

        renderer.domElement.addEventListener("mousedown", onMouseDown)
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)
        renderer.domElement.addEventListener("wheel", onWheel)
        renderer.domElement.style.cursor = "grab"

        // Create realistic Earth with texture
        const earthGeometry = new THREE.SphereGeometry(5, 64, 64) // Higher resolution
        
        // Load Earth texture
        const textureLoader = new THREE.TextureLoader()
        let earthTexture: any = null
        
        // Try to load real Earth texture, fallback to procedural if fails
        try {
          earthTexture = textureLoader.load('/earth-texture-blue-green-continents.jpg')
          earthTexture.wrapS = THREE.RepeatWrapping
          earthTexture.wrapT = THREE.RepeatWrapping
        } catch (error) {
          console.log('Earth texture not found, using procedural texture')
        }
        
        const earthMaterial = new THREE.MeshPhongMaterial({
          color: earthTexture ? 0xffffff : 0x1a4d7a, // White if texture, blue if no texture
          map: earthTexture,
          emissive: 0x0a2540,
          emissiveIntensity: 0.1,
          shininess: 10,
          specular: 0x111111,
          // Add normal map effect without actual normal map
          bumpScale: 0.02,
        })
        
        // Create procedural Earth-like texture if no image texture
        if (!earthTexture) {
          const canvas = document.createElement('canvas')
          canvas.width = 512
          canvas.height = 256
          const context = canvas.getContext('2d')!
          
          // Create gradient for ocean and land
          const gradient = context.createLinearGradient(0, 0, 512, 256)
          gradient.addColorStop(0, '#1a4d7a') // Ocean blue
          gradient.addColorStop(0.3, '#2d5f8a')
          gradient.addColorStop(0.5, '#4a7c59') // Land green
          gradient.addColorStop(0.7, '#8b7355') // Land brown
          gradient.addColorStop(1, '#5d8a3a') // Land green
          
          context.fillStyle = gradient
          context.fillRect(0, 0, 512, 256)
          
          // Add some continent-like shapes
          context.fillStyle = '#4a7c59'
          context.beginPath()
          context.ellipse(100, 80, 60, 40, 0, 0, Math.PI * 2)
          context.fill()
          
          context.fillStyle = '#8b7355'
          context.beginPath()
          context.ellipse(300, 120, 80, 50, 0, 0, Math.PI * 2)
          context.fill()
          
          context.fillStyle = '#5d8a3a'
          context.beginPath()
          context.ellipse(450, 90, 50, 70, 0, 0, Math.PI * 2)
          context.fill()
          
          // Add polar ice caps
          context.fillStyle = '#ffffff'
          context.beginPath()
          context.ellipse(256, 20, 120, 15, 0, 0, Math.PI * 2)
          context.fill()
          context.beginPath()
          context.ellipse(256, 236, 100, 12, 0, 0, Math.PI * 2)
          context.fill()
          
          const proceduralTexture = new THREE.CanvasTexture(canvas)
          proceduralTexture.wrapS = THREE.RepeatWrapping
          proceduralTexture.wrapT = THREE.ClampToEdgeWrapping
          earthMaterial.map = proceduralTexture
        }
        
        const earth = new THREE.Mesh(earthGeometry, earthMaterial)
        scene.add(earth)

        // Atmosphere layers
        const layers: AtmosphereLayer[] = [
          {
            name: "Troposphere",
            altitude: 5.3,
            color: 0x4a9eff,
            opacity: 0.25,
            description: "0-12 km - Weather layer",
          },
          {
            name: "Stratosphere",
            altitude: 5.8,
            color: 0x00d4ff,
            opacity: 0.22,
            description: "12-50 km - Ozone layer",
          },
          {
            name: "Mesosphere",
            altitude: 6.3,
            color: 0x00ffcc,
            opacity: 0.18,
            description: "50-85 km - Meteor layer",
          },
          {
            name: "Thermosphere",
            altitude: 7.0,
            color: 0x00ff88,
            opacity: 0.15,
            description: "85-600 km - Aurora layer",
          },
          {
            name: "LEO Zone",
            altitude: 9.5,
            color: 0xff6b00,
            opacity: 0.12,
            description: "160-2000 km - Low Earth Orbit",
          },
        ]

        const layerMeshes: any[] = []

        layers.forEach((layer, index) => {
          const geometry = new THREE.SphereGeometry(layer.altitude, 64, 64)
          const material = new THREE.MeshBasicMaterial({
            color: layer.color,
            transparent: true,
            opacity: layer.opacity,
            side: THREE.BackSide,
          })
          const mesh = new THREE.Mesh(geometry, material)
          mesh.userData = { name: layer.name, description: layer.description }
          scene.add(mesh)
          layerMeshes.push(mesh)

          // Create edge glow effect
          const edgeGeometry = new THREE.SphereGeometry(layer.altitude, 64, 64)
          const edgeMaterial = new THREE.ShaderMaterial({
            uniforms: {
              color: { value: new THREE.Color(layer.color) },
              intensity: { value: 0.8 },
            },
            vertexShader: `
              varying vec3 vNormal;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform vec3 color;
              uniform float intensity;
              varying vec3 vNormal;
              void main() {
                float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
                rim = pow(rim, 3.0);
                gl_FragColor = vec4(color, rim * intensity);
              }
            `,
            transparent: true,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
          })
          const edgeMesh = new THREE.Mesh(edgeGeometry, edgeMaterial)
          scene.add(edgeMesh)

          // Add particles for LEO Zone
          if (layer.name === "LEO Zone") {
            const particleCount = 200
            const particleGeometry = new THREE.BufferGeometry()
            const positions = []
            const colors = []

            for (let i = 0; i < particleCount; i++) {
              const angle = (i / particleCount) * Math.PI * 2
              const radius = layer.altitude + (Math.random() - 0.5) * 1.8  // Increased spread from 0.3 to 1.8
              const x = Math.cos(angle) * radius
              const y = (Math.random() - 0.5) * 1.2  // Increased height variation from 0.5 to 1.2
              const z = Math.sin(angle) * radius

              positions.push(x, y, z)
              colors.push(1, 0.42, 0)
            }

            particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
            particleGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

            const particleMaterial = new THREE.PointsMaterial({
              size: 0.08,
              vertexColors: true,
              transparent: true,
              opacity: 0.8,
              blending: THREE.AdditiveBlending,
            })

            const particles = new THREE.Points(particleGeometry, particleMaterial)
            particles.userData = { type: "leoParticles" }
            scene.add(particles)
          }
        })

        // Add space station
        const stationGeometry = new THREE.SphereGeometry(0.2, 16, 16)
        const stationMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6b00,
          emissive: 0xff6b00,
          emissiveIntensity: 0.5,
        })
        const station = new THREE.Mesh(stationGeometry, stationMaterial)
        station.position.set(9.5, 0, 0)  // Updated to match new LEO zone altitude
        scene.add(station)

        // Station glow
        const stationGlowGeometry = new THREE.SphereGeometry(0.35, 16, 16)
        const stationGlowMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6b00,
          transparent: true,
          opacity: 0.3,
        })
        const stationGlow = new THREE.Mesh(stationGlowGeometry, stationGlowMaterial)
        stationGlow.position.copy(station.position)
        scene.add(stationGlow)

        // Orbital path
        const orbitGeometry = new THREE.RingGeometry(9.3, 9.7, 128)  // Updated ring to match new LEO zone
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6b00,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
        })
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
        orbit.rotation.x = Math.PI / 2
        scene.add(orbit)

        // Realistic lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.2) // Reduced ambient light
        scene.add(ambientLight)

        // Main sunlight
        const sunLight = new THREE.DirectionalLight(0xffeaa7, 1.5) // Warm sunlight
        sunLight.position.set(15, 5, 10)
        sunLight.castShadow = false // Keep simple for performance
        scene.add(sunLight)

        // Secondary light to simulate Earth's reflected light
        const earthLight = new THREE.DirectionalLight(0x4a9eff, 0.3)
        earthLight.position.set(-8, -3, -5)
        scene.add(earthLight)

        // Rim light for atmosphere effect
        const rimLight = new THREE.DirectionalLight(0x74b9ff, 0.4)
        rimLight.position.set(0, 0, -15)
        scene.add(rimLight)

        // Realistic background stars
        const starsGeometry = new THREE.BufferGeometry()
        const starsVertices = []
        const starsColors = []
        const starsSizes = []
        
        for (let i = 0; i < 2000; i++) {
          // Position stars at various distances
          const distance = 500 + Math.random() * 1500
          starsVertices.push(
            (Math.random() - 0.5) * distance,
            (Math.random() - 0.5) * distance,
            (Math.random() - 0.5) * distance,
          )
          
          // Realistic star colors (blue-white, yellow, orange, red)
          const starType = Math.random()
          if (starType < 0.6) {
            // Blue-white stars (most common)
            starsColors.push(0.8 + Math.random() * 0.2, 0.9 + Math.random() * 0.1, 1)
          } else if (starType < 0.8) {
            // Yellow stars like our Sun
            starsColors.push(1, 0.9 + Math.random() * 0.1, 0.7 + Math.random() * 0.2)
          } else if (starType < 0.95) {
            // Orange stars
            starsColors.push(1, 0.6 + Math.random() * 0.2, 0.3 + Math.random() * 0.2)
          } else {
            // Red giants (rare)
            starsColors.push(1, 0.3 + Math.random() * 0.2, 0.2)
          }
          
          // Varied star sizes
          starsSizes.push(0.5 + Math.random() * 2)
        }
        
        starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3))
        starsGeometry.setAttribute("color", new THREE.Float32BufferAttribute(starsColors, 3))
        starsGeometry.setAttribute("size", new THREE.Float32BufferAttribute(starsSizes, 1))
        
        const starsMaterial = new THREE.PointsMaterial({ 
          vertexColors: true,
          size: 1.5,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        })
        const stars = new THREE.Points(starsGeometry, starsMaterial)
        scene.add(stars)

        setIsLoading(false)

        // Animation loop
        const animate = () => {
          // Auto rotation when not interacting
          if (autoRotate && !isDragging) {
            cameraRotation.y += 0.002
          }

          // Realistic Earth rotation (24-hour day simulation)
          earth.rotation.y += 0.001 // Slow realistic rotation
          
          // Add slight wobble to simulate Earth's axial tilt
          const time = Date.now() * 0.0001
          earth.rotation.z = Math.sin(time * 0.1) * 0.02

          // Smooth zoom adjustment with better interpolation
          const currentDistance = camera.position.length()
          const newDistance = currentDistance + (targetZoom - currentDistance) * 0.03  // Slower interpolation
          
          // Apply camera rotation with fixed distance
          camera.position.x = Math.sin(cameraRotation.y) * Math.cos(cameraRotation.x) * newDistance
          camera.position.y = Math.sin(cameraRotation.x) * newDistance
          camera.position.z = Math.cos(cameraRotation.y) * Math.cos(cameraRotation.x) * newDistance
          camera.lookAt(0, 0, 0)

          // Animate station orbit realistically
          station.position.x = Math.cos(time * 0.5) * 9.5  // Updated to match new LEO zone
          station.position.z = Math.sin(time * 0.5) * 9.5  // Updated to match new LEO zone
          stationGlow.position.copy(station.position)

          // Animate particles
          scene.children.forEach((child: any) => {
            if (child.userData.type === "leoParticles") {
              child.rotation.y += 0.01
            }
          })

          renderer.render(scene, camera)
          animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
          if (!containerRef.current) return
          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        }

        window.addEventListener("resize", handleResize)

        return () => {
          cancelAnimationFrame(animationFrameId)
          window.removeEventListener("resize", handleResize)
          renderer.domElement.removeEventListener("mousedown", onMouseDown)
          window.removeEventListener("mousemove", onMouseMove)
          window.removeEventListener("mouseup", onMouseUp)
          renderer.domElement.removeEventListener("wheel", onWheel)
          if (interactionTimer) clearTimeout(interactionTimer)
          if (renderer && containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement)
          }
          renderer?.dispose()
        }
      } catch (error) {
        console.error("Failed to initialize Three.js:", error)
        setIsLoading(false)
      }
    }

    initThreeJS()
  }, [handleInteractionStart, handleInteractionEnd])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
      {/* 3D Earth Background */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-primary animate-pulse bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
            Loading Earth visualization...
          </div>
        </div>
      )}

      {/* Layer information tooltip */}
      {hoveredLayer && (
        <div className="absolute top-20 left-4 z-30 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 max-w-xs">
          <h4 className="font-semibold text-primary mb-1">{hoveredLayer}</h4>
          <p className="text-sm text-muted-foreground">
            {hoveredLayer === "LEO Zone" && "Low Earth Orbit - Where Oriviet operates"}
            {hoveredLayer === "Thermosphere" && "85-600 km - Aurora layer with extreme temperatures"}
            {hoveredLayer === "Mesosphere" && "50-85 km - Where meteors burn up"}
            {hoveredLayer === "Stratosphere" && "12-50 km - Contains the ozone layer"}
            {hoveredLayer === "Troposphere" && "0-12 km - Weather and life layer"}
          </p>
        </div>
      )}

      {/* Text overlay with smart pointer events and no text selection */}
      <div
        ref={textContainerRef}
        className="container mx-auto text-center max-w-5xl relative z-10 select-none"
        style={{ 
          opacity: textOpacity,
          transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: "translateZ(0)",
          pointerEvents: "none", // Make container transparent to mouse events
          userSelect: "none", // Prevent text selection
          WebkitUserSelect: "none", // Safari
          MozUserSelect: "none", // Firefox
          msUserSelect: "none" // IE/Edge
        }}
      >
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm select-none"
          style={{ pointerEvents: "auto" }}
        >
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm text-primary font-medium">Powered by Oriviet</span>
        </div>

        <h1 
          className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight select-none"
          style={{ pointerEvents: "auto" }}
        >
          <span className="block text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text">
            Oriviet
          </span>
          <span className="block text-3xl md:text-4xl mt-4 text-muted-foreground font-normal">
            Space Agriculture Revolution
          </span>
        </h1>
        <p 
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed select-none"
          style={{ pointerEvents: "auto" }}
        >
          Advanced agricultural technology for space exploration. Revolutionizing farming in Low Earth Orbit with sustainable innovation.
        </p>
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ pointerEvents: "auto" }}
        >
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 group">
            Explore Oriviet
            <ArrowDown className="ml-2 group-hover:translate-y-1 transition-transform" size={18} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary bg-transparent backdrop-blur-sm"
          >
            Learn More
          </Button>
        </div>
        <div 
          className="mt-12 animate-bounce select-none"
          style={{ pointerEvents: "auto" }}
        >
          <ArrowDown className="mx-auto text-primary/60" size={28} />
        </div>
      </div>

      {/* Interaction hint */}
      <div className="absolute bottom-8 right-8 z-20 text-xs text-muted-foreground/60 bg-card/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/50 select-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
          Drag Earth to explore • Scroll to zoom • Text areas clickable
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Global text selection prevention for hero section */
        section {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Allow text selection only for interactive elements */
        button {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </section>
  )
}
