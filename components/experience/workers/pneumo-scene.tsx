import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/lungs.glb')

function breathScale(t: number): number {
  const period = 4.2, ph = (t % period) / period
  if (ph < 0.40) return 1 + (ph / 0.40) * 0.10
  if (ph < 0.50) return 1.10
  return 1.10 - ((ph - 0.50) / 0.50) * 0.10
}

export function PneumoScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/lungs.glb')
  const { invalidate } = useThree()

  useEffect(() => {
    let last = 0, raf: number
    const tick = (now: number) => {
      if (now - last >= 33) { invalidate(); last = now }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [invalidate])

  const solidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#060810', roughness: 1.0, metalness: 0.0, flatShading: true,
    emissive: new THREE.Color('#030810'), emissiveIntensity: 1.0,
  }), [])

  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.88,
  }), [])

  const normScene = useMemo(() => {
    const root = scene.clone(true)
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3(), center = new THREE.Vector3()
    box.getSize(size); box.getCenter(center)
    const scale = 3.0 / Math.max(size.x, size.y, size.z)
    root.scale.setScalar(scale)
    root.position.sub(center.multiplyScalar(scale))
    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
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
        colors[v*3] = t*0.95+0.05; colors[v*3+1] = t*0.30+0.70; colors[v*3+2] = 1.0
      }
      edges.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      child.add(new THREE.LineSegments(edges, edgeMat))
    })
    return root
  }, [scene, solidMat, edgeMat])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const b = breathScale(t)
    groupRef.current.rotation.y = 1.57 + t * 0.14
    groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.04
    groupRef.current.scale.set(b * 1.05, b, b * 0.95)
  })

  return (
    <>
      <directionalLight position={[3, 8, 2]}  intensity={9.0} color="#ffffff" />
      <directionalLight position={[0, 0, 6]}  intensity={3.0} color="#ddf4ff" />
      <directionalLight position={[-2, 2, 4]} intensity={2.0} color="#88bbcc" />
      <pointLight position={[0, -5, -1]} intensity={20} color="#0088bb" distance={20} />
      <ambientLight intensity={0.12} color="#050815" />
      <group ref={groupRef} rotation={[0.10, 0, 0]} position={[0, -0.10, 0]}>
        <primitive object={normScene} />
      </group>
    </>
  )
}
