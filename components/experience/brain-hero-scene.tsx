'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

// Clip plane: hide everything below y = -1.40 in world space (shows cerebellum, cuts long brainstem)
const CLIP_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.40)

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
      gl={{ alpha: transparent, antialias: !compact, powerPreference: 'high-performance' }}
      dpr={[1, compact ? 1.2 : 1.5]}
      frameloop="demand"
    >
      {!transparent ? <color attach="background" args={['#07080f']} /> : null}
      <directionalLight position={[3, 8, 2]}  intensity={7.0} color="#ffffff" />
      <directionalLight position={[-2, 2, 4]} intensity={1.0} color="#8899cc" />
      <pointLight position={[0, -5, -1]} intensity={16} color="#1133bb" distance={20} />
      <ambientLight intensity={0.04} color="#050815" />
      <PerformanceMonitor onDecline={() => {}} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <BrainModel compact={compact} />
    </Canvas>
  )
}

// Pre-load for faster first render
useGLTF.preload('/brain.glb')

function BrainModel({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/brain.glb')

  const { gl, invalidate } = useThree()
  useEffect(() => { gl.localClippingEnabled = true }, [gl])

  // Throttle to ~30fps — saves ~50% GPU vs 60fps
  useEffect(() => {
    let last = 0
    let raf: number
    function tick(now: number) {
      if (now - last >= 33) { invalidate(); last = now }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [invalidate])

  // Build flat-shaded solid + edge overlay materials once
  const solidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:             '#060810',
    roughness:         1.0,
    metalness:         0.0,
    flatShading:       true,
    emissive:          new THREE.Color('#030510'),
    emissiveIntensity: 1.0,
    clippingPlanes:    [CLIP_PLANE],
  }), [])

  // Single edge material with vertex colors: white on top → blue on bottom
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors:   true,
    transparent:    true,
    opacity:        0.92,
    clippingPlanes: [CLIP_PLANE],
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

    // Scale so largest dimension = 3.2 units
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3.2 / maxDim
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
      // Vertex colors: top=white, bottom=blue
      const pos = edges.attributes.position
      let minY = Infinity, maxY = -Infinity
      for (let v = 0; v < pos.count; v++) {
        const y = pos.getY(v)
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
      const rangeY = maxY - minY || 1
      const colors = new Float32Array(pos.count * 3)
      for (let v = 0; v < pos.count; v++) {
        const t = Math.pow((pos.getY(v) - minY) / rangeY, 0.55) // bias toward white
        colors[v*3]   = t * 0.90 + 0.10   // R: 0.10 (blue) → 1.0 (white)
        colors[v*3+1] = t * 0.90 + 0.10   // G
        colors[v*3+2] = 1.0                // B: always full blue
      }
      edges.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      const seg = new THREE.LineSegments(edges, edgeMat)
      child.add(seg)
      edgeSegs.push(seg)
    })

    return { normScene: root, edgeSegs }
  }, [scene, solidMat, edgeMat])

  // Slow rotation — matching the reference video speed
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime
      // Side-view: 1.57 rad = 90° lateral view
      groupRef.current.rotation.y = 1.57 + t * 0.18
      groupRef.current.rotation.x = Math.sin(t * 0.14) * 0.04
    }
  })

  const s = compact ? 0.85 : 1.00

  return (
    <group ref={groupRef} scale={s} rotation={[0.10, 1.20, 0]} position={[0, -0.10, 0]}>
      <primitive object={normScene} />
    </group>
  )
}
