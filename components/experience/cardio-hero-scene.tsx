'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export function CardioHeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.3], fov: 34 }}>
      <color attach="background" args={['#050506']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 3]} intensity={1.9} color="#ffe4e6" />
      <pointLight position={[-3, 1, 4]} intensity={14} color="#fb7185" distance={12} />
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.25}>
        <HeartForm />
      </Float>
    </Canvas>
  )
}

function HeartForm() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.8) * 0.08
    if (meshRef.current) {
      meshRef.current.scale.setScalar(pulse)
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.24
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.55) * 0.12
    }
  })

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.25, 3]} />
      <meshPhysicalMaterial
        color="#59111d"
        emissive="#5f1120"
        emissiveIntensity={0.35}
        roughness={0.32}
        metalness={0.02}
        clearcoat={0.45}
        clearcoatRoughness={0.35}
      />
    </mesh>
  )
}
