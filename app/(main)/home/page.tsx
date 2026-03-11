'use client'

import { useEffect, useState, useRef, Suspense, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { Bell, MessageSquare, Activity, Brain, Heart, Zap, TrendingUp } from 'lucide-react'
import * as THREE from 'three'
import { generateECGData } from '@/lib/ecgModel'
import { generateVMPressureData } from '@/lib/vmModel'

// Cerebro procedural mais anatomico (sem asset externo)
function RealisticBrain() {
  const brainRef = useRef<THREE.Group>(null)

  const createHemisphere = useCallback((side: -1 | 1) => {
    const geometry = new THREE.IcosahedronGeometry(1.02, 4)
    const pos = geometry.attributes.position
    const v = new THREE.Vector3()
    const n = new THREE.Vector3()

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      n.copy(v).normalize()

      const radius = Math.max(v.length(), 0.0001)
      const theta = Math.acos(THREE.MathUtils.clamp(v.y / radius, -1, 1))
      const phi = Math.atan2(v.z, (v.x * side) + 0.001)

      // Sulcos com fluxo mais organico e menos aspecto de esfera.
      const foldsA = Math.sin(phi * 11.4 + theta * 4.2) * 0.064
      const foldsB = Math.sin(phi * 18.2 - theta * 5.1) * 0.034
      const foldsC = Math.cos(v.y * 15.8 + v.z * 11.3) * 0.02
      const foldsD = Math.sin((v.x * side) * 9.5 + v.y * 7.4) * 0.015
      const macroWave = Math.sin((v.z * 2.9) + (v.y * 2.05)) * 0.026

      const gyriDepth = foldsA + foldsB + foldsC + foldsD + macroWave

      // Silhueta cerebral: mais volume superior/frontal e achatamento inferior.
      const superiorBulge = 1 + Math.max(0, v.y) * 0.12
      const frontalBulge = 1 + Math.max(0, v.z) * 0.11
      const occipitalRound = 1 + Math.max(0, -v.z) * 0.05
      const temporalDrop = 1 + Math.max(0, side * v.x) * 0.08
      const ventralFlatten = v.y < -0.08 ? 1 - Math.min(0.24, Math.abs(v.y + 0.08) * 0.24) : 1
      const lateralTaper = 1 - Math.max(0, Math.abs(v.x) - 0.82) * 0.08
      const asymmetry = side === -1 ? 1.012 : 0.992

      const localScale = (1 + gyriDepth) * superiorBulge * frontalBulge * occipitalRound * temporalDrop * ventralFlatten * lateralTaper * asymmetry
      v.multiplyScalar(localScale)

      // Fissura inter-hemisferica com leve recuo interno.
      const midBand = Math.exp(-Math.pow((v.x + side * 0.045) * 9.2, 2))
      v.x -= side * midBand * 0.1
      v.z -= midBand * 0.02
      v.y -= midBand * 0.012

      const sylvianHint = Math.exp(-Math.pow(v.y * 5.4, 2)) * Math.exp(-Math.pow((v.z - 0.08) * 6.5, 2))
      v.y -= sylvianHint * 0.035
      v.z += sylvianHint * 0.012

      v.addScaledVector(n, gyriDepth * 0.02)

      pos.setXYZ(i, v.x, v.y, v.z)
    }

    geometry.computeVertexNormals()
    return geometry
  }, [])

  const createCerebellum = useCallback(() => {
    const geometry = new THREE.IcosahedronGeometry(0.66, 3)
    const pos = geometry.attributes.position
    const v = new THREE.Vector3()

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)

      const foldsA = Math.sin(v.x * 12 + v.z * 8.4) * 0.036
      const foldsB = Math.cos(v.y * 14 + v.x * 8.8) * 0.024
      const foldsC = Math.sin(v.z * 13.4 - v.y * 6.2) * 0.016
      const flatten = v.y > 0.12 ? 1 - Math.min(0.26, (v.y - 0.12) * 0.34) : 1
      const posteriorBulge = 1 + Math.max(0, -v.z) * 0.06
      const localScale = (1 + foldsA + foldsB + foldsC) * flatten * posteriorBulge

      v.multiplyScalar(localScale)
      pos.setXYZ(i, v.x, v.y, v.z)
    }

    geometry.computeVertexNormals()
    return geometry
  }, [])

  const leftHemisphere = useMemo(() => createHemisphere(-1), [createHemisphere])
  const rightHemisphere = useMemo(() => createHemisphere(1), [createHemisphere])
  const cerebellum = useMemo(() => createCerebellum(), [createCerebellum])
  const brainstem = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.09, 0.05, 0.42, 28, 18)
    const pos = geometry.attributes.position
    const v = new THREE.Vector3()

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)

      const taperWave = Math.sin(v.y * 8.5) * 0.012
      const anteriorBulge = Math.max(0, v.z) * 0.06
      const posteriorFlatten = v.z < 0 ? 1 - Math.min(0.18, Math.abs(v.z) * 0.4) : 1

      v.x *= 1 + taperWave
      v.z *= (1 + anteriorBulge) * posteriorFlatten

      pos.setXYZ(i, v.x, v.y, v.z)
    }

    geometry.computeVertexNormals()
    return geometry
  }, [])

  const cortexMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#0d1014',
      metalness: 0,
      roughness: 0.96,
      emissive: '#05070a',
      emissiveIntensity: 0.06,
      envMapIntensity: 0,
    }),
    []
  )

  const cerebellumMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#101318',
      metalness: 0,
      roughness: 0.97,
      emissive: '#04060a',
      emissiveIntensity: 0.05,
      envMapIntensity: 0,
    }),
    []
  )

  const stemMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#0b0e12',
      metalness: 0,
      roughness: 0.98,
      emissive: '#030507',
      emissiveIntensity: 0.04,
      envMapIntensity: 0,
    }),
    []
  )

  const wireframeMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: '#e7edf5',
      wireframe: true,
      transparent: true,
      opacity: 0.82,
    }),
    []
  )

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = state.clock.elapsedTime * 0.11
      brainRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.022
    }
  })

  return (
    <group ref={brainRef} scale={[0.66, 0.6, 0.68]}>
      <mesh geometry={leftHemisphere} position={[-0.4, 0.05, 0.03]}>
        <primitive object={cortexMaterial} attach="material" />
      </mesh>
      <mesh geometry={leftHemisphere} position={[-0.4, 0.05, 0.03]} scale={[1.012, 1.012, 1.012]}>
        <primitive object={wireframeMaterial} attach="material" />
      </mesh>

      <mesh geometry={rightHemisphere} position={[0.4, 0.05, 0.03]}>
        <primitive object={cortexMaterial.clone()} attach="material" />
      </mesh>
      <mesh geometry={rightHemisphere} position={[0.4, 0.05, 0.03]} scale={[1.012, 1.012, 1.012]}>
        <primitive object={wireframeMaterial.clone()} attach="material" />
      </mesh>

      <mesh geometry={cerebellum} position={[0, -0.64, -0.4]} scale={[0.62, 0.45, 0.48]}>
        <primitive object={cerebellumMaterial} attach="material" />
      </mesh>
      <mesh geometry={cerebellum} position={[0, -0.64, -0.4]} scale={[0.628, 0.456, 0.486]}>
        <primitive object={wireframeMaterial.clone()} attach="material" />
      </mesh>

      <mesh geometry={brainstem} position={[0, -0.88, -0.3]} rotation={[0.22, 0, 0]}>
        <primitive object={stemMaterial} attach="material" />
      </mesh>
      <mesh geometry={brainstem} position={[0, -0.88, -0.3]} rotation={[0.22, 0, 0]} scale={[1.01, 1.01, 1.01]}>
        <primitive object={wireframeMaterial.clone()} attach="material" />
      </mesh>
    </group>
  )
}

