"use client"

import { useEffect, useRef, useState } from "react"

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

export function EarthVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
        containerRef.current.appendChild(renderer.domElement)

        let isDragging = false
        let previousMousePosition = { x: 0, y: 0 }
        const cameraRotation = { x: 0, y: 0 }
        let autoRotate = true
        let targetZoom = 15

        const onMouseDown = (event: MouseEvent) => {
          isDragging = true
          autoRotate = false
          previousMousePosition = { x: event.clientX, y: event.clientY }
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
        }

        const onWheel = (event: WheelEvent) => {
          event.preventDefault()
          targetZoom += event.deltaY * 0.01
          targetZoom = Math.max(8, Math.min(30, targetZoom))
        }

        renderer.domElement.addEventListener("mousedown", onMouseDown)
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)
        renderer.domElement.addEventListener("wheel", onWheel)
        renderer.domElement.style.cursor = "grab"

        const earthGeometry = new THREE.SphereGeometry(5, 32, 32)
        const earthMaterial = new THREE.MeshPhongMaterial({
          color: 0x1a4d7a,
          emissive: 0x0a2540,
          shininess: 5,
        })
        const earth = new THREE.Mesh(earthGeometry, earthMaterial)
        scene.add(earth)

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
            altitude: 7.8,
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

          if (layer.name === "LEO Zone") {
            const particleCount = 200
            const particleGeometry = new THREE.BufferGeometry()
            const positions = []
            const colors = []

            for (let i = 0; i < particleCount; i++) {
              const angle = (i / particleCount) * Math.PI * 2
              const radius = layer.altitude + (Math.random() - 0.5) * 0.3
              const x = Math.cos(angle) * radius
              const y = (Math.random() - 0.5) * 0.5
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

        const stationGeometry = new THREE.SphereGeometry(0.2, 16, 16)
        const stationMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6b00,
          emissive: 0xff6b00,
          emissiveIntensity: 0.5,
        })
        const station = new THREE.Mesh(stationGeometry, stationMaterial)
        station.position.set(7.8, 0, 0)
        scene.add(station)

        const stationGlowGeometry = new THREE.SphereGeometry(0.35, 16, 16)
        const stationGlowMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6b00,
          transparent: true,
          opacity: 0.3,
        })
        const stationGlow = new THREE.Mesh(stationGlowGeometry, stationGlowMaterial)
        stationGlow.userData = { type: "stationGlow" }
        scene.add(stationGlow)

        const orbitGeometry = new THREE.RingGeometry(7.7, 7.9, 128)
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6b00,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
        })
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
        orbit.rotation.x = Math.PI / 2
        scene.add(orbit)

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
        scene.add(ambientLight)

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2)
        sunLight.position.set(10, 5, 5)
        scene.add(sunLight)

        const backLight = new THREE.DirectionalLight(0x4a9eff, 0.3)
        backLight.position.set(-10, -5, -5)
        scene.add(backLight)

        const starsGeometry = new THREE.BufferGeometry()
        const starsVertices = []
        const starsSizes = []

        for (let i = 0; i < 2000; i++) {
          const x = (Math.random() - 0.5) * 150
          const y = (Math.random() - 0.5) * 150
          const z = (Math.random() - 0.5) * 150
          starsVertices.push(x, y, z)
          starsSizes.push(Math.random() * 2)
        }

        starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3))
        starsGeometry.setAttribute("size", new THREE.Float32BufferAttribute(starsSizes, 1))

        const starsMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.15,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true,
        })

        const stars = new THREE.Points(starsGeometry, starsMaterial)
        scene.add(stars)

        const raycaster = new THREE.Raycaster()

        const animate = () => {
          animationFrameId = requestAnimationFrame(animate)

          const time = Date.now() * 0.0001

          // Slow Earth rotation
          earth.rotation.y += 0.0005

          if (autoRotate) {
            cameraRotation.y += 0.001
          }

          // Smooth camera movement
          const targetX = targetZoom * Math.sin(cameraRotation.y) * Math.cos(cameraRotation.x)
          const targetY = targetZoom * Math.sin(cameraRotation.x)
          const targetZ = targetZoom * Math.cos(cameraRotation.y) * Math.cos(cameraRotation.x)

          camera.position.x += (targetX - camera.position.x) * 0.05
          camera.position.y += (targetY - camera.position.y) * 0.05
          camera.position.z += (targetZ - camera.position.z) * 0.05
          camera.lookAt(0, 0, 0)

          // Animate station orbit
          const orbitSpeed = 0.0003
          station.position.x = Math.cos(time * 5) * 7.8
          station.position.z = Math.sin(time * 5) * 7.8
          stationGlow.position.copy(station.position)

          // Pulse station glow
          stationGlow.scale.setScalar(1 + Math.sin(time * 10) * 0.1)

          // Rotate LEO particles
          scene.children.forEach((child) => {
            if (child.userData.type === "leoParticles") {
              child.rotation.y += 0.0005
            }
          })

          // Subtle star twinkle
          stars.rotation.y += 0.0001

          renderer.render(scene, camera)
        }

        animate()

        const handleResize = () => {
          if (!containerRef.current) return
          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        }

        window.addEventListener("resize", handleResize)

        setIsLoading(false)

        return () => {
          cancelAnimationFrame(animationFrameId)
          window.removeEventListener("resize", handleResize)
          window.removeEventListener("mousemove", onMouseMove)
          window.removeEventListener("mouseup", onMouseUp)
          renderer.domElement.removeEventListener("mousedown", onMouseDown)
          renderer.domElement.removeEventListener("wheel", onWheel)
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement)
          }
          renderer.dispose()
        }
      } catch (error) {
        console.error("Failed to load Three.js:", error)
        setIsLoading(false)
      }
    }

    const cleanup = initThreeJS()

    return () => {
      cleanup.then((cleanupFn) => {
        if (cleanupFn) cleanupFn()
      })
    }
  }, [])

  const getLayerInfo = () => {
    const layerData: Record<string, { description: string; color: string }> = {
      Troposphere: { description: "0-12 km - Weather layer", color: "text-blue-400" },
      Stratosphere: { description: "12-50 km - Ozone layer", color: "text-cyan-400" },
      Mesosphere: { description: "50-85 km - Meteor layer", color: "text-teal-400" },
      Thermosphere: { description: "85-600 km - Aurora layer", color: "text-green-400" },
      "LEO Zone": { description: "160-2000 km - Low Earth Orbit", color: "text-orange-400" },
    }

    return hoveredLayer ? layerData[hoveredLayer] : null
  }

  const layerInfo = getLayerInfo()

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-[600px] rounded-lg overflow-hidden border border-border bg-black">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading 3D Visualization...</p>
            </div>
          </div>
        )}
      </div>
      {layerInfo && (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 min-w-[250px]">
          <p className={`text-lg font-bold ${layerInfo.color} mb-1`}>{hoveredLayer}</p>
          <p className="text-sm text-gray-300">{layerInfo.description}</p>
        </div>
      )}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
        <p className="text-xs text-cyan-400 mb-2 font-semibold">Controls:</p>
        <p className="text-xs text-gray-300">Drag to rotate</p>
        <p className="text-xs text-gray-300">Scroll to zoom</p>
        <p className="text-xs text-gray-300">Hover over layers</p>
      </div>
    </div>
  )
}
