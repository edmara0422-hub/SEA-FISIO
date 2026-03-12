'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export function PneumoHeroScene({ transparent = false }: { transparent?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.6], fov: 34 }} gl={{ alpha: transparent, antialias: true }}>
      {!transparent ? <color attach="background" args={['#040607']} /> : null}
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} color="#dffaff" />
      <pointLight position={[-2, 0, 4]} intensity={11} color="#38bdf8" distance={12} />
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.22}>
        <LungForm />
      </Float>
    </Canvas>
  )
}

function LungForm() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const breath = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.1
    if (groupRef.current) {
      groupRef.current.scale.x = 1 + (breath - 1) * 0.35
      groupRef.current.scale.y = breath
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.18
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[-0.78, 0, 0]} scale={[0.9, 1.25, 0.6]}>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshPhysicalMaterial color="#07202b" roughness={0.34} clearcoat={0.35} emissive="#0b3850" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0.78, 0, 0]} scale={[0.9, 1.25, 0.6]}>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshPhysicalMaterial color="#071f29" roughness={0.34} clearcoat={0.35} emissive="#0a3850" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, 1.08, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.1, 1.35, 20]} />
        <meshStandardMaterial color="#cad4de" roughness={0.56} metalness={0.08} />
      </mesh>
    </group>
  )
}
