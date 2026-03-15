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
      {!transparent ? <color attach="background" args={['#040506']} /> : null}
      <fog attach="fog" args={['#050304', 9, 16]} />

      {/* Warm organic lighting */}
      <ambientLight intensity={0.55} color="#f5ebe0" />
      <directionalLight position={[2, 5, 4]} intensity={1.8} color="#f0ddd0" />
      <pointLight position={[-3, 1, 3]} intensity={12} color="#e8c8b8" distance={14} />
      <pointLight position={[3, -1, 2]} intensity={8} color="#d4b0a0" distance={12} />
      <pointLight position={[0, -3, 1]} intensity={4} color="#1a0a08" distance={8} />

      <Suspense fallback={<FallbackBrain compact={compact} />}>
        <HeroBrain compact={compact} />
      </Suspense>
    </Canvas>
  )
}

function HeroBrain({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/cerebro.glb')

  const brainScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#c08070',
          roughness: 0.82,
          metalness: 0.0,
          clearcoat: 0.05,
          clearcoatRoughness: 0.95,
          emissive: '#3d1208',
          emissiveIntensity: 0.16,
          sheen: 0.25,
          sheenColor: new THREE.Color('#e8a888'),
        })
      }
    })
    return clone
  }, [scene])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      // Organic rotation — not mechanical. Mostly slow continuous but with a subtle drift
      groupRef.current.rotation.y = t * 0.10 + Math.sin(t * 0.37) * 0.12
      groupRef.current.rotation.x = Math.sin(t * 0.19) * 0.06
      groupRef.current.rotation.z = Math.sin(t * 0.13) * 0.02
    }
  })

  return (
    <group ref={groupRef} scale={compact ? 0.88 : 1}>
      <Float speed={1.0} rotationIntensity={0.06} floatIntensity={0.30}>
        <group position={[0, 0.1, 0]} rotation={[0.08, Math.PI, 0]} scale={compact ? 1.45 : 1.8}>
          <primitive object={brainScene} />
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
        <meshPhysicalMaterial color="#b07868" roughness={0.8} metalness={0} emissive="#2a0a06" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0.92, 0.12, 0]}>
        <sphereGeometry args={[1.28, 48, 48]} />
        <meshPhysicalMaterial color="#ac7464" roughness={0.8} metalness={0} emissive="#2a0a06" emissiveIntensity={0.18} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/cerebro.glb')
