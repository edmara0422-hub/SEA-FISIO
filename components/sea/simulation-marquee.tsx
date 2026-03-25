'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/* ──────────────────────────────────────────────────────────────
   Single WebGL context marquee — 3 models in one scene
   Camera pans infinitely left→right, models repeat
   ────────────────────────────────────────────────────────────── */

const SPACING = 6 // distance between models
const TOTAL_WIDTH = SPACING * 3 // full cycle width
const SPEED = 0.8 // units per second

// Clip plane for brain
const CLIP_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.40)

function SharedScene() {
  const camRef = useRef(0)
  const { camera, gl } = useThree()

  useEffect(() => { gl.localClippingEnabled = true }, [gl])

  useFrame((_, delta) => {
    camRef.current += delta * SPEED
    // Loop camera position
    if (camRef.current > TOTAL_WIDTH) camRef.current -= TOTAL_WIDTH
    camera.position.x = camRef.current
    camera.lookAt(camRef.current, 0, 0)
  })

  // Dark flat material shared
  const solidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#060810',
    roughness: 1.0,
    metalness: 0.0,
    flatShading: true,
    emissive: new THREE.Color('#030510'),
    emissiveIntensity: 1.0,
    clippingPlanes: [CLIP_PLANE],
  }), [])

  const solidMatNoClip = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#060810',
    roughness: 1.0,
    metalness: 0.0,
    flatShading: true,
    emissive: new THREE.Color('#030510'),
    emissiveIntensity: 1.0,
  }), [])

  return (
    <>
      {/* Lighting */}
      <directionalLight position={[3, 8, 2]} intensity={6.0} color="#ffffff" />
      <directionalLight position={[-2, 2, 4]} intensity={1.0} color="#8899cc" />
      <pointLight position={[0, -5, -1]} intensity={12} color="#1133bb" distance={25} />
      <ambientLight intensity={0.05} color="#050815" />

      {/* 3 models + 3 clones (for seamless loop) */}
      {[0, TOTAL_WIDTH].map((offset) => (
        <group key={offset}>
          <BrainModel x={0 + offset} material={solidMat} />
          <HeartModel x={SPACING + offset} material={solidMatNoClip} />
          <LungsModel x={SPACING * 2 + offset} material={solidMatNoClip} />
        </group>
      ))}
    </>
  )
}

function BrainModel({ x, material }: { x: number; material: THREE.Material }) {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/brain.glb')

  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((child) => { if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = material })
    return c
  }, [scene, material])

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.3
  })

  return (
    <group ref={ref} position={[x, 0.2, 0]} scale={1.2}>
      <primitive object={cloned} />
    </group>
  )
}

function HeartModel({ x, material }: { x: number; material: THREE.Material }) {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/heart.glb')
  const timeRef = useRef(0)

  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((child) => { if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = material })
    return c
  }, [scene, material])

  useFrame((_, dt) => {
    if (!ref.current) return
    timeRef.current += dt
    ref.current.rotation.y += dt * 0.25
    // Heartbeat pulse
    const period = 0.88
    const ph = (timeRef.current % period) / period
    const s = ph < 0.12 ? 1 - (ph / 0.12) * 0.08 : ph < 0.28 ? 0.92 + ((ph - 0.12) / 0.16) * 0.08 : 1
    ref.current.scale.setScalar(s * 1.4)
  })

  return (
    <group ref={ref} position={[x, -0.1, 0]} scale={1.4}>
      <primitive object={cloned} />
    </group>
  )
}

function LungsModel({ x, material }: { x: number; material: THREE.Material }) {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/lungs.glb')
  const timeRef = useRef(0)

  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((child) => { if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = material })
    return c
  }, [scene, material])

  useFrame((_, dt) => {
    if (!ref.current) return
    timeRef.current += dt
    ref.current.rotation.y += dt * 0.2
    // Breathing
    const period = 4.2
    const ph = (timeRef.current % period) / period
    const s = ph < 0.4 ? 1 + (ph / 0.4) * 0.08 : ph < 0.5 ? 1.08 : 1.08 - ((ph - 0.5) / 0.5) * 0.08
    ref.current.scale.setScalar(s * 0.9)
  })

  return (
    <group ref={ref} position={[x, 0, 0]} scale={0.9}>
      <primitive object={cloned} />
    </group>
  )
}

export function SimulationMarquee({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={{ height: 'clamp(140px, 24vw, 190px)' }}>
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20" style={{ background: 'linear-gradient(to right, #020202, transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20" style={{ background: 'linear-gradient(to left, #020202, transparent)' }} />

      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 38 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <SharedScene />
      </Canvas>
    </div>
  )
}
