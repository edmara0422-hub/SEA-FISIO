'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
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
      camera={{ position: [0, 0, compact ? 3.8 : 4.4], fov: compact ? 46 : 42 }}
      gl={{ alpha: transparent, antialias: true }}
    >
      {!transparent ? <color attach="background" args={['#07080f']} /> : null}
      {/* Strong key from top-right — white hot on top edges */}
      <directionalLight position={[3, 8, 2]}  intensity={7.0} color="#ffffff" />
      {/* Softer fill from front-left */}
      <directionalLight position={[-2, 2, 4]} intensity={1.0} color="#8899cc" />
      {/* Blue rim from below — creates blue glow on shadow edges */}
      <pointLight position={[0, -5, -1]} intensity={16} color="#1133bb" distance={20} />
      <ambientLight intensity={0.04} color="#050815" />
      <BrainModel compact={compact} />
    </Canvas>
  )
}

// Pre-load for faster first render
useGLTF.preload('/brain.glb')

function BrainModel({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/brain.glb')

  // Build flat-shaded solid + edge overlay materials once
  const solidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:             '#060810',
    roughness:         1.0,
    metalness:         0.0,
    flatShading:       true,      // KEY: shows individual triangle faces
    emissive:          new THREE.Color('#030510'),
    emissiveIntensity: 1.0,
  }), [])

  const whiteMat = useMemo(() => new THREE.LineBasicMaterial({
    color: '#e8f0ff', transparent: true, opacity: 0.95,
  }), [])

  const blueMat = useMemo(() => new THREE.LineBasicMaterial({
    color: '#2244cc', transparent: true, opacity: 0.52,
  }), [])

  // Normalize scene scale+center, then build flat meshes + edge overlays
  const { normScene, edgeSegs } = useMemo(() => {
    const root = scene.clone()

    // Compute bounding box of entire model
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    // Scale so largest dimension = 3.0 units
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3.0 / maxDim
    root.scale.setScalar(scale)
    root.position.sub(center.multiplyScalar(scale))

    // Apply flat shading + collect edge overlays
    const edgeSegs: THREE.LineSegments[] = []
    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      if (child.name.toLowerCase().includes('cube')) {
        child.visible = false
        return
      }
      const geo = child.geometry.index ? child.geometry.toNonIndexed() : child.geometry
      geo.computeVertexNormals()
      child.geometry = geo
      child.material = solidMat

      const edges = new THREE.EdgesGeometry(geo, 15)
      const white = new THREE.LineSegments(edges, whiteMat)
      const blue  = new THREE.LineSegments(edges, blueMat)
      child.add(white)
      child.add(blue)
      edgeSegs.push(white, blue)
    })

    return { normScene: root, edgeSegs }
  }, [scene, solidMat, whiteMat, blueMat])

  // Slow rotation — matching the reference video speed
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime
      groupRef.current.rotation.y = t * 0.22
      groupRef.current.rotation.x = Math.sin(t * 0.14) * 0.04
    }
  })

  const s = compact ? 0.85 : 1.00

  return (
    <group ref={groupRef} scale={s} rotation={[0.10, 1.20, 0]} position={[0, 0.05, 0]}>
      <primitive object={normScene} />
    </group>
  )
}
