'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function NeuralBrain() {
  const groupRef = useRef<THREE.Group>(null)
  const [rotationSpeed, setRotationSpeed] = useState({ x: 0, y: 0.5 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Carrega o modelo GLB
  const { scene } = useGLTF('/cerebro.glb')

  useEffect(() => {
    // Tracking de mouse para parallax
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animação de rotação com parallax
  useFrame(() => {
    if (groupRef.current) {
      // Rotação contínua
      groupRef.current.rotation.y += rotationSpeed.y * 0.008
      groupRef.current.rotation.x += rotationSpeed.x * 0.003

      // Parallax baseado no mouse
      groupRef.current.position.x = mousePosition.x * 0.5
      groupRef.current.position.y = mousePosition.y * 0.3

      // Aplicar escala de respiração (como se estivesse "pulsando")
      const pulse = 0.95 + 0.05 * Math.sin(Date.now() * 0.001)
      groupRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  // Clone da cena para não modificar o original
  const clonedScene = scene.clone()

  // Aplica material com emissão (glow) ao cérebro
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = new THREE.MeshStandardMaterial({
        emissive: new THREE.Color(0x7c3aed), // Purple glow
        emissiveIntensity: 0.4,
        roughness: 0.7,
        metalness: 0.3,
      })
      child.material = material
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
      
      {/* Iluminação aprimorada */}
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, 5]} intensity={0.8} color="#7c3aed" />
      <ambientLight intensity={0.4} />
    </group>
  )
}

// Pré-carregar o modelo
useGLTF.preload('/cerebro.glb')