// Aneis orbitais coloridos pulsantes
function EnergyRings() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.5
      ring1.current.rotation.y = t * 0.3
      ring1.current.scale.setScalar(1 + Math.sin(t * 2) * 0.03)
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.4
      ring2.current.rotation.z = t * 0.5
      ring2.current.scale.setScalar(1 + Math.sin(t * 2 + 1) * 0.03)
    }
    if (ring3.current) {
      ring3.current.rotation.y = t * 0.6
      ring3.current.rotation.z = -t * 0.3
      ring3.current.scale.setScalar(1 + Math.sin(t * 2 + 2) * 0.03)
    }
  })

  return (
    <>
      <mesh ref={ring1}>
        <torusGeometry args={[1.82, 0.006, 12, 100]} />
        <meshBasicMaterial color="#e5e7eb" transparent opacity={0.42} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[2.08, 0.006, 12, 100]} />
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.34} />
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[2.34, 0.006, 12, 100]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.28} />
      </mesh>
    </>
  )
}

// Particulas de energia flutuando
function EnergyParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 80

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 3 + Math.random() * 3

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    colors[i * 3] = 0.8 + Math.random() * 0.2
    colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// ECG Animado Realista
function ECGMonitor() {
  const [pathD, setPathD] = useState('')
  const [sweepX, setSweepX] = useState(0)
  const phaseRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const width = 150
    const height = 42
    const baseline = height / 2
    const ecgPoints = generateECGData({ bpm: 72, sampleRate: 260, beats: 1 })
    const samples = ecgPoints.map((point) => point.value)
    const minV = Math.min(...samples)
    const maxV = Math.max(...samples)
    const range = Math.max(maxV - minV, 0.0001)

    const sampleECG = (phase: number) => {
      const idx = Math.floor(phase * samples.length) % samples.length
      return samples[idx]
    }

    const ecgY = (xNorm: number, offset: number) => {
      const phase = (xNorm + offset) % 1
      const value = sampleECG(phase)
      const normalized = (value - minV) / range
      return baseline - (normalized - 0.5) * 34
    }

    const draw = () => {
      const offset = phaseRef.current
      const pts: string[] = new Array(width)
      for (let x = 0; x < width; x++) {
        const y = ecgY(x / width, offset)
        pts[x] = `${x},${y.toFixed(2)}`
      }

      setPathD(`M ${pts.join(' L ')}`)
      setSweepX((offset * width) % (width + 40))
      phaseRef.current = (phaseRef.current + 0.0065) % 1

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <svg viewBox="0 0 150 42" className="w-full h-[42px]" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="ecg-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,80,80,0)" />
          <stop offset="50%" stopColor="rgba(255,74,74,0.22)" />
          <stop offset="100%" stopColor="rgba(255,80,80,0)" />
        </linearGradient>
      </defs>
      <path d={pathD} fill="none" stroke="rgba(255,69,69,0.92)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d={pathD} fill="none" stroke="rgba(255,214,214,0.95)" strokeWidth="0.95" strokeLinejoin="round" strokeLinecap="round" />
      <rect x={sweepX - 20} y={0} width={40} height={42} fill="url(#ecg-sweep)" />
    </svg>
  )
}

