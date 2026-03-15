'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
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
      camera={{ position: [0, 0, compact ? 4.8 : 5.6], fov: compact ? 42 : 38 }}
      gl={{ alpha: transparent, antialias: true }}
    >
      {!transparent ? <color attach="background" args={['#07080f']} /> : null}
      <fog attach="fog" args={['#09090f', 12, 22]} />

      {/* Top key — bright white-silver */}
      <directionalLight position={[2, 6, 4]} intensity={3.8} color="#ffffff" />

      {/* Front cool fill */}
      <directionalLight position={[-2, 1, 4]} intensity={1.2} color="#d4c8ff" />

      {/* Rim from below — indigo-purple */}
      <pointLight position={[0, -3, -2]} intensity={14} color="#5040a0" distance={14} />

      {/* Accent — warm indigo side */}
      <pointLight position={[-3, 0.5, 2]} intensity={10} color="#8060d0" distance={12} />

      {/* Very subtle ambient */}
      <ambientLight intensity={0.05} color="#0c0c14" />

      <Float speed={0.7} rotationIntensity={0.03} floatIntensity={0.14}>
        <BrainLowPoly compact={compact} />
      </Float>
    </Canvas>
  )
}

// ── Geometry ──────────────────────────────────────────────────────────────────

function shapeBrain(_nx: number, ny: number, nz: number): { rx: number; ry: number; rz: number } {
  let rx = 1.30, ry = 1.00, rz = 1.18

  // Parietal widening
  const parietal = Math.max(0, ny * 0.7 + 0.3) * (1 - nz * nz * 0.4)
  rx += parietal * 0.18

  // Frontal bulge
  const frontal = Math.max(0, nz) * Math.max(0, ny * 0.4 + 0.6)
  ry += frontal * 0.10; rz += frontal * 0.16

  // Temporal lobe — pull down-forward
  const tI = Math.max(0, -ny - 0.05)
  const tA = Math.max(0, nz * 0.9 + 0.40)
  const temporal = tI * tA
  rx += temporal * 0.24; ry -= temporal * 0.40; rz += temporal * 0.14

  // Occipital taper
  const occip = Math.max(0, -nz)
  rx -= occip * 0.12; ry -= occip * 0.06

  // Base flatten
  if (ny < -0.30) ry += (ny + 0.30) * 0.55

  // Gyri bumps
  const gyri = Math.sin(nz * 5.8) * Math.sin(ny * 4.9)
  rx += gyri * 0.05; ry += gyri * 0.045; rz += gyri * 0.03

  return { rx, ry, rz }
}

function createBrainGeo(detail: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, detail)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const len = Math.sqrt(x*x + y*y + z*z) || 1
    const { rx, ry, rz } = shapeBrain(x/len, y/len, z/len)
    pos.setXYZ(i, (x/len)*rx, (y/len)*ry, (z/len)*rz)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

function createCerebellumGeo(detail: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, detail)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const len = Math.sqrt(x*x + y*y + z*z) || 1
    let rx = 0.76 + Math.abs(x/len) * 0.12
    if (Math.abs(x/len) < 0.12) rx -= 0.06
    pos.setXYZ(i, (x/len)*rx, (y/len)*0.44, (z/len)*0.60)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

// ── Component ─────────────────────────────────────────────────────────────────

function BrainLowPoly({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  const geos = useMemo(() => ({
    brain:      createBrainGeo(2),
    cerebellum: createCerebellumGeo(1),
    stem:       new THREE.CylinderGeometry(0.10, 0.07, 0.52, 6),
  }), [])

  // Dark flat-shaded faces — catch directional light for bright/dark facets
  const solidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:            '#080a14',
    roughness:        1.0,
    metalness:        0.0,
    flatShading:      true,
    emissive:         '#050610',
    emissiveIntensity: 1.0,
  }), [])

  // White/silver edges — bright on top where key light hits
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({
    color: '#d8d0f8', transparent: true, opacity: 0.78,
  }), [])

  // Dim indigo secondary edges
  const dimEdge = useMemo(() => new THREE.LineBasicMaterial({
    color: '#5848a0', transparent: true, opacity: 0.32,
  }), [])

  const edges      = useMemo(() => new THREE.EdgesGeometry(geos.brain),      [geos.brain])
  const cerebEdges = useMemo(() => new THREE.EdgesGeometry(geos.cerebellum), [geos.cerebellum])
  const stemEdges  = useMemo(() => new THREE.EdgesGeometry(geos.stem),       [geos.stem])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.11 + Math.sin(t * 0.26) * 0.10
      groupRef.current.rotation.x = Math.sin(t * 0.17) * 0.04
    }
  })

  const s = compact ? 0.86 : 1.0

  return (
    <group ref={groupRef} scale={s} rotation={[0.08, 0.28, 0]} position={[0, 0.15, 0]}>

      {/* Cerebral hemispheres */}
      <mesh geometry={geos.brain} material={solidMat} />
      <lineSegments geometry={edges} material={edgeMat} />
      <lineSegments geometry={edges} material={dimEdge} />

      {/* Cerebellum */}
      <group position={[-0.02, -0.94, -0.68]} rotation={[0.18, 0, 0]}>
        <mesh geometry={geos.cerebellum} material={solidMat} />
        <lineSegments geometry={cerebEdges} material={edgeMat} />
        <lineSegments geometry={cerebEdges} material={dimEdge} />
      </group>

      {/* Brainstem */}
      <group position={[0, -1.12, -0.42]} rotation={[0.36, 0, 0]}>
        <mesh geometry={geos.stem} material={solidMat} />
        <lineSegments geometry={stemEdges} material={edgeMat} />
      </group>

    </group>
  )
}
