'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type PointCloudProps = {
  positions: Float32Array
  color: string
  size: number
  opacity: number
}

export function PremiumSplashScene() {
  return (
    <div aria-hidden className="absolute inset-0">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 42 }}>
        <color attach="background" args={['#010101']} />
        <fog attach="fog" args={['#010101', 8, 18]} />
        <ambientLight intensity={0.42} />
        <pointLight position={[0, 0, 6]} intensity={12} color="#ffffff" distance={14} />
        <pointLight position={[-4, 2, 3]} intensity={6} color="#d9d9d9" distance={10} />
        <pointLight position={[4, -2, 3]} intensity={5} color="#9a9a9a" distance={10} />

        <SplashRig />
      </Canvas>
    </div>
  )
}

function SplashRig() {
  const rigRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (!rigRef.current) {
      return
    }

    rigRef.current.rotation.y = Math.sin(t * 0.16) * 0.1
    rigRef.current.rotation.x = Math.cos(t * 0.11) * 0.025
    rigRef.current.position.y = Math.sin(t * 0.24) * 0.08
  })

  return (
    <group ref={rigRef}>
      <AmbientDust />
      <HemisphereCloud side={-1} />
      <HemisphereCloud side={1} />
      <PulseAxis />
      <SideGlow side={-1} />
      <SideGlow side={1} />
    </group>
  )
}

function HemisphereCloud({ side }: { side: -1 | 1 }) {
  const groupRef = useRef<THREE.Group>(null)
  const cloud = useMemo(() => buildHemisphereCloud(side), [side])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (!groupRef.current) {
      return
    }

    groupRef.current.rotation.y = side * 0.2 + Math.sin(t * 0.18 + side) * 0.035
    groupRef.current.rotation.z = Math.cos(t * 0.14 + side) * 0.02
  })

  return (
    <group ref={groupRef}>
      <PointCloud positions={cloud.soft} color="#bfbfbf" size={0.052} opacity={0.3} />
      <PointCloud positions={cloud.bright} color="#f6f6f6" size={0.075} opacity={0.92} />
    </group>
  )
}

function AmbientDust() {
  const particles = useMemo(() => buildAmbientDust(), [])

  return (
    <>
      <PointCloud positions={particles.wide} color="#a6a6a6" size={0.036} opacity={0.16} />
      <PointCloud positions={particles.center} color="#ececec" size={0.045} opacity={0.1} />
    </>
  )
}

function PulseAxis() {
  return (
    <group>
      <mesh position={[-0.08, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 6.4, 18]} />
        <meshBasicMaterial color="#d8d8d8" transparent opacity={0.08} />
      </mesh>
      <mesh position={[0.08, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 6.4, 18]} />
        <meshBasicMaterial color="#d8d8d8" transparent opacity={0.08} />
      </mesh>

      {Array.from({ length: 12 }).map((_, index) => (
        <PulseNode key={index} index={index} />
      ))}
    </group>
  )
}

function PulseNode({ index }: { index: number }) {
  const nodeRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const x = ((index % 4) - 1.5) * 0.075
  const z = (index % 2 === 0 ? -1 : 1) * 0.07
  const offset = index * 0.16
  const speed = 0.17 + (index % 3) * 0.03

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    const phase = ((t % 1) + 1) % 1
    const y = phase * 6.8 - 3.4
    const glow = Math.sin(phase * Math.PI)

    if (nodeRef.current) {
      nodeRef.current.position.set(x, y, z)
      nodeRef.current.scale.setScalar(0.75 + glow * 0.9)
    }

    if (materialRef.current) {
      materialRef.current.opacity = 0.2 + glow * 0.62
    }
  })

  return (
    <mesh ref={nodeRef} position={[x, 0, z]}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshBasicMaterial ref={materialRef} color="#ffffff" transparent opacity={0.5} />
    </mesh>
  )
}

function SideGlow({ side }: { side: -1 | 1 }) {
  return (
    <mesh position={[side * 4.8, 0, -3.8]} scale={[1.9, 1.2, 1.9]}>
      <sphereGeometry args={[1.1, 24, 24]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.022} />
    </mesh>
  )
}

function PointCloud({ positions, color, size, opacity }: PointCloudProps) {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function buildHemisphereCloud(side: -1 | 1) {
  const soft: number[] = []
  const bright: number[] = []

  for (let i = 0; i < 180; i += 1) {
    const height = -1 + ((i % 18) / 17) * 2
    const phi = height * (Math.PI / 2)
    const ring = Math.pow(Math.cos(phi), 0.82)
    const theta = (i * 0.73) % (Math.PI * 2)
    const spreadX = 0.34 + ring * 1.38
    const spreadZ = 0.18 + ring * 1.08
    const centerX = side * (1.04 + (1 - ring) * 0.2)
    const jitter = Math.sin(i * 1.37) * 0.045
    const x = centerX + side * Math.cos(theta) * spreadX * 0.44 + side * jitter
    const y = Math.sin(phi) * 2.18 + Math.cos(theta * 3) * 0.05
    const z = Math.sin(theta) * spreadZ + Math.cos(i * 0.41) * 0.04

    soft.push(x, y, z)

    if (i % 3 === 0 || (i + 1) % 11 === 0) {
      bright.push(x, y, z)
    }
  }

  return {
    soft: new Float32Array(soft),
    bright: new Float32Array(bright),
  }
}

function buildAmbientDust() {
  const wide: number[] = []
  const center: number[] = []

  for (let i = 0; i < 180; i += 1) {
    const angle = i * 0.41
    const radius = 3.4 + (i % 9) * 0.48
    const x = Math.cos(angle) * radius
    const y = Math.sin(i * 0.31) * 3.2
    const z = -4.4 + (i % 13) * 0.48
    wide.push(x, y, z)
  }

  for (let i = 0; i < 90; i += 1) {
    const angle = i * 0.62
    const radius = 0.9 + (i % 7) * 0.22
    const x = Math.cos(angle) * radius
    const y = Math.sin(i * 0.38) * 2.4
    const z = -2.2 + (i % 5) * 0.35
    center.push(x, y, z)
  }

  return {
    wide: new Float32Array(wide),
    center: new Float32Array(center),
  }
}
