import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sphere, Cylinder } from '@react-three/drei'

// Placeholder scene — replace geometry with actual 3D assets
export default function Gethsemane() {
  const moonRef = useRef()

  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.05) * 20
    }
  })

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a0a" />
      </mesh>

      {/* Olive trees (placeholder cylinders) */}
      {[[-2, 0, -3], [2, 0, -4], [-3, 0, -6], [3, 0, -5]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <Cylinder args={[0.15, 0.2, 2]} castShadow>
            <meshStandardMaterial color="#4a3728" />
          </Cylinder>
          <Sphere args={[1]} position={[0, 1.5, 0]} castShadow>
            <meshStandardMaterial color="#1a3a1a" />
          </Sphere>
        </group>
      ))}

      {/* Moon */}
      <Sphere ref={moonRef} args={[1.5]} position={[15, 18, -30]}>
        <meshStandardMaterial color="#e8e0c0" emissive="#c8b870" emissiveIntensity={0.4} />
      </Sphere>

      {/* Scene label */}
      <Text
        position={[0, 3, -5]}
        fontSize={0.4}
        color="#d4b483"
        anchorX="center"
      >
        The Garden of Gethsemane
      </Text>
    </>
  )
}
