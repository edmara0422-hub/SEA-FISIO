'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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
      camera={{ position: [0, 0, compact ? 4.8 : 5.6], fov: compact ? 40 : 36 }}
      gl={{ alpha: transparent, antialias: true }}
    >
      {!transparent ? <color attach="background" args={['#07080f']} /> : null}

      {/* Strong key light from top — makes top edges appear white/bright */}
      <directionalLight position={[1.5, 6, 3]} intensity={4.5} color="#ffffff" />

      {/* Fill — cool blue-grey from left */}
      <directionalLight position={[-3, 1, 2]} intensity={1.8} color="#8899cc" />

      {/* Rim from below — deep blue */}
      <pointLight position={[0, -3, -2]} intensity={8} color="#1133aa" distance={14} />

      {/* Subtle ambient */}
      <ambientLight intensity={0.06} color="#080818" />

      <BrainLowPoly compact={compact} />
    </Canvas>
  )
}

// ── Geometry helpers ───────────────────────────────────────────────────────────

function shapeBrain(nx: number, ny: number, nz: number) {
  // Base shape — wider than tall (cerebral hemispheres proportions)
  let rx = 1.28, ry = 1.00, rz = 1.16

  // Parietal widening — top sides are wide
  rx += Math.max(0, ny * 0.6 + 0.4) * (1 - nz * nz * 0.3) * 0.22

  // Frontal lobe — bulges forward (positive Z in our coord)
  const frontalMask = Math.max(0, nz) * Math.max(0, ny * 0.3 + 0.7)
  rz += frontalMask * 0.20
  ry += frontalMask * 0.08

  // Temporal lobe — hangs down and slightly forward
  // Strong downward protrusion on the sides
  const temporalMask = Math.max(0, -ny - 0.10) * Math.max(0, nz * 0.8 + 0.35)
  rx += temporalMask * 0.28
  ry -= temporalMask * 0.48   // pull down
  rz += temporalMask * 0.12

  // Occipital taper — narrower at back
  const occipMask = Math.max(0, -nz - 0.1)
  rx -= occipMask * 0.16
  ry -= occipMask * 0.08

  // Flatten the bottom (below temporal)
  if (ny < -0.35) ry += (ny + 0.35) * 0.60

  // Slight interhemispheric groove — narrow medial band top
  if (Math.abs(nx) < 0.08 && ny > 0.2) rx -= 0.06

  return { rx, ry, rz }
}

function createBrainGeo(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, 2)   // 320 triangles — clearly low-poly
  const pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const len = Math.sqrt(x * x + y * y + z * z) || 1
    const nx = x / len, ny = y / len, nz = z / len
    const { rx, ry, rz } = shapeBrain(nx, ny, nz)
    pos.setXYZ(i, nx * rx, ny * ry, nz * rz)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

function createCerebellumGeo(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, 1)   // 80 triangles
  const pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const len = Math.sqrt(x * x + y * y + z * z) || 1
    const nx = x / len, ny = y / len, nz = z / len
    // Bilobed flattened oval
    let rx = 0.72 + Math.abs(nx) * 0.12
    if (Math.abs(nx) < 0.12) rx -= 0.08   // central groove
    pos.setXYZ(i, nx * rx, ny * 0.42, nz * 0.58)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

// ── Component ──────────────────────────────────────────────────────────────────

function BrainLowPoly({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  const geos = useMemo(() => ({
    brain:      createBrainGeo(),
    cerebellum: createCerebellumGeo(),
    stem:       new THREE.CylinderGeometry(0.09, 0.06, 0.50, 6),
  }), [])

  // Dark flat-shaded material — each triangle face clearly visible
  const solidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:             '#06080f',
    roughness:         1.0,
    metalness:         0.0,
    flatShading:       true,     // CRITICAL — shows individual triangular facets
    emissive:          new THREE.Color('#030510'),
    emissiveIntensity: 1.0,
  }), [])

  // White/silver edges — bright on lit top surface
  const whiteEdgeMat = useMemo(() => new THREE.LineBasicMaterial({
    color:       '#d4dff0',
    transparent: true,
    opacity:     0.88,
  }), [])

  // Blue edges — fills shadow areas with blue electric glow
  const blueEdgeMat = useMemo(() => new THREE.LineBasicMaterial({
    color:       '#2244cc',
    transparent: true,
    opacity:     0.50,
  }), [])

  const edges = useMemo(() => new THREE.EdgesGeometry(geos.brain), [geos.brain])
  const cerebEdges = useMemo(() => new THREE.EdgesGeometry(geos.cerebellum), [geos.cerebellum])

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime
      groupRef.current.rotation.y = t * 0.20
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.04
    }
  })

  const s = compact ? 0.86 : 1.00

  return (
    <group ref={groupRef} scale={s} rotation={[0.06, 0.30, 0]} position={[0, 0.10, 0]}>

      {/* Cerebral hemispheres — solid flat */}
      <mesh geometry={geos.brain} material={solidMat} />
      {/* White edges */}
      <lineSegments geometry={edges} material={whiteEdgeMat} />
      {/* Blue edge overlay */}
      <lineSegments geometry={edges} material={blueEdgeMat} />

      {/* Cerebellum */}
      <group position={[-0.02, -0.96, -0.64]} rotation={[0.16, 0, 0]}>
        <mesh geometry={geos.cerebellum} material={solidMat} />
        <lineSegments geometry={cerebEdges} material={whiteEdgeMat} />
        <lineSegments geometry={cerebEdges} material={blueEdgeMat} />
      </group>

      {/* Brainstem */}
      <group position={[0, -1.12, -0.38]} rotation={[0.38, 0, 0]}>
        <mesh geometry={geos.stem} material={solidMat} />
      </group>

    </group>
  )
}