// Ventilacao Mecanica Monitor (SVG leve — sem Plotly)
function VMMonitor() {
  const [pathP, setPathP] = useState('')
  const [pathF, setPathF] = useState('')
  const [pathV, setPathV] = useState('')
  const phaseRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const width = 150
    const vmPoints = generateVMPressureData({
      fr: 16, ieRatio: 1 / 2, peep: 5, peakPressure: 25, sampleRate: 220, cycles: 1,
    })
    const pressureSeries = vmPoints.map((p) => p.pressure)
    const dt = vmPoints.length > 1 ? vmPoints[1].t - vmPoints[0].t : 1 / 220

    const flowSeries = pressureSeries.map((v, i, arr) => {
      const prev = i === 0 ? arr[arr.length - 1] : arr[i - 1]
      return (v - prev) / dt
    })
    const volumeSeries: number[] = []
    let acc = 0
    for (let i = 0; i < flowSeries.length; i++) {
      acc += Math.max(flowSeries[i], 0) * dt
      if (flowSeries[i] < 0) acc = Math.max(0, acc + flowSeries[i] * dt * 0.35)
      volumeSeries.push(acc)
    }

    const normalize = (s: number[]) => {
      const min = Math.min(...s), max = Math.max(...s), r = Math.max(max - min, 0.0001)
      return s.map((v) => (v - min) / r)
    }
    const pN = normalize(pressureSeries), fN = normalize(flowSeries), vN = normalize(volumeSeries)

    const buildPath = (series: number[], lane: number, amp: number, phase: number) => {
      const pts: string[] = []
      for (let i = 0; i < 80; i++) {
        const xn = i / 79
        const idx = Math.floor(((xn + phase) % 1) * series.length) % series.length
        const x = xn * width
        const y = lane - series[idx] * amp
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
      }
      return `M ${pts.join(' L ')}`
    }

    const draw = () => {
      const phase = phaseRef.current
      setPathP(buildPath(pN, 9.2, 4.1, phase))
      setPathF(buildPath(fN, 21, 3.9, phase))
      setPathV(buildPath(vN, 36.2, 4.1, phase))
      phaseRef.current = (phaseRef.current + 0.008) % 1
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <svg viewBox="0 0 150 42" className="w-full h-[42px]" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="14" x2="150" y2="14" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
      <line x1="0" y1="28" x2="150" y2="28" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
      <path d={pathP} fill="none" stroke="rgba(120,252,179,0.92)" strokeWidth="1.5" />
      <path d={pathF} fill="none" stroke="rgba(96,165,250,0.92)" strokeWidth="1.5" />
      <path d={pathV} fill="none" stroke="rgba(192,132,252,0.92)" strokeWidth="1.5" />
    </svg>
  )
}

