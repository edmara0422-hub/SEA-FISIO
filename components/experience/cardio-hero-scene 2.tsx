'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function CardioHeroScene({ transparent = false }: { transparent?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 34 }} gl={{ alpha: transparent, antialias: true }}>
      {!transparent ? <color attach="background" args={['#050506']} /> : null}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 3]} intensity={1.9} color="#ffe4e6" />
      <pointLight position={[-3, 1, 4]} intensity={14} color="#fb7185" distance={12} />
      <pointLight position={[2, -2, 3]} intensity={10} color="#fecdd3" distance={12} />
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.25}>
        <HeartForm />
      </Float>
    </Canvas>
  )
}

function HeartForm() {
  const groupRef = useRef<THREE.Group>(null)
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape()

    shape.moveTo(0, 0.22)
    shape.bezierCurveTo(0, 0.9, -0.95, 1.02, -0.95, 0.28)
    shape.bezierCurveTo(-0.95, -0.3, -0.38, -0.72, 0, -1.15)
    shape.bezierCurveTo(0.38, -0.72, 0.95, -0.3, 0.95, 0.28)
    shape.bezierCurveTo(0.95, 1.02, 0, 0.9, 0, 0.22)

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.78,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.14,
      curveSegments: 36,
    })

    geometry.center()
    return geometry
  }, [])

  useFrame((state) => {
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.8) * 0.08
    if (groupRef.current) {
      groupRef.current.scale.setScalar(pulse)
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.24
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.55) * 0.12
    }
  })

  return (
    <group ref={groupRef} rotation={[0.16, 0, -0.12]}>
      <mesh geometry={heartGeometry} scale={[1.08, 1.08, 1]}>
        <meshPhysicalMaterial
          color="#671625"
          emissive="#73182a"
          emissiveIntensity={0.28}
          roughness={0.28}
          metalness={0.03}
          clearcoat={0.54}
          clearcoatRoughness={0.28}
        />
      </mesh>

      <mesh position={[-0.26, 1.0, 0.04]} rotation={[0, 0, -0.28]}>
        <cylinderGeometry args={[0.12, 0.1, 0.9, 24]} />
        <meshStandardMaterial color="#f2d7dd" roughness={0.44} metalness={0.05} />
      </mesh>
      <mesh position={[0.18, 1.02, -0.02]} rotation={[0.08, 0, 0.22]}>
        <cylinderGeometry args={[0.1, 0.08, 0.82, 24]} />
        <meshStandardMaterial color="#e8cfd7" roughness={0.44} metalness={0.05} />
      </mesh>
    </group>
  )
}
