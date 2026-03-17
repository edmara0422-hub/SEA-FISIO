'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas as OffscreenCanvas } from '@react-three/offscreen'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, AdaptiveEvents } from '@react-three/drei'
import * as THREE from 'three'

const CLIP_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.40)

// Worker singleton — created once, reused across mounts
let _worker: Worker | null = null
function getWorker(): Worker | null {
  if (typeof window === 'undefined') return null
  if (typeof window.Worker === 'undefined') return null
  if (!_worker) {
    try {
      _worker = new Worker(
        new URL('./workers/brain.worker.ts', import.meta.url),
        { type: 'module' }
      )
    } catch {
      return null
    }
  }
  return _worker
}

const canvasProps = {
  camera: { position: [0, 0, 4.4] as [number, number, number], fov: 42 },
  gl: { antialias: true, powerPreference: 'high-performance' as const },
  dpr: [1, 1.5] as [number, number],
  frameloop: 'demand' as const,
  style: { width: '100%', height: '100%' },
}

export function BrainHeroScene({
  compact = false,
  transparent = false,
}: {
  compact?: boolean
  transparent?: boolean
}) {
  const w = getWorker()

  if (w) {
    return (
      <OffscreenCanvas
        worker={w}
        fallback={<FallbackCanvas compact={compact} transparent={transparent} />}
        {...canvasProps}
        camera={{ position: [0, 0, compact ? 3.8 : 4.4], fov: compact ? 46 : 42 }}
        gl={{ alpha: transparent, antialias: true, powerPreference: 'high-performance' }}
      />
    )
  }

  return <FallbackCanvas compact={compact} transparent={transparent} />
}

function FallbackCanvas({ compact, transparent }: { compact: boolean; transparent: boolean }) {
  return (
    <Canvas
      {...canvasProps}
      camera={{ position: [0, 0, compact ? 3.8 : 4.4], fov: compact ? 46 : 42 }}
      gl={{ alpha: transparent, antialias: true, powerPreference: 'high-performance' }}
    >
      {!transparent ? <color attach="background" args={['#07080f']} /> : null}
      <directionalLight position={[3, 8, 2]}  intensity={7.0} color="#ffffff" />
      <directionalLight position={[-2, 2, 4]} intensity={1.0} color="#8899cc" />
      <pointLight position={[0, -5, -1]} intensity={16} color="#1133bb" distance={20} />
      <ambientLight intensity={0.04} color="#050815" />
      <AdaptiveEvents />
      <BrainModel compact={compact} />
    </Canvas>
  )
}

useGLTF.preload('/brain.glb')

function BrainModel({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/brain.glb')
  const { gl, invalidate } = useThree()

  useEffect(() => { gl.localClippingEnabled = true }, [gl])
  useEffect(() => {
    let last = 0, raf: number
    const tick = (now: number) => { if (now - last >= 33) { invalidate(); last = now }; raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [invalidate])

  const solidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#060810', roughness: 1.0, metalness: 0.0, flatShading: true,
    emissive: new THREE.Color('#030510'), emissiveIntensity: 1.0, clippingPlanes: [CLIP_PLANE],
  }), [])

  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.92, clippingPlanes: [CLIP_PLANE],
  }), [])

  const normScene = useMemo(() => {
    const root = scene.clone()
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3(), center = new THREE.Vector3()
    box.getSize(size); box.getCenter(center)
    const scale = 3.2 / Math.max(size.x, size.y, size.z)
    root.scale.setScalar(scale); root.position.sub(center.multiplyScalar(scale))
    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      if (child.name.toLowerCase().includes('cube')) { child.visible = false; return }
      const geo = child.geometry.index ? child.geometry.toNonIndexed() : child.geometry
      geo.computeVertexNormals(); child.geometry = geo; child.material = solidMat
      const edges = new THREE.EdgesGeometry(geo, 15)
      const pos = edges.attributes.position
      let minY = Infinity, maxY = -Infinity
      for (let v = 0; v < pos.count; v++) { const y = pos.getY(v); if (y < minY) minY = y; if (y > maxY) maxY = y }
      const rangeY = maxY - minY || 1
      const colors = new Float32Array(pos.count * 3)
      for (let v = 0; v < pos.count; v++) {
        const t = Math.pow((pos.getY(v) - minY) / rangeY, 0.55)
        colors[v*3] = t*0.90+0.10; colors[v*3+1] = t*0.90+0.10; colors[v*3+2] = 1.0
      }
      edges.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      child.add(new THREE.LineSegments(edges, edgeMat))
    })
    return root
  }, [scene, solidMat, edgeMat])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = 1.57 + t * 0.18
    groupRef.current.rotation.x = Math.sin(t * 0.14) * 0.04
  })

  return (
    <group ref={groupRef} scale={compact ? 0.85 : 1.00} rotation={[0.10, 1.20, 0]} position={[0, -0.10, 0]}>
      <primitive object={normScene} />
    </group>
  )
}
