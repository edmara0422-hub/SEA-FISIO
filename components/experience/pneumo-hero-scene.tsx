'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

export function PneumoHeroScene({ transparent = false }: { transparent?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 38 }}
      gl={{ alpha: transparent, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      frameloop="demand"
    >
      {!transparent ? <color attach="background" args={['#07080f']} /> : null}
      <directionalLight position={[3, 8, 2]}  intensity={9.0} color="#ffffff" />
      <directionalLight position={[0, 0, 6]}  intensity={3.0} color="#ddf4ff" />
      <directionalLight position={[-2, 2, 4]} intensity={2.0} color="#88bbcc" />
      <pointLight position={[0, -5, -1]} intensity={20} color="#0088bb" distance={20} />
      <ambientLight intensity={0.12} color="#050815" />
      <AdaptiveEvents />
      <LungsModel />
    </Canvas>
  )
}

useGLTF.preload('/lungs.glb')

// Breathing cycle: ~14 breaths/min
function breathScale(t: number): number {
  const period = 4.2
  const ph = (t % period) / period
  // Inhale: 0→0.4, hold: 0.4→0.5, exhale: 0.5→1.0
  if (ph < 0.40) return 1 + (ph / 0.40) * 0.10          // slow inhale
  if (ph < 0.50) return 1.10                              // brief hold
  return 1.10 - ((ph - 0.50) / 0.50) * 0.10              // slow exhale
}

function LungsModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/lungs.glb')
  const { invalidate } = useThree()

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

  const solidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:             '#060810',
    roughness:         1.0,
    metalness:         0.0,
    flatShading:       true,
    emissive:          new THREE.Color('#030810'),
    emissiveIntensity: 1.0,
  }), [])

  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent:  true,
    opacity:      0.88,
  }), [])

  const normScene = useMemo(() => {
    const root = scene.clone(true)

    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3.0 / maxDim
    root.scale.setScalar(scale)
    root.position.sub(center.multiplyScalar(scale))

    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      const geo = child.geometry.index
        ? child.geometry.toNonIndexed()
        : child.geometry
      geo.computeVertexNormals()
      child.geometry = geo
      child.material = solidMat

      const edges = new THREE.EdgesGeometry(geo, 15)
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
        const t = Math.pow((pos.getY(v) - minY) / rangeY, 0.55)
        // bottom = deep cyan (0.05, 0.70, 1.0) → top = white (1.0, 1.0, 1.0)
        colors[v*3]   = t * 0.95 + 0.05   // R: 0.05 → 1.0
        colors[v*3+1] = t * 0.30 + 0.70   // G: 0.70 → 1.0
        colors[v*3+2] = 1.0                // B: always full
      }
      edges.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      const seg = new THREE.LineSegments(edges, edgeMat)
      child.add(seg)
    })

    return root
  }, [scene, solidMat, edgeMat])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const b = breathScale(t)
    groupRef.current.rotation.y = 1.57 + t * 0.14
    groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.04
    // Breathing expands laterally more than vertically
    groupRef.current.scale.set(b * 1.05, b, b * 0.95)
  })

  return (
    <group ref={groupRef} rotation={[0.10, 0, 0]} position={[0, -0.10, 0]}>
      <primitive object={normScene} />
    </group>
  )
}