// Animacao de modulo clinico (sem texto)
function MetricBubble({ x, y, delay, color, moduleType }: {
  x: string
  y: string
  delay: number
  color: string
  moduleType: 'cardio' | 'pneumo' | 'neuro'
}) {
  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0]
      }}
      transition={{
        delay,
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <div
        className="relative h-14 w-14 rounded-full border border-white/10 backdrop-blur-sm"
        style={{ background: `linear-gradient(135deg, ${color}2e, ${color}12)` }}
      >
        {moduleType === 'cardio' && (
          <>
            <motion.div
              className="absolute left-[18%] top-1/2 h-[2px] w-[64%] -translate-y-1/2"
              style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
              animate={{ opacity: [0.35, 0.95, 0.35], scaleX: [0.85, 1.05, 0.85] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.1 }}
            />
            <motion.div
              className="absolute left-[46%] top-1/2 h-3 w-[2px] -translate-y-1/2"
              style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
              animate={{ scaleY: [0.5, 1.35, 0.5], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.2 }}
            />
          </>
        )}

        {moduleType === 'pneumo' && (
          <>
            <motion.div
              className="absolute left-[22%] top-[24%] h-[52%] w-[24%] rounded-full border"
              style={{ borderColor: color }}
              animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay }}
            />
            <motion.div
              className="absolute right-[22%] top-[24%] h-[52%] w-[24%] rounded-full border"
              style={{ borderColor: color }}
              animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.2 }}
            />
          </>
        )}

        {moduleType === 'neuro' && (
          <>
            <motion.div
              className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
              animate={{ opacity: [0.45, 1, 0.45], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.1 }}
            />
            <motion.div
              className="absolute left-[24%] top-[28%] h-[4px] w-[4px] rounded-full"
              style={{ backgroundColor: color }}
              animate={{ opacity: [0.25, 0.85, 0.25] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.25 }}
            />
            <motion.div
              className="absolute right-[24%] top-[30%] h-[4px] w-[4px] rounded-full"
              style={{ backgroundColor: color }}
              animate={{ opacity: [0.25, 0.85, 0.25] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.35 }}
            />
            <motion.div
              className="absolute left-[30%] bottom-[24%] h-[4px] w-[4px] rounded-full"
              style={{ backgroundColor: color }}
              animate={{ opacity: [0.25, 0.85, 0.25] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.45 }}
            />
          </>
        )}
      </div>
    </motion.div>
  )
}

function SplashNeuralMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const nodeCount = 40

  const nodes = useMemo(() => {
    const arr = new Float32Array(nodeCount * 3)
    for (let i = 0; i < nodeCount; i++) {
      const r = 1.15 + Math.random() * 1.35
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(p) * Math.cos(t)
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t)
      arr[i * 3 + 2] = r * Math.cos(p)
    }
    return arr
  }, [])

  const links = useMemo(() => {
    const count = 50
    const arr = new Float32Array(count * 6)
    for (let i = 0; i < count; i++) {
      const a = Math.floor(Math.random() * nodeCount)
      const b = Math.floor(Math.random() * nodeCount)
      arr[i * 6] = nodes[a * 3]
      arr[i * 6 + 1] = nodes[a * 3 + 1]
      arr[i * 6 + 2] = nodes[a * 3 + 2]
      arr[i * 6 + 3] = nodes[b * 3]
      arr[i * 6 + 4] = nodes[b * 3 + 1]
      arr[i * 6 + 5] = nodes[b * 3 + 2]
    }
    return arr
  }, [nodes])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.17
    groupRef.current.rotation.x = Math.sin(t * 0.22) * 0.16
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodes, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#f5f5f5" size={0.024} transparent opacity={0.95} sizeAttenuation />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[links, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#d4d4d8" transparent opacity={0.22} />
      </lineSegments>

      <mesh>
        <sphereGeometry args={[0.2, 28, 28]} />
        <meshBasicMaterial color="#fafafa" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

