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
      camera={{ position: [0, 0, compact ? 5.2 : 6.0], fov: compact ? 38 : 34 }}
      gl={{ alpha: transparent, antialias: true }}
    >
      {!transparent ? <color attach="background" args={['#020a10']} /> : null}
      <fog attach="fog" args={['#030d14', 12, 24]} />

      {/* Medical scanner lighting — teal/cyan dominant */}
      <ambientLight intensity={0.08} color="#0a1a22" />

      {/* Key top light — bright ice blue */}
      <directionalLight position={[1, 6, 4]} intensity={2.8} color="#a0e8ff" />

      {/* Front fill — cool cyan */}
      <directionalLight position={[-2, 1, 5]} intensity={1.4} color="#00d4ff" />

      {/* Rim from below — deep teal silhouette */}
      <pointLight position={[0, -3, -2]} intensity={16} color="#006080" distance={14} />

      {/* Side accent — warm neural orange on left lobe */}
      <pointLight position={[-3, 0.5, 2]} intensity={14} color="#ff7020" distance={12} />

      {/* Back fill — subtle cyan halo */}
      <pointLight position={[0, 1, -4]} intensity={8} color="#00a8d0" distance={14} />

      <Float speed={0.6} rotationIntensity={0.02} floatIntensity={0.12}>
        <BrainMedical compact={compact} />
      </Float>
    </Canvas>
  )
}

// ── Geometry ──────────────────────────────────────────────────────────────────

function shapeBrain(nx: number, ny: number, nz: number): { rx: number; ry: number; rz: number } {
  let rx = 1.36
  let ry = 1.05
  let rz = 1.22

  // Parietal widening
  const parietal = Math.max(0, ny * 0.6 + 0.4) * (1 - nz * nz * 0.5)
  rx += parietal * 0.16

  // Frontal lobe bulge
  const frontal = Math.max(0, nz * 1.2) * Math.max(0, ny * 0.5 + 0.6)
  ry += frontal * 0.12
  rz += frontal * 0.14

  // Temporal lobe — protrudes downward & anteriorly
  const inferiorMask = Math.max(0, -ny * 1.4 - 0.05)
  const lateralMask  = Math.min(1, Math.abs(nx) * 2.0 + 0.3)
  const anteriorMask = Math.max(0, nz * 0.7 + 0.55)
  const temporal = inferiorMask * lateralMask * anteriorMask
  rx += temporal * 0.22
  ry -= temporal * 0.28
  rz += temporal * 0.12

  // Occipital taper
  const occip = Math.max(0, -nz * 1.1)
  rx -= occip * 0.12
  ry -= occip * 0.06

  // Inferior base flatten
  if (ny < -0.35) {
    ry += (ny + 0.35) * 0.55
  }

  // Gyral surface variation (deterministic, no flicker)
  const gyri = Math.sin(nx * 6.1) * Math.sin(ny * 5.3) * Math.sin(nz * 4.7)
  rx += gyri * 0.045
  ry += gyri * 0.04
  rz += gyri * 0.03

  return { rx, ry, rz }
}

function createBrainGeo(detail: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, detail)
  const pos = geo.attributes.position
  const count = pos.count
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const len = Math.sqrt(x * x + y * y + z * z) || 1
    const nx = x / len, ny = y / len, nz = z / len
    const { rx, ry, rz } = shapeBrain(nx, ny, nz)
    pos.setXYZ(i, nx * rx, ny * ry, nz * rz)
  }
  geo.computeVertexNormals()
  return geo
}

function createCerebellumGeo(detail: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, detail)
  const pos = geo.attributes.position
  const count = pos.count
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const len = Math.sqrt(x * x + y * y + z * z) || 1
    const nx = x / len, ny = y / len, nz = z / len
    let rx = 0.78 + Math.abs(nx) * 0.12
    if (Math.abs(nx) < 0.12) rx -= 0.06
    pos.setXYZ(i, nx * rx, ny * 0.44, nz * 0.62)
  }
  geo.computeVertexNormals()
  return geo
}

// ── BrainMedical — HUD style with teal edges + orange lobe accent ─────────────

function BrainMedical({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  const geos = useMemo(() => ({
    brain:      createBrainGeo(2),
    cerebellum: createCerebellumGeo(1),
    stem:       new THREE.CylinderGeometry(0.10, 0.07, 0.55, 6),
  }), [])

  // Dark faces — flat shaded to show facets
  const solidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:            '#040e18',
    roughness:        1.0,
    metalness:        0.0,
    flatShading:      true,
    emissive:         '#012030',
    emissiveIntensity: 0.8,
  }), [])

  // Bright cyan edges — the HUD "scan" look
  const cyanEdge = useMemo(() => new THREE.LineBasicMaterial({
    color:       '#00e5ff',
    transparent: true,
    opacity:     0.75,
  }), [])

  // Dim teal secondary edges for depth
  const dimEdge = useMemo(() => new THREE.LineBasicMaterial({
    color:       '#006888',
    transparent: true,
    opacity:     0.40,
  }), [])

  const edges      = useMemo(() => new THREE.EdgesGeometry(geos.brain),      [geos.brain])
  const cerebEdges = useMemo(() => new THREE.EdgesGeometry(geos.cerebellum), [geos.cerebellum])
  const stemEdges  = useMemo(() => new THREE.EdgesGeometry(geos.stem),       [geos.stem])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.10 + Math.sin(t * 0.25) * 0.12
      groupRef.current.rotation.x = Math.sin(t * 0.17) * 0.04
    }
  })

  const s = compact ? 0.84 : 1.0

  return (
    <group ref={groupRef} scale={s} rotation={[0.10, 0.30, 0]}>

      {/* ── CEREBRAL HEMISPHERES */}
      <mesh geometry={geos.brain} material={solidMat} />
      <lineSegments geometry={edges} material={cyanEdge} />
      <lineSegments geometry={edges} material={dimEdge} />

      {/* ── CEREBELLUM */}
      <group position={[-0.02, -0.96, -0.72]} rotation={[0.18, 0, 0]}>
        <mesh geometry={geos.cerebellum} material={solidMat} />
        <lineSegments geometry={cerebEdges} material={cyanEdge} />
        <lineSegments geometry={cerebEdges} material={dimEdge} />
      </group>

      {/* ── BRAINSTEM */}
      <group position={[0, -1.14, -0.44]} rotation={[0.38, 0, 0]}>
        <mesh geometry={geos.stem} material={solidMat} />
        <lineSegments geometry={stemEdges} material={cyanEdge} />
      </group>

    </group>
  )
}
