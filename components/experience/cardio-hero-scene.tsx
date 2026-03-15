'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export function CardioHeroScene({ transparent = false }: { transparent?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 5.2], fov: 32 }} gl={{ alpha: transparent, antialias: true }}>
      {!transparent ? <color attach="background" args={['#050304']} /> : null}
      <fog attach="fog" args={['#060304', 10, 18]} />

      {/* Deep anatomical lighting — rich reds, no blue */}
      <ambientLight intensity={0.38} color="#f5dede" />
      <directionalLight position={[2, 5, 4]} intensity={2.2} color="#ffe6e6" />
      <pointLight position={[-3, 1, 3]} intensity={22} color="#cc1122" distance={14} />
      <pointLight position={[2.5, -1, 3]} intensity={14} color="#ff3344" distance={12} />
      <pointLight position={[0, -4, 1]} intensity={6} color="#7a0810" distance={10} />
      <pointLight position={[0, 2, -2]} intensity={5} color="#991020" distance={10} />

      <Float speed={1.3} rotationIntensity={0.07} floatIntensity={0.20}>
        <AnatomicalHeart />
      </Float>
    </Canvas>
  )
}

// Heartbeat waveform — fast systole, slow diastole (~72 BPM)
function heartbeatPulse(t: number): number {
  const period = 0.84
  const phase = (t % period) / period
  if (phase < 0.13) return 1 - (phase / 0.13) * 0.13       // quick compress
  if (phase < 0.28) return 0.87 + ((phase - 0.13) / 0.15) * 0.13 // rebound
  return 1                                                    // diastole rest
}

function AnatomicalHeart() {
  const groupRef  = useRef<THREE.Group>(null)
  const lvPulse   = useRef<THREE.Group>(null)  // left ventricle pulse wrapper
  const rvPulse   = useRef<THREE.Group>(null)  // right ventricle pulse wrapper
  const laPulse   = useRef<THREE.Group>(null)  // left atrium pulse wrapper
  const raPulse   = useRef<THREE.Group>(null)  // right atrium pulse wrapper

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const p = heartbeatPulse(t)

    // Slow rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12 + Math.sin(t * 0.18) * 0.15
      groupRef.current.rotation.x = Math.sin(t * 0.14) * 0.06
    }

    // Ventricles contract with heartbeat
    if (lvPulse.current) lvPulse.current.scale.setScalar(p)
    if (rvPulse.current) rvPulse.current.scale.setScalar(p)

    // Atria swell slightly as ventricles contract (filling phase)
    const atrialScale = 1 + (1 - p) * 0.08
    if (laPulse.current) laPulse.current.scale.setScalar(atrialScale)
    if (raPulse.current) raPulse.current.scale.setScalar(atrialScale)
  })

  return (
    // Heart tilted as in anatomy: apex down-left, base up-right
    <group ref={groupRef} rotation={[0.15, 0.25, -0.18]}>

      {/* ── LEFT VENTRICLE (dominant, apex-forming) ─────────────── */}
      <group ref={lvPulse} position={[-0.24, -0.30, 0.10]}>
        <mesh>
          <sphereGeometry args={[0.80, 44, 44]} />
          <meshPhysicalMaterial
            color="#7a1820"
            roughness={0.74}
            metalness={0.0}
            clearcoat={0.10}
            clearcoatRoughness={0.88}
            emissive="#3d0808"
            emissiveIntensity={0.26}
            sheen={0.22}
            sheenColor={new THREE.Color('#c03040')}
          />
        </mesh>
      </group>

      {/* ── RIGHT VENTRICLE (anterior, crescent-shaped) ─────────── */}
      <group ref={rvPulse} position={[0.46, -0.22, 0.24]}>
        <mesh scale={[0.96, 0.80, 0.62]}>
          <sphereGeometry args={[0.70, 38, 38]} />
          <meshPhysicalMaterial
            color="#6e1520"
            roughness={0.76}
            metalness={0.0}
            clearcoat={0.08}
            clearcoatRoughness={0.90}
            emissive="#350708"
            emissiveIntensity={0.22}
            sheen={0.18}
            sheenColor={new THREE.Color('#b02838')}
          />
        </mesh>
      </group>

      {/* ── LEFT ATRIUM (posterior, top-left) ───────────────────── */}
      <group ref={laPulse} position={[-0.36, 0.52, -0.22]}>
        <mesh scale={[0.90, 0.84, 0.78]}>
          <sphereGeometry args={[0.50, 32, 32]} />
          <meshPhysicalMaterial
            color="#6a1420"
            roughness={0.78}
            metalness={0.0}
            emissive="#2e0606"
            emissiveIntensity={0.20}
            sheen={0.15}
            sheenColor={new THREE.Color('#a02030')}
          />
        </mesh>
      </group>

      {/* ── RIGHT ATRIUM (right side, top) ──────────────────────── */}
      <group ref={raPulse} position={[0.56, 0.46, 0.04]}>
        <mesh scale={[0.92, 0.84, 0.80]}>
          <sphereGeometry args={[0.48, 32, 32]} />
          <meshPhysicalMaterial
            color="#641218"
            roughness={0.78}
            metalness={0.0}
            emissive="#2a0506"
            emissiveIntensity={0.20}
            sheen={0.15}
            sheenColor={new THREE.Color('#982030')}
          />
        </mesh>
      </group>

      {/* ── AORTA — ascending from LV base ──────────────────────── */}
      <mesh position={[-0.06, 0.90, 0.06]} rotation={[0.05, 0, 0.22]}>
        <cylinderGeometry args={[0.15, 0.17, 0.68, 22]} />
        <meshPhysicalMaterial
          color="#8a1e28"
          roughness={0.70}
          metalness={0.0}
          emissive="#300608"
          emissiveIntensity={0.18}
        />
      </mesh>
      {/* Aortic arch — curves rightward */}
      <mesh position={[0.30, 1.22, 0.04]} rotation={[0, 0.1, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.15, 0.56, 20]} />
        <meshPhysicalMaterial
          color="#8a1e28"
          roughness={0.70}
          metalness={0.0}
          emissive="#300608"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* ── PULMONARY TRUNK — rises from RV ─────────────────────── */}
      <mesh position={[0.50, 0.80, 0.22]} rotation={[0.12, 0, -0.22]}>
        <cylinderGeometry args={[0.11, 0.13, 0.58, 18]} />
        <meshPhysicalMaterial
          color="#7a1620"
          roughness={0.72}
          metalness={0.0}
          emissive="#280506"
          emissiveIntensity={0.16}
        />
      </mesh>

      {/* ── SUPERIOR VENA CAVA — enters RA from above ───────────── */}
      <mesh position={[0.66, 0.96, -0.02]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.09, 0.10, 0.52, 16]} />
        <meshPhysicalMaterial
          color="#5a1018"
          roughness={0.76}
          metalness={0.0}
          emissive="#200406"
          emissiveIntensity={0.14}
        />
      </mesh>

    </group>
  )
}
