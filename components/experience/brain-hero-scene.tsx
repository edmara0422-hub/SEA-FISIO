'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line, OrbitControls, useGLTF } from '@react-three/drei'
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
      <fog attach="fog" args={['#040506', 8, 14]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#eef4ff" />
      <pointLight position={[-4, 0, 4]} intensity={14} color="#dfe9f7" distance={12} />
      <pointLight position={[4, -2, 4]} intensity={10} color="#bfc9d9" distance={12} />
      <Suspense fallback={<FallbackBrain compact={compact} />}>
        <HeroBrain compact={compact} />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={compact ? 0.6 : 0.4} />
    </Canvas>
  )
}

function HeroBrain({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/cerebro.glb')
  const brainScene = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#ccd2dc',
          roughness: 0.42,
          metalness: 0.05,
          clearcoat: 0.38,
          clearcoatRoughness: 0.35,
          emissive: '#1a1f29',
          emissiveIntensity: 0.12,
        })
      }
    })

    return clone
  }, [scene])

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
        <group position={[0, 0.1, 0]} rotation={[0.08, Math.PI, 0]} scale={compact ? 1.45 : 1.8}>
          <primitive object={brainScene} />
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

function FallbackBrain({ compact }: { compact: boolean }) {
  return (
    <group scale={compact ? 0.88 : 1}>
      <mesh position={[-1.0, 0.15, 0]}>
        <sphereGeometry args={[1.35, 64, 64]} />
        <meshPhysicalMaterial color="#161a23" roughness={0.46} clearcoat={0.3} emissive="#10141c" emissiveIntensity={0.16} />
      </mesh>
      <mesh position={[1.0, 0.15, 0]}>
        <sphereGeometry args={[1.35, 64, 64]} />
        <meshPhysicalMaterial color="#151922" roughness={0.46} clearcoat={0.3} emissive="#10141c" emissiveIntensity={0.16} />
      </mesh>
      <mesh position={[0, -1.05, -0.28]} rotation={[0.14, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.08, 0.85, 22]} />
        <meshStandardMaterial color="#151821" roughness={0.7} metalness={0.03} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/cerebro.glb')