function NeuralSplash({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const completedRef = useRef(false)
  const backgroundGlitter = [
    { top: '10%', left: '20%', size: 2.8, delay: 0.2, duration: 2.9, glow: 0.72 },
    { top: '8%', left: '48%', size: 2.4, delay: 0.4, duration: 2.6, glow: 0.66 },
    { top: '10%', left: '76%', size: 3, delay: 0.6, duration: 3, glow: 0.78 },
    { top: '28%', left: '26%', size: 1.7, delay: 0.8, duration: 2.2, glow: 0.48 },
    { top: '30%', left: '54%', size: 2, delay: 1.0, duration: 2.3, glow: 0.56 },
    { top: '26%', left: '70%', size: 2.7, delay: 1.2, duration: 2.8, glow: 0.7 },
    { top: '50%', left: '74%', size: 3.1, delay: 1.4, duration: 3.2, glow: 0.82 },
    { top: '48%', left: '46%', size: 2.5, delay: 1.6, duration: 2.7, glow: 0.67 },
    { top: '62%', left: '24%', size: 2.8, delay: 1.8, duration: 2.9, glow: 0.73 },
    { top: '72%', left: '46%', size: 3, delay: 2.0, duration: 3, glow: 0.77 },
    { top: '76%', left: '74%', size: 2.7, delay: 2.2, duration: 2.8, glow: 0.71 },
    { top: '90%', left: '52%', size: 2.9, delay: 2.4, duration: 2.9, glow: 0.74 },
  ]

  const finishSplash = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const startedAt = Date.now()
    const minDuration = 2500
    const maxDuration = 3500

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const pct = Math.min(98, Math.floor((elapsed / minDuration) * 100))
      setProgress(pct)
    }, 40)

    const minTimer = setTimeout(() => {
      setProgress(100)
      finishSplash()
    }, minDuration)

    // Failsafe absoluto para nunca travar em splash.
    const hardTimer = setTimeout(() => {
      setProgress(100)
      finishSplash()
    }, maxDuration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(minTimer)
      clearTimeout(hardTimer)
    }
  }, [finishSplash])

  return (
    <motion.div
      className="fixed inset-0 z-50 h-dvh w-screen overflow-hidden overscroll-none bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="absolute inset-0 bg-black" />

      {backgroundGlitter.map((dot, index) => (
        <motion.div
          key={`bg-glitter-${index}`}
          className="pointer-events-none absolute rounded-full bg-white"
          style={{
            top: dot.top,
            left: dot.left,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            filter: 'blur(0.7px)',
            opacity: 0.1,
            boxShadow: '0 0 9px rgba(255,255,255,0.78)',
          }}
          animate={{ opacity: [0.04, dot.glow, 0.04], scale: [0.82, 1.55, 0.82], y: [0, -1.4, 0] }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="w-full max-w-xl text-center">
          <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-full border border-white/20 bg-black/35 shadow-2xl sm:max-w-[380px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 44 }}>
              <ambientLight intensity={0.42} />
              <pointLight position={[5, 4, 4]} intensity={0.9} color="#ffffff" />
              <pointLight position={[-4, -3, 5]} intensity={0.45} color="#d4d4d8" />
              <pointLight position={[0, 6, -4]} intensity={0.38} color="#a1a1aa" />
              <Suspense fallback={null}>
                <Float speed={1.1} rotationIntensity={0.04} floatIntensity={0.16}>
                  <SplashNeuralMesh />
                </Float>
              </Suspense>
            </Canvas>

            <div className="pointer-events-none absolute inset-0 bg-black/35" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.32em] text-white/75">
            <Brain className="h-4 w-4" />
            SEA
          </div>

          <p className="mt-3 text-sm text-white/60">{progress}%</p>

          <div className="mt-5 mx-auto h-px w-full max-w-[220px] overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-px rounded-full bg-white/90"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.14 }}
              style={{ boxShadow: '0 0 6px rgba(255,255,255,0.6)' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Grafico semanal
function WeeklyChart() {
  const data = [35, 50, 30, 65, 45, 60, 40]
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  const maxValue = Math.max(...data)

  return (
    <div className="flex items-end justify-between h-16 gap-1.5">
      {data.map((value, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            className="w-full bg-gradient-to-t from-white/20 to-white/40 rounded-sm"
            style={{ height: `${(value / maxValue) * 100}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          />
          <span className="text-[9px] text-white/30">{days[i]}</span>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  useEffect(() => {
    // Failsafe absoluto no componente pai.
    const guard = window.setTimeout(() => {
      setShowSplash(false)
    }, 4000)

    return () => {
      window.clearTimeout(guard)
    }
  }, [])

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    const prevTouchAction = document.body.style.touchAction

    if (showSplash) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      document.body.classList.add('splash-active')
    } else {
      document.body.style.overflow = prevOverflow
      document.body.style.touchAction = prevTouchAction
      document.body.classList.remove('splash-active')
    }

    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.touchAction = prevTouchAction
      document.body.classList.remove('splash-active')
    }
  }, [showSplash])

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <AnimatePresence>
        {showSplash && <NeuralSplash onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {/* Hero Section com Cerebro 3D */}
      <div className="relative h-[55vh] w-full">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute right-[12%] top-[18%] h-32 w-32 rounded-full bg-slate-300/10 blur-3xl" />
          <div className="absolute left-[22%] bottom-[10%] h-28 w-28 rounded-full bg-slate-200/8 blur-[90px]" />
          <div className="absolute right-[24%] bottom-[14%] h-36 w-36 rounded-full bg-white/6 blur-[110px]" />
        </div>

        {/* Canvas 3D */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.16} color="#ffffff" />
            <hemisphereLight intensity={0.28} color="#dbe4ee" groundColor="#020407" />
            <directionalLight position={[3.1, 2.8, 4.2]} intensity={1.05} color="#f8fafc" />
            <directionalLight position={[-2.4, 1.2, 2.2]} intensity={0.36} color="#cbd5e1" />
            <pointLight position={[0, 0.2, 3.5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[0.2, -0.3, -3.2]} intensity={0.22} color="#94a3b8" />
            <spotLight position={[0, 2.1, 4]} angle={0.4} penumbra={0.95} intensity={0.92} color="#ffffff" />
            <Suspense fallback={null}>
              <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
                <RealisticBrain />
              </Float>
              <EnergyRings />
              <EnergyParticles />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.08}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        </div>

        {/* ECG Monitor - Esquerda */}
        <motion.div
          className="absolute left-3 top-1/4 z-10 w-[150px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ECGMonitor />
        </motion.div>

        {/* VM Monitor - Esquerda baixo */}
        <motion.div
          className="absolute right-3 bottom-6 z-10 w-[150px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <VMMonitor />
        </motion.div>

        {/* Bolhas de metricas */}
        <MetricBubble x="75%" y="15%" delay={0.3} color="#ef4444" moduleType="cardio" />
        <MetricBubble x="50%" y="88%" delay={0.5} color="#3b82f6" moduleType="pneumo" />
        <MetricBubble x="15%" y="70%" delay={0.7} color="#a855f7" moduleType="neuro" />

        {/* Vinheta */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)' }}
        />
      </div>

      {/* Dashboard Section */}
      <div className="relative z-10 mt-20 px-4 pb-28">
        {/* Dashboard Card */}
        <motion.div
          className="bg-[#0a0a0a]/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Dashboard Admin</h2>
            <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded-full">Small Data</span>
          </div>

          <div className="p-4 space-y-4">
            {/* Atividade Semanal */}
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/60 text-xs">Atividade Semanal</span>
                <button className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Semant+
                </button>
              </div>
              <WeeklyChart />
            </div>

            {/* NPS Score */}
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-xs">NPS Score</span>
                <span className="text-white font-bold text-lg">0</span>
              </div>
              <p className="text-white/35 text-[10px] mb-2">Sua Pontuacao de Neuroestrategia: sem registros</p>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-zinc-300 to-zinc-500"
                  initial={{ width: 0 }}
                  animate={{ width: '0%' }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                />
              </div>
            </div>

            {/* Metricas */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: '0%', label: 'Churn mensal' },
                { value: '0', label: 'Indicacoes' },
                { value: '0', label: 'Usuarios' },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  className="bg-white/5 rounded-xl p-3 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <p className="text-white font-bold">{m.value}</p>
                  <p className="text-white/30 text-[10px]">{m.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Alert Feed */}
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/60 text-xs">Central de Operacoes Clinicas</span>
                <div className="flex gap-2">
                  <Bell className="w-4 h-4 text-white/30" />
                  <MessageSquare className="w-4 h-4 text-white/30" />
                </div>
              </div>
              {[
                { icon: Activity, text: 'Sem alertas criticos no momento', color: 'text-zinc-300' },
                { icon: Brain, text: 'Coleta de feedbacks reais iniciada', color: 'text-zinc-400' },
                { icon: Zap, text: 'Aguardando dados para recomendacoes personalizadas', color: 'text-zinc-400' },
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className={`w-5 h-5 rounded-full bg-white/5 flex items-center justify-center`}>
                    <alert.icon className={`w-3 h-3 ${alert.color}`} />
                  </div>
                  <span className="text-white/50 text-xs">{alert.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>


      </div>
    </div>
  )
}
