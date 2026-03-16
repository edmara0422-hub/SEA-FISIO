import { render } from '@react-three/offscreen'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/heart.glb')

function heartbeatPulse(t: number): number {
  const period = 0.88, ph = (t % period) / period
  if (ph < 0.12) return 1 - (ph / 0.12) * 0.10
  if (ph < 0.28) return 0.90 + ((ph - 0.12) / 0.16) * 0.10
  return 1
}

function CardioScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/heart.glb')
  const { invalidate } = useThree()

  useEffect(() => {
    let last = 0, raf: number
    function tick(now: number) {
      if (now - last >= 33) { invalidate(); last = now }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [invalidate])

  const solidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0e0610', roughness: 1.0, metalness: 0.0, flatShading: true,
    emissive: new THREE.Color('#1a0408'), emissiveIntensity: 1.0,
  }), [])

  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.92,
  }), [])

  const normScene = useMemo(() => {
    const root = scene.clone(true)
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3(), center = new THREE.Vector3()
    box.getSize(size); box.getCenter(center)
    const scale = 2.8 / Math.max(size.x, size.y, size.z)
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
        colors[v*3] = 1.0; colors[v*3+1] = t * 0.95 + 0.05; colors[v*3+2] = t * 0.95 + 0.05
      }
      edges.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      child.add(new THREE.LineSegments(edges, edgeMat))
    })
    return root
  }, [scene, solidMat, edgeMat])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const p = heartbeatPulse(t)
    groupRef.current.rotation.y = Math.sin(t * 0.20) * 0.22 + 0.18
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.06 + 0.08
    groupRef.current.scale.setScalar(p)
  })

  return (
    <>
      <directionalLight position={[3, 8, 2]}  intensity={12.0} color="#ffffff" />
      <directionalLight position={[0, 0, 6]}  intensity={5.0}  color="#ffdddd" />
      <directionalLight position={[-2, 2, 4]} intensity={3.0}  color="#cc8899" />
      <pointLight position={[0, -5, -1]} intensity={24} color="#cc1122" distance={20} />
      <ambientLight intensity={0.20} color="#200810" />
      <group ref={groupRef} rotation={[0.05, 0.20, 0]} position={[0, -0.05, 0]}>
        <primitive object={normScene} />
      </group>
    </>
  )
}

render(<CardioScene />)
