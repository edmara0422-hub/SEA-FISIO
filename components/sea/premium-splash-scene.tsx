'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line, Sparkles } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type NodeSpec = {
  position: [number, number, number]
  scale: number
}

type StrandSpec = {
  points: [number, number, number][]
  opacity: number
}

export function PremiumSplashScene() {
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 34 }} gl={{ antialias: true }}>
      <color attach="background" args={['#020202']} />
      <fog attach="fog" args={['#020202', 10, 20]} />
      <ambientLight intensity={0.65} />
      <pointLight position={[-6, 3, 6]} intensity={12} color="#fbfbfd" distance={22} />
      <pointLight position={[6, -2, 6]} intensity={11} color="#dfe3ea" distance={20} />
      <pointLight position={[0, 0, 8]} intensity={7} color="#ffffff" distance={15} />
      <directionalLight position={[0, 3, 4]} intensity={1.4} color="#f3f4f8" />

      <AtmospherePlane />
      <SignalColumn />
      <NeuralCluster side="left" />
      <NeuralCluster side="right" />
      <CrossSignals />
      <Sparkles count={160} scale={[16, 10, 12]} size={1.55} speed={0.22} opacity={0.42} color="#ffffff" />
    </Canvas>
  )
}

function AtmospherePlane() {
  return (
    <group>
      <mesh position={[-4.7, 1.8, -2.4]} rotation={[0.12, 0.42, -0.28]}>
        <planeGeometry args={[5.2, 8.4]} />
        <meshBasicMaterial color="#d7dbe2" transparent opacity={0.06} />
      </mesh>
      <mesh position={[4.8, -1.4, -2.2]} rotation={[-0.1, -0.35, 0.25]}>
        <planeGeometry args={[5.6, 8.8]} />
        <meshBasicMaterial color="#cfd3da" transparent opacity={0.05} />
      </mesh>
      <mesh position={[0, 0, -3.8]} rotation={[0, 0, 0]}>
        <planeGeometry args={[5.8, 9.6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
      </mesh>
    </group>
  )
}

function NeuralCluster({ side }: { side: 'left' | 'right' }) {
  const groupRef = useRef<THREE.Group>(null)
  const nodes = useMemo(() => createClusterNodes(side), [side])
  const strands = useMemo(() => createClusterStrands(side), [side])
  const offset = side === 'left' ? -3.35 : 3.35

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = (side === 'left' ? 1 : -1) * 0.08 + Math.sin(t * 0.18) * 0.08
      groupRef.current.rotation.x = Math.cos(t * 0.22 + (side === 'left' ? 0 : 1)) * 0.05
      groupRef.current.position.y = Math.sin(t * 0.28 + (side === 'left' ? 0 : 0.9)) * 0.12
    }
  })

  return (
    <group ref={groupRef} position={[offset, 0, 0]}>
      {strands.map((strand, index) => (
        <Line
          key={`${side}-strand-${index}`}
          points={strand.points}
          color="#f4f5f8"
          lineWidth={0.85}
          transparent
          opacity={strand.opacity}
        />
      ))}

      {nodes.map((node, index) => (
        <Float
          key={`${side}-node-${index}`}
          speed={1.2 + (index % 5) * 0.12}
          rotationIntensity={0.12}
          floatIntensity={0.24 + (index % 3) * 0.04}
        >
          <group position={node.position}>
            <mesh>
              <sphereGeometry args={[node.scale, 18, 18]} />
              <meshPhysicalMaterial
                color="#f5f6fa"
                roughness={0.18}
                metalness={0.16}
                emissive="#cfd3da"
                emissiveIntensity={0.22}
                clearcoat={0.5}
                clearcoatRoughness={0.22}
              />
            </mesh>
            <mesh scale={1.9}>
              <sphereGeometry args={[node.scale, 12, 12]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  )
}

function SignalColumn() {
  const groupRef = useRef<THREE.Group>(null)
  const particles = useMemo(() => createColumnParticles(), [])
  const ribbons = useMemo(() => createColumnRibbons(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {ribbons.map((points, index) => (
        <Line
          key={`ribbon-${index}`}
          points={points}
          color="#fafbfd"
          lineWidth={index === 1 ? 0.9 : 0.75}
          transparent
          opacity={index === 1 ? 0.26 : 0.18}
        />
      ))}

      {particles.map((particle, index) => (
        <Float
          key={`column-${index}`}
          speed={1 + (index % 4) * 0.14}
          rotationIntensity={0.08}
          floatIntensity={0.22}
        >
          <mesh position={particle.position} scale={particle.scale}>
            <icosahedronGeometry args={[0.08, 1]} />
            <meshStandardMaterial
              color="#f7f8fb"
              emissive="#d4d7dd"
              emissiveIntensity={0.24}
              roughness={0.32}
              metalness={0.08}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function CrossSignals() {
  const groupRef = useRef<THREE.Group>(null)
  const arcs = useMemo(
    () => [
      [
        [-5.8, 1.1, -2.6],
        [-2.4, 0.8, -0.8],
        [1.4, 1.2, -0.2],
        [5.6, 0.6, -1.9],
      ],
      [
        [-5.4, -1.4, -2.1],
        [-1.8, -1.0, -0.5],
        [1.6, -1.2, -0.4],
        [5.8, -0.9, -1.8],
      ],
      [
        [-4.8, 2.3, -3.2],
        [-1.4, 1.1, -1.6],
        [1.9, 1.6, -1.4],
        [4.7, 2.5, -3.1],
      ],
    ] as [number, number, number][][],
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.12) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {arcs.map((points, index) => (
        <Line
          key={`cross-${index}`}
          points={points}
          color="#eef1f7"
          lineWidth={0.6}
          transparent
          opacity={index === 2 ? 0.12 : 0.18}
        />
      ))}
    </group>
  )
}

function createClusterNodes(side: 'left' | 'right'): NodeSpec[] {
  const direction = side === 'left' ? -1 : 1

  return Array.from({ length: 17 }, (_, index) => {
    const row = Math.floor(index / 4)
    const col = index % 4
    const x = direction * (0.25 + col * 0.62 + (row % 2) * 0.18)
    const y = 2.2 - row * 1.08 + (col % 2) * 0.18
    const z = -0.6 + ((index * 7) % 5) * 0.34

    return {
      position: [x, y, z] as [number, number, number],
      scale: 0.055 + ((index * 3) % 5) * 0.012,
    }
  })
}

function createClusterStrands(side: 'left' | 'right'): StrandSpec[] {
  const direction = side === 'left' ? -1 : 1

  return [
    {
      points: [
        [direction * 0.2, 2.45, -0.9],
        [direction * 0.85, 1.55, -0.1],
        [direction * 1.5, 0.9, 0.55],
        [direction * 2.35, 0.2, 0.24],
      ],
      opacity: 0.24,
    },
    {
      points: [
        [direction * 0.44, 1.6, -0.4],
        [direction * 1.3, 0.7, -0.25],
        [direction * 1.75, -0.15, 0.42],
        [direction * 2.55, -0.95, 0.18],
      ],
      opacity: 0.18,
    },
    {
      points: [
        [direction * 0.3, 0.6, 0.65],
        [direction * 1.05, -0.15, 0.18],
        [direction * 1.65, -0.95, -0.3],
        [direction * 2.48, -1.95, 0.22],
      ],
      opacity: 0.16,
    },
    {
      points: [
        [direction * 0.52, -0.4, -0.52],
        [direction * 1.32, -1.15, -0.12],
        [direction * 2.05, -1.8, 0.38],
        [direction * 2.68, -2.55, -0.16],
      ],
      opacity: 0.14,
    },
  ]
}

function createColumnParticles() {
  return Array.from({ length: 24 }, (_, index) => {
    const row = Math.floor(index / 6)
    const col = index % 6
    return {
      position: [
        -0.65 + col * 0.26 + (row % 2) * 0.06,
        2.1 - row * 1.2 + Math.sin(index * 1.2) * 0.18,
        -0.8 + (index % 5) * 0.28,
      ] as [number, number, number],
      scale: 0.72 + (index % 3) * 0.1,
    }
  })
}

function createColumnRibbons() {
  return [
    [
      [-0.95, 2.7, -1.6],
      [-0.55, 1.15, -0.5],
      [-0.2, -0.1, 0.15],
      [0.4, -1.4, -0.22],
      [0.86, -2.8, 0.18],
    ],
    [
      [0.78, 2.55, -1.2],
      [0.22, 1.18, -0.35],
      [-0.15, -0.18, 0.12],
      [-0.45, -1.32, -0.08],
      [-0.85, -2.75, 0.1],
    ],
    [
      [-0.15, 2.85, -1.9],
      [0.08, 1.42, -0.8],
      [0.04, 0.1, 0],
      [-0.06, -1.3, 0.3],
      [0.18, -2.9, -0.12],
    ],
  ] as [number, number, number][][]
}
