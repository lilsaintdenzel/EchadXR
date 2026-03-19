import { Text, Box } from '@react-three/drei'

// Placeholder scene — replace geometry with actual 3D assets
export default function UpperRoom() {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>

      {/* Walls */}
      <Box args={[20, 6, 0.2]} position={[0, 3, -10]} receiveShadow>
        <meshStandardMaterial color="#5a4a3a" />
      </Box>
      <Box args={[0.2, 6, 20]} position={[-10, 3, 0]} receiveShadow>
        <meshStandardMaterial color="#5a4a3a" />
      </Box>
      <Box args={[0.2, 6, 20]} position={[10, 3, 0]} receiveShadow>
        <meshStandardMaterial color="#5a4a3a" />
      </Box>

      {/* Table */}
      <Box args={[8, 0.2, 2]} position={[0, 0.9, 0]} castShadow>
        <meshStandardMaterial color="#6b4f2a" />
      </Box>
      <Box args={[0.2, 0.9, 0.2]} position={[-3.5, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#4a3520" />
      </Box>
      <Box args={[0.2, 0.9, 0.2]} position={[3.5, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#4a3520" />
      </Box>

      {/* Scene label */}
      <Text
        position={[0, 4, -9]}
        fontSize={0.4}
        color="#d4b483"
        anchorX="center"
      >
        The Upper Room
      </Text>
    </>
  )
}
