'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, useGLTF } from '@react-three/drei'
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

      {/* Warm organic lighting — no blue, no sci-fi */}
      <ambientLight intensity={0.55} color="#f5ebe0" />
      <directionalLight position={[2, 5, 4]} intensity={1.8} color="#f0ddd0" />
      <pointLight position={[-3, 1, 3]} intensity={12} color="#e8c8b8" distance={14} />
      <pointLight position={[3, -1, 2]} intensity={8} color="#d4b0a0" distance={12} />
      <pointLight position={[0, -3, 1]} intensity={4} color="#1a0a08" distance={8} />

      <Suspense fallback={<FallbackBrain compact={compact} />}>
        <HeroBrain compact={compact} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={compact ? 0.5 : 0.3}
      />
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
          // Organic brain tissue: pinkish-gray, warm
          color: '#c4907a',
          roughness: 0.78,
          metalness: 0.0,
          clearcoat: 0.08,
          clearcoatRoughness: 0.9,
          emissive: '#3d1208',
          emissiveIntensity: 0.14,
          // Subsurface scattering approximation
          sheen: 0.2,
          sheenColor: new THREE.Color('#e8b090'),
        })
      }
    })
    return clone
  }, [scene])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.14
      groupRef.current.rotation.x = Math.sin(t * 0.16) * 0.05
    }
  })

  return (
    <group ref={groupRef} scale={compact ? 0.88 : 1}>
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.28}>
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
      <mesh position={[0, -1.1, -0.24]} rotation={[0.12, 0, 0]}>
        <cylinderGeometry args={[0.10, 0.07, 0.78, 20]} />
        <meshStandardMaterial color="#8a4838" roughness={0.75} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/cerebro.glb')
