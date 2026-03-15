'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function BrainHeroScene({
  compact = false,
  transparent = false,
}: {
  compact?: boolean
  transparent?: boolean
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, compact ? 5 : 6.2], fov: compact ? 34 : 30 }}
      gl={{ alpha: transparent, antialias: true }}
    >
      {!transparent ? <color attach="background" args={['#020202']} /> : null}
      <fog attach="fog" args={['#030203', 10, 20]} />

      <ambientLight intensity={0.20} color="#e8d0c8" />
      <directionalLight position={[3, 4, 3]} intensity={2.2} color="#ffe0d0" />
      <directionalLight position={[-2, 1, 2]} intensity={0.7} color="#f0c0b0" />
      <directionalLight position={[0, -1, -3]} intensity={0.9} color="#aa3820" />
      <pointLight position={[0, 0, 1]} intensity={0.8} color="#5a0808" distance={7} />

      <Suspense fallback={<FallbackBrain compact={compact} />}>
        <HeroBrain compact={compact} />
      </Suspense>
    </Canvas>
  )
}

function HeroBrain({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/cerebro.glb')

  // Clone 1: dark solid base — captures the volume and lighting
  const solidScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#1e0f0c',
          roughness: 0.88,
          metalness: 0.0,
          emissive: '#3d0e08',
          emissiveIntensity: 0.22,
        })
      }
    })
    return clone
  }, [scene])

  // Clone 2: wireframe overlay — reveals the gyri topology
  const wireScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: '#c87050',
          wireframe: true,
          transparent: true,
          opacity: 0.30,
        })
      }
    })
    return clone
  }, [scene])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.10 + Math.sin(t * 0.33) * 0.14
      groupRef.current.rotation.x = Math.sin(t * 0.19) * 0.06
      groupRef.current.rotation.z = Math.cos(t * 0.11) * 0.02
    }
  })

  const innerScale = compact ? 1.45 : 1.8

  return (
    <group ref={groupRef} scale={compact ? 0.88 : 1}>
      <Float speed={0.9} rotationIntensity={0.04} floatIntensity={0.28}>
        <group position={[0, 0.1, 0]} rotation={[0.08, Math.PI, 0]} scale={innerScale}>
          {/* Solid dark base */}
          <primitive object={solidScene} />
          {/* Wireframe grid on top */}
          <primitive object={wireScene} />
        </group>
      </Float>
    </group>
  )
}

function FallbackBrain({ compact }: { compact: boolean }) {
  return (
    <group scale={compact ? 0.88 : 1}>
      <mesh position={[-0.92, 0.12, 0]}>
        <sphereGeometry args={[1.28, 48, 48]} />
        <meshPhysicalMaterial color="#1a0d0a" roughness={0.9} metalness={0} emissive="#3a0c08" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.92, 0.12, 0]}>
        <sphereGeometry args={[1.28, 48, 48]} />
        <meshPhysicalMaterial color="#180c09" roughness={0.9} metalness={0} emissive="#3a0c08" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/cerebro.glb')
