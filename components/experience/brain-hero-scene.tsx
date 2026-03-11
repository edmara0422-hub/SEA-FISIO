'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line, OrbitControls } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function BrainHeroScene({ compact = false }: { compact?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, compact ? 5.2 : 6.5], fov: compact ? 34 : 30 }}>
      <color attach="background" args={['#040506']} />
      <fog attach="fog" args={['#040506', 8, 14]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#eef4ff" />
      <pointLight position={[-4, 0, 4]} intensity={18} color="#6ea5ff" distance={12} />
      <pointLight position={[4, -2, 4]} intensity={14} color="#9f7aea" distance={12} />
      <HeroBrain compact={compact} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={compact ? 0.6 : 0.4} />
    </Canvas>
  )
}

function HeroBrain({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Group>(null)

  const arcs = useMemo(
    () => [
      [
        [-2.2, 0.2, -0.6],
        [-1.0, 1.5, 0.2],
        [0.2, 1.0, 0.7],
        [1.9, 0.1, 0.3],
      ],
      [
        [-1.8, -0.4, 0.8],
        [-0.5, -1.3, 0.4],
        [0.8, -0.8, -0.4],
        [2.0, 0.4, -0.7],
      ],
      [
        [-1.6, 0.8, -0.9],
        [-0.4, 0.2, -1.4],
        [0.9, -0.3, -0.7],
        [1.7, 0.3, 0.2],
      ],
    ],
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.18
      groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.06
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.12
    }
  })

  return (
    <group ref={groupRef} scale={compact ? 0.88 : 1}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.35}>
        <group>
          <mesh position={[-1.0, 0.15, 0]}>
            <sphereGeometry args={[1.35, 64, 64]} />
            <meshPhysicalMaterial
              color="#161a23"
              roughness={0.46}
              metalness={0.02}
              transmission={0.04}
              thickness={0.4}
              clearcoat={0.3}
              clearcoatRoughness={0.5}
              sheen={0.5}
              sheenColor="#dce7ff"
              emissive="#0a1020"
              emissiveIntensity={0.18}
            />
          </mesh>
          <mesh position={[1.0, 0.15, 0]}>
            <sphereGeometry args={[1.35, 64, 64]} />
            <meshPhysicalMaterial
              color="#151922"
              roughness={0.48}
              metalness={0.02}
              transmission={0.04}
              thickness={0.4}
              clearcoat={0.3}
              clearcoatRoughness={0.5}
              sheen={0.45}
              sheenColor="#e9edff"
              emissive="#110a1f"
              emissiveIntensity={0.18}
            />
          </mesh>
          <mesh position={[0, -1.05, -0.28]} rotation={[0.14, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.08, 0.85, 22]} />
            <meshStandardMaterial color="#151821" roughness={0.7} metalness={0.03} />
          </mesh>

          <mesh position={[-1.0, 0.15, 0]} scale={[1.01, 1.02, 1.01]}>
            <sphereGeometry args={[1.35, 32, 32]} />
            <meshBasicMaterial color="#cfdcff" wireframe transparent opacity={0.16} />
          </mesh>
          <mesh position={[1.0, 0.15, 0]} scale={[1.01, 1.02, 1.01]}>
            <sphereGeometry args={[1.35, 32, 32]} />
            <meshBasicMaterial color="#f3f5ff" wireframe transparent opacity={0.15} />
          </mesh>
        </group>
      </Float>

      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2.5, 0.3, 0.1]}>
          <torusGeometry args={[3.35, 0.018, 16, 220]} />
          <meshBasicMaterial color="#8ab4ff" transparent opacity={0.42} />
        </mesh>
        <mesh rotation={[Math.PI / 2.9, -0.2, 0.5]}>
          <torusGeometry args={[3.85, 0.012, 16, 220]} />
          <meshBasicMaterial color="#d7dfff" transparent opacity={0.26} />
        </mesh>
      </group>

      {arcs.map((points, index) => (
        <Line
          key={index}
          points={points as [number, number, number][]}
          color={index === 1 ? '#9f7aea' : '#8ab4ff'}
          lineWidth={1.4}
          transparent
          opacity={0.8}
        />
      ))}
    </group>
  )
}
