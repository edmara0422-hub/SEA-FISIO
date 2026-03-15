'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function CardioHeroScene({ transparent = false }: { transparent?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.8], fov: 32 }} gl={{ alpha: transparent, antialias: true }}>
      {!transparent ? <color attach="background" args={['#050304']} /> : null}
      <fog attach="fog" args={['#060304', 10, 18]} />

      {/* Rich anatomical lighting — deep reds, warm highlights */}
      <ambientLight intensity={0.32} color="#f5e0e0" />
      <directionalLight position={[1.5, 5, 4]} intensity={2.4} color="#ffe4e4" />
      <pointLight position={[-3, 1, 3.5]} intensity={26} color="#cc1020" distance={14} />
      <pointLight position={[3, -1, 3]} intensity={18} color="#ff3040" distance={12} />
      <pointLight position={[0, -4, 1]} intensity={8} color="#880010" distance={10} />
      <pointLight position={[0, 3, -1]} intensity={6} color="#aa1525" distance={10} />

      <Float speed={1.5} rotationIntensity={0.06} floatIntensity={0.18}>
        <HeartForm />
      </Float>
    </Canvas>
  )
}

// Heartbeat: fast systole, slow diastole at ~68 BPM
function heartbeatPulse(t: number): number {
  const period = 0.88
  const ph = (t % period) / period
  if (ph < 0.12) return 1 - (ph / 0.12) * 0.12       // fast compress
  if (ph < 0.28) return 0.88 + ((ph - 0.12) / 0.16) * 0.12 // elastic rebound
  return 1                                              // diastole rest
}

function HeartForm() {
  const groupRef = useRef<THREE.Group>(null)

  // 3D heart built from a proper 2D heart curve extruded with aggressive beveling
  // High bevelSegments turns the flat extrusion into a rounded 3D solid
  const heartGeo = useMemo(() => {
    const s = new THREE.Shape()

    // Classic anatomical heart silhouette with proper proportions
    s.moveTo(0, 0.28)
    s.bezierCurveTo(0.02, 0.92, -0.98, 1.04, -0.98, 0.26)
    s.bezierCurveTo(-0.98, -0.28, -0.40, -0.70, 0, -1.18)
    s.bezierCurveTo(0.40, -0.70, 0.98, -0.28, 0.98, 0.26)
    s.bezierCurveTo(0.98, 1.04, -0.02, 0.92, 0, 0.28)

    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 1.05,
      bevelEnabled: true,
      bevelSegments: 18,      // HIGH — rounds all edges into a near-spherical puff
      steps: 1,
      bevelSize: 0.26,        // HIGH — pushes edges outward into a pillow shape
      bevelThickness: 0.28,   // HIGH — thickness of the rounded bevel cap
      curveSegments: 56,
    })
    geo.center()
    return geo
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const p = heartbeatPulse(t)

    if (groupRef.current) {
      // Gentle anatomical rotation — heart tilted as in real anatomy
      groupRef.current.rotation.y = Math.sin(t * 0.22) * 0.28 + 0.18
      groupRef.current.rotation.x = Math.sin(t * 0.17) * 0.08 + 0.12
      // Uniform pulse — whole heart contracts and releases
      groupRef.current.scale.setScalar(p)
    }
  })

  return (
    // Anatomical tilt: apex down-left, base up-right
    <group ref={groupRef} rotation={[0.18, 0.20, -0.14]}>
      {/* Main heart body */}
      <mesh geometry={heartGeo}>
        <meshPhysicalMaterial
          color="#731520"
          roughness={0.72}
          metalness={0.0}
          clearcoat={0.08}
          clearcoatRoughness={0.92}
          emissive="#3a0608"
          emissiveIntensity={0.30}
          sheen={0.28}
          sheenColor={new THREE.Color('#cc2535')}
        />
      </mesh>

      {/* Aorta — arches up from the base */}
      <mesh position={[-0.08, 1.32, 0.10]} rotation={[0.06, 0, 0.20]}>
        <cylinderGeometry args={[0.14, 0.17, 0.70, 22]} />
        <meshPhysicalMaterial color="#8a1c28" roughness={0.68} metalness={0.0} emissive="#2e0608" emissiveIntensity={0.22} />
      </mesh>
      {/* Aortic arch */}
      <mesh position={[0.28, 1.62, 0.08]} rotation={[0.05, 0.12, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.14, 0.54, 20]} />
        <meshPhysicalMaterial color="#8a1c28" roughness={0.68} metalness={0.0} emissive="#2e0608" emissiveIntensity={0.22} />
      </mesh>

      {/* Pulmonary trunk */}
      <mesh position={[0.46, 1.28, 0.22]} rotation={[0.12, 0, -0.24]}>
        <cylinderGeometry args={[0.10, 0.12, 0.60, 18]} />
        <meshPhysicalMaterial color="#7a1620" roughness={0.70} metalness={0.0} emissive="#280506" emissiveIntensity={0.18} />
      </mesh>

      {/* Superior vena cava */}
      <mesh position={[0.62, 1.18, -0.04]} rotation={[0, 0, 0.14]}>
        <cylinderGeometry args={[0.08, 0.09, 0.50, 16]} />
        <meshPhysicalMaterial color="#5a1018" roughness={0.74} metalness={0.0} emissive="#200406" emissiveIntensity={0.14} />
      </mesh>
    </group>
  )
}
